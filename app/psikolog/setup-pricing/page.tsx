"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";

type PricingVariant = {
    id: number;
    price: string;
    duration: string;
};

export default function SetUpPricingPage() {
    const router = useRouter();
    const [variants, setVariants] = useState<PricingVariant[]>([
        { id: 1, price: "200000", duration: "60" },
    ]);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const updateVariant = (id: number, field: "price" | "duration", value: string) => {
        setVariants((prev) =>
            prev.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant))
        );
    };

    const addVariant = () => {
        setVariants((prev) => [...prev, { id: Date.now(), price: "", duration: "" }]);
    };

    const savePackage = async () => {
        setSaving(true);
        setErrorMessage(null);
        try {
            const token = localStorage.getItem("auth_token") ?? process.env.NEXT_PUBLIC_API_TOKEN ?? "";
            const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

            const savedConfig = localStorage.getItem("psychologist-schedule-config");
            const config = savedConfig ? JSON.parse(savedConfig) : null;

            const today = new Date().toISOString().split("T")[0];
            const dateStart = config?.dateStart ?? today;
            const dateEnd = config?.dateEnd ?? today;
            const dailyStartTime = config?.dailyStartTime ?? "09:00";
            const dailyEndTime = config?.dailyEndTime ?? "17:00";

            const packages = variants
                .filter((v) => v.price && v.duration)
                .map((v) => ({
                    durationMinutes: parseInt(v.duration, 10),
                    priceAmount: parseInt(v.price, 10),
                }));

            if (packages.length === 0) {
                setErrorMessage("Please add at least one pricing variant.");
                setSaving(false);
                return;
            }

            const res = await fetch(`${base}/api/v1/psychologists/me/availability-windows`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ dateStart, dateEnd, dailyStartTime, dailyEndTime, packages }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message ?? `Failed to create availability window (${res.status})`);

            window.localStorage.setItem("psychologist-package", JSON.stringify(variants));
            if (config?.selectedDays) {
                window.localStorage.setItem("psychologist-practice-days", JSON.stringify(config.selectedDays));
            }
            router.push("/psikolog/home");
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to save. Please try again.");
            setTimeout(() => setErrorMessage(null), 5000);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col border bg-white pb-8 text-black px-6">
            {errorMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-80 rounded-2xl bg-red-50 px-5 py-3.5 text-xs font-extrabold text-red-600 shadow-lg">
                    {errorMessage}
                </div>
            )}
            {/* Back button */}
            <button onClick={() => router.push("/psikolog/practice-schedule")} className="mt-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 active:text-gray-700 transition-colors w-fit cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <h1 className="mt-4 text-[2rem] font-extrabold text-gray-900 leading-tight">Set Up Pricing</h1>

            {/* Progress Step Dots */}
            <div className="flex items-center justify-center w-full max-w-[180px] mx-auto mb-8 mt-6 relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors bg-[#2e7d32] text-white">1</div>
                <div className="flex-1 h-0.5 z-0 -mx-1 transition-colors bg-[#2e7d32]" />
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors bg-[#2e7d32] text-white">2</div>
            </div>

            <section className="space-y-6">
                <div className="space-y-4">
                    {variants.map((variant, index) => (
                        <div key={variant.id} className="rounded-3xl bg-gray-50 border border-gray-200/50 p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800">Session Rate {variants.length > 1 ? index + 1 : ""}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Set your consultation rate per session.</p>
                            <input type="number" value={variant.price} onChange={(event) => updateVariant(variant.id, "price", event.target.value)} placeholder="Enter price (e.g., Rp 200.000)" className="mt-3 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3.5 text-sm font-semibold outline-none focus:border-[#2e7d32] transition-colors shadow-inner" />
                            <div className="mt-2 flex gap-2">
                                {["300000", "200000"].map((value) => (
                                    <button key={value} type="button" onClick={() => updateVariant(variant.id, "price", value)} className="rounded-full bg-[#2e7d32]/10 text-[#2e7d32] hover:bg-[#2e7d32]/25 active:bg-[#2e7d32]/25 px-3 py-1 text-[8px] font-bold">
                                        Rp {Number(value).toLocaleString("id-ID")}
                                    </button>
                                ))}
                            </div>
                            <h2 className="mt-5 text-lg font-bold text-gray-800">Session Duration</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Set the time limit for each consultation session.</p>
                            <input type="number" value={variant.duration} onChange={(event) => updateVariant(variant.id, "duration", event.target.value)} placeholder="Select or type duration (e.g., 60 mins)" className="mt-3 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3.5 text-sm font-semibold outline-none focus:border-[#2e7d32] transition-colors shadow-inner" />
                            <div className="mt-2 flex gap-2">
                                {["30", "60"].map((value) => (
                                    <button key={value} type="button" onClick={() => updateVariant(variant.id, "duration", value)} className="rounded-full bg-[#2e7d32]/10 text-[#2e7d32] hover:bg-[#2e7d32]/25 active:bg-[#2e7d32]/25 px-3 py-1 text-[8px] font-bold">
                                        {value === "60" ? "1 Hour" : "30 Mins"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center pt-2">
                    <p className="mb-2 text-[10px] font-semibold text-gray-400">Want to offer different rates or durations?</p>
                    <button type="button" onClick={addVariant} className="rounded-full bg-[#2e7d32]/10 text-[#2e7d32] hover:bg-[#2e7d32]/20 px-4.5 py-1.5 text-[9px] font-extrabold transition-colors">+ Add Another Variant</button>
                </div>
            </section>
            <div className="mt-auto grid grid-cols-2 gap-4 pt-8">
                <Button type="button" variant="custom" onClick={() => router.back()} className="rounded-2xl border-2 border-[#2e7d32] bg-white text-[#2e7d32] hover:bg-gray-50 active:bg-gray-100 py-4 font-bold shadow-sm">Back</Button>
                <Button type="button" onClick={savePackage} disabled={saving} className="rounded-2xl bg-[#2e7d32] text-white hover:bg-[#1b5e20] active:bg-[#1b5e20] py-4 font-bold shadow-md shadow-[#2e7d32]/20 disabled:opacity-60">{saving ? "Saving..." : "Continue"}</Button>
            </div>
        </main>
    );
}
