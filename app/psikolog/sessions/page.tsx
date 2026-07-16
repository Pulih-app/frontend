"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Video, Calendar, X } from "lucide-react";
import Button from "@/components/Button";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";

interface Appointment {
    id: string;
    patientName: string;
    duration: string;
    timeSlot: string;
    status: "pending" | "accepted" | "rescheduled";
}

export default function SessionsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: "1",
            patientName: "Nama Pasien",
            duration: "1 Jam",
            timeSlot: "13.00 - 14.00 WIB",
            status: "pending",
        },
        {
            id: "2",
            patientName: "Budi Santoso",
            duration: "1 Jam",
            timeSlot: "14.30 - 15.30 WIB",
            status: "pending",
        },
        {
            id: "3",
            patientName: "Siti Rahma",
            duration: "30 Menit",
            timeSlot: "16.00 - 16.30 WIB",
            status: "pending",
        },
    ]);

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Accept Modal States
    const [activeModalApp, setActiveModalApp] = useState<{ id: string; name: string } | null>(null);
    const [meetLink, setMeetLink] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [profession, setProfession] = useState<"umum" | "klinis">("klinis");

    // Reschedule Modal States
    const [activeRescheduleApp, setActiveRescheduleApp] = useState<{ id: string; name: string } | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleStartTime, setRescheduleStartTime] = useState("13:00");
    const [rescheduleEndTime, setRescheduleEndTime] = useState("14:00");

    // Load profession from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = window.localStorage.getItem("psychologist-profession");
            if (saved === "umum" || saved === "klinis") {
                setProfession(saved);
            }
        }
    }, []);

    const handleAcceptClick = (id: string, name: string) => {
        setActiveModalApp({ id, name });
        setMeetLink("");
        setSelectedSchedule("");
    };

    const handleConfirmAccept = () => {
        if (!activeModalApp) return;
        const { id, name } = activeModalApp;

        setAppointments((prev) =>
            prev.map((app) => (app.id === id ? { ...app, status: "accepted" } : app))
        );

        const detailInfo =
            profession === "klinis"
                ? `dengan link Google Meet: ${meetLink}`
                : `pada jadwal: ${selectedSchedule}`;

        setToastMessage(`Sesi untuk ${name} berhasil disetujui ${detailInfo}!`);
        setActiveModalApp(null);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const handleRescheduleClick = (id: string, name: string, currentTimeSlot: string) => {
        setActiveRescheduleApp({ id, name });
        setRescheduleDate("");

        // Parse default times from timeslot if possible (e.g. "13.00 - 14.00 WIB" -> start "13:00", end "14:00")
        const times = currentTimeSlot.replace(/\./g, ":").match(/(\d{2}:\d{2})/g);
        if (times && times.length >= 2) {
            setRescheduleStartTime(times[0]);
            setRescheduleEndTime(times[1]);
        } else {
            setRescheduleStartTime("13:00");
            setRescheduleEndTime("14:00");
        }
    };

    const handleConfirmReschedule = () => {
        if (!activeRescheduleApp) return;
        const { id, name } = activeRescheduleApp;

        const formattedDate = new Date(rescheduleDate).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        const newTimeSlot = `${rescheduleStartTime.replace(/:/g, ".")} - ${rescheduleEndTime.replace(/:/g, ".")} WIB (${formattedDate})`;

        setAppointments((prev) =>
            prev.map((app) =>
                app.id === id
                    ? { ...app, status: "rescheduled", timeSlot: newTimeSlot }
                    : app
            )
        );

        setToastMessage(`Reschedule untuk ${name} berhasil diajukan ke tanggal ${formattedDate} jam ${rescheduleStartTime} - ${rescheduleEndTime}!`);
        setActiveRescheduleApp(null);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const isAcceptFormValid =
        profession === "klinis"
            ? meetLink.trim().startsWith("http") || meetLink.trim().length > 5
            : selectedSchedule !== "";

    const isRescheduleFormValid = rescheduleDate !== "" && rescheduleStartTime !== "" && rescheduleEndTime !== "";

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border pb-8 relative">
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

            {/* Success Toast */}
            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#2e7d32] text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fadeIn w-80">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Dash Border Header: "Practice Schedule" */}
            <div className="mt-6 w-full border-2 border-dashed border-[#2e7d32] bg-[#2e7d32]/5 rounded-3xl py-6 px-4 text-center">
                <h1 className="text-xl font-extrabold text-[#2e7d32] tracking-wide">
                    Practice Schedule
                </h1>
            </div>

            {/* Appointment Request Cards list */}
            <div className="mt-8 flex flex-col gap-5">
                {appointments.map((app) => (
                    <div
                        key={app.id}
                        className={`bg-gray-100 rounded-3xl p-4 border border-gray-200/50 flex flex-col gap-3 transition-all duration-300 ${
                            app.status === "accepted" ? "opacity-60 grayscale scale-95" : ""
                        }`}
                    >
                        {/* Upper row: Mascot + Text details */}
                        <div className="flex gap-4 items-center">
                            {/* Mascot doctor illustration */}
                            <div className="w-24 h-24 relative shrink-0 bg-white/50 rounded-2xl p-1 border border-gray-200/20 overflow-hidden">
                                <Image
                                    src="/assets/psikolog/billy_lari.png"
                                    alt="Doctor Mascot"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Session details */}
                            <div className="flex flex-col gap-1.5 flex-1">
                                <h3 className="font-bold text-gray-900 text-base leading-tight">
                                    {app.patientName}
                                </h3>
                                <span className="w-fit px-3 py-0.5 bg-[#2e7d32] text-white text-[9px] font-extrabold rounded-full">
                                    {app.duration}
                                </span>
                                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                                    {app.timeSlot}
                                </p>
                            </div>
                        </div>

                        {/* Lower row: Reschedule & Accept buttons */}
                        <div className="flex gap-2.5 items-center justify-end border-t border-gray-200/50 pt-3">
                            {app.status === "accepted" ? (
                                <span className="text-xs font-bold text-[#2e7d32] bg-[#2e7d32]/10 py-1.5 px-4 rounded-xl">
                                    Sesi Disetujui
                                </span>
                            ) : app.status === "rescheduled" ? (
                                <span className="text-xs font-bold text-[#054b37] bg-[#054b37]/10 py-1.5 px-4 rounded-xl">
                                    Jadwal Diubah
                                </span>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleRescheduleClick(app.id, app.patientName, app.timeSlot)}
                                        className="bg-[#054b37] hover:bg-[#033023] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-sm"
                                    >
                                        Re Schedule
                                    </button>
                                    <button
                                        onClick={() => handleAcceptClick(app.id, app.patientName)}
                                        className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer shadow-sm"
                                    >
                                        Accept
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Accept Confirmation Modal Popup */}
            {activeModalApp && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                Konfirmasi Sesi
                            </h3>
                            <button
                                onClick={() => setActiveModalApp(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="h-px bg-gray-100 w-full" />

                        {/* Modal Content depending on Profession */}
                        {profession === "klinis" ? (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block px-1">
                                    Input Link Google Meet
                                </label>
                                <div className="relative flex items-center">
                                    <Video size={16} className="absolute left-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="https://meet.google.com/..."
                                        value={meetLink}
                                        onChange={(e) => setMeetLink(e.target.value)}
                                        className="w-full rounded-2xl border-2 border-transparent bg-gray-100 pl-10 pr-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 px-1 mt-1 leading-relaxed">
                                    Link Google Meet ini akan otomatis dikirimkan ke pasien untuk sesi video call online.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block px-1">
                                    Pilih Jadwal Pertemuan
                                </label>
                                <div className="relative flex items-center">
                                    <Calendar size={16} className="absolute left-4 text-gray-400" />
                                    <select
                                        value={selectedSchedule}
                                        onChange={(e) => setSelectedSchedule(e.target.value)}
                                        className="w-full rounded-2xl border-2 border-transparent bg-gray-100 pl-10 pr-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors appearance-none cursor-pointer text-gray-800"
                                    >
                                        <option value="">Pilih jadwal...</option>
                                        <option value="Jumat, 17 Juli 2026 (13.00 - 14.00 WIB)">
                                            Jumat, 17 Juli (13.00 WIB)
                                        </option>
                                        <option value="Jumat, 17 Juli 2026 (14.30 - 15.30 WIB)">
                                            Jumat, 17 Juli (14.30 WIB)
                                        </option>
                                        <option value="Sabtu, 18 Juli 2026 (10.00 - 11.00 WIB)">
                                            Sabtu, 18 Juli (10.00 WIB)
                                        </option>
                                    </select>
                                </div>
                                <p className="text-[10px] text-gray-400 px-1 mt-1 leading-relaxed">
                                    Pilih slot waktu praktik offline Anda untuk mengonfirmasi janji temu dengan pasien.
                                </p>
                            </div>
                        )}

                        {/* Modal Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setActiveModalApp(null)}
                                className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 font-bold text-sm py-3 rounded-2xl transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmAccept}
                                disabled={!isAcceptFormValid}
                                className="flex-1 bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-sm py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#2e7d32]/10"
                            >
                                Setujui
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Popout Calendar Modal */}
            {activeRescheduleApp && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200 my-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                    Reschedule Sesi
                                </h3>
                                <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                                    Pasien: {activeRescheduleApp.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveRescheduleApp(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="h-px bg-gray-100 w-full" />

                        {/* Reusable Calendar Component */}
                        <ScheduleCalendar
                            selectedDays={rescheduleDate ? [rescheduleDate] : []}
                            onSelectDay={(dateStr) => setRescheduleDate(dateStr)}
                            className="border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden"
                        />

                        {/* Selected Date & Time Inputs */}
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                                    Tanggal Terpilih
                                </label>
                                <input
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    className="w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors text-gray-800"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                                    Pilih Jam Sesi Baru
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="text-[9px] font-semibold text-gray-400">
                                        Mulai
                                        <input
                                            type="time"
                                            value={rescheduleStartTime}
                                            onChange={(e) => setRescheduleStartTime(e.target.value)}
                                            className="mt-1 w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors text-gray-800"
                                        />
                                    </label>
                                    <label className="text-[9px] font-semibold text-gray-400">
                                        Selesai
                                        <input
                                            type="time"
                                            value={rescheduleEndTime}
                                            onChange={(e) => setRescheduleEndTime(e.target.value)}
                                            className="mt-1 w-full rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors text-gray-800"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setActiveRescheduleApp(null)}
                                className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 font-bold text-sm py-3 rounded-2xl transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmReschedule}
                                disabled={!isRescheduleFormValid}
                                className="flex-1 bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-sm py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#2e7d32]/10"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
