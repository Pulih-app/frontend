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
        <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col border bg-white pb-8 text-black">
            <header className="border-b border-gray-200 px-5 py-7 text-center">
                <h1 className="text-lg font-bold text-slate-900">Set Up Pricing</h1>
            </header>
            <section className="px-8 pt-6">
                <div className="mx-auto mb-10 flex w-40 items-center justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B5E4C] text-xs font-bold text-white">1</span>
                    <span className="h-0.5 flex-1 bg-[#1B5E4C]" />
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B5E4C] text-xs font-bold text-white">2</span>
                </div>
                <div className="space-y-4">
                    {variants.map((variant, index) => (
                        <div key={variant.id} className="rounded-3xl bg-[#f0f0f0] px-4 py-6">
                            <h2 className="text-xl font-bold">Session Rate {variants.length > 1 ? index + 1 : ""}</h2>
                            <p className="text-sm text-gray-400">Set your consultation rate per session.</p>
                            <input
                                type="number"
                                value={variant.price}
                                onChange={(event) => updateVariant(variant.id, "price", event.target.value)}
                                placeholder="Enter price (e.g., Rp 200.000)"
                                className="mt-3 w-full rounded-2xl border border-[#1B5E4C] bg-white px-4 py-3 text-sm outline-none"
                            />
                            <div className="mt-2 flex gap-2">
                                {["300000", "200000"].map((value) => (
                                    <button key={value} type="button" onClick={() => updateVariant(variant.id, "price", value)} className="rounded-full bg-[#1B5E4C] px-3 py-1 text-[8px] font-bold text-white">
                                        Rp {Number(value).toLocaleString("id-ID")}
                                    </button>
                                ))}
							</div>
                            <h2 className="mt-3 text-xl font-bold">Session Duration</h2>
                            <p className="text-sm text-gray-400">Set the time limit for each consultation session.</p>
                            <input
                                type="number"
                                value={variant.duration}
                                onChange={(event) => updateVariant(variant.id, "duration", event.target.value)}
                                placeholder="Select or type duration (e.g., 60 mins)"
                                className="mt-3 w-full rounded-2xl border border-[#1B5E4C] bg-white px-4 py-3 text-sm outline-none"
                            />
                            <div className="mt-2 flex gap-2">
                                {["30", "60"].map((value) => (
                                    <button key={value} type="button" onClick={() => updateVariant(variant.id, "duration", value)} className="rounded-full bg-[#1B5E4C] px-3 py-1 text-[8px] font-bold text-white">
                                        {value === "60" ? "1 Jam" : "30 Menit"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-14 text-center">
                    <p className="mb-2 text-[10px]">Want to offer different rates or durations?</p>
                    <button type="button" onClick={addVariant} className="rounded-full bg-[#1B5E4C] px-3 py-1 text-[8px] font-bold text-white">
                        + Add Another Variant
                    </button>
                </div>
            </section>
            <div className="mt-auto grid grid-cols-2 gap-8 px-6 pt-10">
                <Button type="button" onClick={() => router.back()} className="rounded-2xl bg-[#1B5E4C] py-4 shadow-md shadow-green-900/30 hover:bg-[#164d3f] active:bg-[#164d3f]">
                    Back
                </Button>
                <Button type="button" onClick={savePackage} className="rounded-2xl bg-[#1B5E4C] py-4 shadow-md shadow-green-900/30 hover:bg-[#164d3f] active:bg-[#164d3f]">
                    Continue
                </Button>
            </div>
        </main>
    );
}
