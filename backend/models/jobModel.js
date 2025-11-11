import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true, enum: ["Full-Time", "Part-Time", "Internship"] },
    description: { type: String, required: true },
  },
  { timestamps: { createdAt: "postedAt" } }
);

export default mongoose.model("Job", jobSchema);
