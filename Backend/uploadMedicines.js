import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Medicine from "./models/medicinemodel.js";

dotenv.config();

const medicinesPath = path.join(process.cwd(), "medicines.json");
const placeholderImage = "https://via.placeholder.com/150";

async function seedMedicines() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    if (!fs.existsSync(medicinesPath)) {
      console.error("❌ medicines.json not found");
      process.exit(1);
    }

    const rawData = fs.readFileSync(medicinesPath);
    const medicines = JSON.parse(rawData);

    const formattedMedicines = medicines.map(med => ({
      name: med.name,
      description: med.description,
      price: med.price,
      category: med.category,
      image: med.image ? med.image : placeholderImage,
    }));

    // Optional: clear existing medicines
    await Medicine.deleteMany({});

    await Medicine.insertMany(formattedMedicines);
    console.log("✅ All medicines uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading medicines:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedMedicines();
