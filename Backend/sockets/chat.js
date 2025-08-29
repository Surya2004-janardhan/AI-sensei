const Message = require("../models/Message");
const User = require("../models/User");

module.exports = (io) => {
  // Track online users
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // When client sends their userId to join their personal room
    socket.on("joinRoom", async (userId) => {
      if (userId) {
        socket.join(userId);
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} joined room`);

        // Broadcast user online status to others
        socket.broadcast.emit("userOnlineStatus", { userId, status: "online" });

        // Send the current online users list to the newly connected user
        const onlineUserIds = [...onlineUsers.keys()];
        socket.emit("onlineUsers", onlineUserIds);

        // Get unread notifications count for this user
        try {
          const user = await User.findById(userId).select("friendRequests");
          if (user) {
            // Send notification count to the user
            socket.emit("notificationCount", {
              count: user.friendRequests.length,
            });
          }
        } catch (err) {
          console.error("Error fetching notification count:", err);
        }
      }
    });

    // Listen to messages sent from client (direct socket method - alternative to REST API)
    socket.on("sendMessage", async ({ from, to, text }) => {
      try {
        // Save message to DB
        const message = await Message.create({
          from,
          to,
          text,
          sentAt: new Date(),
        });

        // Populate user info
        const populatedMessage = await Message.findById(message._id)
          .populate("from to", "name avatar _id")
          .lean();

        // Emit message to sender and receiver rooms for real-time update
        io.to(from).emit("receiveMessage", populatedMessage);
        io.to(to).emit("receiveMessage", populatedMessage);
      } catch (err) {
        console.error("Error saving/sending message:", err);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing", ({ from, to }) => {
      socket.to(to).emit("userTyping", { userId: from, isTyping: true });
    });

    socket.on("stopTyping", ({ from, to }) => {
      socket.to(to).emit("userTyping", { userId: from, isTyping: false });
    });

    // Mark messages as read
    socket.on("markAsRead", async ({ messageIds, userId }) => {
      try {
        await Message.updateMany(
          { _id: { $in: messageIds } },
          { $set: { read: true } }
        );

        // Notify the sender that their messages have been read
        io.to(userId).emit("messagesRead", { messageIds });
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    });

    socket.on("disconnect", () => {
      // Find and remove user from online users
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          // Broadcast user offline status
          socket.broadcast.emit("userOnlineStatus", {
            userId,
            status: "offline",
          });
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
};
