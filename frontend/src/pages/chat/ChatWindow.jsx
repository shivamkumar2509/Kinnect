import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import API from "../../services/api";
import { useState, useEffect } from "react";

const ChatWindow = ({ user }) => {
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setChatId(null);
      return;
    }

    console.log("ChatWindow: user selected:", user);

    const createOrGetChat = async () => {
      setLoading(true);
      try {
        const res = await API.post("/chat", {
          userId: user._id,
        });
        console.log("Chat created/found:", res.data);
        console.log("Chat ID:", res.data._id);

        // Set chatId after ensuring it exists
        if (res.data && res.data._id) {
          setChatId(res.data._id);
        }
      } catch (error) {
        console.error("Error creating/finding chat:", error);
        alert("Failed to load chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createOrGetChat();
  }, [user]);

  console.log("Current chatId in ChatWindow:", chatId);

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

  if (loading) {
    return (
      <div className="chat-window">
        <div className="d-flex justify-content-center align-items-center vh-100">
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <ChatHeader user={user} />
      <ChatMessages chatId={chatId} />
      {chatId && <ChatInput chatId={chatId} receiver={user} />}
    </div>
  );
};

export default ChatWindow;
