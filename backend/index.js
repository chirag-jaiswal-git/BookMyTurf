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

connectDB();
connectCloudinary();

// ===============================
// CORS
// ===============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true,
  })
);


// ===============================
// BODY PARSER
// ===============================
app.use(
  express.json({
    limit: "1mb",
  }),
);



// ===============================
// API ROUTES
// ===============================
app.use("/auth", AuthRouter);
app.use("/venue", venueRouter);
app.use("/booking", bookingRouter);

app.get("/", (req, res) => {
  res.send("BookMyTurf Backend is running successfully 🚀");
});

// ===============================
// CREATE HTTP SERVER
// ===============================
const server = http.createServer(app);

// ===============================
// SOCKET.IO
// ===============================
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);



// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
