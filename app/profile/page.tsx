"use client";

import Image from "next/image";
import { BookOpen, ChevronRight, User, Home, ChartColumn, UsersRound, Clock, Target, LogOut } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";

const navItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Stats", href: "/stats", icon: ChartColumn },
  { label: "Help", href: "/help", icon: UsersRound },
  { label: "Learn", href: "/education", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: User },
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
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto pb-10">
      {/* ── Profile card ──────────────────────────────────────────────────── */}
      <div className="px-4 pt-6">
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {/* Green top */}
          <div className="bg-[#1a5c3a] px-5 pt-5 pb-6 flex flex-col items-center justify-center">

            <div className="w-32 h-32 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-md">
              <Image
                src="/assets/profile.png"
                alt="Avatar"
                width={120}
                height={120}
                className="object-cover w-full h-full"
              />
            </div>

            <div>
              <p className="text-green-300 text-[12px] text-center font-semibold mt-4">Your Profile</p>
              <h2 className="text-white text-[22px] text-center  font-bold leading-tight">nanangggg</h2>
              <p className="text-green-300 text-[12px] text-center mt-1">nanangggg@gmail.com</p>
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

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900 leading-tight">{item.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.description}</p>
                </div>

                {/* Mascot */}
                <div className="w-12 h-12 shrink-0 ">
                  <Image
                    src={item.mascot}
                    alt={item.title}
                    width={48}
                    height={48}
                    priority
                    className="object-contain w-full h-full absolute top-0 -right-32"
                  />
                </div>
              </button>
            );
          })}
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-2xl px-4 py-4 mt-4 active:scale-[0.98] transition-all duration-150 font-bold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
      <BottomNavbar items={navItems} />
    </div>
  );
}
