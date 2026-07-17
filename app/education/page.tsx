"use client";

import Image from "next/image";
import { useState } from "react";
import { BookOpen, ChevronRight, User, Home, ChartColumn, UsersRound } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";

const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Stats", href: "/stats", icon: ChartColumn },
    { label: "Help", href: "/help", icon: UsersRound },
    { label: "Learn", href: "/education", icon: BookOpen },
    { label: "Profile", href: "/profile", icon: User },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const quotes = [
    {
        text: '"Perubahan kecil dalam kebiasaan sehari-hari bisa membawa perubahan besar dalam hidupmu."',
        author: "— James Clear",
    },
    {
        text: '"Setiap hari adalah kesempatan baru untuk menjadi versi terbaik dirimu."',
        author: "— Unknown",
    },
    {
        text: '"Pemulihan bukan tentang menjadi sempurna, melainkan terus melangkah maju."',
        author: "— Anonymous",
    },
    {
        text: '"Kekuatan sejati ada pada kemampuanmu untuk bangkit setiap kali jatuh."',
        author: "— Winston Churchill",
    },
];

const videoCategories = [
    {
        title: "Learning Your Addiction",
        videos: [
            {
                id: "wSSkbxL27wU",
                title: "How to Quit Video Game, Pornography & Gaming Addiction",
                channel: "Huberman Lab Clips",
            },
            {
                id: "oUiNlTaKLMQ",
                title: "REAL PMO ADDICTION RECOVERY",
                channel: "NoFapGuy",
            },
            {
                id: "8-er5pAkFSk",
                title: "No More Bad Habits",
                channel: "Improvement",
            },
        ],
    },
    {
        title: "Helpful",
        videos: [
            {
                id: "0jrCl3e2gEk",
                title: "A Quick Way To Overcome Addiction",
                channel: "Improvement Pill",
            },
            {
                id: "iqHYDy_B3sA",
                title: "How to actually quit any addiction in ...",
                channel: "ByStickFigure Explains",
            },
            {
                id: "5MuIMqhT8pM",
                title: "The Day You Decide to Change",
                channel: "Motivation",
            },
        ],
    },
    {
        title: "Motivation",
        videos: [
            {
                id: "IEUEZMSb9RY",
                title: "Dopamine Detox & Reset Your Brain",
                channel: "Better Than Yesterday",
            },
            {
                id: "lMCmTC7RROU",
                title: "Mari Kita Simulasi Hidup Tanpa Narkoba",
                channel: "Narasi",
            },
            {
                id: "3K7wdUoGP8E",
                title: "You Are Stronger Than Your Addiction",
                channel: "Goalcast",
            },
        ],
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function EducationPage() {
    const [activeQuote, setActiveQuote] = useState(0);

    return (
        <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto pb-10">


            <div className="relative bg-[#1a5c3a] rounded-2xl overflow-hidden px-6 mx-4 mt-6 pt-10 pb-8 min-h-[170px]">
                <div className="max-w-[70%]">
                    <h1 className="text-white font-bold text-xl leading-snug">
                        Education & Insights
                    </h1>
                    <p className="text-green-200 text-xs mt-2">Get help from an AI coach, fellow companion on the journey, and experts.</p>
                </div>

                {/* Mascot placeholder */}
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

            {/* ── Video Library ──────────────────────────────────────────────────── */}
            <div className="mt-6">
                <h2 className="px-4 text-2xl font-bold text-gray-900">Video Libary</h2>

                <div className="mt-4 space-y-6">
                    {videoCategories.map((cat) => (
                        <section key={cat.title}>
                            {/* Category heading */}
                            <h3 className="px-4 text-[15px] font-bold text-[#1a5c3a] mb-3">
                                {cat.title}
                            </h3>

                            {/* Horizontal scroll row */}
                            <div className="flex gap-3 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {cat.videos.map((video) => (
                                    <button
                                        key={video.id}
                                        className="flex-shrink-0 w-[148px] text-left active:scale-[0.97] transition-all duration-150"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-full h-[84px] rounded-xl overflow-hidden bg-gray-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Info */}
                                        <p className="mt-1.5 text-[11px] font-bold text-gray-900 leading-snug line-clamp-2">
                                            {video.title}
                                        </p>
                                        <p className="mt-0.5 text-[10px] font-semibold text-[#1a5c3a]">
                                            {video.channel}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            <BottomNavbar items={navItems} />


        </div>
    );
}
