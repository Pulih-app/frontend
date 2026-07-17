"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { Bell, BookOpen, ChevronRight, User, Home, ChartColumn, UsersRound } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";
import { mockDb, UserStats } from "../lib/mockDb";

const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Stats", href: "/stats", icon: ChartColumn },
    { label: "Help", href: "/help", icon: UsersRound },
    { label: "Learn", href: "/education", icon: BookOpen },
    { label: "Profile", href: "/profile", icon: User },
];

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

// Days marked as clean (no relapse) — adjust to real data as needed
const CLEAN_DAYS = [
    "2026-06-01", "2026-06-02", "2026-06-03", "2026-06-04", "2026-06-05",
    "2026-06-06", "2026-06-07", "2026-06-08", "2026-06-09", "2026-06-10",
    "2026-06-11", "2026-06-12", "2026-06-13", "2026-06-14", "2026-06-15",
    "2026-06-16", "2026-06-17", "2026-06-18", "2026-06-19", "2026-06-20",
    "2026-06-21", "2026-06-22", "2026-06-23",
    "2026-07-01", "2026-07-02", "2026-07-03", "2026-07-04", "2026-07-05",
    "2026-07-06", "2026-07-07", "2026-07-08", "2026-07-09", "2026-07-10",
];

const TRIGGER_DATA = [
    { label: "Boredom", value: 6, color: "#1a5c3a" },
    { label: "Stress", value: 3.5, color: "#607d8b" },
    { label: "Media", value: 2.5, color: "#ecc94b" },
    { label: "Mood", value: 2, color: "#26a69a" },
    { label: "Location", value: 1.5, color: "#7c3aed" },
];

// ─── Bar chart constants ──────────────────────────────────────────────────────

const BAR_W = 34;
const BAR_GAP = 12;
const CHART_H = 140;
const MAX_VAL = 7;
const YPAD = 8;
const XPAD = 22;
const Y_SCALE = CHART_H / MAX_VAL;
const CHART_W = XPAD + TRIGGER_DATA.length * (BAR_W + BAR_GAP) - BAR_GAP + 8;
const TOTAL_H = YPAD + CHART_H + 26;

// ─── Donut chart constants ────────────────────────────────────────────────────

const CX = 120, CY = 122, OUTER_R = 82, INNER_R = 50;
// Evening (blue): 30° → 320° clockwise (290° arc)
// Night  (purple): 330° → 20° clockwise, crossing top (50° arc)
const EVENING_PATH = donutArcPath(CX, CY, OUTER_R, INNER_R, 30, 320);
const NIGHT_PATH = donutArcPath(CX, CY, OUTER_R, INNER_R, 330, 20);
const LABEL_R = OUTER_R + 22;
const LABEL_1 = polarToCartesian(CX, CY, LABEL_R, 8);   // near top-right
const LABEL_6 = polarToCartesian(CX, CY, LABEL_R, 205); // near bottom-left


// ─── Page component ───────────────────────────────────────────────────────────

