"use client";

import { useRouter } from "next/navigation";
import { X, Rewind, Accessibility, PenLine, Play } from "lucide-react";

export default function EmergencyPage() {
    const router = useRouter();

    const handleVideoClick = (url: string) => {
        if (typeof window !== "undefined") {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col overflow-hidden bg-[#0b744f] px-6 pb-8 pt-6 text-white">
            {/* Header */}
            <header className="mt-4 flex justify-between items-start">
                <div className="flex flex-col">
                    <h1 className="text-[28px] font-black text-white leading-tight">
                        Emergency
                    </h1>
                    <p className="text-sm font-semibold text-white/80 mt-2 leading-relaxed max-w-[260px]">
                        Feeling tempted? Try one of these options
                    </p>
                </div>
                <button
                    onClick={() => router.push("/home")}
                    className="text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer mt-1"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
            </header>

            {/* Action Cards */}
            <section className="mt-8 flex flex-col gap-4">
                <button
                    onClick={() => router.push("/manifesto")}
                    className="w-full bg-[#085a3d]/80 hover:bg-[#074c33] active:scale-[0.99] border border-white/5 px-6 py-5 rounded-[20px] flex items-center gap-4 text-left transition-all cursor-pointer shadow-md"
                >
                    <Rewind size={22} className="shrink-0 text-white" />
                    <span className="text-[15px] font-extrabold leading-snug">
                        Review the Manifesto You Wrote
                    </span>
                </button>

                <button
                    onClick={() => router.push("/exercise")}
                    className="w-full bg-[#085a3d]/80 hover:bg-[#074c33] active:scale-[0.99] border border-white/5 px-6 py-5 rounded-[20px] flex items-center gap-4 text-left transition-all cursor-pointer shadow-md"
                >
                    <Accessibility size={22} className="shrink-0 text-white" />
                    <span className="text-[15px] font-extrabold leading-snug">
                        Do a simple physical exercise
                    </span>
                </button>

                <button
                    onClick={() => router.push("/daily-checkin")}
                    className="w-full bg-[#085a3d]/80 hover:bg-[#074c33] active:scale-[0.99] border border-white/5 px-6 py-5 rounded-[20px] flex items-center gap-4 text-left transition-all cursor-pointer shadow-md"
                >
                    <PenLine size={22} className="shrink-0 text-white" />
                    <span className="text-[15px] font-extrabold leading-snug">
                        Write about what you feel right now
                    </span>
                </button>
            </section>

            {/* Video Regulation Section */}
            <section className="mt-10">
                <h2 className="text-[20px] font-black text-white tracking-tight">
                    Emotion Regulation Videos
                </h2>
                <p className="text-xs font-semibold text-white/80 mt-1 leading-snug">
                    Watch these videos to help manage your emotions and temptations
                </p>

                {/* Horizontal Scroll list */}
                <div className="mt-5 flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
                    {/* Video Card 1 */}
                    <div 
                        onClick={() => handleVideoClick("https://www.youtube.com/watch?v=kYJv1n4FmTM")}
                        className="w-[220px] shrink-0 snap-start bg-[#085a3d]/80 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-[#074c33] transition-colors"
                    >
                        {/* Mockup Thumbnail */}
                        <div className="relative w-full h-[115px] bg-gradient-to-tr from-blue-900 to-indigo-950 flex flex-col justify-between p-3.5">
                            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-black/40 w-fit text-blue-200">
                                DBT Skills
                            </span>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-black leading-tight text-white">
                                    Calming &
                                </span>
                                <span className="text-xs font-black leading-tight text-white">
                                    Regulating Emotions
                                </span>
                            </div>
                            
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <Play size={16} fill="white" className="text-white ml-0.5" />
                            </div>
                        </div>
                        {/* Title Bar */}
                        <div className="p-3 min-h-[58px] flex items-center">
                            <p className="text-[11px] font-extrabold text-white leading-snug line-clamp-2">
                                DBT Skills: Emotion Regulation and Acceptance
                            </p>
                        </div>
                    </div>

                    {/* Video Card 2 */}
                    <div 
                        onClick={() => handleVideoClick("https://www.youtube.com/watch?v=S09F57M6t8E")}
                        className="w-[220px] shrink-0 snap-start bg-[#085a3d]/80 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-[#074c33] transition-colors"
                    >
                        {/* Mockup Thumbnail */}
                        <div className="relative w-full h-[115px] bg-gradient-to-tr from-red-800 to-rose-950 flex flex-col justify-between p-3.5">
                            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-black/40 w-fit text-red-200">
                                TEDx Talk
                            </span>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-black leading-tight text-white">
                                    Don&apos;t neglect your
                                </span>
                                <span className="text-xs font-black leading-tight text-white">
                                    emotions. Express them
                                </span>
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <Play size={16} fill="white" className="text-white ml-0.5" />
                            </div>
                        </div>
                        {/* Title Bar */}
                        <div className="p-3 min-h-[58px] flex items-center">
                            <p className="text-[11px] font-extrabold text-white leading-snug line-clamp-2">
                                Don&apos;t neglect your emotions. Express them - TEDx
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
