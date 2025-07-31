const Quiz = require("../models/Quiz");

exports.getQuiz = async (req, res) => {
  const quiz = await Quiz.findOne({ level: req.params.level });
  res.json(quiz);
};

exports.submitQuiz = async (req, res) => {
  // Evaluate quiz, store user result
  res.json({ score: 5 }); // Example
};
