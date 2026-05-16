import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./FollowersFollowing.css";
import UserAvatar from "../../componenets/UserAvatar";
import { useNavigate } from "react-router-dom";

const ShowFollowing = ({ userId, onClose }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        // Your backend returns array directly
        const res = await API.get(`/users/${userId}/following`);
        console.log("Following response:", res.data);

        // Your backend returns array of following directly
        setFollowing(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        console.error("Following error:", err);
        setError("Failed to load following. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowing();
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
          <h4>Following ({following.length})</h4>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-body">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading following...</p>
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

          {!loading && !error && following.length === 0 && (
            <div className="empty-state">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <p>Not following anyone yet</p>
              <small>When you follow someone, they'll appear here</small>
            </div>
          )}

          {!loading &&
            !error &&
            following.map((user) => (
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

export default ShowFollowing;
