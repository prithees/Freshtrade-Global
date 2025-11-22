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

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    });
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

// PUT - Edit (Update) a job
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, type, description } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { title, company, location, type, description },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE - Delete a job
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
