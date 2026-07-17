"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, Plus, Trash2, User, Calendar, MapPin, Camera } from "lucide-react";
import { TextField } from "@/components/TextField";
import Button from "@/components/Button";

export default function PsychologistOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (step === 1 && typeof window !== "undefined") {
      window.localStorage.removeItem("psychologist-practice-days");
      window.localStorage.removeItem("psychologist-profession");
      window.localStorage.removeItem("psychologist-name");
      window.localStorage.removeItem("psychologist-dob");
      window.localStorage.removeItem("psychologist-address");
      window.localStorage.removeItem("psychologist-avatar");
      window.localStorage.removeItem("psychologist-description");
      window.localStorage.removeItem("psychologist-package");
    }
  }, []);

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        router.push("/psikolog/home");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, router]);
  const [profession, setProfession] = useState<"umum" | "klinis" | "">("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});
  const [locations, setLocations] = useState<string[]>([""]);

  // Profile fields state
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const reqDocs =
    profession === "klinis"
      ? ["STRPK", "SIPPK", "IJAZAH", "STR", "SIPP"]
      : ["SIPP", "IJAZAH", "STR"];

  const addLocation = () => {
    if (locations.length < 3) {
      setLocations([...locations, ""]);
    }
  };

  const updateLocation = (index: number, val: string) => {
    const next = [...locations];
    next[index] = val;
    setLocations(next);
  };

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const isStep1Valid =
    name.trim() !== "" &&
    dob.trim() !== "" &&
    address.trim() !== "" &&
    photo !== null &&
    profession !== "";

  const isStep2Valid = () => {
    const allDocsUploaded = reqDocs.every((doc) => !!uploadedFiles[doc]);
    if (!allDocsUploaded) return false;

    if (profession === "klinis") {
      return locations.length > 0 && locations.every((loc) => loc.trim() !== "");
    }
    return true;
  };

  return (
    <main className="flex flex-col min-h-screen bg-white px-6 pt-12 pb-6 max-w-sm mx-auto w-full border relative">
      {/* Progress Indicator (only shown for step 1 and 2) */}
      {step < 3 && (
        <div className="flex items-center justify-center w-full max-w-[180px] mx-auto mb-8 relative">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors ${step >= 1 ? "bg-[#2e7d32] text-white" : "bg-gray-200 text-gray-500"
              }`}
          >
            1
          </div>
          <div
            className={`flex-1 h-0.5 z-0 -mx-1 transition-colors ${step >= 2 ? "bg-[#2e7d32]" : "bg-gray-200"
              }`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors ${step >= 2 ? "bg-[#2e7d32] text-white" : "bg-gray-200 text-gray-500"
              }`}
          >
            2
          </div>
        </div>
      )}

      {/* Step 1: Complete Profile & Select Profession */}
      {step === 1 && (
        <div className="flex flex-col flex-1">
          <div className="w-36 h-36 relative mx-auto mb-6">
            <Image
              src="/assets/psikolog/onboarding-1.png"
              alt="Mascot Stethoscope"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-center text-gray-500 text-xs leading-relaxed mb-6 px-4">
            Enter your personal details and choose your primary license type so we can verify your practice and customize your practitioner dashboard.
          </p>

          <div className="space-y-4 mb-4">
            <TextField
              icon={User}
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              icon={Calendar}
              type="date"
              placeholder="Tanggal Lahir"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="text-gray-700 placeholder-gray-400"
            />

            <TextField
              icon={MapPin}
              type="text"
              placeholder="Alamat Lengkap"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="relative z-90">
              <TextField
                icon={Camera}
                type="text"
                placeholder={photo ? `Foto: ${photo.name}` : "Upload Foto Profil"}
                readOnly
                onClick={() => document.getElementById("photo-upload")?.click()}
                className="cursor-pointer"
              />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPhoto(file);
                }}
              />
            </div>

            <div className="relative z-50">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-gray-100 rounded-2xl py-4 px-6 text-gray-700 text-sm outline-none border-2 transition-all flex justify-between items-center ${profession ? "border-[#2e7d32]" : "border-transparent"
                  }`}
              >
                <span className={profession ? "text-gray-900 font-medium" : "text-gray-400"}>
                  {profession === "umum"
                    ? "General Psychologist"
                    : profession === "klinis"
                      ? "Clinical Psychologist"
                      : "Select your profession..."}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setProfession("umum");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                  >
                    General Psychologist
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfession("klinis");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                  >
                    Clinical Psychologist
                  </button>
                </div>
              )}
            </div>

            {/* Selected Profession Explanation */}
            {profession && (
              <div className="bg-[#2e7d32]/5 border border-[#2e7d32]/20 rounded-2xl p-4 mt-2 text-xs text-gray-600 leading-relaxed transition-all">
                <strong className="text-[#2e7d32] font-semibold block mb-1">
                  {profession === "umum" ? "General Psychologist" : "Clinical Psychologist"}
                </strong>
                {profession === "umum"
                  ? "General psychology is a basic science that studies human behavior, thought processes, and development in general without focusing on disease treatment."
                  : "Conducting psychological assessments and providing psychotherapy (talk therapy or behavior modification) to treat patients."}
              </div>
            )}
          </div>

          <div className="mt-auto pt-6">
            <Button
              type="button"
              disabled={!isStep1Valid}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.localStorage.setItem("psychologist-profession", profession);
                  window.localStorage.setItem("psychologist-name", name);
                }
                setStep(2);
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Upload Documents and Locations */}
      {step === 2 && (
        <div className="flex flex-col flex-1">
          <div className="w-32 h-32 relative mx-auto mb-6">
            <Image
              src="/assets/psikolog/onboarding-2.png"
              alt="Mascot Clipboard"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            Submit Your Professional Credentials
          </h2>
          <p className="text-center text-gray-500 text-xs leading-relaxed mb-6 px-4">
            Please upload your valid practice licenses and certificates. Your data will be kept secure and used strictly for professional verification.
          </p>

          {/* Documents Upload Section */}
          <div className="space-y-3 mb-6">
            {reqDocs.map((doc) => {
              const isUploaded = !!uploadedFiles[doc];
              return (
                <label
                  key={doc}
                  className={`w-full bg-gray-100 rounded-2xl py-4 px-6 text-sm border transition-all flex items-center justify-between cursor-pointer ${isUploaded
                      ? "border-[#2e7d32] bg-[#2e7d32]/5 text-[#2e7d32] font-semibold"
                      : "border-[#2e7d32]/30 text-gray-700 hover:bg-gray-200/50"
                    }`}
                >
                  <span>{isUploaded ? `✓ ${doc} Uploaded` : `Upload ${doc}`}</span>
                  <Upload size={16} className={isUploaded ? "text-[#2e7d32]" : "text-gray-400"} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setUploadedFiles((prev) => ({ ...prev, [doc]: file }));
                    }}
                  />
                </label>
              );
            })}
          </div>

          <div className="flex gap-3 mt-auto pt-6">
            <Button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 !bg-white border border-[#2e7d32] hover:!bg-gray-50 active:!bg-gray-100 !text-[#2e7d32] !font-bold flex items-center justify-center"
            >
              Back
            </Button>
            <Button
              type="button"
              disabled={!isStep2Valid()}
              onClick={() => setStep(3)}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Verification Waiting Page */}
      {step === 3 && (
        <div className="flex flex-col flex-1 justify-center py-8">
          <div className="w-40 h-40 relative mx-auto mb-6">
            <Image
              src="/assets/psikolog/psikolog-waiting.png"
              alt="Mascot Praying"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            Verification in Progress
          </h2>
          <p className="text-center text-gray-500 text-xs leading-relaxed mb-12 px-4">
            Your registration details and documents have been successfully received. We are verifying your credentials to ensure community safety.
          </p>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-[#2e7d32] font-bold text-sm hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
