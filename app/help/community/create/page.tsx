"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const CATEGORIES = ["Story", "Advice", "Support"] as const;

export default function TambahPostPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    try {
      const token =
        localStorage.getItem("auth_token") ??
        process.env.NEXT_PUBLIC_API_TOKEN ??
        "";
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${base}/api/v1/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category: category.toLowerCase(),
          content,
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      router.push("/help/community");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to submit post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto">

      {/* ── AppBar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center px-3 pt-4 pb-3 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={20} className="text-[#1E293B]" />
        </button>
        <h1 className="flex-1 text-center text-[18px] font-bold text-[#0F172A]">
          Create Post
        </h1>
        <button 
          onClick={handleSubmit}
          disabled={loading || !title.trim() || !content.trim()}
          className="px-4 py-1.5 rounded-full bg-[#1a5c3a] text-white text-sm font-semibold active:opacity-80 transition-opacity disabled:opacity-50 disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 px-4 py-6">

        {/* Category */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Category</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isActive = cat === category;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                    isActive
                      ? "bg-[#1a5c3a] text-white border-[#1a5c3a]"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Title */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Title</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title..."
            className="w-full bg-[#f5f5f0] rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#1a5c3a]/20 transition-all"
          />
        </div>

        {/* Post content */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Post Content</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experiences, tips, or questions with the community..."
            rows={7}
            className="w-full bg-[#f5f5f0] rounded-2xl px-4 py-4 text-sm text-gray-800 placeholder-gray-400 outline-none resize-none leading-relaxed focus:ring-2 focus:ring-[#1a5c3a]/20 transition-all"
          />
          <p className="text-xs text-gray-400 text-right mt-1.5">{content.length} / 500</p>
        </div>

        {/* Community Guidelines */}
        <div className="rounded-2xl border border-gray-100 px-4 py-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Community Guidelines</p>
          <ul className="space-y-1.5">
            {[
              "Maintain privacy — do not mention other people's real names.",
              "Express yourself honestly and positively.",
              "Avoid content that triggers relapse.",
              "Support each other, do not judge.",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-500 leading-snug">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1a5c3a] flex-shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
