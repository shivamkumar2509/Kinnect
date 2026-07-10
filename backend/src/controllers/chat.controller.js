const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const { getIO } = require("../config/socket");

// create or get existing chat
exports.createChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const myId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        message: "userId required",
      });
    }

    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: {
        $all: [myId, userId],
      },
    });

    if (!chat) {
      const receiver = await User.findById(userId).select("followers");

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

    res.status(500).json({
      message: e.message,
    });
  }
};

// send message
exports.sendMessage = async (req, res) => {
  console.log("SEND MESSAGE CONTROLLER HIT");
  try {
    const { chatId, content } = req.body;

    const userId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const isParticipant = chat.participants.some(
      (id) => id.toString() === userId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    const message = await Message.create({
      chat: chatId,
      sender: userId,
      content,
    });

    await message.populate("sender", "_id username avatar");

    chat.lastMessage = message._id;
    await chat.save();

    // socket emit
    const io = getIO();

    io.to(chatId.toString()).emit("receive_message", {
      _id: message._id,
      chatId: chatId.toString(),
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt,
    });

    res.json(message);
  } catch (e) {
    console.error("SEND MESSAGE ERROR:", e);

    res.status(500).json({
      message: e.message,
    });
  }
};

// get messages
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const userId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const isParticipant = chat.participants.some(
      (id) => id.toString() === userId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const messages = await Message.find({
      chat: chatId,
    })
      .populate("sender", "_id username avatar")
      .sort({
        createdAt: 1,
      });

    res.json(messages);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

// get chats
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "_id username avatar")
      .populate("lastMessage")
      .sort({
        updatedAt: -1,
      });

    res.json(chats);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

// delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const userId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const isParticipant = chat.participants.some(
      (id) => id.toString() === userId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    await message.deleteOne();

    if (chat.lastMessage?.toString() === messageId) {
      const lastMsg = await Message.findOne({
        chat: chatId,
      }).sort({
        createdAt: -1,
      });

      chat.lastMessage = lastMsg ? lastMsg._id : null;

      await chat.save();
    }

    // notify both users
    const io = getIO();

    io.to(chatId.toString()).emit("message_deleted", {
      messageId,
    });

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (e) {
    console.error("DELETE MESSAGE ERROR:", e);

    res.status(500).json({
      message: e.message,
    });
  }
};
