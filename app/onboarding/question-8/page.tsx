"use client";

import { useState } from "react";
import Link from "next/link";

const OPTIONS = ["Ya", "Tidak"];

export default function Question9Page() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border">
      {/* Back button */}
      <Link href="/onboarding/question-7" className="mt-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 active:text-gray-700 transition-colors w-fit">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Link>

      {/* Question label */}
      <p className="mt-4 text-[#2e7d32] font-semibold text-base">Pertanyaan 8 / 8</p>

      {/* Question heading */}
      <h1 className="mt-3 text-[2rem] font-extrabold text-gray-900 leading-tight">
        Apakah kamu pernah mencoba mengurangi menonton pornografi sebelumnya?
      </h1>

      {/* Answer options */}
      <div className="mt-10 flex flex-col gap-3">
        {OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`w-full text-left px-5 py-5 rounded-2xl text-base font-normal transition-colors ${selected === option
                ? "bg-[#2e7d32] text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-200"
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Continue button */}
      <div className="mt-auto w-full pb-8 pt-6">
        {selected ? (
          <Link href="/onboarding/question-9">
            <button className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-lg rounded-2xl py-4 transition-colors shadow-sm">
              Continue
            </button>
          </Link>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-white font-bold text-lg rounded-2xl py-4 cursor-not-allowed"
          >
            Continue
          </button>
        )}
      </div>
    </main>
  );
}
