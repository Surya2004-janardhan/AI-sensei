const Message = require("../models/Message");

// Cache for latest chats (5 minutes TTL)
const chatsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clear cache entry for a user
const clearChatCache = (userId) => {
  chatsCache.delete(userId);
};

// Get latest chats per contact (all conversations)
exports.getLatestChats = async (req, res) => {
  try {
    // Check cache first
    const cacheKey = req.user.id;
    const cached = chatsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    const messages = await Message.find({
      $or: [{ from: req.user.id }, { to: req.user.id }],
    })
      .sort({ sentAt: -1 })
      .populate("from to", "name avatar _id")
      .exec();

    console.log(`Found ${messages.length} messages for user ${req.user.id}`);

    // If no messages, return empty array early
    if (messages.length === 0) {
      return res.json([]);
    }

    const grouped = {};
    messages.forEach((msg) => {
      const otherId = msg.from._id.equals(req.user.id)
        ? msg.to._id.toString()
        : msg.from._id.toString();
      if (!grouped[otherId]) grouped[otherId] = msg;
    });

    // Format response with otherUser, lastMessage, and unreadCount
    const formattedChats = await Promise.all(
      Object.values(grouped).map(async (msg) => {
        const otherId = msg.from._id.equals(req.user.id)
          ? msg.to._id
          : msg.from._id;
        const otherUser = msg.from._id.equals(req.user.id) ? msg.to : msg.from;

        // Count unread messages from this user
        const unreadCount = await Message.countDocuments({
          from: otherId,
          to: req.user.id,
          read: false,
        });

        return {
          otherUser,
          lastMessage: {
            _id: msg._id,
            text: msg.text,
            from: msg.from._id,
            to: msg.to._id,
            sentAt: msg.sentAt,
            read: msg.read,
          },
          unreadCount,
        };
      })
    );

    const sortedChats = formattedChats.sort(
      (a, b) => new Date(b.lastMessage.sentAt) - new Date(a.lastMessage.sentAt)
    );

    // Cache the result
    chatsCache.set(cacheKey, {
      data: sortedChats,
      timestamp: Date.now(),
    });

    res.json(sortedChats);
  } catch (err) {
    console.error("Error fetching latest chats:", err);
    res.status(500).json({ error: "Failed to fetch latest messages" });
  }
};

// Export cache clear function for use in sendMessage
exports.clearChatCache = clearChatCache;

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
      .populate("from to", "name avatar _id")
      .exec();

    // Mark messages as read
    await Message.updateMany(
      { from: otherId, to: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error("Error getting chat:", err);
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

    // Get the populated message for better client-side rendering
    const populatedMessage = await Message.findById(message._id)
      .populate("from to", "name avatar _id")
      .lean();

    // Clear cache for both users
    clearChatCache(req.user.id);
    clearChatCache(req.params.userId);

    // Emit socket event using the io instance
    const io = req.app.get("io");
    if (io) {
      io.to(req.user.id).emit("receiveMessage", populatedMessage);
      io.to(req.params.userId).emit("receiveMessage", populatedMessage);
    }

    res.json(populatedMessage);
  } catch (err) {
    console.error("Message sending error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
