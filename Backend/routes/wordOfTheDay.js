// routes/wordOfTheDayRoutes.js
const express = require("express");
const router = express.Router();
const wordOfTheDayController = require("../controllers/wordOfTheDayController");

router.get("/daily", wordOfTheDayController.getWordOfTheDay);

module.exports = router;
