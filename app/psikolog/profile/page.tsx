"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Calendar, DollarSign, LogOut, Home, User, Edit3, CheckCircle2, ShieldCheck, FileText, X } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";

const navItems = [
    { label: "Home", href: "/psikolog/home", icon: Home },
    { label: "Profile", href: "/psikolog/profile", icon: User },
];

interface LegalDoc {
    name: string;
    fileName: string;
}

type PsychologistType = "general" | "clinical";

interface PsychologistProfile {
    type: PsychologistType;
    fullName: string;
    dateOfBirth: string;
    address: string;
    photoUrl: string | null;
    bio: string | null;
}

type ProfilePayload = {
    type: PsychologistType;
    fullName: string;
    dateOfBirth: string;
    address: string;
    photoUrl?: string | null;
    bio: string | null;
};

const defaultKlinisDocs: LegalDoc[] = [
    { name: "STRPK", fileName: "STRPK_Dr_Billy.pdf" },
    { name: "SIPPK", fileName: "SIPPK_Dr_Billy.pdf" },
    { name: "Ijazah", fileName: "Ijazah_Dr_Billy.pdf" },
    { name: "STR", fileName: "STR_Dr_Billy.pdf" },
    { name: "SIPP", fileName: "SIPP_Dr_Billy.pdf" },
];

const defaultUmumDocs: LegalDoc[] = [
    { name: "SIPP", fileName: "SIPP_Dr_Billy.pdf" },
    { name: "Ijazah", fileName: "Ijazah_Dr_Billy.pdf" },
    { name: "STR", fileName: "STR_Dr_Billy.pdf" },
];

