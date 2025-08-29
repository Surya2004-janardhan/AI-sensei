import axiosInstance from "./axiosInstance";

// Get all users
export const getAllUsers = async () => {
  try {
    console.log("Making API call to get all users");
    console.log(
      "API URL:",
      `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
      }/user/all`
    );
    const response = await axiosInstance.get("/user/all");
    console.log("getAllUsers response:", response);
    return response;
  } catch (error) {
    console.error("getAllUsers API error:", error);
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
    }
    throw error;
  }
};

// Get user profile by ID
export const getUserById = (userId) => axiosInstance.get(`/user/${userId}`);

// Get all friends
export const getFriends = () => axiosInstance.get("/user/friends");

// Send friend request
export const sendFriendRequest = async (userId) => {
  try {
    // Log the request being made
    console.log(`Making friend request to user ID: ${userId}`);
    console.log(
      `API URL: ${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
      }/user/friends/request/${userId}`
    );

    // Make the request
    const response = await axiosInstance.post(
      `/user/friends/request/${userId}`
    );

    // Log success
    console.log("Friend request API response:", response);
    return response;
  } catch (error) {
    // Log detailed error
    console.error("Friend request API error:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    // Re-throw for the caller to handle
    throw error;
  }
};

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
