'use client';

import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, MapPin } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-xs sm:text-sm text-gray-700 font-sans">
      <div className="bg-[#2A180B] text-white p-8 rounded-3xl shadow-xl border border-[#F58220]/30 space-y-3">
        <span className="text-xs text-[#F6C343] font-bold uppercase tracking-wider">PRIVACY & DATA PROTECTION POLICY</span>
        <h1 className="text-3xl font-serif font-bold text-white">GayaSeva Privacy Policy</h1>
        <p className="text-xs text-[#F8F6EF]/80">
          Last Updated: September 2026 • Encrypted Storage &amp; Privacy Shield
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">1. Personal Data Collected</h2>
          <p>
            GayaSeva is committed to protecting the privacy of Teerth Yatris and local service partners. We collect minimum essential data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Yatri Pilgrims:</strong> Name, mobile phone number, optional email address, and home city.</li>
            <li><strong>Service Partners &amp; Drivers:</strong> Full legal name, business title, contact number, operating zone/station, vehicle category (Bike, Sedan, SUV, Auto, Tempo, Custom), profile photo, and government ID/Driving License document.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">2. Live Vehicle & GPS Location Privacy</h2>
          <p>
            Live GPS coordinates are processed strictly when active Pick &amp; Drop tracking is initiated by the user. Geolocation data is used solely to render real-time map navigation during an active ride session and is automatically pruned after 30 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">3. Verification Document Security</h2>
          <p>
            Uploaded verification documents (Aadhaar cards, Driving Licenses, vehicle permits) are uploaded to encrypted cloud storage with restricted administrative access. Documents are inspected solely to verify credentials and issue the green Verified Partner badge.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#4A2E1A] border-b pb-2">4. User Control & Right to Deletion</h2>
          <p>
            Every user and registered provider has complete ownership of their data. You can update your profile details or execute permanent account deletion at any time via your dashboard <strong>Edit Details</strong> or <strong>Delete Account</strong> actions.
          </p>
        </section>
      </div>
    </div>
  );
}
