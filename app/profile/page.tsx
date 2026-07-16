"use client";

import Image from "next/image";
import { BookOpen, ChevronRight, CircleDot, Home, TrendingUp, UsersRound, Clock, Target } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";

const navItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Stats", href: "/stats", icon: TrendingUp },
  { label: "Help", href: "/help", icon: UsersRound },
  { label: "Learn", href: "/education", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: CircleDot },
];

const manageItems = [
  {
    icon: Target,
    title: "Reset Your Goals",
    description: "Adjust your recovery target",
    mascot: "/assets/set-target.png",
    href: "/onboarding/set-target",
  },
  {
    icon: BookOpen,
    title: "Rewrite Manifesto",
    description: "Update your victory letter",
    mascot: "/assets/set-victory-letter.png",
    href: "/onboarding/set-target",
  },
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto pb-10 border">
      {/* ── Page title ────────────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Settings</h1>
        <p className="text-[13px] text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* ── Profile card ──────────────────────────────────────────────────── */}
      <div className="px-4 mt-5">
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {/* Green top */}
          <div className="bg-[#1a5c3a] px-5 pt-5 pb-6 flex items-center justify-between">
            <div>
              <p className="text-green-300 text-[12px] font-semibold mb-1">Your Profile</p>
              <h2 className="text-white text-[22px] font-bold leading-tight">nanangggg</h2>
              <p className="text-green-300 text-[12px] mt-1">nanangggg@gmail.com</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-md">
              <Image
                src="/assets/friendlyBilly.png"
                alt="Avatar"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* White bottom — Alasan Pemulihan */}
          <div className="bg-white px-5 py-4">
            <p className="text-[11px] text-gray-400 font-semibold mb-1">Reason for Recovery</p>
            <p className="text-[14px] font-bold text-gray-900 leading-snug">
              I want more motivation to pursue my dreams.
            </p>
          </div>
        </div>
      </div>

      {/* ── Manage ────────────────────────────────────────────────────────── */}
      <div className="px-4 mt-7">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage</h2>
        <div className="space-y-3">
          {manageItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                className="w-full flex items-center gap-3 bg-[#e8f5ee] rounded-2xl px-4 py-4 text-left active:scale-[0.98] transition-all duration-150 relative overflow-hidden"
              >
                {/* Icon */}
                <div className="w-9 h-9 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Icon size={18} className="text-[#1a5c3a]" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900 leading-tight">{item.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.description}</p>
                </div>

                {/* Mascot */}
                <div className="w-12 h-12 shrink-0">
                  <Image
                    src={item.mascot}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNavbar items={navItems} />
    </div>
  );
}
