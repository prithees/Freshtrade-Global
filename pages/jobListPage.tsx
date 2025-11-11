import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface JobType {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string; // e.g., Full-Time, Part-Time, Internship
  description: string;
  postedAt: string;
}

const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // form data
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-Time",
    description: "",
  });

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Add new job
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newJob.title || !newJob.company || !newJob.location || !newJob.description) {
      alert("Please fill all fields");
      return;
    }

    setAdding(true);

    try {
      const res = await fetch("http://localhost:4000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Job added successfully!");
        setNewJob({
          title: "",
          company: "",
          location: "",
          type: "Full-Time",
          description: "",
        });
        fetchJobs();
      } else {
        alert(data.error || "Failed to add job");
      }
    } catch (err) {
      console.error("Error adding job:", err);
      alert("Server error");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-600">Loading jobs...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          💼 Job Listings
        </h1>

        {/* ✅ Add Job Form */}
        <form
          onSubmit={handleAddJob}
          className="mb-8 bg-gray-100 dark:bg-gray-700 p-5 rounded-xl shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            ➕ Post a New Job
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="p-2 rounded border focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              placeholder="Company"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              className="p-2 rounded border focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              className="p-2 rounded border focus:ring-2 focus:ring-green-500"
              required
            />
            <select
              value={newJob.type}
              onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
              className="p-2 rounded border focus:ring-2 focus:ring-green-500"
            >
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Internship</option>
            </select>
          </div>

          <textarea
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            className="w-full mt-4 p-2 rounded border focus:ring-2 focus:ring-green-500"
            rows={4}
            required
          ></textarea>

          <button
            type="submit"
            disabled={adding}
            className="mt-4 bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition"
          >
            {adding ? "Adding..." : "Add Job"}
          </button>
        </form>

        {/* ✅ Job Listing */}
        {/* {jobs.length === 0 ? (
          <p className="text-center text-gray-500">No job posts yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-5 border rounded-xl shadow hover:shadow-md transition bg-white dark:bg-gray-700"
              >
                <h2 className="text-xl font-semibold text-green-600">{job.title}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {job.company} • {job.location}
                </p>
                <span className="inline-block mt-2 px-2 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                  {job.type}
                </span>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                  {job.description.length > 100
                    ? job.description.slice(0, 100) + "..."
                    : job.description}
                </p>
                <p className="mt-3 text-xs text-gray-500">
                  Posted on: {new Date(job.postedAt).toLocaleDateString()}
                </p>
                <button
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                  onClick={() => alert(`Apply for ${job.title}`)}
                >
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default JobListPage;
