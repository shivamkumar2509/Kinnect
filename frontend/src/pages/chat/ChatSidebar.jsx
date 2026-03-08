import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";

const ChatSidebar = ({ onSelectUser }) => {
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const me = await API.get("/users/me");

      setFollowingList(me.data.user.following || []);
      setFollowersList(me.data.user.followers || []);

      const chatsRes = await API.get("/chats");

      const usersFromChats = chatsRes.data.map((chat) =>
        chat.participants.find((p) => p._id !== me.data.user._id),
      );

      setChatUsers(usersFromChats);
    };

    fetchAll();
  }, []);

  const mergedUsers = useMemo(() => {
    return Array.from(
      new Map(
        [...followingList, ...followersList, ...chatUsers]
          .filter((u) => u && u._id)
          .map((u) => [u._id.toString(), u]),
      ).values(),
    );
  }, [followingList, followersList, chatUsers]);

  return (
    <div className="chat-sidebar">
      <h5 className="sidebar-title">Chats</h5>

      {mergedUsers.map((user) => (
        <div
          className="chat-item"
          key={user._id}
          onClick={() => onSelectUser(user)}
        >
          <div className="avatar">
            {user.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <strong>{user.username}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
