"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import { saveOnboardingField } from "@/lib/onboardingStore";

const OPTIONS = ["7 days", "14 days", "30 days", "69 days"];

export default function SetTargetPage() {
    const [selected, setSelected] = useState<string>("14 days");
    const [customDays, setCustomDays] = useState<string>("");
    const [isCustomActive, setIsCustomActive] = useState(false);
    const router = useRouter();

    function handleContinue() {
        const days = isCustomActive
            ? parseInt(customDays, 10)
            : parseInt(selected.match(/\d+/)![0], 10);
        saveOnboardingField({ porn_free_goal: days });
        router.push("/onboarding/analysis");
    }

    function handleCustomChange(value: string) {
        // Only allow digits
        const digits = value.replace(/\D/g, "");
        setCustomDays(digits);
        if (digits) {
            setSelected("");
            setIsCustomActive(true);
        } else {
            setIsCustomActive(false);
        }
    }

    function handleOptionSelect(option: string) {
        setSelected(option);
        setCustomDays("");
        setIsCustomActive(false);
    }

    const hasValidSelection = selected || (isCustomActive && customDays !== "");

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border">
            {/* Mascot illustration */}
            <div className="flex items-center justify-center mt-16">
                <div className="relative w-52 h-52">
                    <Image
                        src="/assets/set-target.png"
                        alt="Maskot Pulih memanah"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Heading */}
            <h1 className="mt-10 text-[2rem] font-extrabold text-gray-900 leading-tight text-center">
                Let's start with a small goal to build momentum.
            </h1>

            {/* Target options */}
            <div className="mt-10 flex flex-col gap-3">
                {OPTIONS.map((option) => {
                    const isSelected = !isCustomActive && selected === option;
                    return (
                        <button
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full py-5 rounded-2xl text-base transition-colors ${
                                isSelected
                                    ? "bg-[#e8f5e9] border-2 border-[#2e7d32] text-[#2e7d32] font-bold"
                                    : "bg-gray-100 border-2 border-transparent text-gray-400 font-normal"
                            }`}
                        >
                            {option}
                        </button>
                    );
                })}

                {/* Custom input */}
                <div
                    className={`flex items-center gap-2 w-full px-5 py-4 rounded-2xl border-2 transition-colors ${
                        isCustomActive
                            ? "bg-[#e8f5e9] border-[#2e7d32]"
                            : "bg-gray-100 border-transparent"
                    }`}
                >
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Set your own goal"
                        value={customDays}
                        onChange={(e) => handleCustomChange(e.target.value)}
                        className={`flex-1 bg-transparent outline-none text-base ${
                            isCustomActive
                                ? "text-[#2e7d32] font-bold placeholder:text-[#81c784]"
                                : "text-gray-400 font-normal placeholder:text-gray-400"
                        }`}
                    />
                    {customDays !== "" && (
                        <span className={`text-base font-bold ${
                            isCustomActive ? "text-[#2e7d32]" : "text-gray-400"
                        }`}>
                            days
                        </span>
                    )}
                </div>
            </div>

            {/* Continue button */}
            <div className="mt-auto w-full pb-8 pt-6">
                {hasValidSelection ? (
                    <Button onClick={handleContinue}>Continue</Button>
                ) : (
                    <Button
                        disabled
                        className="bg-gray-300! hover:bg-gray-300! active:bg-gray-300! cursor-not-allowed"
                    >
                        Continue
                    </Button>
                )}
            </div>
        </main>
    );
}
