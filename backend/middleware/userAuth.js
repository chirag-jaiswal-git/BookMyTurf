const userAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Please login first",
  });
};

export default userAuth;
