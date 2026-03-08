import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import PostCard from "../../componenets/PostCard";
import UserAvatar from "../../componenets/UserAvatar";
import { useNavigate } from "react-router-dom";

const SelfProfile = () => {
  const { user } = useAuth();
  const [selfPosts, setSelfPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await API.get("/users/me/posts");
        setSelfPosts(res.data.posts || []);
      } catch (e) {
        console.log("self Profile error:", e);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDeletePost = (postId) => {
    setSelfPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
  };

  if (!user) {
    return <h3 className="text-center mt-5">User not found</h3>;
  }

  return (
    <div className="container mt-5">
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

          <div className="d-flex gap-4 mt-3">
            <div>
              <strong>{selfPosts.length}</strong>
              <div>Posts</div>
            </div>

            <div>
              <strong>{user?.followers?.length || 0}</strong>
              <div>Followers</div>
            </div>

            <div>
              <strong>{user?.following?.length || 0}</strong>
              <div>Following</div>
            </div>
          </div>

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
    </div>
  );
};

export default SelfProfile;
