// routes/medicineroute.js
import express from "express";
import multer from "multer";
import fs from "fs";
import Medicine from "../models/medicinemodel.js";

const medicineRouter = express.Router();

// ---------------- Multer Storage Setup ----------------
const storage = multer.diskStorage({
  destination: "uploads", // ensure this folder exists
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

// ---------------- Add Medicine ----------------
medicineRouter.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image_filename = req.file ? req.file.filename : null;

    if (!name || !description || !price || !category || !image_filename) {
      return res.json({ success: false, message: "All fields are required." });
    }

    const newMedicine = new Medicine({
      name,
      description,
      price: Number(price),
      category,
      image: image_filename,
    });

    await newMedicine.save();
    res.json({ success: true, message: "Medicine added successfully", data: newMedicine });
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.json({ success: false, message: "Error adding medicine" });
  }
});

// ---------------- Get All Medicines ----------------
medicineRouter.get("/list", async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json({ success: true, data: medicines });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.json({ success: false, message: "Error fetching medicines" });
  }
});

// ---------------- Update Medicine ----------------
medicineRouter.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const updatedData = {
      name,
      description,
      category,
    };

    if (price) updatedData.price = Number(price);
    if (req.file) updatedData.image = req.file.filename;

    const updatedMedicine = await Medicine.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedMedicine) {
      return res.json({ success: false, message: "Medicine not found" });
    }

    res.json({ success: true, message: "Medicine updated successfully", data: updatedMedicine });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.json({ success: false, message: "Error updating medicine" });
  }
});

// ---------------- Delete Medicine ----------------
medicineRouter.delete("/remove", async (req, res) => {
  try {
    const { id } = req.body;

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.json({ success: false, message: "Medicine not found" });
    }

    // Remove image from uploads folder
    fs.unlink(`uploads/${medicine.image}`, (err) => {
      if (err) console.error("Error deleting image file:", err);
    });

    await Medicine.findByIdAndDelete(id);

    res.json({ success: true, message: "Medicine removed successfully" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.json({ success: false, message: "Error deleting medicine" });
  }
});

export default medicineRouter;
