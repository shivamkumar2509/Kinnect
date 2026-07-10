import API from "../../services/api";
import { useEffect, useState, useRef } from "react";
import socket from "../../services/socket.service";

const ChatMessages = ({ chatId }) => {
  const [myUserId, setMyUserId] = useState(null);
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    console.log("📨 ChatMessages mounted with chatId:", chatId);
    console.log("🔌 Socket connected:", socket.connected);

    const fetchChat = async () => {
      try {
        const me = await API.get("/users/me");
        setMyUserId(me.data.user._id);

        const res = await API.get(`/chats/${chatId}/messages`);
        console.log("📥 Fetched messages:", res.data.length);
        setChat(res.data);
      } catch (e) {
        console.log("❌ chat fetch error:", e);
      }
    };

    fetchChat();

    // Make sure socket is connected before joining room
    if (!socket.connected) {
      console.log("⚠️ Socket not connected, connecting...");
      socket.connect();
    }

    // Join chat room
    socket.emit("join_chat", chatId);
    console.log(`📡 Joined chat room: ${chatId}`);

    // Receive new message handler
    const handleReceiveMessage = (msg) => {
      console.log("📨 New message received:", msg);
      console.log("📨 Current chatId:", chatId);
      console.log("📨 Message chatId:", msg.chatId);

      if (msg.chatId && msg.chatId.toString() === chatId.toString()) {
        setChat((prev) => {
          // Prevent duplicates
          const exists = prev.some((m) => m._id === msg._id);
          if (!exists) {
            console.log("✅ Adding message to state:", msg);
            return [...prev, msg];
          }
          console.log("⚠️ Message already exists, skipping");
          return prev;
        });
      } else {
        console.log("⚠️ Message chatId doesn't match current chat");
      }
    };

    // Delete message handler
    const handleDeleteMessage = ({ messageId }) => {
      console.log("🗑️ Message deleted:", messageId);
      setChat((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    // Register event listeners
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_deleted", handleDeleteMessage);

    return () => {
      console.log("🧹 Cleaning up ChatMessages for chatId:", chatId);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_deleted", handleDeleteMessage);
    };
  }, [chatId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleDelete = async (messageId) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await API.delete(`/chats/${chatId}/messages/${messageId}`);
      setChat((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (e) {
      console.log("❌ Delete error:", e);
    }
  };

  return (
    <div className="chat-messages">
      {chat.length === 0 ? (
        <div className="text-center text-muted mt-5">
          No messages yet. Start the conversation!
        </div>
      ) : (
        chat.map((msg, index) => {
          const senderId = msg.sender?._id
            ? msg.sender._id.toString()
            : msg.sender?.toString();

          const isMine = senderId === myUserId?.toString();

          return (
            <div
              key={msg._id || index}
              className={`message ${isMine ? "mine" : "theirs"}`}
            >
              <div className="message-top">
                <span>{msg.content}</span>
                {isMine && (
                  <div className="dropdown">
                    <button className="dots-btn" data-bs-toggle="dropdown">
                      ⋮
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(msg._id)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <small className="text-muted">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </small>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
