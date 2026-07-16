"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, ArrowLeft, ChevronDown, Search, Star, LayoutGrid, ArrowUpDown } from "lucide-react";
import { useState } from "react";

type Category = "All" | "Psikolog Umum" | "Psikolog Klinis";
type SortKey = "default" | "availability" | "price_asc";

const FILTERS: Category[] = ["All", "Psikolog Umum", "Psikolog Klinis"];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Urutkan" },
  { value: "availability", label: "Tersedia Hari Ini" },
  { value: "price_asc", label: "Termurah" },
];

interface Psychologist {
  id: number;
  name: string;
  category: Category;
  price: number;
  rating: number;
  availableToday: boolean;
  imageSrc: string;
}

const psychologists: Psychologist[] = [
  {
    id: 1,
    name: "Dr. Ayu Rahmawati, M.Psi.",
    category: "Psikolog Umum",
    price: 150000,
    rating: 4.5,
    availableToday: true,
    imageSrc: "/assets/onboarding/question-1",
  },
  {
    id: 2,
    name: "Dr. Budi Santoso, Psi.",
    category: "Psikolog Klinis",
    price: 200000,
    rating: 4.8,
    availableToday: false,
    imageSrc: "/assets/onboarding/question-1",
  },
  {
    id: 3,
    name: "Dr. Citra Dewi, M.Psi.",
    category: "Psikolog Umum",
    price: 120000,
    rating: 4.3,
    availableToday: true,
    imageSrc: "/assets/onboarding/question-1",
  },
  {
    id: 4,
    name: "Dr. Dimas Prakoso, Psi.",
    category: "Psikolog Klinis",
    price: 175000,
    rating: 4.7,
    availableToday: true,
    imageSrc: "/assets/onboarding/question-1",
  },
  {
    id: 5,
    name: "Dr. Eka Putri, M.Psi.",
    category: "Psikolog Klinis",
    price: 250000,
    rating: 4.9,
    availableToday: false,
    imageSrc: "/assets/onboarding/question-1",
  },
];

function formatPrice(price: number): string {
  return `Rp. ${price.toLocaleString("id-ID")}`;
}

function PsychologistCard({ psikolog }: { psikolog: Psychologist }) {
  return (
    <Link
      href={`/help/consultation/${psikolog.id}`}
      className="relative flex items-center gap-4 bg-gray-100 rounded-2xl p-4 active:scale-[0.98] transition-transform duration-150"
    >
      {/* Available Today badge */}
      {psikolog.availableToday && (
        <span className="absolute top-0 right-0 bg-[#1B5E4C] text-white text-[10px] font-semibold px-3 py-1.5 rounded-bl-xl rounded-tr-2xl">
          Available Today
        </span>
      )}

      {/* Photo */}
      <div className="w-25 h-25 rounded-xl shrink-0 bg-[#E2EDE7] overflow-hidden">
        <Image
          src={psikolog.imageSrc}
          alt={psikolog.name}
          width={100}
          height={100}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pt-4">
        <p className="text-[15px] font-bold text-gray-900 leading-snug">{psikolog.name}</p>
        <p className="text-[13px] text-gray-500 mt-2">{formatPrice(psikolog.price)}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={14} fill="#FACC15" stroke="none" />
          <span className="text-[13px] text-gray-700 font-medium">
            {psikolog.rating.toFixed(1)}/5
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ConsultationPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = psychologists
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeFilter === "All" || p.category === activeFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortKey === "availability") {
        return Number(b.availableToday) - Number(a.availableToday);
      }
      if (sortKey === "price_asc") {
        return a.price - b.price;
      }
      return 0;
    });

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? "Urutkan";

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col bg-white px-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <Link href="/help" aria-label="Kembali">
          <ArrowLeft size={24} strokeWidth={2} className="text-gray-900" />
        </Link>
        <h1 className="text-[17px] font-bold text-gray-900">Psikolog</h1>
        <a href="/help/consultation/bookings" aria-label="Bookings" className="flex flex-col items-center bg-slate-50 p-1 rounded-md">
          <CalendarCheck size={22} strokeWidth={1.8} className="text-gray-900" />
        </a>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 -mx-4" />

      {/* Search bar */}
      <div className="relative mt-5 mb-4">
        <Search
          size={18}
          strokeWidth={2}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Cari Teman Ceritamu"
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
            <span>{activeFilter === "All" ? "Kategori" : activeFilter}</span>
            <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>

          {filterOpen && (
            <div className="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setActiveFilter(f);
                    setFilterOpen(false);
                  }}
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
            <span>{sortKey === "default" ? "Urutkan" : activeSortLabel}</span>
            <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border
 border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortKey(opt.value);
                    setSortOpen(false);
                  }}
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

      {/* List */}
      <div className="flex flex-col gap-4">
        {filtered.length > 0 ? (
          filtered.map((p) => <PsychologistCard key={p.id} psikolog={p} />)
        ) : (
          <p className="text-center text-sm text-gray-400 mt-10">
            Psikolog tidak ditemukan.
          </p>
        )}
      </div>
    </main>
  );
}
