"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Heart, Plus, Flame } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PostAuthor {
  nickname: string;
  currentStreak: number;
}

interface Post {
  id: string;
  userId: string;
  title: string;
  category: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
}

// ─── Static data ─────────────────────────────────────────────────────────────

const CATEGORIES = ["Story", "Advice", "Support"] as const;

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
  // Currently, we don't get 'hasLiked' from the API response example, so we'll just mock it initially or allow toggle.
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
  const [localLiked, setLocalLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent navigating to detail page

    const wasLiked = localLiked;
    const currentCount = localLikeCount;

    setLocalLiked(!wasLiked);
    setLocalLikeCount(wasLiked ? currentCount - 1 : currentCount + 1);

    try {
      const token =
        localStorage.getItem("auth_token") ??
        process.env.NEXT_PUBLIC_API_TOKEN ??
        "";
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${base}/api/v1/community/${post.id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setLocalLiked(wasLiked);
        setLocalLikeCount(currentCount);
      }
    } catch (err) {
      setLocalLiked(wasLiked);
      setLocalLikeCount(currentCount);
      console.error("Failed to like post", err);
    }
  };

  const formattedTime = new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Link href={`/help/community/${post.id}`}>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
        {/* Text */}
        <p className="text-[15px] text-gray-900 leading-snug mb-3 line-clamp-3">{post.content}</p>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-400 font-medium">{post.author.nickname}</span>
          <span className="text-gray-300 text-xs">•</span>
          <span className="text-xs text-gray-400">{formattedTime}</span>
          <StreakBadge count={post.author.currentStreak} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
            <MessageSquare size={16} strokeWidth={1.8} />
            <span className="text-sm">{post.commentCount}</span>
          </button>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${localLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'}`}
          >
            <Heart size={16} strokeWidth={1.8} fill={localLiked ? "currentColor" : "none"} />
            <span className="text-sm">{localLikeCount}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Story");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("auth_token") ??
          process.env.NEXT_PUBLIC_API_TOKEN ??
          "";
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;

        const res = await fetch(`${base}/api/v1/community`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch posts");
        const json = await res.json();

        if (json.success && json.data) {
          setPosts(json.data);
        }
      } catch (err) {
        console.error("Failed to load community posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = posts.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm min-w-sm mx-auto ">

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
        {loading ? (
          <p className="text-center text-sm text-gray-400 mt-4">Loading posts...</p>
        ) : filtered.length > 0 ? (
          filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-center text-sm text-gray-400 mt-4">No posts found in this category.</p>
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
