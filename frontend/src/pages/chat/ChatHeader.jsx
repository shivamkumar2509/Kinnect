import CallIcon from "@mui/icons-material/Call";
import { useNavigate } from "react-router-dom";
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
      <div className="avatar"> {user.username?.charAt(0)?.toUpperCase()}</div>
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
