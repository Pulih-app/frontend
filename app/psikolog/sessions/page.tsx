"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Video, Calendar, X, ChevronLeft } from "lucide-react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";

interface Appointment {
    id: string;
    patientName: string;
    duration: string;
    timeSlot: string;
    status: "pending" | "accepted" | "rescheduled";
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const addDurationToTime = (startTimeStr: string, durationStr: string): string => {
    if (!startTimeStr) return "";
    const [hours, minutes] = startTimeStr.split(":").map(Number);
    let durationMinutes = 60;
    if (durationStr.includes("30")) durationMinutes = 30;
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + durationMinutes);
    const targetHours = String(date.getHours()).padStart(2, "0");
    const targetMinutes = String(date.getMinutes()).padStart(2, "0");
    return `${targetHours}:${targetMinutes}`;
};

/** Convert a UTC ISO string to WIB (UTC+7), returning both a date string and "HH:MM" time. */
function utcToWib(isoString: string): { date: string; time: string } {
    const date = new Date(isoString);
    const wibMs = date.getTime() + 7 * 60 * 60 * 1000;
    const wibDate = new Date(wibMs);
    const hours = String(wibDate.getUTCHours()).padStart(2, "0");
    const minutes = String(wibDate.getUTCMinutes()).padStart(2, "0");
    const dateStr = wibDate.toISOString().split("T")[0];
    return { date: dateStr, time: `${hours}:${minutes}` };
}

function formatDuration(minutes: number): string {
    if (minutes === 60) return "1 Hour";
    if (minutes === 30) return "30 Mins";
    return `${minutes} Mins`;
}

function mapApiStatus(apiStatus: string): Appointment["status"] {
    if (apiStatus === "completed") return "accepted";
    if (apiStatus === "rescheduled") return "rescheduled";
    return "pending";
}

