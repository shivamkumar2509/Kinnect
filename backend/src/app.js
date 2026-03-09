if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Posts = require("./models/post.model");
const User = require("./models/user.model");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
require("./config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const PORT = process.env.PORT || 8080;
const http = require("http");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const postRoutes = require("./routes/post.routes");
const searchRoutes = require("./routes/search.routes");

const { initSocket } = require("./config/socket");
connectDB();
//middleware
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));
const dbUrl = process.env.ATLASDB_URL;

// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://kinnect-ui.onrender.com"],
    credentials: true,
  }),
);

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: dbUrl,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

// app.use("/uploads", express.static("uploads"));
//passport
app.use(passport.initialize());
app.use(passport.session());
// app.use((req, res, next) => {
//   console.log("REQ.USER:", req.user);
//   next();
// });

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api", postRoutes);
app.use("/api", chatRoutes);
app.use("/api", searchRoutes);
//home page posts route
app.get("/api/posts", async (req, res) => {
  try {
    const allPosts = await Posts.find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    console.log("allPosts:", allPosts.length);
    res.status(200).json(allPosts);
  } catch (e) {
    console.error("API ERROR:", e);
    res.status(500).json({ message: e.message });
  }
});

// Profile posts route
app.get("/api/users/:userId/posts", async (req, res) => {
  try {
    let { userId } = req.params;
    const posts = await Posts.find({ user: userId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    console.log("Profile posts count:", posts.length);

    res.status(200).json({ posts });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//static
app.use(express.static(path.join(__dirname, "dist")));

const server = initSocket(app);
server.listen(PORT, () => {
  console.log(`server is running of port ${PORT}`);
});

module.exports = app;
