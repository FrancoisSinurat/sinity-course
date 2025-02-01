"use client"
import Link from 'next/link';
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';

export function Sidebar() {
   const [isSticky, setIsSticky] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        setIsSticky(window.scrollY > 3);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  return (
    
    <aside className="w-48 bg-white shadow-lg p-4 h-screen flex flex-col justify-between">
      <div className="">
        <h2 className="text-lg font-semibold mb-4">
          <Link href="/">SinityCourse</Link>
        </h2>
        <Link
          href="/dashboard"
          className="block py-2 px-3 rounded hover:bg-gray-200"
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="block py-2 px-3 rounded hover:bg-gray-200"
        >
          Profile
        </Link>
      </div>
      <div className="flex flex-row justify-between">
        <div className="login">
        <Link href="/login" >
          <Button variant="outline" className='bg-blue-500 hover:bg-blue-500'>Masuk</Button>
        </Link>
        </div>
        <div className="register"> 
        <Link href="/register">
          <Button variant="outline">Daftar</Button>
        </Link>
        </div>
      </div>
    </aside>
  );
}
