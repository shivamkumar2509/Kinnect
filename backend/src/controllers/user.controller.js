const User = require("../models/user.model");
const Posts = require("../models/post.model");
const { cloudinary } = require("../../cloudConfig.js");
//current logged in user
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "following",
    "username avatar",
  );
  res.json({ user });
};

exports.createPost = async (req, res) => {
  try {
    if (!req.file || !req.body.country) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const { country } = req.body;

    const post = await Posts.create({
      image: {
        filename: req.file.filename,
        url: req.file.path,
      },
      country,
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Post uploaded successfully",
      post,
    });
  } catch (e) {
    console.log("createPost error: ", e);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// exports.createPost = async (req, res) => {
//   try {
//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);

//     // just send file details to browser
//     return res.send({
//       message: "File received successfully",
//       file: req.file,
//       body: req.body,
//     });
//   } catch (e) {
//     console.log("createPost error:", e);
//     res.status(500).json({ message: "Failed to upload post" });
//   }
// };
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, removeAvatar } = req.body;

    const updateData = {};

    // username update
    if (username && username.trim() !== "") {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "username already taken",
        });
      }

      updateData.username = username;
    }

    const user = await User.findById(userId);

    // remove avatar
    if (removeAvatar === "true") {
      if (user.avatar?.filename) {
        await cloudinary.uploader.destroy(user.avatar.filename);
      }

      updateData.avatar = {
        filename: "",
        url: "",
      };
    }

    // upload new avatar
    if (req.file) {
      // delete old avatar first
      if (user.avatar?.filename) {
        await cloudinary.uploader.destroy(user.avatar.filename);
      }

      updateData.avatar = {
        filename: req.file.filename,
        url: req.file.path,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.log("update page error:", e);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Posts.find({ user: userId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (e) {
    console.log("getMyPosts error: ", e);
    res.status(500).json({ message: "Failed to fetch my posts" });
  }
};

//follow user
exports.followUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const targetUserId = req.params.userId;
    if (loggedInUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "you cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //already following
    if (targetUser.followers.includes(loggedInUserId)) {
      return res.status(400).json({ message: "Already following" });
    }

    //add relation
    await User.findByIdAndUpdate(loggedInUserId, {
      $push: { following: targetUserId },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: loggedInUserId },
    });
    res.json({ message: "User followed successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//unfollow user
exports.unfollowUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const targetUserId = req.params.userId;

    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    res.json({ message: "User unfollowed successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//get followers
exports.getFollowers = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "followers",
    "username email",
  );
  res.json(user.followers);
};

//get following
exports.getFollowing = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "following",
    "username email",
  );
  res.json(user.following);
};

//for other persons
//get other user's public profile
exports.getUserProfile = async (req, res) => {
  try {
    const profileUserId = req.params.userId;
    const user = await User.findById(profileUserId).select(
      "username avatar followers following",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isFollowing = user.followers.includes(req.user._id);
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// get other user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Posts.find({ user: req.params.userId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
};
// get other user's followers
exports.getUserFollowers = async (req, res) => {
  const user = await User.findById(req.params.userId).populate(
    "followers",
    "username avatar",
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.followers);
};
// get other user's following
exports.getUserFollowing = async (req, res) => {
  const user = await User.findById(req.params.userId).populate(
    "following",
    "username avatar",
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.following);
};
