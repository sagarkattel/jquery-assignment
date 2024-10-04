// import asyncHandler from 'express-async-handler';
import User from "../model/Usermodel.js";
import jwt from 'jsonwebtoken';

export const adminAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);
    if (!authHeader) {
            return res.status(401).json({ message: "No Token is present" });
    }
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    try{
    if (!token)
      return res.status(400).json({ message: "No TOken is Present in header" });
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(400).json({ message: "Invalid Authentication." });
  
    const user = await User.findOne({ _id: decoded._id });
    if (user.role !== "admin") {
      return res.status(400).json({ message: "You are not authorized" });
    }
    next();
}
catch(error){
    console.error("JWT verification error:", error);
    return res.status(400).json({ message: "Invalid Token." });
}
  };
