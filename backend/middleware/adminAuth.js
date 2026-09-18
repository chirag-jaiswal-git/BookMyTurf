const adminAuth = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  next();
};

export default adminAuth;
