// uploadAllAssets.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Medicine from "./models/medicinemodel.js";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Path to uploads folder
const uploadsFolder = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsFolder)) {
  console.error("❌ uploads folder does not exist:", uploadsFolder);
  process.exit(1);
}

// Filter only image files
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
const files = fs.readdirSync(uploadsFolder).filter(file =>
  imageExtensions.includes(path.extname(file).toLowerCase())
);

const medicines = files.map((file, index) => ({
  name: `Medicine ${index + 1}`,
  description: `Description for Medicine ${index + 1}`,
  price: Math.floor(Math.random() * 1000) + 100,
  category: "General",
  image: `/uploads/${file}`
}));

// Insert into MongoDB
async function seedMedicines() {
  try {
    await Medicine.deleteMany({}); // optional, clears old records
    await Medicine.insertMany(medicines);
    console.log("✅ All images uploaded as medicines successfully!");
  } catch (err) {
    console.error("❌ Error uploading medicines:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedMedicines();
