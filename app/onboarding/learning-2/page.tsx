"use client";

import Image from "next/image";
import Link from "next/link";

export default function Onboarding2Page() {
  return (
    <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border">
      {/* Mascot illustration */}
      <div className="flex items-center justify-center mt-32">
        <div className="relative w-64 h-64">
          <Image
            src="/assets/learning-2.png"
            alt="Maskot Pulih sedang sedih kehujanan"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Text content */}
      <div className="text-center px-2 mt-8 mb-10">
        <h1 className="text-4xl font-bold text-gray-900 leading-snug mb-5">
          Pornography is Like a Drug
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Watching pornography releases a chemical in the brain called dopamine. This chemical makes you feel good. This is why you feel pleasure when watching pornography.
        </p>
      </div>

      {/* Bottom navigation */}
      <div className="mt-auto w-full pb-8 pt-4 flex items-center justify-between">
        <Link href="/onboarding">
          <button
            aria-label="Back"
            className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="text-gray-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </Link>

        <Link href="/onboarding/learning-3">
          <button
            aria-label="Continue"
            className="w-16 h-16 rounded-full bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] flex items-center justify-center transition-colors shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </div>
    </main>
  );
}
