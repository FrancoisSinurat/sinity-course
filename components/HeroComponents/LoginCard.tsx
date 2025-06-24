"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { useAuthStore } from '@/app/store/AuthStore';
import { login,fetchMe } from "@/lib/api/auth"; // 🔥 ganti ke sini

export default function Login() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard"; // fallback ke dashboard
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const togglePasswordVisibility = () => setPasswordShown((prev) => !prev);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password wajib diisi.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const data = await login({ email: email, password });
    const token = data.access_token ;

    // Ambil user setelah token valid
    const user = await fetchMe(token);

    // Simpan token + user di store sekaligus
    setAuth(token, user);

    setSuccessMessage("Login berhasil! Mengarahkan ke dashboard...");

    setTimeout(() => {
      router.push(redirectTo);
    }, 2000);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      setErrors((prev) => ({ ...prev, password: error.message }));
    } else {
      console.error("Unexpected error:", error);
      setErrors((prev) => ({ ...prev, password: "Unexpected error occurred." }));
    }
  }
};

  return (
    <div className="font-graphik flex justify-center w-full ">
      <Card className="w-full max-w-sm shadow-md p-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-2 font-bold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500    text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-bold text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={passwordShown ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsTypingPassword(e.target.value.length > 0);
                  }}
                />
                {isTypingPassword && (
                  <button
                    type="button"
                    className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordShown ? (
                      <EyeIcon className="mb-3 h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="mb-3 h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button className="w-full bg-blue-500 hover:bg-blue-600">Sign In</Button>
          </form>

          {successMessage && <p className="text-green-500 text-sm mt-4">{successMessage}</p>}
          <Separator className="my-6" />

          <p className="mt-4 text-center text-sm text-gray-600 border-t pt-2">
            Akun belum terdaftar?{" "}
            <Link href="/register" className="text-blue-500 hover:text-blue-400 font-medium">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
