"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function SessionDetailPage() {
    const router = useRouter();

    return (
        <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border pb-8">
            {/* Top Navbar */}
            <header className="relative flex items-center justify-center py-4 border-b border-gray-100 -mx-6 px-6">
                <button
                    onClick={() => router.push("/psikolog/home")}
                    className="absolute left-6 text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Kembali"
                >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <h1 className="text-[17px] font-black text-gray-900 tracking-tight">
                    Detail Sesi Konseling
                </h1>
            </header>

            {/* Patient Header Card */}
            <section className="relative overflow-hidden mt-6 rounded-[28px] bg-[#f5f5f5] border border-gray-200/50 p-6 shadow-sm text-left">
                <div className="relative z-10 flex flex-col items-start">
                    <h2 className="text-[20px] font-black text-gray-900 leading-none">
                        Nama Pasien
                    </h2>
                    <span className="mt-2.5 inline-flex items-center rounded-full bg-[#0b744f] px-3.5 py-1 text-[10px] font-black tracking-wider uppercase text-white">
                        24 Tahun
                    </span>
                    <p className="mt-2.5 text-xs font-semibold text-gray-500">
                        Laki - Laki
                    </p>
                </div>
                {/* Green decorative quarter circle segment with gradient */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-[#35b863] to-[#2e7d32] rounded-tl-full pointer-events-none z-0" />
            </section>

            {/* Session Parameters */}
            <section className="mt-8">
                <div className="text-left">
                    <h3 className="text-lg font-black text-gray-900 leading-none">
                        Informasi Konseling
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                        Informasi jadwal dan metode pelaksanaan konseling
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-[#f5f5f5] rounded-[20px] p-4 border border-gray-200/30 text-left">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Tanggal</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">Jumat, 17 Juli 2026</span>
                    </div>
                    <div className="bg-[#f5f5f5] rounded-[20px] p-4 border border-gray-200/30 text-left">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Waktu & Durasi</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">13.00 - 14.00 WIB <span className="text-[10px] font-semibold text-gray-500 block mt-0.5">(1 Jam)</span></span>
                    </div>
                    <div className="bg-[#f5f5f5] rounded-[20px] p-4 border border-gray-200/30 text-left">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Metode Konseling</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">Video Call (Online)</span>
                    </div>
                    <div className="bg-[#f5f5f5] rounded-[20px] p-4 border border-gray-200/30 text-left">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Status Pembayaran</span>
                        <span className="text-sm font-black text-[#0b744f] mt-1 flex items-center gap-1.5">
                            Lunas
                            <span className="inline-block w-2 h-2 bg-[#2e7d32] rounded-full animate-pulse" />
                        </span>
                    </div>
                </div>
            </section>

            {/* Complaint Section */}
            <section className="mt-8">
                <div className="text-left">
                    <h3 className="text-lg font-black text-gray-900 leading-none">
                        Keluhan
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                        Pesan dan keluhan yang dirasakan pasien
                    </p>
                </div>
                <div className="bg-[#effbf4]/60 border border-[#d2f3df]/50 rounded-[24px] p-5 text-sm font-semibold text-gray-700 leading-relaxed mt-3 text-left">
                    Saya sering merasa cemas berlebihan dan mengalami sesak napas secara tiba-tiba tanpa pemicu yang jelas, terutama saat berada di tempat ramai atau ketika menghadapi tekanan pekerjaan yang menumpuk.
                </div>
            </section>

            {/* Start Counseling Actions */}
            <div className="mt-auto pt-8">
                <button 
                    type="button" 
                    className="w-full bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.98] text-white font-extrabold text-sm py-4 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-[#0b744f]/10 cursor-pointer"
                >
                    Mulai Konseling
                </button>
                <button
                    onClick={() => router.push("/psikolog/home")}
                    className="w-full bg-white border-2 border-[#0b744f] text-[#0b744f] hover:bg-gray-50 active:scale-[0.98] font-extrabold text-sm py-3.5 rounded-2xl transition-all text-center mt-3 cursor-pointer"
                >
                    Kembali Ke Home
                </button>
            </div>
        </main>
    );
}
