"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Heart, Plus, Flame } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  id: number;
  text: string;
  author: string;
  time: string;
  streak: number;
  comments: number;
  likes: number;
  category: "Advice" | "Support" | "Motivation";
}

// ─── Static data ─────────────────────────────────────────────────────────────

const CATEGORIES = ["Advice", "Support", "Motivation"] as const;

const POSTS: Post[] = [
  {
    id: 1,
    text: "Avoid things that potentially trigger a relapse",
    author: "djd*****",
    time: "08:43",
    streak: 0,
    comments: 2,
    likes: 1,
    category: "Advice",
  },
  {
    id: 2,
    text: "I tried a no-social-media rule after 20:30. The result is a calmer mind and falling asleep faster.",
    author: "Dav*****",
    time: "23:59",
    streak: 54,
    comments: 2,
    likes: 1,
    category: "Advice",
  },
  {
    id: 3,
    text: "Simple checklist: enough sleep, 20 minutes exercise, no night scrolling, and emotional check-in. Small steps, big impact.",
    author: "Eri*****",
    time: "02:59",
    streak: 40,
    comments: 2,
    likes: 1,
    category: "Advice",
  },
  {
    id: 4,
    text: "I use a 3-step pattern: take a deep breath, identify the trigger, then redirect to physical activity. Going strong for 2 months.",
    author: "Riz*****",
    time: "07:15",
    streak: 62,
    comments: 5,
    likes: 8,
    category: "Advice",
  },
  {
    id: 5,
    text: "Anyone has tips for handling urges at night? It's really hard when you are alone.",
    author: "Far*****",
    time: "21:30",
    streak: 7,
    comments: 4,
    likes: 2,
    category: "Support",
  },
  {
    id: 6,
    text: "Every small day passed is a victory. Don't compare your journey with others 💚",
    author: "And*****",
    time: "06:00",
    streak: 30,
    comments: 1,
    likes: 12,
    category: "Motivation",
  },
];

// ─── Streak badge ─────────────────────────────────────────────────────────────

function StreakBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-semibold px-2 py-0.5 rounded-full">
      {count}
      <Flame size={12} className="text-orange-400 fill-orange-400" />
    </span>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Text */}
      <p className="text-[15px] text-gray-900 leading-snug mb-3">{post.text}</p>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400 font-medium">{post.author}</span>
        <span className="text-gray-300 text-xs">•</span>
        <span className="text-xs text-gray-400">{post.time}</span>
        <StreakBadge count={post.streak} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <MessageSquare size={16} strokeWidth={1.8} />
          <span className="text-sm">{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-400 hover:text-rose-500 transition-colors">
          <Heart size={16} strokeWidth={1.8} />
          <span className="text-sm">{post.likes}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const router = useRouter();
  const activeCategory = "Advice";

  const filtered = POSTS.filter((p) => p.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto border">

      {/* ── AppBar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center px-3 pt-4 pb-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={20} className="text-[#1E293B]" />
          </button>
          <h1 className="flex-1 text-center text-[18px] font-bold text-[#0F172A]">
            Community
          </h1>
          {/* spacer to balance the back button */}
          <div className="w-9" />
        </div>

        {/* ── Category pills ───────────────────────────────────────────── */}
        <div className="flex gap-2 px-4 pb-4">
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#1a5c3a] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Posts ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 py-4 pb-24">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* ── FAB ─────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-8 right-1/2 translate-x-[calc(192px-20px)] z-20">
        <Link
          href="/help/community/tambah"
          className="w-14 h-14 rounded-full bg-[#1a5c3a] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="Create Post"
        >
          <Plus size={24} className="text-white" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
