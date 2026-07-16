"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

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
        Your data security matters. We only store whats truly needed, nothing more. See how its handled on this <a href="/privacy" className="underline">privacy policy</a>.
      </p>
      {/* Email / Username input */}
      <div className="relative mb-4 z-90">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <User size={20} strokeWidth={1.8} />
        </span>
        <input
          type="text"
          placeholder="Username"
          className="w-full bg-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-700 placeholder-gray-400 text-sm outline-none border-2 border-transparent focus:border-[#4caf50] transition-colors"
        />
      </div>
      <div className="relative mb-4 z-90">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Mail size={20} strokeWidth={1.8} />
        </span>
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-700 placeholder-gray-400 text-sm outline-none border-2 border-transparent focus:border-[#4caf50] transition-colors"
        />
      </div>

      {/* Password input */}
      <div className="relative mb-8 z-90">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock size={20} strokeWidth={1.8} />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full bg-gray-100 rounded-2xl py-4 pl-12 pr-12 text-gray-700 placeholder-gray-400 text-sm outline-none border-2 border-transparent focus:border-[#4caf50] transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
        >
          {showPassword ? (
            <Eye size={20} strokeWidth={1.8} />
          ) : (
            <EyeOff size={20} strokeWidth={1.8} />
          )}
        </button>
      </div>

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
