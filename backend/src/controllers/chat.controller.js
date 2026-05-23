const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");

//create or get existing chat
exports.createChat = async (req, res) => {
  try {
    const { userId } = req.body; // receiver
    const myId = req.user._id; // sender

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [myId, userId] },
    });

    if (!chat) {
      // fetch receiver
      const receiver = await User.findById(userId).select("followers");

      // does receiver follow me?
      const isFollowing = receiver.followers.some(
        (id) => id.toString() === myId.toString(),
      );

      chat = await Chat.create({
        participants: [myId, userId],
        isGroupChat: false,
        isAccepted: isFollowing,
      });
    }

    res.json(chat);
  } catch (e) {
    console.error("CREATE CHAT ERROR:", e);
    res.status(500).json({ message: e.message });
  }
};

//send message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // ensure sender is part of chat
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // accept chat if receiver replies
    if (!chat.isAccepted) {
      chat.isAccepted = true;
    }

    const message = await Message.create({
      chat: chatId,
      sender: userId,
      content,
    });

    chat.lastMessage = message._id;
    await chat.save();

    res.json(message);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

//getMessage
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "_id username avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET /chats
exports.getChats = async (req, res) => {
  const chats = await Chat.find({
    participants: req.user._id,
  })
    .populate("participants", "_id username avatar")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  res.json(chats);
};

exports.deleteMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // FIX: proper ObjectId comparison
    const isParticipant = chat.participants.some(
      (id) => id.toString() === userId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender can delete
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You can only delete your own message",
      });
    }

    await Message.findByIdAndDelete(messageId);

    // update lastMessage safely
    if (chat.lastMessage?.toString() === messageId) {
      const lastMsg = await Message.findOne({ chat: chatId }).sort({
        createdAt: -1,
      });

      chat.lastMessage = lastMsg ? lastMsg._id : null;
      await chat.save();
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (e) {
    console.error("DELETE MESSAGE ERROR:", e);
    return res.status(500).json({ message: e.message });
  }
};
