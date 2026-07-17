"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { BookOpen, Heart, User, Home, ChartColumn } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";

const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Stats", href: "/stats", icon: ChartColumn },
    { label: "Support", href: "/help", icon: Heart },
    { label: "Learn", href: "/education", icon: BookOpen },
    { label: "Profile", href: "/profile", icon: User },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface EducationItem {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string | null;
    category: string;
    type: string;
    published_at: string;
}

interface EducationApiResponse {
    success: boolean;
    message: string;
    data: EducationItem[];
    meta: null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EducationPage() {
    const [items, setItems] = useState<EducationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const doFetch = () => {
        const token =
            (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null) ??
            process.env.NEXT_PUBLIC_API_TOKEN ??
            "";
        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
        const headers: HeadersInit = { Authorization: `Bearer ${token}` };

        fetch(`${base}/api/v1/education`, { headers })
            .then((res) => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json() as Promise<EducationApiResponse>;
            })
            .then((json) => {
                if (!json.success) throw new Error(json.message ?? "Failed to load education content");
                setItems(json.data ?? []);
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "Something went wrong");
            })
            .finally(() => setLoading(false));
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        doFetch();
    };

    // loading starts true — no synchronous setState inside the effect body
    useEffect(() => { doFetch(); }, []);

    // Group items by category preserving insertion order
    const categories = items.reduce<{ title: string; items: EducationItem[] }[]>((acc, item) => {
        const existing = acc.find((g) => g.title === item.category);
        if (existing) {
            existing.items.push(item);
        } else {
            acc.push({ title: item.category, items: [item] });
        }
        return acc;
    }, []);

    console.log(categories)

    return (
        <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto pb-10">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="relative bg-[#1a5c3a] rounded-2xl overflow-hidden px-6 mx-4 mt-6 pt-10 pb-8 min-h-[170px]">
                <div className="max-w-[70%]">
                    <h1 className="text-white font-bold text-xl leading-snug">
                        Education & Insights
                    </h1>
                    <p className="text-green-200 text-xs mt-2">
                        Get help from an AI coach, fellow companion on the journey, and experts.
                    </p>
                </div>

                {/* Mascot */}
                <div className="absolute -right-4 -bottom-2 h-38 w-38">
                    <Image
                        src="/assets/pemulihan.png"
                        alt="Mascot"
                        width={160}
                        height={160}
                        className="object-contain object-bottom h-full w-full"
                    />
                </div>
            </div>

            {/* ── Content Library ─────────────────────────────────────────────── */}
            <div className="mt-6">
                <h2 className="px-4 text-2xl font-bold text-gray-900">Education Library</h2>

                {/* Loading */}
                {loading && (
                    <div className="mt-10 flex justify-center">
                        <div className="h-8 w-8 rounded-full border-4 border-[#1a5c3a] border-t-transparent animate-spin" />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="mt-8 mx-4 rounded-2xl bg-red-50 px-5 py-5 text-center">
                        <p className="text-sm font-semibold text-red-600">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="mt-4 px-5 py-2 bg-[#1a5c3a] text-white rounded-full text-sm font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && items.length === 0 && (
                    <p className="mt-10 text-center text-sm text-gray-400">No education content available.</p>
                )}

                {/* Categories */}
                {!loading && !error && categories.length > 0 && (
                    <div className="mt-4 space-y-6">
                        {categories.map((cat) => (
                            <section key={cat.title}>
                                <h3 className="px-4 text-[15px] font-bold text-[#1a5c3a] mb-3">
                                    {cat.title}
                                </h3>

                                {/* Horizontal scroll row */}
                                <div className="flex gap-3 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {cat.items.map((item) => (
                                        <a
                                            key={item.id}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-shrink-0 w-[148px] text-left active:scale-[0.97] transition-all duration-150"
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-full h-[84px] rounded-xl overflow-hidden bg-gray-100 relative">
                                                {item.thumbnailUrl ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img
                                                        src={item.thumbnailUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#e8f5ee]">
                                                        <BookOpen size={28} className="text-[#1a5c3a] opacity-60" />
                                                    </div>
                                                )}
                                                {/* Type badge */}
                                                <span className="absolute top-1.5 left-1.5 rounded-md bg-[#1a5c3a]/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                                    {item.type}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <p className="mt-1.5 text-[11px] font-bold text-gray-900 leading-snug line-clamp-2">
                                                {item.title}
                                            </p>
                                            <p className="mt-0.5 text-[10px] font-semibold text-[#1a5c3a] line-clamp-1">
                                                {item.description}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            <BottomNavbar items={navItems} />
        </div>
    );
}
