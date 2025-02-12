"use client"; // Pastikan ini berada di baris pertama

import { useState, FormEvent } from "react";
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import Link from "next/link";

export function SimpleRegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !agree) {
      setError("Semua kolom harus diisi dan menyetujui syarat & ketentuan.");
      return;
    }

    setError("");
    alert("Registrasi berhasil!");
  };

  return (
    <Card color="transparent" shadow={false} className="items-center justify-center shadow-lg w-full h-full">
      <Typography variant="h4" color="blue-gray">
        Sign Up
      </Typography>

      <form className="mt-8 mb-2 w-full sm:w-96" onSubmit={handleSubmit}>
        <div className="mb-1 flex flex-col gap-4">
          {/* Name Input */}
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex items-center">
            Your Name <span className="text-red-500 ml-1">*</span>
          </Typography>
          <Input
            size="lg"
            placeholder="Your Name"
            className="p-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{ className: "before:content-none after:content-none" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email Input */}
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex items-center">
            Your Email <span className="text-red-500 ml-1">*</span>
          </Typography>
          <Input
            size="lg"
            placeholder="name@gmail.com"
            className="p-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{ className: "before:content-none after:content-none" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex items-center">
            Password <span className="text-red-500 ml-1">*</span>
          </Typography>
          <Input
            type="password"
            size="lg"
            placeholder="********"
            className="p-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{ className: "before:content-none after:content-none" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Checkbox for Terms & Conditions */}
        <Checkbox
          className="m-2 p-2"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          labelProps={{
            className: "flex items-center font-normal",
            children: (
              <>
                I agree to the
                <a href="#" className="font-medium transition-colors text-blue-500 hover:text-blue-900">
                  &nbsp;Terms and Conditions
                </a>
                <span className="text-red-500 ml-1">*</span>
              </>
            ),
          }}
          containerProps={{ className: "-ml-2.5" }}
        />

        {/* Error Message */}
        {error && <Typography color="red" className="mt-2 text-sm">{error}</Typography>}

        {/* Submit Button */}
        <Button className="mt-6 bg-sky-500 p-2 " type="submit">
          Daftar
        </Button>

        {/* Redirect to Sign In */}
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-900 hover:text-blue-300">
            Masuk
          </Link>
        </Typography>
      </form>
    </Card>
  );
}

export default SimpleRegistrationForm;
