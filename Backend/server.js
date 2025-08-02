require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Route files
const wordOfTheDayRoutes = require("./routes/wordOfTheDay");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const aiRoutes = require("./routes/ai");
const dictionaryRoutes = require("./routes/dictionary");
const roadmapRoutes = require("./routes/roadmap");
const quizRoutes = require("./routes/quiz");
const historyRoutes = require("./routes/history");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: { origin: "*" }, // Lock down in production
});

app.set("io", io); // Allow controllers access to io instance

const chatSocket = require("./sockets/chat");
chatSocket(io);
// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dictionary", dictionaryRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", require("./routes/messages"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/wordoftheday", wordOfTheDayRoutes);

// Basic root route to check server
app.get("/", (req, res) => {
  res.send("Welcome to AI-Sensei Backend API");
});

// Global error handler middleware (optional example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app; // For testing use
