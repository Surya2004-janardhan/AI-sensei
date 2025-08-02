const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const chatController = require("../controllers/chatController");

// Get all conversations (grouped by user) for current signed-in user
router.get("/conversations", auth, chatController.getAllConversations);

// Get messages for a conversation with a particular user (optionally paginated)
router.get(
  "/conversations/:userId",
  auth,
  chatController.getConversationMessages
);

// Send a message to a user
router.post("/messages/:userId", auth, chatController.sendMessage);

// Optional: Mark message(s) as read
router.patch("/messages/:messageId/read", auth, chatController.markMessageRead);

// Optional: Delete a message
router.delete("/messages/:messageId", auth, chatController.deleteMessage);

module.exports = router;
