"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, User, Home, ChartColumn, Heart, Target, LogOut, Edit2, X, Check } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Stats", href: "/stats", icon: ChartColumn },
  { label: "Support", href: "/help", icon: Heart },
  { label: "Learn", href: "/education", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: User },
];

const manageItems = [
  {
    icon: Target,
    title: "Reset Your Goals",
    description: "Adjust your recovery target",
    mascot: "/assets/set-target.png",
    href: "/onboarding/set-target",
  },
];

interface UserData {
  id: string;
  email: string;
  nickname: string;
  recovery_reason: string;
  daily_checkin_time: string;
  porn_free_goal: number;
  onboarding_completed: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    recovery_reason: "",
    daily_checkin_time: "07:30",
    porn_free_goal: 30,
  });

  const fetchUser = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("auth_token") || process.env.NEXT_PUBLIC_API_TOKEN || "";
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    try {
      const res = await fetch(`${base}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data);
          setFormData({
            nickname: json.data.nickname || "",
            recovery_reason: json.data.recovery_reason || "",
            daily_checkin_time: json.data.daily_checkin_time || "07:30",
            porn_free_goal: json.data.porn_free_goal || 30,
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("auth_token") || process.env.NEXT_PUBLIC_API_TOKEN || "";
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    try {
      const res = await fetch(`${base}/api/v1/users/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname: formData.nickname,
          recovery_reason: formData.recovery_reason,
          daily_checkin_time: formData.daily_checkin_time,
          porn_free_goal: Number(formData.porn_free_goal),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data);
          setIsEditing(false);
        }
      } else {
        alert("Failed to update settings");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token") || process.env.NEXT_PUBLIC_API_TOKEN || "";
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    try {
      // Optional backend logout if available
      await fetch(`${base}/api/v1/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error(e);
    }

    // Clear token and redirect
    localStorage.removeItem("auth_token");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white max-w-sm min-w-sm mx-auto pb-10 items-center justify-center">
        <div className="mt-10 flex justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-[#1a5c3a] border-t-transparent animate-spin" />
        </div>
        <BottomNavbar items={navItems} />

      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-sm min-w-sm mx-auto pb-20">
      {/* ── Profile card ──────────────────────────────────────────────────── */}
      <div className="px-4 pt-6">
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
          {/* Green top */}
          <div className="bg-[#1a5c3a] px-5 pt-5 pb-6 flex flex-col items-center justify-center relative">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Edit2 size={16} className="text-white" />
              </button>
            )}

            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-md">
              <Image
                src="/assets/profile.png"
                alt="Avatar"
                width={120}
                height={120}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="mt-4 w-full">
              {isEditing ? (
                <div className="space-y-3 w-full max-w-[200px] mx-auto">
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full text-center bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Nickname"
                  />
                  <p className="text-green-300 text-[12px] text-center">{user?.email}</p>
                </div>
              ) : (
                <>
                  <p className="text-green-300 text-[12px] text-center font-semibold">Your Profile</p>
                  <h2 className="text-white text-[22px] text-center font-bold leading-tight">{user?.nickname}</h2>
                  <p className="text-green-300 text-[12px] text-center mt-1">{user?.email}</p>
                </>
              )}
            </div>
          </div>

          {/* White bottom — Settings */}
          <div className="bg-white px-5 py-4 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Reason for Recovery</label>
                  <textarea
                    value={formData.recovery_reason}
                    onChange={(e) => setFormData({ ...formData, recovery_reason: e.target.value })}
                    className="w-full text-[14px] text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Check-in Time</label>
                    <input
                      type="time"
                      value={formData.daily_checkin_time}
                      onChange={(e) => setFormData({ ...formData, daily_checkin_time: e.target.value })}
                      className="w-full text-[14px] text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Goal (Days)</label>
                    <input
                      type="number"
                      value={formData.porn_free_goal}
                      onChange={(e) => setFormData({ ...formData, porn_free_goal: Number(e.target.value) })}
                      className="w-full text-[14px] text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a5c3a]"
                      min={1}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 py-2 rounded-lg bg-[#1a5c3a] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? "Saving..." : <><Check size={16} /> Save</>}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold mb-1">Reason for Recovery</p>
                  <p className="text-[14px] font-bold text-gray-900 leading-snug">
                    {user?.recovery_reason || "Not specified"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold mb-1">Daily Check-in</p>
                    <p className="text-[14px] font-bold text-gray-900">
                      {user?.daily_checkin_time || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold mb-1">Porn-Free Goal</p>
                    <p className="text-[14px] font-bold text-gray-900">
                      {user?.porn_free_goal ? `${user.porn_free_goal} Days` : "Not set"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Manage ────────────────────────────────────────────────────────── */}
      <div className="px-4 mt-7">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage</h2>
        <div className="space-y-3">
          {manageItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-3 bg-[#e8f5ee] rounded-2xl px-4 py-4 text-left active:scale-[0.98] transition-all duration-150 relative overflow-hidden"
              >
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900 leading-tight">{item.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.description}</p>
                </div>

                {/* Mascot */}
                <div className="w-12 h-12 shrink-0 ">
                  <Image
                    src={item.mascot}
                    alt={item.title}
                    width={48}
                    height={48}
                    priority
                    className="object-contain w-full h-full absolute top-0 -right-32"
                  />
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-2xl px-4 py-4 mt-4 active:scale-[0.98] transition-all duration-150 font-bold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
      <BottomNavbar items={navItems} />
    </div>
  );
}
