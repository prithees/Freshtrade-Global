import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "../constants";
import { useAuth } from "../context/AuthContext";
import ContactListPage from "../pages/contactListPage";
import JobListPage from "../pages/jobListPage";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log("User from context:", user);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeLinkStyle = {
    color: "#22c55e",
    fontWeight: "600",
  };

  const desktopLinkClasses =
    "relative text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-green-500 hover:after:w-full after:transition-all after:duration-300";

  const mobileLinkClasses =
    "text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors";

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-500 ${
        isScrolled ? "bg-white/70 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold text-green-600 tracking-tight hover:scale-105 transition-transform"
          >
            FreshTrade
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={desktopLinkClasses}
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                >
                  {link.name}
                </NavLink>
              ))}

              {user && user.email === "pritheesp@gmail.com" && (
                <NavLink
                  to="/admin"
                  className={desktopLinkClasses}
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                >
                  Admin
                </NavLink>
              )}
                  {/* ✅ Contact List Link */}
    {user && user.email === "pritheesp@gmail.com" && (
      <NavLink
        to="/contacts"
        className={desktopLinkClasses}
        style={({ isActive }) => (isActive ? activeLinkStyle : {})}
      >
        Contact Lists
      </NavLink>
    )}
        {user && user.email === "pritheesp@gmail.com" && (
      <NavLink
        to="/jobs"
        className={desktopLinkClasses}
        style={({ isActive }) => (isActive ? activeLinkStyle : {})}
      >
        Add job
      </NavLink>
    )}
            </div>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  👋 Welcome, <strong>{user.name}</strong>!
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors text-sm font-semibold"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>

                {/* <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/signup"
                    className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition-colors text-sm font-semibold shadow-sm"
                  >
                    Sign Up
                  </Link>
                </motion.div> */}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-gray-200 focus:outline-none"
            >
              {isOpen ? (
                <motion.svg
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </motion.svg>
              ) : (
                <motion.svg
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 90 }}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </motion.svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden bg-white shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClasses}
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                >
                  {link.name}
                </NavLink>
              ))}

{user && user.email === "pritheesp@gmail.com" && (
      <NavLink
        to="/admin"
        className={desktopLinkClasses}
        style={({ isActive }) => (isActive ? activeLinkStyle : {})}
      >
        Admin
      </NavLink>
    )}

    {/* ✅ Contact List Link */}
    {user && user.email === "pritheesp@gmail.com" && (
      <NavLink
        to="/contacts"
        className={desktopLinkClasses}
        style={({ isActive }) => (isActive ? activeLinkStyle : {})}
      >
        Contact Lists
      </NavLink>
    )}
        {user && user.email === "pritheesp@gmail.com" && (
      <NavLink
        to="/jobs"
        className={desktopLinkClasses}
        style={({ isActive }) => (isActive ? activeLinkStyle : {})}
      >
        Add Job
      </NavLink>
    )}
              <div className="border-t my-3"></div>

              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-center bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors font-semibold"
                >
                  Logout
                </motion.button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-green-500 text-white mt-2 px-4 py-2 rounded-full hover:bg-green-600 transition-colors text-sm font-semibold"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
