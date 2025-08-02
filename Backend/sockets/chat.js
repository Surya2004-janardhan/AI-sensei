const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // When client sends their userId to join their personal room
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Listen to messages sent from client
    socket.on("sendMessage", async ({ from, to, text }) => {
      try {
        // Save message to DB
        const message = await Message.create({
          from,
          to,
          text,
          sentAt: new Date(),
        });

        // Emit message to sender and receiver rooms for real-time update
        io.to(from).emit("receiveMessage", message);
        io.to(to).emit("receiveMessage", message);
      } catch (err) {
        console.error("Error saving/sending message:", err);
      }
    });

    // You can also add handlers like typing indicators or presence here

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
