import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import teamAnimation from "./assets/About Us Team.json"; // optional

interface JobType {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  createdAt: string;
}

const JobOpening: React.FC<{
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
}> = ({ title, company, location, type, description }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start transition-all hover:shadow-2xl hover:-translate-y-1.5 border border-gray-100 dark:border-gray-700"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        {company} • {location} • {type}
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
        {description.length > 120 ? description.slice(0, 120) + "..." : description}
      </p>
    </div>
    <div className="mt-4 sm:mt-0 sm:ml-6">
      <motion.a
        href="mailto:careers@freshtradeglobal.com"
        className="bg-green-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all"
        whileHover={{ scale: 1.05 }}
      >
        Apply Now
      </motion.a>
    </div>
  </motion.div>
);

const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* 🌟 Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
        <motion.div
          className="relative text-center text-white px-4 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Join Our Team
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            Work with passionate people and grow your career at FreshTrade Global.
          </p>
          <div className="w-56 mx-auto mt-8 hidden md:block">
            <Lottie animationData={teamAnimation} loop />
          </div>
        </motion.div>
      </div>

      {/* 💼 Job Openings Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Current Job Openings
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore exciting opportunities and be part of our mission.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500">No openings currently.</p>
        ) : (
          <motion.div
            className="space-y-8 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15 }}
          >
            {jobs.map((job) => (
              <JobOpening
                key={job._id}
                title={job.title}
                company={job.company}
                location={job.location}
                type={job.type}
                description={job.description}
              />
            ))}
          </motion.div>
        )}

        {/* 💬 Closing Message */}
        <motion.div
          className="mt-16 text-center text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg">
            Don’t see a role that fits? We’re always looking for talented individuals.
          </p>
          <p className="mt-3">
            Send your resume to{" "}
            <a
              href="mailto:careers@freshtradeglobal.com"
              className="text-green-600 dark:text-green-400 font-medium hover:underline"
            >
              careers@freshtradeglobal.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CareersPage;
