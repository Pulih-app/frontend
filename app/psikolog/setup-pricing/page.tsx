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

    const updateVariant = (id: number, field: "price" | "duration", value: string) => {
        setVariants((prev) =>
            prev.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant))
        );
    };

    const addVariant = () => {
        setVariants((prev) => [...prev, { id: Date.now(), price: "", duration: "" }]);
    };

    const savePackage = () => {
        window.localStorage.setItem("psychologist-package", JSON.stringify(variants));
        router.push("/psikolog/home");
    };

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col border bg-white pb-8 text-black px-6">
            {/* Back button */}
            <button
                onClick={() => router.push("/psikolog/practice-schedule")}
                className="mt-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 active:text-gray-700 transition-colors w-fit cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {/* Page Heading */}
            <h1 className="mt-4 text-[2rem] font-extrabold text-gray-900 leading-tight">
                Set Up Pricing
            </h1>

            {/* Progress Step Dots */}
            <div className="flex items-center justify-center w-full max-w-[180px] mx-auto mb-8 mt-6 relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors bg-[#2e7d32] text-white">
                    1
                </div>
                <div className="flex-1 h-0.5 z-0 -mx-1 transition-colors bg-[#2e7d32]" />
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors bg-[#2e7d32] text-white">
                    2
                </div>
            </div>

            <section className="space-y-6">
                <div className="space-y-4">
                    {variants.map((variant, index) => (
                        <div key={variant.id} className="rounded-3xl bg-gray-50 border border-gray-200/50 p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800">Session Rate {variants.length > 1 ? index + 1 : ""}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Set your consultation rate per session.</p>
                            <input
                                type="number"
                                value={variant.price}
                                onChange={(event) => updateVariant(variant.id, "price", event.target.value)}
                                placeholder="Enter price (e.g., Rp 200.000)"
                                className="mt-3 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3.5 text-sm font-semibold outline-none focus:border-[#2e7d32] transition-colors shadow-inner"
                            />
                            <div className="mt-2 flex gap-2">
                                {["300000", "200000"].map((value) => (
                                    <button key={value} type="button" onClick={() => updateVariant(variant.id, "price", value)} className="rounded-full bg-[#2e7d32]/10 text-[#2e7d32] hover:bg-[#2e7d32]/25 active:bg-[#2e7d32]/25 px-3 py-1 text-[8px] font-bold">
                                        Rp {Number(value).toLocaleString("id-ID")}
                                    </button>
                                ))}
							</div>
                            <h2 className="mt-5 text-lg font-bold text-gray-800">Session Duration</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Set the time limit for each consultation session.</p>
                            <input
                                type="number"
                                value={variant.duration}
                                onChange={(event) => updateVariant(variant.id, "duration", event.target.value)}
                                placeholder="Select or type duration (e.g., 60 mins)"
                                className="mt-3 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3.5 text-sm font-semibold outline-none focus:border-[#2e7d32] transition-colors shadow-inner"
                            />
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
                    <button type="button" onClick={addVariant} className="rounded-full bg-[#2e7d32]/10 text-[#2e7d32] hover:bg-[#2e7d32]/20 px-4.5 py-1.5 text-[9px] font-extrabold transition-colors">
                        + Add Another Variant
                    </button>
                </div>
            </section>
            <div className="mt-auto grid grid-cols-2 gap-4 pt-8">
                <Button
                    type="button"
                    variant="custom"
                    onClick={() => router.back()}
                    className="rounded-2xl border-2 border-[#2e7d32] text-[#2e7d32] bg-white hover:bg-gray-50 active:bg-gray-100 py-4 font-bold shadow-sm text-center block w-full"
                >
                    Back
                </Button>
                <Button type="button" onClick={savePackage} className="rounded-2xl bg-[#2e7d32] text-white hover:bg-[#1b5e20] active:bg-[#1b5e20] py-4 font-bold shadow-md shadow-[#2e7d32]/20">
                    Continue
                </Button>
            </div>
        </main>
    );
}
