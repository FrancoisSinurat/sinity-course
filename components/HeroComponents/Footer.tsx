"use client"

import { GraduationCap, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/app/store/AuthStore"
import { useEffect } from "react"
import { fetchMe } from "@/lib/api/auth"

export function Footer() {
  const { user, token, setAuth, logout, hasHydrated } = useAuthStore()

  useEffect(() => {
    const loadUser = async () => {
      if (!hasHydrated || !token || user) return;
      try {
        const data = await fetchMe(token);
        setAuth(token, data);
      } catch (err) {
        console.error("Footer fetchMe error:", err);
        logout();
      }
    };
    loadUser();
  }, [hasHydrated, token, user, setAuth, logout]);

  return (
    <footer className="w-full bg-white border-t scroll-smooth">
      <div className="container mx-auto py-4 px-4 flex flex-col md:flex-row justify-between gap-4">

        {/* Logo & Deskripsi */}
        <div className="flex flex-col space-y-1 max-w-md">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap size={32} className="text-black" />
            <span className="text-lg font-bold text-stone-700">
              Sinity<span className="text-stone-400">Course</span>
            </span>
          </Link>
          <p className="text-sm text-gray-600 leading-tight">
            Sistem rekomendasi pada MOOC berbasis hybrid filtering untuk membantu Anda menemukan kursus yang relevan berdasarkan riwayat dan rating kursus.
          </p>
        </div>

        {/* Navigasi */}
        <div className="flex flex-col gap-2 text-sm font-medium text-gray-600">
          <span className="font-semibold text-gray-800">Navigasi</span>
          <Link href="/" className="hover:text-black transition">Beranda</Link>
          <Link href="/about" className="hover:text-black transition">About</Link>
          {user && (
            <Link href="/profile" className="hover:text-black transition">Profile</Link>
          )}
        </div>

        {/* Kontak */}
        <div className="flex flex-col gap-2 text-sm font-medium text-gray-600">
          <span className="font-semibold text-gray-800">Kontak</span>
          <div className="flex items-center space-x-2">
            <Mail size={16} />
            <span>novalsinurat28@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={16} />
            <span>+62 812-7124-3048</span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="container mx-auto px-4 pb-4 text-center text-md text-gray-500">
        &copy; 2025 SinityCourse. Dibuat oleh Francois Novalentino Sinurat. All rights reserved.
      </div>
    </footer>
  )
}
