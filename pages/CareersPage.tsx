import React from 'react';
import { motion } from 'framer-motion';
import { CAREERS_GOOGLE_FORM_URL } from '../constants';
import AnimatedSection from '../components/AnimatedSection';
import Lottie from 'lottie-react';
import teamAnimation from './assets/About Us Team.json'; // optional /Lottie file

// 🎯 Animated job card
const JobOpening: React.FC<{ title: string; location: string; type: string }> = ({
  title,
  location,
  type,
}) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-center transition-all hover:shadow-2xl hover:-translate-y-1.5 border border-gray-100 dark:border-gray-700"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        {location} &middot; {type}
      </p>
    </div>
    <div className="mt-4 sm:mt-0">
      <motion.a
        href={CAREERS_GOOGLE_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Apply Now
      </motion.a>
    </div>
  </motion.div>
);

const CareersPage: React.FC = () => {
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
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>

        {/* Floating particles (optional) */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <div className="absolute w-64 h-64 bg-green-500/30 blur-3xl rounded-full top-10 left-10 animate-pulse" />
          <div className="absolute w-72 h-72 bg-yellow-500/30 blur-3xl rounded-full bottom-10 right-20 animate-pulse" />
        </motion.div>

        {/* Hero Content */}
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
          {/* Optional Lottie */}
          <div className="w-56 mx-auto mt-8 hidden md:block">
            <Lottie animationData={teamAnimation} loop />
          </div>
        </motion.div>
      </div>

      {/* 🧠 About Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Grow With Us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We’re a global team driven by innovation and sustainability.
              Whether you're in logistics, sales, or technology, there’s a place
              for you to thrive at FreshTrade.
            </p>
          </div>
        </AnimatedSection>

        {/* 💼 Job Openings */}
        <AnimatedSection>
          <motion.div
            className="space-y-8 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15 }}
          >
            <JobOpening
              title="Logistics Coordinator"
              location="Mumbai, India"
              type="Full-time"
            />
            <JobOpening
              title="Quality Assurance Inspector"
              location="Remote / Nashik"
              type="Full-time"
            />
            <JobOpening
              title="International Sales Executive"
              location="London, UK"
              type="Full-time"
            />
          </motion.div>
        </AnimatedSection>

        {/* 💬 Closing Message */}
        <AnimatedSection>
          <motion.div
            className="mt-16 text-center text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg">
              Don’t see a role that fits? We’re always looking for talented
              individuals.
            </p>
            <p className="mt-3">
              Send your resume to{' '}
              <a
                href="mailto:careers@freshtradeglobal.com"
                className="text-green-600 dark:text-green-400 font-medium hover:underline"
              >
                careers@freshtradeglobal.com
              </a>
            </p>
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default CareersPage;
