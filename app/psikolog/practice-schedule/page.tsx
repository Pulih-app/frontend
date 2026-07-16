"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import { ScheduleCalendar, dateValue, dayFromDate } from "../_components/ScheduleCalendar";

function rangeDays(startDate: string, endDate: string) {
    const start = dayFromDate(startDate);
    const end = dayFromDate(endDate) || start;
    const from = Math.min(start, end);
    const to = Math.max(start, end);

    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

export default function PracticeSchedulePage() {
    const router = useRouter();
    const [startDate, setStartDate] = useState(dateValue(16));
    const [endDate, setEndDate] = useState(dateValue(16));
    const selectedDays = rangeDays(startDate, endDate);

    const selectDay = (day: number) => {
        const value = dateValue(day);
        const startDay = dayFromDate(startDate);
        const endDay = dayFromDate(endDate);

        if (startDay === endDay) {
            if (day < startDay) {
                setStartDate(value);
                setEndDate(dateValue(startDay));
                return;
            }

            setEndDate(value);
            return;
        }

        setStartDate(value);
        setEndDate(value);
    };

    const continueToPricing = () => {
        window.localStorage.setItem("psychologist-practice-days", JSON.stringify(selectedDays));
        router.push("/psikolog/setup-pricing");
    };

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col border bg-white pb-8 text-black">
            <header className="border-b border-gray-200 px-5 py-7 text-center">
                <h1 className="text-lg font-bold text-slate-900">Practice Schedule</h1>
            </header>
            <section className="px-5 pt-6">
                <div className="mx-auto mb-8 flex w-40 items-center justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B5E4C] text-xs font-bold text-white">1</span>
                    <span className="h-0.5 flex-1 bg-[#1B5E4C]" />
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B5E4C] text-xs font-bold text-white">2</span>
                </div>
                <ScheduleCalendar
                    availableDays={selectedDays}
                    selectedDays={selectedDays}
                    onSelectDay={selectDay}
                    className="border-4 border-[#1B5E4C]"
                />
                <h2 className="mt-4 text-xl font-bold">Select Date Range</h2>
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                    <label className="text-sm font-semibold text-gray-400">
                        Start Date
                        <input
                            type="date"
                            value={startDate}
                            onChange={(event) => {
                                setStartDate(event.target.value);
                                setEndDate(event.target.value);
                            }}
                            className="mt-2 w-full rounded-2xl border border-[#1B5E4C] bg-[#F3F3F1] px-3 py-4 text-sm font-normal text-black outline-none"
                        />
                    </label>
                    <span className="pb-4 text-xl">-</span>
                    <label className="text-sm font-semibold text-gray-400">
                        End Date
                        <input
                            type="date"
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-[#1B5E4C] bg-[#F3F3F1] px-3 py-4 text-sm font-normal text-black outline-none"
                        />
                    </label>
                </div>
                <h2 className="mt-4 text-xl font-bold">Select Time Range</h2>
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                    <label className="text-sm font-semibold text-gray-400">
                        Start Time
                        <input type="time" className="mt-2 w-full rounded-2xl border border-[#1B5E4C] bg-[#F3F3F1] px-3 py-4 text-sm font-normal text-black outline-none" />
                    </label>
                    <span className="pb-4 text-xl">-</span>
                    <label className="text-sm font-semibold text-gray-400">
                        End Time
                        <input type="time" className="mt-2 w-full rounded-2xl border border-[#1B5E4C] bg-[#F3F3F1] px-3 py-4 text-sm font-normal text-black outline-none" />
                    </label>
                </div>
            </section>
            <div className="mt-auto px-5 pt-10">
                <Button type="button" onClick={continueToPricing} className="rounded-2xl bg-[#1B5E4C] py-4 shadow-md shadow-green-900/30">
                    Continue
                </Button>
            </div>
        </main>
    );
}
