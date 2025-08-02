const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },

  // JLPT Level with enum and default value
  jlptLevel: {
    type: String,
    enum: ["N5", "N4", "N3", "N2", "N1"],
    default: "N5",
  },

  // User avatar URL (optional)
  avatar: { type: String, default: "" },

  // List of accepted connection user IDs (friends)
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Incoming friend requests user IDs
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
