"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { RefreshCw, BookOpen, User, Home, ChartColumn, Heart } from "lucide-react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import BottomNavbar from "@/components/BottomNavbar";

// ─── Navigation ───────────────────────────────────────────────────────────────

const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Stats", href: "/stats", icon: ChartColumn },
    { label: "Support", href: "/help", icon: Heart },
    { label: "Learn", href: "/education", icon: BookOpen },
    { label: "Profile", href: "/profile", icon: User },
];

// ─── API Types ────────────────────────────────────────────────────────────────

interface HourlyRelapse {
    hour_utc: number;
    relapse_count: number;
}

interface TriggerDistribution {
    relapse_trigger: string;
    relapse_trigger_count: number;
}

interface Statistics {
    current_streak: number;
    longest_streak: number;
    total_checkins: number;
    total_attempts: number;
    success_rate: number;
    streak_calendar: string[];
    relapse_calendar: string[];
    relapse_count: number;
    relapse_rate: number;
    weekly_progress: {
        window_days: number;
        current_successful_checkins: number;
        previous_successful_checkins: number;
        delta: number;
        delta_rate: number;
    };
    monthly_progress: {
        window_days: number;
        current_successful_checkins: number;
        previous_successful_checkins: number;
        delta: number;
        delta_rate: number;
    };
    streak_goal_comparison: {
        porn_free_goal: number;
        current_streak: number;
        longest_streak: number;
        goal_reached: boolean;
        remaining_days: number;
        progress_rate: number;
    };
}

interface StatsApiData {
    statistics: Statistics;
    relapses: unknown[];
    hourly_relapse_distribution: HourlyRelapse[];
    relapse_triggers_distribution: TriggerDistribution[];
    peak_relapse_hours_utc: number[];
    peak_relapse_count: number;
    ai_summary: string;
    relapse_time_summary: {
        title: string;
        analysis: string;
        summary: string;
    } | null;
    relapse_trigger_summary: {
        title: string;
        analysis: string;
        summary: string;
    } | null;
}

interface PreventionPlanData {
    delay: string;
    distract: string;
    decide: string;
    raw: string;
}

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

// ─── Time-of-day configuration (UTC hours) ────────────────────────────────────

const TIME_PERIODS = [
    { key: "morning",   label: "Morning (5-11)",   hours: [5,6,7,8,9,10,11],   color: "#f59e0b" },
    { key: "afternoon", label: "Afternoon (12-17)", hours: [12,13,14,15,16,17], color: "#22c55e" },
    { key: "evening",   label: "Evening (18-22)",   hours: [18,19,20,21,22],    color: "#3730a3" },
    { key: "night",     label: "Night (23-4)",      hours: [23,0,1,2,3,4],      color: "#7c3aed" },
];

// ─── Trigger color palette ────────────────────────────────────────────────────

const TRIGGER_COLORS = [
    "#1a5c3a", "#607d8b", "#ecc94b", "#26a69a",
    "#7c3aed", "#3730a3", "#ef4444", "#f97316",
];

// ─── Chart layout constants ───────────────────────────────────────────────────

const BAR_W   = 34;
const BAR_GAP = 12;
const CHART_H = 140;
const YPAD    = 8;
const XPAD    = 22;

const CX = 120, CY = 122, OUTER_R = 82, INNER_R = 50;

// ─── Page component ───────────────────────────────────────────────────────────

