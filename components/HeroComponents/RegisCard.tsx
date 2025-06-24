"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface Errors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisCard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const ModelURL = process.env.NEXT_PUBLIC_API_URL;

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    if (!name.trim()) {
      newErrors.name = "Nama wajib diisi.";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password wajib diisi.";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password wajib diisi.";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak sesuai.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const res = await fetch(`${ModelURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.detail || "Pendaftaran akun gagal");
      }
  
      setSuccessMessage("Registrasi berhasil! Mengarahkan ke halaman login...");
  
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSuccessMessage(null);
        setErrors((prev) => ({
          ...prev,
          email: err.message || "Something went wrong",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-graphik flex justify-center items-center w-full mt-16 h-full">
      <Card className="w-full max-w-sm shadow-md p-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} >
            {/* Name */}
            <div className="mb-4">
              <Label htmlFor="name">
                Nama <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                autoComplete="name"
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                autoComplete="email"
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                  </button>
                )}
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <Label htmlFor="confirmPassword">
                Konfirmasi Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  autoComplete="new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword.length > 0 && (
                  <button
                    type="button"
                    aria-label="Toggle confirm password visibility"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                  </button>
                )}
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            {/* Success Message */}
            {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

            {/* Submit Button */}
            <Button className="w-full bg-blue-500 hover:bg-blue-600" type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Submit"}
            </Button>
          </form>

          {/* Redirect to Sign In */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Sudah mempunyai akun?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
