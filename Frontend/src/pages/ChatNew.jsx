import React, { useEffect, useState, useRef, useContext } from "react";
import * as messagesAPI from "../api/messages";
import * as userAPI from "../api/user";
import { AuthContext } from "../contexts/AuthContext";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
// Using Tailwind CSS instead of custom CSS

export default function Chat() {
  // Messages & chat state
  const [latestChats, setLatestChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // User state
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  // Users, friends and requests state
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("chats"); // chats, allUsers, friends, requests
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize socket
  useEffect(() => {
    const socketInstance = io(
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    );
    setSocket(socketInstance);

    // Log connection status
    socketInstance.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  // Connect socket when user is available
  useEffect(() => {
    if (socket && user) {
      socket.emit("joinRoom", user._id);

      // Listen for online users
      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Listen for user online/offline status
      socket.on("userOnlineStatus", ({ userId, status }) => {
        if (status === "online") {
          setOnlineUsers((prev) => [...prev, userId]);
        } else {
          setOnlineUsers((prev) => prev.filter((id) => id !== userId));
        }
      });

      // Listen for incoming messages
      socket.on("receiveMessage", (message) => {
        if (
          selectedUser &&
          ((message.from._id === selectedUser._id &&
            message.to._id === user._id) ||
            (message.to._id === selectedUser._id &&
              message.from._id === user._id))
        ) {
          // Add message to current chat
          setChatMessages((prev) => [...prev, message]);

          // Mark as read if it's from the selected user
          if (message.from._id === selectedUser._id) {
            socket.emit("markAsRead", {
              messageIds: [message._id],
              userId: message.from._id,
            });
          }
        } else if (message.from._id !== user._id) {
          // Show notification for new message
          toast.success(`New message from ${message.from.name}`);

          // Update latest chats
          fetchLatestChats();
        }
      });

      // Listen for typing indicator
      socket.on("userTyping", ({ userId, isTyping }) => {
        if (selectedUser && userId === selectedUser._id) {
          setIsTyping(isTyping);
        }
      });

      // Listen for read receipts
      socket.on("messagesRead", ({ messageIds }) => {
        setChatMessages((prevMessages) =>
          prevMessages.map((message) =>
            messageIds.includes(message._id)
              ? { ...message, read: true }
              : message
          )
        );
      });

      // Listen for friend requests
      socket.on("friendRequest", (data) => {
        console.log(data);
        toast.success("You have a new friend request!");
        fetchFriendRequests();
        updateNotificationCount();
      });

      // Listen for accepted friend requests
      socket.on("friendRequestAccepted", (data) => {
        console.log(data);
        toast.success("Your friend request was accepted!");
        fetchFriends();
      });

      // Listen for notification count updates
      socket.on("notificationCount", ({ count }) => {
        setNotificationCount(count);
      });

      return () => {
        socket.off("onlineUsers");
        socket.off("userOnlineStatus");
        socket.off("receiveMessage");
        socket.off("userTyping");
        socket.off("messagesRead");
        socket.off("friendRequest");
        socket.off("friendRequestAccepted");
        socket.off("notificationCount");
      };
    }
  }, [socket, user, selectedUser]);

  // Fetch latest chats
  const fetchLatestChats = async () => {
    try {
      const response = await messagesAPI.getLatestChats();
      setLatestChats(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setError("Failed to fetch chats");
      setLoading(false);
    }
  };

  // Fetch chat messages with a specific user
  const fetchChatMessages = async (userId) => {
    setChatLoading(true);
    try {
      const response = await messagesAPI.getMessagesByUser(userId);
      setChatMessages(response.data);

      // Mark unread messages as read
      const unreadMessages = response.data.filter(
        (msg) => !msg.read && msg.from._id === userId
      );

      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg) => msg._id);
        socket.emit("markAsRead", {
          messageIds,
          userId,
        });

        // Update chat list to remove unread indicators
        fetchLatestChats();
      }

      setChatLoading(false);

      // Scroll to bottom
      if (scrollRef.current) {
        setTimeout(() => {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
      setChatLoading(false);
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setAllUsers(response.data.filter((u) => u._id !== user._id));
    } catch (error) {
      console.error("Failed to fetch all users:", error);
    }
  };

  // Fetch friends
  const fetchFriends = async () => {
    try {
      const response = await userAPI.getFriends();
      setFriends(response.data);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  // Fetch friend requests
  const fetchFriendRequests = async () => {
    try {
      const response = await userAPI.getFriendRequests();
      setFriendRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch friend requests:", error);
    }
  };

  // Update notification count
  const updateNotificationCount = async () => {
    try {
      const response = await userAPI.getNotificationCount();
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
    }
  };

  // Handle selecting a user to chat with
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchChatMessages(user._id);
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!chatInput.trim() || !selectedUser) return;

    try {
      const response = await messagesAPI.sendMessage({
        to: selectedUser._id,
        text: chatInput,
      });

      // Add message to chat
      setChatMessages((prev) => [...prev, response.data]);

      // Reset input
      setChatInput("");

      // Update latest chats
      fetchLatestChats();

      // Scroll to bottom
      if (scrollRef.current) {
        setTimeout(() => {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }

      // Clear typing indicator
      socket.emit("typing", {
        to: selectedUser._id,
        isTyping: false,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e) => {
    setChatInput(e.target.value);

    if (selectedUser && socket) {
      // Clear existing typing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Send typing indicator
      socket.emit("typing", {
        to: selectedUser._id,
        isTyping: true,
      });

      // Set timeout to stop typing indicator
      const timeout = setTimeout(() => {
        socket.emit("typing", {
          to: selectedUser._id,
          isTyping: false,
        });
      }, 2000);

      setTypingTimeout(timeout);
    }
  };

  // Send friend request
  const sendFriendRequest = async (userId) => {
    try {
      await userAPI.sendFriendRequest(userId);
      toast.success("Friend request sent!");
    } catch (error) {
      console.error("Failed to send friend request:", error);
      toast.error("Failed to send friend request");
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (userId) => {
    try {
      await userAPI.acceptFriendRequest(userId);
      toast.success("Friend request accepted!");
      fetchFriendRequests();
      fetchFriends();
      updateNotificationCount();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      toast.error("Failed to accept friend request");
    }
  };

  // Reject friend request
  const rejectFriendRequest = async (userId) => {
    try {
      await userAPI.rejectFriendRequest(userId);
      toast.success("Friend request rejected");
      fetchFriendRequests();
      updateNotificationCount();
    } catch (error) {
      console.error("Failed to reject friend request:", error);
      toast.error("Failed to reject friend request");
    }
  };

  // Check if a user is online
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for message groups
  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = formatMessageDate(message.sentAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchLatestChats();
      updateNotificationCount();
    }
  }, [user]);

  // Filter users based on search query
  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading chats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="border-b border-gray-200 flex">
          <button
            className={`py-3 px-4 flex-1 text-center ${
              activeTab === "chats" ? "bg-gray-100 text-black" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </button>
          <button
            className={`py-3 px-4 flex-1 text-center ${
              activeTab === "allUsers"
                ? "bg-gray-100 text-black"
                : "text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("allUsers");
              fetchAllUsers();
            }}
          >
            All Users
          </button>
          <button
            className={`py-3 px-4 flex-1 text-center ${
              activeTab === "friends"
                ? "bg-gray-100 text-black"
                : "text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("friends");
              fetchFriends();
            }}
          >
            Friends
          </button>
          <button
            className={`py-3 px-4 flex-1 text-center relative ${
              activeTab === "requests"
                ? "bg-gray-100 text-black"
                : "text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("requests");
              fetchFriendRequests();
            }}
          >
            Requests
            {notificationCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-black text-white text-xs">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {(notificationCount > 0 ||
          latestChats.reduce(
            (count, chat) => count + (chat.unreadCount || 0),
            0
          ) > 0) && (
          <div className="bg-gray-100 p-3 text-sm">
            {notificationCount > 0 && (
              <div className="flex items-center mb-1">
                <i className="fa fa-bell mr-2"></i>
                <span>
                  {notificationCount} new friend{" "}
                  {notificationCount === 1 ? "request" : "requests"}
                </span>
              </div>
            )}
            {latestChats.reduce(
              (count, chat) => count + (chat.unreadCount || 0),
              0
            ) > 0 && (
              <div className="flex items-center">
                <i className="fa fa-envelope mr-2"></i>
                <span>
                  {latestChats.reduce(
                    (count, chat) => count + (chat.unreadCount || 0),
                    0
                  )}{" "}
                  unread{" "}
                  {latestChats.reduce(
                    (count, chat) => count + (chat.unreadCount || 0),
                    0
                  ) === 1
                    ? "message"
                    : "messages"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Search bar - visible only in All Users tab */}
        {activeTab === "allUsers" && (
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Display content based on active tab */}
        <div className="flex-1 overflow-y-auto">
          {/* Chats Tab */}
          {activeTab === "chats" && (
            <div className="p-3">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Your Conversations</h3>
                <p className="text-sm text-gray-600">
                  Chat with friends and language partners
                </p>
              </div>

              {latestChats.length === 0 ? (
                <div className="text-center py-10">
                  <p className="mb-2">No conversations yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Add friends to start chatting!
                  </p>
                  <button
                    className="px-4 py-2 bg-black text-white rounded-md"
                    onClick={() => setActiveTab("allUsers")}
                  >
                    Find Users
                  </button>
                </div>
              ) : (
                <>
                  {latestChats.some((chat) => chat.unreadCount > 0) && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold mb-2 text-gray-500">
                        Unread Messages
                      </div>
                      {latestChats
                        .filter((chat) => chat.unreadCount > 0)
                        .map((chat) => {
                          const chatUser = chat.otherUser;
                          const isOnline = isUserOnline(chatUser._id);

                          return (
                            <div
                              key={chatUser._id}
                              className={`p-3 mb-1 rounded cursor-pointer flex items-center ${
                                selectedUser?._id === chatUser._id
                                  ? "bg-gray-200"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => handleSelectUser(chatUser)}
                            >
                              <div className="relative mr-3">
                                {chatUser.avatar ? (
                                  <img
                                    src={chatUser.avatar}
                                    alt={chatUser.name}
                                    className="w-10 h-10 rounded-full"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    {chatUser.name?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span
                                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    isOnline ? "bg-green-500" : "bg-gray-400"
                                  }`}
                                ></span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold">
                                  {chatUser.name}
                                </div>
                                <div className="text-sm text-gray-600 truncate">
                                  {chat.lastMessage ? (
                                    <>
                                      {chat.lastMessage.from === user._id && (
                                        <span>You: </span>
                                      )}
                                      {chat.lastMessage.text}
                                    </>
                                  ) : (
                                    <span className="italic">
                                      No messages yet
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end ml-2">
                                {chat.lastMessage && (
                                  <div className="text-xs text-gray-500">
                                    {formatMessageTime(chat.lastMessage.sentAt)}
                                  </div>
                                )}
                                <div className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-1">
                                  {chat.unreadCount}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-semibold mb-2 text-gray-500">
                      All Conversations
                    </div>
                    {latestChats.map((chat) => {
                      const chatUser = chat.otherUser;
                      const isOnline = isUserOnline(chatUser._id);

                      return (
                        <div
                          key={chatUser._id}
                          className={`p-3 mb-1 rounded cursor-pointer flex items-center ${
                            selectedUser?._id === chatUser._id
                              ? "bg-gray-200"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleSelectUser(chatUser)}
                        >
                          <div className="relative mr-3">
                            {chatUser.avatar ? (
                              <img
                                src={chatUser.avatar}
                                alt={chatUser.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {chatUser.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                isOnline ? "bg-green-500" : "bg-gray-400"
                              }`}
                            ></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold">{chatUser.name}</div>
                            <div className="text-sm text-gray-600 truncate">
                              {chat.lastMessage ? (
                                <>
                                  {chat.lastMessage.from === user._id && (
                                    <span>You: </span>
                                  )}
                                  {chat.lastMessage.text}
                                </>
                              ) : (
                                <span className="italic">No messages yet</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end ml-2">
                            {chat.lastMessage && (
                              <div className="text-xs text-gray-500">
                                {formatMessageTime(chat.lastMessage.sentAt)}
                              </div>
                            )}
                            {chat.unreadCount > 0 && (
                              <div className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-1">
                                {chat.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* All Users Tab */}
          {activeTab === "allUsers" && (
            <div className="p-3">
              <h3 className="text-lg font-semibold mb-4">All Users</h3>
              {filteredUsers.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No users found</p>
              ) : (
                filteredUsers.map((u) => {
                  const isOnline = isUserOnline(u._id);
                  const isFriend = friends.some((f) => f._id === u._id);
                  const requestSent = u.friendRequestStatus === "pending";
                  return (
                    <div
                      key={u._id}
                      className="p-3 mb-2 border-b border-gray-100 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="relative mr-3">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></span>
                        </div>
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-xs text-gray-500">
                            {u.bio || "No bio available"}
                          </div>
                        </div>
                      </div>
                      <div>
                        {isFriend ? (
                          <button
                            className="px-3 py-1 bg-gray-200 text-black text-sm rounded-md"
                            onClick={() => handleSelectUser(u)}
                          >
                            Message
                          </button>
                        ) : requestSent ? (
                          <span className="text-sm text-gray-500">
                            Request Sent
                          </span>
                        ) : (
                          <button
                            className="px-3 py-1 bg-black text-white text-sm rounded-md"
                            onClick={() => sendFriendRequest(u._id)}
                          >
                            Add Friend
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Friends Tab */}
          {activeTab === "friends" && (
            <div className="p-3">
              <h3 className="text-lg font-semibold mb-4">Your Friends</h3>
              {friends.length === 0 ? (
                <div className="text-center py-10">
                  <p className="mb-2">No friends yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Connect with others to start chatting!
                  </p>
                  <button
                    className="px-4 py-2 bg-black text-white rounded-md"
                    onClick={() => setActiveTab("allUsers")}
                  >
                    Find Users
                  </button>
                </div>
              ) : (
                friends.map((friend) => {
                  const isOnline = isUserOnline(friend._id);
                  return (
                    <div
                      key={friend._id}
                      className="p-3 mb-2 border-b border-gray-100 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="relative mr-3">
                          {friend.avatar ? (
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {friend.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></span>
                        </div>
                        <div>
                          <div className="font-semibold">{friend.name}</div>
                          <div className="text-xs text-gray-500">
                            {isOnline ? "Online" : "Offline"}
                          </div>
                        </div>
                      </div>
                      <button
                        className="px-3 py-1 bg-black text-white text-sm rounded-md"
                        onClick={() => handleSelectUser(friend)}
                      >
                        Message
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Friend Requests Tab */}
          {activeTab === "requests" && (
            <div className="p-3">
              <h3 className="text-lg font-semibold mb-4">Friend Requests</h3>
              {friendRequests.length === 0 ? (
                <p className="text-center py-4 text-gray-500">
                  No pending friend requests
                </p>
              ) : (
                friendRequests.map((request) => (
                  <div
                    key={request._id}
                    className="p-3 mb-2 border-b border-gray-100 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        {request.avatar ? (
                          <img
                            src={request.avatar}
                            alt={request.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {request.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{request.name}</div>
                        <div className="text-xs text-gray-500">
                          Wants to be your friend
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-black text-white text-sm rounded-md"
                        onClick={() => acceptFriendRequest(request._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-200 text-black text-sm rounded-md"
                        onClick={() => rejectFriendRequest(request._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-3 flex items-center">
              <div className="relative mr-3">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    isUserOnline(selectedUser._id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></span>
              </div>
              <div>
                <div className="font-semibold">{selectedUser.name}</div>
                <div className="text-xs text-gray-500">
                  {isUserOnline(selectedUser._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {chatLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading messages...</p>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-gray-500">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Start the conversation!</p>
                </div>
              ) : (
                Object.entries(groupMessagesByDate(chatMessages)).map(
                  ([date, messages]) => (
                    <div key={date} className="mb-4">
                      <div className="text-center mb-4">
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {date}
                        </span>
                      </div>
                      {messages.map((message) => {
                        const isOwnMessage = message.from._id === user._id;
                        return (
                          <div
                            key={message._id}
                            className={`flex mb-2 ${
                              isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                isOwnMessage
                                  ? "bg-black text-white rounded-br-none"
                                  : "bg-gray-200 text-black rounded-bl-none"
                              }`}
                            >
                              <div className="text-sm">{message.text}</div>
                              <div className="flex items-center justify-end gap-1 mt-1 text-xs">
                                <span>{formatMessageTime(message.sentAt)}</span>
                                {isOwnMessage && (
                                  <span>
                                    {message.read ? (
                                      <i className="fa fa-check-double text-gray-300"></i>
                                    ) : (
                                      <i className="fa fa-check text-gray-300"></i>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )
              )}
              {isTyping && (
                <div className="flex mb-2">
                  <div className="p-3 bg-gray-200 text-gray-500 rounded-lg">
                    <span>
                      Typing<span className="typing-dots">...</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-3">
              <form onSubmit={sendMessage} className="flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-gray-500"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-r-md"
                  disabled={!chatInput.trim()}
                >
                  <i className="fa fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full bg-gray-50">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-2">
                Welcome to Messages
              </h3>
              <p className="text-gray-500 mb-4">
                Select a conversation or start a new one
              </p>
              <button
                className="px-4 py-2 bg-black text-white rounded-md"
                onClick={() => setActiveTab("allUsers")}
              >
                Find Users
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Define the typing animation with a keyframe class */}
      <style jsx>{`
        .typing-dots {
          display: inline-block;
          animation: typingAnimation 1.5s infinite;
        }
        @keyframes typingAnimation {
          0% {
            content: "";
          }
          25% {
            content: ".";
          }
          50% {
            content: "..";
          }
          75% {
            content: "...";
          }
          100% {
            content: "";
          }
        }
      `}</style>
    </div>
  );
}
