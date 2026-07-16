"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Send } from "lucide-react";

const PERSONAS = [
  {
    key: "direct",
    title: "Direct Billy",
    avatarPath: "/assets/directBilly.png",
  },
  {
    key: "supportive",
    title: "Supportive Billy",
    avatarPath: "/assets/supportiveBilly.png",
  },
  {
    key: "friendly",
    title: "Friendly Billy",
    avatarPath: "/assets/friendlyBilly.png",
  },
];

const DEFAULT_AVATAR = "/assets/billy.png";

const MESSAGES = [
  {
    isAI: true,
    personaKey: "supportive",
    text: "Halo, aku Billy. Ceritakan apa yang sedang kamu rasakan.",
    time: "JUST NOW",
  },
];

export default function CoachPage() {
  const router = useRouter();
  const selected = PERSONAS[0];

  return (
    <div className="flex flex-col h-screen bg-white max-w-sm mx-auto border overflow-hidden">

      {/* ── AppBar ──────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-[#E2E8F0]">
        <div className="flex items-center px-3 pt-4 pb-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-[#1E293B]" />
          </button>
          <h1 className="flex-1 text-center text-[18px] font-bold text-[#0F172A]">
            Chat With Billy
          </h1>
          <div className="w-9 h-9 flex items-center justify-center">
            <Image
              src={selected.avatarPath}
              alt={selected.title}
              width={36}
              height={36}
              className="object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
            />
          </div>
        </div>

        {/* ── Persona row ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 pb-3">
          <Image
            src={selected.avatarPath}
            alt={selected.title}
            width={40}
            height={40}
            className="object-contain flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
          />
          <span className="flex-1 text-sm font-semibold text-[#475569]">
            {selected.title}
          </span>
          <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F1F5F9]">
            <ChevronDown size={16} className="text-[#0F172A]" />
          </span>
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
        {MESSAGES.map((msg, i) => {
          const persona = PERSONAS.find((p) => p.key === msg.personaKey) ?? PERSONAS[0];

          if (!msg.isAI) {
            return (
              <div key={i} className="flex flex-col items-end gap-1.5">
                <div className="bg-[#F1F5F9] rounded-2xl px-4 py-3 max-w-[82%]">
                  <p className="text-sm text-[#1E293B] leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] font-semibold tracking-wide text-[#94A3B8] uppercase">
                  {msg.time}
                </span>
              </div>
            );
          }

          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src={persona.avatarPath}
                  alt={persona.title}
                  width={36}
                  height={36}
                  className="object-contain flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                />
                <span className="text-sm font-semibold text-[#475569]">{persona.title}</span>
              </div>
              <div className="bg-[#F4F8FA] rounded-2xl px-4 py-3 max-w-[85%]">
                <p className="text-sm text-[#1E293B] leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[10px] font-semibold tracking-wide text-[#94A3B8] uppercase pl-1">
                {msg.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Input ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white px-4 py-3 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-[28px] px-4 py-2 shadow-sm">
          <input
            type="text"
            placeholder="Reply ..."
            className="flex-1 bg-transparent text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none py-1.5"
          />
          <button
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-[#0F8C72]"
            aria-label="Send"
          >
            <Send size={15} className="text-white translate-x-px" />
          </button>
        </div>
      </div>
    </div>
  );
}
