"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MessageSquare, Heart, Send, Reply } from "lucide-react";

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

interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentCommentId: string | null;
  content: string;
  depth: number;
  replyCount: number;
  createdAt: string;
  replies?: Comment[];
}

export default function PostDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [inputText, setInputText] = useState("");
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("auth_token") ??
          process.env.NEXT_PUBLIC_API_TOKEN ??
          "";
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Fetch post list to find this specific post
        const postsRes = await fetch(`${base}/api/v1/community`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (postsRes.ok) {
          const postsJson = await postsRes.json();
          if (postsJson.success && postsJson.data) {
            const foundPost = postsJson.data.find((p: Post) => p.id === postId);
            if (foundPost) setPost(foundPost);
          }
        }

        // Fetch comments
        const commentsRes = await fetch(`${base}/api/v1/community/${postId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (commentsRes.ok) {
          const commentsJson = await commentsRes.json();
          if (commentsJson.success && commentsJson.data?.comments) {
            setComments(commentsJson.data.comments);
          }
        }
      } catch (err) {
        console.error("Failed to load post details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    setSubmitting(true);
    try {
      const token =
        localStorage.getItem("auth_token") ??
        process.env.NEXT_PUBLIC_API_TOKEN ??
        "";
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;

      let url = `${base}/api/v1/community/${postId}/comments`;
      if (replyTarget) {
        url = `${base}/api/v1/community/${postId}/comments/${replyTarget.id}/replies`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: inputText }),
      });

      if (res.ok) {
        setInputText("");
        setReplyTarget(null);
        // Optimistically reload comments
        const commentsRes = await fetch(`${base}/api/v1/community/${postId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (commentsRes.ok) {
          const commentsJson = await commentsRes.json();
          if (commentsJson.success && commentsJson.data?.comments) {
            setComments(commentsJson.data.comments);
          }
        }
      } else {
        alert("Failed to submit comment.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const formattedTime = new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <div key={comment.id} className={`flex flex-col gap-2 ${isReply ? "ml-8 border-l-2 border-gray-100 pl-4" : "border-b border-gray-50 pb-4"}`}>
        <div className="flex items-center gap-2">
          {/* We don't have author info for comments in the provided response, so we'll just show 'User' or fallback */}
          <span className="text-xs font-semibold text-gray-700">User</span>
          <span className="text-gray-300 text-xs">•</span>
          <span className="text-xs text-gray-400">{formattedTime}</span>
        </div>
        <p className="text-[14px] text-gray-800 leading-snug">{comment.content}</p>
        
        {!isReply && (
          <button 
            onClick={() => setReplyTarget(comment)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1a5c3a] w-fit mt-1"
          >
            <Reply size={14} />
            <span>Reply</span>
          </button>
        )}

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="flex flex-col gap-4 mt-3">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-sm mx-auto relative overflow-hidden">
      
      {/* ── AppBar ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center px-3 pt-4 pb-3 border-b border-gray-100 bg-white z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={20} className="text-[#1E293B]" />
        </button>
        <h1 className="flex-1 text-center text-[18px] font-bold text-[#0F172A]">
          Post Details
        </h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {loading ? (
          <p className="text-center text-sm text-gray-400 mt-8">Loading post...</p>
        ) : (
          <>
            {/* ── Original Post ───────────────────────────────────────────────── */}
            {post && (
              <div className="px-4 py-5 border-b-8 border-gray-50">
                <h2 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{post.title}</h2>
                <p className="text-[15px] text-gray-800 leading-relaxed mb-4">{post.content}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-gray-700">{post.author.nickname}</span>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <MessageSquare size={18} />
                    <span className="text-sm font-medium">{post.commentCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Heart size={18} />
                    <span className="text-sm font-medium">{post.likeCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Comments Section ───────────────────────────────────────────── */}
            <div className="px-4 py-5 flex flex-col gap-6">
              <h3 className="font-bold text-gray-900 mb-2">Comments</h3>
              {comments.length > 0 ? (
                comments.map(c => renderComment(c))
              ) : (
                <p className="text-sm text-gray-400">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Comment Input Form ─────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 pb-6 flex flex-col gap-2 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {replyTarget && (
          <div className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <span className="text-xs text-gray-600 line-clamp-1">
              Replying to: <span className="font-medium">"{replyTarget.content}"</span>
            </span>
            <button 
              onClick={() => setReplyTarget(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={replyTarget ? "Write a reply..." : "Add a comment..."}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#1a5c3a]/20 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <button 
            onClick={handleSubmit}
            disabled={submitting || !inputText.trim()}
            className="w-10 h-10 shrink-0 bg-[#1a5c3a] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-gray-400 transition-colors"
          >
            <Send size={16} className="ml-[-2px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
