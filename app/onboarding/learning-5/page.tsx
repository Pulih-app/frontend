"use client";

import Image from "next/image";
import Link from "next/link";


export default function OnboardingPage() {

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border">
            {/* Mascot illustration */}
            <div className="flex items-center justify-center mt-40">
                <div className="relative w-56 h-56">
                    <Image
                        src="/assets/learning-5.png"
                        alt="Maskot Pulih bertanya-tanya"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Text content */}
            <div className="text-center px-2 mb-10">
                <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-4">
                    Wajar Jika Kamu merasa Terjebak
                </h1>
                <p className="text-gray-400 text-base leading-relaxed">
                    Semakin banyak pornografi yang kamu
                    tonton, semakin banyak dopamin yang dibutuhkan otak kamu untuk merasa baik.
                    Inilah sebabnya pornografi tidak memuaskanmu seperti dulu.
                </p>
            </div>

            {/* Bottom Action */}
            <div className="mt-auto w-full pb-6 pt-4 bg-white z-10">
                <Link href="/onboarding/question-1">
                    <button className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-lg rounded-2xl py-4 transition-colors shadow-sm">
                        Continue
                    </button>
                </Link>
            </div>
        </main>
    );
}
