const { callAIGPT } = require("../services/aiService");

exports.aiTeacher = async (req, res) => {
  const { question } = req.body;
  // const answer = await callAIGPT(question, "teacher");
  const answer = "for now dummy answer from ai"
  res.json({ answer });
};

exports.aiDoubtSolver = async (req, res) => {
  const { doubt } = req.body;
  const answer = "for now dummy answer from ai";
  // const answer = await callAIGPT(doubt, "doubt-solver");
  res.json({ answer });
};
