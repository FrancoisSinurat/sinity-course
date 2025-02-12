"use client"
import { Typography } from "@material-tailwind/react";
import { Login } from "@/components/LoginCard";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center w-full py-20 min-h-screen">
          <Login />
    </main>
  );
}
