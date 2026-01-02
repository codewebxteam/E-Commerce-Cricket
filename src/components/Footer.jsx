import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* COMPANY INFO */}
          <div className="lg:col-span-2">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center mb-4">
              <span className="text-2xl mr-2">🏏</span>
              <h3 className="text-2xl font-bold text-blue-400">CricketPro</h3>
            </motion.div>

            <p className="text-gray-300 mb-4 max-w-md">
              Your premier destination for professional cricket equipment, trophies,
              and accessories. Quality gear for champions at every level.
            </p>

            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
              >
                📘
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
              >
                📷
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
              >
                🐦
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/products" className="footer-link">Products</Link></li>
              <li><Link to="/trophies" className="footer-link">Trophies</Link></li>
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">
              Categories
            </h4>
            <ul className="space-y-2">
              <li><Link to="/products/category/bats" className="footer-link">Cricket Bats</Link></li>
              <li><Link to="/products/category/protective" className="footer-link">Protective Gear</Link></li>
              <li><Link to="/products/category/balls" className="footer-link">Cricket Balls</Link></li>
              <li><Link to="/products/category/trophies" className="footer-link">Trophies</Link></li>
              <li><Link to="/products/category/clothing" className="footer-link">Clothing</Link></li>
            </ul>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="border-t border-gray-800 mt-8 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <PhoneIcon className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p>info@cricketpro.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Business Hours</p>
              <p>Mon–Fri: 9AM–6PM</p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 CricketPro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="footer-link">Privacy</Link>
            <Link to="/terms" className="footer-link">Terms</Link>
            <Link to="/shipping" className="footer-link">Shipping</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
