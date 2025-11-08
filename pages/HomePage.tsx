import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// Reusable animation wrapper
const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

// 🌞 Dark/Light theme toggle
const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <motion.button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition"
      whileTap={{ rotate: 360 }}
    >
      {darkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.752 15.002A9.718 9.718 0 0112 21a9.718 9.718 0 01-9.752-5.998A9.97 9.97 0 0112 2a9.97 9.97 0 019.752 13.002z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.485-8.485l-.707.707M4.222 4.222l.707.707M21 12h1M2 12H1m15.071 6.364l.707.707M4.222 19.778l.707-.707" />
        </svg>
      )}
    </motion.button>
  );
};

// 🌍 Hero Section with particles
const Hero = () => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-cover bg-center dark:bg-gray-900">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: 'transparent' } },
          particles: {
            color: { value: '#22c55e' },
            links: { color: '#22c55e', distance: 120, enable: true, opacity: 0.2, width: 1 },
            move: { enable: true, speed: 1 },
            number: { value: 40 },
            opacity: { value: 0.3 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
          fullScreen: { enable: false },
        }}
        className="absolute inset-0 z-0"
      />

      <div
        className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
      ></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Global Sourcing, <span className="text-green-400">Fresh Delivery</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl max-w-2xl mb-8 text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Your reliable B2B partner for premium quality fruits and vegetables from around the world.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/products"
              className="bg-green-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-600 transition"
            >
              View Products
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="bg-white text-green-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ⚙️ How It Works Section with 3D tilt
const HowItWorks = () => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="container mx-auto px-4 text-center">
      <AnimatedSection>
        <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">How It Works</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          A seamless process from farm to your business in three simple steps.
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: 'Place Your Order',
              text: 'Browse our daily catalog and send a quote request for bulk orders.',
              icon: '🛒',
            },
            {
              title: 'Pack & Inspect',
              text: 'Every item meets the highest quality standards before shipping.',
              icon: '📦',
            },
            {
              title: 'Fast Delivery',
              text: 'We ensure freshness with world-class logistics anywhere in the world.',
              icon: '🚚',
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transform-gpu transition-all duration-500"
              whileHover={{ rotateX: 5, rotateY: -5, scale: 1.05 }}
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-300">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

// 💬 Testimonials
const Testimonials = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-950">
    <div className="container mx-auto px-4">
      <AnimatedSection>
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
          What Our Clients Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              quote:
                'FreshTrade has transformed our supply chain. Their produce is consistently top-notch, and the daily pricing sheet makes planning effortless.',
              name: 'Maria Sanchez',
              role: 'Head of Procurement, Gourmet Foods Inc.',
            },
            {
              quote:
                'The quality of the exotic fruits is unmatched. Deliveries are always on schedule — an amazing experience!',
              name: 'David Chen',
              role: 'Owner, The Organic Market',
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-500"
              whileHover={{ scale: 1.05, rotate: -1 }}
            >
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{t.quote}"</p>
              <p className="font-semibold text-green-600">{t.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

// 🏡 Main Page
const HomePage: React.FC = () => {
  return (
    <>
      <ThemeToggle />
      <Hero />
      <HowItWorks />
      <Testimonials />
    </>
  );
};

export default HomePage;
