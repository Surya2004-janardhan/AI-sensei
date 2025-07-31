const User = require("../models/User");

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, jlptLevel } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = name || user.name;
    user.jlptLevel = jlptLevel || user.jlptLevel;

    await user.save();
    res.json({ msg: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
