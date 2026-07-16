import { useState } from "react";

const dayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const monthLabels = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

type ScheduleCalendarProps = {
    availableDays: string[]; // YYYY-MM-DD
    selectedDays?: string[]; // YYYY-MM-DD
    onSelectDay?: (dateStr: string) => void;
    highlightedAvailable?: boolean;
    className?: string;
};

export function ScheduleCalendar({
    availableDays,
    selectedDays = [],
    onSelectDay,
    highlightedAvailable = false,
    className = "",
}: ScheduleCalendarProps) {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Sunday = 0, Monday = 1
    const offset = (firstDayIndex + 6) % 7; // Monday-first index offset

    const calendarCells: (number | null)[] = [];
    for (let i = 0; i < offset; i++) {
        calendarCells.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarCells.push(i);
    }

    return (
        <div className={`rounded-3xl border border-gray-200 bg-white px-4 py-4 ${className}`}>
            <div className="mb-5 flex items-center justify-between text-xs font-bold px-2">
                <span>{monthLabels[currentMonth]} {currentYear}</span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={prevMonth}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer text-base leading-none"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={nextMonth}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer text-base leading-none"
                    >
                        ›
                    </button>
                </div>
            </div>
            <div className="mb-4 grid grid-cols-7 text-center text-[10px] font-bold text-slate-500">
                {dayLabels.map((label) => (
                    <span key={label}>{label}</span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {calendarCells.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} className="h-8" />;
                    }

                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const available = availableDays.includes(dateStr);
                    const selected = selectedDays.includes(dateStr);
                    const active = highlightedAvailable && available;

                    return (
                        <button
                            key={dateStr}
                            type="button"
                            onClick={() => onSelectDay?.(dateStr)}
                            className={`h-8 rounded-xl border transition-all ${
                                selected ? "border-[#1B5E4C] bg-[#1B5E4C] font-bold text-white shadow-sm shadow-[#1B5E4C]/25" : "border-transparent"
                            } ${active ? "bg-[#1B5E4C] font-bold text-white shadow-sm shadow-[#1B5E4C]/25" : "text-gray-300"} ${
                                available && !active && !selected ? "border-gray-200 bg-gray-50 text-black hover:bg-gray-100" : ""
                            } ${onSelectDay ? "cursor-pointer" : "cursor-default"}`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function dateValue(day: number, year: number = 2026, month: number = 6) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function dayFromDate(value: string) {
    return Number(value.split("-").pop());
}
