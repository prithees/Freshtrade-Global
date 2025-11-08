import express from "express";
import Product from "../models/products.js";

const router = express.Router();

// ✅ GET all products
router.get("/", async (req, res) => {
    try {
        console.log("Fetching all products");
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// ✅ GET one product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
    console.log("............................................")
    try {
      console.log("📦 Incoming product data:", req.body); // 👈 log what frontend sends
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      console.error("❌ Error saving product:", err.message);
      res.status(400).json({ error: err.message });
    }
  });
  

// ✅ UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
