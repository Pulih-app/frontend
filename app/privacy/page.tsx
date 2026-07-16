"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white max-w-sm mx-auto w-full border relative">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-6 pt-12 pb-4 border-b border-gray-100 flex items-center">
        <Link href="/" className="mr-4 text-gray-400 hover:text-gray-900 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
      </div>

      <div className="px-6 py-8 flex-1">
        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Informed Consent</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Please read this document carefully before creating an account or using Pulih.
          </p>
        </div>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          
          <section>
            <h3 className="text-gray-900 font-bold mb-3 flex items-center text-base">
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs mr-3 text-gray-600 font-bold">1</span>
              Purpose of This App
            </h3>
            <p className="pl-10">
              Pulih is a self-guided digital tool designed to help you track your recovery progress and build healthier habits related to reducing pornography use. It offers a private, supportive space that includes progress tracking, educational content, and an in-app crisis-support feature intended to help you get through moments of urge or distress.
            </p>
          </section>

          <section>
            <h3 className="text-gray-900 font-bold mb-3 flex items-center text-base">
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs mr-3 text-gray-600 font-bold">2</span>
              Not a Medical Service
            </h3>
            <p className="pl-10 mb-4">
              Pulih is a self-help and habit-tracking tool. It is not a licensed medical, psychological, or addiction-treatment service, and using it does not create a therapist-client, doctor-patient, or counseling relationship.
            </p>
            <div className="ml-10 bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <h4 className="text-orange-700 font-bold text-sm uppercase tracking-wider">Crisis Limitations</h4>
              </div>
              <p className="text-orange-800/80 text-xs leading-relaxed">
                If you are in immediate danger, thinking about suicide, or experiencing a medical emergency, do not rely on this app. Call your local emergency number (e.g., 911), or contact a crisis line available 24/7. Response times for in-app support are not guaranteed.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-gray-900 font-bold mb-3 flex items-center text-base">
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs mr-3 text-gray-600 font-bold">3</span>
              Connecting With a Licensed Psychologist
            </h3>
            <p className="pl-10 mb-3">
              Pulih offers an optional feature that allows you to connect with a licensed psychologist or other licensed mental health professional ("Provider") through the app. Please review the following before using this feature:
            </p>
            <ul className="list-disc pl-14 space-y-2 text-gray-500 mb-4">
              <li><strong className="text-gray-700">Separate professional relationship:</strong> Once you connect with a Provider, a genuine therapist-client relationship is formed between you and that Provider — not between you and Pulih. The Provider, not Pulih, is responsible for the care they provide.</li>
              <li><strong className="text-gray-700">Pulih's role:</strong> Pulih's role is limited to facilitating the connection and is not itself practicing medicine or psychology.</li>
              <li><strong className="text-gray-700">Provider credentials:</strong> Providers made available through Pulih are represented to hold applicable licenses in good standing. You are encouraged to independently verify a Provider's license.</li>
              <li><strong className="text-gray-700">Telehealth considerations:</strong> Sessions may be delivered remotely. Telehealth may not be appropriate for all situations and may be subject to specific laws depending on locations.</li>
              <li><strong className="text-gray-700">Separate consent:</strong> Your Provider may ask you to complete additional consent, intake forms, or disclosures. This document does not replace that consent.</li>
              <li><strong className="text-gray-700">Fees and insurance:</strong> Any fees, billing, or insurance handling for Provider services will be disclosed separately.</li>
              <li><strong className="text-gray-700">Confidentiality and its limits:</strong> Communications with your Provider are generally confidential, subject to the legal and ethical limits that apply (e.g., mandatory reporting).</li>
            </ul>
            <p className="pl-10 mb-4">
              Using this feature is optional. You may continue using Pulih's self-tracking and crisis-support tools without ever connecting with a Provider, and you may stop working with a Provider at any time.
            </p>
          </section>

          <section>
            <h3 className="text-gray-900 font-bold mb-3 flex items-center text-base">
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs mr-3 text-gray-600 font-bold">4</span>
              Voluntary Participation
            </h3>
            <p className="pl-10">
              Your use of Pulih is entirely voluntary. You may pause, stop, or delete your account and data at any time. You are free to decide how much information you share, and you are not obligated to disclose anything you are not comfortable sharing.
            </p>
          </section>

          <section>
            <h3 className="text-gray-900 font-bold mb-3 flex items-center text-base">
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs mr-3 text-gray-600 font-bold">5</span>
              Potential Risks & Benefits
            </h3>
            <p className="pl-10 mb-3">
              Potential benefits include increased self-awareness, structure, and support in reducing unwanted behavior. Potential risks may include:
            </p>
            <ul className="list-disc pl-14 space-y-2 text-gray-500">
              <li>Discomfort that can arise from reflecting on personal habits, urges, or setbacks.</li>
              <li>The possibility that self-tracking alone may not be sufficient for your needs.</li>
              <li>The general risks of storing personal, sensitive information digitally.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-gray-900 font-bold mb-3 flex items-center text-base">
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs mr-3 text-gray-600 font-bold">6</span>
              Privacy and Data Use
            </h3>
            <p className="pl-10 mb-3">
              Pulih collects information you provide in order to operate the app's core features. We treat this information as sensitive and:
            </p>
            <ul className="list-disc pl-14 space-y-2 text-gray-500">
              <li>Store it using reasonable administrative, technical, and physical safeguards.</li>
              <li>Do not sell your personal data to third parties.</li>
              <li>Only share data as necessary to operate the service or as required by law.</li>
              <li>Allow you to request access to, correction of, or deletion of your data.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-gray-900 font-bold mb-3 flex items-center text-base">
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs mr-3 text-gray-600 font-bold">7</span>
              Your Right to Withdraw
            </h3>
            <p className="pl-10">
              You may withdraw your consent and discontinue use of Pulih at any time. You can delete your account and associated data through the app's settings or by contacting our support team.
            </p>
          </section>
        </div>
      </div>
      
      {/* Bottom Action */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 z-10">
        <Link href="/">
          <button className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#1b5e20] text-white font-bold text-lg rounded-2xl py-4 transition-colors shadow-sm">
            Understand
          </button>
        </Link>
      </div>

    </main>
  );
}
