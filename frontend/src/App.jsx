import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Chat from "./pages/chat/ChatPage";
import Profile from "./pages/Profile/Profile";
import VideoCall from "./pages/videoCall/VideoCall";
import AppLayout from "./layout/AppLayout";
import SelfProfile from "./pages/Profile/SelfProfile";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProtectedRoute from "./componenets/ProtectedRoute";
import EditProfile from "./pages/upload_Edit_Profile/EditProfile";
import UploadPost from "./pages/upload_Edit_Profile/UploadPost";
import { useEffect } from "react";
import socket from "./services/socket.service";
import { useAuth } from "./contexts/AuthContext";
import Settings from "./pages/Settings";
import AiChatBot from "./pages/AiChatBot";

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("🟢 User logged in, connecting socket...");
      socket.connect();

      // Wait for connection before joining rooms
      socket.once("connect", () => {
        console.log("📡 Socket connected, joining user room:", user._id);
        socket.emit("join", user._id);
      });

      // Re-join on reconnect
      const handleReconnect = () => {
        console.log("🔄 Reconnected, joining user room again:", user._id);
        socket.emit("join", user._id);
      };
      socket.on("reconnect", handleReconnect);

      return () => {
        socket.off("reconnect", handleReconnect);
        socket.off("connect");
        socket.disconnect();
        console.log("🔌 Socket disconnected");
      };
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [user]);

  // Handle incoming calls
  useEffect(() => {
    if (!user) return;

    const handleIncomingCall = ({ from }) => {
      console.log("📞 Incoming call from:", from);
      if (window.confirm("Incoming video call. Accept?")) {
        socket.emit("call:accept", { to: from });
        window.location.href = `/video-call/${from}`;
      }
    };

    const handleCallAccepted = () => {
      console.log("✅ Call accepted");
    };

    socket.on("call:incoming", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);

    return () => {
      socket.off("call:incoming", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/selfProfile"
            element={
              <ProtectedRoute>
                <SelfProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/selfProfile/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/selfProfile/editProfile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/selfProfile/uploadPosts"
            element={
              <ProtectedRoute>
                <UploadPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video-call/:userId"
            element={
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-chat"
            element={
              <ProtectedRoute>
                <AiChatBot />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
