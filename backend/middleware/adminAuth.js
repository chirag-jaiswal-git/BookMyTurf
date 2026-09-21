const adminAuth = (req, res, next) => {
  
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
