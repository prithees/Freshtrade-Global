import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTACT_FORM_ENDPOINT } from '../constants';
import AnimatedSection from '../components/AnimatedSection';
import Lottie from 'lottie-react';
import contactAnimation from './assets/Contact us.json'; // Optional Lottie animation

// ✨ FAQ Component with animation
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.5, ease: 'easeInOut' } }}
      className="border-b border-gray-200 dark:border-gray-700 py-2"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 flex justify-between items-center"
      >
        <span className="font-semibold text-gray-800 dark:text-gray-100">{question}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="pb-4 text-gray-600 dark:text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 📨 Main Page
const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) throw new Error("Failed to send message");
  
      setSubmitted(true);
      e.currentTarget.reset();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
      }
  };
  

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* 🧭 Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 flex flex-col items-center justify-center text-center overflow-hidden">
        <motion.h1
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Get In Touch
        </motion.h1>
        <motion.p
          className="text-lg text-white/90 mt-3 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          We're here to help with your sourcing needs — let’s build something fresh together.
        </motion.p>
        <div className="w-48 mt-6">
          <Lottie animationData={contactAnimation} loop />
        </div>
        {/* floating icons */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <div className="absolute w-40 h-40 bg-white/20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
          <div className="absolute w-52 h-52 bg-yellow-400/20 rounded-full blur-3xl bottom-10 right-16 animate-pulse" />
        </motion.div>
      </div>

      {/* 🧩 Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* 🧾 Contact Form */}
          <AnimatedSection>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Send Us a Message</h2>
              <form onSubmit={handleSubmit} action={CONTACT_FORM_ENDPOINT} method="POST" className="relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="w-full p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-green-500 focus:outline-none"
                ></textarea>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-green-500 text-white font-semibold py-3 rounded-full hover:bg-green-600 transition-all"
                >
                  Submit Inquiry
                </motion.button>
              </form>

              {/* ✅ Animated success message */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    className="absolute inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-2xl z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="text-center"
                    >
                      <h3 className="text-2xl font-semibold text-green-600">Message Sent!</h3>
                      <p className="text-gray-600 mt-2">We'll get back to you soon.</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>

          {/* 🗺️ Contact Info + Map */}
          <AnimatedSection>
            <div className="space-y-8">
              {/* Address */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-start space-x-4"
              >
                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z" />
                    <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Our Warehouse</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    123 Fresh Produce Lane, AgriPark, Nashik, Maharashtra, India
                  </p>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-start space-x-4"
              >
                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Email Us</h3>
                  <a href="mailto:sales@freshtradeglobal.com" className="text-green-600 hover:underline">
                    sales@freshtradeglobal.com
                  </a>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d239964.2828557162!2d73.72261623956952!3d19.99113222019929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddd290b09914b3%3A0x312423d25415758d!2sNashik%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1684321098765!5m2!1sen!2sus"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  className="rounded-lg shadow-md"
                ></iframe>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>

        {/* ❓ FAQ */}
        <AnimatedSection className="mt-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              <FAQItem
                question="What is your minimum order quantity?"
                answer="Minimum order quantity varies by product. You can find the specific MOQ for each item on our daily pricing list."
              />
              <FAQItem
                question="Do you ship internationally?"
                answer="Yes, we ship globally and handle all customs logistics for a smooth delivery to your location."
              />
              <FAQItem
                question="How is pricing determined?"
                answer="Our prices are updated daily based on global market rates, seasonality, and supply conditions."
              />
              <FAQItem
                question="What quality certifications do you have?"
                answer="We work with partners certified under GlobalG.A.P., FSSAI, and international organic standards."
              />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ContactPage;
