const dayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const days = Array.from({ length: 31 }, (_, index) => index + 1);

type ScheduleCalendarProps = {
    availableDays: number[];
    selectedDays?: number[];
    onSelectDay?: (day: number) => void;
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
    return (
        <div className={`rounded-sm border border-gray-200 bg-white px-4 py-4 ${className}`}>
            <div className="mb-5 flex items-center justify-center text-xs font-bold">
                <span>Juli 2026</span>
                <span className="ml-auto text-xl leading-none">›</span>
            </div>
            <div className="mb-4 grid grid-cols-7 text-center text-[8px] font-bold text-slate-500">
                {dayLabels.map((label) => (
                    <span key={label}>{label}</span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {days.map((day) => {
                    const available = availableDays.includes(day);
                    const selected = selectedDays.includes(day);
                    const active = highlightedAvailable && available;

                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() => onSelectDay?.(day)}
                            className={`h-8 rounded-sm border transition-colors ${
                                selected ? "border-[#1B5E4C] bg-[#1B5E4C] font-bold text-white" : "border-transparent"
                            } ${active ? "bg-[#1B5E4C] font-bold text-white" : "text-gray-300"} ${
                                available && !active && !selected ? "border-gray-300 text-black" : ""
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

export function dateValue(day: number) {
    return `2026-07-${String(day).padStart(2, "0")}`;
}

export function dayFromDate(value: string) {
    return Number(value.split("-").pop());
}
