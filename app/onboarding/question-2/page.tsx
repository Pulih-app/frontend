"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { setOnboardingAnswer } from "@/lib/onboardingStore";

export default function Question2Page() {
    const [age, setAge] = useState<string>("");
    const router = useRouter();

    const isValid = age !== "" && Number(age) > 0;

    function handleContinue() {
        setOnboardingAnswer("current_age", age);
        router.push("/onboarding/question-3");
    }

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border">
            {/* Back button */}
            <Link href="/onboarding/question-1" className="mt-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 active:text-gray-700 transition-colors w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </Link>

            {/* Question label */}
            <p className="mt-4 text-[#2e7d32] font-semibold text-base">Question 2 / 8</p>

            {/* Question heading */}
            <h1 className="mt-3 text-[2rem] font-extrabold text-gray-900 leading-tight">
                How old are you now?
            </h1>

            {/* Number input */}
            <div className="mt-10">
                <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    className="w-full px-5 py-5 rounded-2xl bg-gray-100 text-gray-900 text-base font-normal outline-none focus:ring-2 focus:ring-[#2e7d32] transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>

            {/* Continue button */}
            <div className="mt-auto w-full pb-8 pt-6">
                {isValid ? (
                    <Button onClick={handleContinue}>Continue</Button>
                ) : (
                    <Button disabled className="!bg-gray-300 !hover:bg-gray-300 !active:bg-gray-300 cursor-not-allowed">Continue</Button>
                )}
            </div>
        </main>
    );
}
