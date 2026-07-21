let io;

export const initSocket = (socketInstance) => {
  io = socketInstance;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};