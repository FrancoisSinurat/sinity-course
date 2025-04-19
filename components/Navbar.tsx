"use client";

import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`font-serif fixed top-0 w-full z-50 transition-colors duration-300 ${
      isScrolled ? "bg-neutral-200 shadow-lg text-zinc-700" : "bg-[#E2CEB1]  text-black "
    }`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}

      <Link href="/" className="flex items-center space-x-2">
        <GraduationCap size={45} className="text-black" />
        <span className="text-xl font-bold font-graphik">SinityCourse</span>
      </Link>
        

        {/* Menu Navigasi untuk Desktop */}
        <div className="hidden md:flex flex-1 justify-center space-x-6">
          {['Dashboard', 'Profile'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className=" hover:text-stone-500 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* LOGIN AND REGISTER DIRECT */}
        {/* <div className="hidden md:flex space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg hover:bg-stone-400 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2  bg-stone-700 text-white rounded-lg hover:bg-stone-600"
          >
            Register
          </Link>
        </div> */}

        {/* Tombol Menu Hamburger */}
        <button className=" md:hidden" onClick={() => setIsOpen(!isOpen)}>
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
            className="md:hidden"
          >
            <ul className="flex flex-col space-y-4 px-6 py-4">
              {['Dashboard', 'Profile'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-stone-600 px-4 py-2 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <div className=" border-gray-700 mt-2 pt-2"></div>
              {/* Login Page Direct */}
              {/* <li>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2  text-center rounded-lg hover:bg-gray-50 transition"
                >
                  Login
                </Link>
              </li> */}
              {/* Register Page Direct
              <li>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-stone-700 text-white text-center rounded-lg hover:bg-stone-600 transition"
                >
                  Register
                </Link>
              </li> */}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
