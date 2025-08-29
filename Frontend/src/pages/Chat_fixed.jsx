import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import * as messagesAPI from "../api/messages";
import * as userAPI from "../api/user";
import { AuthContext } from "../contexts/AuthContext";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

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

  // Fetch all users
  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await userAPI.getAllUsers();
      setAllUsers(response.data.filter((u) => u._id !== user?._id));
    } catch (err) {
      console.error("Failed to fetch all users:", err);
    }
  }, [user]);

  // Fetch friends
  const fetchFriends = useCallback(async () => {
    try {
      const response = await userAPI.getFriends();
      setFriends(response.data);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }
  }, []);

  // Fetch friend requests
  const fetchFriendRequests = useCallback(async () => {
    try {
      const response = await userAPI.getFriendRequests();
      setFriendRequests(response.data);
    } catch (err) {
      console.error("Failed to fetch friend requests:", err);
    }
  }, []);

  // Update notification count
  const updateNotificationCount = useCallback(async () => {
    try {
      const response = await userAPI.getNotificationCount();
      setNotificationCount(response.data.count);
    } catch (err) {
      console.error("Failed to fetch notification count:", err);
    }
  }, []);

  // Fetch latest chats
  const fetchLatestChats = useCallback(async () => {
    try {
      const response = await messagesAPI.getLatestChats();
      setLatestChats(response.data);
      setLoading(false);
    } catch (err) {
      console.log("err: ", err.message);
      setError("Failed to fetch chats");
      setLoading(false);
    }
  }, []);

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
      socket.on("friendRequest", () => {
        toast.success("You have a new friend request!");
        fetchFriendRequests();
        updateNotificationCount();
      });

      // Listen for accepted friend requests
      socket.on("friendRequestAccepted", () => {
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
  }, [
    socket,
    user,
    selectedUser,
    fetchFriendRequests,
    fetchFriends,
    fetchLatestChats,
    updateNotificationCount,
  ]);

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
    } catch (err) {
      console.error("Failed to fetch chat messages:", err);
      setChatLoading(false);
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
    } catch (err) {
      console.error("Failed to send message:", err);
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

      // Set new typing timeout
      const timeout = setTimeout(() => {
        socket.emit("typing", {
          to: selectedUser._id,
          isTyping: false,
        });
      }, 3000);
      setTypingTimeout(timeout);
    }
  };

  // Send friend request
  const sendFriendRequest = async (userId) => {
    try {
      await userAPI.sendFriendRequest(userId);
      toast.success("Friend request sent!");

      // Refresh users list
      fetchAllUsers();
    } catch (err) {
      console.error("Failed to send friend request:", err);
      toast.error("Failed to send friend request");
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (requestId) => {
    try {
      await userAPI.acceptFriendRequest(requestId);
      toast.success("Friend request accepted!");

      // Refresh data
      fetchFriendRequests();
      fetchFriends();
      updateNotificationCount();
    } catch (err) {
      console.error("Failed to accept friend request:", err);
      toast.error("Failed to accept friend request");
    }
  };

  // Reject friend request
  const rejectFriendRequest = async (requestId) => {
    try {
      await userAPI.rejectFriendRequest(requestId);
      toast.success("Friend request rejected");

      // Refresh data
      fetchFriendRequests();
      updateNotificationCount();
    } catch (err) {
      console.error("Failed to reject friend request:", err);
      toast.error("Failed to reject friend request");
    }
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchLatestChats();
      updateNotificationCount();

      // Only fetch data for active tab on first load
      if (activeTab === "allUsers") {
        fetchAllUsers();
      } else if (activeTab === "friends") {
        fetchFriends();
      } else if (activeTab === "requests") {
        fetchFriendRequests();
      }
    }
  }, [
    user,
    activeTab,
    fetchAllUsers,
    fetchFriends,
    fetchFriendRequests,
    fetchLatestChats,
    updateNotificationCount,
  ]);

  // Fetch tab data when active tab changes
  useEffect(() => {
    if (user) {
      if (activeTab === "allUsers") {
        fetchAllUsers();
      } else if (activeTab === "friends") {
        fetchFriends();
      } else if (activeTab === "requests") {
        fetchFriendRequests();
      }
    }
  }, [activeTab, user, fetchAllUsers, fetchFriends, fetchFriendRequests]);

  // Filter users based on search query
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden mt-6 md:mt-9 sm:p-8 sm:pt-9.5 p-2 flex flex-col bg-white font-sans text-black overflow-x-hidden relative">
      {/* Main Chat Interface */}
      <div className="max-w-screen-xl mx-auto w-full h-full flex flex-col bg-white shadow-md border border-black/10 rounded-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b border-black/10 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-semibold">Messages</h1>
            {notificationCount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {notificationCount}
              </div>
            )}
          </div>
        </div>

        {/* Chat Navigation */}
        <div className="flex border-b border-black/10">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "chats"
                ? "border-b-2 border-black text-black"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab("allUsers")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "allUsers"
                ? "border-b-2 border-black text-black"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            Find Users
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "friends"
                ? "border-b-2 border-black text-black"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "requests"
                ? "border-b-2 border-black text-black"
                : "text-black/60 hover:text-black hover:bg-black/5"
            } relative`}
          >
            Requests
            {friendRequests.length > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {friendRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - User List */}
          <div className="w-full sm:w-1/3 md:w-1/4 border-r border-black/10 bg-white flex flex-col">
            {/* Loading State */}
            {loading && activeTab === "chats" && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
                  <p className="mt-3 text-sm text-black/60">Loading chats...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-4">
                  <div className="text-red-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-black/60">{error}</p>
                  <button
                    onClick={fetchLatestChats}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Chat Stats */}
            <div className="p-3">
              {activeTab === "chats" && latestChats.length > 0 && (
                <div className="flex items-center justify-between text-sm text-black/60 mb-2">
                  <span>{latestChats.length} conversation(s)</span>
                  {latestChats.reduce(
                    (count, chat) => count + (chat.unreadCount || 0),
                    0
                  ) > 0 && (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-black"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="font-medium">
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
            </div>

            {/* Search bar - visible only in All Users tab */}
            {activeTab === "allUsers" && (
              <div className="p-3 border-b border-black/10">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-black/40"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                  />
                </div>
              </div>
            )}

            {/* Display content based on active tab */}
            <div className="flex-1 overflow-y-auto">
              {/* Chats Tab */}
              {activeTab === "chats" && (
                <div className="p-3">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                      Your Conversations
                    </h3>
                    <p className="text-sm text-black/60">
                      Chat with friends and language partners
                    </p>
                  </div>

                  {latestChats.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-black/30 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <p className="mb-2 text-black/70">No conversations yet</p>
                      <p className="text-sm text-black/50 mb-4">
                        Add friends to start chatting!
                      </p>
                      <button
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-transform duration-150 hover:scale-[1.05]"
                        onClick={() => setActiveTab("allUsers")}
                      >
                        Find Users
                      </button>
                    </div>
                  ) : (
                    <>
                      {latestChats.some((chat) => chat.unreadCount > 0) && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium uppercase tracking-wide text-black/50 mb-1">
                            New Messages
                          </h4>
                          {latestChats
                            .filter((chat) => chat.unreadCount > 0)
                            .map((chat) => (
                              <div
                                key={chat.user._id}
                                onClick={() => handleSelectUser(chat.user)}
                                className={`flex items-center p-3 rounded-md cursor-pointer mb-1 transition hover:bg-black/5 ${
                                  selectedUser &&
                                  selectedUser._id === chat.user._id
                                    ? "bg-black/10"
                                    : ""
                                }`}
                              >
                                <div className="relative">
                                  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-lg font-medium">
                                    {chat.user.name.charAt(0).toUpperCase()}
                                  </div>
                                  {onlineUsers.includes(chat.user._id) && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                  )}
                                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {chat.unreadCount}
                                  </div>
                                </div>
                                <div className="ml-3 flex-1">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-semibold">
                                      {chat.user.name}
                                    </h4>
                                    <span className="text-xs text-black/50">
                                      {new Date(
                                        chat.lastMessage.createdAt
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm truncate text-black/70">
                                    {chat.lastMessage.from._id === user._id ? (
                                      <span className="text-black/50">
                                        You:{" "}
                                      </span>
                                    ) : null}
                                    {chat.lastMessage.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium uppercase tracking-wide text-black/50 mb-1">
                          All Conversations
                        </h4>
                        {latestChats
                          .filter((chat) => chat.unreadCount === 0)
                          .map((chat) => (
                            <div
                              key={chat.user._id}
                              onClick={() => handleSelectUser(chat.user)}
                              className={`flex items-center p-3 rounded-md cursor-pointer mb-1 transition hover:bg-black/5 ${
                                selectedUser &&
                                selectedUser._id === chat.user._id
                                  ? "bg-black/10"
                                  : ""
                              }`}
                            >
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-lg font-medium">
                                  {chat.user.name.charAt(0).toUpperCase()}
                                </div>
                                {onlineUsers.includes(chat.user._id) && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-semibold">
                                    {chat.user.name}
                                  </h4>
                                  <span className="text-xs text-black/50">
                                    {new Date(
                                      chat.lastMessage.createdAt
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm truncate text-black/60">
                                  {chat.lastMessage.from._id === user._id ? (
                                    <span className="text-black/40">You: </span>
                                  ) : null}
                                  {chat.lastMessage.text}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* All Users Tab */}
              {activeTab === "allUsers" && (
                <div className="p-3">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Find Users</h3>
                    <p className="text-sm text-black/60">
                      Discover and connect with other Japanese language learners
                    </p>
                  </div>

                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-black/30 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <p className="text-black/70">
                        {searchQuery
                          ? `No users found for "${searchQuery}"`
                          : "No users available"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between p-3 rounded-md mb-1 hover:bg-black/5 transition"
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-lg font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              {onlineUsers.includes(user._id) && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-semibold">{user.name}</h4>
                              <p className="text-sm text-black/60 truncate max-w-[180px]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSelectUser(user)}
                              className="px-3 py-1.5 border border-black/10 rounded hover:bg-black/5 transition"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => sendFriendRequest(user._id)}
                              className="px-3 py-1.5 bg-black text-white rounded hover:bg-black/80 transition"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Friends Tab */}
              {activeTab === "friends" && (
                <div className="p-3">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Your Friends</h3>
                    <p className="text-sm text-black/60">
                      Connect and chat with your language partners
                    </p>
                  </div>

                  {friends.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-black/30 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="mb-2 text-black/70">No friends yet</p>
                      <p className="text-sm text-black/50 mb-4">
                        Find and add friends to start chatting!
                      </p>
                      <button
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-transform duration-150 hover:scale-[1.05]"
                        onClick={() => setActiveTab("allUsers")}
                      >
                        Find Users
                      </button>
                    </div>
                  ) : (
                    <div>
                      {friends.map((friend) => (
                        <div
                          key={friend._id}
                          className="flex items-center justify-between p-3 rounded-md mb-1 hover:bg-black/5 transition"
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-lg font-medium">
                                {friend.name.charAt(0).toUpperCase()}
                              </div>
                              {onlineUsers.includes(friend._id) && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-semibold">{friend.name}</h4>
                              <p className="text-sm text-black/60">
                                {friend.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSelectUser(friend)}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-black/80 transition"
                          >
                            Message
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Friend Requests Tab */}
              {activeTab === "requests" && (
                <div className="p-3">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Friend Requests</h3>
                    <p className="text-sm text-black/60">
                      Accept or decline connection requests
                    </p>
                  </div>

                  {friendRequests.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-black/30 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      <p className="mb-2 text-black/70">No friend requests</p>
                      <p className="text-sm text-black/50">
                        You'll see requests from other users here
                      </p>
                    </div>
                  ) : (
                    <div>
                      {friendRequests.map((request) => (
                        <div
                          key={request._id}
                          className="bg-black/5 rounded-lg p-4 mb-3"
                        >
                          <div className="flex items-center mb-3">
                            <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-lg font-medium">
                              {request.from.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-semibold">
                                {request.from.name}
                              </h4>
                              <p className="text-xs text-black/60">
                                {request.from.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => acceptFriendRequest(request._id)}
                              className="flex-1 py-2 bg-black text-white rounded hover:bg-black/80 transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => rejectFriendRequest(request._id)}
                              className="flex-1 py-2 border border-black/20 rounded hover:bg-black/5 transition"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Chat Area */}
          <div className="hidden sm:flex sm:w-2/3 md:w-3/4 flex-col bg-white">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-black/10">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-lg font-medium">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </div>
                      {onlineUsers.includes(selectedUser._id) && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">{selectedUser.name}</h3>
                      <p className="text-xs text-black/60">
                        {onlineUsers.includes(selectedUser._id)
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="md:hidden p-2 rounded-full hover:bg-black/5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-white">
                  {chatLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
                        <p className="mt-3 text-sm text-black/60">
                          Loading messages...
                        </p>
                      </div>
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mx-auto text-black/20 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <h3 className="text-lg font-semibold mb-2">
                          No messages yet
                        </h3>
                        <p className="text-black/60 mb-6">
                          Send a message to start the conversation!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex ${
                            message.from._id === user._id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              message.from._id === user._id
                                ? "bg-black text-white"
                                : "bg-black/5 text-black"
                            }`}
                          >
                            <p>{message.text}</p>
                            <div
                              className={`text-xs mt-1 flex justify-between items-center ${
                                message.from._id === user._id
                                  ? "text-white/70"
                                  : "text-black/50"
                              }`}
                            >
                              <span>
                                {new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              {message.from._id === user._id && (
                                <span className="ml-2">
                                  {message.read ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-black/5 rounded-lg px-4 py-2">
                            <div className="typing-indicator flex space-x-1">
                              <div className="w-2 h-2 rounded-full bg-black/60"></div>
                              <div className="w-2 h-2 rounded-full bg-black/60 animation-delay-200"></div>
                              <div className="w-2 h-2 rounded-full bg-black/60 animation-delay-400"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-black/10 p-3 bg-white">
                  <form onSubmit={sendMessage} className="flex items-center">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={handleInputChange}
                      placeholder="Type a message..."
                      className="flex-1 p-3 border border-black/20 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className={`bg-black text-white p-3 rounded-r-lg ${
                        !chatInput.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-800"
                      } transition-transform duration-150 hover:scale-[1.05]`}
                      disabled={!chatInput.trim()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full bg-white">
                <div className="text-center p-8 max-w-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-black/20 mb-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">
                    Welcome to Messages
                  </h3>
                  <p className="text-black/60 mb-6">
                    Select a conversation or start a new one
                  </p>
                  <button
                    className="px-6 py-3 bg-black text-white rounded-md hover:bg-black/80 transition-transform duration-150 hover:scale-[1.05]"
                    onClick={() => setActiveTab("allUsers")}
                  >
                    Find Users
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Japanese quote */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black text-white py-1.5 z-50 select-none w-full">
        <div className="max-w-md mx-auto px-4 pb-1.5 text-center font-serifJapanese text-base sm:text-sm leading-snug">
          <span className="block mb-0.5 text-lg sm:text-base font-semibold">
            「千里の道も一歩から」
          </span>
          <span className="block text-sm sm:text-xs opacity-85">
            — A journey of a thousand miles begins with a single step.
          </span>
          <p className="mt-2 text-xs sm:text-[10px] font-sans">
            Made with <span className="text-pink-500">❤</span> |{" "}
            <a
              href="mailto:chintalajanardhan2004@gmail.com"
              className="underline hover:text-pink-500"
            >
              chintalajanardhan2004@gmail.com
            </a>
          </p>
        </div>
      </footer>

      {/* Custom CSS for typing animation */}
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        .typing-indicator div {
          animation: blink 1.4s infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        html,
        body,
        #root {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
