// controllers/medicineController.js
import Medicine from "../models/medicinemodel.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add a new medicine/product
export const addMedicine = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const medicine = new Medicine({ name, description, price, category, image });
    await medicine.save();

    res.json({ success: true, message: "Medicine added successfully", medicine });
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({ success: false, message: "Error adding medicine" });
  }
};

// List all medicines/products
export const listMedicine = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json({ success: true, medicines });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ success: false, message: "Error fetching medicines" });
  }
};

// Remove a medicine/product
export const removeMedicine = async (req, res) => {
  try {
    const { id } = req.body; // medicine _id in body
    if (!id) {
      return res.status(400).json({ success: false, message: "Medicine ID is required" });
    }

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }

    // Delete image file from uploads folder
    if (medicine.image) {
      const filePath = path.join(__dirname, "..", medicine.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Medicine.findByIdAndDelete(id);

    res.json({ success: true, message: "Medicine removed successfully" });
  } catch (error) {
    console.error("Error removing medicine:", error);
    res.status(500).json({ success: false, message: "Error removing medicine" });
  }
};
