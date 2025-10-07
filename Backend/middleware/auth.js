// middleware/auth.js
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export default async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = header.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err?.message || err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
