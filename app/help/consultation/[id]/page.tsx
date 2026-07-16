"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { useState } from "react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import Button from "@/components/Button";

const AVAILABLE_DAYS = [
  "2026-07-16", "2026-07-17", "2026-07-20", "2026-07-21", "2026-07-22",
  "2026-07-23", "2026-07-24", "2026-07-27", "2026-07-28", "2026-07-29",
  "2026-07-30", "2026-07-31",
];

const TIME_SLOTS = ["20:00", "20:15"];

const BUNDLES = [
  { id: 1, label: "Bundle 1", price: "Rp30.000", duration: "30 Minutes" },
  { id: 2, label: "Bundle 2", price: "Rp55.000", duration: "1 Hour" },
];

export default function PsychologistProfilePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [challenge, setChallenge] = useState("");
  const [selectedBundle, setSelectedBundle] = useState<number | null>(null);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col bg-white">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 pt-6 pb-4">
        <Link href="/help/consultation" aria-label="Kembali" className="absolute left-4">
          <ArrowLeft size={24} strokeWidth={2} className="text-gray-900" />
        </Link>
        <h1 className="text-[17px] font-bold text-gray-900">Psychologist Profile</h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 px-4 pb-32 space-y-8">

        {/* Psychologist Card */}
        <div className="bg-[#EFFBF4] rounded-3xl p-4 mt-2">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#E2EDE7] shrink-0">
              <Image
                src="/assets/onboarding/question-1"
                alt="Psychologist"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-bold text-gray-900">Nama Psikolog</p>
              <span className="inline-block mt-1.5 px-3 py-1 bg-[#1B5E4C] text-white text-[11px] font-semibold rounded-full">
                Clinical Psychologist
              </span>
              <p className="text-[13px] text-gray-500 mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque sit quis nemo omnis, aliquid magni qui iste sint iusto culpa!</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={14} fill="#FACC15" stroke="none" />
                <span className="text-[13px] text-gray-700 font-medium">4,5/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Testimonials */}
        <section>
          <h2 className="text-[20px] font-bold text-gray-900">Patient Testimonials</h2>
         <p className="text-[13px] text-gray-400 mb-3">
            What other people says about their experience
          </p>
          <div className="bg-[#EFFBF4] rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <p className="text-[14px] font-bold text-gray-900">Ano**mp</p>
              <div className="flex items-center gap-1">
                <Star size={14} fill="#FACC15" stroke="none" />
                <span className="text-[13px] text-gray-700 font-medium">4/5</span>
              </div>
            </div>
            <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">
              Aku suka pmo dan setelah saya sesi konsultasi dengan psikolog ini saya jadi tambah semangat untuk berubah
            </p>
          </div>
        </section>

        {/* Available Schedules */}
        <section>
          <h2 className="text-[20px] font-bold text-gray-900">Available Schedules</h2>
          <p className="text-[13px] text-gray-400 mt-0.5 mb-3">
            Select a date to view available time slots
          </p>
          <ScheduleCalendar
            availableDays={AVAILABLE_DAYS}
            selectedDays={selectedDay ? [selectedDay] : []}
            onSelectDay={(d) => setSelectedDay((prev) => (prev === d ? null : d))}
          />
        </section>

        {/* Time Slots */}
        <section>
          <p className="text-[15px] font-semibold text-gray-900 mb-3">
            Pilih jam <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime((prev) => (prev === time ? null : time))}
                className={`px-7 py-3 rounded-2xl border text-[14px] font-medium transition-colors ${
                  selectedTime === time
                    ? "border-[#1B5E4C] bg-[#1B5E4C] text-white"
                    : "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        {/* Tell Your Challenge */}
        <section>
          <h2 className="text-[20px] font-bold text-gray-900">Tell your Challenge</h2>
          <p className="text-[13px] text-gray-400 mt-0.5 mb-3">
            It is make us understand your challenge better
          </p>
          <textarea
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            rows={8}
            className="w-full rounded-3xl border bg-gray-50 p-4 text-[14px] text-gray-700 placeholder-gray-400 outline-none resize-none border-gray-200"
          />
        </section>

        {/* Choose Bundles */}
        <section>
          <h2 className="text-[20px] font-bold text-gray-900">Choose Your Session</h2>
          <p className="text-[13px] text-gray-400 mt-0.5 mb-3">
            Pick the length that feels right for you today
          </p>
          <div className="flex flex-col gap-3">
            {BUNDLES.map((bundle) => (
              <button
                key={bundle.id}
                type="button"
                onClick={() => setSelectedBundle((prev) => (prev === bundle.id ? null : bundle.id))}
                className={`text-left px-5 py-4 rounded-2xl border-2 border-gray-200 border transition-colors ${
                  selectedBundle === bundle.id
                    ? "bg-[#EFFBF4]"
                    : "bg-white"
                }`}
              >
                <p className="text-[13px] text-gray-500">{bundle.label}</p>
                <p className="text-[16px] font-bold text-gray-900">
                  {bundle.price} / {bundle.duration}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 pb-6 pt-3 bg-white">
        <Button type="button">Book Session</Button>
      </div>
    </main>
  );
}
