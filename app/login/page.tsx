"use client"
import { Typography } from "@material-tailwind/react";
import { Login } from "@/components/LoginCard";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen">
          {/* Semua komponen ada di dalam root element ini */}
          <div className="w-96">
          <Login />
          </div>
    </main>
  );
}
