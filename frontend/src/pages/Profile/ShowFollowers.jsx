import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./FollowersFollowing.css";
import UserAvatar from "../../componenets/UserAvatar";
import { useNavigate } from "react-router-dom";

const ShowFollowers = ({ userId, onClose }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        // Note: Your backend returns array directly, not {followers: []}
        const res = await API.get(`/users/${userId}/followers`);
        console.log("Followers response:", res.data);

        // Your backend returns array of followers directly
        setFollowers(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        console.error("Followers error:", err);
        setError("Failed to load followers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowers();
    }
  }, [userId]);

  const handleUserClick = (clickedUserId) => {
    navigate(`/profile/${clickedUserId}`);
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="right-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h4>Followers ({followers.length})</h4>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-body">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading followers...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="retry-btn"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && followers.length === 0 && (
            <div className="empty-state">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p>No followers yet</p>
              <small>When someone follows you, they'll appear here</small>
            </div>
          )}

          {!loading &&
            !error &&
            followers.map((user) => (
              <div
                key={user._id}
                className="user-item"
                onClick={() => handleUserClick(user._id)}
              >
                <UserAvatar
                  avatar={user?.avatar?.url}
                  username={user?.username}
                  size={50}
                />
                <div className="user-info">
                  <div className="username">{user.username}</div>
                  {user.email && <div className="user-email">{user.email}</div>}
                </div>
                <button className="view-profile-btn">View Profile</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShowFollowers;
