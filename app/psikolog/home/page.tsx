"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { PsychologistShell } from "../_components/PsychologistShell";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";

const fallbackDays = [
    "2026-07-16",
    "2026-07-17",
    "2026-07-20",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24",
    "2026-07-27",
    "2026-07-28",
    "2026-07-29",
    "2026-07-30",
    "2026-07-31",
];

export default function PsychologistHomePage() {
    const [availableDays] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];

        const saved = window.localStorage.getItem("psychologist-practice-days");
        return saved ? JSON.parse(saved) : [];
    });

    const hasSchedule = availableDays.length > 0;
    const displayDays = hasSchedule ? availableDays : fallbackDays;

    const todayPatients = [
        {
            id: "1",
            name: "Alex Morgan",
            duration: "1 Hour",
            time: "13:00 - 14:00 WIB",
            complaint: "Seeking relapse prevention & emotional guidance.",
        },
        {
            id: "2",
            name: "Budi Santoso",
            duration: "1 Hour",
            time: "14:30 - 15:30 WIB",
            complaint: "Dealing with work-related stress and anxiety triggers.",
        },
        {
            id: "3",
            name: "Siti Rahma",
            duration: "30 Mins",
            time: "16:00 - 16:30 WIB",
            complaint: "Needs support to manage sudden panic attacks.",
        },
        {
            id: "4",
            name: "Jane Smith",
            duration: "1 Hour",
            time: "17:00 - 18:00 WIB",
            complaint: "First onboarding counseling and goal setting.",
        },
    ];

    return (
        <PsychologistShell>
            {/* Welcome Greeting */}
            <section className="mt-2">
                <h1 className="text-2xl font-black leading-none tracking-[-0.03em] text-gray-900">
                    Welcome, Doctor! <span className="text-xl">👋</span>
                </h1>
                <p className="mt-2 text-[13px] font-semibold leading-tight text-[#7f8b92]">
                    Here is your practice schedule and patient queue today
                </p>
            </section>

            {/* Overview Progress Card */}
            <section className="relative mt-6 overflow-hidden rounded-[30px] bg-[#0b744f] px-6 pb-[104px] pt-7 text-white shadow-[0_12px_24px_rgba(11,116,79,0.15)]">
                <div className="relative z-10 max-w-[200px]">
                    <p className="text-[18px] font-black">Today&apos;s Overview</p>
                    <h2 className="mt-2 text-[40px] font-black leading-none tracking-[-0.03em]">
                        4 Patients
                    </h2>
                    <p className="mt-4 text-xs leading-relaxed text-white/95">
                        Provide consultation and clinical guidance to help patients heal.
                    </p>
                </div>

                {/* Billy Mascot Illustration */}
                <div className="absolute bottom-[60px] right-[-10px] h-[170px] w-[140px] opacity-95">
                    <Image
                        src="/assets/psikolog/billy_lari.png"
                        alt="Billy Doctor Mascot"
                        fill
                        className="object-contain object-bottom"
                        priority
                        sizes="140px"
                    />
                </div>

                {/* White bottom progress bar container */}
                <div className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-white px-8 pb-6 pt-5 text-[#818b92] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
                    <p className="text-sm font-black text-gray-900">Queue Progress: 2 / 4 Completed</p>
                    <div className="mt-3.5 h-[16px] overflow-hidden rounded-full bg-[#e6e6e6]">
                        <div className="h-full w-[50%] rounded-full bg-[#35b863]" />
                    </div>
                </div>
            </section>

            {hasSchedule ? (
                <>
                    {/* Today's Queue Section */}
                    <section className="mt-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black tracking-[-0.02em] text-gray-900">
                                Today&apos;s Patients
                            </h2>
                            <Link href="/psikolog/sessions" className="text-xs font-black text-[#2e7d32] hover:underline">
                                See All
                            </Link>
                        </div>

                        <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory -mx-6 px-6">
                            {todayPatients.map((patient) => (
                                <Link 
                                    key={patient.id}
                                    href="/psikolog/session-detail" 
                                    className="block relative overflow-hidden rounded-[28px] bg-[#f5f5f5] border border-gray-200/50 p-6 active:scale-[0.99] transition-transform text-gray-900 text-left w-[285px] shrink-0 snap-start cursor-pointer shadow-sm hover:bg-[#eaeaea]"
                                >
                                    <span className="relative z-10 flex flex-col items-start min-w-0">
                                        <span className="block text-[18px] font-black leading-none text-gray-900 w-fit">
                                            {patient.name}
                                        </span>
                                        <span className="mt-3 inline-flex items-center rounded-full bg-[#0b744f] px-3.5 py-1 text-[10px] font-black tracking-wider uppercase text-white">
                                            {patient.duration}
                                        </span>
                                        <span className="mt-3 block text-sm font-black text-gray-800">
                                            {patient.time}
                                        </span>
                                        <span className="mt-1 block text-xs font-semibold text-gray-500 max-w-[210px] leading-relaxed line-clamp-2">
                                            Keluhan: {patient.complaint}
                                        </span>
                                    </span>

                                    {/* Green decorative quarter circle segment with gradient */}
                                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-[#35b863] to-[#2e7d32] rounded-tl-full pointer-events-none z-0" />
                                    
                                    {/* Chevron inside the green corner */}
                                    <div className="absolute bottom-4 right-4 text-white z-10 pointer-events-none">
                                        <ChevronRight size={20} strokeWidth={3} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Practice Calendar Section */}
                    <section className="mt-8 mb-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black tracking-[-0.02em] text-gray-900">
                                Practice Calendar
                            </h2>
                            <Link href="/psikolog/practice-schedule" className="text-xs font-black text-[#2e7d32] hover:underline">
                                Edit
                            </Link>
                        </div>
                        <div className="mt-4">
                            <ScheduleCalendar availableDays={displayDays} selectedDays={displayDays} className="shadow-sm border-gray-100" />
                        </div>
                    </section>
                </>
            ) : (
                <section className="mt-8 flex flex-col items-center justify-center rounded-[30px] bg-gray-50 border border-gray-200/60 p-8 text-center">
                    <div className="relative w-36 h-36">
                        <Image 
                            src="/assets/psikolog/billy_pusing.png" 
                            fill 
                            className="object-contain" 
                            alt="No schedule yet" 
                            priority 
                        />
                    </div>
                    <h2 className="mt-6 text-base font-black text-gray-900">
                        Let&apos;s set up your practice schedule first!
                    </h2>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-[#7f8b92] max-w-[240px]">
                        Define your active hours so patients can easily search and book consultation sessions with you.
                    </p>
                    <Link 
                        href="/psikolog/practice-schedule" 
                        className="mt-5 rounded-2xl bg-[#0b744f] hover:bg-[#095f40] px-6 py-3.5 text-xs font-extrabold text-white shadow-md shadow-[#0b744f]/20 transition-colors"
                    >
                        Set Practice Days
                    </Link>
                </section>
            )}
        </PsychologistShell>
    );
}
