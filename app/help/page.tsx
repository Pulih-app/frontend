"use client";

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

interface HelpCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc?: string; // Menambahkan prop opsional untuk gambar
}

function HelpCard({ title, description, href, imageSrc }: HelpCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 bg-[#EFFBF4] rounded-2xl p-4 active:scale-[0.98] transition-all duration-150"
    >
      {/* Placeholder image / Actual image */}
      <div
        className="w-[72px] h-[72px] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            width={72}
            height={72}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-[10px] text-gray-400 font-medium text-center leading-tight px-1">
            {title}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h2 className="text-[16px] font-bold text-gray-900 leading-tight mb-1">{title}</h2>
        <p className="text-[12px] text-gray-400 leading-relaxed">{description}</p>
      </div>

      {/* Arrow */}
      <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
    </Link>
  );
}

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto pb-24 border border-slate-100">
      {/* ── Header banner ─────────────────────────────────────────────────── */}
      <div className="relative bg-[#1a5c3a] rounded-2xl overflow-hidden px-6 mx-4 mt-6 pt-10 pb-8 min-h-[170px]">
        <div className="max-w-[58%]">
          <h1 className="text-white font-bold text-xl leading-snug">
            Your'e not alone
          </h1>
          <p className="text-green-200 text-xs mt-2">Get help from an AI coach, fellow companion on the journey, and experts.</p>
        </div>

        {/* Mascot placeholder */}
        <div className="absolute -right-8 -bottom-8 h-44 w-44">
          <Image
            src="/assets/help.png"
            alt="Mascot"
            width={160}
            height={160}
            className="object-contain object-bottom h-full w-full"
          />
        </div>
      </div>

      {/* ── Cards section ────────────────────────────────────────────────── */}
      <div className="px-4 mt-6 space-y-3">
        <HelpCard
          href="/help/coach"
          title="Chat Dengan Billy"
          description="Billy Merupakan AI companion yang akan menjawab semua keresahan kamu"
          imageSrc="/assets/coach.png"
        />

        <HelpCard
          href="/help/community"
          title="Temukan Komunitas"
          description="temukan teman seperjuangan di komunitas"
          imageSrc="/assets/comunity.png"
        />

        <HelpCard
          href="/help/consultation"
          title="Konsultasi Dengan Ahli"
          description="konsultasi secara gratis maupun berbayar dengan ahli"
          imageSrc="/assets/consult.png"
        />
      </div>

      <BottomNavbar items={navItems} />

    </div>
  );
}
