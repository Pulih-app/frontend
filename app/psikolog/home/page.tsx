"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PsychologistShell } from "../_components/PsychologistShell";
import { ScheduleCalendar } from "../_components/ScheduleCalendar";

const fallbackDays = [16, 17, 20, 21, 22, 23, 24, 27, 28, 29, 30, 31];

export default function PsychologistHomePage() {
  const [availableDays] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = window.localStorage.getItem("psychologist-practice-days");
    return saved ? JSON.parse(saved) : [];
  });

  const hasSchedule = availableDays.length > 0;
  const displayDays = hasSchedule ? availableDays : fallbackDays;

  return (
    <PsychologistShell>
      {hasSchedule ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Jadwal Hari Ini</h2>
            <Link href="/psikolog/practice-schedule" className="text-[10px] font-medium text-[#19b75b]">
              Lihat Semua
            </Link>
          </div>
          <section className="mb-5 rounded-2xl bg-[#f0f0f0] p-5">
            <h3 className="text-sm font-bold">Nama Pasien</h3>
            <span className="mt-1 inline-flex rounded-full bg-[#00996e] px-3 py-1 text-[9px] font-bold text-white">1 Jam</span>
            <p className="mt-2 text-xs">13.00 - 14.00 WIB</p>
            <p className="mt-1 text-[10px]">Keluhan blablabla</p>
          </section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Jadwal Praktek</h2>
            <Link href="/psikolog/practice-schedule" className="text-[10px] font-medium text-[#19b75b]">
              Edit
            </Link>
          </div>
          <ScheduleCalendar availableDays={displayDays} selectedDays={displayDays} />
        </>
      ) : (
        <section className="flex flex-1 flex-col items-center justify-center pb-20 text-center">
          <Image src="/assets/psikolog/billy_pusing.png" width={150} height={150} alt="Belum ada jadwal" priority />
          <h2 className="mt-8 text-sm font-bold">Ayo buat jadwal praktek terlebih dahulu</h2>
          <Link href="/psikolog/practice-schedule" className="mt-4 rounded-xl bg-[#31b65c] px-4 py-3 text-sm font-bold text-white">
            Tambahkan
          </Link>
        </section>
      )}
    </PsychologistShell>
  );
}
