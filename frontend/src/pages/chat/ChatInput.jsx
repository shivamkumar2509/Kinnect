import { useState } from "react";
import API from "../../services/api";
import socket from "../../services/socket.service";

const ChatInput = ({ chatId, receiver }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!text.trim() || !chatId || loading) {
      console.log("⚠️ Cannot send message:", {
        text: text.trim(),
        chatId,
        loading,
      });
      return;
    }

    console.log("✉️ Sending message to chat:", chatId);
    console.log("✉️ Message content:", text);

    setLoading(true);
    try {
      const response = await API.post("/messages", {
        chatId,
        content: text.trim(),
      });

      console.log("✅ Message sent successfully:", response.data);
      setText("");
    } catch (e) {
      console.error("❌ Send message error:", e);

      // Fallback to socket
      try {
        const me = await API.get("/users/me");
        console.log("🔄 Falling back to socket...");

        // Make sure socket is connected
        if (!socket.connected) {
          console.log("⚠️ Socket not connected, connecting...");
          socket.connect();
          // Wait a bit for connection
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        socket.emit("send_message", {
          senderId: me.data.user._id,
          receiverId: receiver?._id,
          chatId: chatId,
          content: text.trim(),
        });
        console.log("✅ Message sent via socket");
        setText("");
      } catch (socketError) {
        console.error("❌ Socket send error:", socketError);
        alert("Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder={loading ? "Sending..." : "Type a message..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default ChatInput;
