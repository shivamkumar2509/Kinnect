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

function App() {
  const { user } = useAuth(); //logged-in user

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit("join", user._id);
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  //add this effect (call listeners)
  useEffect(() => {
    if (!user) {
      return;
    }
    socket.on("call:incoming", ({ from }) => {
      if (window.confirm("Incoming video call. Accept?")) {
        socket.emit("call:accept", { to: from });
        window.location.href = `/video-call/${from}`;
      }
    });

    socket.on("call:accepted", () => {
      console.log("call accepted");
    });
    return () => {
      socket.off("call:incoming");
    };
  }, [user]);
  return (
    <>
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
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
