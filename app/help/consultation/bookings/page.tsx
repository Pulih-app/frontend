"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BOOKINGS = [
  {
    id: 1,
    name: "Psychologist Name",
    specialty: "Clinical Psychologist",
    date: "14 July 2026",
    time: "08:00",
    image: "/assets/onboarding/question-1",
  },
];

export default function BookingListPage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col bg-white">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 pt-6 pb-4">
        <Link href="/help/consultation" aria-label="Back" className="absolute left-4">
          <ArrowLeft size={24} strokeWidth={2} className="text-gray-900" />
        </Link>
        <h1 className="text-[17px] font-bold text-gray-900">Booking List</h1>
      </div>

      {/* Booking Cards */}
      <div className="flex-1 px-4 pt-2 pb-8 space-y-4">
        {BOOKINGS.map((booking) => (
          <div key={booking.id} className="bg-[#F3F3F3] rounded-3xl p-4">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="w-24 h-28 rounded-2xl overflow-hidden bg-[#E2EDE7] shrink-0">
                <Image
                  src={booking.image}
                  alt={booking.name}
                  width={96}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <p className="text-[16px] font-bold text-gray-900">{booking.name}</p>
                  <span className="inline-block mt-1.5 px-3 py-1 bg-[#1B5E4C] text-white text-[11px] font-semibold rounded-full">
                    {booking.specialty}
                  </span>
                  <p className="text-[13px] text-gray-600 mt-2">
                    {booking.date}
                    <span className="ml-4">{booking.time}</span>
                  </p>
                </div>

                {/* Join/Chat button */}
                <button
                  type="button"
                  className="mt-3 w-full py-2.5 rounded-2xl bg-[#1B5E4C] text-white text-[14px] font-semibold hover:bg-[#174f3e] transition-colors"
                >
                  Join/Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
