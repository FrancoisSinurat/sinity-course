"use client";

import { GraduationCap, Menu, X, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/app/store/AuthStore";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { fetchMe, logout as logoutApi } from "@/lib/api/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();
  const pathname = usePathname();

  const { user, token, setAuth, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (!hasHydrated) return;

      if (!token) {
        logout();
        return;
      }

      if (!user) {
        try {
          const data = await fetchMe(token);
          setAuth(token, data);
        } catch (err) {
          console.error("Fetch user error:", err);
          logout();
          router.push("/login");
        }
      }
    };

    loadUser();
  }, [hasHydrated, token, user, setAuth, logout, router]);

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutApi(token);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      router.push("/");
    }
  };

  const menuItems = user ? ["Profile"] : [];

  return (
    <nav className={` font-serif fixed top-0 w-full z-50 transition-colors duration-300 ${
      isScrolled ? "bg-white shadow-sm text-zinc-700" : " text-black"
    }`}>
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap size={45} className="text-black" />
          <span className="text-xl font-bold font-graphik text-stone-700">Sinity<span className="text-stone-400">Course</span> </span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center space-x-6">
          {menuItems.map((item) => {
            const path = `/${item.toLowerCase()}`;
            const isActive = pathname === path;
            return (
              <Link
                key={item}
                href={path}
                className={cn(
                  "text-lg transition-all duration-300 px-4 py-2 rounded-lg ",
                  isActive ? "text-black shadow-md" : "hover:bg-slate-100 text-zinc-600"
                )}
              >
                {item}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link href="/login" className="px-4 py-2 rounded-lg hover:bg-gray-50 transition">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-stone-500 text-white rounded-lg hover:bg-stone-600">Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut size={20} />
              Logout
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="md:hidden"
          >
            <ul className="flex flex-col space-y-4 px-6 py-4 bg-slate-200 shadow-lg rounded-lg">
              {menuItems.map((item) => {
                const path = `/${item.toLowerCase()}`;
                const isActive = pathname === path;
                return (
                  <li key={item}>
                    <Link
                      href={path}
                      onClick={() => setIsOpen(false)}
                      className={`block hover:text-stone-600 px-4 py-2 transition-colors ${
                        isActive ? "font-bold text-stone-900" : ""
                      }`}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}

              {!user ? (
                <div className="flex flex-col space-y-4 ">
                  <li>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-center rounded-lg hover:bg-gray-50 transition">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="block px-4 py-2 bg-stone-500 text-white text-center rounded-lg hover:bg-stone-600 transition">
                      Register
                    </Link>
                  </li>
                </div>
              ) : (
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg w-full hover:bg-red-700"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
