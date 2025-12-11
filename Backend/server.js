require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const compression = require("compression");

const connectDB = require("./config/db");

// Create Express app
const app = express();
const server = http.createServer(app);

// Enable compression for responses
app.use(compression());

// Basic middleware setup with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Disable x-powered-by header for security
app.disable("x-powered-by");

// Simple CORS setup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header("Access-Control-Expose-Headers", "x-auth-token");

  // Handle OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  },
});

app.set("io", io); // Allow controllers access to io instance

// Load socket handler
const chatSocket = require("./sockets/chat");
chatSocket(io);

// Connect to MongoDB
connectDB();

// Routes
// Import route files after middleware setup
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const aiRoutes = require("./routes/ai");
const dictionaryRoutes = require("./routes/dictionary");
const roadmapRoutes = require("./routes/roadmap");
const quizRoutes = require("./routes/quiz");
const historyRoutes = require("./routes/history");
const messageRoutes = require("./routes/messages");
const chatRoutes = require("./routes/chat");
const wordOfTheDayRoutes = require("./routes/wordOfTheDay");

// Apply routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dictionary", dictionaryRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/wordoftheday", wordOfTheDayRoutes);

// Basic root route to check server
app.get("/", (req, res) => {
  res.set("Cache-Control", "public, max-age=300"); // 5 minutes
  res.send("Welcome to AI-Sensei Backend API");
});

// Catch 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app; // For testing use
