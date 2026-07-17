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
    const [profession, setProfession] = useState<"umum" | "klinis">("klinis");
    const [isMounted, setIsMounted] = useState(false);

    // Profile States
    const [avatar, setAvatar] = useState("/assets/profile.png");
    const [description, setDescription] = useState(
        "Penanganan kecemasan, pencegahan relapse, terapi kognitif perilaku (CBT), serta bimbingan emosional."
    );

    // Edit Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [tempAvatar, setTempAvatar] = useState("/assets/profile.png");
    const [tempDescription, setTempDescription] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Legal Docs States
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [legalDocs, setLegalDocs] = useState<LegalDoc[]>([]);
    const [previewDoc, setPreviewDoc] = useState<LegalDoc | null>(null);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            const savedProfession = window.localStorage.getItem("psychologist-profession");
            const activeProf = (savedProfession === "umum" || savedProfession === "klinis") ? savedProfession : "klinis";
            setProfession(activeProf);

            const savedAvatar = window.localStorage.getItem("psychologist-avatar");
            if (savedAvatar) {
                setAvatar(savedAvatar);
            }

            const savedDesc = window.localStorage.getItem("psychologist-description");
            if (savedDesc) {
                setDescription(savedDesc);
            }

            const savedDocs = window.localStorage.getItem(`psychologist-docs-${activeProf}`);
            if (savedDocs) {
                setLegalDocs(JSON.parse(savedDocs));
            } else {
                setLegalDocs(activeProf === "umum" ? defaultUmumDocs : defaultKlinisDocs);
            }
        }
    }, []);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("psychologist-profession");
        }
        router.push("/login/psikolog");
    };

    const handleEditProfileClick = () => {
        setTempAvatar(avatar);
        setTempDescription(description);
        setShowEditModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        setAvatar(tempAvatar);
        setDescription(tempDescription);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("psychologist-avatar", tempAvatar);
            window.localStorage.setItem("psychologist-description", tempDescription);
        }
        setShowEditModal(false);
        setToastMessage("Profil Anda berhasil diperbarui!");
        setTimeout(() => setToastMessage(null), 3000);
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
                                {isMounted ? (profession === "umum" ? "Psikolog Umum" : "Psikolog Klinis") : "Psikolog"}
                            </p>
                            <h2 className="text-white text-xl font-black mt-1">
                                Dr. Billy, M.Psi.
                            </h2>
                            <p className="text-[#effbf4]/75 text-[11px] font-semibold mt-0.5">
                                dr.billy@pulih.com
                            </p>
                        </div>
                    </div>

                    {/* White bottom info banner */}
                    <div className="bg-white px-6 py-4 border-t border-gray-50 text-left">
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">Spesialisasi & Bidang</p>
                        <p className="text-xs font-bold text-gray-800 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Manage ────────────────────────────────────────────────────────── */}
            <div className="px-6 mt-8 flex-1">
                <h2 className="text-xl font-black text-gray-900 mb-4 text-left">Kelola Akun</h2>
                <div className="space-y-4">
                    {/* Edit Profil */}
                    <button
                        onClick={handleEditProfileClick}
                        className="w-full flex items-center gap-4 bg-[#effbf4] hover:bg-[#e4f7eb] rounded-[22px] px-5 py-4 text-left active:scale-[0.98] transition-all cursor-pointer border border-[#d2f3df]/35"
                    >
                        <div className="p-3 bg-white rounded-2xl text-[#0b744f] shadow-sm shrink-0">
                            <Edit3 size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 leading-tight">Edit Profil</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-1">Ubah foto profil dan deskripsi spesialisasi Anda</p>
                        </div>
                    </button>

                    {/* Dokumen Legalitas */}
                    <button
                        onClick={handleDocsClick}
                        className="w-full flex items-center gap-4 bg-[#effbf4] hover:bg-[#e4f7eb] rounded-[22px] px-5 py-4 text-left active:scale-[0.98] transition-all cursor-pointer border border-[#d2f3df]/35"
                    >
                        <div className="p-3 bg-white rounded-2xl text-[#0b744f] shadow-sm shrink-0">
                            <ShieldCheck size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 leading-tight">Dokumen Legalitas</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-1">Lihat berkas legalitas STRPK, SIPPK, SIPP, STR, Ijazah Anda</p>
                        </div>
                    </button>

                    {/* Atur Jadwal Praktik */}
                    <button
                        onClick={() => router.push("/psikolog/practice-schedule")}
                        className="w-full flex items-center gap-4 bg-[#effbf4] hover:bg-[#e4f7eb] rounded-[22px] px-5 py-4 text-left active:scale-[0.98] transition-all cursor-pointer border border-[#d2f3df]/35"
                    >
                        <div className="p-3 bg-white rounded-2xl text-[#0b744f] shadow-sm shrink-0">
                            <Calendar size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 leading-tight">Atur Jadwal Praktik</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-1">Kelola hari & jam ketersediaan konseling Anda</p>
                        </div>
                    </button>

                    {/* Atur Tarif Konseling */}
                    <button
                        onClick={() => router.push("/psikolog/setup-pricing")}
                        className="w-full flex items-center gap-4 bg-[#effbf4] hover:bg-[#e4f7eb] rounded-[22px] px-5 py-4 text-left active:scale-[0.98] transition-all cursor-pointer border border-[#d2f3df]/35"
                    >
                        <div className="p-3 bg-white rounded-2xl text-[#0b744f] shadow-sm shrink-0">
                            <DollarSign size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 leading-tight">Atur Tarif Konseling</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-1">Sesuaikan harga layanan sesi konsultasi online</p>
                        </div>
                    </button>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100/70 active:scale-[0.98] text-red-600 rounded-[20px] px-4 py-4 mt-6 transition-all font-extrabold text-xs cursor-pointer shadow-sm shadow-red-100/50"
                >
                    <LogOut size={16} strokeWidth={2.5} />
                    KELUAR AKUN
                </button>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            <h3 className="text-base font-black text-gray-900 leading-tight">
                                Edit Profil Psikolog
                            </h3>
                            <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                                Perbarui data profil publik Anda
                            </p>
                        </div>
                        <div className="h-px bg-gray-100 w-full" />

                        {/* Avatar edit */}
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Foto Profil
                            </label>
                            <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex items-center justify-center bg-gray-50">
                                <Image
                                    src={tempAvatar}
                                    alt="Temporary Avatar"
                                    fill
                                    className="object-cover"
                                />
                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black text-white uppercase tracking-wider cursor-pointer">
                                    Ubah Foto
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Description edit */}
                        <div className="flex flex-col gap-1 text-left">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                                Spesialisasi & Bidang
                            </label>
                            <textarea
                                value={tempDescription}
                                onChange={(e) => setTempDescription(e.target.value)}
                                placeholder="Tuliskan spesialisasi dan bidang keahlian Anda..."
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
                                Batal
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="flex-1 bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.97] text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all cursor-pointer text-center shadow-md shadow-[#0b744f]/10"
                            >
                                Simpan
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
                            Dokumen Legalitas
                        </h3>
                        <button
                            onClick={() => setShowDocsModal(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 font-semibold text-left mt-4 leading-relaxed">
                        Berikut adalah dokumen legalitas praktik Anda yang telah diverifikasi oleh tim Pulih.
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
                                            Terverifikasi
                                        </span>
                                    </div>

                                    {/* Row 2: Divider and View Button */}
                                    <div className="relative z-10 border-t border-gray-100 pt-3 mt-1 flex justify-end">
                                        <button
                                            onClick={() => setPreviewDoc(doc)}
                                            className="bg-[#effbf4] hover:bg-[#e4f7eb] text-[#0b744f] active:scale-[0.97] text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer border border-[#d2f3df]/30 shadow-sm"
                                        >
                                            Lihat Dokumen
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
                        KEMBALI KE PROFIL
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
                                Pratinjau Dokumen
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
                                PULIH LEGALITAS
                            </span>

                            <h3 className="text-sm font-black text-gray-800 mt-4 uppercase tracking-wide">
                                {previewDoc.name}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-semibold mt-1">
                                {previewDoc.fileName}
                            </p>

                            <div className="h-px bg-gray-200/50 w-24 my-3" />

                            <p className="text-[10px] text-gray-500 font-bold">Diberikan Kepada:</p>
                            <p className="text-xs font-black text-gray-800 mt-0.5">Dr. Billy, M.Psi.</p>

                            <div className="mt-5 flex items-center gap-1.5 bg-[#effbf4] text-[#0b744f] border border-[#d2f3df] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                <ShieldCheck size={12} strokeWidth={3} />
                                Terverifikasi
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setPreviewDoc(null)}
                            className="w-full bg-[#0b744f] hover:bg-[#095f40] active:scale-[0.98] text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all cursor-pointer shadow-md shadow-[#0b744f]/10"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <BottomNavbar items={navItems} />
        </div>
    );
}
