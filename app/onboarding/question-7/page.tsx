"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

const OPTIONS = ["Yes", "No"];

export default function Question8Page() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border">
      {/* Back button */}
      <Link href="/onboarding/question-6" className="mt-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 active:text-gray-700 transition-colors w-fit">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Link>

      {/* Question label */}
      <p className="mt-4 text-[#2e7d32] font-semibold text-base">Question 7 / 8</p>

      {/* Question heading */}
      <h1 className="mt-3 text-[2rem] font-extrabold text-gray-900 leading-tight">
        Do you watch pornography to escape feeling pain?
      </h1>

      {/* Answer options */}
      <div className="mt-10 flex flex-col gap-3">
        {OPTIONS.map((option) => (
          <Button variant="custom"
            key={option}
            onClick={() => setSelected(option)}
            className={`w-full text-left px-5 py-5 rounded-2xl text-base font-normal transition-colors ${selected === option
                ? "bg-[#2e7d32] text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-200"
              }`}
          >
            {option}
          </Button>
        ))}
      </div>

      {/* Continue button */}
      <div className="mt-auto w-full pb-8 pt-6">
        {selected ? (
          <Button href="/onboarding/question-8">Continue</Button>
        ) : (
          <Button disabled className="!bg-gray-300 !hover:bg-gray-300 !active:bg-gray-300 cursor-not-allowed">Continue</Button>
        )}
      </div>
    </main>
  );
}
