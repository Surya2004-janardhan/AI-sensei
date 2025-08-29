import axiosInstance from "./axiosInstance";

// Get all users
export const getAllUsers = () => axiosInstance.get("/user/all");

// Get user profile by ID
export const getUserById = (userId) => axiosInstance.get(`/user/${userId}`);

// Get all friends
export const getFriends = () => axiosInstance.get("/user/friends");

// Send friend request
export const sendFriendRequest = (userId) =>
  axiosInstance.post(`/user/friends/request/${userId}`);

// Accept friend request
export const acceptFriendRequest = (userId) =>
  axiosInstance.put(`/user/friends/accept/${userId}`);

// Reject friend request
export const rejectFriendRequest = (userId) =>
  axiosInstance.delete(`/user/friends/reject/${userId}`);

// Get pending friend requests
export const getPendingRequests = () =>
  axiosInstance.get("/user/friends/requests");

// Remove a friend
export const removeFriend = (userId) =>
  axiosInstance.delete(`/user/friends/${userId}`);

// Get unread notifications count
export const getNotificationsCount = () =>
  axiosInstance.get("/user/notifications/count");

// Mark notifications as read
export const markNotificationsAsRead = (type) =>
  axiosInstance.put("/user/notifications/read", { type });
