'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Car, Flame, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-xs sm:text-sm text-gray-700 font-sans">
      <div className="bg-[#2A180B] text-white p-8 rounded-3xl shadow-xl border border-[#F58220]/30 space-y-3">
        <span className="text-xs text-[#F6C343] font-bold uppercase tracking-wider">LEGAL AGREEMENT & DIRECTORY POLICY</span>
        <h1 className="text-3xl font-serif font-bold text-white">GayaSeva Terms of Service</h1>
        <p className="text-xs text-[#F8F6EF]/80">
          Last Updated: September 2026 • GayaSeva Digital Platform &amp; Teerth Yatri Service Directory
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">1. Nature of Platform & Zero Commission Policy</h2>
          <p>
            GayaSeva operates as an open local service directory connecting Teerth Yatris (pilgrims) directly with background-verified local service partners in Gaya Ji (including Tirth Pandas, Vedic Pandits, Taxi &amp; Bike Drivers, E-Rickshaw owners, Hotels, and Guest Houses).
          </p>
          <p className="font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            ✓ 0% Platform Commission: GayaSeva charges zero commission from service partners and zero hidden fees from pilgrims. All service fares and ritual Dakshina are negotiated and paid directly between the user and the service provider.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">2. Vehicle, Taxi & Driver Operations Terms</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Vehicle Categories:</strong> Drivers registered on GayaSeva may offer services using <strong>Bike / Two-Wheeler Taxis, AC Sedans, Innova/SUVs, E-Rickshaw Auto Pickups, Tempo Travellers, or Custom Vehicles</strong>.
            </li>
            <li>
              <strong>Mandatory Compliance:</strong> Drivers must hold a valid commercial Driving License, active vehicle registration certificate (RC), valid insurance coverage, and pollution certificate as required under Indian Motor Vehicles Law.
            </li>
            <li>
              <strong>Safety & Passenger Care:</strong> Drivers are strictly required to adhere to traffic safety standards, maintain clean and sanitized vehicles, and refrain from overcharging beyond mutually agreed rates.
            </li>
            <li>
              <strong>Direct Communication:</strong> Ride bookings and pick &amp; drop arrangements are coordinated directly via phone or WhatsApp. GayaSeva is not liable for personal lost property inside vehicles, though our support helpline assists in recovery efforts.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">3. Pandit & Ritual Verification Disclaimer</h2>
          <p>
            Purohit and Pandit Ji profiles display verified credentials uploaded by partners. GayaSeva ensures identity verification via Aadhaar/Govt ID verification, but ritual procedures (Pinda Daan, Tripindi Shradh, Tarpan) are executed according to Vedic traditions agreed upon with the family Panda.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">4. User Account Responsibility & Deletion</h2>
          <p>
            Users and Partners are responsible for maintaining the accuracy of their account details. Both Yatris and Partners retain the right to edit their profile details or delete their account permanently at any time directly through their user dashboard.
          </p>
        </section>
      </div>
    </div>
  );
}
