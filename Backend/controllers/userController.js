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

// Get all users (except current user)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("name avatar jlptLevel email")
      .sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("connections", "name avatar jlptLevel email")
      .select("connections");
    res.json(user.connections);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Send friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    // Check if user exists
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if request already sent
    if (targetUser.friendRequests.includes(req.user.id)) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    // Check if already friends
    if (targetUser.connections.includes(req.user.id)) {
      return res.status(400).json({ msg: "Already friends with this user" });
    }

    // Add friend request
    targetUser.friendRequests.push(req.user.id);
    await targetUser.save();

    // If there's a socket connection, emit notification
    const io = req.app.get("io");
    if (io) {
      io.to(req.params.userId).emit("friendRequest", {
        userId: req.user.id,
        type: "new_request",
      });
    }

    res.json({ msg: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Accept friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const requesterUser = await User.findById(req.params.userId);
    if (!requesterUser) {
      return res.status(404).json({ msg: "Requesting user not found" });
    }

    // Check if request exists
    if (!currentUser.friendRequests.includes(req.params.userId)) {
      return res.status(400).json({ msg: "No friend request from this user" });
    }

    // Add to connections (both users)
    currentUser.connections.push(req.params.userId);
    requesterUser.connections.push(req.user.id);

    // Remove from friend requests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== req.params.userId
    );

    await currentUser.save();
    await requesterUser.save();

    // Notify via socket
    const io = req.app.get("io");
    if (io) {
      io.to(req.params.userId).emit("friendRequestAccepted", {
        userId: req.user.id,
        type: "request_accepted",
      });
    }

    res.json({ msg: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Reject friend request
exports.rejectFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Remove from friend requests
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== req.params.userId
    );

    await user.save();
    res.json({ msg: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get pending friend requests
exports.getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("friendRequests", "name avatar jlptLevel email")
      .select("friendRequests");

    res.json(user.friendRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Remove a friend
exports.removeFriend = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const friendUser = await User.findById(req.params.userId);
    if (!friendUser) {
      return res.status(404).json({ msg: "Friend user not found" });
    }

    // Remove from connections (both users)
    currentUser.connections = currentUser.connections.filter(
      (id) => id.toString() !== req.params.userId
    );

    friendUser.connections = friendUser.connections.filter(
      (id) => id.toString() !== req.user.id
    );

    await currentUser.save();
    await friendUser.save();

    res.json({ msg: "Friend removed" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get notification count (unread friend requests)
exports.getNotificationsCount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("friendRequests");
    const count = user.friendRequests.length;

    res.json({ count });
  } catch (error) {
    console.error("Error getting notification count:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
