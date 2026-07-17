"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";
import { TextField } from "@/components/TextField";
import Button from "@/components/Button";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setError(null);

    if (!agreedToPolicy) {
      setError("You must agree to the privacy policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const res = await fetch(`${base}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
          confirm_password: confirmPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? `Registration failed (${res.status})`);
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

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
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
        Register
      </h1>

      {/* Subtitle */}
      <p className="text-center text-gray-500 text-sm leading-relaxed mb-6 px-2 z-90">
        Take the first step toward your healing journey with us.
      </p>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm text-center mb-4 px-2">{error}</p>
      )}

      {/* Form fields */}
      <TextField
        icon={User}
        type="text"
        placeholder="Username"
        containerClassName="mb-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        icon={Mail}
        type="email"
        placeholder="Email"
        containerClassName="mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        icon={Lock}
        type="password"
        placeholder="Password"
        containerClassName="mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        icon={Lock}
        type="password"
        placeholder="Confirm Password"
        containerClassName="mb-8"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {/* Policy agreement checkbox */}
      <div className="flex items-start gap-3 z-90 px-2 mt-1 mb-6">
        <div className="relative flex items-center mt-0.3 shrink-0">
          <input
            type="checkbox"
            id="privacy-policy"
            checked={agreedToPolicy}
            onChange={(e) => setAgreedToPolicy(e.target.checked)}
            className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 checked:border-[#2e7d32] checked:bg-[#2e7d32] focus:outline-none transition-colors"
          />
          <svg
            className="absolute left-0 top-0 h-4 w-4 pointer-events-none hidden peer-checked:block text-white p-0.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <label htmlFor="privacy-policy" className="text-gray-500 text-xs leading-normal select-none cursor-pointer">
          I have read and agree to the{" "}
          <Link href="/privacy" className="underline hover:text-gray-700 transition-colors">
            privacy policy
          </Link>
          .
        </label>
      </div>

      {/* Submit button */}
      <Button type="button" onClick={handleRegister} disabled={loading} className="z-90">
        {loading ? "Registering..." : "Register"}
      </Button>

      {/* Login link */}
      <p className="text-center text-gray-500 text-sm mt-5 mb-2 z-90">
        Already have an account?{" "}
        <Link href="/" className="text-[#2e7d32] font-bold hover:underline">
          Login Here.
        </Link>
      </p>

      <p className="text-center text-gray-500 text-sm mb-4 z-90">
        Are you a professional?{" "}
        <Link href="/register/psikolog" className="text-[#2e7d32] font-bold hover:underline">
          Register as a Psychologist.
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
