const Message = require("../models/Message");

// Get latest chats per contact (WhatsApp-style chat sidebar, top 3)
exports.getLatestChats = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ from: req.user.id }, { to: req.user.id }],
    })
      .sort({ sentAt: -1 })
      .populate("from to", "name avatar _id")
      .exec();

    const grouped = {};
    messages.forEach((msg) => {
      const otherId = msg.from._id.equals(req.user.id)
        ? msg.to._id
        : msg.from._id;
      if (!grouped[otherId]) grouped[otherId] = msg;
    });

    const latest = Object.values(grouped)
      .sort((a, b) => b.sentAt - a.sentAt)
      .slice(0, 3);

    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest messages" });
  }
};

// Get message thread with a specific user
exports.getChatWithUser = async (req, res) => {
  try {
    const otherId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { from: req.user.id, to: otherId },
        { from: otherId, to: req.user.id },
      ],
    })
      .sort({ sentAt: 1 })
      .exec();

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim())
    return res.status(400).json({ error: "Message text is required" });

  try {
    const message = await Message.create({
      from: req.user.id,
      to: req.params.userId,
      text: text.trim(),
    });
    // Optionally emit socket event here
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
};
