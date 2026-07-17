"use client";

import Image from "next/image";
import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col items-center bg-white px-6 pt-24 pb-8 text-center">
      {/* Title */}
      <h1 className="text-[22px] font-bold text-gray-900 mb-6">Pembayaran berhasil</h1>

      {/* Image */}
      <div className="relative mb-6 flex justify-center">
        <Image
          src="/assets/billy_editprofile.png"
          alt="Pulih mascot"
          width={200}
          height={200}
          className="object-contain"
          priority
        />
      </div>

      {/* Description */}
      <p className="text-[13px] text-gray-700 leading-relaxed mb-auto px-2">
        Your payment is being verified. Open your booking list to check consultation status and session details.
      </p>

      {/* Button */}
      <div className="w-full mt-12 mb-4">
        <Link 
          href="/help/consultation/bookings"
          className="flex w-full items-center justify-center rounded-[20px] bg-[#0D5C46] py-4 text-[16px] font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          Go To Booking List
        </Link>
      </div>
    </main>
  );
}
