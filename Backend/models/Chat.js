// chatSchema.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: String, // track individual users
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  embedding: { type: [Number], default: [] }, // optional for retrieval
  createdAt: { type: Date, default: Date.now },
});

export const ChatMessage = mongoose.model("ChatMessage", messageSchema);
