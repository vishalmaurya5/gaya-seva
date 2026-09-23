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

        {/* 8 Essential Pind Daan Locations Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-md uppercase tracking-wider">
              IMPORTANT SHRADDH &amp; VEDI SITES
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#4A2E1A] pt-1">
              8 Essential Pind Daan Locations in Gaya Ji (आठ मुख्य गया पिंडदान वेदी)
            </h2>
            <p className="text-xs text-slate-600 font-medium max-w-3xl">
              According to the Gaya Mahatmya (Vayu Purana), performing Pind Daan at these sacred Vedis, ghats, and hills grants ultimate Moksha and peace to seven generations of departed ancestors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. Vishnupad */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">1. 🛕 Vishnupad (विष्णुपद मंदिर)</span>
                <span className="bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded text-[10px]">Primary 1st Vedi</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Primary holy site containing Lord Vishnu&apos;s 40 cm footprint stamped in basalt rock. Oblations (pindas) offered directly at the footprint ensure instant karmic relief.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/50 text-[11px] text-gray-600">
                <span>📍 4.0 km from Station</span>
                <a href="https://www.google.com/maps/search/?api=1&query=Vishnupad+Temple+Gaya" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline">Google Maps</a>
              </div>
            </div>

            {/* 2. Falgu River */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">2. 🌊 Falgu River (फल्गु नदी एवं देवघाट)</span>
                <span className="bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded text-[10px]">Water &amp; Sand Tarpan</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Sacred river bank where Yatris take holy bath and perform water tarpan and sand Pind Daan oblations for departed lineage members.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/50 text-[11px] text-gray-600">
                <span>📍 3.5 km from Station</span>
                <a href="https://www.google.com/maps/search/?api=1&query=Falgu+River+Devghat+Gaya" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline">Google Maps</a>
              </div>
            </div>

            {/* 3. Akshay Vat */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">3. 🌳 Akshay Vat (अक्षयवट अमर वटवृक्ष)</span>
                <span className="bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded text-[10px]">Suphal Blessing Vedi</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                The immortal banyan tree under which Shri Ram performed Shradh. Gayawal Panda Ji grants the final &quot;Suphal&quot; blessing here to conclude Pind Daan.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/50 text-[11px] text-gray-600">
                <span>📍 1.2 km from Vishnupad</span>
                <a href="https://www.google.com/maps/search/?api=1&query=Akshayavat+Gaya" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline">Google Maps</a>
              </div>
            </div>

            {/* 4. Sita Kund */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">4. 🌸 Sita Kund (सीता कुण्ड)</span>
                <span className="bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded text-[10px]">Mata Sita Shrine</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Located across Falgu river where Devi Sita performed Pind Daan with Falgu sand for King Dasharatha when Lord Rama was absent.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/50 text-[11px] text-gray-600">
                <span>📍 4.2 km from Station</span>
                <a href="https://www.google.com/maps/search/?api=1&query=Sita+Kund+Gaya" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline">Google Maps</a>
              </div>
            </div>

            {/* 5. Pretshila */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">5. 🏔️ Pretshila (प्रेतशिला पर्वत)</span>
                <span className="bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded text-[10px]">Unnatural Demise Shradh</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Sacred hill (670 steps) for ancestors who suffered unnatural or unfulfilled deaths. Sattu Pinda offered at Brahma Kund grants soul peace.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/50 text-[11px] text-gray-600">
                <span>📍 11.0 km North of Gaya</span>
                <a href="https://www.google.com/maps/search/?api=1&query=Pretshila+Hill+Gaya" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline">Google Maps</a>
              </div>
            </div>

            {/* 6. Ramshila */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">6. ⛰️ Ramshila (रामशिला पर्वत)</span>
                <span className="bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded text-[10px]">Treta Yuga Ram Site</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ancient hill shrine where Lord Rama offered Pind Daan for King Dasharatha. Features ancient Rameshwar Shiva temple atop the hill.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/50 text-[11px] text-gray-600">
                <span>📍 5.0 km from Station</span>
                <a href="https://www.google.com/maps/search/?api=1&query=Ramshila+Hill+Gaya" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline">Google Maps</a>
              </div>
            </div>

            {/* 7. Brahmayoni */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">7. 🌄 Brahmayoni (ब्रह्मयोनि पर्वत)</span>
                <span className="bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded text-[10px]">Rebirth Liberation</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Sacred hill (424 steps) housing Matreyi Cave &amp; Ashtabhuja temple. Performing rites here frees ancestors from the cycle of rebirth.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/50 text-[11px] text-gray-600">
                <span>📍 4.8 km from Station</span>
                <a href="https://www.google.com/maps/search/?api=1&query=Brahmayoni+Hill+Gaya" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline">Google Maps</a>
              </div>
            </div>

            {/* 8. Gayasur Vedis */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">8. 🔱 Gayasur Vedis (गयासुर 48 वेदी परिक्रमा)</span>
                <span className="bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded text-[10px]">48-Vedi Circuit</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                The ancient 48-Vedi pilgrimage circuit established over the body of Demon Gayasur by Lord Vishnu &amp; Devas for eternal ancestor salvation.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-orange-200/50 text-[11px] text-gray-600">
                <span>📍 3.8 km Circuit Zone</span>
                <a href="https://www.google.com/maps/search/?api=1&query=Gayasur+Asura+Shila+Gaya" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold underline">Google Maps</a>
              </div>
            </div>
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
