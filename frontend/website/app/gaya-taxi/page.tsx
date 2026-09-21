import React from 'react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo/metadata';
import { buildFAQSchema, buildServiceSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { 
  Car, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Sparkles,
  Luggage
} from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Gaya Taxi Service | Railway Station, Airport & Bodh Gaya Cabs',
  description: 'Book 24/7 verified Gaya taxi service. Station pickup, Gaya Airport cabs, Bodh Gaya, Rajgir, Nalanda outstation rides with 0% commission direct drivers.',
  path: '/gaya-taxi',
  keywords: [
    'Gaya taxi',
    'Gaya taxi service',
    'Gaya railway station taxi',
    'Gaya airport taxi',
    'Gaya to Bodh Gaya taxi',
    'Gaya cab booking',
    'Gaya to Rajgir taxi',
  ],
});

const TAXI_FAQS = [
  {
    question: 'How much does a taxi cost from Gaya Junction to Vishnupad Temple?',
    answer: 'E-rickshaws and auto fares range from ₹150 to ₹250, while AC Sedan cabs (Dzire/Etios) cost ₹250 to ₹350 for direct door-to-door transfer.',
  },
  {
    question: 'Can I book a full-day taxi for Bodh Gaya and Rajgir sightseeing?',
    answer: 'Yes! GayaSeva drivers provide full-day packages covering Bodh Gaya Mahabodhi, Rajgir Ropeway, Vulture Peak, and Nalanda University ruins.',
  },
  {
    question: 'Are night pickups available at Gaya Railway Station?',
    answer: 'Yes, verified GayaSeva cab drivers offer 24/7 night pickup from Gaya Junction (GAYA) Platform 1 exit with direct phone contact.',
  },
];

export default function GayaTaxiLandingPage() {
  const faqSchema = buildFAQSchema(TAXI_FAQS);
  const serviceSchema = buildServiceSchema({
    name: 'Gaya Local & Outstation Taxi Service',
    description: 'Verified pick and drop cabs, station transfers, Bodh Gaya tours, and family AC sedan/SUV rentals in Gaya Ji.',
    serviceType: 'Taxi Transport Service',
  });

  return (
    <>
      <JsonLd data={[faqSchema, serviceSchema]} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900 antialiased">
        <Breadcrumbs items={[{ label: 'Gaya Taxi Service', url: '/gaya-taxi' }]} />

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-10 rounded-3xl border-2 border-[#F58220]/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10">
            <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full inline-flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5" /> 24/7 VERIFIED TAXI &amp; CAB DIRECTORY
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide leading-tight">
              Gaya Taxi &amp; Cab Service (गया टैक्सी बुकिंग)
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-bold max-w-2xl leading-relaxed">
              Book verified local cabs, railway station pickup, Gaya Airport transfers, and outstation trips to Bodh Gaya, Rajgir, and Nalanda.
            </p>
          </div>
          <GayaSevaLogo size={80} className="shrink-0 drop-shadow-xl z-10" />
        </div>

        {/* Popular Taxi Routes Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-950 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#F58220]" /> Popular Gaya Cab Routes &amp; Fares
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900">Gaya Station &rarr; Vishnupad</h3>
              <p className="text-xs text-slate-600 font-medium">Fast 15-min direct transfer for arriving pilgrims.</p>
              <div className="text-sm font-black text-[#F58220]">₹250 - ₹350 (Sedan / Auto)</div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900">Gaya &rarr; Bodh Gaya (12 km)</h3>
              <p className="text-xs text-slate-600 font-medium">AC Dzire / Ertiga cab to Mahabodhi Temple.</p>
              <div className="text-sm font-black text-[#F58220]">₹500 - ₹800</div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900">Gaya &rarr; Rajgir / Nalanda</h3>
              <p className="text-xs text-slate-600 font-medium">Full day outstation tour (70 km).</p>
              <div className="text-sm font-black text-[#F58220]">₹2,500 - ₹3,500</div>
            </div>
          </div>
        </div>

        {/* Direct Action */}
        <div className="bg-gradient-to-r from-[#1C0D02] to-[#3D2310] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#F58220]/40">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Find Available Cabs &amp; Driver Contact Numbers</h2>
            <p className="text-xs font-bold text-amber-200 mt-1">Browse active driver listings with live online availability badges.</p>
          </div>
          <Link
            href="/pick-drop"
            className="px-6 py-3.5 bg-[#F58220] hover:bg-[#E07210] text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Search Cabs Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* FAQs */}
        <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-300 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-950">Gaya Taxi FAQs</h2>
          <div className="space-y-4">
            {TAXI_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
                <h3 className="font-extrabold text-base text-slate-900">Q: {faq.question}</h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
