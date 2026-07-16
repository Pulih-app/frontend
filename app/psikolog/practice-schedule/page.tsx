"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import { ScheduleCalendar, dateValue, dayFromDate } from "@/components/ScheduleCalendar";

function rangeDays(startDate: string, endDate: string) {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const from = start < end ? start : end;
    const to = start < end ? end : start;

    const dates: string[] = [];
    const current = new Date(from);
    while (current <= to) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

export default function PracticeSchedulePage() {
    const router = useRouter();
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    });
    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    });
    const selectedDays = rangeDays(startDate, endDate);

    const selectDay = (dateStr: string) => {
        if (startDate === endDate) {
            const start = new Date(startDate);
            const clicked = new Date(dateStr);
            if (clicked < start) {
                setStartDate(dateStr);
                setEndDate(startDate);
                return;
            }

            setEndDate(dateStr);
            return;
        }

        setStartDate(dateStr);
        setEndDate(dateStr);
    };

    const continueToPricing = () => {
        window.localStorage.setItem("psychologist-practice-days", JSON.stringify(selectedDays));
        router.push("/psikolog/setup-pricing");
    };

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col border bg-white pb-8 text-black px-6">
            {/* Back button */}
            <button
                onClick={() => router.push("/psikolog/home")}
                className="mt-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 active:text-gray-700 transition-colors w-fit cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {/* Page Heading */}
            <h1 className="mt-4 text-[2rem] font-extrabold text-gray-900 leading-tight">
                Practice Schedule
            </h1>

            {/* Progress Step Dots */}
            <div className="flex items-center justify-center w-full max-w-[180px] mx-auto mb-8 mt-6 relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors bg-[#2e7d32] text-white">
                    1
                </div>
                <div className="flex-1 h-0.5 z-0 -mx-1 transition-colors bg-gray-200" />
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors bg-gray-200 text-gray-500">
                    2
                </div>
            </div>

            <section className="space-y-6">
                <ScheduleCalendar
                    availableDays={selectedDays}
                    selectedDays={selectedDays}
                    onSelectDay={selectDay}
                    className="border border-gray-200/80 rounded-3xl shadow-sm overflow-hidden"
                />

                {/* Date range inputs side-by-side */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                        Select Date Range
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="text-xs font-semibold text-gray-400">
                            Start Date
                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) => {
                                    setStartDate(event.target.value);
                                    setEndDate(event.target.value);
                                }}
                                className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none focus:border-[#2e7d32] focus:bg-white transition-colors"
                            />
                        </label>
                        <label className="text-xs font-semibold text-gray-400">
                            End Date
                            <input
                                type="date"
                                value={endDate}
                                onChange={(event) => setEndDate(event.target.value)}
                                className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none focus:border-[#2e7d32] focus:bg-white transition-colors"
                            />
                        </label>
                    </div>
                </div>

                {/* Time range inputs side-by-side */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                        Select Time Range
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="text-xs font-semibold text-gray-400">
                            Start Time
                            <input
                                type="time"
                                className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none focus:border-[#2e7d32] focus:bg-white transition-colors"
                            />
                        </label>
                        <label className="text-xs font-semibold text-gray-400">
                            End Time
                            <input
                                type="time"
                                className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none focus:border-[#2e7d32] focus:bg-white transition-colors"
                            />
                        </label>
                    </div>
                </div>
            </section>

            <div className="mt-auto pt-8">
                <Button
                    type="button"
                    onClick={continueToPricing}
                    className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-lg rounded-2xl py-4 transition-colors shadow-sm"
                >
                    Continue
                </Button>
            </div>
        </main>
    );
}
