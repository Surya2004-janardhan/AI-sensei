import axiosInstance from "./axiosInstance";

// Get top 3 latest conversations
export const getLatestChats = () => axiosInstance.get("/users/latest");

// Get all messages between logged-in user and another user
export const getMessagesByUser = (userId) =>
  axiosInstance.get(`/users/${userId}`);

// Send a new message to a user
export const sendMessage = (userId, text) =>
  axiosInstance.post(`/messages/${userId}`, { text });
