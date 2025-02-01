"use client"
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`w-full h-16 ${isSticky ? "fixed top-0 left-0 bg-white shadow-md z-50" : "relative"} py-4 px-6 flex items-center justify-between transition-all duration-150`}>
      {/* Brand */}
      <div className="brand">
        <Link href="/">
          <span className="text-2xl font-bold">SinityCourse</span>
        </Link>
      </div>

      {/* Features */}
      <div className="flex space-x-4">
        <Link href="/dashboard" className="py-2 px-3 rounded hover:bg-gray-200">
          Dashboard
        </Link>
        <Link href="/profile" className="py-2 px-3 rounded hover:bg-gray-200">
          Profile
        </Link>
      </div>

      {/* Authentication */}
      <div className="flex space-x-3">
        <Link href="/login">
          <Button variant="outline">Masuk</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" className="bg-blue-500 hover:bg-blue-400">
            Daftar
          </Button>
        </Link>
      </div>
    </div>
  );
}

