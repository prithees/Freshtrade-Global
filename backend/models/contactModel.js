// backend/models/contactModel.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "contacted"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
