"use client";

import { useState } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";

// ─── Donut chart helpers ──────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutArcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number,
) {
  const p1 = polarToCartesian(cx, cy, outerR, startDeg);
  const p2 = polarToCartesian(cx, cy, outerR, endDeg);
  const p3 = polarToCartesian(cx, cy, innerR, endDeg);
  const p4 = polarToCartesian(cx, cy, innerR, startDeg);
  const arc = (endDeg - startDeg + 360) % 360;
  const large = arc > 180 ? 1 : 0;
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

// ─── Static data ──────────────────────────────────────────────────────────────

const TRIGGER_DATA = [
  { label: "Boredom",  value: 6,   color: "#1a5c3a" },
  { label: "Stress",   value: 3.5, color: "#607d8b" },
  { label: "Media",    value: 2.5, color: "#ecc94b" },
  { label: "Mood",     value: 2,   color: "#26a69a" },
  { label: "Location", value: 1.5, color: "#7c3aed" },
];

// ─── Bar chart constants ──────────────────────────────────────────────────────

const BAR_W    = 34;
const BAR_GAP  = 12;
const CHART_H  = 140;
const MAX_VAL  = 7;
const YPAD     = 8;
const XPAD     = 22;
const Y_SCALE  = CHART_H / MAX_VAL;
const CHART_W  = XPAD + TRIGGER_DATA.length * (BAR_W + BAR_GAP) - BAR_GAP + 8;
const TOTAL_H  = YPAD + CHART_H + 26;

// ─── Donut chart constants ────────────────────────────────────────────────────

const CX = 120, CY = 122, OUTER_R = 82, INNER_R = 50;
// Evening (blue): 30° → 320° clockwise (290° arc)
// Night  (purple): 330° → 20° clockwise, crossing top (50° arc)
const EVENING_PATH = donutArcPath(CX, CY, OUTER_R, INNER_R, 30, 320);
const NIGHT_PATH   = donutArcPath(CX, CY, OUTER_R, INNER_R, 330, 20);
const LABEL_R      = OUTER_R + 22;
const LABEL_1      = polarToCartesian(CX, CY, LABEL_R, 8);   // near top-right
const LABEL_6      = polarToCartesian(CX, CY, LABEL_R, 205); // near bottom-left

// ─── Page component ───────────────────────────────────────────────────────────

export default function StatsPage() {
  const [tab,    setTab]    = useState<"analysis" | "history">("analysis");
  const [filter, setFilter] = useState<"top5" | "all">("top5");

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto pb-24 border">

      {/* ── Header banner ─────────────────────────────────────────────────── */}
      <div className="relative bg-[#1a5c3a] rounded-2xl overflow-hidden px-6 mx-4 mt-2 pt-10 pb-8 min-h-[170px]">
        <div className="max-w-[58%]">
          <h1 className="text-white font-bold text-xl leading-snug">
            Mari Kita lihat, Seberapa Jauh Progresmu
          </h1>
          <p className="text-green-200 text-xs mt-2">Satu langkah kecil setiap harinya</p>
        </div>

        {/* Mascot placeholder */}
        <div className="absolute -right-12 -bottom-8 h-56 w-56">
          <Image
            src="/assets/analysis.png"
            alt="Mascot"
            width={160}
            height={160}
            className="object-contain object-bottom h-full w-full"
          />
        </div>
      </div>

      {/* ── Tab switcher ──────────────────────────────────────────────────── */}
      <div className="mx-4 mt-4 flex bg-gray-100 rounded-full p-1">
        {(["analysis", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
              tab === t ? "bg-[#1a5c3a] text-white shadow-sm" : "text-gray-500"
            }`}
          >
            {t === "analysis" ? "Analysis" : "History"}
          </button>
        ))}
      </div>

      {/* ── Analysis tab ──────────────────────────────────────────────────── */}
      {tab === "analysis" && (
        <div className="px-4 mt-6 space-y-10">

          {/* ── Your Statistics ─────────────────────────────────────────── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Your Statistics</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              This is your overview for the last 90 days
            </p>

            <div className="mt-4 flex gap-3 h-56">
              {/* Longest Streak — left large card */}
              <div className="flex-1 bg-[#e8f5ee] rounded-2xl pt-4 px-4 pb-2 flex flex-col justify-between">
                <p className="text-[#1a5c3a] text-2xl font-bold">Longest Streak</p>
                <div>
                  <p className="text-5xl font-bold text-[#1a5c3a] leading-none">23</p>
                  <p className="text-3xl font-bold text-[#1a5c3a] leading-snug">Hari</p>
                </div>
              </div>

              {/* Right column — two small cards */}
              <div className="flex flex-col gap-3 w-36">
                {/* Success Rate */}
                <div className="flex-1 bg-[#e8f5ee]  rounded-2xl p-3 flex flex-col justify-between">
                  <div className="w-8 h-8 bg-white/40 rounded-xl flex items-center justify-center ">
                    <svg
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="#1a5c3a"
                      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#1a5c3a] font-medium">Success Rate</p>
                    <p className="text-2xl font-bold text-[#1a5c3a]">98%</p>
                  </div>
                </div>

                {/* Clean Days */}
                <div className="flex-1 bg-[#e8f5ee] rounded-2xl p-3 flex flex-col justify-between">
                  <div className="w-8 h-8 bg-white/40 rounded-xl flex items-center justify-center">
                    <svg
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="#1a5c3a"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8"  y1="2" x2="8"  y2="6" />
                      <line x1="3"  y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#1a5c3a] font-medium">Clean Days</p>
                    <p className="text-2xl font-bold text-[#1a5c3a]">33 Hari</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Trigger & Urges ─────────────────────────────────────────── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Trigger &amp; Urges</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              This is your overview for the last 90 days
            </p>

            <div className="mt-4 bg-[#f5f5f0] rounded-2xl p-4">
              {/* Filter pills */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600">Show:</span>
                {(["top5", "all"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                      filter === f
                        ? "bg-[#1a5c3a] text-white"
                        : "bg-white text-gray-600 border border-gray-200"
                    }`}
                  >
                    {f === "top5" ? "Top 5" : "All"}
                  </button>
                ))}
              </div>

              {/* Bar chart */}
              <svg
                width="100%"
                viewBox={`0 0 ${CHART_W} ${TOTAL_H}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Horizontal grid lines + y-axis labels */}
                {[6, 4, 2].map((v) => {
                  const yPos = YPAD + CHART_H - v * Y_SCALE;
                  return (
                    <g key={v}>
                      <line
                        x1={XPAD - 4} y1={yPos}
                        x2={CHART_W - 4} y2={yPos}
                        stroke="#e5e7eb" strokeWidth="1"
                      />
                      <text
                        x={XPAD - 8} y={yPos + 4}
                        fontSize="9" fill="#9ca3af" textAnchor="end"
                      >
                        {v}
                      </text>
                    </g>
                  );
                })}

                {/* Bars */}
                {TRIGGER_DATA.map((item, i) => {
                  const barH = item.value * Y_SCALE;
                  const x = XPAD + i * (BAR_W + BAR_GAP);
                  const y = YPAD + CHART_H - barH;
                  return (
                    <g key={item.label}>
                      <rect
                        x={x} y={y}
                        width={BAR_W} height={barH}
                        rx="6" fill={item.color}
                      />
                      <text
                        x={x + BAR_W / 2}
                        y={YPAD + CHART_H + 16}
                        fontSize="8.5" fill="#6b7280" textAnchor="middle"
                      >
                        {item.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Insight note */}
            <InfoNote text="Your data shows that Boredom are your main triggers. Developing specific coping strategies f..." />
          </section>

          {/* ── Time Of Day ─────────────────────────────────────────────── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Time Of Day</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              When relaspses Occur troughout the day
            </p>

            <div className="mt-4 bg-[#f5f5f0] rounded-2xl p-4">
              {/* Donut chart */}
              <div className="flex justify-center">
                <svg width="240" height="240" viewBox="0 0 240 240">
                  {/* Evening — large blue/indigo arc */}
                  <path d={EVENING_PATH} fill="#3730a3" />
                  {/* Night — small purple arc at top */}
                  <path d={NIGHT_PATH} fill="#7c3aed" />

                  {/* Count labels */}
                  <text
                    x={LABEL_1.x.toFixed(1)}
                    y={LABEL_1.y.toFixed(1)}
                    fontSize="12" fontWeight="500"
                    fill="#4b5563" textAnchor="middle"
                  >
                    1
                  </text>
                  <text
                    x={LABEL_6.x.toFixed(1)}
                    y={LABEL_6.y.toFixed(1)}
                    fontSize="12" fontWeight="500"
                    fill="#4b5563" textAnchor="middle"
                  >
                    6
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 -mt-2 pb-1">
                <div className="flex items-center gap-1.5">
                  <RefreshCw size={12} color="#3730a3" />
                  <span className="text-xs text-gray-600">Evening (18-22)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw size={12} color="#7c3aed" />
                  <span className="text-xs text-gray-600">Night (23-4)</span>
                </div>
              </div>
            </div>

            {/* Insight note */}
            <InfoNote text="Night (9PM-5AM) is your highest risk period. Creating a specific routine during these hours c..." />
          </section>

        </div>
      )}

      {/* ── History tab placeholder ────────────────────────────────────────── */}
      {tab === "history" && (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm mt-12">
          History coming soon
        </div>
      )}
    </div>
  );
}

// ─── Shared sub-component ─────────────────────────────────────────────────────

function InfoNote({ text }: { text: string }) {
  return (
    <div className="mt-3 bg-[#f5f5f0] rounded-2xl p-4 flex gap-3 items-start">
      <svg
        className="shrink-0 mt-0.5"
        width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="#1a5c3a"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r="0.8" fill="#1a5c3a" stroke="none" />
      </svg>
      <p className="text-xs text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}
