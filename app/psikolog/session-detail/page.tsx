"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect, Suspense } from "react";

function SessionDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const patientName = searchParams.get("patient") || "Alex Morgan";
    const duration = searchParams.get("duration") || "1 Hour";
    const timeSlot = searchParams.get("timeSlot") || "13:00 - 14:00 WIB";
    const dateStr = searchParams.get("date") || "Friday, July 17, 2026";
    const complaint = searchParams.get("complaint") || "I often feel excessive anxiety and experience sudden shortness of breath with no clear trigger, especially in crowded places or when facing a piling workload.";

    const [profession, setProfession] = useState<"umum" | "klinis">("klinis");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = window.localStorage.getItem("psychologist-profession");
            if (saved === "umum" || saved === "klinis") {
                setProfession(saved);
            }
        }
    }, []);

    const handleStartCounseling = () => {
        if (profession === "umum" || patientName === "Mr. Bu") {
            router.push(`/psikolog/chat?patient=${encodeURIComponent(patientName)}&age=${encodeURIComponent("24 Years")}&duration=${encodeURIComponent(duration)}`);
        } else {
            alert("Opening Google Meet for Video Call Session...");
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border pb-8 text-black">
            {/* Top Navbar */}
            <header className="relative flex items-center justify-center py-4 border-b border-gray-100 -mx-6 px-6">
                <button
                    onClick={() => router.push("/psikolog/home")}
                    className="absolute left-6 text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Back"
                >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <h1 className="text-[17px] font-black text-gray-900 tracking-tight">
                    Session Details
                </h1>
            </header>

            {/* Patient Header Card */}
            <section className="relative overflow-hidden mt-6 rounded-[28px] bg-[#f5f5f5] border border-gray-200/50 p-6 shadow-sm text-left">
                <div className="relative z-10 flex flex-col items-start">
                    <h2 className="text-[20px] font-black text-gray-900 leading-none">
                        {patientName}
                    </h2>
                    <span className="mt-2.5 inline-flex items-center rounded-full bg-[#0b744f] px-3.5 py-1 text-[10px] font-black tracking-wider uppercase text-white">
                        24 Years
                    </span>
                    <p className="mt-2.5 text-xs font-semibold text-gray-500">
                        Male
                    </p>
                </div>
                {/* Green decorative quarter circle segment with gradient */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-[#35b863] to-[#2e7d32] rounded-tl-full pointer-events-none z-0" />
            </section>

            {/* Session Parameters */}
            <section className="mt-8">
                <div className="text-left">
                    <h3 className="text-lg font-black text-gray-900 leading-none">
                        Counseling Information
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                        Schedule and counseling delivery method details
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-[#f5f5f5] rounded-[20px] p-4 border border-gray-200/30 text-left">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Date</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">{dateStr}</span>
                    </div>
                    <div className="bg-[#f5f5f5] rounded-[20px] p-4 border border-gray-200/30 text-left">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Time & Duration</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">
                            {timeSlot} <span className="text-[10px] font-semibold text-gray-500 block mt-0.5">({duration})</span>
                        </span>
                    </div>
                    <div className="bg-[#f5f5f5] rounded-[20px] p-4 border border-gray-200/30 text-left">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Method</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">
                            {profession === "umum" || patientName === "Mr. Bu" ? "Chat (Online)" : "Video Call (Online)"}
                        </span>
                    </div>
                    <div className="bg-[#f5f5f5] rounded-[20px] p-4 border border-gray-200/30 text-left">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Payment Status</span>
                        <span className="text-sm font-black text-[#0b744f] mt-1 flex items-center gap-1.5">
                            Paid
                            <span className="inline-block w-2 h-2 bg-[#2e7d32] rounded-full animate-pulse" />
                        </span>
                    </div>
                </div>
            </section>

            {/* Complaint Section */}
            <section className="mt-8">
                <div className="text-left">
                    <h3 className="text-lg font-black text-gray-900 leading-none">
                        Complaint
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                        Messages and symptoms described by the patient
                    </p>
                </div>
                <div className="bg-[#effbf4]/60 border border-[#d2f3df]/50 rounded-[24px] p-5 text-sm font-semibold text-gray-700 leading-relaxed mt-3 text-left">
                    {complaint}
                </div>
            </section>

            {/* Start Counseling Actions */}
            <div className="mt-auto pt-8">
                <button 
                    onClick={handleStartCounseling}
                    type="button" 
                    className="w-full bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.98] text-white font-extrabold text-sm py-4 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-[#0b744f]/10 cursor-pointer"
                >
                    Start Counseling
                </button>
                <button
                    onClick={() => router.push("/psikolog/home")}
                    className="w-full bg-white border-2 border-[#0b744f] text-[#0b744f] hover:bg-gray-50 active:scale-[0.98] font-extrabold text-sm py-3.5 rounded-2xl transition-all text-center mt-3 cursor-pointer"
                >
                    Back to Home
                </button>
            </div>
        </main>
    );
}

export default function SessionDetailPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-bold">Loading...</div>}>
            <SessionDetailContent />
        </Suspense>
    );
}
