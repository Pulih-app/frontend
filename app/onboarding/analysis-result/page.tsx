"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/Button";

export default function AnalysisResultPage() {
    const [username, setUsername] = useState("Anangggg");
    const [age, setAge] = useState("17");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedUsername = window.localStorage.getItem("user-username");
            if (savedUsername) {
                setUsername(savedUsername);
            }
            const savedAge = window.localStorage.getItem("user-age");
            if (savedAge) {
                setAge(savedAge);
            }
        }
    }, []);
    return (
        <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto w-full border">
            {/* Scrollable content */}
            <main className="flex-1 overflow-y-auto px-6 pb-4">
                {/* Mascot */}
                <div className="flex items-center justify-center mt-12">
                    <div className="relative w-48 h-48">
                        <Image
                            src="/assets/analysis-result.png"
                            alt="Maskot Pulih"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Severity badge */}
                <div className="flex justify-center mt-5">
                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-500 font-semibold text-base px-5 py-2 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        High
                    </span>
                </div>

                {/* Heading */}
                <h1 className="mt-5 text-center text-[1.75rem] font-extrabold text-gray-900 leading-tight">
                    Attention to Usage Patterns
                </h1>

                {/* Description */}
                <p className="mt-4 text-center text-gray-500 text-base leading-relaxed">
                    The data indicates an intensive pattern of pornography usage with high daily frequency, alongside an increase in content intensity over time.
                </p>

                {/* Disclaimer */}
                <p className="mt-3 text-center text-gray-400 text-sm italic">
                    *this is only an indication
                </p>

                {/* Cards */}
                <div className="mt-6 flex flex-col gap-4">
                    {/* Analisis Pola card */}
                    <div className="bg-[#f1f8f1] border-l-4 border-[#2e7d32] rounded-2xl px-5 py-4">
                        <p className="flex items-center gap-2 font-bold text-gray-900 text-base">
                            <span className="text-[#2e7d32] text-xl">&#x1F9E0;</span>
                            Pattern Analysis
                        </p>
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                            Using it as a coping mechanism for sadness, the increasing frequency, and the tendency to seek more extreme content indicate that this habit has become a strong dependency.
                        </p>
                    </div>

                    {/* Semangat Untukmu card */}
                    <div className="bg-[#f1f8f1] border-l-4 border-[#2e7d32] rounded-2xl px-5 py-4">
                        <p className="flex items-center gap-2 font-bold text-gray-900 text-base">
                            <span className="text-[#2e7d32] text-xl">&#x2665;</span>
                            Keep It Up, {username}
                        </p>
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                            You are very brave to acknowledge this condition at the age of {age}. This is a great first step toward change. Do not be too hard on yourself; focus on reducing it gradually and seek support from someone you trust or a professional if you find it difficult to handle alone.
                        </p>
                    </div>
                </div>
            </main>

            {/* Sticky bottom button */}
            <div className="px-6 pb-8 pt-4 bg-white">
                <Button href="/onboarding/home">Next</Button>
            </div>
        </div>
    );
}
