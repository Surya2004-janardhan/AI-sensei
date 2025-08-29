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
import { toast } from "react-toastify";
import "../styles/toast.css";
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
  const [showSidebar, setShowSidebar] = useState(true);

  // User state
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  // Users, friends and requests state
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]); // Track users to whom friend requests have been sent
  const [activeTab, setActiveTab] = useState("chats"); // chats, allUsers, friends, requests
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false); // Track loading state for users
  const [usersFetched, setUsersFetched] = useState(false); // Track if users have been fetched

  // Split into two separate effects to avoid dependency issues

  // 1. Load sent friend requests from localStorage once on component mount
  useEffect(() => {
    try {
      const storedRequests = localStorage.getItem("sentFriendRequests");
      if (storedRequests) {
        setSentRequests(JSON.parse(storedRequests));
      }
    } catch (error) {
      console.error(
        "Failed to load sent friend requests from localStorage:",
        error
      );
    }
  }, []); // Empty dependency array = run once on mount

  // 2. Periodic check for friend request status changes, with proper error handling
  useEffect(() => {
    // Skip if no user or no requests to check
    if (!user || !user._id) return;

    // Function to verify friend request status
    const checkFriendRequestStatus = async () => {
      // Get latest from state to avoid stale closures
      const currentSentRequests =
        JSON.parse(localStorage.getItem("sentFriendRequests")) || [];
      if (currentSentRequests.length === 0) return;

      try {
        // Check if any sent requests have been accepted by fetching friends list
        const friendsResponse = await userAPI.getFriends();
        if (!friendsResponse || !friendsResponse.data) return;

        const currentFriends = friendsResponse.data;

        // For each friend, if they're in our sentRequests list, they've accepted
        const acceptedRequests = currentFriends
          .filter((friend) => currentSentRequests.includes(friend._id))
          .map((friend) => friend._id);

        // Remove accepted requests from sentRequests only if there are any
        if (acceptedRequests.length > 0) {
          const updatedRequests = currentSentRequests.filter(
            (id) => !acceptedRequests.includes(id)
          );

          // Update localStorage
          localStorage.setItem(
            "sentFriendRequests",
            JSON.stringify(updatedRequests)
          );

          // Update state (won't cause infinite loop since it's in a different useEffect)
          setSentRequests(updatedRequests);
        }
      } catch (error) {
        console.error("Error checking friend request status:", error);
        // Don't retry on error to avoid overwhelming the server
      }
    };

    // Run check once immediately when user changes
    checkFriendRequestStatus();

    // Then set up interval for periodic checks (every 2 minutes)
    const interval = setInterval(checkFriendRequestStatus, 120000);

    return () => clearInterval(interval);
  }, [user]); // Only depend on user, not on sentRequests

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
        fetchFriendRequests();
        updateNotificationCount();
      });

      // Listen for accepted friend requests
      socket.on("friendRequestAccepted", (data) => {
        console.log(data);

        // Remove from sentRequests since it's now accepted
        if (data.userId) {
          setSentRequests((prev) => {
            const updated = prev.filter((id) => id !== data.userId);

            // Update localStorage
            try {
              localStorage.setItem(
                "sentFriendRequests",
                JSON.stringify(updated)
              );
            } catch (storageError) {
              console.error("Failed to update localStorage:", storageError);
            }

            return updated;
          });
        }

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
      if (response && response.data) {
        setLatestChats(response.data);
      } else {
        setLatestChats([]);
        console.log("No chat data received or invalid format");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching latest chats:", error.message);
      setError("Failed to fetch chats");
      setLatestChats([]);
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

  // Fetch all users - wrapped in useCallback to avoid dependency issues in useEffect
  const fetchAllUsers = useCallback(
    async (forceRefresh = false) => {
      // Debounce API calls to prevent hammering the server
      if (loadingUsers) {
        console.log(
          "Skipping fetchAllUsers call as a request is already in progress"
        );
        return;
      }

      // If forceRefresh is true, we'll proceed even if usersFetched is true
      if (usersFetched && !forceRefresh) {
        console.log("Users already fetched, skipping fetch");
        return;
      }

      try {
        // Set loading state
        setLoadingUsers(true);

        // Add a slight delay to prevent rapid successive calls
        await new Promise((resolve) => setTimeout(resolve, 100));

        // API request with proper error handling
        const response = await userAPI.getAllUsers();

        if (!response || !response.data || !Array.isArray(response.data)) {
          console.error("Invalid response from getAllUsers API");
          return;
        }

        // Filter out the current user
        const filteredUsers =
          user && user._id
            ? response.data.filter((u) => u._id !== user._id)
            : response.data;

        // Get the latest sent requests from localStorage
        let currentSentRequests = [];
        try {
          const storedRequests = localStorage.getItem("sentFriendRequests");
          if (storedRequests) {
            currentSentRequests = JSON.parse(storedRequests);

            // Avoid unnecessary state updates that can trigger re-renders
            const currentSentRequestsStr = JSON.stringify(currentSentRequests);
            const sentRequestsStr = JSON.stringify(sentRequests);

            if (currentSentRequestsStr !== sentRequestsStr) {
              setSentRequests(currentSentRequests);
            }
          }
        } catch (error) {
          console.error("Error reading from localStorage:", error);
        }

        // Mark users with pending friend requests
        const enhancedUsers = filteredUsers.map((u) => {
          if (currentSentRequests.includes(u._id)) {
            return { ...u, friendRequestStatus: "pending" };
          }
          return u;
        });

        // Update allUsers state
        setAllUsers(enhancedUsers);

        // Set the usersFetched flag to prevent unnecessary refetches
        setUsersFetched(true);
      } catch (error) {
        console.error("Failed to fetch all users:", error);
      } finally {
        // Always reset loading state
        setLoadingUsers(false);
      }
      // Include usersFetched in dependency array to avoid the reference error
    },
    [user, loadingUsers, sentRequests, usersFetched]
  );

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
      const response = await userAPI.getPendingRequests();
      setFriendRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch friend requests:", error);
    }
  };

  // Update notification count
  const updateNotificationCount = async () => {
    try {
      const response = await userAPI.getNotificationsCount();
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
      console.log("Sending friend request to user ID:", userId);
      const response = await userAPI.sendFriendRequest(userId);
      console.log("Friend request response:", response.data);

      // Show a success toast notification with custom styling
      toast.success("Friend request sent successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          background: "black",
          color: "white",
        },
        progressStyle: {
          background: "white",
        },
        progressClassName: "!bg-white",
        icon: "🎉",
      });

      // Get user data if needed
      try {
        await userAPI.getUserById(userId);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }

      // Update sentRequests state to track that we've sent a request to this user
      const updatedSentRequests = [...sentRequests, userId];
      setSentRequests(updatedSentRequests);

      // Save to localStorage for persistence
      try {
        localStorage.setItem(
          "sentFriendRequests",
          JSON.stringify(updatedSentRequests)
        );
      } catch (storageError) {
        console.error("Failed to save to localStorage:", storageError);
      }

      // If in All Users tab, update UI immediately
      if (activeTab === "allUsers") {
        setAllUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, friendRequestStatus: "pending" } : u
          )
        );
      }
    } catch (error) {
      console.error("Failed to send friend request:", error);
      // Log detailed error message to help debugging
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (userId) => {
    try {
      await userAPI.acceptFriendRequest(userId);

      // Update UI
      fetchFriendRequests();
      fetchFriends();
      updateNotificationCount();

      // If we're in the requests tab, but now have no requests left, go to friends tab
      if (activeTab === "requests" && friendRequests.length === 1) {
        setActiveTab("friends");
      }
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  // Reject friend request
  const rejectFriendRequest = async (userId) => {
    try {
      await userAPI.rejectFriendRequest(userId);
      fetchFriendRequests();
      updateNotificationCount();
    } catch (error) {
      console.error("Failed to reject friend request:", error);
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
      setLoading(true);
      setError("");

      // Wrap in try/catch to ensure loading state is reset even if something fails
      try {
        fetchLatestChats();
        updateNotificationCount();
      } catch (error) {
        console.error("Error in initial data load:", error);
        setLoading(false);
      }
    }
  }, [user]);

  // Fetch users when activeTab changes to "allUsers"
  useEffect(() => {
    // Only fetch users when:
    // 1. Active tab is "allUsers"
    // 2. We have a valid user
    // 3. Users haven't been fetched yet
    if (activeTab === "allUsers" && user && user._id && !usersFetched) {
      // Use a timeout to prevent multiple concurrent calls
      const timer = setTimeout(() => {
        fetchAllUsers(false); // false means don't force refresh
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [activeTab, user, fetchAllUsers, usersFetched]);

  // Separate useEffect for resetting the fetched flag when switching tabs
  useEffect(() => {
    if (activeTab !== "allUsers") {
      setUsersFetched(false);
    }
  }, [activeTab]); // Filter users based on search query
  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if user is authenticated before rendering anything
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Please log in to view your chats
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <svg
          className="animate-spin h-8 w-8 text-black mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading chats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <div className="text-center">
          <div className="text-xl mb-2">Error</div>
          <div>{error}</div>
          <button
            className="mt-4 px-4 py-2 bg-black text-white rounded-md"
            onClick={() => {
              setError("");
              setLoading(true);
              fetchLatestChats();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Function to toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen bg-white relative">
      {/* Mobile Toggle Button - only visible on small screens */}
      <button
        className="md:hidden fixed z-10 top-4 left-4 bg-black text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {showSidebar ? (
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
        ) : (
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Sidebar - responsive */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex md:w-1/3 w-full md:relative absolute z-10 bg-white border-r border-gray-200 flex-col`}
      >
        <div className="border-b border-gray-200 flex flex-wrap md:flex-nowrap">
          <button
            className={`py-3 px-2 md:px-4 flex-1 text-center text-sm md:text-base ${
              activeTab === "chats"
                ? "bg-gray-100 text-black font-bold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </button>
          <button
            className={`py-3 px-2 md:px-4 flex-1 text-center text-sm md:text-base ${
              activeTab === "allUsers"
                ? "bg-gray-100 font-bold text-black "
                : "text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("allUsers");
              // Don't fetch here, the useEffect will handle it
            }}
          >
            All Users
          </button>
          <button
            className={`py-3 px-2 md:px-4 flex-1 text-center text-sm md:text-base ${
              activeTab === "friends"
                ? "bg-gray-100 text-black font-bold"
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
            className={`py-3 px-2 md:px-4 flex-1 text-center relative text-sm md:text-base ${
              activeTab === "requests"
                ? "bg-gray-100 font-bold text-black"
                : "text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("requests");
              fetchFriendRequests();
            }}
          >
            Requests
            {notificationCount > 0 && (
              <span className="absolute top-2 right-1 md:right-2 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full bg-black text-white text-xs">
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
        {/* Search bar with refresh button - visible only in All Users tab */}
        {activeTab === "allUsers" && (
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  // Update search query without triggering API calls
                  setSearchQuery(e.target.value);
                }}
                className="flex-grow w-[90%] p-2 mr-[10px] border border-gray-300 rounded"
              />
              <button
                className="w-[10%] p-2 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300 border rounded"
                onClick={() => {
                  setTimeout(() => {
                    fetchAllUsers(true);
                  }, 300);
                }}
                title="Refresh users list"
                disabled={loadingUsers}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}{" "}
        {/* Display content based on active tab */}
        <div className="flex-1 overflow-y-auto">
          {/* Chats Tab */}
          {activeTab === "chats" && (
            <div className="p-3">
              <div className="mb-4">
                {/* <h3 className="text-lg font-semibold">Your Conversations</h3>
                <p className="text-sm text-gray-600">
                  Chat with friends and language partners
                </p> */}
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
                    Find Friends
                  </button>
                </div>
              ) : (
                <>
                  {latestChats.some((chat) => chat.unreadCount > 0) && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold mb-2 text-gray-500">
                        Unread Messages
                      </div>
                      {Array.isArray(latestChats) &&
                        latestChats
                          .filter((chat) => chat && chat.unreadCount > 0)
                          .map((chat) => {
                            // Check if chat and otherUser exist to prevent render errors
                            if (!chat || !chat.otherUser) return null;
                            const chatUser = chat.otherUser;
                            const isOnline = isUserOnline(chatUser?._id);

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
                                      {formatMessageTime(
                                        chat.lastMessage.sentAt
                                      )}
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
                    {Array.isArray(latestChats) &&
                      latestChats.map((chat) => {
                        // Check if chat and otherUser exist to prevent render errors
                        if (!chat || !chat.otherUser) return null;
                        const chatUser = chat.otherUser;
                        const isOnline = isUserOnline(chatUser?._id);

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
              <div className="mb-4">
                <h3 className="text-lg font-semibold"></h3>
              </div>
              {loadingUsers ? (
                <div className="flex justify-center items-center py-8">
                  <svg
                    className="animate-spin h-8 w-8 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="ml-2 text-gray-600">Loading users...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No users found</p>
              ) : (
                filteredUsers.map((u) => {
                  const isOnline = isUserOnline(u._id);
                  const isFriend = friends.some((f) => f._id === u._id);
                  const requestSent =
                    u.friendRequestStatus === "pending" ||
                    sentRequests.includes(u._id);
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
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-md flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Request Sent
                          </span>
                        ) : (
                          <button
                            className="px-3 py-1 bg-black text-white text-sm rounded-md flex items-center"
                            onClick={() => {
                              console.log("Adding friend:", u._id);
                              sendFriendRequest(u._id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
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
              {/* <h3 className="text-lg font-semibold mb-4">Your Friends</h3> */}
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
                    Find Friends
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
              {/* <h3 className="text-lg font-semibold mb-4">Friend Requests</h3> */}
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
                    <div className="flex flex-col sm:flex-row gap-2">
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
      <div
        className={`${
          showSidebar ? "hidden" : "flex"
        } md:flex md:w-2/3 w-full flex-col`}
      >
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-3 flex items-center justify-between">
              <div className="flex items-center">
                {/* Mobile back button - only on small screens */}
                <button
                  className="md:hidden mr-2 text-gray-600"
                  onClick={toggleSidebar}
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

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

              {/* Add Friend Button */}
              {(() => {
                // Debug info
                console.log("Selected user:", selectedUser);
                console.log("Friends:", friends);
                console.log("Sent Requests:", sentRequests);
                console.log(
                  "Is friend?",
                  friends.some((friend) => friend._id === selectedUser._id)
                );
                console.log(
                  "Request sent?",
                  sentRequests.includes(selectedUser._id)
                );

                // Determine button state
                const isFriend = friends.some(
                  (friend) => friend._id === selectedUser._id
                );
                const requestSent = sentRequests.includes(selectedUser._id);

                if (!isFriend) {
                  if (requestSent) {
                    return (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-md">
                        Request Sent
                      </span>
                    );
                  } else {
                    return (
                      <button
                        className="px-3 py-1 bg-black text-white text-sm rounded-md"
                        onClick={() => {
                          console.log(
                            "Add Friend clicked for:",
                            selectedUser._id
                          );
                          sendFriendRequest(selectedUser._id);
                        }}
                      >
                        Add Friend
                      </button>
                    );
                  }
                }
                return null;
              })()}
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
                  className="bg-black text-white px-3 sm:px-4 py-2 rounded-r-md"
                  disabled={!chatInput.trim()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full bg-gray-50">
            <div className="text-center p-6">
              <div className="mb-4 hidden md:block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400"
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
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Welcome to Messages
              </h3>
              <p className="text-gray-500 mb-4">
                {showSidebar
                  ? "Select a conversation to start chatting"
                  : "Tap the menu button to see your conversations"}
              </p>
              <button
                className="px-4 py-2 bg-black text-white rounded-md"
                onClick={() => {
                  setActiveTab("allUsers");
                  if (!showSidebar) toggleSidebar(); // On mobile, show the sidebar when clicking Find Users
                }}
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
