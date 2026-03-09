const http = require("http");
const { Server } = require("socket.io");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const { connectSocket } = require("../controllers/call.controller");

let io;

function initSocket(app) {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://kinnect-ui.onrender.com"],
      credentials: true,
    },
  });

  connectSocket(io);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    //joing personal room
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    //send message
    socket.on("send_message", async (data) => {
      const { senderId, receiverId, content } = data;

      let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
        isGroupChat: false, //for non group chat it should be false..
      });
      if (!chat) {
        chat = await Chat.create({
          participants: [senderId, receiverId],
        });
      }
      const message = await Message.create({
        chat: chat._id,
        sender: senderId,
        content,
      });
      chat.lastMessage = message._id;
      await chat.save();

      io.to(senderId).to(receiverId).emit("receive_message", {
        chatId: chat._id,
        senderId,
        content,
        createdAt: message.createdAt,
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
  return server;
}

//export getter
function getIO() {
  if (!io) {
    console.error("socket.io not initialized");
    return null;
  }
  return io;
}

module.exports = { initSocket, getIO };
