"use client";

import Link from "next/link";
import { CalendarCheck, ArrowLeft, ChevronDown, Search, Star, LayoutGrid, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type CategoryFilter = "All" | "General Psychologist" | "Clinical Psychologist";
type SortKey = "default" | "rating_desc";

const FILTERS: CategoryFilter[] = ["All", "General Psychologist", "Clinical Psychologist"];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Sort" },
  { value: "rating_desc", label: "Highest Rating" },
];

interface RatingSummary {
  averageRating: number;
  reviewCount: number;
}

interface Psychologist {
  id: string;
  type: string;
  fullName: string;
  photoUrl: string;
  bio: string;
  ratingSummary: RatingSummary;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Psychologist[];
  meta: null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function typeToCategory(type: string): CategoryFilter {
  return type === "clinical" ? "Clinical Psychologist" : "General Psychologist";
}

// ─── Components ────────────────────────────────────────────────────────────────

function PsychologistCard({ psikolog }: { psikolog: Psychologist }) {
  return (
    <Link
      href={`/help/consultation/${psikolog.id}`}
      className="relative flex items-center gap-4 bg-gray-100 rounded-2xl p-4 active:scale-[0.98] transition-transform duration-150"
    >
      {/* Photo */}
      <div className="w-24 h-24 rounded-xl shrink-0 bg-[#E2EDE7] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={psikolog.photoUrl}
          alt={psikolog.fullName}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pt-1">
        <p className="text-[15px] font-bold text-gray-900 leading-snug">{psikolog.fullName}</p>
        <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-[#1B5E4C] text-white text-[10px] font-semibold rounded-full">
          {typeToCategory(psikolog.type)}
        </span>
        <div className="flex items-center gap-1 mt-2">
          <Star size={14} fill="#FACC15" stroke="none" />
          <span className="text-[13px] text-gray-700 font-medium">
            {psikolog.ratingSummary.averageRating.toFixed(1)}/5
          </span>
          <span className="text-[12px] text-gray-400 ml-0.5">
            ({psikolog.ratingSummary.reviewCount} reviews)
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function ConsultationPage() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const doFetch = () => {
    const token = localStorage.getItem("auth_token") ?? "";
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

    fetch(`${base}/api/v1/psychologists`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json() as Promise<ApiResponse>;
      })
      .then((json) => {
        if (!json.success) throw new Error(json.message ?? "Failed to load psychologists data");
        setPsychologists(json.data ?? []);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "An error occurred");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    doFetch();
  }, []);

  const filtered = psychologists
    .filter((p) => {
      const matchesSearch = p.fullName.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeFilter === "All" || typeToCategory(p.type) === activeFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortKey === "rating_desc") {
        return b.ratingSummary.averageRating - a.ratingSummary.averageRating;
      }
      return 0;
    });

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? "Sort";

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col bg-white px-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <Link href="/help" aria-label="Kembali">
          <ArrowLeft size={24} strokeWidth={2} className="text-gray-900" />
        </Link>
        <h1 className="text-[17px] font-bold text-gray-900">Psychologists</h1>
        <a href="/help/consultation/bookings" aria-label="Bookings" className="flex flex-col items-center bg-slate-50 p-1 rounded-md">
          <CalendarCheck size={22} strokeWidth={1.8} className="text-gray-900" />
        </a>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 -mx-4" />

      {/* Search bar */}
      <div className="relative mt-5 mb-4">
        <Search size={18} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Find Your Listener"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border-2 border-[#1B5E4C] py-3.5 pl-11 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors"
        />
      </div>

      {/* Filter + sort */}
      <div className="flex items-center justify-between gap-2 mb-5">
        {/* Category dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setFilterOpen((prev) => !prev)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors border ${
              activeFilter !== "All"
                ? "bg-[#1B5E4C] text-white border-[#1B5E4C]"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            <LayoutGrid size={14} strokeWidth={2} />
            <span>{activeFilter === "All" ? "Category" : activeFilter}</span>
            <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>

          {filterOpen && (
            <div className="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => { setActiveFilter(f); setFilterOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    activeFilter === f
                      ? "bg-[#EFFBF4] text-[#1B5E4C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setSortOpen((prev) => !prev)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors border ${
              sortKey !== "default"
                ? "bg-[#1B5E4C] text-white border-[#1B5E4C]"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            <ArrowUpDown size={14} strokeWidth={2} />
            <span>{sortKey === "default" ? "Sort" : activeSortLabel}</span>
            <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortKey(opt.value); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    sortKey === opt.value
                      ? "bg-[#EFFBF4] text-[#1B5E4C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mt-16">
          <div className="h-8 w-8 rounded-full border-4 border-[#1B5E4C] border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-8 rounded-2xl bg-red-50 px-5 py-5 text-center">
          <p className="text-sm font-semibold text-red-600">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); doFetch(); }}
            className="mt-4 px-5 py-2 bg-[#1B5E4C] text-white rounded-full text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {filtered.length > 0 ? (
            filtered.map((p) => <PsychologistCard key={p.id} psikolog={p} />)
          ) : (
            <p className="text-center text-sm text-gray-400 mt-10">
              No psychologists found.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
