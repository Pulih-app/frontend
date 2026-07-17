"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { mockDb, Booking } from "../../../lib/mockDb";

export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookings(mockDb.getBookings());
    setLoading(false);
  }, []);

  const handleJoinChat = (booking: Booking) => {
    if (booking.status === "pending") {
      alert("Sesi konseling Anda masih menunggu persetujuan dari psikolog.");
    } else if (booking.status === "rescheduled") {
      alert(`Sesi ini telah dijadwal ulang oleh psikolog.\nWaktu baru: ${booking.date} pukul ${booking.time}\nAlasan: ${booking.rescheduleReason || "-"}`);
    } else {
      if (booking.meetLink) {
        if (confirm(`Membuka tautan video call Google Meet untuk sesi dengan ${booking.name}:\n\n${booking.meetLink}\n\nApakah Anda ingin membuka link ini?`)) {
          window.open(booking.meetLink, "_blank");
        }
      } else {
        alert(`Memulai chat sesi konsultasi online dengan ${booking.name}...`);
      }
    }
  };

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col bg-white">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 pt-6 pb-4">
        <Link href="/help/consultation" aria-label="Kembali" className="absolute left-4">
          <ArrowLeft size={24} strokeWidth={2} className="text-gray-900" />
        </Link>
        <h1 className="text-[17px] font-bold text-gray-900">Booking List</h1>
      </div>

      {/* Booking Cards */}
      <div className="flex-1 px-4 pt-2 pb-8 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#1B5E4C]" />
          </div>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-[#F3F3F3] rounded-3xl p-4 text-black text-left">
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
                    <p className="text-[15px] font-bold text-gray-900">{booking.name}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="inline-block px-2.5 py-0.5 bg-[#1B5E4C] text-white text-[9px] font-semibold rounded-full">
                        {booking.specialty}
                      </span>
                      <span className={`inline-block px-2.5 py-0.5 text-white text-[9px] font-semibold rounded-full ${
                        booking.status === "accepted" ? "bg-[#2e7d32]" :
                        booking.status === "rescheduled" ? "bg-amber-600" : "bg-gray-400"
                      }`}>
                        {booking.status === "accepted" ? "Approved" :
                         booking.status === "rescheduled" ? "Rescheduled" : "Pending"}
                      </span>
                    </div>

                    <p className="text-[12px] text-gray-600 mt-2.5">
                      {booking.date}
                      <span className="ml-2.5 font-bold">{booking.time}</span>
                    </p>
                    {booking.status === "rescheduled" && booking.rescheduleReason && (
                      <p className="text-[10px] text-amber-700 font-medium mt-1 leading-snug">
                        Reschedule Reason: &quot;{booking.rescheduleReason}&quot;
                      </p>
                    )}
                  </div>

                  {/* Join/Chat button */}
                  <button
                    type="button"
                    onClick={() => handleJoinChat(booking)}
                    className={`mt-3 w-full py-2.5 rounded-2xl text-[14px] font-semibold transition-colors text-white ${
                      booking.status === "pending"
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#1B5E4C] hover:bg-[#174f3e]"
                    }`}
                  >
                    {booking.status === "pending" ? "Waiting Approval" : "Join/Chat"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-sm text-gray-400">
            Belum ada jadwal konsultasi yang dipesan.
          </div>
        )}
      </div>
    </main>
  );
}
