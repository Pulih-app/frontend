"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface MoodOption {
    label: string;
    emoji: string;
    value: number;
}

export default function DailyCheckinPage() {
    const router = useRouter();
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [journalText, setJournalText] = useState("");
    const [dateString, setDateString] = useState("");
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Set today's date in Indonesian format (client-side only to match SSR)
    useEffect(() => {
        const today = new Date();
        const formatted = today.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        setDateString(formatted);
    }, []);

    const moods: MoodOption[] = [
        { label: "Sangat Buruk", emoji: "😢", value: 1 },
        { label: "Buruk", emoji: "😟", value: 2 },
        { label: "Biasa", emoji: "😐", value: 3 },
        { label: "Baik", emoji: "😊", value: 4 },
        { label: "Sangat Baik", emoji: "🤩", value: 5 },
    ];

    const handleSubmit = () => {
        setShowSuccessToast(true);
        setTimeout(() => {
            setShowSuccessToast(false);
            router.push("/home");
        }, 1500);
    };

    return (
        <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col overflow-hidden border-x bg-white px-6 pb-28 pt-6 text-black">
            {/* Header */}
            <header className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                    aria-label="Kembali"
                >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <span className="text-[14px] font-bold text-gray-400">
                    {dateString || "Selasa, 16 Juni 2026"}
                </span>
                <div className="w-10" /> {/* Spacer */}
            </header>

            {/* Streak Card */}
            <section className="relative mt-6 overflow-hidden rounded-[30px] bg-[#0b744f] px-6 py-7 text-white shadow-[0_12px_24px_rgba(11,116,79,0.15)] flex flex-col items-center justify-center">
                <span className="text-xs font-bold tracking-wider uppercase opacity-90">
                    Daily Check-In
                </span>
                <h2 className="mt-1 text-[72px] font-black leading-none tracking-tight">
                    0
                </h2>
                <span className="mt-1 text-sm font-extrabold tracking-wide">
                    Hari Tanpa Pornografi
                </span>

                {/* Commit box */}
                <div className="mt-6 w-full rounded-2xl bg-[#095f40] px-4 py-3.5 border border-[#0c7f56]/30">
                    <p className="text-[11px] font-medium leading-relaxed text-center italic text-white/90">
                        &ldquo;Saya akan berkomitmen untuk bebas dari pornografi, dan saya bersungguh-sungguh.&rdquo;
                    </p>
                </div>
            </section>

            {/* Mood Selector Section */}
            <section className="mt-8">
                <h2 className="text-[18px] font-black tracking-tight text-gray-900">
                    Bagaimana Mood Kamu?
                </h2>
                <p className="text-xs font-semibold text-gray-400 mt-1 leading-snug">
                    Pilih yang paling menggambarkan perasaanmu saat ini
                </p>

                <div className="mt-4 rounded-[24px] bg-[#effbf4] border border-[#d2f3df]/30 px-3.5 py-5">
                    <div className="flex justify-between items-center">
                        {moods.map((mood) => {
                            const isSelected = selectedMood === mood.value;
                            return (
                                <button
                                    key={mood.value}
                                    onClick={() => setSelectedMood(mood.value)}
                                    className={`flex flex-col items-center gap-1.5 flex-1 transition-all duration-200 cursor-pointer ${
                                        isSelected ? "scale-110" : "opacity-80 hover:opacity-100"
                                    }`}
                                >
                                    <span className="text-3xl filter drop-shadow-sm select-none">
                                        {mood.emoji}
                                    </span>
                                    <span
                                        className={`text-[9px] font-extrabold tracking-tight transition-colors text-center whitespace-nowrap ${
                                            isSelected ? "text-[#2e7d32]" : "text-gray-400"
                                        }`}
                                    >
                                        {mood.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Daily Journal Section */}
            <section className="mt-8 mb-6">
                <h2 className="text-[18px] font-black tracking-tight text-gray-900">
                    Jurnal Harian
                </h2>
                <p className="text-xs font-semibold text-gray-400 mt-1 leading-snug">
                    Ceritakan apa yang kamu rasakan hari ini
                </p>

                <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Tuliskan perasaan, perjuangan, atau pencapaian hari ini..."
                    className="w-full min-h-[120px] rounded-[24px] border-2 border-transparent bg-gray-100 p-5 text-sm font-semibold outline-none focus:border-[#2e7d32] focus:bg-white transition-colors text-gray-800 placeholder-gray-400 mt-4 resize-none leading-relaxed"
                />
            </section>

            {/* Success Toast Overlay */}
            {showSuccessToast && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[280px] shadow-2xl border border-gray-100 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200">
                        <CheckCircle2 size={44} className="text-[#0b744f] animate-bounce" />
                        <h3 className="text-base font-bold text-gray-900 text-center">
                            Check-In Berhasil!
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 text-center leading-relaxed">
                            Kemajuan Anda hari ini telah disimpan. Tetap berkomitmen!
                        </p>
                    </div>
                </div>
            )}

            {/* Fixed Footer Check-In Button */}
            <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm bg-white border-t border-gray-100 px-6 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.98] text-white font-extrabold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0b744f]/10 cursor-pointer"
                >
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                    <span>Check In Sekarang</span>
                </button>
            </footer>
        </main>
    );
}
