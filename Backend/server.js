import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import medicineRouter from "./routes/medicineroute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js"; // In case you use a cart

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json

// DB connection
connectDB();

// Serve uploads folder so images can be accessed via URL
// Example: http://localhost:4000/uploads/medicine_1.png
app.use("/uploads", express.static("uploads"));

// API endpoints
app.use("/api/medicine", medicineRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter); // Include this if you have cart routes

// Test route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
