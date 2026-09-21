'use client';

import React from 'react';
import { ShieldCheck, Car, Flame, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ProviderTermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-xs sm:text-sm text-gray-700 font-sans">
      <div className="bg-[#2A180B] text-white p-8 rounded-3xl shadow-xl border border-[#F58220]/30 space-y-3">
        <span className="text-xs text-[#F6C343] font-bold uppercase tracking-wider">SERVICE PARTNER COMPLIANCE & CODE OF CONDUCT</span>
        <h1 className="text-3xl font-serif font-bold text-white">Provider Terms & Code of Conduct</h1>
        <p className="text-xs text-[#F8F6EF]/80">
          Last Updated: September 2026 • GayaSeva Service Partner Guidelines
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">1. Driver & Transport Partner Compliance</h2>
          <p>
            All registered drivers offering Bike Taxis, Cabs (Dzire, Etios, Innova), E-Rickshaws, or Tempo Travellers must strictly adhere to the following operational standards:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Valid Documentation:</strong> Drivers must maintain an unexpired commercial Driving License, active Vehicle RC, valid motor insurance, and fitness certificates.</li>
            <li><strong>Fair Pricing Policy:</strong> Overcharging or demanding unagreed extra fares from pilgrims visiting Vishnupad Temple, Gaya Station, or Bodhgaya is strictly prohibited and results in immediate partner suspension.</li>
            <li><strong>Vehicle Cleanliness:</strong> Vehicles must be kept clean, well-maintained, and mechanically safe for Teerth Yatris.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">2. Teerth Panda & Vedic Pandit Conduct</h2>
          <p>
            Pandits providing Pinda Daan, Tripindi Shradh, and Vedic Karmakand rites must provide authentic guidance, maintain Vedic integrity, and ensure respectful behavior towards all yatri families regardless of background.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">3. Verification Badge & Profile Maintenance</h2>
          <p>
            The green <strong>Verified Partner Badge</strong> is granted after administrative review of uploaded identity documents. Partners are responsible for updating their profile details or vehicle categories as their service fleet evolves.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">4. Account Modification & Deletion Rights</h2>
          <p>
            Partners may edit their service details or request full profile deletion at any time via the <strong>Edit Details</strong> or <strong>Delete Account</strong> controls inside their partner dashboard.
          </p>
        </section>
      </div>
    </div>
  );
}
