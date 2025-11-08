import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import productRoutes from "./routes/productRoutes.js"; // ✅ make sure this path is correct

const app = express();

const username = "prithees";
const password = "Prithees@007";

const connection = `mongodb+srv://${username}:${encodeURIComponent(
  password
)}@cluster1.cmhbhtz.mongodb.net/Freshtrade?retryWrites=true&w=majority`;
mongoose
  .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(cors());
app.use(bodyParser.json());

// ✅ Mount your routes
app.use("/api/products", productRoutes);

app.get("/api",(req, res) => {
  res.json({ status: "OK", message: "API is healthy" });
});

app.get("/", (req, res) => {
  res.send("FreshTrade Backend Running ✅");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
