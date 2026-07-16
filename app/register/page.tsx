"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";
import { TextField } from "@/components/TextField";

export default function RegisterPage() {

  return (
    <main className="flex flex-col min-h-screen bg-white px-6 pt-16 pb-0 max-w-sm mx-auto w-full border ">
      {/* Logo badge */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16  flex items-center justify-center ">
          <Image
          src="/assets/logo.png"
          width={1000}
          height={1000}
          alt="Logo"
          className=""
          priority
        />
        </div>

        
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-3">
        Register
      </h1>

      {/* Subtitle */}
      <p className="text-center text-gray-500 text-sm leading-relaxed mb-8 px-2 z-90">
        Your data security matters. We only store whats truly needed, nothing more. See how its handled on this <Link href="/privacy" className="underline">privacy policy</Link>.
      </p>
      {/* Email / Username input */}
      <TextField
        icon={User}
        type="text"
        placeholder="Username"
        containerClassName="mb-4"
      />
      <TextField
        icon={Mail}
        type="email"
        placeholder="Email"
        containerClassName="mb-4"
      />

      {/* Password input */}
      <TextField
        icon={Lock}
        type="password"
        placeholder="Password"
        containerClassName="mb-8"
      />

      {/* Submit button */}
      <button
        type="button"
        className="w-full bg-[#2e7d32] z-90 hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-lg rounded-2xl py-4 transition-colors shadow-sm"
      >
        Register
      </button>

      {/* Register link */}
      <p className="text-center text-gray-500 text-sm mt-5 mb-4 z-90">
        Already have an account?{" "}
        <Link
          href="/"
          className="text-[#2e7d32] font-bold hover:underline"
        >
          Login Here.
        </Link>
      </p>

      {/* Mascot image — flush to bottom */}
      <div className="flex-1 flex items-end w-full">
        <Image
          src="/assets/login.png"
          alt="Maskot Pulih"
          fill
          className="object-contain object-bottom max-w-sm mx-auto z-0"
          priority
        />
      </div>
    </main>
  );
}
