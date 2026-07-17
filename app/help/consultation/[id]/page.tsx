"use client";

import Link from "next/link";
import { ArrowLeft, Star, MessageCircle, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import Button from "@/components/Button";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  patientUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface RatingSummary {
  averageRating: number;
  reviewCount: number;
}

interface SessionSlot {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  packageName: string;
  packageDurationMinutes: number;
  priceAmount: number;
}

interface Availability {
  date: string;
  totalSlots: number;
  availableSlots: number;
  heldSlots: number;
  bookedSlots: number;
  completedSlots: number;
  cancelledSlots: number;
  expiredSlots: number;
  rescheduledSlots: number;
  slots: SessionSlot[];
}

interface Psychologist {
  id: string;
  type: string;
  consultationChannel: string;
  fullName: string;
  photoUrl: string;
  bio: string;
  ratingSummary: RatingSummary;
  latestReviews: Review[];
  availability: Availability[];
}




// ─── Helpers ───────────────────────────────────────────────────────────────────

function typeToLabel(type: string): string {
  return type === "clinical" ? "Clinical Psychologist" : "General Psychologist";
}

/** Show first 4 chars of UUID + masked suffix for privacy */
function maskPatientId(userId: string): string {
  return userId.slice(0, 4) + "****";
}

function channelIcon(channel: string) {
  const hasChat = channel.includes("chat");
  const hasMeet = channel.includes("meet");
  return (
    <div className="flex items-center gap-2 mt-1.5">
      {hasChat && (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-[#E2EDE7] text-[#1B5E4C] text-[10px] font-semibold rounded-full">
          <MessageCircle size={10} /> Chat
        </span>
      )}
      {hasMeet && (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-[#E2EDE7] text-[#1B5E4C] text-[10px] font-semibold rounded-full">
          <Video size={10} /> Video
        </span>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function PsychologistProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [psychologist, setPsychologist] = useState<Psychologist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [challenge, setChallenge] = useState("");
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  const doFetch = async () => {
    const token = localStorage.getItem("auth_token") ?? "";
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

    try {
      const res = await fetch(`${base}/api/v1/psychologists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const json = await res.json();

      if (!json.success) throw new Error(json.message ?? "Failed to load psychologist profile");

      setPsychologist(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Derived state for dates, times, and bundles
  const availableDays = (psychologist?.availability || []).map((a) => a.date).sort();

  const timeSlots = (psychologist?.availability || [])
    .find((a) => a.date === selectedDay)
    ?.slots.map((s) => {
      const dateObj = new Date(s.startsAt);
      return dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    })
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort() || [];

  const allSlots = (psychologist?.availability || []).flatMap((a) => a.slots);
  
  const uniqueBundles = Array.from(
    new Map(
      allSlots.map((s) => [
        s.packageName,
        {
          id: s.packageName,
          label: s.packageName,
          price: `Rp${s.priceAmount.toLocaleString("id-ID")}`,
          duration: `${s.packageDurationMinutes} Minutes`,
        },
      ])
    ).values()
  );

  useEffect(() => {
    if (id) doFetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col bg-white">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 pt-6 pb-4">
        <Link href="/help/consultation" aria-label="Back" className="absolute left-4">
          <ArrowLeft size={24} strokeWidth={2} className="text-gray-900" />
        </Link>
        <h1 className="text-[17px] font-bold text-gray-900">Psychologist Profile</h1>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mt-20">
          <div className="h-8 w-8 rounded-full border-4 border-[#1B5E4C] border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mx-4 mt-8 rounded-2xl bg-red-50 px-5 py-5 text-center">
          <p className="text-sm font-semibold text-red-600">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); doFetch(); }}
            className="mt-4 px-5 py-2 bg-[#1B5E4C] text-white rounded-full text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Content — only rendered once data is loaded */}
      {!loading && !error && psychologist && (
        <>
          {/* Scrollable content */}
          <div className="flex-1 px-4 pb-32 space-y-8">

            {/* Psychologist Card */}
            <div className="bg-[#EFFBF4] rounded-3xl p-4 mt-2">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#E2EDE7] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={psychologist.photoUrl}
                    alt={psychologist.fullName}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-bold text-gray-900">{psychologist.fullName}</p>
                  <span className="inline-block mt-1.5 px-3 py-1 bg-[#1B5E4C] text-white text-[11px] font-semibold rounded-full">
                    {typeToLabel(psychologist.type)}
                  </span>
                  {channelIcon(psychologist.consultationChannel)}
                  {psychologist.bio ? (
                    <p className="text-[13px] text-gray-500 mt-2 line-clamp-3">{psychologist.bio}</p>
                  ) : null}
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star size={14} fill="#FACC15" stroke="none" />
                    <span className="text-[13px] text-gray-700 font-medium">
                      {psychologist.ratingSummary.averageRating.toFixed(1)}/5
                    </span>
                    <span className="text-[12px] text-gray-400 ml-0.5">
                      ({psychologist.ratingSummary.reviewCount} reviews)
                    </span>
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
              {psychologist.latestReviews.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {psychologist.latestReviews.map((review) => (
                    <div key={review.id} className="bg-[#EFFBF4] rounded-2xl p-4">
                      <div className="flex items-start justify-between">
                        <p className="text-[14px] font-bold text-gray-900">
                          {maskPatientId(review.patientUserId)}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star size={14} fill="#FACC15" stroke="none" />
                          <span className="text-[13px] text-gray-700 font-medium">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                      {review.comment ? (
                        <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">
                          {review.comment}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-gray-400">No testimonials yet.</p>
              )}
            </section>

            {/* Available Schedules */}
            <section>
              <h2 className="text-[20px] font-bold text-gray-900">Available Schedules</h2>
              <p className="text-[13px] text-gray-400 mt-0.5 mb-3">
                Select a date to view available time slots
              </p>
              <ScheduleCalendar
                availableDays={availableDays}
                selectedDays={selectedDay ? [selectedDay] : []}
                onSelectDay={(d) => {
                  setSelectedDay((prev) => (prev === d ? null : d));
                  setSelectedTime(null); // Reset time when date changes
                }}
              />
            </section>

            {/* Time Slots */}
            <section>
              <p className="text-[15px] font-semibold text-gray-900 mb-3">
                Select time <span className="text-red-500">*</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {timeSlots.map((time) => (
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
                {uniqueBundles.map((bundle) => (
                  <button
                    key={bundle.id}
                    type="button"
                    onClick={() => setSelectedBundle((prev) => (prev === bundle.id ? null : bundle.id))}
                    className={`text-left px-5 py-4 rounded-2xl border-2 transition-colors ${
                      selectedBundle === bundle.id
                        ? "border-[#1B5E4C] bg-[#EFFBF4]"
                        : "border-gray-200 bg-white"
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
        </>
      )}
    </main>
  );
}
