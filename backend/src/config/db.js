const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUrl = process.env.ATLASDB_URL;
    // await mongoose.connect("mongodb://127.0.0.1:27017/kinnect");
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected");
  } catch (e) {
    console.log("DB error: ", e);
  }
};

module.exports = connectDB;
