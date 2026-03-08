const router = require("express").Router();
const isAuth = require("../middlewares/auth.middleware");
const multer = require("multer");
const { storage } = require("../../cloudConfig.js");
const upload = multer({ storage });

const {
  getMe,
  updateMe,
  getMyPosts,
  createPost,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserProfile,
  getUserPosts,
  getUserFollowers,
  getUserFollowing,
} = require("../controllers/user.controller");

router.get("/me", isAuth, getMe);
router.put("/me", isAuth, upload.single("avatar"), updateMe);
router.get("/me/posts", isAuth, getMyPosts);
router.post("/me/posts", isAuth, upload.single("image"), createPost);
router.post("/follow/:userId", isAuth, followUser);
router.post("/unfollow/:userId", isAuth, unfollowUser);
router.get("/followers", isAuth, getFollowers);
router.get("/following", isAuth, getFollowing);

router.get("/:userId", isAuth, getUserProfile);
router.get("/:userId/posts", isAuth, getUserPosts);
router.get("/:userId/followers", isAuth, getUserFollowers);
router.get("/:userId/following", isAuth, getUserFollowing);

module.exports = router;
