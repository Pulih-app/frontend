"use client";

import { useState } from "react";
import Link from "next/link";

export default function Question2Page() {
    const [age, setAge] = useState<string>("");

    const isValid = age !== "" && Number(age) > 0;

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border">
            {/* Back button */}
            <Link href="/onboarding/question-1" className="mt-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 active:text-gray-700 transition-colors w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </Link>

            {/* Question label */}
            <p className="mt-4 text-[#2e7d32] font-semibold text-base">Pertanyaan 2 / 8</p>

            {/* Question heading */}
            <h1 className="mt-3 text-[2rem] font-extrabold text-gray-900 leading-tight">
                Berapa umur kamu sekarang?
            </h1>

            {/* Number input */}
            <div className="mt-10">
                <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Masukkan umur kamu"
                    className="w-full px-5 py-5 rounded-2xl bg-gray-100 text-gray-900 text-base font-normal outline-none focus:ring-2 focus:ring-[#2e7d32] transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>

            {/* Continue button */}
            <div className="mt-auto w-full pb-8 pt-6">
                {isValid ? (
                    <Link href="/onboarding/question-3">
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
