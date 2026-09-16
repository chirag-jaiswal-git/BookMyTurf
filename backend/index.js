import express from "express";
import cors from "cors";
import "dotenv/config.js";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { initSocket } from "./socket.js";

import passport from "./config/passport.js";

import AuthRouter from "./routes/AuthRouter.js";
import venueRouter from "./routes/venueRouter.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();

app.set("trust proxy", 1);

// ===============================
// DATABASE & CLOUDINARY
// ===============================

connectDB();
connectCloudinary();

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://book-my-turf-jta8.vercel.app",
  "https://book-my-turf-fawn.vercel.app",
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

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  }),
);

// ===============================
// BODY PARSER
// ===============================

app.use(express.json());

// ===============================
// PASSPORT
// ===============================

app.use(passport.initialize());

// ===============================
// API ROUTES
// ===============================

app.use("/auth", AuthRouter);

app.use("/venue", venueRouter);

app.use("/booking", bookingRouter);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("BookMyTurf Backend is running successfully 🚀");
});

// ===============================
// HTTP SERVER
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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
