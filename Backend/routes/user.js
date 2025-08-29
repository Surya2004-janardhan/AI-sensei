const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  removeFriend,
  getNotificationsCount,
} = require("../controllers/userController");

// Get logged-in user profile
router.get("/profile", auth, getProfile);

// Update logged-in user profile
router.put("/profile", auth, updateProfile);

// Get all users
router.get("/all", auth, getAllUsers);

// Friends and connections
router.get("/friends", auth, getFriends);
router.post("/friends/request/:userId", auth, sendFriendRequest);
router.put("/friends/accept/:userId", auth, acceptFriendRequest);
router.delete("/friends/reject/:userId", auth, rejectFriendRequest);
router.get("/friends/requests", auth, getPendingRequests);
router.delete("/friends/:userId", auth, removeFriend);

// Get user by ID (this should be after specific routes)
router.get("/:id", auth, getUserById);

// Notifications
router.get("/notifications/count", auth, getNotificationsCount);

module.exports = router;
