import enquiryModel from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/mailer.js";

// =====================================================
// SEND OTP
// =====================================================

const sendOTP = async (req, res) => {
  try {
    let { email, name, phone } = req.body;

    // --------------------------------
    // Clean input
    // --------------------------------

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

    console.log("🔍 Checking user:", email);

    let user = await enquiryModel.findOne({ email });

    console.log("👤 User found:", user ? "YES" : "NO");

    // --------------------------------
    // 4. Existing user
    // --------------------------------

    if (user) {
      // Existing user is logging in.
      // Do not overwrite their profile information.

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

      console.log("✅ New user created:", email);
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
            60 - secondsSinceCreation
          )} seconds before requesting another OTP`,
        });
      }
    }

    // --------------------------------
    // 7. Generate secure OTP
    // --------------------------------

    const otp = crypto.randomInt(100000, 1000000).toString();

    console.log("🔐 OTP generated for:", email);

    const hashedOTP = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // --------------------------------
    // 8. Delete previous OTP
    // --------------------------------

    await OTP.deleteMany({ email });

    // --------------------------------
    // 9. Save new OTP
    // --------------------------------

    await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt,
      attempts: 0,
    });

    console.log("✅ OTP saved to database");

    // --------------------------------
    // 10. Send OTP using Resend
    // --------------------------------

    try {
      console.log("📤 Sending OTP email to:", email);

      await sendOTPEmail({
        to: email,
        otp,
      });

      console.log("✅ OTP email sent successfully");
    } catch (emailError) {
      console.error("❌ OTP Email Error:", emailError);

      // Remove OTP if email could not be sent
      await OTP.deleteMany({ email });

      // If this was a new registration,
      // remove the newly created user
      if (isNewUser) {
        await enquiryModel.deleteOne({
          _id: user._id,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP. Please try again.",
      });
    }

    // --------------------------------
    // 11. Success response
    // --------------------------------

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("❌ SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// VERIFY OTP
// =====================================================

const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;

    // --------------------------------
    // Clean input
    // --------------------------------

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
    // 3. Check OTP expiration
    // --------------------------------

    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: record._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // --------------------------------
    // 4. Check maximum attempts
    // --------------------------------

    if (record.attempts >= 5) {
      await OTP.deleteOne({
        _id: record._id,
      });

      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // --------------------------------
    // 5. Compare OTP
    // --------------------------------

    const isMatch = await bcrypt.compare(
      otp,
      record.otp
    );

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

    const user = await enquiryModel.findOne({
      email,
    });

    if (!user) {
      await OTP.deleteOne({
        _id: record._id,
      });

      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // --------------------------------
    // 7. Delete OTP after successful login
    // --------------------------------

    await OTP.deleteOne({
      _id: record._id,
    });

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
      }
    );

    // --------------------------------
    // 9. Login response
    // --------------------------------

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
    console.error("❌ VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// ADMIN LOGIN
// =====================================================

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

    // --------------------------------
    // 2. Get admin email
    // --------------------------------

    const adminEmail =
      process.env.ADMIN_EMAIL?.trim().toLowerCase();

    // --------------------------------
    // 3. Verify admin credentials
    // --------------------------------

    if (
      email !== adminEmail ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // --------------------------------
    // 4. Generate admin JWT
    // --------------------------------

    const token = jwt.sign(
      {
        email: adminEmail,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    // --------------------------------
    // 5. Admin login response
    // --------------------------------

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("❌ ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

export {
  sendOTP,
  verifyOTP,
  adminLogin,
};
```

### Also make sure `mailer.js` is this

```js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async ({ to, otp }) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [to],
    subject: "BookMyTurf Login OTP",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 40px auto;
        padding: 30px;
        background: #f5f5f5;
        border-radius: 12px;
      ">

        <div style="
          background: white;
          padding: 30px;
          border-radius: 12px;
        ">

          <h2 style="margin-top: 0;">
            BookMyTurf
          </h2>

          <p>
            Your OTP for login is:
          </p>

          <h1 style="
            font-size: 36px;
            letter-spacing: 8px;
            margin: 25px 0;
          ">
            ${otp}
          </h1>

          <p>
            This OTP will expire in
            <strong>5 minutes</strong>.
          </p>

          <p>
            Do not share this OTP with anyone.
          </p>

          <p style="
            color: #777;
            margin-top: 30px;
          ">
            If you did not request this OTP,
            you can safely ignore this email.
          </p>

        </div>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Resend Email Error:", error);
    throw new Error(
      error.message || "Failed to send email"
    );
  }

  console.log("✅ Resend email sent:", data?.id);

  return data;
};
