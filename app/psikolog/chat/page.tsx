"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";

interface Message {
    id: string;
    sender: "client" | "psychologist";
    text: string;
    time: string;
}

function ChatContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientName = searchParams.get("patient") || "Alex Morgan";
    const age = searchParams.get("age") || "24 Tahun";
    const duration = searchParams.get("duration") || "30 Mins";

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "client",
            text: "Halo Kak, selamat pagi. Saya mau konsultasi mengenai kecemasan berlebih yang belakangan ini sering muncul.",
            time: "08:00",
        },
        {
            id: "2",
            sender: "psychologist",
            text: `Selamat pagi, ${patientName.split(" ")[0]}. Tentu, mari kita diskusikan. Sejak kapan kecemasan ini mulai terasa mengganggu aktivitas sehari-hari?`,
            time: "08:02",
        },
        {
            id: "3",
            sender: "client",
            text: "Sudah sekitar 2 minggu terakhir ini, Kak. Terutama kalau malam hari pas mau tidur atau pas mikirin kerjaan.",
            time: "08:05",
        },
    ]);

    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleConfirmEndSession = () => {
        setShowEndModal(false);
        setToastMessage("Sesi konseling telah berhasil diselesaikan.");
        setTimeout(() => {
            setToastMessage(null);
            router.push("/psikolog/home");
        }, 2000);
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const timeNow = new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const newMsg: Message = {
            id: Date.now().toString(),
            sender: "psychologist",
            text: inputText,
            time: timeNow,
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText("");

        // Trigger auto reply from client for high-fidelity interactive feel
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const replies = [
                "Baik Kak, terima kasih atas arahannya. Saya akan coba menerapkan teknik pernapasan itu malam ini.",
                "Iya betul Kak, rasanya dada saya sesak dan pikiran terus berputar-putar tanpa henti.",
                "Apakah saya perlu mencatat pemicu cemas tersebut setiap kali muncul?",
                "Terima kasih penjelasannya Kak, sangat menenangkan mendengar penjelasan dari kakak.",
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    sender: "client",
                    text: randomReply,
                    time: new Date().toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
        }, 1500);
    };

    return (
        <main className="flex flex-col h-screen max-w-sm mx-auto w-full bg-white border-x relative shadow-sm">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
                <button
                    onClick={() => router.back()}
                    className="text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Kembali"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                
                <div className="flex flex-col items-center flex-1">
                    <h1 className="text-[15px] font-black text-gray-900 leading-tight">
                        {patientName}
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-extrabold text-[#0b744f] bg-[#effbf4] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {age}
                        </span>
                        <span className="text-[9px] font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {duration}
                        </span>
                    </div>
                </div>

                <div className="w-[22px]" /> {/* Spacer to align title centered */}
            </header>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0b744f] text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center gap-2.5 text-xs font-extrabold animate-in fade-in slide-in-from-top-4 duration-200 w-80">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* End Session Banner (Snackbar) */}
            <div className="bg-[#effbf4] border-b border-[#d2f3df] px-6 py-3.5 flex items-center justify-between z-10 shrink-0">
                <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-[#0b744f] uppercase tracking-wider">Sesi Sedang Berlangsung</span>
                    <span className="text-[9px] font-semibold text-gray-500 mt-0.5">Selesaikan sesi jika konseling telah selesai.</span>
                </div>
                <button
                    onClick={() => setShowEndModal(true)}
                    className="bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.96] text-white text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-[#0b744f]/10"
                >
                    Akhiri Sesi
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white scrollbar-none pb-24">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${
                            msg.sender === "psychologist" ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                    >
                        <div
                            className={`px-5 py-3.5 rounded-[24px] text-xs font-semibold leading-relaxed ${
                                msg.sender === "psychologist"
                                    ? "bg-gray-100 text-gray-800 rounded-tr-none"
                                    : "bg-[#effbf4] text-gray-800 rounded-tl-none"
                            }`}
                        >
                            {msg.text}
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold mt-1 px-1">
                            {msg.time}
                        </span>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex flex-col items-start mr-auto max-w-[80%]">
                        <div className="bg-[#effbf4] text-gray-400 px-5 py-3 rounded-[24px] rounded-tl-none text-xs font-bold flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex gap-3 items-center">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder="Tulis pesan..."
                    className="flex-1 bg-gray-100 rounded-2xl px-5 py-4 text-xs font-semibold outline-none border border-transparent focus:border-gray-200 focus:bg-white text-gray-800 transition-all"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.95] text-white p-4 rounded-2xl transition-all shadow-md shadow-[#0b744f]/10 cursor-pointer"
                >
                    <Send size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* End Session Confirmation Modal */}
            {showEndModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200 text-center">
                        <h3 className="text-base font-black text-gray-900 leading-tight">
                            Akhiri Sesi Konseling?
                        </h3>
                        <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                            Apakah Anda yakin ingin menyelesaikan sesi konseling chat dengan {patientName}? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setShowEndModal(false)}
                                className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-[0.97] font-extrabold text-xs py-3.5 rounded-2xl transition-all cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmEndSession}
                                className="flex-1 bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.97] text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all cursor-pointer shadow-md shadow-[#0b744f]/10"
                            >
                                Akhiri Sesi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-bold">Loading...</div>}>
            <ChatContent />
        </Suspense>
    );
}
