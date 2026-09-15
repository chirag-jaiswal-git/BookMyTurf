let io;

export const initSocket = (socketInstance) => {
  io = socketInstance;

  io.on("connection", (socket) => {
   // console.log("Socket connected:", socket.id);

    socket.on("join-admin", () => {
      socket.join("admins");
     // console.log("Admin joined:", socket.id);
    });

    socket.on("disconnect", () => {
     // console.log("Socket disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};
