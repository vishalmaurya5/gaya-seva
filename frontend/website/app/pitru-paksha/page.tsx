import React from 'react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo/metadata';
import { buildFAQSchema, buildPitruPakshaEventSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { 
  Calendar, 
  Flame, 
  Hotel, 
  Car, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Gaya Pitru Paksha 2026 Special Guide | Pind Daan Dates, Stay & Cabs',
  description: 'Official Pitru Paksha 2026 Gaya Ji guide. Complete fortnight dates, Falgu Devghat Pind Daan, verified Teerth Pandits, AC dharamshalas & 24/7 yatri helpline.',
  path: '/pitru-paksha',
  keywords: [
    'Pitru Paksha Gaya 2026',
    'Gaya Pitru Paksha dates',
    'Pitru Paksha Pind Daan Gaya',
    'Pitru Paksha Mela Gaya',
    'Gaya dharamshala Pitru Paksha',
    'Gaya taxi Pitru Paksha',
  ],
});

const PITRU_PAKSHA_FAQS = [
  {
    question: 'When is Pitru Paksha 2026 observed in Gaya Ji?',
    answer: 'Pitru Paksha 2026 in Gaya Ji commences on Anant Chaturdashi / Bhadrapada Purnima (September 25, 2026) and concludes on Sarvapitri Amavasya (October 10, 2026).',
  },
  {
    question: 'Should I book Pandits and Dharamshala accommodation in advance for Pitru Paksha?',
    answer: 'Yes! Over 10 to 15 lakh pilgrims visit Gaya Dham during Pitru Paksha. Advance booking for AC dharamshalas, family guest houses, and verified Pandits is highly recommended.',
  },
  {
    question: 'Does GayaSeva provide station pickup during Pitru Paksha peak rush?',
    answer: 'Yes, GayaSeva operates 24/7 guaranteed pick & drop taxi services from Gaya Junction Railway Station and Gaya Airport directly to Vishnupad zone.',
  },
];

export default function PitruPakshaPage() {
  const faqSchema = buildFAQSchema(PITRU_PAKSHA_FAQS);
  const eventSchema = buildPitruPakshaEventSchema();

  return (
    <>
      <JsonLd data={[faqSchema, eventSchema]} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900 antialiased">
        <Breadcrumbs items={[{ label: 'Pitru Paksha 2026 Guide', url: '/pitru-paksha' }]} />

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-10 rounded-3xl border-2 border-[#F58220]/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10">
            <span className="px-3 py-1 bg-[#F58220] text-white text-[10px] font-black uppercase tracking-wider rounded-full inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> PITRU PAKSHA 2026 SPECIAL PILGRIM PORTAL
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide leading-tight">
              Gaya Ji Pitru Paksha 2026 Guide (पितृपक्ष महासंगम)
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-bold max-w-2xl leading-relaxed">
              Complete guidance for 17-Day ancestral Pind Daan rituals, verified Teerth Purohits, emergency helpline (+91 8544491413), and stay accommodations.
            </p>
          </div>
          <GayaSevaLogo size={80} className="shrink-0 drop-shadow-xl z-10" />
        </div>

        {/* Essential Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/pind-daan" className="bg-amber-50 p-6 rounded-3xl border border-amber-300 hover:border-[#F58220] transition-all space-y-3 group shadow-sm">
            <Flame className="w-8 h-8 text-[#F58220] group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-lg text-slate-900">1. Pind Daan Pandit Booking</h3>
            <p className="text-xs text-slate-600 font-medium">Book verified Gayawal Teerth Pandits for Falgu Devghat &amp; Vishnupad rites.</p>
          </Link>

          <Link href="/stay" className="bg-blue-50 p-6 rounded-3xl border border-blue-300 hover:border-blue-500 transition-all space-y-3 group shadow-sm">
            <Hotel className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-lg text-slate-900">2. Pitru Paksha Stay &amp; Rooms</h3>
            <p className="text-xs text-slate-600 font-medium">Reserve AC family rooms, dormitories &amp; Dharamshalas near Vishnupad Temple.</p>
          </Link>

          <Link href="/gaya-taxi" className="bg-orange-50 p-6 rounded-3xl border border-orange-300 hover:border-[#F58220] transition-all space-y-3 group shadow-sm">
            <Car className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-lg text-slate-900">3. Express Station Taxi</h3>
            <p className="text-xs text-slate-600 font-medium">Guaranteed station &amp; airport pickup during high-density pilgrim rush.</p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-300 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-950">Pitru Paksha 2026 FAQs</h2>
          <div className="space-y-4">
            {PITRU_PAKSHA_FAQS.map((faq, idx) => (
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
