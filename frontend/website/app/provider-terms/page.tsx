'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Car, Flame, CheckCircle2, AlertTriangle, Scale, Lock, Mail, Phone, MapPin, UserCheck, FileCheck } from 'lucide-react';

export default function ProviderTermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-xs sm:text-sm text-gray-800 font-sans">
      {/* Header Banner */}
      <div className="bg-[#2A180B] text-white p-8 rounded-3xl shadow-xl border border-[#F58220]/30 space-y-3">
        <div className="flex items-center gap-2 text-[#F6C343] font-semibold text-xs uppercase tracking-wider">
          <FileCheck className="w-4 h-4 text-[#F58220]" />
          <span>SERVICE PARTNER COMPLIANCE &amp; VERIFICATION TERMS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Gaya Seva — Provider Terms &amp; Code of Conduct</h1>
        <p className="text-xs text-[#F8F6EF]/80">
          Last Updated: 23 September 2026 • Provider Verification, Anti-Fraud &amp; Statutory Compliance
        </p>
      </div>

      {/* Notice Box */}
      <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-5 space-y-2 text-amber-950">
        <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Service Partner Mandatory Undertaking</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-900">
          By registering as a Service Partner (including Vedic Pandits, Tirth Pandas, Taxi/Bike/E-Rickshaw Drivers, Hotel/Dharamshala Owners, Tour Guides, and Local Business Owners) on Gaya Seva, you agree to comply with these Provider Terms, our platform Terms &amp; Conditions, Privacy Policy, and applicable Indian laws.
        </p>
      </div>

      {/* Body Content */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            1. Registration &amp; Verification Obligations
          </h2>
          <p>
            Service providers may independently register and create profiles on Gaya Seva. Providers must provide accurate, current, and truthful business information.
          </p>
          <div className="bg-orange-50/60 p-4 rounded-xl border border-orange-200 space-y-2 text-xs">
            <h4 className="font-bold text-[#4A2E1A]">Mandatory Verification Controls:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Submit valid government identity proof (Aadhaar, PAN, or Driving License) for identity confirmation.</li>
              <li>Provide active contact numbers and commercial operating addresses in Gaya or surrounding Teerth regions.</li>
              <li>Maintain unexpired statutory licenses (e.g., Commercial Driving License &amp; RC for drivers, FSSAI for restaurants, Municipal Trade Licenses where applicable).</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            2. Verified Partner Badge Policy (&quot;Gaya Seva Verified&quot;)
          </h2>
          <p>
            The green <span className="font-semibold text-emerald-700">&quot;Gaya Seva Verified&quot;</span> badge indicates that Gaya Seva has verified submitted identity/document credentials at the time of administrative review.
          </p>
          <p className="text-xs text-gray-600">
            Verification does not guarantee future conduct, ritual outcomes, or commercial service quality. Verification status may be suspended or revoked immediately if information becomes inaccurate or if pilgrim complaints occur.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            3. Prohibited Conduct &amp; Anti-Fraud Policy
          </h2>
          <p className="font-semibold text-red-900">Service Partners MUST NOT:</p>
          <div className="bg-red-50/70 p-4 rounded-xl border border-red-200 text-xs text-red-950 space-y-1.5">
            <p>• Create fake business profiles, impersonate other Pandits/drivers, or use another person&apos;s phone number without written authorization.</p>
            <p>• Demand unauthorized extra charges, overcharge pilgrims visiting Vishnupad Temple/Bodhgaya, or misrepresent service fares/ritual Dakshina.</p>
            <p>• Publish false reviews, manipulate rating systems, or intimidate pilgrims for positive feedback.</p>
            <p>• Offer illegal services, unauthorized guide tours, or operate uninspected/uninsured commercial vehicles.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            4. Constitutional Freedom of Trade &amp; Responsibility (Art. 19(1)(g))
          </h2>
          <p>
            Gaya Seva provides an open directory platform respecting the constitutional right to practice any lawful profession, trade or business under Article 19(1)(g) of the Constitution of India.
          </p>
          <p className="text-xs text-gray-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
            Service providers remain independently responsible for obtaining and maintaining any licence, registration, qualification, permit, insurance or approval required for their profession or business. Registration on Gaya Seva does not constitute a government licence or legal authorization to operate.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            5. IT Rules Intermediary Compliance &amp; Content Removal
          </h2>
          <p>
            In accordance with Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, Gaya Seva reserves the right to disable access, modify, or permanently remove any listing, review, or profile that violates Indian law, infringes IP rights, or receives valid government/court takedown notices.
          </p>
        </section>

        {/* Section 6 */}
        <section className="bg-[#2A180B] text-white p-6 rounded-2xl border border-[#F58220]/40 space-y-3">
          <div className="flex items-center gap-2 text-[#F6C343] font-serif font-bold text-base">
            <Mail className="w-5 h-5 text-[#F58220]" />
            <span>6. Partner Support &amp; Verification Desk</span>
          </div>
          <p className="text-xs text-[#F8F6EF]/90">
            For profile updates, credential submissions, badge inquiries, or account management:
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div><span className="text-[#F6C343] font-bold">Email:</span> <a href="mailto:support@gayaseva.org" className="underline text-white">support@gayaseva.org</a></div>
            <div><span className="text-[#F6C343] font-bold">Phone:</span> <a href="tel:+918544491413" className="text-white">+91 85444 91413</a></div>
            <div><span className="text-[#F6C343] font-bold">Office:</span> <span className="text-white/80">Vishnupad Temple Corridor Zone, Gaya, Bihar - 823001</span></div>
          </div>
        </section>

      </div>
    </div>
  );
}

