import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },   // REQUIRED
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      phone: String,
      email: String,
      address: String,
      notes: String,
    },
    items: [ItemSchema],
    total: { type: Number, required: true },
    isClosed: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
