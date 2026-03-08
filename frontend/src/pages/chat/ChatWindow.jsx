import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import API from "../../services/api";
import { useState, useEffect } from "react";
const ChatWindow = ({ user }) => {
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    if (!user) return;
    console.log("chatWindow:", user);

    const createOrGetChat = async () => {
      const res = await API.post("/chat", {
        userId: user._id,
      });
      console.log("chat created/found: ", res.data);
      console.log("Chat ID from backend:", res.data._id);

      setChatId(res.data._id);
    };

    createOrGetChat();
  }, [user]);

  console.log("chatId:", chatId);
  if (!user) {
    return (
      <div className="chat-window">
        <div className="chat-empty d-flex justify-content-center align-items-center vh-100">
          <p className="fw-bold fs-3 text-primary text-uppercase">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="chat-window">
      <ChatHeader user={user} />
      <ChatMessages chatId={chatId} />
      <ChatInput chatId={chatId} receiver={user} />
    </div>
  );
};

export default ChatWindow;
