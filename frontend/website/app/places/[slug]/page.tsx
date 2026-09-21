import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo/metadata';
import { buildFAQSchema, buildTouristAttractionSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { 
  MapPin, 
  Clock, 
  Flame, 
  Car, 
  Hotel, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Phone
} from 'lucide-react';

interface SacredPlaceData {
  slug: string;
  title: string;
  category: string;
  timing: string;
  description: string;
  fullContent: string;
  howToReach: string;
  lat: string;
  lng: string;
  imageUrl?: string;
  faqs: Array<{ question: string; answer: string }>;
}

const PLACES_SEO_DATA: Record<string, SacredPlaceData> = {
  vishnupad: {
    slug: 'vishnupad',
    title: 'Vishnupad Temple Gaya',
    category: 'TEERTH',
    timing: '5:00 AM - 9:00 PM (Daily)',
    description: 'Ancient temple housing Lord Vishnu 40-cm basalt footprint. The supreme center for ancestral Pind Daan and salvation rites in Gaya Dham.',
    fullContent: 'Vishnupad Temple stands on the bank of the holy Falgu River in Gaya. Built in 1787 by Queen Ahilyabai Holkar of Indore, the 100-foot granite dome enshrined over Lord Vishnu’s footprint is visited by millions of pilgrims during Pitru Paksha. Performing Pind Daan at Vishnupad frees ancestors from rebirth cycles.',
    howToReach: '4 km south of Gaya Junction Railway Station. Reachable in 15 minutes via auto, e-rickshaw or GayaSeva cabs.',
    lat: '24.7865',
    lng: '85.0080',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    faqs: [
      { question: 'What are Vishnupad Temple opening hours?', answer: 'The temple opens daily from 5:00 AM to 9:00 PM with mangala aarti early in the morning.' },
      { question: 'Is photography allowed inside Vishnupad temple sanctum?', answer: 'Photography inside the main sanctum sanctorum (garbhagriha) is strictly restricted to preserve teerth sanctity.' },
    ],
  },
  'falgu-river': {
    slug: 'falgu-river',
    title: 'Falgu River Devghat',
    category: 'TEERTH',
    timing: 'Open 24 Hours',
    description: 'Sacred Antarsalila river where Sita Mata offered sand Pinda to King Dasharatha. Primary location for tarpan and evening river aarti.',
    fullContent: 'Falgu River is unique as it flows beneath its sandy riverbed (Antarsalila) due to the ancient curse of Sita Mata. Devotees dig small pits in the sand to extract holy water for Pind Daan oblations.',
    howToReach: 'Adjacent to Vishnupad Temple complex, 4.5 km from Gaya Junction Railway Station.',
    lat: '24.7880',
    lng: '85.0120',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    faqs: [
      { question: 'Why does Falgu River flow underground?', answer: 'According to Ramayana legend, Sita Mata cursed Falgu River after it lied to Lord Rama about King Dasharatha Pind Daan.' },
    ],
  },
  akshayavat: {
    slug: 'akshayavat',
    title: 'Akshayavat Banyan Tree',
    category: 'TEERTH',
    timing: '6:00 AM - 7:00 PM',
    description: 'Immortal banyan tree in Gaya Ji where final Pinda Daan oblations and blessing rites are concluded by Teerth Purohits.',
    fullContent: 'Akshayavat is the eternal tree blessed by Sita Mata to remain indestructible. Completing Pind Daan beneath its branches ensures everlasting peace for ancestors.',
    howToReach: '1 km from Vishnupad Temple inside the Gaya Pind Daan corridor.',
    lat: '24.7840',
    lng: '85.0090',
    faqs: [
      { question: 'Why is Akshayavat visited at the end of Pind Daan?', answer: 'Custom dictates that final oblations (Kusha pradan and brahmin bhojan) are sealed under Akshayavat for eternal fruitfulness.' },
    ],
  },
  'bodh-gaya': {
    slug: 'bodh-gaya',
    title: 'Mahabodhi Temple Bodh Gaya',
    category: 'TEERTH',
    timing: '5:00 AM - 9:00 PM',
    description: 'UNESCO World Heritage Site located 12 km from Gaya Ji where Prince Siddhartha attained supreme enlightenment as Lord Buddha.',
    fullContent: 'Bodh Gaya is one of the four holy Buddhist sites. The 55-meter tall Mahabodhi Temple and the sacred Bodhi Tree attract global pilgrims and tourists throughout the year.',
    howToReach: '12 km south of Gaya city center. 30-minute cab ride via Bodh Gaya Road.',
    lat: '24.6960',
    lng: '84.9915',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    faqs: [
      { question: 'How far is Bodh Gaya from Gaya Junction Railway Station?', answer: 'Bodh Gaya is approximately 13 km from Gaya Junction Railway Station (GAYA).' },
    ],
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const place = PLACES_SEO_DATA[params.slug];
  if (!place) {
    return constructMetadata({ title: 'Sacred Place Not Found', noIndex: true });
  }

  return constructMetadata({
    title: `${place.title} | Timings, How to Reach & Pilgrimage Guide`,
    description: place.description,
    path: `/places/${place.slug}`,
    keywords: [place.title, `${place.title} Gaya`, `how to reach ${place.title}`, `${place.title} timings`],
    image: place.imageUrl,
  });
}

export default function PlaceDetailPage({ params }: { params: { slug: string } }) {
  const place = PLACES_SEO_DATA[params.slug];
  if (!place) {
    notFound();
  }

  const touristSchema = buildTouristAttractionSchema({
    title: place.title,
    description: place.description,
    slug: place.slug,
    lat: place.lat,
    lng: place.lng,
    imageUrl: place.imageUrl,
  });

  const faqSchema = buildFAQSchema(place.faqs);

  return (
    <>
      <JsonLd data={[touristSchema, faqSchema]} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900 antialiased">
        <Breadcrumbs
          items={[
            { label: 'Places', url: '/gaya' },
            { label: place.title, url: `/places/${place.slug}` },
          ]}
        />

        {/* Hero Card */}
        <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-10 rounded-3xl border-2 border-[#F58220]/40 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#F58220] text-white text-[10px] font-black uppercase rounded-full">
              {place.category}
            </span>
            <span className="text-xs font-bold text-amber-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> {place.timing}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {place.title}
          </h1>

          <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed max-w-3xl">
            {place.description}
          </p>
        </div>

        {/* Detailed Description & How to Reach */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#F58220]" /> Overview &amp; Spiritual Importance
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {place.fullContent}
            </p>
          </div>

          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F58220]" /> How to Reach {place.title}
            </h3>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              {place.howToReach}
            </p>
          </div>
        </div>

        {/* Connected Services Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/pind-daan" className="p-5 bg-amber-50 rounded-2xl border border-amber-300 hover:border-[#F58220] transition-all space-y-1">
            <Flame className="w-6 h-6 text-[#F58220]" />
            <h4 className="font-bold text-sm text-slate-900">Pind Daan Pandits</h4>
            <p className="text-[11px] text-slate-600 font-medium">Book verified Teerth Purohit.</p>
          </Link>

          <Link href="/gaya-taxi" className="p-5 bg-orange-50 rounded-2xl border border-orange-300 hover:border-orange-500 transition-all space-y-1">
            <Car className="w-6 h-6 text-orange-600" />
            <h4 className="font-bold text-sm text-slate-900">Gaya Station Taxi</h4>
            <p className="text-[11px] text-slate-600 font-medium">24/7 pickup &amp; Bodh Gaya rides.</p>
          </Link>

          <Link href="/stay" className="p-5 bg-blue-50 rounded-2xl border border-blue-300 hover:border-blue-500 transition-all space-y-1">
            <Hotel className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-sm text-slate-900">AC Stays &amp; Rooms</h4>
            <p className="text-[11px] text-slate-600 font-medium">Near Vishnupad Temple zone.</p>
          </Link>
        </div>

        {/* FAQs */}
        {place.faqs.length > 0 && (
          <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-300 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-950">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {place.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-amber-200 space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-900">Q: {faq.question}</h3>
                  <p className="text-xs text-slate-700 font-medium">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
