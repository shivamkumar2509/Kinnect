const express = require("express");
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");
const router = express.Router();
const isAuthenticated = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");

router.post("/chat", isAuthenticated, chatController.createChat);

router.get("/chats", isAuthenticated, chatController.getChats);
router.get(
  "/chats/:chatId/messages",
  isAuthenticated,
  chatController.getMessages,
);
router.delete(
  "/chats/:chatId/messages/:messageId",
  isAuthenticated,
  chatController.deleteMessage,
);
module.exports = router;
