"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  const togglePasswordVisibility = () => setPasswordShown((prev) => !prev);

  return (
    <div className="flex justify-center w-full items-center h-screen">
      <Card className="w-full max-w-sm shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-2 font-medium text-gray-700">
                Email
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
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
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

          <div className="mt-4 text-right">
            <Link href="#" className="text-blue-500 hover:text-blue-400 text-sm">
              Forgot password?
            </Link>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Not registered?{" "}
            <Link href="/register" className="text-blue-500 hover:text-blue-400 font-medium">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
