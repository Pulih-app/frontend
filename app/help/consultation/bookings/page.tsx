"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useState, useEffect } from "react";

interface Booking {
  id: string;
  psychologistFullName: string;
  psychologistType: string;
  scheduledStartAt: string;
}

const DEFAULT_IMAGE = "/assets/onboarding/question-1";

function typeToLabel(type: string): string {
  return type === "clinical" ? "Clinical Psychologist" : "General Psychologist";
}

export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("auth_token") ?? "";
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

      try {
        const res = await fetch(`${base}/api/v1/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const json = await res.json();
        if (!json.success) {
          throw new Error(json.message ?? "Failed to fetch bookings");
        }

        setBookings(json.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col bg-white">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 pt-6 pb-4">
        <Link href="/help/consultation" aria-label="Back" className="absolute left-4">
          <ArrowLeft size={24} strokeWidth={2} className="text-gray-900" />
        </Link>
        <h1 className="text-[17px] font-bold text-gray-900">Booking List</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-2 pb-8 space-y-4">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B5E4C]"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No bookings found.
          </div>
        )}

        {!loading && !error && bookings.map((booking) => {
          const dateObj = new Date(booking.scheduledStartAt);
          const dateStr = dateObj.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          const timeStr = dateObj.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });


          return (
            <div key={booking.id} className="bg-[#F3F3F3] rounded-3xl p-4">
              <div className="flex gap-4">

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-[16px] font-bold text-gray-900">{booking.psychologistFullName}</p>
                    <span className="inline-block mt-1.5 px-3 py-1 bg-[#1B5E4C] text-white text-[11px] font-semibold rounded-full">
                      {typeToLabel(booking.psychologistType)}
                    </span>
                    <p className="text-[13px] text-gray-600 mt-2">
                      {dateStr}
                      <span className="ml-4">{timeStr}</span>
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
          );
        })}
      </div>
    </main>
  );
}