function getAuthToken(): string {
    if (typeof window !== "undefined") {
        return localStorage.getItem("auth_token") ?? process.env.NEXT_PUBLIC_API_TOKEN ?? "";
    }
    return process.env.NEXT_PUBLIC_API_TOKEN ?? "";
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// ── Hardcoded fallback ─────────────────────────────────────────────────────────

const MOCK_APPOINTMENTS: Appointment[] = [
    { id: "1", patientName: "Alex Morgan", duration: "1 Hour", timeSlot: "13:00 - 14:00 WIB", status: "pending" },
    { id: "2", patientName: "Budi Santoso", duration: "1 Hour", timeSlot: "14:30 - 15:30 WIB", status: "pending" },
    { id: "3", patientName: "Siti Rahma", duration: "30 Mins", timeSlot: "16:00 - 16:30 WIB", status: "pending" },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function SessionsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Accept Modal States
    const [activeModalApp, setActiveModalApp] = useState<{ id: string; name: string } | null>(null);
    const [meetLink, setMeetLink] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [profession, setProfession] = useState<"umum" | "klinis">("klinis");

    // Reschedule Modal States
    const [activeRescheduleApp, setActiveRescheduleApp] = useState<Appointment | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleStartTime, setRescheduleStartTime] = useState("13:00");
    const [rescheduleEndTime, setRescheduleEndTime] = useState("14:00");
    const [rescheduleReason, setRescheduleReason] = useState("");

    // Load profession from localStorage, then fetch today's bookings
    useEffect(() => {
        setTimeout(async () => {
            if (typeof window === "undefined") return;

            const saved = window.localStorage.getItem("psychologist-profession");
            if (saved === "umum" || saved === "klinis") setProfession(saved);

            try {
                const token = getAuthToken();
                const res = await fetch(`${BASE_URL}/api/v1/psychologists/me/bookings/today`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();

                if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
                    // API returned empty or unsuccessful — keep mock data
                    return;
                }

                const mapped: Appointment[] = json.data.map(
                    (item: {
                        id: string;
                        status: string;
                        scheduledStartAt: string;
                        scheduledEndAt: string;
                        packageDurationMinutesSnapshot: number;
                        patient?: { fullName?: string; name?: string };
                    }) => {
                        const start = utcToWib(item.scheduledStartAt);
                        const end = utcToWib(item.scheduledEndAt);
                        return {
                            id: item.id,
                            patientName: item.patient?.fullName ?? item.patient?.name ?? "Patient",
                            duration: formatDuration(item.packageDurationMinutesSnapshot),
                            timeSlot: `${start.time} - ${end.time} WIB`,
                            status: mapApiStatus(item.status),
                        };
                    }
                );

                setAppointments(mapped);
            } catch (err) {
                // Network or parse error — keep mock data
                console.error("[SessionsPage] Failed to fetch today's bookings:", err);
            }
        }, 0);
    }, []);

    const handleAcceptClick = (id: string, name: string) => {
        setActiveModalApp({ id, name });
        setMeetLink("");
        setSelectedSchedule("");
    };

    const handleConfirmAccept = async () => {
        if (!activeModalApp) return;
        const { id, name } = activeModalApp;

        // Optimistically update local state and close modal immediately
        setAppointments((prev) =>
            prev.map((app) => (app.id === id ? { ...app, status: "accepted" } : app))
        );

        const detailInfo =
            profession === "klinis"
                ? `with Google Meet link: ${meetLink}`
                : `for schedule: ${selectedSchedule}`;

        setToastMessage(`Session for ${name} has been successfully approved ${detailInfo}!`);
        setActiveModalApp(null);
        setTimeout(() => setToastMessage(null), 4000);

        // Fire-and-forget API call
        try {
            const token = getAuthToken();
            const body =
                profession === "klinis"
                    ? JSON.stringify({ meetLink })
                    : JSON.stringify({});
            await fetch(`${BASE_URL}/api/v1/bookings/${id}/approve`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body,
            });
        } catch (err) {
            console.error("[SessionsPage] Failed to approve booking:", err);
        }
    };

    const handleRescheduleClick = (app: Appointment) => {
        setActiveRescheduleApp(app);
        setRescheduleDate("");
        setRescheduleReason("");
        const times = app.timeSlot.replace(/\./g, ":").match(/(\d{2}:\d{2})/g);
        let start = "13:00";
        if (times && times.length >= 1) start = times[0];
        setRescheduleStartTime(start);
        const calculatedEndTime = addDurationToTime(start, app.duration);
        setRescheduleEndTime(calculatedEndTime);
    };

    const handleStartTimeChange = (newStartTime: string) => {
        setRescheduleStartTime(newStartTime);
        if (activeRescheduleApp) {
            const calculatedEndTime = addDurationToTime(newStartTime, activeRescheduleApp.duration);
            setRescheduleEndTime(calculatedEndTime);
        }
    };

    const handleConfirmReschedule = async () => {
        if (!activeRescheduleApp) return;
        const { id, patientName } = activeRescheduleApp;

        const formattedDate = new Date(rescheduleDate).toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        const newTimeSlot = `${rescheduleStartTime} - ${rescheduleEndTime} WIB (${formattedDate})`;

        // Optimistically update local state
        setAppointments((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, status: "rescheduled", timeSlot: newTimeSlot } : app
            )
        );
        setActiveRescheduleApp(null);

        try {
            const token = getAuthToken();

            // 1. Fetch all available slots
            const slotsRes = await fetch(`${BASE_URL}/api/v1/psychologists/me/availability`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!slotsRes.ok) throw new Error(`HTTP ${slotsRes.status}`);

            const slotsJson = await slotsRes.json();
            // data is an array of date-objects each containing a nested slots[]
            const availabilityDates: Array<{ slots?: Array<{ id: string; startsAt: string }> }> =
                Array.isArray(slotsJson.data) ? slotsJson.data : [];
            const slots = availabilityDates.flatMap((d) => d.slots ?? []);

            // 2. Find a slot whose WIB date and time match the selected values
            const matchedSlot = slots.find((slot) => {
                const wib = utcToWib(slot.startsAt);
                return wib.date === rescheduleDate && wib.time === rescheduleStartTime;
            });

            if (!matchedSlot) {
                setToastMessage(
                    "No available slot found for the selected time. Please update your Practice Schedule first."
                );
                setTimeout(() => setToastMessage(null), 4000);
                return;
            }

            // 3. Call reschedule API
            await fetch(`${BASE_URL}/api/v1/bookings/${id}/reschedule`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newSessionSlotId: matchedSlot.id, reason: rescheduleReason }),
            });
        } catch (err) {
            console.error("[SessionsPage] Failed to reschedule booking:", err);
        }

        setToastMessage(
            `Reschedule for ${patientName} has been successfully submitted to ${formattedDate} at ${rescheduleStartTime} - ${rescheduleEndTime}!`
        );
        setTimeout(() => setToastMessage(null), 4000);
    };

    const isAcceptFormValid =
        profession === "klinis"
            ? meetLink.trim().startsWith("http") || meetLink.trim().length > 5
            : selectedSchedule !== "";

    const isRescheduleFormValid =
        rescheduleDate !== "" &&
        rescheduleStartTime !== "" &&
        rescheduleEndTime !== "" &&
        rescheduleReason.trim() !== "";

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border pb-8 relative text-black">
            {/* Top Navbar */}
            <header className="relative flex items-center justify-center py-4 border-b border-gray-100 -mx-6 px-6">
                <button onClick={() => router.push("/psikolog/home")} className="absolute left-6 text-gray-800 hover:text-gray-900 transition-colors cursor-pointer" aria-label="Back">
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <h1 className="text-[17px] font-black text-gray-900 tracking-tight">Practice Schedule</h1>
            </header>

            {/* Success Toast */}
            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0b744f] text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fadeIn w-80">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Appointment Request Cards list */}
            <div className="mt-8 flex flex-col gap-5">
                {appointments.map((app) => (
                    <div key={app.id} className={`bg-[#f5f5f5] rounded-[28px] p-6 border border-gray-200/40 flex flex-col gap-4 shadow-sm text-left relative overflow-hidden transition-all duration-300 ${app.status === "accepted" ? "opacity-60 grayscale scale-95" : ""}`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-[#35b863]/10 to-[#2e7d32]/10 rounded-bl-full pointer-events-none z-0" />
                        <div className="relative z-10 flex gap-4 items-center">
                            <div className="w-20 h-20 relative shrink-0 bg-white rounded-[22px] p-1.5 border border-gray-200/30 shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden flex items-center justify-center">
                                <Image src="/assets/psikolog/billy_lari.png" alt="Psychologist Mascot" fill className="object-contain p-1" />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <h3 className="font-black text-gray-900 text-base leading-tight border-b-2 border-[#0b744f]/20 pb-0.5 w-fit">{app.patientName}</h3>
                                <span className="w-fit px-3 py-0.5 bg-[#0b744f] text-white text-[9px] font-extrabold rounded-full mt-1.5">{app.duration}</span>
                                <p className="text-xs font-semibold text-gray-500 mt-1">{app.timeSlot}</p>
                            </div>
                        </div>
                        <div className="relative z-10 grid grid-cols-2 gap-3 border-t border-gray-200/40 pt-4">
                            {app.status === "accepted" ? (
                                <div className="col-span-2 text-center text-xs font-extrabold text-[#0b744f] bg-[#effbf4] border border-[#d2f3df]/30 py-2.5 rounded-xl">Session Approved</div>
                            ) : app.status === "rescheduled" ? (
                                <div className="col-span-2 text-center text-xs font-extrabold text-[#054b37] bg-[#effbf4] border border-[#d2f3df]/30 py-2.5 rounded-xl">Schedule Rescheduled</div>
                            ) : (
                                <>
                                    <button onClick={() => handleRescheduleClick(app)} className="w-full bg-white border border-[#0b744f] text-[#0b744f] hover:bg-gray-50 text-xs font-extrabold py-3.5 rounded-2xl transition-all active:scale-[0.97] cursor-pointer text-center">Reschedule</button>
                                    <button onClick={() => handleAcceptClick(app.id, app.patientName)} className="w-full bg-[#0b744f] hover:bg-[#095f40] text-white text-xs font-extrabold py-3.5 rounded-2xl transition-all active:scale-[0.97] cursor-pointer text-center shadow-md shadow-[#0b744f]/10">Accept</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Accept Confirmation Modal */}
            {activeModalApp && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Confirm Session</h3>
                            <button onClick={() => setActiveModalApp(null)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"><X size={20} /></button>
                        </div>
                        <div className="h-px bg-gray-100 w-full" />
                        {profession === "klinis" ? (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block px-1">Enter Google Meet Link</label>
                                <div className="relative flex items-center">
                                    <Video size={16} className="absolute left-4 text-gray-400" />
                                    <input type="text" placeholder="https://meet.google.com/..." value={meetLink} onChange={(e) => setMeetLink(e.target.value)} className="w-full rounded-2xl border-2 border-transparent bg-gray-100 pl-10 pr-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors" />
                                </div>
                                <p className="text-[10px] text-gray-400 px-1 mt-1 leading-relaxed">This Google Meet link will be automatically sent to the patient for the online video call session.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block px-1">Select Appointment Slot</label>
                                <div className="relative flex items-center">
                                    <Calendar size={16} className="absolute left-4 text-gray-400" />
                                    <select value={selectedSchedule} onChange={(e) => setSelectedSchedule(e.target.value)} className="w-full rounded-2xl border-2 border-transparent bg-gray-100 pl-10 pr-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors appearance-none cursor-pointer text-gray-800">
                                        <option value="">Select schedule...</option>
                                        <option value="Friday, July 17, 2026 (13:00 - 14:00 WIB)">Friday, July 17 (13:00 WIB)</option>
                                        <option value="Friday, July 17, 2026 (14:30 - 15:30 WIB)">Friday, July 17 (14:30 WIB)</option>
                                        <option value="Saturday, July 18, 2026 (10:00 - 11:00 WIB)">Saturday, July 18 (10:00 WIB)</option>
                                    </select>
                                </div>
                                <p className="text-[10px] text-gray-400 px-1 mt-1 leading-relaxed">Choose your offline practice time slot to confirm the appointment with the patient.</p>
                            </div>
                        )}
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setActiveModalApp(null)} className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 font-bold text-sm py-3 rounded-2xl transition-colors cursor-pointer">Cancel</button>
                            <button onClick={handleConfirmAccept} disabled={!isAcceptFormValid} className="flex-1 bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-sm py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#2e7d32]/10">Approve</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {activeRescheduleApp && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200 my-auto">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">Reschedule Session</h3>
                                <p className="text-[11px] font-semibold text-gray-400 mt-0.5">Patient: {activeRescheduleApp.patientName}</p>
                            </div>
                            <button onClick={() => setActiveRescheduleApp(null)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"><X size={20} /></button>
                        </div>
                        <div className="h-px bg-gray-100 w-full" />
                        <ScheduleCalendar selectedDays={rescheduleDate ? [rescheduleDate] : []} onSelectDay={(dateStr) => setRescheduleDate(dateStr)} className="border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden" />
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Selected Date</label>
                                <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors text-gray-800" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Select New Session Time</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="text-[9px] font-semibold text-gray-400">
                                        Start
                                        <input type="time" value={rescheduleStartTime} onChange={(e) => handleStartTimeChange(e.target.value)} className="mt-1 w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors text-gray-800" />
                                    </label>
                                    <label className="text-[9px] font-semibold text-gray-400">
                                        End
                                        <input type="time" value={rescheduleEndTime} onChange={(e) => setRescheduleEndTime(e.target.value)} className="mt-1 w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors text-gray-800" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Reschedule Reason</label>
                                <textarea value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} placeholder="Write the reason for rescheduling..." rows={2} className="w-full rounded-2xl border-2 border-transparent bg-[#f5f5f5] px-4 py-3 text-xs font-semibold outline-none focus:border-[#0b744f] focus:bg-white transition-colors text-gray-800 resize-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setActiveRescheduleApp(null)} className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 font-bold text-sm py-3 rounded-2xl transition-colors cursor-pointer">Cancel</button>
                            <button onClick={handleConfirmReschedule} disabled={!isRescheduleFormValid} className="flex-1 bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-sm py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#2e7d32]/10">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
