const express = require("express");
const Post = require("../models/post.model");
const authMiddleware = require("../middlewares/auth.middleware");
const { getIO } = require("../config/socket");
const isAuth = require("../middlewares/auth.middleware");
const { deletePost } = require("../controllers/post.controller");
const router = express.Router();

router.post("/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json("Unauthorized");
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found");
    }

    const alreadyLiked = post.likes.some((id) => id.equals(userId));

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => !id.equals(userId));
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const io = getIO();
    if (io) {
      io.emit("post-like-updated", {
        postId: post._id.toString(),
        likes: post.likes.map((id) => id.toString()),
      });
    }

    return res.json({
      success: true,
      likes: post.likes.length,
    });
  } catch (e) {
    console.error("LIKE ROUTE ERROR:", e);
    return res.status(500).json("Server error");
  }
});

router.delete("/posts/:postId", isAuth, deletePost);

module.exports = router;
