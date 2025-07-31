const mongoose = require("mongoose");
const InteractionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question: String,
  answer: String,
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Interaction", InteractionSchema);
