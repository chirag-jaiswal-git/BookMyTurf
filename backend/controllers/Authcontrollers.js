import userModel from "../models/userModel.js";
import passport from "../config/passport.js";

// ===============================
// SIGNUP
// ===============================

const signup = async (req, res) => {
  try {
    let { name, email, phone, password, confirmPassword } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
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
        message: "Phone number must be exactly 10 digits",
      });
    }

    const existingUser = await userModel.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // Passport Local Mongoose handles password hashing
    const user = new userModel({
      name,
      email,
      phone,
    });

    await userModel.register(user, password);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// LOGIN
// ===============================

const login = (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error("Login Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid email or password",
      });
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        console.error("Session Login Error:", loginError);

        return res.status(500).json({
          success: false,
          message: "Login failed",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.isAdmin,
        },
      });
    });
  })(req, res, next);
};

// ===============================
// ADMIN LOGIN
// ===============================

const adminLogin = (req, res, next) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (
    email !== process.env.ADMIN_EMAIL?.toLowerCase() ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  }

  req.session.isAdmin = true;
  req.session.adminEmail = email;

  return res.status(200).json({
    success: true,
    message: "Admin login successful",
  });
};

export { signup, login, adminLogin };
