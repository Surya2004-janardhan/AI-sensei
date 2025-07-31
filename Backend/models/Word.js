const mongoose = require("mongoose");
const WordSchema = new mongoose.Schema({
  word: String,
  reading: String,
  meaning: String,
  level: { type: String, enum: ["N5", "N4", "N3", "N2", "N1"] },
});
module.exports = mongoose.model("Word", WordSchema);
