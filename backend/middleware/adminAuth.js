import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token =
      req.headers.token ||
      (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (
      decoded.role !== "admin" ||
      decoded.email?.toLowerCase() !== adminEmail
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
};

export default adminAuth;
