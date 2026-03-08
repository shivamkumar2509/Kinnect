import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import "./chat.css";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div className="chat-page">
      <ChatSidebar onSelectUser={setSelectedUser} />
      <ChatWindow user={selectedUser} />
    </div>
  );
};

export default ChatPage;
