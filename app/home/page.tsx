"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight, User, Home, ChartColumn, Heart } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";

const navItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Stats", href: "/stats", icon: ChartColumn },
  { label: "Support", href: "/help", icon: Heart },
  { label: "Learn", href: "/education", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: User },
];

export default function UserHomePage() {
  const [currentStreak, setCurrentStreak] = useState<number | null>(null);
  const [pornFreeGoal, setPornFreeGoal] = useState<number | null>(null);
  // loading starts true so the initial fetch shows a skeleton without a
  // synchronous setState call inside the effect body (Next.js 16 disallows that).
  const [loading, setLoading] = useState(true);

  const runFetch = (isRetry = false) => {
    if (isRetry) {
      setLoading(true);
    }

    const token =
      localStorage.getItem("auth_token") ??
      process.env.NEXT_PUBLIC_API_TOKEN ??
      "";
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

    fetch(`${base}/api/v1/routine/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Statistics API returned ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          setCurrentStreak(json.data.current_streak ?? 0);
          setPornFreeGoal(json.data.streak_goal_comparison?.porn_free_goal ?? 90);
        }
      })
      .catch(() => {
        // Silently fall back to null — skeleton will remain hidden
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // No synchronous setState here — loading is already true from useState(true).
    runFetch();
  }, []);

  const streak = currentStreak ?? 0;
  const goal = pornFreeGoal ?? 90;
  const progressPct = goal > 0 ? Math.min(100, Math.round((streak / goal) * 100)) : 0;

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col overflow-hidden bg-white px-6 pb-24">
      <section className="mt-6">
        <h1 className="text-2xl font-black leading-none tracking-[-0.03em] text-gray-900">Hello! <span className="text-xl">👋</span></h1>
        <p className="mt-2 text-[13px] font-semibold leading-tight text-[#7f8b92]">Proud of you for showing up today</p>
      </section>

      {/* Streak Card */}
      <section className="relative mt-6 overflow-hidden rounded-[16px] bg-[#0b744f] px-6 pb-[104px] pt-7 text-white shadow-[0_12px_24px_rgba(0,0,0,0.16)]">
        <div className="relative z-10 max-w-[220px]">
          <p className="text-[18px] font-black">Your Streak</p>
          {loading ? (
            <div className="mt-2 h-[52px] w-36 animate-pulse rounded-lg bg-white/20" />
          ) : (
            <h2 className="mt-2 text-[44px] font-bold leading-none tracking-[-0.03em]">
              {streak} {streak === 1 ? "Day" : "Days"}
            </h2>
          )}
          <p className="mt-4 text-xs leading-relaxed text-white/95">After completing the Daily Check-in, your streak will update at midnight</p>
        </div>

        {/* Mountain illustration */}
        <div className="absolute bottom-[60px] right-[-28px] h-[200px] w-[255px] opacity-95">
          <Image
            src="/assets/gunung.png"
            alt="Streak mountain"
            fill
            className="object-contain object-bottom"
            priority
            sizes="255px"
          />
        </div>

        {/* White bottom Progress bar container */}
        <div className="absolute bottom-0 left-0 right-0 rounded-t-[16px] bg-white px-8 pb-6 pt-5 text-[#818b92] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          {loading ? (
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          ) : (
            <p className="text-sm font-black">Progress: {streak} / {goal} Days</p>
          )}
          <div className="mt-3.5 h-[16px] overflow-hidden rounded-full bg-[#e6e6e6]">
            {loading ? (
              <div className="h-full w-0 rounded-full bg-[#35b863]" />
            ) : (
              <div
                className="h-full rounded-full bg-[#35b863] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Daily Routine */}
      <section className="mt-6">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-gray-900">Daily Routine</h2>

        <Link href="/daily-checkin" className="mt-4 flex items-center relative overflow-hidden rounded-2xl bg-[#effbf4] px-5 py-3.5 active:scale-[0.99] border border-[#d2f3df]/30 transition-transform">
          <div className="w-8 h-8 shrink-0  mr-3">
            <Image src="/assets/billy_checkin.png" width={500} height={500} alt="Billy Checkin" className="object-contain absolute -left-5 -bottom-4 w-20 h-20" />
          </div>

          <span className="min-w-0 flex-1 ">
            <span className="block text-[15px] font-extrabold leading-tight text-gray-900">Daily Check-In</span>
            <span className="mt-2 block text-xs font-semibold text-[#8b8b8b]">Click to Check-In </span>
          </span>
          <ChevronRight size={20} strokeWidth={2.5} className="text-gray-400 shrink-0 ml-1" />
        </Link>

        <Link href="/relapse" className="mt-4 flex items-center relative overflow-hidden  rounded-2xl bg-[#effbf4] px-5 py-3.5 active:scale-[0.99] border border-[#d2f3df]/30 text-gray-900 transition-transform">
          <div className="w-8 h-8 shrink-0 mr-2">
            <Image src="/assets/billy_relapse.png" alt="Billy Relapse" width={500} height={500} className="object-contain absolute -left-36 -bottom-4 w-full h-full" />
          </div>
          <span className="min-w-0 flex-1 ">
            <span className="block text-[15px] font-extrabold leading-tight">Relapse</span>
            <span className="mt-2 block text-xs font-semibold text-[#8b8b8b]">Acknowledge, evaluate, and reset your progress.</span>
          </span>
          <ChevronRight size={20} strokeWidth={2.5} className="text-gray-400 shrink-0 ml-1" />
        </Link>

        <Link href="/emergency" className="mt-4 flex items-center relative overflow-hidden rounded-2xl bg-[#effbf4] border border-[#d2f3df]/30 px-5 py-3.5 text-left active:scale-[0.99] transition-transform text-gray-900">
          <div className="w-8 h-8 shrink-0 mr-3">
            <Image src="/assets/billy_panik.png" alt="Billy Panik" width={500} height={500} className="object-contain absolute -left-4 -bottom-4 w-20 h-20" />
          </div>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black leading-tight text-gray-900">Emergency Button</span>
            <span className="mt-1 block text-[11px] font-semibold leading-snug text-[#8b8b8b]">Get instant help when you feel tempted</span>
          </span>
          <ChevronRight size={20} strokeWidth={2.5} className="text-gray-400 shrink-0 ml-1" />
        </Link>
      </section>

      {/* Today Insight */}
      <section className="mt-6">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-gray-900">Today Insight</h2>
        <div className="mt-4 rounded-2xl bg-gray-50 border border-gray-200/50 px-5 py-5">
          <p className="text-xs font-semibold leading-relaxed text-gray-700 italic">&ldquo;You did your best today. Satisfying results come from small actions done consistently.&rdquo;</p>
          <p className="mt-4 text-[9px] font-semibold text-[#8b8b8b] leading-tight">This insight is customized based on your daily journal and daily check-in activity.</p>
        </div>
      </section>

      <BottomNavbar items={navItems} />
    </main>
  );
}
