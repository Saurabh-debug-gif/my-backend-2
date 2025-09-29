// controllers/userController.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/jwt.js";

// =============================
// Register a new user
// =============================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = createToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: "✅ User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error registering user",
    });
  }
};

// =============================
// Login user
// =============================
export const loginUser = async (req, res) => {
  try {
    console.log("LOGIN REQUEST BODY:", req.body); // Debugging log

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = createToken(user._id);

    return res.json({
      success: true,
      message: "✅ Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error logging in",
    });
  }
};
