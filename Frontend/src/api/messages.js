import axiosInstance from "./axiosInstance";

// Get top 3 latest conversations
export const getLatestMessages = () => axiosInstance.get("/messages/latest");

// Get all messages between logged-in user and another user
export const getChatWithUser = (userId) =>
  axiosInstance.get(`/messages/${userId}`);

// Send a new message to a user
export const sendMessage = (userId, text) =>
  axiosInstance.post(`/messages/${userId}`, { text });
