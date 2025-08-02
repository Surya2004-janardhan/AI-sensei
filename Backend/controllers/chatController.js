const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

// Helper: get the other user in a message
function getOtherUserId(msg, currentUserId) {
  return msg.from.equals(currentUserId) ? msg.to : msg.from;
}

// Get all conversations of the current user (with last message per conversation)
exports.getAllConversations = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user.id);

    // Fetch messages involving current user, sorted descending by date
    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .sort({ sentAt: -1 })
      .populate("from", "name avatar _id")
      .populate("to", "name avatar _id")
      .exec();

    // Group messages by conversation partner (other user)
    const conversationsMap = new Map();
    for (const msg of messages) {
      const otherUserId = getOtherUserId(msg, userId);

      if (!conversationsMap.has(otherUserId.toString())) {
        conversationsMap.set(otherUserId.toString(), {
          lastMessage: msg,
          user: msg.from._id.equals(userId) ? msg.to : msg.from,
        });
      }
    }

    // Convert map values to array
    const conversations = Array.from(conversationsMap.values());

    res.json(conversations);
  } catch (err) {
    console.error("Error in getAllConversations:", err);
    res.status(500).json({ error: "Failed to get conversations" });
  }
};

// Get conversation messages with a specific user (pagination supported)
exports.getConversationMessages = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user.id);
    const otherUserId = mongoose.Types.ObjectId(req.params.userId);

    // For pagination
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;

    const messages = await Message.find({
      $or: [
        { from: userId, to: otherUserId },
        { from: otherUserId, to: userId },
      ],
    })
      .sort({ sentAt: 1 }) // Oldest to newest
      .skip(skip)
      .limit(limit)
      .exec();

    res.json(messages);
  } catch (err) {
    console.error("Error in getConversationMessages:", err);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

// Send message to a user and emit via socket
exports.sendMessage = async (req, res) => {
  try {
    const fromId = mongoose.Types.ObjectId(req.user.id);
    const toId = mongoose.Types.ObjectId(req.params.userId);
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Message text cannot be empty" });
    }

    // Save message
    const message = await Message.create({
      from: fromId,
      to: toId,
      text: text.trim(),
      sentAt: new Date(),
    });

    // Populate message sender and receiver info (for client convenience)
    await message.populate("from", "name avatar _id");
    await message.populate("to", "name avatar _id");

    // Emit the new message via socket - ensure your socket code listens properly
    req.app.get("io").to(toId.toString()).emit("receiveMessage", message);
    req.app.get("io").to(fromId.toString()).emit("receiveMessage", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Mark a message as read
exports.markMessageRead = async (req, res) => {
  try {
    const msgId = req.params.messageId;
    const userId = req.user.id;

    const message = await Message.findById(msgId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // Only the recipient can mark message as read
    if (message.to.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    message.read = true;
    await message.save();

    res.json({ success: true, message });
  } catch (err) {
    console.error("Error in markMessageRead:", err);
    res.status(500).json({ error: "Failed to mark message read" });
  }
};

// Optional: Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const msgId = req.params.messageId;
    const userId = req.user.id;

    const message = await Message.findById(msgId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // Only sender can delete the message or add your own logic here
    if (message.from.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await message.remove();

    res.json({ success: true });
  } catch (err) {
    console.error("Error in deleteMessage:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
