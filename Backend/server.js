// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import medicineRouter from "./routes/medicineroute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --------------------------
// Middleware
// --------------------------
app.use(express.json());

// ✅ CORS setup for local + deployed frontend
const allowedOrigins = [
  "http://localhost:5173", // Local dev
  process.env.FRONTEND_URL || "https://my-clitoria-project.web.app" // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy: Origin not allowed"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// --------------------------
// Connect to MongoDB
// --------------------------
connectDB();

// --------------------------
// Serve static files
// --------------------------
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("uploads"));

// --------------------------
// API Routes
// --------------------------
app.use("/api/medicine", medicineRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// --------------------------
// Test route
// --------------------------
app.get("/", (req, res) => res.send("✅ API Working Fine"));

// --------------------------
// Start server (only once!)
// --------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
