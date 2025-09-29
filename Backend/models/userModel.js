import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: {
    type: Object, // itemId -> quantity
    default: {}
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
