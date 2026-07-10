const http = require("http");
const { Server } = require("socket.io");
const { connectSocket } = require("../controllers/call.controller");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

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

    // personal room
    socket.on("join", (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`User ${userId} joined personal room`);
      }
    });

    // chat room
    socket.on("join_chat", (chatId) => {
      if (chatId) {
        socket.join(chatId.toString());
        console.log(`User ${socket.id} joined chat room ${chatId}`);
      }
    });

    // Handle sending messages via socket (optional - if you want to support both HTTP and Socket)
    socket.on("send_message", async (data) => {
      try {
        console.log("Socket send_message received:", data);

        const { senderId, receiverId, content, chatId } = data;

        if (!senderId || !content) {
          socket.emit("message_error", { error: "Missing required fields" });
          return;
        }

        let chat;

        // If chatId is provided, use existing chat
        if (chatId) {
          chat = await Chat.findById(chatId);
          if (!chat) {
            socket.emit("message_error", { error: "Chat not found" });
            return;
          }
        } else if (receiverId) {
          // Find or create chat
          chat = await Chat.findOne({
            isGroupChat: false,
            participants: { $all: [senderId, receiverId] },
          });

          if (!chat) {
            chat = await Chat.create({
              participants: [senderId, receiverId],
              isGroupChat: false,
            });
          }
        } else {
          socket.emit("message_error", {
            error: "Missing chatId or receiverId",
          });
          return;
        }

        // Create message
        const message = await Message.create({
          chat: chat._id,
          sender: senderId,
          content: content.trim(),
        });

        await message.populate("sender", "_id username avatar");

        chat.lastMessage = message._id;
        await chat.save();

        // Emit to chat room
        const chatIdStr = chat._id.toString();
        io.to(chatIdStr).emit("receive_message", {
          _id: message._id,
          chatId: chatIdStr,
          sender: message.sender,
          content: message.content,
          createdAt: message.createdAt,
        });

        // Also emit to both participants individually (as a fallback)
        chat.participants.forEach((participantId) => {
          io.to(participantId.toString()).emit("receive_message", {
            _id: message._id,
            chatId: chatIdStr,
            sender: message.sender,
            content: message.content,
            createdAt: message.createdAt,
          });
        });

        console.log("Message sent successfully:", message._id);
      } catch (error) {
        console.error("Socket send_message error:", error);
        socket.emit("message_error", { error: error.message });
      }
    });

    // Leave chat room
    socket.on("leave_chat", (chatId) => {
      if (chatId) {
        socket.leave(chatId.toString());
        console.log(`User ${socket.id} left chat room ${chatId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  app.set("io", io);

  return server;
}

function getIO() {
  if (!io) {
    throw new Error("Socket not initialized. Call initSocket first.");
  }
  return io;
}

module.exports = {
  initSocket,
  getIO,
};
