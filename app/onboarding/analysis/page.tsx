"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getOnboardingData, saveOnboardingResult } from "@/lib/onboardingStore";

const FACTS = [
    "Pornography hijacks your brain's reward system, trapping you in an endless cycle.",
    "The human brain can recover and form new habits in 90 days.",
    "Over 200 million people worldwide struggle with pornography addiction.",
    "Regular physical activity can help restore dopamine circuits in the brain.",
];

const MIN_DURATION_MS = 5000;

export default function AnalysisPage() {
    const [progress, setProgress] = useState(0);
    const [factIndex, setFactIndex] = useState(0);
    const router = useRouter();
    const timerDoneRef = useRef(false);
    const apiDoneRef = useRef(false);

    // Navigate only when both the minimum delay and the API call are complete
    function tryNavigate() {
        if (timerDoneRef.current && apiDoneRef.current) {
            router.push("/onboarding/analysis-result");
        }
    }

    useEffect(() => {
        // Progress bar animation
        const interval = 50;
        const steps = MIN_DURATION_MS / interval;
        let current = 0;

        const progressTimer = setInterval(() => {
            current += 1;
            setProgress(Math.min(Math.round((current / steps) * 100), 100));

            if (current >= steps) {
                clearInterval(progressTimer);
                timerDoneRef.current = true;
                tryNavigate();
            }
        }, interval);

        // API call
        const data = getOnboardingData();
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("auth_token")
                : null;
        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

        fetch(`${base}/api/v1/auth/onboarding`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
                nickname: data.nickname,
                porn_free_goal: data.porn_free_goal,
                answers: data.answers,
            }),
        })
            .then((res) => res.json())
            .then((json) => {
                if (json?.data) {
                    saveOnboardingResult(json.data);
                }
            })
            .catch(() => {
                // Fail silently — analysis-result will display a fallback
            })
            .finally(() => {
                apiDoneRef.current = true;
                tryNavigate();
            });

        return () => clearInterval(progressTimer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // Rotate facts every ~1.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setFactIndex((prev) => (prev + 1) % FACTS.length);
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border">
            {/* Mascot illustration */}
            <div className="flex items-center justify-center mt-32">
                <div className="relative w-64 h-64">
                    <Image
                        src="/assets/analysis.png"
                        alt="Maskot Pulih menganalisis"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Did you know label */}
            <p className="mt-8 text-center text-[#2e7d32] font-bold text-xl">
                Did you know?
            </p>

            {/* Rotating fact */}
            <div className="mt-4 px-2 min-h-[8rem] flex items-start justify-center">
                <h2
                    key={factIndex}
                    className="text-center text-gray-900 font-extrabold text-[1.6rem] leading-tight animate-fade-in"
                >
                    {FACTS[factIndex]}
                </h2>
            </div>

            {/* Progress bar */}
            <div className="mt-auto pb-10 w-full">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-[#2e7d32] rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="mt-3 text-center text-gray-500 text-sm">
                    Preparing your result...{progress}%
                </p>
            </div>
        </main>
    );
}
