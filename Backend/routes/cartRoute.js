import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ match filename

const router = express.Router();

// 🛒 Cart Routes (all protected with auth)
router.post("/get", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.post("/remove", authMiddleware, removeFromCart);

export default router;
