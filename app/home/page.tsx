"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, BookOpen, ChartNoAxesCombined, ChevronRight, CircleDot, Home, UsersRound } from "lucide-react";

export default function UserHomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col overflow-hidden border-x bg-white px-6 pb-24 pt-8 text-black">
      <header className="flex items-start justify-between">
        <Image src="/assets/logo.png" alt="Pulih" width={42} height={42} priority />
        <button aria-label="Notifikasi" className="mt-2 rounded-full p-2 text-black active:bg-gray-100 cursor-pointer">
          <Bell size={22} strokeWidth={2.4} />
        </button>
      </header>

      <section className="mt-6">
        <h1 className="text-2xl font-black leading-none tracking-[-0.03em] text-gray-900">Halo, Alex! <span className="text-xl">👋</span></h1>
        <p className="mt-2 text-[13px] font-semibold leading-tight text-[#7f8b92]">Proud of you for showing up today</p>
      </section>

      {/* Streak Card */}
      <section className="relative mt-6 overflow-hidden rounded-[30px] bg-[#0b744f] px-6 pb-[116px] pt-6 text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] border border-[#095f40]">
        <div className="relative z-10 max-w-[200px]">
          <p className="text-sm font-extrabold tracking-wide uppercase opacity-90">Streak Kamu</p>
          <h2 className="mt-1 text-[38px] font-black leading-none tracking-[-0.03em]">23 Hari</h2>
          <p className="mt-3 text-[10px] font-medium leading-normal text-white/90">Setelah Melakukan Daily Check-in streak kamu akan terupdate di tengah malam</p>
        </div>

        {/* Mountain illustration */}
        <div className="absolute bottom-[86px] right-[-20px] h-[160px] w-[210px] opacity-95">
          <Image
            src="/assets/gunung.png"
            alt="Gunung streak"
            fill
            className="object-contain object-bottom"
            priority
            sizes="210px"
          />
        </div>

        {/* White bottom Progress bar container */}
        <div className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-5 pt-4 text-[#818b92] shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-xs font-black">Progress: 11 / 32 Days</p>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-[#e8e8e8]">
            <div className="h-full w-[34%] rounded-full bg-[#35b863]" />
          </div>
        </div>
      </section>

      {/* Daily Routine */}
      <section className="mt-6">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-gray-900">Daily Routine</h2>

        <Link href="/onboarding/daily-checkin" className="mt-4 flex items-center rounded-2xl bg-[#effbf4] px-5 py-4 active:scale-[0.99] border border-[#d2f3df]/30 transition-transform">
          <span className="mr-4 text-2xl shrink-0">⏱️</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black leading-tight text-gray-900">Check-In Harian Diatur Saat 6pm</span>
            <span className="mt-1 block text-[11px] font-semibold text-[#8b8b8b]">Klik untuk Check-In lebih awal</span>
          </span>
          <ChevronRight size={20} strokeWidth={2.5} className="text-gray-400 shrink-0" />
        </Link>

        <Link href="/onboarding/set-target" className="mt-4 flex items-center rounded-2xl bg-[#ff8f94] px-5 py-4 active:scale-[0.99] text-white transition-transform">
          <span className="mr-4 text-2xl shrink-0">💪</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black leading-tight">Relapse</span>
            <span className="mt-1 block text-[11px] font-semibold text-white/90">Akui, evaluasi, dan reset progress kamu.</span>
          </span>
          <ChevronRight size={20} strokeWidth={2.5} className="text-white shrink-0" />
        </Link>

        <button className="mt-4 flex w-full items-center rounded-2xl bg-gray-50 border border-gray-200/50 px-5 py-4 text-left active:scale-[0.99] transition-transform cursor-pointer">
          <span className="mr-4 text-2xl shrink-0">🚨</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black leading-tight text-gray-900">Emergency Button</span>
            <span className="mt-1 block text-[11px] font-semibold leading-snug text-gray-500">Dapatkan Bantuan instan ketika dalam waktu feeling tempted</span>
          </span>
        </button>
      </section>

      {/* Today Insight */}
      <section className="mt-6">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-gray-900">Today Insight</h2>
        <div className="mt-4 rounded-2xl bg-gray-50 border border-gray-200/50 px-5 py-5">
          <p className="text-xs font-semibold leading-relaxed text-gray-700 italic">“Kamu sudah melakukan yang terbaik hari ini, hasil yang memuaskan datang dari hal kecil yang dilakukan secara konsisten.”</p>
          <p className="mt-4 text-[9px] font-semibold text-[#8b8b8b] leading-tight">Insight ini disesuaikan dari journal harian yang kamu tulis dan aktivitas daily check-in kamu</p>
        </div>
      </section>

      {/* Proportional Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 border-x bg-white px-10 pb-7 pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <Link href="/home" className="grid h-9 w-9 place-items-center rounded-xl bg-[#2e7d32] text-white shadow-sm shadow-[#2e7d32]/25" aria-label="Home">
            <Home size={18} fill="currentColor" strokeWidth={0} />
          </Link>
          <Link href="/onboarding/analysis-result" className="text-gray-400 hover:text-gray-900 active:text-gray-900 transition-colors" aria-label="Progress">
            <ChartNoAxesCombined size={24} strokeWidth={1.8} />
          </Link>
          <Link href="/psikolog/home" className="text-gray-400 hover:text-gray-900 active:text-gray-900 transition-colors" aria-label="Community">
            <UsersRound size={24} strokeWidth={1.8} />
          </Link>
          <Link href="/onboarding/learning-1" className="text-gray-400 hover:text-gray-900 active:text-gray-900 transition-colors" aria-label="Learning">
            <BookOpen size={24} strokeWidth={1.8} />
          </Link>
          <Link href="/profile" className="text-gray-400 hover:text-gray-900 active:text-gray-900 transition-colors" aria-label="Profile">
            <CircleDot size={24} strokeWidth={1.8} />
          </Link>
        </div>
      </nav>
    </main>
  );
}
