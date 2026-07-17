"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { getOnboardingResult, OnboardingResult } from "@/lib/onboardingStore";

type LevelStyle = {
    badge: string;
    icon: string;
};

function getLevelStyle(level: string): LevelStyle {
    switch (level?.toLowerCase()) {
        case "low":
            return {
                badge: "bg-green-100 text-green-600",
                icon: "text-green-600",
            };
        case "moderate":
            return {
                badge: "bg-amber-100 text-amber-600",
                icon: "text-amber-600",
            };
        case "severe":
            return {
                badge: "bg-red-200 text-red-700",
                icon: "text-red-700",
            };
        case "high":
        default:
            return {
                badge: "bg-red-100 text-red-500",
                icon: "text-red-500",
            };
    }
}

export default function AnalysisResultPage() {
    const [result] = useState<OnboardingResult | null>(() =>
        typeof window !== "undefined" ? getOnboardingResult() : null
    );

    const analysis = result?.onboarding_analysis;
    const level = analysis?.level ?? "High";
    const style = getLevelStyle(level);

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
                    <span
                        className={`inline-flex items-center gap-2 font-semibold text-base px-5 py-2 rounded-full ${style.badge}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`w-4 h-4 ${style.icon}`}
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {level}
                    </span>
                </div>

                {/* Heading */}
                <h1 className="mt-5 text-center text-[1.75rem] font-extrabold text-gray-900 leading-tight">
                    {analysis?.title ?? "Your Recovery Profile"}
                </h1>

                {/* Description */}
                <p className="mt-4 text-center text-gray-500 text-base leading-relaxed">
                    {analysis?.level_description ?? "We have analysed your answers and prepared a personalised recovery profile for you."}
                </p>

                {/* Disclaimer */}
                <p className="mt-3 text-center text-gray-400 text-sm italic">
                    This is only an indication*
                </p>

                {/* Cards */}
                <div className="mt-6 flex flex-col gap-4">
                    {/* Pattern analysis card */}
                    <div className="bg-[#f1f8f1] border-l-4 border-[#2e7d32] rounded-2xl px-5 py-4">
                        <p className="flex items-center gap-2 font-bold text-gray-900 text-base">
                            <span className="text-[#2e7d32] text-xl">&#x1F9E0;</span>
                            Pattern Analysis
                        </p>
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                            {analysis?.pattern_analysis ?? "Based on your answers, we have identified habit patterns that need attention."}
                        </p>
                    </div>

                    {/* Encouragement card */}
                    <div className="bg-[#f1f8f1] border-l-4 border-[#2e7d32] rounded-2xl px-5 py-4">
                        <p className="flex items-center gap-2 font-bold text-gray-900 text-base">
                            <span className="text-[#2e7d32] text-xl">&#x2665;</span>
                            Encouragement For You
                            {result?.nickname ? `, ${result.nickname}` : ""}
                        </p>
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                            {analysis?.encouragement ?? "You have taken an amazing first step. Keep fighting and never give up."}
                        </p>
                    </div>
                </div>
            </main>

            {/* Sticky bottom button */}
            <div className="px-6 pb-8 pt-4 bg-white">
                <Button href="/onboarding/home">Continue</Button>
            </div>
        </div>
    );
}
