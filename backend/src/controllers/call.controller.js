const connectSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User registers himself
    socket.on("join", (userId) => {
      socket.userId = userId;
      socket.join(userId);
      console.log(`User ${userId} registered`);
    });

    // Call request
    socket.on("call:user", ({ to }) => {
      io.to(to).emit("call:incoming", {
        from: socket.userId,
      });
    });

    // Call accepted
    socket.on("call:accept", ({ to }) => {
      io.to(to).emit("call:accepted", {
        from: socket.userId,
      });
    });

    // WebRTC offer
    socket.on("webrtc:offer", ({ to, offer }) => {
      io.to(to).emit("webrtc:offer", {
        from: socket.userId,
        offer,
      });
    });

    // WebRTC answer
    socket.on("webrtc:answer", ({ to, answer }) => {
      io.to(to).emit("webrtc:answer", {
        from: socket.userId,
        answer,
      });
    });

    // ICE candidates
    socket.on("webrtc:ice", ({ to, candidate }) => {
      io.to(to).emit("webrtc:ice", {
        from: socket.userId,
        candidate,
      });
    });

    // Call ended
    socket.on("call:end", ({ to }) => {
      io.to(to).emit("call:ended", {
        from: socket.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  });
};

module.exports = { connectSocket };
