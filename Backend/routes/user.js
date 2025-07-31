const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getProfile, updateProfile } = require("../controllers/userController");

// Get logged-in user profile
router.get("/profile", auth, getProfile);

// Update logged-in user profile
router.put("/profile", auth, updateProfile);

module.exports = router;
