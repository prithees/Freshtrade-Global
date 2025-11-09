import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const AboutPage: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 🎨 Parallax motion for hero text
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 🌿 Counters
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState({ partners: 0, countries: 0, years: 0 });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setCount({
        partners: Math.floor(500 * progress),
        countries: Math.floor(12 * progress),
        years: Math.floor(15 * progress),
      });
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView]);

  return (
    <div ref={ref} className="bg-gradient-to-br from-emerald-50 to-white text-gray-800 overflow-hidden">
      {/* 🌄 Parallax Hero Section */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1598514982537-4b7b2d4b4a1a?auto=format&fit=crop&w=1920&q=80"
          alt="Farm field"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ y: y1 }}
        />
        <div className="absolute inset-0 bg-emerald-900/50 backdrop-blur-sm"></div>
        <motion.div
          className="relative z-10 text-center px-4"
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
            Freshness Meets Innovation
          </h1>
          <p className="text-lg md:text-2xl text-emerald-100 max-w-3xl mx-auto">
            We connect growers and buyers worldwide through technology, sustainability, and trust.
          </p>
        </motion.div>
      </div>

      {/* ✨ Floating Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-green-300/20 rounded-full blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, -80, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      {/* 🥕 Our Story */}
      <section className="relative z-10 container mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 text-emerald-800">Our Story</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Founded in 2010, FreshTrade Global bridges the gap between local farms and international businesses. We’re committed to creating a transparent, sustainable, and equitable food supply chain.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Today, we’re proud to serve partners across 12 countries — ensuring every product arrives as fresh as the day it was harvested.
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
        >
          <img
            src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800&q=80"
            alt="Fresh produce"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* 🌱 Values */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-emerald-600 to-green-700 text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-10"
        >
          Our Core Values
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: "🌿",
              title: "Quality",
              text: "Every product is hand-inspected for freshness and flavor.",
            },
            {
              icon: "🌎",
              title: "Sustainability",
              text: "We minimize waste and promote eco-friendly sourcing.",
            },
            {
              icon: "🤝",
              title: "Integrity",
              text: "Transparency and fairness guide every partnership.",
            },
          ].map((v, i) => (
            <motion.div
              key={i}
              className="p-8 rounded-2xl backdrop-blur-xl bg-white/10 hover:bg-white/20 shadow-lg transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl mb-4">{v.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{v.title}</h3>
              <p className="text-emerald-100">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔢 Animated Counters */}
      <section
        className="container mx-auto px-6 py-24 text-center"
        ref={() => setInView(true)}
      >
        <h2 className="text-4xl font-bold text-emerald-800 mb-12">
          Global Impact in Numbers
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { label: "Partners", value: count.partners },
            { label: "Countries Served", value: count.countries },
            { label: "Years in Operation", value: count.years },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="p-10 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-5xl font-extrabold text-emerald-600 mb-2">
                {stat.value}+
              </h3>
              <p className="text-gray-700 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✉️ Partner CTA */}
      <motion.section
        className="relative bg-gradient-to-r from-emerald-700 to-green-600 text-white py-24 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-bold mb-6">Join Our Global Network</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-emerald-100">
          Partner with us to access premium produce, reliable logistics, and real-time insights.
        </p>
        <motion.a
          href="/#/contact"
          className="inline-block bg-white text-emerald-700 font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Us
        </motion.a>
      </motion.section>
    </div>
  );
};

export default AboutPage;
