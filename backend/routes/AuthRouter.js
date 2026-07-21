import express from 'express';
const router = express.Router();

import { sendOTP, verifyOTP, adminLogin } from "../controllers/Authcontrollers.js";

// All routes prefixed with /auth
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/admin", adminLogin);

export default router;