import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import PostCard from "../../componenets/PostCard";
import UserAvatar from "../../componenets/UserAvatar";
import { useNavigate } from "react-router-dom";

import ShowFollowers from "./ShowFollowers";
import ShowFollowing from "./ShowFollowing";

const SelfProfile = () => {
  const { user, setUser } = useAuth(); // Only declare this once
  const [selfPosts, setSelfPosts] = useState([]);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await API.get("/users/me");
        console.log("Profile data:", res.data);
        if (setUser) {
          setUser(res.data.user);
        }
      } catch (e) {
        console.log("Profile fetch error:", e);
      }
    };

    const fetchMyPosts = async () => {
      try {
        const res = await API.get("/users/me/posts");
        setSelfPosts(res.data.posts || []);
      } catch (e) {
        console.log("self Profile error:", e);
      }
    };

    fetchMyProfile();
    fetchMyPosts();
  }, []); // Empty dependency array - runs once on mount

  const handleDeletePost = (postId) => {
    setSelfPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
  };

  if (!user) {
    return <h3 className="text-center mt-5">User not found</h3>;
  }

  return (
    <div
      className="container mt-5"
      style={{
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* PROFILE HEADER */}
      <div className="row align-items-center">
        <div className="col-md-4 text-center">
          <UserAvatar
            avatar={user?.avatar?.url}
            username={user?.username}
            size={200}
          />
        </div>

        <div className="col-md-8">
          <h2>{user?.username}</h2>
          <p>{user?.email}</p>

          {/* STATS */}
          <div className="d-flex gap-4 mt-3">
            {/* POSTS */}
            <div>
              <strong>{selfPosts.length}</strong>
              <div>Posts</div>
            </div>

            {/* FOLLOWERS */}
            <div
              onClick={() => {
                console.log("followers clicked");
                setShowFollowers(true);
              }}
              style={{
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              <strong>{user?.followers?.length || 0}</strong>
              <div>Followers</div>
            </div>

            {/* FOLLOWING */}
            <div
              onClick={() => {
                console.log("following clicked");
                setShowFollowing(true);
              }}
              style={{
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              <strong>{user?.following?.length || 0}</strong>
              <div>Following</div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => navigate("/selfProfile/editProfile")}
            >
              Edit Profile
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/selfProfile/uploadPosts")}
            >
              Upload Post
            </button>
          </div>
        </div>
      </div>

      <hr />

      {/* POSTS GRID */}
      <div className="row g-4 mt-2">
        {selfPosts.map((post) => (
          <div className="col-md-4" key={post._id}>
            <PostCard post={post} user={user} onDelete={handleDeletePost} />
          </div>
        ))}
      </div>

      {/* RIGHT SIDEBARS */}
      {showFollowers && (
        <ShowFollowers
          userId={user?._id}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && (
        <ShowFollowing
          userId={user?._id}
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  );
};

export default SelfProfile;
