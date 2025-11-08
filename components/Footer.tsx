import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ALL_NAV_LINKS } from '../constants';

const Footer: React.FC = () => {
  // ✅ Typed fade-in animation variant (TypeScript safe)
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.15),transparent)] pointer-events-none" />

      <div className="container relative mx-auto py-16 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <h3 className="text-2xl font-bold text-green-400 mb-3">FreshTrade</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your global partner for fresh produce. <br />Quality and reliability, delivered.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={1}>
            <h4 className="font-semibold text-gray-200 tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {ALL_NAV_LINKS.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 6, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={2}>
            <h4 className="font-semibold text-gray-200 tracking-wider uppercase mb-4">Support</h4>
            <ul className="space-y-2">
              {['Contact Us', 'Privacy Policy', 'Terms of Service'].map((text) => (
                <motion.li key={text} whileHover={{ x: 6, scale: 1.05 }}>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                    {text}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={3}>
            <h4 className="font-semibold text-gray-200 tracking-wider uppercase mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'LinkedIn'].map((platform) => (
                <motion.a
                  key={platform}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-green-400 transition-transform"
                >
                  <span className="sr-only">{platform}</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {platform === 'Facebook' && (
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797
                        c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26
                        c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343
                        21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    )}
                    {platform === 'Twitter' && (
                      <path d="M8.29 20.251c7.547 0 11.675-6.253
                      11.675-11.675 0-.178 0-.355-.012-.53A8.348
                      8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646
                      4.118 4.118 0 001.804-2.27 8.224 8.224
                      0 01-2.605.996 4.107 4.107 0 00-6.993
                      3.743 11.65 11.65 0 01-8.457-4.287
                      4.106 4.106 0 001.27 5.477A4.072
                      4.072 0 012.8 9.71v.052a4.105
                      4.105 0 003.292 4.022 4.095 4.095
                      0 01-1.853.07 4.108 4.108 0 003.834
                      2.85A8.233 8.233 0 012 18.407a11.616
                      11.616 0 006.29 1.84" />
                    )}
                    {platform === 'LinkedIn' && (
                      <path
                        fillRule="evenodd"
                        d="M19 0h-14c-2.761 0-5
                        2.239-5 5v14c0 2.761 2.239 5 5
                        5h14c2.762 0 5-2.239
                        5-5v-14c0-2.761-2.238-5-5-5zm-11
                        19h-3v-11h3v11zm-1.5-12.268c-.966
                        0-1.75-.79-1.75-1.764s.784-1.764
                        1.75-1.764 1.75.79 1.75
                        1.764-.783 1.764-1.75
                        1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4
                        0v5.604h-3v-11h3v1.765c1.396-2.586
                        7-2.777 7 2.476v6.759z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer bottom */}
        <motion.div
          className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-green-400 font-medium">FreshTrade Global</span>. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
