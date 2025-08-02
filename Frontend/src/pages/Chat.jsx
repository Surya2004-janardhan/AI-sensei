// import React, { useEffect, useState, useRef } from "react";
// import * as messagesAPI from "../api/messages"; // Your backend messages API (only 3 methods)

export default function Chat() {
  // const [latestChats, setLatestChats] = useState([]);
  // const [selectedUser, setSelectedUser] = useState(null);
  // const [chatMessages, setChatMessages] = useState([]);
  // const [chatInput, setChatInput] = useState("");
  // const [loading, setLoading] = useState(true);
  // const [chatLoading, setChatLoading] = useState(false);
  // const [error, setError] = useState("");
  // const scrollRef = useRef();

  // useEffect(() => {
  //   setLoading(true);
  //   messagesAPI
  //     .getLatestMessages()
  //     .then((res) => {
  //       setLatestChats(res.data || []);
  //       setError("");
  //     })
  //     .catch(() => setError("Failed to load latest chats"))
  //     .finally(() => setLoading(false));
  // }, []);

  // // Open chat with user from latest chats
  // const openChatWith = async (msg) => {
  //   // Determine other user in the conversation
  //   const other =
  //     msg.from._id === msg.to._id
  //       ? msg.to
  //       : msg.from._id !== undefined && msg.from._id !== msg.to._id
  //       ? msg.from
  //       : msg.to;

  //   setSelectedUser(other);
  //   setChatLoading(true);
  //   try {
  //     const res = await messagesAPI.getChatWithUser(other._id);
  //     setChatMessages(res.data || []);
  //     setError("");
  //   } catch {
  //     setError("Failed to load chat messages");
  //     setChatMessages([]);
  //   } finally {
  //     setChatLoading(false);
  //     setTimeout(() => {
  //       if (scrollRef.current)
  //         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //     }, 100);
  //   }
  // };

  // // Send chat message
  // const handleSendMsg = async (e) => {
  //   e.preventDefault();
  //   if (!chatInput.trim() || !selectedUser) return;

  //   try {
  //     const res = await messagesAPI.sendMessage(selectedUser._id, chatInput);
  //     setChatMessages((msgs) => [...msgs, res.data]);
  //     setChatInput("");
  //     setTimeout(() => {
  //       if (scrollRef.current)
  //         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //     }, 100);
  //     setError("");
  //   } catch {
  //     setError("Failed to send message");
  //   }
  // };

  return (
    <div className="min-h-screen bg-white px-4 md:px-8 py-6 font-sans text-black max-w-5xl mx-auto flex flex-col">
      Coming soon...
    </div>
    // <div className="min-h-screen bg-white px-4 md:px-8 py-6 font-sans text-black max-w-5xl mx-auto flex flex-col">
    //   <h1 className="text-4xl font-extrabold font-serifJapanese mb-6 text-center">
    //     Japanese Learners Chat
    //   </h1>

    //   {error && (
    //     <div className="text-center text-red-600 font-semibold mb-4">
    //       {error}
    //     </div>
    //   )}

    //   {loading ? (
    //     <div className="flex flex-1 items-center justify-center">
    //       <p className="text-lg font-semibold">Loading chat system...</p>
    //     </div>
    //   ) : (
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
    //       {/* Latest Conversations Sidebar */}
    //       <aside className="md:col-span-1 space-y-6 overflow-auto max-h-[70vh] border border-black/20 rounded-lg p-4">
    //         <h3 className="text-xl font-bold mb-4">Latest Chats</h3>

    //         {latestChats.length === 0 ? (
    //           <p className="text-black/50 text-sm">No chat history yet.</p>
    //         ) : (
    //           <ul>
    //             {latestChats.map((msg) => {
    //               const other =
    //                 msg.from._id === msg.to._id
    //                   ? msg.to
    //                   : msg.from._id !== undefined &&
    //                     msg.from._id !== msg.to._id
    //                   ? msg.from
    //                   : msg.to;

    //               return (
    //                 <li
    //                   key={msg._id}
    //                   className="flex items-center mb-3 cursor-pointer hover:bg-black/5 rounded px-2 py-2 transition"
    //                   onClick={() => openChatWith(msg)}
    //                   tabIndex={0}
    //                   onKeyPress={(e) => {
    //                     if (e.key === "Enter") openChatWith(msg);
    //                   }}
    //                   role="button"
    //                   aria-label={`Open chat with ${other.name || "User"}`}
    //                 >
    //                   <img
    //                     src={other.avatar || "/default-user.png"}
    //                     alt={other.name || "User Avatar"}
    //                     className="w-8 h-8 rounded-full border mr-3 object-cover"
    //                   />
    //                   <div className="flex flex-col">
    //                     <span className="font-semibold">
    //                       {other.name || "User"}
    //                     </span>
    //                     <span className="text-xs text-black/50 truncate max-w-[10rem]">
    //                       {msg.text?.slice(0, 30)}
    //                       {msg.text && msg.text.length > 30 ? "..." : ""}
    //                     </span>
    //                   </div>
    //                   <span className="ml-auto text-xs text-black/40">
    //                     {new Date(msg.sentAt || msg.date).toLocaleTimeString(
    //                       [],
    //                       { hour: "2-digit", minute: "2-digit" }
    //                     )}
    //                   </span>
    //                 </li>
    //               );
    //             })}
    //           </ul>
    //         )}
    //       </aside>

    //       {/* Chat Window */}
    //       <main className="md:col-span-2 flex flex-col h-full border border-black/20 rounded-lg shadow-lg bg-white p-4">
    //         {selectedUser ? (
    //           <>
    //             <div className="flex items-center mb-4 border-b border-black/10 pb-2">
    //               <img
    //                 src={selectedUser.avatar || "/default-user.png"}
    //                 alt={selectedUser.name || "User Avatar"}
    //                 className="w-10 h-10 rounded-full border mr-3 object-cover"
    //               />
    //               <div>
    //                 <span className="font-bold text-lg">
    //                   {selectedUser.name || "User"}
    //                 </span>
    //                 {selectedUser.jlptLevel && (
    //                   <span className="ml-2 text-xs border px-2 py-0.5 rounded text-black/50">
    //                     {selectedUser.jlptLevel}
    //                   </span>
    //                 )}
    //               </div>
    //             </div>
    //             <div
    //               ref={scrollRef}
    //               className="flex-1 overflow-y-auto mb-3 px-2"
    //               style={{ minHeight: 300, maxHeight: 440 }}
    //             >
    //               {chatLoading ? (
    //                 <p className="text-black/50">Loading chat...</p>
    //               ) : chatMessages.length === 0 ? (
    //                 <p className="text-black/50 text-center mt-12">
    //                   No messages yet. Say hello!
    //                 </p>
    //               ) : (
    //                 chatMessages.map((msg, idx) => {
    //                   const isMe = msg.from === selectedUser._id ? false : true;
    //                   return (
    //                     <div
    //                       key={msg._id || idx}
    //                       className={`mb-2 flex ${
    //                         isMe ? "justify-end" : "justify-start"
    //                       }`}
    //                     >
    //                       <div
    //                         className={`rounded-xl px-4 py-2 max-w-xs break-words ${
    //                           isMe
    //                             ? "bg-primary/90 text-white self-end"
    //                             : "bg-black/10 text-black self-start"
    //                         }`}
    //                       >
    //                         {msg.text}
    //                         <div className="text-xs mt-0.5 text-black/40 text-right">
    //                           {new Date(
    //                             msg.sentAt || msg.date
    //                           ).toLocaleTimeString([], {
    //                             hour: "2-digit",
    //                             minute: "2-digit",
    //                           })}
    //                         </div>
    //                       </div>
    //                     </div>
    //                   );
    //                 })
    //               )}
    //             </div>
    //             {/* Chat input */}
    //             <form
    //               className="flex items-center border-t border-black/10 pt-2"
    //               onSubmit={handleSendMsg}
    //             >
    //               <input
    //                 type="text"
    //                 value={chatInput}
    //                 onChange={(e) => setChatInput(e.target.value)}
    //                 disabled={chatLoading}
    //                 placeholder="Type your message..."
    //                 className="flex-1 px-4 py-2 border border-black/20 rounded-l focus:ring-2 focus:ring-primary"
    //                 aria-label="Type your chat message"
    //               />
    //               <button
    //                 type="submit"
    //                 disabled={!chatInput.trim() || chatLoading}
    //                 className="px-5 py-2 rounded-r bg-black text-white font-semibold ml-0 disabled:bg-gray-300 disabled:text-gray-500 transition"
    //               >
    //                 Send
    //               </button>
    //             </form>
    //           </>
    //         ) : (
    //           <div className="h-full flex flex-col items-center justify-center text-black/40 select-none">
    //             <span className="text-6xl mb-3">💬</span>
    //             <p className="text-xl font-serifJapanese">
    //               Select a conversation to start chatting!
    //             </p>
    //           </div>
    //         )}
    //       </main>
    //     </div>
    //   )}
    // </div>
  );
}
