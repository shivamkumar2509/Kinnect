const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/post.model");

const usersData = require("./users");
const postsData = require("./post");

const seedDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/kinnect");
    console.log("DB connected");

    await User.deleteMany();
    await Post.deleteMany();

    const users = await User.insertMany(usersData);
    const userIds = users.map((u) => u._id);

    const postsWithRelations = postsData.map((post, index) => ({
      image: post.image,
      country: post.country,
      commentsCount: post.commentsCount,
      likes: userIds.slice(0, post.likesCount),
      user: userIds[index % userIds.length],
    }));

    await Post.insertMany(postsWithRelations);

    console.log(" Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error(" Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
