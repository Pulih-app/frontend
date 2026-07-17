"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface MoodOption {
    label: string;
    emoji: string;
    value: number;
    /** Indonesian mood string sent to the API */
    apiValue: string;
}

export default function RelapsePage() {
    const router = useRouter();
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
    const [commitmentMessage, setCommitmentMessage] = useState("");
    const [dateString, setDateString] = useState("");
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Set today's date in English format
    useEffect(() => {
        // State updates must happen in a callback, not synchronously in the
        // effect body (Next.js 16 rule). Use Promise.resolve to defer.
        Promise.resolve().then(() => {
            const today = new Date();
            setDateString(
                today.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                })
            );
        });
    }, []);

    const moods: MoodOption[] = [
        { label: "Very Bad",  emoji: "😢", value: 1, apiValue: "sangat buruk" },
        { label: "Bad",       emoji: "😟", value: 2, apiValue: "cemas"        },
        { label: "Neutral",   emoji: "😐", value: 3, apiValue: "netral"       },
        { label: "Good",      emoji: "😊", value: 4, apiValue: "baik"         },
        { label: "Very Good", emoji: "🤩", value: 5, apiValue: "tenang"       },
    ];

    const handleTriggerToggle = (trigger: string) => {
        setSelectedTriggers(prev =>
            prev.includes(trigger)
                ? prev.filter(t => t !== trigger)
                : [...prev, trigger]
        );
    };

    const handleSubmit = async () => {
        if (selectedMood === null) {
            setError("Please select your mood before submitting.");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        const token =
            localStorage.getItem("auth_token") ??
            process.env.NEXT_PUBLIC_API_TOKEN ??
            "";
        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

        const moodApiValue =
            moods.find((m) => m.value === selectedMood)?.apiValue ?? "netral";

        const now = new Date();
        const localDate = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
        ].join("-");

        try {
            const res = await fetch(`${base}/api/v1/routine/relapses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    mood: moodApiValue,
                    relapse_trigger: selectedTriggers,
                    commitment: commitmentMessage.trim(),
                    localDate,
                }),
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message ?? `Server error ${res.status}`);
            }

            setShowSuccessToast(true);
            setTimeout(() => {
                setShowSuccessToast(false);
                router.push("/home");
            }, 1500);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong. Try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col overflow-hidden border-x bg-white px-6 pb-28 pt-6 text-black">
            {/* Header */}
            <header className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                    aria-label="Back"
                >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <span className="text-[14px] font-bold text-gray-400">
                    {dateString || "Tuesday, June 16, 2026"}
                </span>
                <div className="w-10" /> {/* Spacer */}
            </header>

            {/* Streak Reset Card */}
            <section className="relative mt-6 overflow-hidden rounded-[30px] bg-[#0b744f] px-6 py-7 text-white shadow-[0_12px_24px_rgba(11,116,79,0.15)] flex flex-col items-center justify-center">
                {/* Billy Reset Illustration */}
                <div className="relative w-40 h-40 mt-1 mb-1">
                    <Image
                        src="/assets/billy_relapse.png"
                        alt="Billy Relapse Reset"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                
                <h2 className="mt-4 text-2xl font-black tracking-tight text-center">
                    It&apos;s Okay
                </h2>
                <span className="mt-1 text-sm font-extrabold tracking-wide text-white/90 text-center">
                    Falling doesn&apos;t mean failing
                </span>

                {/* Quotes box */}
                <div className="mt-6 w-full rounded-2xl bg-[#095f40] px-4 py-3.5 border border-[#0c7f56]/30">
                    <p className="text-[11px] font-medium leading-relaxed text-center italic text-white/90">
                        &ldquo;What matters is that you are honest with yourself and rise again.&ldquo;
                    </p>
                </div>
            </section>

            {/* Mood Selector Section */}
            <section className="mt-8">
                <h2 className="text-[18px] font-black tracking-tight text-gray-900">
                    How is Your Mood?
                </h2>
                <p className="text-xs font-semibold text-gray-400 mt-1 leading-snug">
                    Choose the one that best describes your feelings right now
                </p>

                <div className="mt-4 rounded-[24px] bg-[#effbf4] border border-[#d2f3df]/30 px-2 py-3">
                    <div className="flex justify-between items-center gap-1">
                        {moods.map((mood) => {
                            const isSelected = selectedMood === mood.value;
                            return (
                                <button
                                    key={mood.value}
                                    onClick={() => setSelectedMood(mood.value)}
                                    className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl flex-1 transition-all duration-200 cursor-pointer ${
                                        isSelected 
                                            ? "bg-[#0b744f] text-white shadow-md shadow-[#0b744f]/20 scale-105" 
                                            : "bg-transparent text-gray-500 opacity-80 hover:opacity-100 hover:bg-black/5"
                                    }`}
                                >
                                    <span className="text-3xl filter drop-shadow-sm select-none">
                                        {mood.emoji}
                                    </span>
                                    <span
                                        className={`text-[9px] font-extrabold tracking-tight transition-colors text-center whitespace-nowrap ${
                                            isSelected ? "text-white" : "text-gray-400"
                                        }`}
                                    >
                                        {mood.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Relapse Triggers Section */}
            <section className="mt-8">
                <h2 className="text-[18px] font-black tracking-tight text-gray-900">
                    What is your Relapse trigger?
                </h2>
                <p className="text-xs font-semibold text-gray-400 mt-1 leading-snug">
                    Select one or more triggers you encountered
                </p>
                <div className="flex flex-wrap gap-2.5 mt-4">
                    {["Boredom", "Stress", "Media", "Mood", "Location"].map((trigger) => {
                        const isSelected = selectedTriggers.includes(trigger.toLowerCase());
                        return (
                            <button
                                key={trigger}
                                onClick={() => handleTriggerToggle(trigger.toLowerCase())}
                                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                                    isSelected
                                        ? "bg-[#0b744f] border-[#0b744f] text-white shadow-sm shadow-[#0b744f]/20 scale-105"
                                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100/50"
                                }`}
                            >
                                {trigger}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Commitment Message Section */}
            <section className="mt-8">
                <h2 className="text-[18px] font-black tracking-tight text-gray-900">
                    Commitment Message
                </h2>
                <p className="text-xs font-semibold text-gray-400 mt-1 leading-snug">
                    Write a promise or commitment to yourself to rise again
                </p>
                <textarea
                    value={commitmentMessage}
                    onChange={(e) => setCommitmentMessage(e.target.value)}
                    placeholder="Example: I will rise stronger and commit to avoiding triggers..."
                    className="w-full min-h-[90px] rounded-[24px] border-2 border-transparent bg-gray-100 p-5 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors text-gray-800 placeholder-gray-400 mt-4 resize-none leading-relaxed"
                />
            </section>

            {/* Success Toast Overlay */}
            {/* Error Banner */}
            {error && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
                    <div className="flex items-center gap-2.5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 shadow-sm">
                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                        <p className="text-xs font-semibold text-red-600 leading-snug">{error}</p>
                    </div>
                </div>
            )}

            {showSuccessToast && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[280px] shadow-2xl border border-gray-100 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200">
                        <CheckCircle2 size={44} className="text-[#0b744f] animate-bounce" />
                        <h3 className="text-base font-bold text-gray-900 text-center">
                            Relapse Recorded
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 text-center leading-relaxed">
                            Your progress has been reset. Let&apos;s rise back stronger!
                        </p>
                    </div>
                </div>
            )}

            {/* Fixed Footer Relapse Button */}
            <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm bg-white border-t border-gray-100 px-6 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.98] text-white font-extrabold text-sm py-4 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-[#0b744f]/10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <span>{isSubmitting ? "Submitting..." : "Relapse"}</span>
                </button>
            </footer>
        </main>
    );
}
