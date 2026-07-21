import express from "express";
import cors from "cors";
import "dotenv/config.js";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket.js";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import AuthRouter from "./routes/AuthRouter.js";
import venueRouter from "./routes/venueRouter.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
connectCloudinary();

app.use("/auth", AuthRouter);
app.use("/venue", venueRouter);
app.use("/booking", bookingRouter);

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

io.on("connection", (socket) => {
 // console.log("Admin Connected:", socket.id);

  socket.on("disconnect", () => {
 //   console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});