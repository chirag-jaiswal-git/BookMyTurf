import express from "express";
import cors from "cors";
import "dotenv/config.js";
import http from "http";
import session from "express-session";
import passport from "./config/passport.js";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";

// Database & Cloudinary
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Socket
import { initSocket } from "./socket.js";

// Routes
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
app.use(express.urlencoded({ extended: true }));

// ===============================
// SESSION
// ===============================

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

// ===============================
// PASSPORT
// ===============================

app.use(passport.initialize());
app.use(passport.session());

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
