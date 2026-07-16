"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, BookOpen, ChevronRight, CircleDot, Home, TrendingUp, UsersRound } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";

const navItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Progress", href: "/onboarding/analysis-result", icon: TrendingUp },
  { label: "Community", href: "/psikolog/home", icon: UsersRound },
  { label: "Learning", href: "/onboarding/learning-1", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: CircleDot },
];

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

        <Link href="/onboarding/daily-checkin" className="relative mt-4 block rounded-[24px] bg-[#effbf4] border border-[#d2f3df]/30 px-6 py-5 overflow-hidden active:scale-[0.99] transition-transform">
          <div className="pr-[84px]">
            <span className="block text-[15px] font-extrabold leading-tight text-gray-900">Daily Check-In scheduled at 6 PM</span>
            <span className="mt-2 block text-xs font-semibold text-[#8b8b8b]">Click to Check-In earlier</span>
          </div>
          <div className="absolute right-0 bottom-0 w-[94px] h-[76px]">
            <Image src="/assets/billy_checkin.png" alt="Billy Checkin" fill className="object-contain object-bottom" />
          </div>
        </Link>

        <Link href="/onboarding/set-target" className="relative mt-4 block rounded-[24px] bg-[#effbf4] border border-[#d2f3df]/30 px-6 py-5 overflow-hidden active:scale-[0.99] transition-transform text-gray-900">
          <div className="pr-[84px]">
            <span className="block text-[15px] font-extrabold leading-tight">Relapse</span>
            <span className="mt-2 block text-xs font-semibold text-[#8b8b8b]">Acknowledge, evaluate, and reset your progress.</span>
          </div>
          <div className="absolute right-0 bottom-0 w-[94px] h-[76px]">
            <Image src="/assets/billy_relapse.png" alt="Billy Relapse" fill className="object-contain object-bottom" />
          </div>
        </Link>

        <button className="relative mt-4 block w-full text-left rounded-[24px] bg-[#effbf4] border border-[#d2f3df]/30 px-6 py-5 overflow-hidden active:scale-[0.99] transition-transform cursor-pointer">
          <div className="pr-[84px]">
            <span className="block text-[15px] font-extrabold leading-tight text-gray-900">Emergency Button</span>
            <span className="mt-2 block text-xs font-semibold leading-snug text-[#8b8b8b]">Get instant help when you feel tempted</span>
          </div>
          <div className="absolute right-0 bottom-0 w-[94px] h-[76px]">
            <Image src="/assets/billy_panik.png" alt="Billy Panik" fill className="object-contain object-bottom" />
          </div>
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

      <BottomNavbar items={navItems} />
    </main>
  );
}
