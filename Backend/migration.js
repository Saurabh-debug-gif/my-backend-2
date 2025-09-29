// migration.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./models/userModel.js";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Update all users where cartData is missing or not an object
    const result = await userModel.updateMany(
      { $or: [{ cartData: { $exists: false } }, { cartData: null }] },
      { $set: { cartData: {} } }
    );

    console.log(`🔧 Fixed ${result.modifiedCount} users`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Migration error:", err.message);
    process.exit(1);
  }
};

migrate();
