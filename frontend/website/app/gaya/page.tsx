import React from 'react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo/metadata';
import { buildFAQSchema, buildTouristAttractionSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { 
  MapPin, 
  Flame, 
  Car, 
  Hotel, 
  ShieldCheck, 
  Compass, 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Gaya Ji Pilgrimage & Visitor Guide | Vishnupad, Pind Daan & Travel',
  description: 'Complete official Gaya Ji travel & pilgrimage guide. Discover Vishnupad Temple, Falgu River, Akshayavat, Pind Daan Pandits, Gaya Station taxi & hotels.',
  path: '/gaya',
  keywords: [
    'Gaya Ji guide',
    'Gaya tourism',
    'Gaya pilgrimage',
    'Vishnupad Temple Gaya',
    'Falgu River Gaya',
    'Pind Daan Gaya',
    'Gaya travel information',
  ],
});

const GAYA_FAQS = [
  {
    question: 'Why is Gaya Ji famous for Pind Daan rites?',
    answer: 'Gaya Dham is revered in Hindu scriptures as the supreme pilgrimage site for salvation of ancestors (Pitrus). According to the Vayu Purana, performing Pind Daan at Vishnupad Devghat and Akshayavat grants eternal liberation to deceased ancestors.',
  },
  {
    question: 'How do I reach Gaya Ji from Gaya Junction Railway Station?',
    answer: 'Gaya Junction (GAYA) is located just 4 km from Vishnupad Temple. E-rickshaws, autos, and verified GayaSeva cabs are available 24/7 directly outside Platform 1 exit.',
  },
  {
    question: 'What is the best time to visit Gaya Ji?',
    answer: 'The ideal time to visit Gaya is between September and March. Pitru Paksha (September-October) witnesses the holy ancestor congregation, while winter months offer pleasant pilgrimage weather.',
  },
  {
    question: 'Are verified Pandits and lodging available in Gaya?',
    answer: 'Yes! GayaSeva connects yatris with 100% background-verified Teerth Purohits (Pandits), AC Dharamshalas, family guest houses, and 24/7 emergency pickup assistance.',
  },
];

export default function GayaGuidePage() {
  const faqSchema = buildFAQSchema(GAYA_FAQS);

  return (
    <>
      <JsonLd data={faqSchema} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900 antialiased">
        <Breadcrumbs items={[{ label: 'Gaya Ji Guide', url: '/gaya' }]} />

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-10 rounded-3xl border-2 border-[#F58220]/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10">
            <span className="px-3 py-1 bg-[#F58220] text-white text-[10px] font-black uppercase tracking-wider rounded-full inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> GAYA JI SACRED TEERTH DIRECTORY
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide leading-tight">
              Gaya Ji Teerth &amp; Pilgrim Guide (गया जी दर्शन)
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-bold max-w-2xl leading-relaxed">
              Complete authentic guide for Vishnupad Temple, Falgu River Devghat, Pind Daan rituals, verified Teerth Pandits, railway cabs, and AC dharamshala stays.
            </p>
          </div>
          <GayaSevaLogo size={80} className="shrink-0 drop-shadow-xl z-10" />
        </div>

        {/* Key Pilgrim Services Quick Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/pind-daan" className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 hover:border-[#F58220] transition-all space-y-2 group shadow-sm">
            <Flame className="w-8 h-8 text-[#F58220] group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-base text-slate-900">Pind Daan &amp; Pandits</h3>
            <p className="text-xs text-slate-600 font-semibold">Verified Gayawal Purohits &amp; 48-Vedi Shradh booking.</p>
          </Link>

          <Link href="/gaya-taxi" className="bg-orange-50 p-5 rounded-2xl border-2 border-orange-300 hover:border-[#F58220] transition-all space-y-2 group shadow-sm">
            <Car className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-base text-slate-900">Gaya Taxi &amp; Cabs</h3>
            <p className="text-xs text-slate-600 font-semibold">Station pickup, Bodh Gaya cabs &amp; outstation rides.</p>
          </Link>

          <Link href="/stay" className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-300 hover:border-blue-500 transition-all space-y-2 group shadow-sm">
            <Hotel className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-base text-slate-900">Hotels &amp; Stays</h3>
            <p className="text-xs text-slate-600 font-semibold">AC Dharamshalas &amp; family guest houses near Vishnupad.</p>
          </Link>

          <Link href="/pitru-paksha" className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-300 hover:border-emerald-500 transition-all space-y-2 group shadow-sm">
            <Calendar className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-base text-slate-900">Pitru Paksha 2026</h3>
            <p className="text-xs text-slate-600 font-semibold">Special dates, Yatri assistance &amp; express packages.</p>
          </Link>
        </div>

        {/* Informational Content Sections */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-950 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#F58220]" /> Essential Gaya Ji Teerth Destinations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-lg text-slate-900">1. Vishnupad Temple</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Houses the 40-cm footprints of Lord Vishnu imprinted on solid basalt rock. Main venue for Pind Daan oblations.
              </p>
              <Link href="/places/vishnupad" className="text-xs font-black text-[#F58220] flex items-center gap-1 pt-1">
                View Details &amp; Timings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-lg text-slate-900">2. Falgu River Devghat</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Holy Antarsalila river where Sita Mata offered sand Pinda to King Dasharatha. Site for morning tarpan &amp; evening aarti.
              </p>
              <Link href="/places/falgu-river" className="text-xs font-black text-[#F58220] flex items-center gap-1 pt-1">
                View Details &amp; Timings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-lg text-slate-900">3. Bodh Gaya Mahabodhi</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Located 12 km from Gaya Ji. UNESCO World Heritage Site where Gautama Buddha attained supreme enlightenment.
              </p>
              <Link href="/places/bodh-gaya" className="text-xs font-black text-[#F58220] flex items-center gap-1 pt-1">
                View Details &amp; Timings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs Section for AI Search & Google Snippets */}
        <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-300 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-950 flex items-center gap-2">
            <Info className="w-6 h-6 text-[#F58220]" /> Frequently Asked Questions (Gaya Ji Pilgrimage)
          </h2>

          <div className="space-y-4">
            {GAYA_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 font-black text-xs flex items-center justify-center shrink-0">
                    Q{idx + 1}
                  </span>
                  {faq.question}
                </h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
