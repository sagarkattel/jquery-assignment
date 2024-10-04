import User from "../model/Usermodel.js";
import jwt from "jsonwebtoken";

export const userAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);

  try {
    if (!authHeader) {
      return res.status(401).json({ message: "No Token is present" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    console.log("Extracted token:", token);

    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findOne({ _id: decoded._id });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};