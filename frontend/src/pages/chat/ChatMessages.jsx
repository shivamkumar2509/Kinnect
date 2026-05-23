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
          {
            _id: msg._id,
            chat: chatId,
            sender: msg.senderId,
            content: msg.content || msg.text || "",
          },
        ]);
      }
    });
    return () => {
      socket.off("receive_message");
    };
  }, [chatId]);

  const handleDelete = async (messageId) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await API.delete(`/chats/${chatId}/messages/${messageId}`);

      setChat((prev) => prev.filter((msg) => msg._id !== messageId));

      console.log("Message deleted:", messageId);
    } catch (e) {
      console.log("Delete error:", e);
    }
  };
  return (
    <div className="chat-messages">
      {chat.map((msg, index) => {
        const senderId = msg.sender?._id
          ? msg.sender._id.toString()
          : msg.sender?.toString();

        const isMine = senderId === myUserId?.toString();
        const key = msg._id || `${senderId}-${msg.createdAt || index}`;
        return (
          <div key={key} className={`message ${isMine ? "mine" : "theirs"}`}>
            <div className="message-top">
              <span>{msg.content || msg.text || ""}</span>

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
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
