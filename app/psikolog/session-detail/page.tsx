"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Video, User, CheckCircle } from "lucide-react";
import Button from "@/components/Button";

export default function SessionDetailPage() {
    const router = useRouter();

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

            {/* Page Heading */}
            <h1 className="mt-4 text-[2rem] font-extrabold text-gray-900 leading-tight">
                Detail Sesi Konseling
            </h1>

            {/* Patient Header Box */}
            <section className="mt-6 flex items-center gap-4 rounded-2xl bg-gray-100 px-5 py-5 border border-gray-200/50">
                <div className="h-16 w-16 shrink-0 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-inner">
                    <User size={32} className="text-gray-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Nama Pasien</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">24 Tahun, Laki-laki</p>
                </div>
            </section>

            {/* Session Parameters */}
            <section className="mt-6 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                    Informasi Konseling
                </h3>
                <div className="bg-white border border-gray-200/80 rounded-2xl divide-y divide-gray-100 shadow-sm">
                    {/* Date */}
                    <div className="flex items-center gap-3.5 p-4">
                        <div className="w-9 h-9 rounded-xl bg-[#2e7d32]/10 flex items-center justify-center shrink-0 text-[#2e7d32]">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Tanggal</span>
                            <span className="text-sm font-semibold text-gray-800">Jumat, 17 Juli 2026</span>
                        </div>
                    </div>

                    {/* Time & Duration */}
                    <div className="flex items-center gap-3.5 p-4">
                        <div className="w-9 h-9 rounded-xl bg-[#2e7d32]/10 flex items-center justify-center shrink-0 text-[#2e7d32]">
                            <Clock size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Waktu & Durasi</span>
                            <span className="text-sm font-semibold text-gray-800">13.00 - 14.00 WIB (1 Jam)</span>
                        </div>
                    </div>

                    {/* Method */}
                    <div className="flex items-center gap-3.5 p-4">
                        <div className="w-9 h-9 rounded-xl bg-[#2e7d32]/10 flex items-center justify-center shrink-0 text-[#2e7d32]">
                            <Video size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Metode Konseling</span>
                            <span className="text-sm font-semibold text-gray-800">Video Call (Online)</span>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-3.5 p-4">
                        <div className="w-9 h-9 rounded-xl bg-[#2e7d32]/10 flex items-center justify-center shrink-0 text-[#2e7d32]">
                            <CheckCircle size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Status Pembayaran</span>
                            <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                                Lunas
                                <span className="inline-block w-2 h-2 bg-[#2e7d32] rounded-full" />
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Complaint Section */}
            <section className="mt-6 space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                    Keluhan Utama
                </h3>
                <div className="bg-gray-50 border border-gray-200/50 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed font-normal shadow-inner">
                    Saya sering merasa cemas berlebihan dan mengalami sesak napas secara tiba-tiba tanpa pemicu yang jelas, terutama saat berada di tempat ramai atau ketika menghadapi tekanan pekerjaan yang menumpuk.
                </div>
            </section>

            {/* Start Counseling Actions */}
            <div className="mt-auto pt-8">
                <Button type="button" className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-lg rounded-2xl py-4 transition-colors shadow-sm">
                    Mulai Konseling
                </Button>
                <button
                    onClick={() => router.push("/psikolog/home")}
                    className="w-full bg-white border-2 border-[#2e7d32] text-[#2e7d32] hover:bg-gray-50 active:bg-gray-100 font-bold text-lg rounded-2xl py-3.5 transition-colors text-center mt-3 cursor-pointer"
                >
                    Kembali Ke Home
                </button>
            </div>
        </main>
    );
}
