import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  unit: { type: String, required: true },
  minOrderQty: { type: Number, required: true },
  stockStatus: { type: String, enum: ["In Stock", "Low Stock", "Out of Stock"], default: "In Stock" },
  imageUrl: String,
  tags: [String],
  description: String,
});

export default mongoose.model("Product", productSchema);
