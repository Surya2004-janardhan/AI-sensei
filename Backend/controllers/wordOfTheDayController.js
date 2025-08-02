// controllers/wordOfTheDayController.js
const WordOfTheDay = require("../models/WordOfTheDay");

function getDailyIndex() {
  const startDate = new Date("2024-01-01"); // Fixed reference date
  const today = new Date();
  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays % 50; // index 0 to 49
}

exports.getWordOfTheDay = async (req, res) => {
  try {
    const doc = await WordOfTheDay.findOne({});
    if (!doc) {
      return res.status(404).json({ message: "WordOfTheDay data not found" });
    }
    const index = getDailyIndex();
    const wordOfTheDay = doc.words[index];
    const sentenceOfTheDay = doc.sentences[index];

    res.json({
      wordOfTheDay,
      sentenceOfTheDay,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
