"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveOnboardingField } from "@/lib/onboardingStore";

export default function OnboardingPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  function handleContinue() {
    if (!nickname.trim()) return;
    saveOnboardingField({ nickname: nickname.trim() });
    router.push("/onboarding/learning-2");
  }

  return (
    <main className="flex flex-col min-h-screen bg-white px-6 max-w-sm mx-auto w-full border">
      {/* Mascot illustration */}
      <div className="flex items-center justify-center mt-32">
        <div className="relative w-56 h-56">
          <Image
            src="/assets/learning-1.png"
            alt="Maskot Pulih bertanya-tanya"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Text content */}
      <div
 className="text-center px-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-4">
          Why do I watch so much pornography?
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Let&apos;s learn together about the impact and how to overcome pornography addiction
        </p>
      </div>

      {/* Bottom Action */}
      <div className="mt-auto w-full pb-6 pt-4">
        <button
          onClick={() => router.push("/onboarding/learning-2")}
          className={`w-full font-bold text-lg rounded-2xl py-4 transition-colors shadow-sm bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white`}
        >
          Continue
        </button>
      </div>
    </main>
  );
}
