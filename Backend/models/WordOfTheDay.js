const mongoose = require("mongoose");

const WordSchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    meaning: { type: String, required: true },
  },
  { _id: false }
);

const SentenceSchema = new mongoose.Schema(
  {
    sentence: { type: String, required: true },
    meaning: { type: String, required: true },
  },
  { _id: false }
);

const WordOfTheDaySchema = new mongoose.Schema({
  words: {
    type: [WordSchema],
    required: true,
    // Removed validator for length here
  },
  sentences: {
    type: [SentenceSchema],
    required: true,
    // Removed validator for length here
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WordOfTheDay", WordOfTheDaySchema);
