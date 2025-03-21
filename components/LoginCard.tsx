"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Separator } from "@radix-ui/react-separator";

import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  const togglePasswordVisibility = () => setPasswordShown((prev) => !prev);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const validateForm = () => {
    let valid = true;
    let newErrors = {  email: "", password: "" };


    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }


    setErrors(newErrors);
    return valid;
  };
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      setSuccessMessage("Login successful! Redirecting to Dashboard...");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    };
  return (
    <div className="font-graphik flex justify-center w-full items-center">
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
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <Button className="w-full bg-blue-500 hover:bg-blue-600">Sign In</Button>
          </form>
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <Separator className="my-6" />

          <div className="mt-4 text-right">
            <Link href="/forgot-pass" className="text-blue-500 hover:text-blue-400 text-sm">
              Forgot password?
            </Link>
          </div>

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
