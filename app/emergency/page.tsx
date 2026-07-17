"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Rewind, Accessibility, PenLine, Play, File } from "lucide-react";

interface Journal {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface EducationData {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string | null;
    category: string;
    type: string;
    published_at: string;
}

interface PhysicalChallenge {
    title: string;
    description: string;
}

export default function EmergencyPage() {
    const router = useRouter();
    const [videos, setVideos] = useState<EducationData[]>([]);
    const [loading, setLoading] = useState(true);

    const [isJournalPopupOpen, setIsJournalPopupOpen] = useState(false);
    const [journalContent, setJournalContent] = useState("");
    const [journals, setJournals] = useState<Journal[]>([]);
    const [isLoadingJournals, setIsLoadingJournals] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isExercisePopupOpen, setIsExercisePopupOpen] = useState(false);
    const [physicalChallenge, setPhysicalChallenge] = useState<PhysicalChallenge | null>(null);
    const [isLoadingExercise, setIsLoadingExercise] = useState(false);
    const [exerciseError, setExerciseError] = useState<string | null>(null);

    const fetchDailyContent = async () => {
        setIsLoadingExercise(true);
        setExerciseError(null);
        try {
            const token = localStorage.getItem("auth_token") ?? process.env.NEXT_PUBLIC_API_TOKEN ?? "";
            const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
            const res = await fetch(`${base}/api/v1/content/daily`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch daily content");
            const json = await res.json();
            if (json.success && json.data?.physicalChallenge) {
                setPhysicalChallenge(json.data.physicalChallenge);
            } else {
                setPhysicalChallenge(null);
            }
        } catch (err) {
            console.error(err);
            setExerciseError("Failed to load physical exercise.");
        } finally {
            setIsLoadingExercise(false);
        }
    };

    const handleOpenExercisePopup = () => {
        setIsExercisePopupOpen(true);
        fetchDailyContent();
    };

    const fetchJournals = async () => {
        setIsLoadingJournals(true);
        setError(null);
        try {
            const token = localStorage.getItem("auth_token") ?? process.env.NEXT_PUBLIC_API_TOKEN ?? "";
            const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
            const res = await fetch(`${base}/api/v1/journals`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch journals");
            const json = await res.json();
            if (json.success) {
                setJournals(json.data || []);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load past journals.");
        } finally {
            setIsLoadingJournals(false);
        }
    };

    const handleOpenPopup = () => {
        setIsJournalPopupOpen(true);
        fetchJournals();
    };

    const handleSubmitJournal = async () => {
        if (!journalContent.trim()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const token = localStorage.getItem("auth_token") ?? process.env.NEXT_PUBLIC_API_TOKEN ?? "";
            const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
            const res = await fetch(`${base}/api/v1/journals`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ content: journalContent })
            });
            if (!res.ok) throw new Error("Failed to submit journal");
            const json = await res.json();
            if (json.success) {
                setJournalContent("");
                fetchJournals();
            }
        } catch (err) {
            console.error(err);
            setError("Failed to submit journal.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token =
                    localStorage.getItem("auth_token") ??
                    process.env.NEXT_PUBLIC_API_TOKEN ??
                    "";
                const base = process.env.NEXT_PUBLIC_API_BASE_URL;

                const res = await fetch(`${base}/api/v1/education`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Failed to fetch videos");
                const json = await res.json();

                if (json.success && json.data) {
                    const allData = json.data as EducationData[];
                    const mentalHealthVideos = allData.filter(v => v.category === "Mental Health");
                    setVideos(mentalHealthVideos);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

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
                    onClick={() => router.push("/stats#prevention-plan")}
                    className="w-full bg-[#085a3d]/80 hover:bg-[#074c33] active:scale-[0.99] border border-white/5 px-6 py-5 rounded-[20px] flex items-center gap-4 text-left transition-all cursor-pointer shadow-md"
                >
                    <File size={22} className="shrink-0 text-white" />
                    <span className="text-[15px] font-extrabold leading-snug">
                        View Personalized 3D Prevention Plan
                    </span>
          </button>


                <button
                    onClick={handleOpenExercisePopup}
                    className="w-full bg-[#085a3d]/80 hover:bg-[#074c33] active:scale-[0.99] border border-white/5 px-6 py-5 rounded-[20px] flex items-center gap-4 text-left transition-all cursor-pointer shadow-md"
                >
                    <Accessibility size={22} className="shrink-0 text-white" />
                    <span className="text-[15px] font-extrabold leading-snug">
                        Do a simple physical exercise
                    </span>
                </button>

                <button
                    onClick={handleOpenPopup}
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
                    {loading ? (
                        <p className="text-white/80 text-sm pl-1">Loading videos...</p>
                    ) : videos.length > 0 ? (
                        videos.map((video, index) => (
                            <div
                                key={video.id}
                                onClick={() => handleVideoClick(video.url)}
                                className="w-[220px] shrink-0 snap-start bg-[#085a3d]/80 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-[#074c33] transition-colors"
                            >
                                {/* Thumbnail */}
                                <div className={`relative w-full h-[115px] ${index % 2 === 0 ? "bg-gradient-to-tr from-blue-900 to-indigo-950" : "bg-gradient-to-tr from-red-800 to-rose-950"} flex flex-col justify-between p-3.5 overflow-hidden`}>
                    
                                    
                                    {video.thumbnailUrl && (
                                        <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover " />
                                    )}

                                    {!video.thumbnailUrl && (
                                        <div className="flex flex-col gap-0.5 z-10">
                                            <span className="text-xs font-black leading-tight text-white line-clamp-2">
                                                {video.title}
                                            </span>
                                        </div>
                                    )}

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10">
                                        <Play size={16} fill="white" className="text-white ml-0.5" />
                                    </div>
                                </div>
                                {/* Title Bar */}
                                <div className="p-3 min-h-[58px] flex items-center">
                                    <p className="text-[11px] font-extrabold text-white leading-snug line-clamp-2">
                                        {video.title}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white/80 text-sm pl-1">No videos found.</p>
                    )}
                </div>
            </section>
            {/* Journal Popup */}
            {isJournalPopupOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-[24px] bg-[#0b744f] p-6 shadow-2xl border border-white/10 flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black text-white">Journal</h3>
                            <button
                                onClick={() => setIsJournalPopupOpen(false)}
                                className="text-white/80 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {error && <p className="text-red-300 text-sm mb-3 font-semibold">{error}</p>}
                        
                        <textarea 
                            className="w-full rounded-[16px] bg-[#085a3d]/80 border border-white/10 p-4 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 resize-none min-h-[120px] shadow-inner font-medium"
                            placeholder="How are you feeling right now?"
                            value={journalContent}
                            onChange={(e) => setJournalContent(e.target.value)}
                            disabled={isSubmitting}
                        />
                        
                        <button
                            onClick={handleSubmitJournal}
                            disabled={isSubmitting || !journalContent.trim()}
                            className="mt-4 w-full rounded-full bg-white py-3.5 text-[15px] font-black text-[#0b744f] transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-md"
                        >
                            {isSubmitting ? "Saving..." : "Save Journal"}
                        </button>
                        
                        <div className="mt-6 flex-1 overflow-y-auto pr-1 space-y-3 pb-2 scrollbar-none">
                            <h4 className="text-sm font-bold text-white/90 sticky top-0 bg-[#0b744f] pb-2 z-10">Past Journals</h4>
                            {isLoadingJournals ? (
                                <p className="text-white/60 text-xs italic">Loading...</p>
                            ) : journals.length > 0 ? (
                                journals.map(journal => (
                                    <div key={journal.id} className="bg-[#085a3d]/50 p-4 rounded-[16px] border border-white/5">
                                        <p className="text-white/90 text-sm leading-relaxed">{journal.content}</p>
                                        <p className="text-white/40 text-[10px] mt-2 font-semibold">
                                            {new Date(journal.createdAt).toLocaleDateString()} at {new Date(journal.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-white/60 text-xs italic">No past journals found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Exercise Popup */}
            {isExercisePopupOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-[24px] bg-[#0b744f] p-6 shadow-2xl border border-white/10 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black text-white">Physical Exercise</h3>
                            <button
                                onClick={() => setIsExercisePopupOpen(false)}
                                className="text-white/80 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {isLoadingExercise ? (
                            <p className="text-white/80 text-sm py-8 text-center font-medium">Loading exercise...</p>
                        ) : exerciseError ? (
                            <p className="text-red-300 text-sm font-semibold py-8 text-center">{exerciseError}</p>
                        ) : physicalChallenge ? (
                            <div className="flex flex-col gap-4 mt-2 mb-4">
                                <div className="bg-[#085a3d]/80 border border-white/10 p-5 rounded-[20px] flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-1">
                                        <Accessibility size={28} className="text-white" />
                                    </div>
                                    <h4 className="text-lg font-black text-white leading-tight">{physicalChallenge.title}</h4>
                                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                                        {physicalChallenge.description}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-white/80 text-sm py-8 text-center font-medium">No physical exercise available today.</p>
                        )}
                        
                        <button
                            onClick={() => setIsExercisePopupOpen(false)}
                            className="mt-2 w-full rounded-full bg-white py-3.5 text-[15px] font-black text-[#0b744f] transition-all hover:bg-white/90 active:scale-[0.98] shadow-md"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
