import React from "react";
import PostCard from "../../componenets/PostCard";
import API from "../../services/api";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get("/posts");

        setPosts(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchListings();
  }, []);

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
  };
  return (
    <div className="container-fluid mt-2">
      <div className="row g-4">
        {posts.map((post) => (
          <div className="col-md-4" key={post._id}>
            <PostCard post={post} user={user} onDelete={handleDeletePost} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
