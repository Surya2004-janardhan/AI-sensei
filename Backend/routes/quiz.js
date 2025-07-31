const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getQuiz, submitQuiz } = require("../controllers/quizController");

router.get("/:level", auth, getQuiz);
router.post("/submit", auth, submitQuiz);

module.exports = router;
