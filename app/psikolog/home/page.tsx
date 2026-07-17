"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { PsychologistShell } from "../_components/PsychologistShell";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { mockDb, Booking } from "../../lib/mockDb";

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
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [appointments, setAppointments] = useState<Booking[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [psyName, setPsyName] = useState("Doctor");

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            const savedName = window.localStorage.getItem("psychologist-name") || "Dr. Billy, M.Psi.";
            setPsyName(savedName);

            // Filter appointments by psychologist name
            const allBookings = mockDb.getBookings();
            const filtered = allBookings.filter(booking => booking.name === savedName);
            setAppointments(filtered);

            const savedDays = window.localStorage.getItem("psychologist-practice-days");
            if (savedDays) {
                setAvailableDays(JSON.parse(savedDays));
            }
        }
    }, []);

    const hasSchedule = isMounted && availableDays.length > 0;
    const displayDays = hasSchedule ? availableDays : fallbackDays;

    const completedCount = appointments.filter(app => app.status === "accepted").length;
    const totalCount = appointments.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <PsychologistShell>
            {/* Welcome Greeting */}
            <section className="mt-2">
                <h1 className="text-2xl font-black leading-none tracking-[-0.03em] text-gray-900">
                    Welcome, {psyName}! <span className="text-xl">👋</span>
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
                        {totalCount} Patients
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
                    <p className="text-sm font-black text-gray-900">Queue Progress: {completedCount} / {totalCount} Approved</p>
                    <div className="mt-3.5 h-[16px] overflow-hidden rounded-full bg-[#e6e6e6]">
                        <div className="h-full rounded-full bg-[#35b863]" style={{ width: `${progressPercent}%` }} />
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

                        {appointments.length > 0 ? (
                            <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory -mx-6 px-6">
                                {appointments.map((patient) => (
                                    <Link 
                                        key={patient.id}
                                        href={`/psikolog/session-detail?patient=${encodeURIComponent(patient.patientName)}&duration=${encodeURIComponent(patient.duration)}&timeSlot=${encodeURIComponent(patient.time)}&complaint=${encodeURIComponent(patient.challenge)}&type=${patient.type || "meet"}`}
                                        className="block relative overflow-hidden rounded-[28px] bg-[#f5f5f5] border border-gray-200/50 p-6 active:scale-[0.99] transition-transform text-gray-900 text-left w-[285px] shrink-0 snap-start cursor-pointer shadow-sm hover:bg-[#eaeaea]"
                                    >
                                        <span className="relative z-10 flex flex-col items-start min-w-0">
                                            <span className="block text-[18px] font-black leading-none text-gray-900 w-fit">
                                                {patient.patientName}
                                            </span>
                                            <span className="mt-3 inline-flex items-center rounded-full bg-[#0b744f] px-3.5 py-1 text-[10px] font-black tracking-wider uppercase text-white">
                                                {patient.duration}
                                            </span>
                                            <span className="mt-3 block text-sm font-black text-gray-800">
                                                {patient.time} {patient.date ? `(${patient.date})` : ""}
                                            </span>
                                            <span className="mt-1 block text-xs font-semibold text-gray-500 max-w-[210px] leading-relaxed line-clamp-2">
                                                Complaint: {patient.challenge}
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
                        ) : (
                            <div className="mt-4 rounded-[28px] bg-[#f5f5f5] border border-gray-200/50 p-6 text-center text-gray-400 text-sm font-bold">
                                No patients scheduled for today.
                            </div>
                        )}
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
