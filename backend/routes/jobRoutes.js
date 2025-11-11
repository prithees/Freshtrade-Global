import express from "express";
import Job from "../models/jobModel.js";

const router = express.Router();

// POST - Add new job
router.post("/", async (req, res) => {
  try {
    const { title, company, location, type, description } = req.body;

    if (!title || !company || !location || !type || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newJob = new Job({ title, company, location, type, description });
    await newJob.save();
    res.status(201).json({ success: true, message: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error("Error posting job:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Fetch all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
