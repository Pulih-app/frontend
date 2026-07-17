"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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

interface TodayPatient {
    id: string;
    name: string;
    duration: string;
    time: string;
    complaint: string;
    status: string;
}

function formatWIB(isoString: string): string {
    const date = new Date(isoString);
    // Add 7 hours (UTC+7) using UTC methods to avoid local-tz interference
    const wibMs = date.getTime() + 7 * 60 * 60 * 1000;
    const wibDate = new Date(wibMs);
    const hh = String(wibDate.getUTCHours()).padStart(2, "0");
    const mm = String(wibDate.getUTCMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
}

function mapDuration(minutes: number): string {
    if (minutes === 60) return "1 Hour";
    if (minutes === 30) return "30 Mins";
    if (minutes === 180) return "3 Hours";
    return `${minutes} Mins`;
}

export default function PsychologistHomePage() {
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [name, setName] = useState("Psychologist");
    const [profession, setProfession] = useState<"umum" | "klinis">("klinis");
    const [todayBookings, setTodayBookings] = useState<TodayPatient[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setIsMounted(true);
            if (typeof window !== "undefined") {
                const token = window.localStorage.getItem("auth_token");
                const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

                if (token) {
                    // Fetch psychologist profile
                    fetch(`${base}/api/v1/psychologists/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            if (json?.data) {
                                if (json.data.fullName) {
                                    setName(json.data.fullName);
                                }
                                if (json.data.type) {
                                    const mappedType = json.data.type === "general" ? "umum" : "klinis";
                                    setProfession(mappedType);
                                    window.localStorage.setItem("psychologist-profession", mappedType);
                                }
                            }
                        })
                        .catch((err) => {
                            console.error("Failed to fetch psychologist profile:", err);
                        });

                    // Fetch availability dates for the calendar
                    fetch(`${base}/api/v1/psychologists/me/availability`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            if (json?.data && Array.isArray(json.data)) {
                                const dates: string[] = json.data.map(
                                    (item: { date: string }) => item.date
                                );
                                setAvailableDays(dates);
                            }
                        })
                        .catch((err) => {
                            console.error("Failed to fetch availability:", err);
                            // availableDays stays empty; displayDays will fall back to fallbackDays
                        });

                    // Fetch today's bookings
                    fetch(`${base}/api/v1/psychologists/me/bookings/today`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            if (json?.data && Array.isArray(json.data)) {
                                const mapped: TodayPatient[] = json.data.map(
                                    (b: {
                                        id: string;
                                        scheduledStartAt: string;
                                        scheduledEndAt: string;
                                        packageDurationMinutesSnapshot: number;
                                        complaint: string;
                                        status: string;
                                        patient?: { fullName?: string };
                                        patientName?: string;
                                        patientUserId?: string;
                                    }) => {
                                        const patientName =
                                            b.patient?.fullName ??
                                            b.patientName ??
                                            b.patientUserId ??
                                            "Patient";
                                        const duration = mapDuration(b.packageDurationMinutesSnapshot);
                                        const startWIB = formatWIB(b.scheduledStartAt);
                                        const endWIB = formatWIB(b.scheduledEndAt);
                                        const time = `${startWIB} - ${endWIB} WIB`;
                                        return {
                                            id: b.id,
                                            name: patientName,
                                            duration,
                                            time,
                                            complaint: b.complaint,
                                            status: b.status,
                                        };
                                    }
                                );
                                setTodayBookings(mapped);
                                setCompletedCount(
                                    mapped.filter((b) => b.status === "completed").length
                                );
                            }
                        })
                        .catch((err) => {
                            console.error("Failed to fetch today's bookings:", err);
                            setTodayBookings([]);
                        })
                        .finally(() => {
                            setLoadingBookings(false);
                        });
                } else {
                    setLoadingBookings(false);
                }
            }
        }, 0);
    }, []);

    const hasSchedule = isMounted && (availableDays.length > 0 || todayBookings.length > 0);
    const displayDays = availableDays.length > 0 ? availableDays : fallbackDays;

    const progressPercent =
        todayBookings.length > 0
            ? `${(completedCount / todayBookings.length) * 100}%`
            : "0%";

    return (
        <PsychologistShell>
            {/* Welcome Greeting */}
            <section className="mt-2">
                <h1 className="text-2xl font-black leading-none tracking-[-0.03em] text-gray-900">
                    Welcome, {name}! <span className="text-xl">👋</span>
                </h1>
                <p className="mt-2 text-[13px] font-semibold leading-tight text-[#7f8b92]">
                    Here is your practice schedule and patient queue today
                </p>
            </section>

            {hasSchedule ? (
                <>
                    {/* Overview Progress Card */}
                    <section className="relative mt-6 overflow-hidden rounded-[30px] bg-[#0b744f] px-6 pb-[104px] pt-7 text-white shadow-[0_12px_24px_rgba(11,116,79,0.15)]">
                        <div className="relative z-10 max-w-[200px]">
                            <p className="text-[18px] font-black">Today&apos;s Overview</p>
                            <h2 className="mt-2 text-[40px] font-black leading-none tracking-[-0.03em]">
                                {todayBookings.length} Patients
                            </h2>
                            <p className="mt-4 text-xs leading-relaxed text-white/95">
                                {profession === "klinis"
                                    ? "Provide consultation and clinical guidance to help patients heal."
                                    : "Provide consultation and behavioral guidance to help patients heal."}
                            </p>
                        </div>

                        {/* Billy Mascot Illustration */}
                        <div className="absolute bottom-[60px] right-[-10px] h-[170px] w-[140px] opacity-95">
                            <Image
                                src="/assets/psikolog/billy_lari.png"
                                alt="Billy Psychologist Mascot"
                                fill
                                className="object-contain object-bottom"
                                priority
                                sizes="140px"
                            />
                        </div>

                        {/* White bottom progress bar container */}
                        <div className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-white px-8 pb-6 pt-5 text-[#818b92] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
                            <p className="text-sm font-black text-gray-900">
                                Queue Progress: {completedCount} / {todayBookings.length} Completed
                            </p>
                            <div className="mt-3.5 h-[16px] overflow-hidden rounded-full bg-[#e6e6e6]">
                                <div
                                    className="h-full rounded-full bg-[#35b863]"
                                    style={{ width: progressPercent }}
                                />
                            </div>
                        </div>
                    </section>

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
                            {todayBookings.map((patient) => (
                                <Link
                                    key={patient.id}
                                    href={`/psikolog/session-detail?patient=${encodeURIComponent(patient.name)}&duration=${encodeURIComponent(patient.duration)}&timeSlot=${encodeURIComponent(patient.time)}&complaint=${encodeURIComponent(patient.complaint)}&bookingId=${encodeURIComponent(patient.id)}`}
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
                                            Complaint: {patient.complaint}
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
