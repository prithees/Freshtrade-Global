// backend/routes/contactRoutes.js
import express from "express";
import Contact from "../models/contactModel.js";

const router = express.Router();

// POST (save message)
router.post("/", async (req, res) => {
  try {
    const { name, company, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email, and message are required" });
    }

    const newMessage = new Contact({ name, company, email, phone, message });
    await newMessage.save();

    return res.status(201).json({ success: true, message: "Message stored successfully" });
  } catch (err) {
    console.error("Error saving contact message:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id/contacted", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "contacted" },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({ success: true, message: "Marked as contacted", contact });
  } catch (err) {
    console.error("Error updating contact:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add this at the bottom
export default router;
