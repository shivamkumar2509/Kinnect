const User = require("../models/user.model");

exports.search = async (req, res) => {
  try {
    const { name } = req.query;

    const user = await User.findOne({ username: name });

    if (user) {
      res.json({ exists: true, user });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
