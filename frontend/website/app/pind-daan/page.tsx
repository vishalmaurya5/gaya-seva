import React from 'react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo/metadata';
import { buildFAQSchema, buildServiceSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Clock, 
  MessageCircle, 
  ArrowRight,
  BookOpen,
  Award,
  Users
} from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Gaya Pind Daan Booking | Verified Teerth Pandits & 48-Vedi Shradh',
  description: 'Book authentic Gaya Pind Daan & Tripindi Shradh rituals with 100% background-verified Gayawal Teerth Pandits at Vishnupad Temple & Falgu Devghat.',
  path: '/pind-daan',
  keywords: [
    'Gaya Pind Daan',
    'Pind Daan in Gaya',
    'Pind Daan Gaya booking',
    'Gaya Pandit booking',
    'Pind Daan Pandit Gaya',
    '48 Vedi Pind Daan Gaya',
    'Tripindi Shradh Gaya',
    'Falgu River Pind Daan',
  ],
});

const PIND_DAAN_FAQS = [
  {
    question: 'What is the significance of performing Pind Daan in Gaya Ji?',
    answer: 'In Hindu tradition, Gaya Dham is designated as the Brahma-Kapala mukti kshetra. Performing Pind Daan here relieves deceased ancestors (Pitrus) from karmic cycles and grants them supreme liberation (Moksha).',
  },
  {
    question: 'What are the main Vedi locations for Pind Daan in Gaya?',
    answer: 'While full ritual covers 48 Vedis, the 3 most essential Vedis (Ek-Nirdishi Pind Daan) are Falgu River Devghat, Vishnupad Temple Footprint, and the immortal Akshayavat Banyan Tree.',
  },
  {
    question: 'How do I book a verified Teerth Pandit through GayaSeva?',
    answer: 'You can directly view verified Gayawal Teerth Pandits on GayaSeva, check their languages, experience, and ratings, and connect via direct Call or WhatsApp with 0% platform commission fees.',
  },
  {
    question: 'What items are required for Pind Daan puja samagri?',
    answer: 'Essential samagri includes rice flour or barley flour (sattu), sesame seeds (til), kusha grass, honey, milk, ghee, flowers, sacred thread (janeo), and earthen pots.',
  },
];

export default function PindDaanPage() {
  const faqSchema = buildFAQSchema(PIND_DAAN_FAQS);
  const serviceSchema = buildServiceSchema({
    name: 'Gaya Pind Daan & Shradh Ritual Booking',
    description: 'Authentic Pind Daan, Tripindi Shradh & Narayan Bali rites conducted by verified Gayawal Teerth Pandits at Vishnupad Temple and Falgu Devghat.',
    serviceType: 'Religious Pilgrimage Service',
  });

  return (
    <>
      <JsonLd data={[faqSchema, serviceSchema]} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900 antialiased">
        <Breadcrumbs items={[{ label: 'Pind Daan Gaya Guide', url: '/pind-daan' }]} />

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-10 rounded-3xl border-2 border-[#F58220]/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10">
            <span className="px-3 py-1 bg-[#F58220] text-white text-[10px] font-black uppercase tracking-wider rounded-full inline-flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> OFFICIAL PIND DAAN GUIDE &amp; PANDIT BOOKING
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide leading-tight">
              Gaya Pind Daan Booking &amp; Guide (गया पिंडदान सेवा)
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-bold max-w-2xl leading-relaxed">
              Connect directly with verified Gaya Teerth Pandits for authentic Pind Daan, Tripindi Shradh, and 48-Vedi ancestral salvation rites.
            </p>
          </div>
          <GayaSevaLogo size={80} className="shrink-0 drop-shadow-xl z-10" />
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h3 className="font-extrabold text-lg text-slate-900">Verified Gayawal Pandits</h3>
            <p className="text-xs text-slate-600 font-medium">Background-checked Teerth Purohits with decades of Vedic ritual experience.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Award className="w-8 h-8 text-[#F58220]" />
            <h3 className="font-extrabold text-lg text-slate-900">0% Middleman Commission</h3>
            <p className="text-xs text-slate-600 font-medium">Direct phone &amp; WhatsApp connection with Pandits for complete price clarity.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h3 className="font-extrabold text-lg text-slate-900">Complete 48-Vedi Guidance</h3>
            <p className="text-xs text-slate-600 font-medium">Personalized assistance for 1-Day, 3-Day, or 17-Day Pitru Paksha full rituals.</p>
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Want to connect with a Verified Pandit right now?</h2>
            <p className="text-xs font-bold text-amber-100 mt-1">Browse our verified Gaya Purohit directory with phone numbers &amp; languages.</p>
          </div>
          <Link
            href="/pandit"
            className="px-6 py-3.5 bg-slate-950 hover:bg-black text-[#F6C343] font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Browse Pandits Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-300 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-950">Pind Daan Frequently Asked Questions</h2>
          <div className="space-y-4">
            {PIND_DAAN_FAQS.map((faq, idx) => (
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
