import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"; 
import jobRoutes from "./routes/jobRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const dbName = process.env.MONGO_DB_NAME;

const connectionString = `mongodb+srv://${username}:${encodeURIComponent(
  password
)}@cluster1.cmhbhtz.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(connectionString)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes); 
app.use("/api/jobs", jobRoutes);

app.get("/api", (req, res) => {
  res.json({ status: "OK", message: "API is healthy 🚀" });
});

app.get("/", (req, res) => {
  res.send("🌿 FreshTrade Backend Running Successfully!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
