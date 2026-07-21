import enquiryModel from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/mailer.js";

// ------------------------
// SEND OTP
// ------------------------
const sendOTP = async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    let user = await enquiryModel.findOne({ email });

    // If login and user doesn't exist → error
    if (!user && !name && !phone) {
      return res.status(400).json({ success: false, message: "User not found. Please register first." });
    }

    // If register or first-time, create user
    if (!user && name && phone) {
      user = await enquiryModel.create({
        name,
        email,
        phone,
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt,
    });

    await transporter.sendMail({
      to: email,
      subject: "BookMyTurf Login OTP",
      html: `<h1>${otp}</h1><p>Expires in 5 minutes</p>`,
    });

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------
// VERIFY OTP
// ------------------------
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email });

    if (!record) return res.status(400).json({ success: false, message: "OTP not found" });
    if (record.expiresAt < new Date()) return res.status(400).json({ success: false, message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid OTP" });

    const user = await enquiryModel.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    await OTP.deleteMany({ email });

    const token = jwt.sign({
      email: user.email,
      user_id: user._id,
      name: user.name,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------
// ADMIN LOGIN
// ------------------------
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    }
    res.status(400).json({ success: false, message: "Invalid admin credentials" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export { sendOTP, verifyOTP, adminLogin };