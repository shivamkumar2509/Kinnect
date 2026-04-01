import CallIcon from "@mui/icons-material/Call";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../../componenets/UserAvatar";
import socket from "../../services/socket.service";
const ChatHeader = ({ user }) => {
  const navigate = useNavigate();
  const handleCall = () => {
    socket.emit("call:user", {
      to: user._id,
    });
    navigate(`/video-call/${user._id}`, {
      state: { isCaller: true },
    });
  };
  return (
    <div className="chat-header">
      <div className="avatar">
        {" "}
        {(
          <UserAvatar
            avatar={user?.avatar?.url}
            username={user?.username}
            size={40}
          />
        ) || user.username?.charAt(0)?.toUpperCase()}
      </div>
      <div>
        <strong>{user.username}</strong>
        &nbsp;
        <span>
          <small>online</small>
        </span>
      </div>
      <button className="call-btn" onClick={handleCall}>
        <CallIcon />
      </button>
    </div>
  );
};

export default ChatHeader;
