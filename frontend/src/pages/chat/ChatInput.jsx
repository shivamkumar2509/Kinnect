import { useState } from "react";
import socket from "../../services/socket.service";
import API from "../../services/api";

const ChatInput = ({ chatId, receiver }) => {
  const [text, setText] = useState("");
  const sendMessage = async () => {
    if (!text.trim() || !chatId) {
      return;
    }

    const me = await API.get("/users/me");

    socket.emit("send_message", {
      senderId: me.data.user._id,
      receiverId: receiver._id,
      content: text,
    });
    setText("");
  };
  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatInput;
