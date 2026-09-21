const adminAuth = (req, res, next) => {
  console.log("========== ADMIN AUTH ==========");
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  console.log("isAdmin:", req.session.isAdmin);
  console.log("adminEmail:", req.session.adminEmail);

  if (!req.session.isAdmin) {
    console.log("❌ ADMIN AUTH FAILED");

    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  console.log("✅ ADMIN AUTH PASSED");

  next();
};

export default adminAuth;