export default function StatsPage() {
    const [tab, setTab]       = useState<"analysis" | "history">("analysis");
    const [filter, setFilter] = useState<"top5" | "all">("top5");

    const [statsData, setStatsData] = useState<StatsApiData | null>(null);
    const [planData,  setPlanData]  = useState<PreventionPlanData | null>(null);
    // loading starts true so the initial fetch shows a spinner without a synchronous
    // setState call inside the effect body (which Next.js 16 disallows).
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);

    const runFetch = (isRetry = false) => {
        if (isRetry) {
            // Only synchronously set state when triggered by user interaction,
            // never from inside a useEffect body.
            setLoading(true);
            setError(null);
        }

        // Token: prefer value stored in localStorage after login, fall back to env var.
        const token =
            localStorage.getItem("auth_token") ??
            process.env.NEXT_PUBLIC_API_TOKEN ??
            "";
        const base    = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
        const headers: HeadersInit = { Authorization: `Bearer ${token}` };

        Promise.all([
            fetch(`${base}/api/v1/routine/relapses/statistics`, { headers }),
            // fetch(`${base}/api/v1/ai/relapse-prevention-plan`,  { headers }),
        ])
            .then(([statsRes,]) => {
                if (!statsRes.ok) throw new Error(`Statistics API returned ${statsRes.status}`);
                // if (!planRes.ok)  throw new Error(`Prevention plan API returned ${planRes.status}`);
                return Promise.all([statsRes.json()]);
            })
            // .then(([statsJson, planJson]) => {
            //     if (statsJson.success) setStatsData(statsJson.data as StatsApiData);
            //     if (planJson.success)  setPlanData(planJson.data as PreventionPlanData);
            // })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "Failed to load data");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        // No synchronous setState here — loading is already true from useState(true).
        runFetch();
    }, []);

    // ─── Derived stats ────────────────────────────────────────────────────────

    const stats         = statsData?.statistics;
    const cleanDays     = stats?.streak_calendar ?? [];
    const longestStreak = stats?.longest_streak  ?? 0;
    const successRate   = stats?.success_rate    ?? 0;
    const totalCheckins = stats?.total_checkins  ?? 0;
    const relapseCount  = stats?.relapse_count   ?? 0;

    // ─── Trigger bar-chart data ───────────────────────────────────────────────

    const allTriggers = useMemo(
        () =>
            (statsData?.relapse_triggers_distribution ?? []).map((t, i) => ({
                label: t.relapse_trigger,
                value: t.relapse_trigger_count,
                color: TRIGGER_COLORS[i % TRIGGER_COLORS.length],
            })),
        [statsData],
    );

    const triggerData = useMemo(
        () => (filter === "top5" ? allTriggers.slice(0, 5) : allTriggers),
        [allTriggers, filter],
    );

    const maxVal  = useMemo(() => Math.max(...triggerData.map((t) => t.value), 1), [triggerData]);
    const yScale  = CHART_H / maxVal;
    const chartW  = XPAD + Math.max(triggerData.length, 1) * (BAR_W + BAR_GAP) - BAR_GAP + 8;
    const totalH  = YPAD + CHART_H + 26;

    // ─── Donut chart segments (grouped by time-of-day) ────────────────────────

    const donutSegments = useMemo(() => {
        const hourlyData = statsData?.hourly_relapse_distribution ?? [];

        const buckets = TIME_PERIODS.map((period) => ({
            ...period,
            count: hourlyData
                .filter((h) => (period.hours as number[]).includes(h.hour_utc))
                .reduce((sum, h) => sum + h.relapse_count, 0),
        }));

        const total = buckets.reduce((sum, b) => sum + b.count, 0);
        if (total === 0) return null;

        const GAP_DEG = 4;
        let currentDeg = 0;

        return buckets
            .filter((b) => b.count > 0)
            .map((b) => {
                const span     = (b.count / total) * 360;
                const startDeg = currentDeg;
                const endDeg   = Math.max(startDeg + span - GAP_DEG, startDeg + 1);
                currentDeg    += span;
                return {
                    ...b,
                    startDeg,
                    endDeg,
                    path: donutArcPath(CX, CY, OUTER_R, INNER_R, startDeg, endDeg),
                };
            });
    }, [statsData]);

    // ─── Insight text from API ────────────────────────────────────────────────

    const triggerInsight = statsData?.relapse_trigger_summary?.summary
        ?? statsData?.relapse_trigger_summary?.analysis
        ?? "";

    const timeInsight = statsData?.relapse_time_summary?.summary
        ?? statsData?.relapse_time_summary?.analysis
        ?? "";

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto pb-24 border border-slate-100">

            {/* ── Header banner ─────────────────────────────────────────────── */}
            <div className="relative bg-[#1a5c3a] rounded-2xl overflow-hidden px-6 mx-4 mt-6 pt-10 pb-8 min-h-[170px]">
                <div className="max-w-[58%]">
                    <h1 className="text-white font-bold text-xl leading-snug">
                        Let&apos;s see how far you&apos;ve progressed
                    </h1>
                    <p className="text-green-200 text-xs mt-2">One small step every day</p>
                </div>
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

            {/* ── Tab switcher ──────────────────────────────────────────────── */}
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

            {/* ── Analysis tab ──────────────────────────────────────────────── */}
            {tab === "analysis" && (
                <div className="px-4 mt-6 space-y-10">

                    {/* Loading */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                            <RefreshCw size={24} className="animate-spin" />
                            <p className="text-sm">Loading your statistics…</p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <p className="text-sm text-red-500 text-center">{error}</p>
                            <button
                                onClick={() => runFetch(true)}
                                className="px-5 py-2 bg-[#1a5c3a] text-white rounded-full text-sm font-medium"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    {!loading && !error && (
                        <>
                            {/* ── Your Statistics ───────────────────────────────────────── */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900">Your Statistics</h2>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    This is your overview for the last 90 days
                                </p>

                                <div className="mt-4 flex gap-3 h-56">
                                    {/* Longest Streak — large left card */}
                                    <div className="flex-1 bg-[#e8f5ee] rounded-2xl pt-4 px-4 pb-2 flex flex-col justify-between">
                                        <p className="text-[#1a5c3a] text-2xl font-bold">Longest Streak</p>
                                        <div>
                                            <p className="text-5xl font-bold text-[#1a5c3a] leading-none">{longestStreak}</p>
                                            <p className="text-3xl font-bold text-[#1a5c3a] leading-snug">Days</p>
                                        </div>
                                    </div>

                                    {/* Right column — two small cards */}
                                    <div className="flex flex-col gap-3 w-36">
                                        {/* Success Rate */}
                                        <div className="flex-1 bg-[#e8f5ee] rounded-2xl p-3 flex flex-col justify-between">
                                            <div className="w-8 h-8 bg-white/40 rounded-xl flex items-center justify-center">
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
                                                <p className="text-2xl font-bold text-[#1a5c3a]">
                                                    {Math.round(successRate * 100)}%
                                                </p>
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
                                                <p className="text-2xl font-bold text-[#1a5c3a]">{totalCheckins} Days</p>
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
                                    <ScheduleCalendar selectedDays={cleanDays} />
                                </div>
                            </section>

                            {/* ── Trigger & Urges ───────────────────────────────────────── */}
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

                                    {triggerData.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-8">
                                            No trigger data recorded yet
                                        </p>
                                    ) : (
                                        <svg
                                            width="100%"
                                            viewBox={`0 0 ${chartW} ${totalH}`}
                                            preserveAspectRatio="xMidYMid meet"
                                        >
                                            {/* Grid lines */}
                                            {[
                                                Math.ceil(maxVal * 0.33),
                                                Math.ceil(maxVal * 0.66),
                                                maxVal,
                                            ].map((v) => {
                                                const yPos = YPAD + CHART_H - v * yScale;
                                                return (
                                                    <g key={v}>
                                                        <line
                                                            x1={XPAD - 4} y1={yPos}
                                                            x2={chartW - 4} y2={yPos}
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
                                            {triggerData.map((item, i) => {
                                                const barH = item.value * yScale;
                                                const x    = XPAD + i * (BAR_W + BAR_GAP);
                                                const y    = YPAD + CHART_H - barH;
                                                const label = item.label.length > 7
                                                    ? item.label.slice(0, 6) + "…"
                                                    : item.label;
                                                return (
                                                    <g key={item.label}>
                                                        <rect x={x} y={y} width={BAR_W} height={barH} rx="6" fill={item.color} />
                                                        <text
                                                            x={x + BAR_W / 2}
                                                            y={YPAD + CHART_H + 16}
                                                            fontSize="8.5" fill="#6b7280" textAnchor="middle"
                                                        >
                                                            {label}
                                                        </text>
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                    )}
                                </div>

                                {triggerInsight && <InfoNote text={triggerInsight} />}
                            </section>

                            {/* ── Time Of Day ───────────────────────────────────────────── */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900">Time Of Day</h2>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    When relapses occur throughout the day
                                </p>

                                <div className="mt-4 bg-[#f5f5f0] rounded-2xl p-4">
                                    <div className="flex justify-center">
                                        <svg width="240" height="240" viewBox="0 0 240 240">
                                            {donutSegments && donutSegments.length > 0 ? (
                                                <>
                                                    {donutSegments.map((seg) => (
                                                        <path key={seg.key} d={seg.path} fill={seg.color} />
                                                    ))}
                                                    {/* Centre: total relapse count */}
                                                    <text
                                                        x={CX} y={CY - 8}
                                                        fontSize="22" fontWeight="700"
                                                        fill="#374151" textAnchor="middle"
                                                    >
                                                        {relapseCount}
                                                    </text>
                                                    <text
                                                        x={CX} y={CY + 12}
                                                        fontSize="10" fill="#6b7280" textAnchor="middle"
                                                    >
                                                        relapses
                                                    </text>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Empty-state: grey ring */}
                                                    <circle cx={CX} cy={CY} r={OUTER_R} fill="#e5e7eb" />
                                                    <circle cx={CX} cy={CY} r={INNER_R} fill="#f5f5f0" />
                                                    <text
                                                        x={CX} y={CY + 4}
                                                        fontSize="11" fill="#9ca3af" textAnchor="middle"
                                                    >
                                                        No data yet
                                                    </text>
                                                </>
                                            )}
                                        </svg>
                                    </div>

                                    {/* Legend */}
                                    {donutSegments && donutSegments.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 -mt-2 pb-1">
                                            {donutSegments.map((seg) => (
                                                <div key={seg.key} className="flex items-center gap-1.5">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                                        style={{ backgroundColor: seg.color }}
                                                    />
                                                    <span className="text-xs text-gray-600">
                                                        {seg.label} ({seg.count})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {timeInsight && <InfoNote text={timeInsight} />}
                            </section>

                            {/* ── Relapse Prevention Plan ───────────────────────────────── */}
                            {/* <section id="prevention-plan">
                                <h2 className="text-2xl font-bold text-gray-900">Prevention Plan</h2>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    Your personal 3D strategy — Delay, Distract, Decide
                                </p>

                                <div className="mt-4 space-y-3">
                                    <div className="bg-[#e8f5ee] rounded-2xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-[#1a5c3a] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                                1 · Delay
                                            </span>
                                            <span className="text-[#1a5c3a] text-sm font-semibold">Pause before acting</span>
                                        </div>
                                        <p className="text-xs text-[#1a5c3a] leading-relaxed">
                                            {planData?.delay ?? "Wait 10 minutes before acting on the urge."}
                                        </p>
                                    </div>

                                    <div className="bg-[#eef2ff] rounded-2xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-[#3730a3] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                                2 · Distract
                                            </span>
                                            <span className="text-[#3730a3] text-sm font-semibold">Replace the urge</span>
                                        </div>
                                        <p className="text-xs text-[#3730a3] leading-relaxed">
                                            {planData?.distract ?? "Do a grounding activity for a few minutes."}
                                        </p>
                                    </div>

                                    <div className="bg-[#f5f3ff] rounded-2xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-[#7c3aed] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                                3 · Decide
                                            </span>
                                            <span className="text-[#7c3aed] text-sm font-semibold">Make a conscious choice</span>
                                        </div>
                                        <p className="text-xs text-[#7c3aed] leading-relaxed">
                                            {planData?.decide ?? "Choose the safest next step and contact support if needed."}
                                        </p>
                                    </div>
                                </div>

                                {statsData?.ai_summary && (
                                    <InfoNote text={statsData.ai_summary} />
                                )}
                            </section> */}
                        </>
                    )}
                </div>
            )}

            {/* ── History tab placeholder ────────────────────────────────────── */}
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
