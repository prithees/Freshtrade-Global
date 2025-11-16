import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Route Imports
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const dbName = process.env.MONGO_DB_NAME;

const connectionString = `mongodb+srv://${username}:${encodeURIComponent(
  password
)}@cluster1.cmhbhtz.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(connectionString)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/orders", orderRoutes);

// Health Check
app.get("/api", (req, res) => {
  res.json({ status: "OK", message: "API is healthy 🚀" });
});

// Root Route
app.get("/", (req, res) => {
  res.send("🌿 FreshTrade Backend Running Successfully!");
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
