"use client";

import { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export function Login() {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  return (
      <div className="w-full text-center">
        <Typography variant="h3" color="blue-gray" className="mb-2 text-2xl">
          Login
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
              <Typography variant="small" className="mb-2 block font-medium text-gray-900">
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              placeholder="name@gmail.com"
              className="w-full p-2 placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography variant="small" className="mb-2 block font-medium text-gray-900">
                Password
              </Typography>
            </label>
            <div className="relative">
              <Input
                id="password"
                size="lg"
                placeholder="********"
                labelProps={{
                  className: "hidden",
                }}
                className="w-full p-2 placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                type={passwordShown ? "text" : "password"}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={togglePasswordVisiblity}
              >
                {passwordShown ? (
                  <EyeIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <Button color="gray" size="lg" className="mt-6" fullWidth>
            Sign In
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography as="a" href="#" color="blue-gray" variant="small" className="font-medium text-blue-500 hover:text-blue-300">
              Forgot password?
            </Typography>
          </div>
          <Button variant="outlined" size="lg" className="mt-6 flex h-12 items-center justify-center gap-2" fullWidth>
            <img
              src="https://www.material-tailwind.com/logos/logo-google.png"
              alt="google"
              className="h-6 w-6"
            />
            Sign in with Google
          </Button>
          <Typography variant="small" color="gray" className="!mt-4 text-center font-normal">
            Not registered?{" "}
            <Link href="/register" className="font-medium text-blue-500 hover:text-blue-300">
              Create account
            </Link>
          </Typography>
        </form>
      </div>
  );
}

export default Login;
