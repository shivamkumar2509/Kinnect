import React, { useEffect, useState } from "react";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import InsertCommentSharpIcon from "@mui/icons-material/InsertCommentSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import socket from "../services/socket.service";
import API from "../services/api";
import UserAvatar from "./UserAvatar";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post, user, onDelete }) => {
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(
    user ? (post.likes || []).includes(user._id) : false,
  );

  // Menu state (three dots)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = async () => {
    handleMenuClose();
    try {
      await API.delete(`/posts/${post._id}`);

      if (onDelete) {
        onDelete(post._id);
      }
    } catch (e) {
      console.log("error from handleDeletePost:", e);
    }
  };

  // auth guard
  const requireAuth = (action) => {
    if (!user) {
      alert("please login to continue");
      navigate("/login");
      return;
    }
    action();
  };

  const goToUserProfile = () => {
    navigate(`/profile/${post?.user?._id}`);
  };

  const handleLike = async () => {
    // if (liked) {
    //   setLiked(false);
    //   setLikes((prev) => prev.filter((id) => id !== user._id));
    // } else {
    //   setLiked(true);
    //   setLikes((prev) => [...prev, user._id]);
    // }

    // try {
    //   await API.post(`/posts/${post._id}/like`);
    // } catch (e) {
    //   //rollback if API fails
    //   if (liked) {
    //     setLiked(true);
    //     setLikes((prev) => [...prev, user._id]);
    //   } else {
    //     setLiked(false);
    //     setLikes((prev) => prev.filter((id) => id !== user._id));
    //   }
    // }
    requireAuth(async () => {
      const wasLiked = liked;

      setLiked(!wasLiked);
      setLikes((prev) =>
        wasLiked ? prev.filter((id) => id !== user._id) : [...prev, user._id],
      );

      try {
        await API.post(`/posts/${post._id}/like`);
      } catch (e) {
        // rollback
        setLiked(wasLiked);
        setLikes((prev) =>
          wasLiked ? [...prev, user._id] : prev.filter((id) => id !== user._id),
        );
      }
    });
  };

  useEffect(() => {
    const handleLikeUpdate = ({ postId, likes }) => {
      if (postId === post._id) {
        setLikes(likes);
        setLiked(user ? likes.includes(user._id) : false);
      }
    };

    socket.on("post-like-updated", handleLikeUpdate);
    return () => socket.off("post-like-updated", handleLikeUpdate);
  }, [post._id, user]);

  const handleComment = () => {
    requireAuth(() => {
      console.log("Open comments for:", post._id);
    });
  };

  return (
    <div className="card post-card shadow-sm">
      {/* Header */}
      <div className="card-header d-flex align-items-center bg-white">
        <UserAvatar
          avatar={post?.user?.avatar?.url}
          username={post?.user?.username}
          size={40}
          onClick={goToUserProfile}
        />

        <div className="ms-2 flex-grow-1">
          <strong style={{ cursor: "pointer" }} onClick={goToUserProfile}>
            {post?.user?.username}
          </strong>
        </div>

        <MoreVertIcon style={{ cursor: "pointer" }} onClick={handleMenuOpen} />
      </div>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        {user && user._id === post?.user?._id && (
          <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>Report</MenuItem>
      </Menu>

      {/* Post Image */}
      {post?.image?.url && (
        <img
          src={post.image.url}
          className="card-img-top post-img"
          alt={post?.user?.username}
          style={{ cursor: "pointer" }}
          onClick={goToUserProfile}
        />
      )}

      {/* Body */}
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center">
          <button className="btn p-0 me-3" onClick={handleLike}>
            {liked ? (
              <FavoriteSharpIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderSharpIcon />
            )}
            {likes.length}
          </button>

          <div className="position-relative">
            <button
              className="btn p-0 position-relative"
              onClick={handleComment}
            >
              <InsertCommentSharpIcon />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {post.commentsCount}
              </span>
            </button>
          </div>

          <div className="ms-auto fw-bold">{post.country}</div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
