import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    // 2. Must be in the format: "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res.status(401).json({ success: false, message: "Invalid Authorization header format" });
    }

    // 3. Extract token
    const token = parts[1];

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(403).json({ success: false, message: "Invalid token payload" });
    }

    // 5. Attach userId from token → controller can use req.userId
    req.userId = decoded.id;

    // 6. Continue
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
