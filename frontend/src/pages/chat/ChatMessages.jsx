import API from "../../services/api";
import { useEffect, useState } from "react";
import socket from "../../services/socket.service";

const ChatMessages = ({ chatId }) => {
  const [myUserId, setMyUserId] = useState(null);
  const [chat, setChat] = useState([]);
  useEffect(() => {
    if (!chatId) return;

    const fetchChat = async () => {
      try {
        const me = await API.get("/users/me");
        setMyUserId(me.data.user._id);

        const res = await API.get(`/chats/${chatId}/messages`);
        console.log("messages from backend: ", res.data);
        setChat(res.data);
      } catch (e) {
        console.log("chat fetch error: ", e);
      }
    };
    fetchChat();

    socket.on("receive_message", (msg) => {
      if (msg.chatId === chatId) {
        setChat((prev) => [
          ...prev,
          { ...msg, sender: msg.sender || msg.senderId },
        ]);
      }
    });
    return () => {
      socket.off("receive_message");
    };
  }, [chatId]);

  return (
    <div className="chat-messages">
      {chat.map((msg, index) => {
        const senderId =
          typeof msg.sender === "object"
            ? msg.sender?._id?.toString()
            : msg.sender?.toString();

        const isMine = senderId === myUserId?.toString();
        const key = msg._id || `${senderId}-${msg.createdAt || index}`;
        return (
          <div key={key} className={`message ${isMine ? "mine" : "theirs"}`}>
            {msg.content || msg.text || ""}
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
