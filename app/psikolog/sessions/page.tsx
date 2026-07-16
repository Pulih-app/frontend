"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

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

    const handleAccept = (id: string, name: string) => {
        setAppointments((prev) =>
            prev.map((app) => (app.id === id ? { ...app, status: "accepted" } : app))
        );
        setToastMessage(`Sesi untuk ${name} berhasil disetujui!`);
        setTimeout(() => setToastMessage(null), 2000);
    };

    const handleReschedule = (id: string) => {
        // Redirect to reschedule page
        router.push("/psikolog/practice-schedule");
    };

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border pb-8">
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
                                    src="/assets/psikolog/mascot-doctor.png"
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
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleReschedule(app.id)}
                                        className="bg-[#054b37] hover:bg-[#033023] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-sm"
                                    >
                                        Re Schedule
                                    </button>
                                    <button
                                        onClick={() => handleAccept(app.id, app.patientName)}
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
        </main>
    );
}
