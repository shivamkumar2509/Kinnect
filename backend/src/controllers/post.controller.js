const Post = require("../models/post.model");
const { cloudinary } = require("../../cloudConfig.js");
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //only owner can delete the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    //delete image from cloudinary
    if (post.image?.filename) {
      await cloudinary.uploader.destroy(post.image.filename);
    }
    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (e) {
    console.log("deletedPost error: ", e);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
