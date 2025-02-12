"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-gray-800 shadow-md z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors"
        >
          SinityCourse
        </Link>

        {/* Menu Navigasi untuk Desktop */}
        <div className="hidden md:flex flex-1 justify-center space-x-6">
          {['Dashboard', 'Profile'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-gray-300 hover:text-indigo-400 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          >
            Register
          </Link>
        </div>

        {/* Tombol Menu Hamburger */}
        <button className="text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Menu Navigasi untuk Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="md:hidden bg-gray-800"
          >
            <ul className="flex flex-col space-y-4 px-6 py-4">
              {['Dashboard', 'Profile'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <div className="border-t border-gray-700 mt-2 pt-2"></div>
              <li>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2  text-white bg-gray-800 text-center rounded-lg hover:bg-gray-700 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