export default function StatsPage() {
    const [tab, setTab] = useState<"analysis" | "history">("analysis");
    const [filter, setFilter] = useState<"top5" | "all">("top5");
    const [stats, setStats] = useState<UserStats>({ currentStreak: 0, longestStreak: 0, cleanDays: [], successRate: 100 });

    useEffect(() => {
        setStats(mockDb.getUserStats());
    }, []);


    return (
        <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto pb-24 border border-slate-100">

            {/* ── Header banner ─────────────────────────────────────────────────── */}
            <div className="relative bg-[#1a5c3a] rounded-2xl overflow-hidden px-6 mx-4 mt-6 pt-10 pb-8 min-h-[170px]">
                <div className="max-w-[58%]">
                    <h1 className="text-white font-bold text-xl leading-snug">
                        Let's see how far you've progressed
                    </h1>
                    <p className="text-green-200 text-xs mt-2">One small step every day</p>
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
                        className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${tab === t ? "bg-[#1a5c3a] text-white shadow-sm" : "text-gray-500"
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
                                    <p className="text-5xl font-bold text-[#1a5c3a] leading-none">{stats.longestStreak}</p>
                                    <p className="text-3xl font-bold text-[#1a5c3a] leading-snug">Days</p>
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
                                        <p className="text-2xl font-bold text-[#1a5c3a]">{stats.successRate}%</p>
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
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#1a5c3a] font-medium">Clean Days</p>
                                        <p className="text-2xl font-bold text-[#1a5c3a]">{stats.cleanDays.length} Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Streak Calendar ───────────────────────────────────────── */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900">Streak Calendar</h2>
                        <p className="text-gray-400 text-sm mt-0.5">
                            Clean days you have achieved
                        </p>
                        <div className="mt-4">
                            <ScheduleCalendar selectedDays={stats.cleanDays} />
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
                                        className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${filter === f
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

                    {/* ── Relapse Prevention Plan ─────────────────────────────────── */}
                    <section id="prevention-plan">
                        <h2 className="text-2xl font-bold text-gray-900">Prevention Plan</h2>
                        <p className="text-gray-400 text-sm mt-0.5">
                            Your personal 3D strategy — Delay, Distract, Decide
                        </p>

                        <div className="mt-4 space-y-3">

                            {/* ── DELAY ── */}
                            <div className="bg-[#e8f5ee] rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-[#1a5c3a] text-white text-xs font-bold px-2.5 py-1 rounded-full">1 · Delay</span>
                                    <span className="text-[#1a5c3a] text-sm font-semibold">Pause before acting</span>
                                </div>
                                <ol className="space-y-2">
                                    {[
                                        "Notice the urge and name it — say to yourself: \"This is a craving, not a command.\"",
                                        "Set a 20-minute timer on your phone. Commit to waiting it out before doing anything.",
                                        "Drink a full glass of water, then take 5 slow, deep breaths to lower your heart rate.",
                                    ].map((step, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#1a5c3a] text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                                            <p className="text-xs text-[#1a5c3a] leading-relaxed">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* ── DISTRACT ── */}
                            <div className="bg-[#eef2ff] rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-[#3730a3] text-white text-xs font-bold px-2.5 py-1 rounded-full">2 · Distract</span>
                                    <span className="text-[#3730a3] text-sm font-semibold">Replace the urge</span>
                                </div>
                                <ol className="space-y-2">
                                    {[
                                        "Boredom hit? Open your journal, read a book, or step outside for a 10-minute walk.",
                                        "Feeling stressed? Try 4-7-8 breathing: inhale 4 s, hold 7 s, exhale 8 s — repeat 4×.",
                                        "Change your physical space — move to a different room or call a trusted friend.",
                                        "During evening / night hours, queue a short video, podcast, or calming music playlist.",
                                    ].map((step, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#3730a3] text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                                            <p className="text-xs text-[#3730a3] leading-relaxed">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* ── DECIDE ── */}
                            <div className="bg-[#f5f3ff] rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-[#7c3aed] text-white text-xs font-bold px-2.5 py-1 rounded-full">3 · Decide</span>
                                    <span className="text-[#7c3aed] text-sm font-semibold">Make a conscious choice</span>
                                </div>
                                <ol className="space-y-2">
                                    {[
                                        "When the timer ends, ask yourself: \"Is the urge still there, or did it pass?\" Most urges fade.",
                                        "Remind yourself of your progress — 33 clean days and a 23-day streak are real achievements worth protecting.",
                                        "If the urge persists, open the Help tab and reach out to your support group or a trusted person.",
                                        "Log how you handled it. Seeing your wins builds confidence for the next time.",
                                    ].map((step, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#7c3aed] text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                                            <p className="text-xs text-[#7c3aed] leading-relaxed">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                        </div>

                        {/* Insight note */}
                        <InfoNote text="Urges typically peak at 3-5 minutes and fade within 20. Your biggest threats are Boredom and Stress in the evenings — the 3D plan keeps you one deliberate step ahead." />
                    </section>

                </div>
            )}

            {/* ── History tab placeholder ────────────────────────────────────────── */}
            {tab === "history" && (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm mt-12">
                    History coming soon
                </div>
            )}

            <BottomNavbar items={navItems} />


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
