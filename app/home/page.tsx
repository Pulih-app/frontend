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
      <section className="relative mt-6 overflow-hidden rounded-[30px] bg-[#0b744f] px-8 pb-[104px] pt-7 text-white shadow-[0_12px_24px_rgba(0,0,0,0.16)]">
        <div className="relative z-10 max-w-[220px]">
          <p className="text-[18px] font-black">Your Streak</p>
          <h2 className="mt-2 text-[44px] font-black leading-none tracking-[-0.03em]">23 Days</h2>
          <p className="mt-4 text-xs font-semibold leading-relaxed text-white/95">After completing the Daily Check-in, your streak will update at midnight</p>
        </div>

        {/* Mountain illustration */}
        <div className="absolute bottom-[60px] right-[-28px] h-[200px] w-[255px] opacity-95">
          <Image
            src="/assets/gunung.png"
            alt="Gunung streak"
            fill
            className="object-contain object-bottom"
            priority
            sizes="255px"
          />
        </div>

        {/* White bottom Progress bar container */}
        <div className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-white px-8 pb-6 pt-5 text-[#818b92] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          <p className="text-sm font-black">Progress: 11 / 32 Days</p>
          <div className="mt-3.5 h-[16px] overflow-hidden rounded-full bg-[#e6e6e6]">
            <div className="h-full w-[34%] rounded-full bg-[#35b863]" />
          </div>
        </div>
      </section>

      {/* Daily Routine */}
      <section className="mt-6">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-gray-900">Daily Routine</h2>

        <Link href="/onboarding/daily-checkin" className="mt-4 flex items-center rounded-2xl bg-[#effbf4] px-5 py-3.5 active:scale-[0.99] border border-[#d2f3df]/30 transition-transform">
          <div className="mr-4 w-12 h-12 relative shrink-0">
            <Image src="/assets/billy_checkin.png" alt="Billy Checkin" fill className="object-contain" />
          </div>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black leading-tight text-gray-900">Daily Check-In scheduled at 6 PM</span>
            <span className="mt-1 block text-[11px] font-semibold text-[#8b8b8b]">Click to Check-In earlier</span>
          </span>
          <ChevronRight size={20} strokeWidth={2.5} className="text-gray-400 shrink-0" />
        </Link>

        <Link href="/onboarding/set-target" className="mt-4 flex items-center rounded-2xl bg-[#effbf4] px-5 py-3.5 active:scale-[0.99] border border-[#d2f3df]/30 text-gray-900 transition-transform">
          <div className="mr-4 w-12 h-12 relative shrink-0">
            <Image src="/assets/billy_relapse.png" alt="Billy Relapse" fill className="object-contain" />
          </div>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black leading-tight text-gray-900">Relapse</span>
            <span className="mt-1 block text-[11px] font-semibold text-[#8b8b8b]">Acknowledge, evaluate, and reset your progress.</span>
          </span>
          <ChevronRight size={20} strokeWidth={2.5} className="text-gray-400 shrink-0" />
        </Link>

        <button className="mt-4 flex w-full items-center rounded-2xl bg-[#effbf4] border border-[#d2f3df]/30 px-5 py-3.5 text-left active:scale-[0.99] transition-transform cursor-pointer">
          <div className="mr-4 w-12 h-12 relative shrink-0">
            <Image src="/assets/billy_panik.png" alt="Billy Panik" fill className="object-contain" />
          </div>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black leading-tight text-gray-900">Emergency Button</span>
            <span className="mt-1 block text-[11px] font-semibold leading-snug text-[#8b8b8b]">Get instant help when you feel tempted</span>
          </span>
          <ChevronRight size={20} strokeWidth={2.5} className="text-gray-400 shrink-0 ml-1" />
        </button>
      </section>

      {/* Today Insight */}
      <section className="mt-6">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-gray-900">Today Insight</h2>
        <div className="mt-4 rounded-2xl bg-gray-50 border border-gray-200/50 px-5 py-5">
          <p className="text-xs font-semibold leading-relaxed text-gray-700 italic">“You did your best today. Satisfying results come from small actions done consistently.”</p>
          <p className="mt-4 text-[9px] font-semibold text-[#8b8b8b] leading-tight">This insight is customized based on your daily journal and daily check-in activity.</p>
        </div>
      </section>

      {/* Proportional Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 border-x bg-white px-10 pb-7 pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <Link href="/home" className="text-[#2e7d32] hover:opacity-80 transition-opacity" aria-label="Home">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3c-.5 0-1 .2-1.4.6L4.3 9.4c-.8.8-1.3 2-1.3 3.1v6c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4v-6c0-1.1-.5-2.3-1.3-3.1l-6.3-5.8c-.4-.4-.9-.6-1.4-.6z" fill="#2e7d32"/>
              <path d="M9.5 15.5c1 1.2 4 1.2 5 0" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link href="/onboarding/analysis-result" className="text-black hover:opacity-75 transition-opacity" aria-label="Progress">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 5v12a3 3 0 0 0 3 3h12" />
              <path d="M9 13.5l3.5-4 4 3.5 3.5-5.5" />
            </svg>
          </Link>
          <Link href="/psikolog/home" className="text-black hover:opacity-75 transition-opacity" aria-label="Community">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="8.2" r="3.2" />
              <ellipse cx="12" cy="16.5" rx="5.2" ry="2.8" />
              <path d="M6.8 6.5A2.8 2.8 0 0 0 6.8 11" />
              <path d="M6.2 14.5A4.5 4.5 0 0 0 3.5 17" />
              <path d="M17.2 6.5A2.8 2.8 0 0 1 17.2 11" />
              <path d="M17.8 14.5A4.5 4.5 0 0 1 20.5 17" />
            </svg>
          </Link>
          <Link href="/onboarding/learning-1" className="text-black hover:opacity-75 transition-opacity" aria-label="Learning">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19.5c-1.5-1-4-1.5-6-1.5H3V4.5h3c2 0 4.5.5 6 1.5M12 19.5c1.5-1 4-1.5 6-1.5h3V4.5h-3c-2 0-4.5.5-6 1.5M12 6v13.5" />
            </svg>
          </Link>
          <Link href="/profile" className="text-black hover:opacity-75 transition-opacity" aria-label="Profile">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" />
              <circle cx="12" cy="11.25" r="2.5" />
            </svg>
          </Link>
        </div>
      </nav>
    </main>
  );
}
