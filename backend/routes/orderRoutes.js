import express from "express";
import Order from "../models/OrderSchema.js";

const router = express.Router();

// Create new order
router.post("/", async (req, res) => {
  try {
    console.log("Incoming Order:", req.body);

    const order = await Order.create(req.body);

    console.log("Saved Order:", order);
    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order save error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/unclosed", async (req, res) => {
  const orders = await Order.find({ isClosed: false })
    .sort({ createdAt: -1 });
  res.json(orders);
});

// Get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders for a specific customer by email
router.get("/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({
      "customer.email": req.params.email,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
