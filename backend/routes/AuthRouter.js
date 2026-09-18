import express from "express";
import passport from "passport";

import userModel from "../models/userModel.js";
import { adminLogin } from "../controllers/Authcontrollers.js";

const router = express.Router();

// ===============================
// USER SIGNUP
// ===============================

router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
    });

    // Passport Local Mongoose handles password hashing
    await userModel.register(newUser, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ===============================
// USER LOGIN
// ===============================

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error("Passport authentication error:", error);
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid email or password",
      });
    }

    req.logIn(user, (error) => {
      if (error) {
        console.error("Session login error:", error);
        return next(error);
      }

      console.log("Logged-in user:", user._id);
      console.log("Login session:", req.session);

      req.session.save((error) => {
        if (error) {
          console.error("Session save error:", error);

          return res.status(500).json({
            success: false,
            message: "Failed to save login session",
          });
        }

        console.log("Session saved successfully:", req.session);

        return res.status(200).json({
          success: true,
          message: "Login successful",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
        });
      });
    });
  })(req, res, next);
});

// ===============================
// USER LOGOUT
// ===============================

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  });
});

// ===============================
// GET CURRENT USER
// ===============================

router.get("/me", (req, res) => {
   console.log("Session ID:", req.sessionID);
   console.log("Session:", req.session);
   console.log("Authenticated:", req.isAuthenticated());
   console.log("User:", req.user);
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
    },
  });
});

router.post("/admin", adminLogin);

router.get("/admin/me", (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Admin session is active",
    adminEmail: req.session.adminEmail,
  });
});

router.post("/admin/logout", (req, res) => {
  req.session.isAdmin = false;
  req.session.adminEmail = null;

  return res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
});

export default router;