// routes/userRoute.js
import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

// Optionally enable CORS for user routes
// import cors from "cors";
// userRouter.use(cors());

// User registration
userRouter.post("/register", registerUser);

// User login
userRouter.post("/login", loginUser);

export default userRouter;
