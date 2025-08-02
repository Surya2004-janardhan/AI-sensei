const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const messagesCtrl = require("../controllers/messagesController");

// Latest conversations for sidebar
router.get("/latest", auth, messagesCtrl.getLatestChats);

// All messages between two users
router.get("/:userId", auth, messagesCtrl.getChatWithUser);

// Send a new message
router.post("/:userId", auth, messagesCtrl.sendMessage);

module.exports = router;
