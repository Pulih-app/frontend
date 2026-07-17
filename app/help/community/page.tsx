"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Heart, Plus, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { mockDb, Post } from "../../lib/mockDb";

const CATEGORIES = ["Advice", "Support", "Motivation"] as const;

function StreakBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-semibold px-2 py-0.5 rounded-full">
      {count}
      <Flame size={12} className="text-orange-400 fill-orange-400" />
    </span>
  );
}

function PostCard({ post, onLike }: { post: Post; onLike: (id: number) => void }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left text-black">
      {/* Text */}
      <p className="text-[15px] text-gray-900 leading-snug mb-3">{post.text}</p>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400 font-medium">{post.author}</span>
        <span className="text-gray-300 text-xs">•</span>
        <span className="text-xs text-gray-400">{post.time}</span>
        {post.streak > 0 && <StreakBadge count={post.streak} />}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <MessageSquare size={16} strokeWidth={1.8} />
          <span className="text-sm">{post.comments}</span>
        </button>
        <button 
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 transition-colors ${
            post.likedByUser ? "text-rose-500" : "text-gray-400 hover:text-rose-500"
          }`}
        >
          <Heart size={16} strokeWidth={1.8} fill={post.likedByUser ? "currentColor" : "none"} />
          <span className="text-sm">{post.likes}</span>
        </button>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<"Advice" | "Support" | "Motivation">("Advice");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(mockDb.getCommunityPosts());
  }, []);

  const handleLike = (id: number) => {
    mockDb.likeCommunityPost(id);
    setPosts(mockDb.getCommunityPosts());
  };

  const filtered = posts.filter((p) => p.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto border-x">

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
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
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
        {filtered.length > 0 ? (
          filtered.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))
        ) : (
          <div className="text-center py-10 text-sm text-gray-400">
            Belum ada postingan di kategori ini.
          </div>
        )}
      </div>

      {/* ── FAB ─────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-8 right-1/2 translate-x-[calc(192px-20px)] z-20">
        <Link
          href="/help/community/create"
          className="w-14 h-14 rounded-full bg-[#1a5c3a] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="Create Post"
        >
          <Plus size={24} className="text-white" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