export default function PsychologistProfilePage() {
    const router = useRouter();
    const [profession, setProfession] = useState<PsychologistType>("clinical");
    const [isMounted, setIsMounted] = useState(false);
    const [profile, setProfile] = useState<PsychologistProfile>({
        type: "clinical",
        fullName: "Dr. Billy, M.Psi.",
        dateOfBirth: "1990-01-01",
        address: "Jl. Demo No. 1",
        photoUrl: null,
        bio: "Specialized in anxiety treatment, relapse prevention, cognitive behavioral therapy (CBT), and emotional guidance.",
    });
    const [email, setEmail] = useState("dr.billy@pulih.com");
    const [profileLoading, setProfileLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile States
    const avatar = profile.photoUrl || "/assets/psikolog/billy_pusing.png";
    const description = profile.bio || "No specialization bio yet.";

    // Edit Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [tempProfile, setTempProfile] = useState<ProfilePayload>({
        type: "clinical",
        fullName: "",
        dateOfBirth: "",
        address: "",
        photoUrl: null,
        bio: "",
    });
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Legal Docs States
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [legalDocs, setLegalDocs] = useState<LegalDoc[]>([]);
    const [previewDoc, setPreviewDoc] = useState<LegalDoc | null>(null);

    useEffect(() => {
        setIsMounted(true);
        loadProfile();
    }, []);

    async function loadProfile() {
        setProfileLoading(true);
        setErrorMessage(null);

        try {
            const token = localStorage.getItem("auth_token") ?? process.env.NEXT_PUBLIC_API_TOKEN ?? "";
            if (!token) throw new Error("Authentication token not found. Please login again.");

            const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
            const res = await fetch(`${base}/api/v1/psychologists/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) throw new Error(data?.message ?? `Failed to load profile (${res.status})`);

            const nextProfile = data.data as PsychologistProfile;
            setProfile(nextProfile);
            setProfession(nextProfile.type);
            setLegalDocs(nextProfile.type === "general" ? defaultUmumDocs : defaultKlinisDocs);

            const userEmail = data?.data?.user?.email ?? data?.data?.email;
            if (typeof userEmail === "string") setEmail(userEmail);

            window.localStorage.setItem("psychologist-profession", nextProfile.type === "general" ? "umum" : "klinis");
            if (nextProfile.photoUrl) window.localStorage.setItem("psychologist-avatar", nextProfile.photoUrl);
            if (nextProfile.bio) window.localStorage.setItem("psychologist-description", nextProfile.bio);
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to load profile.");

            const savedProfession = window.localStorage.getItem("psychologist-profession");
            const fallbackProfession = savedProfession === "umum" ? "general" : "clinical";
            setProfession(fallbackProfession);
            setLegalDocs(fallbackProfession === "general" ? defaultUmumDocs : defaultKlinisDocs);
        } finally {
            setProfileLoading(false);
        }
    }

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("psychologist-profession");
        }
        router.push("/login/psikolog");
    };

    const handleEditProfileClick = () => {
        setTempProfile({
            type: profile.type,
            fullName: profile.fullName,
            dateOfBirth: profile.dateOfBirth,
            address: profile.address,
            photoUrl: profile.photoUrl,
            bio: profile.bio ?? "",
        });
        setShowEditModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfile((current) => ({ ...current, photoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setErrorMessage(null);

        try {
            const token = localStorage.getItem("auth_token") ?? process.env.NEXT_PUBLIC_API_TOKEN ?? "";
            if (!token) throw new Error("Authentication token not found. Please login again.");

            const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
            const res = await fetch(`${base}/api/v1/psychologists/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(tempProfile),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) throw new Error(data?.message ?? `Failed to update profile (${res.status})`);

            const nextProfile = data.data as PsychologistProfile;
            setProfile(nextProfile);
            setProfession(nextProfile.type);
            setLegalDocs(nextProfile.type === "general" ? defaultUmumDocs : defaultKlinisDocs);
            window.localStorage.setItem("psychologist-profession", nextProfile.type === "general" ? "umum" : "klinis");
            if (nextProfile.photoUrl) window.localStorage.setItem("psychologist-avatar", nextProfile.photoUrl);
            if (nextProfile.bio) window.localStorage.setItem("psychologist-description", nextProfile.bio);

            setShowEditModal(false);
            setToastMessage("Your profile has been successfully updated!");
            setTimeout(() => setToastMessage(null), 3000);
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    // Docs Event Handlers
    const handleDocsClick = () => {
        setShowDocsModal(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto pb-24 text-black relative">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0b744f] text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center gap-2.5 text-xs font-extrabold animate-in fade-in slide-in-from-top-4 duration-200 w-80">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-80 rounded-2xl bg-red-50 px-5 py-3.5 text-xs font-extrabold text-red-600 shadow-lg">
                    {errorMessage}
                </div>
            )}

            {/* ── Profile card ──────────────────────────────────────────────────── */}
            <div className="px-6 pt-8">
                <div className="rounded-[28px] overflow-hidden shadow-sm border border-gray-100">
                    {/* Green top banner */}
                    <div className="bg-[#0b744f] px-6 pt-6 pb-8 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Decorative background shape */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-white/0 rounded-bl-full pointer-events-none" />
                        
                        <div className="w-28 h-28 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-md p-1 border border-white/20">
                            <Image
                                src={avatar}
                                alt="Psychologist Profile Avatar"
                                width={112}
                                height={112}
                                className="object-cover w-full h-full rounded-full"
                            />
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-[#effbf4]/80 text-[11px] font-extrabold uppercase tracking-wider">
                                {isMounted ? (profession === "general" ? "General Psychologist" : "Clinical Psychologist") : "Psychologist"}
                            </p>
                            <h2 className="text-white text-xl font-black mt-1">
                                {profileLoading ? "Loading..." : profile.fullName}
                            </h2>
                            <p className="text-[#effbf4]/75 text-[11px] font-semibold mt-0.5">
                                {email}
                            </p>
                        </div>
                    </div>

                    {/* White bottom info banner */}
                    <div className="bg-white px-6 py-4 border-t border-gray-50 text-left">
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">Specialization & Fields</p>
                        <p className="text-xs font-bold text-gray-800 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Manage ────────────────────────────────────────────────────────── */}
            <div className="px-6 mt-8 flex-1">
                <h2 className="text-xl font-black text-gray-900 mb-4 text-left">Manage Account</h2>
                <div className="space-y-4">
                    {/* Edit Profil */}
                    <button
                        onClick={handleEditProfileClick}
                        className="w-full flex items-center justify-between bg-[#effbf4] hover:bg-[#e4f7eb] rounded-[22px] px-5 py-4 text-left active:scale-[0.98] transition-all cursor-pointer border border-[#d2f3df]/35 relative overflow-hidden min-h-[82px]"
                    >
                        <div className="flex-1 min-w-0 relative z-10 pr-14">
                            <p className="text-sm font-black text-gray-900 leading-tight">Edit Profile</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-1">Change your profile photo and specialization bio</p>
                        </div>
                        <div className="absolute right-2 bottom-0 w-[72px] h-[72px] shrink-0 z-0 select-none pointer-events-none">
                            <Image
                                src="/assets/billy_editprofile.png"
                                alt="Billy Edit Profile"
                                width={72}
                                height={72}
                                className="object-contain object-bottom w-full h-full"
                            />
                        </div>
                    </button>

                    {/* Dokumen Legalitas */}
                    <button
                        onClick={handleDocsClick}
                        className="w-full flex items-center justify-between bg-[#effbf4] hover:bg-[#e4f7eb] rounded-[22px] px-5 py-4 text-left active:scale-[0.98] transition-all cursor-pointer border border-[#d2f3df]/35 relative overflow-hidden min-h-[82px]"
                    >
                        <div className="flex-1 min-w-0 relative z-10 pr-14">
                            <p className="text-sm font-black text-gray-900 leading-tight">Legal Documents</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-1">View your STRPK, SIPPK, SIPP, STR, and Diploma documents</p>
                        </div>
                        <div className="absolute right-2 bottom-0 w-[72px] h-[72px] shrink-0 z-0 select-none pointer-events-none">
                            <Image
                                src="/assets/billy_dokumen.png"
                                alt="Billy Documents"
                                width={72}
                                height={72}
                                className="object-contain object-bottom w-full h-full"
                            />
                        </div>
                    </button>

                    {/* Atur Jadwal Praktik */}
                    <button
                        onClick={() => router.push("/psikolog/practice-schedule")}
                        className="w-full flex items-center justify-between bg-[#effbf4] hover:bg-[#e4f7eb] rounded-[22px] px-5 py-4 text-left active:scale-[0.98] transition-all cursor-pointer border border-[#d2f3df]/35 relative overflow-hidden min-h-[82px]"
                    >
                        <div className="flex-1 min-w-0 relative z-10 pr-14">
                            <p className="text-sm font-black text-gray-900 leading-tight">Set Practice Schedule</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-1">Manage your counseling availability days and hours</p>
                        </div>
                        <div className="absolute right-2 bottom-0 w-[72px] h-[72px] shrink-0 z-0 select-none pointer-events-none">
                            <Image
                                src="/assets/billy_jadwal.png"
                                alt="Billy Schedule"
                                width={72}
                                height={72}
                                className="object-contain object-bottom w-full h-full"
                            />
                        </div>
                    </button>

                    {/* Atur Tarif Konseling */}
                    <button
                        onClick={() => router.push("/psikolog/setup-pricing")}
                        className="w-full flex items-center justify-between bg-[#effbf4] hover:bg-[#e4f7eb] rounded-[22px] px-5 py-4 text-left active:scale-[0.98] transition-all cursor-pointer border border-[#d2f3df]/35 relative overflow-hidden min-h-[82px]"
                    >
                        <div className="flex-1 min-w-0 relative z-10 pr-14">
                            <p className="text-sm font-black text-gray-900 leading-tight">Set Counseling Fees</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-1">Adjust your online counseling session pricing</p>
                        </div>
                        <div className="absolute right-2 bottom-0 w-[72px] h-[72px] shrink-0 z-0 select-none pointer-events-none">
                            <Image
                                src="/assets/billy_bundling.png"
                                alt="Billy Bundling"
                                width={72}
                                height={72}
                                className="object-contain object-bottom w-full h-full"
                            />
                        </div>
                    </button>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100/70 active:scale-[0.98] text-red-600 rounded-[20px] px-4 py-4 mt-6 transition-all font-extrabold text-xs cursor-pointer shadow-sm shadow-red-100/50"
                >
                    <LogOut size={16} strokeWidth={2.5} />
                    LOG OUT
                </button>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            <h3 className="text-base font-black text-gray-900 leading-tight">
                                Edit Psychologist Profile
                            </h3>
                            <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                                Update your public profile information
                            </p>
                        </div>
                        <div className="h-px bg-gray-100 w-full" />

                        {/* Avatar edit */}
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Profile Photo
                            </label>
                            <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex items-center justify-center bg-gray-50">
                            <Image
                                    src={tempProfile.photoUrl || "/assets/psikolog/billy_pusing.png"}
                                    alt="Temporary Avatar"
                                    fill
                                    className="object-cover"
                                />
                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black text-white uppercase tracking-wider cursor-pointer">
                                    Change Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 text-left">
                            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Full Name
                                <input
                                    value={tempProfile.fullName}
                                    onChange={(e) => setTempProfile((current) => ({ ...current, fullName: e.target.value }))}
                                    className="rounded-2xl border-2 border-transparent bg-[#f5f5f5] px-4 py-3 text-xs font-semibold normal-case tracking-normal text-gray-800 outline-none transition-colors focus:border-[#0b744f] focus:bg-white"
                                />
                            </label>

                            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Psychologist Type
                                <select
                                    value={tempProfile.type}
                                    onChange={(e) => setTempProfile((current) => ({ ...current, type: e.target.value as PsychologistType }))}
                                    className="rounded-2xl border-2 border-transparent bg-[#f5f5f5] px-4 py-3 text-xs font-semibold normal-case tracking-normal text-gray-800 outline-none transition-colors focus:border-[#0b744f] focus:bg-white"
                                >
                                    <option value="general">General Psychologist</option>
                                    <option value="clinical">Clinical Psychologist</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Date of Birth
                                <input
                                    type="date"
                                    value={tempProfile.dateOfBirth}
                                    onChange={(e) => setTempProfile((current) => ({ ...current, dateOfBirth: e.target.value }))}
                                    className="rounded-2xl border-2 border-transparent bg-[#f5f5f5] px-4 py-3 text-xs font-semibold normal-case tracking-normal text-gray-800 outline-none transition-colors focus:border-[#0b744f] focus:bg-white"
                                />
                            </label>

                            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Address
                                <input
                                    value={tempProfile.address}
                                    onChange={(e) => setTempProfile((current) => ({ ...current, address: e.target.value }))}
                                    className="rounded-2xl border-2 border-transparent bg-[#f5f5f5] px-4 py-3 text-xs font-semibold normal-case tracking-normal text-gray-800 outline-none transition-colors focus:border-[#0b744f] focus:bg-white"
                                />
                            </label>
                        </div>

                        <div className="flex flex-col gap-1 text-left">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                                Specialization & Fields
                            </label>
                            <textarea
                                value={tempProfile.bio ?? ""}
                                onChange={(e) => setTempProfile((current) => ({ ...current, bio: e.target.value }))}
                                placeholder="Describe your specialization and fields of expertise..."
                                rows={3}
                                className="w-full rounded-2xl border-2 border-transparent bg-[#f5f5f5] px-4 py-3 text-xs font-semibold outline-none focus:border-[#0b744f] focus:bg-white transition-colors text-gray-800 resize-none leading-relaxed"
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-[0.97] font-extrabold text-xs py-3.5 rounded-2xl transition-all cursor-pointer text-center"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="flex-1 bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.97] disabled:opacity-60 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all cursor-pointer text-center shadow-md shadow-[#0b744f]/10"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Legal Documents Fullscreen Modal/Overlay */}
            {showDocsModal && (
                <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6 overflow-y-auto max-w-sm mx-auto w-full border-x animate-in slide-in-from-bottom duration-250 text-black">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 shrink-0 -mx-6 px-6">
                        <h3 className="text-[17px] font-black text-gray-900 tracking-tight">
                            Legal Documents
                        </h3>
                        <button
                            onClick={() => setShowDocsModal(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 font-semibold text-left mt-4 leading-relaxed">
                        Here are your practice legal documents verified by the Pulih team.
                    </p>

                    {/* Docs List */}
                    <div className="mt-5 space-y-4 flex-1">
                        {legalDocs.map((doc) => {
                            return (
                                <div
                                    key={doc.name}
                                    className="bg-white rounded-[24px] p-5 border border-gray-100 flex flex-col gap-4 shadow-sm text-left relative overflow-hidden transition-all duration-300"
                                >
                                    {/* Top-Right curved gradient shape */}
                                    <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-tr from-[#35b863]/10 to-[#2e7d32]/10 rounded-bl-full pointer-events-none z-0" />

                                    {/* Row 1: File icon + Text details + Badge */}
                                    <div className="relative z-10 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="p-2.5 bg-[#effbf4] rounded-2xl text-[#0b744f] border border-[#d2f3df]/35 shadow-sm shrink-0">
                                                <FileText size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-gray-900 leading-tight">
                                                    {doc.name}
                                                </h4>
                                                <p className="text-[10px] text-gray-400 font-bold truncate mt-1">
                                                    {doc.fileName}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-[#0b744f] uppercase tracking-wider bg-[#effbf4] px-2.5 py-1 rounded-xl border border-[#d2f3df] shrink-0">
                                            Verified
                                        </span>
                                    </div>

                                    {/* Row 2: Divider and View Button */}
                                    <div className="relative z-10 border-t border-gray-100 pt-3 mt-1 flex justify-end">
                                        <button
                                            onClick={() => setPreviewDoc(doc)}
                                            className="bg-[#effbf4] hover:bg-[#e4f7eb] text-[#0b744f] active:scale-[0.97] text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer border border-[#d2f3df]/30 shadow-sm"
                                        >
                                            View Document
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Secondary Close Button */}
                    <button
                        onClick={() => setShowDocsModal(false)}
                        className="w-full bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.98] text-white font-extrabold text-xs py-4 rounded-2xl transition-all mt-6 cursor-pointer shadow-md shadow-[#0b744f]/10"
                    >
                        BACK TO PROFILE
                    </button>
                </div>
            )}

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 text-black">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h4 className="text-sm font-black text-gray-900">
                                Document Preview
                            </h4>
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Certificate Frame */}
                        <div className="border-4 border-double border-[#0b744f]/30 bg-[#effbf4]/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
                            {/* Decorative seal watermark */}
                            <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                                <ShieldCheck size={120} className="text-[#0b744f]" />
                            </div>

                            <span className="text-[9px] font-extrabold text-[#0b744f] uppercase tracking-widest border border-[#0b744f]/30 px-2 py-0.5 rounded bg-white">
                                PULIH LEGALITY
                            </span>

                            <h3 className="text-sm font-black text-gray-800 mt-4 uppercase tracking-wide">
                                {previewDoc.name}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-semibold mt-1">
                                {previewDoc.fileName}
                            </p>

                            <div className="h-px bg-gray-200/50 w-24 my-3" />

                            <p className="text-[10px] text-gray-500 font-bold">Awarded To:</p>
                            <p className="text-xs font-black text-gray-800 mt-0.5">{profile.fullName}</p>

                            <div className="mt-5 flex items-center gap-1.5 bg-[#effbf4] text-[#0b744f] border border-[#d2f3df] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                <ShieldCheck size={12} strokeWidth={3} />
                                Verified
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setPreviewDoc(null)}
                            className="w-full bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.98] text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all cursor-pointer shadow-md shadow-[#0b744f]/10"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <BottomNavbar items={navItems} />
        </div>
    );
}
