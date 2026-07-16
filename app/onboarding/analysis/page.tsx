"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FACTS = [
    "Pornografi membajak sistem reward di otak kamu, menjebakmu dalam siklus yang tak berujung",
    "Otak manusia dapat pulih dan membentuk kebiasaan baru dalam 90 hari",
    "Lebih dari 200 juta orang di dunia berjuang melawan kecanduan pornografi",
    "Aktivitas fisik rutin dapat membantu memulihkan sirkuit dopamin di otak",
];

export default function AnalysisPage() {
    const [progress, setProgress] = useState(0);
    const [factIndex, setFactIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const duration = 5000; // 5 seconds total
        const interval = 50; // update every 50ms
        const steps = duration / interval;
        let current = 0;

        const timer = setInterval(() => {
            current += 1;
            const pct = Math.min(Math.round((current / steps) * 100), 100);
            setProgress(pct);

            if (current >= steps) {
                clearInterval(timer);
                router.push("/onboarding/analysis-result");
            }
        }, interval);

        return () => clearInterval(timer);
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
                Tahukah kamu?
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
                    Mempersiapkan hasilmu...{progress}%
                </p>
            </div>
        </main>
    );
}
