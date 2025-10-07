import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder, userOrders } from "../controllers/orderController.js";


const router = express.Router();

// 🛒 Place order
router.post("/place", authMiddleware, placeOrder);

// 💳 Verify payment
router.post("/verify", verifyOrder);

// 📦 Get user orders
router.post("/userorders", authMiddleware, userOrders);

export default router;
