import { io } from "socket.io-client";

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(backendURL, {
  autoConnect: true,
  withCredentials: true,
});

export default socket;
