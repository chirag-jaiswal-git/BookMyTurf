import express from "express";
import rateLimit from "express-rate-limit";

import {
  sendOTP,
  verifyOTP,
  adminLogin,
} from "../controllers/Authcontrollers.js";

const router = express.Router();

// ------------------------
// OTP SEND RATE LIMIT
// ------------------------
// Maximum 10 OTP requests from one IP
// within 15 minutes.
const sendOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

// ------------------------
// OTP VERIFY RATE LIMIT
// ------------------------
// Maximum 20 verification attempts from one IP
// within 15 minutes.
const verifyOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP verification attempts. Please try again later.",
  },
});

// ------------------------
// ADMIN LOGIN RATE LIMIT
// ------------------------
// Maximum 10 admin login attempts from one IP
// within 15 minutes.
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// All routes prefixed with /auth

router.post("/send-otp", sendOTPLimiter, sendOTP);

router.post("/verify-otp", verifyOTPLimiter, verifyOTP);

router.post("/admin", adminLoginLimiter, adminLogin);

export default router;
