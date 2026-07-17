"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const DEFAULT_AVATAR = "/assets/supportiveBilly.png";

type ChatMessage = {
  id: string;
  isAI: boolean;
  text: string;
  time: string;
};

type CoachApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    response?: string;
    persona_used?: string;
  } | null;
  meta?: unknown;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    isAI: true,
    text: "Hello, I'm Billy. Tell me what you're feeling right now.",
    time: "JUST NOW",
  },
];

const getMessageTime = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function CoachPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    setError(null);
    setIsSending(true);
    setMessage("");

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      isAI: false,
      text: trimmedMessage,
      time: getMessageTime(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    const token =
      localStorage.getItem("auth_token") ??
      process.env.NEXT_PUBLIC_API_TOKEN ??
      "";
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

    try {
      const response = await fetch(`${base}/api/v1/ai/ask-coach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const json = (await response.json()) as CoachApiResponse;

      if (!response.ok || !json.success || !json.data?.response) {
        throw new Error(json.message ?? `Coach API returned ${response.status}`);
      }

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        isAI: true,
        text: json.data.response,
        time: getMessageTime(),
      };

      setMessages((currentMessages) => [...currentMessages, aiMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Billy could not respond right now. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-sm mx-auto overflow-hidden">

      {/* ── AppBar ──────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-[#E2E8F0]">
        <div className="flex items-center px-3 pt-4 pb-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={20} className="text-[#1E293B]" />
          </button>
          <h1 className="flex-1 text-center text-[18px] font-bold text-[#0F172A]">
            Chat With Billy
          </h1>
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
        {messages.map((msg) => {
          if (!msg.isAI) {
            return (
              <div key={msg.id} className="flex flex-col items-end gap-1.5">
                <div className="bg-[#F1F5F9] rounded-2xl px-4 py-3 max-w-[82%]">
                  <p className="text-sm text-[#1E293B] leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] font-semibold tracking-wide text-[#94A3B8] uppercase">
                  {msg.time}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src={DEFAULT_AVATAR}
                  alt="Billy"
                  width={36}
                  height={36}
                  className="object-contain flex-shrink-0"
                />
                <span className="text-sm font-semibold text-[#475569]">Billy</span>
              </div>
              <div className="bg-[#F4F8FA] rounded-2xl px-4 py-3 max-w-[85%]">
                <p className="text-sm text-[#1E293B] leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[10px] font-semibold tracking-wide text-[#94A3B8] uppercase pl-1">
                {msg.time}
              </span>
            </div>
          );
        })}
        {isSending ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image
                src={DEFAULT_AVATAR}
                alt="Billy"
                width={36}
                height={36}
                className="object-contain flex-shrink-0"
              />
              <span className="text-sm font-semibold text-[#475569]">Billy</span>
            </div>
            <div className="bg-[#F4F8FA] rounded-2xl px-4 py-3 max-w-[85%]">
              <p className="text-sm text-[#64748B] leading-relaxed">Billy is thinking...</p>
            </div>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white px-4 py-3 border-t border-[#E2E8F0]">
        {error ? (
          <p className="mb-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {error}
          </p>
        ) : null}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-[28px] px-4 py-2 shadow-sm"
        >
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Reply ..."
            disabled={isSending}
            className="flex-1 bg-transparent text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none py-1.5"
          />
          <button
            type="submit"
            disabled={isSending || message.trim().length === 0}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-[#0F8C72] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
            aria-label="Send"
          >
            <Send size={15} className="text-white translate-x-px" />
          </button>
        </form>
      </div>
    </div>
  );
}
