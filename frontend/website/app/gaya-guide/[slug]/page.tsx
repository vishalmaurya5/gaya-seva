'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, Navigation, Flame, Car, Hotel, Utensils, HelpCircle, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

export default function PlaceDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug || 'vishnupad';
  const placeName = slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A] pb-16">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white py-12 px-4 sm:px-6 shadow-xl border-b border-[#F58220]/30 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link href="/gaya-guide" className="text-xs font-extrabold text-[#F6C343] hover:underline flex items-center gap-1">
            ← Back to All Gaya Shrines
          </Link>

          <span className="px-3 py-1 bg-[#F58220]/20 text-[#F6C343] text-xs font-bold rounded-full border border-[#F58220]/40 uppercase tracking-widest inline-block">
            Gaya Teerth Heritage Site Guide
          </span>

          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-white tracking-tight leading-tight">
            {placeName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#F8F6EF]/90 pt-1">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#F58220]" /> Chandrachaud Line, Vishnupad Area, Gaya Ji</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> Open 5:00 AM - 9:00 PM Daily</span>
          </div>
        </div>
      </div>

      {/* Structured Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-md space-y-6">
          
          <div>
            <h2 className="text-xl font-sans font-extrabold text-[#0F172A] mb-2 tracking-tight">About {placeName}</h2>
            <p className="text-sm font-semibold text-[#1E293B] leading-relaxed">
              {placeName} is one of the most sacred pilgrimage destinations in Gaya Ji, Bihar. Thousands of teerth yatris visit daily to perform Pinda Daan rites for ancestral peace and liberation (Pitr Moksha).
            </p>
          </div>

          <div className="bg-[#F8F6EF] p-5 rounded-2xl border border-[#EBE6D6] space-y-2 text-xs sm:text-sm font-bold text-[#0F172A]">
            <h3 className="font-sans font-extrabold text-base text-[#0F172A] flex items-center gap-2 mb-1">
              <Navigation className="w-5 h-5 text-[#F58220]" /> How to Reach {placeName}
            </h3>
            <p>• <strong className="text-slate-900">From Gaya Railway Station:</strong> 4.0 km (15 mins via Pick & Drop Auto/Taxi)</p>
            <p>• <strong className="text-slate-900">From Bodh Gaya:</strong> 12 km via Main Teerth Bypass Road</p>
            <p>• <strong className="text-slate-900">From Gaya International Airport:</strong> 10 km via Airport Highway</p>
          </div>

          <div>
            <h3 className="font-sans font-extrabold text-lg text-[#0F172A] mb-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#F6C343]" /> Religious Significance & Pinda Daan Rituals
            </h3>
            <p className="text-sm font-semibold text-[#1E293B] leading-relaxed">
              Mentioned in ancient Puranas, offering Pinda Daan at {placeName} grants eternal salvation to ancestors up to seven generations. Gayatri Mantras and Vedic oblations performed here under Gayawal Teerth Purohits carry immortal spiritual merit.
            </p>
          </div>

          {/* Nearby Verified Services */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="font-sans font-extrabold text-lg text-[#0F172A]">Verified Services Nearby {placeName}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/pick-drop" className="p-4 bg-amber-50 hover:bg-amber-100 rounded-2xl text-center border border-amber-200 transition-all">
                <Car className="w-6 h-6 text-[#F58220] mx-auto mb-1.5" />
                <span className="text-xs font-extrabold text-[#0F172A] block">Taxi / Auto</span>
              </Link>
              <Link href="/pandit" className="p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl text-center border border-orange-200 transition-all">
                <Flame className="w-6 h-6 text-[#F6C343] mx-auto mb-1.5" />
                <span className="text-xs font-extrabold text-[#0F172A] block">Book Pandit</span>
              </Link>
              <Link href="/food" className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-2xl text-center border border-emerald-200 transition-all">
                <Utensils className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                <span className="text-xs font-extrabold text-[#0F172A] block">Satvik Food</span>
              </Link>
              <Link href="/stay" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl text-center border border-blue-200 transition-all">
                <Hotel className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                <span className="text-xs font-extrabold text-[#0F172A] block">Nearby Stay</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
