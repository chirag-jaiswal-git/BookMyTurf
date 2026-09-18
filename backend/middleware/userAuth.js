const userAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  next();
};

export default userAuth;
