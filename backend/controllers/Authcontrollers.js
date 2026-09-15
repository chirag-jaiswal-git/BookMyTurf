import enquiryModel from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/mailer.js";

// ===============================
// SEND OTP
// ===============================
const sendOTP = async (req, res) => {
  try {
    let { email, name, phone } = req.body;

    email = email?.trim().toLowerCase();
    name = name?.trim();
    phone = phone?.trim();

    // --------------------------------
    // 1. Validate email
    // --------------------------------
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // --------------------------------
    // 2. Validate phone
    // --------------------------------
    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits",
      });
    }

    // --------------------------------
    // 3. Find existing user
    // --------------------------------
    let user = await enquiryModel.findOne({ email });

    // --------------------------------
    // 4. Existing user
    // --------------------------------
    if (user) {
      // Login only.
      // Do not overwrite existing profile details.
      if (name && name.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must contain at least 2 characters",
        });
      }
    }

    // --------------------------------
    // 5. New user registration
    // --------------------------------
    let isNewUser = false;

    if (!user) {
      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message:
            "Name and 10-digit phone number are required for registration",
        });
      }

      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 100 characters",
        });
      }

      user = await enquiryModel.create({
        name,
        email,
        phone,
      });

      isNewUser = true;
    }

    // --------------------------------
    // 6. OTP resend cooldown
    // --------------------------------
    const existingOTP = await OTP.findOne({ email });

    if (existingOTP) {
      const secondsSinceCreation =
        (Date.now() - existingOTP.createdAt.getTime()) / 1000;

      if (secondsSinceCreation < 60) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${Math.ceil(
            60 - secondsSinceCreation,
          )} seconds before requesting another OTP`,
        });
      }
    }

    // --------------------------------
    // 7. Generate secure OTP
    // --------------------------------
    const otp = crypto.randomInt(100000, 1000000).toString();

    const hashedOTP = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // --------------------------------
    // 8. Replace previous OTP
    // --------------------------------
    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt,
      attempts: 0,
    });

    // --------------------------------
    // 9. Send OTP email
    // --------------------------------
    try {
      await transporter.sendMail({
        to: email,
        subject: "BookMyTurf Login OTP",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px">
            <h2>BookMyTurf</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>This OTP will expire in 5 minutes.</p>

            <p>Do not share this OTP with anyone.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("OTP Email Error:", emailError);

      // Remove OTP
      await OTP.deleteMany({ email });

      // If this was a new registration,
      // remove the user as well.
      if (isNewUser) {
        await enquiryModel.deleteOne({ _id: user._id });
      }

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// VERIFY OTP
// ===============================
const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email?.trim().toLowerCase();
    otp = otp?.trim();

    // --------------------------------
    // 1. Validate input
    // --------------------------------
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits",
      });
    }

    // --------------------------------
    // 2. Find OTP
    // --------------------------------
    const record = await OTP.findOne({ email });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // --------------------------------
    // 3. Check expiration
    // --------------------------------
    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: record._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // --------------------------------
    // 4. Check maximum attempts
    // --------------------------------
    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // --------------------------------
    // 5. Compare OTP hash
    // --------------------------------
    const isMatch = await bcrypt.compare(otp, record.otp);

    if (!isMatch) {
      record.attempts += 1;

      await record.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // --------------------------------
    // 6. Find user
    // --------------------------------
    const user = await enquiryModel.findOne({ email });

    if (!user) {
      await OTP.deleteOne({ _id: record._id });

      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // --------------------------------
    // 7. Delete OTP after successful use
    // --------------------------------
    await OTP.deleteOne({ _id: record._id });

    // --------------------------------
    // 8. Generate JWT
    // --------------------------------
    const token = jwt.sign(
      {
        email: user.email,
        user_id: user._id.toString(),
        name: user.name,
        role: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// ADMIN LOGIN
// ===============================
const adminLogin = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // --------------------------------
    // 1. Validate input
    // --------------------------------
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    // --------------------------------
    // 2. Verify credentials
    // --------------------------------
    if (email !== adminEmail || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // --------------------------------
    // 3. Generate admin JWT
    // --------------------------------
    const token = jwt.sign(
      {
        email: adminEmail,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { sendOTP, verifyOTP, adminLogin };
