'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Search, 
  MapPin, 
  Clock, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Navigation, 
  Landmark, 
  Building2, 
  Mountain, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';

interface TeerthPlace {
  slug: string;
  name: string;
  hindiName: string;
  tag: string;
  category: 'VEDI' | 'GHAT' | 'HILL' | 'BODHGAYA';
  desc: string;
  timing: string;
  distanceFromStation: string;
  significance: string;
  badge: string;
}

const PLACES: TeerthPlace[] = [
  { 
    slug: 'vishnupad', 
    name: 'Vishnupad Temple', 
    hindiName: 'विष्णुपद मंदिर (40 सेंटीमीटर पदचिह्न)',
    tag: 'Lord Vishnu Footprint Shrine', 
    category: 'VEDI',
    desc: 'Central holy site for Pinda Daan rites stamped in solid basalt rock inside the 18th-century granite temple.',
    timing: '5:00 AM - 9:00 PM',
    distanceFromStation: '4.0 km (15 mins auto/taxi)',
    significance: 'Primary 1st Vedi of 48-Vedi Shradh Parikrama',
    badge: 'Primary Shradh Vedi',
  },
  { 
    slug: 'falgu-river', 
    name: 'Falgu River & Devghat', 
    hindiName: 'फल्गु नदी एवं देवघाट',
    tag: 'Sacred Pinda Daan River', 
    category: 'GHAT',
    desc: 'Holy river flowing past Gaya Ji where Yatris perform sacred bath, tarpan, and Pinda Daan oblations.',
    timing: '24 Hours Open (Bath 5:00 AM - 7:00 PM)',
    distanceFromStation: '3.5 km (12 mins)',
    significance: 'Falgu Bath & Sand Pind Daan Ritual Site',
    badge: 'Falgu Ghat',
  },
  { 
    slug: 'akshayavat', 
    name: 'Akshayavat Banyan Tree', 
    hindiName: 'अक्षयवट (अमर वटवृक्ष)',
    tag: 'Immortal Banyan Tree', 
    category: 'VEDI',
    desc: 'Ancient sacred tree where final Pinda Daan oblations are completed and Gayawal Purohits grant blessings.',
    timing: '6:00 AM - 7:00 PM',
    distanceFromStation: '5.2 km (18 mins)',
    significance: 'Final Oblation & Brahman Suphal Ritual Site',
    badge: 'Final Pind Daan Vedi',
  },
  { 
    slug: 'pretshila', 
    name: 'Pretshila Hill Shrine', 
    hindiName: 'प्रेतशिला पर्वत (अकाल मृत्यु मुक्ति)',
    tag: 'Ancestor Salvation Shrine', 
    category: 'HILL',
    desc: 'Sacred hill shrine dedicated to peace for departed ancestors, offering relief from unnatural deaths.',
    timing: '6:00 AM - 6:00 PM',
    distanceFromStation: '11.0 km (30 mins)',
    significance: 'Special Shradh for Unnatural Death Ancestors',
    badge: 'Sacred Hill',
  },
  { 
    slug: 'ramshila', 
    name: 'Ramshila Hill Shrine', 
    hindiName: 'रामशिला पर्वत',
    tag: 'Ancient Teerth Hill', 
    category: 'HILL',
    desc: 'Holy hill where Lord Rama performed sacred oblations for King Dasharatha during Treta Yuga.',
    timing: '6:00 AM - 7:00 PM',
    distanceFromStation: '5.0 km (15 mins)',
    significance: 'Treta Yuga Shri Ram Pind Daan Site',
    badge: 'Ram Teerth',
  },
  { 
    slug: 'sitakund', 
    name: 'Sitakund Falgu Bank', 
    hindiName: 'सीताकुंड (माता सीता पिंड दान)',
    tag: 'Goddess Sita Shrine', 
    category: 'GHAT',
    desc: 'Sacred spot on Falgu bank associated with Goddess Sita offering sand Pinda to King Dasharatha.',
    timing: '5:30 AM - 7:30 PM',
    distanceFromStation: '4.2 km (15 mins)',
    significance: 'Mata Sita Sand Pind Daan Memorial',
    badge: 'Sita Shrine',
  },
  { 
    slug: 'bodh-gaya', 
    name: 'Bodh Gaya & Mahabodhi Temple', 
    hindiName: 'बोधगया महाबोधि मंदिर (यूनेस्को)',
    tag: 'Buddha Enlightenment Site', 
    category: 'BODHGAYA',
    desc: 'UNESCO World Heritage site where Lord Buddha attained supreme enlightenment under the Bodhi Tree.',
    timing: '5:00 AM - 9:00 PM',
    distanceFromStation: '13.5 km (35 mins)',
    significance: 'Global Buddhist Pilgrimage & Meditation',
    badge: 'UNESCO Heritage',
  },
];

export default function GayaGuideDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Shrines & Vedis', icon: Compass },
    { id: 'VEDI', label: '48 Vedis & Rites', icon: Flame },
    { id: 'GHAT', label: 'Falgu River & Ghats', icon: Landmark },
    { id: 'HILL', label: 'Sacred Hills', icon: Mountain },
    { id: 'BODHGAYA', label: 'Bodh Gaya UNESCO', icon: Sparkles },
  ];

  const filteredPlaces = useMemo(() => {
    return PLACES.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesQuery = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A] pb-16">
      
      {/* Premium Executive Hero Banner */}
      <div className="bg-gradient-to-br from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white py-12 px-4 sm:px-6 shadow-xl border-b border-[#F58220]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F58220]/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="px-3 py-1 bg-[#F58220]/20 text-[#F6C343] text-xs font-bold rounded-full border border-[#F58220]/40 uppercase tracking-widest inline-block">
                GayaSeva Official Pilgrim Guide
              </span>
              <h1 className="text-2xl sm:text-4xl font-sans font-extrabold text-white tracking-tight leading-tight">
                Gaya Ji Teerth & 48-Vedi Directory
              </h1>
              <p className="text-sm sm:text-base text-[#F8F6EF]/90 max-w-2xl leading-relaxed font-medium">
                Gaya ko sirf dekhiye nahi… samjhiye. Explore authentic ritual significance, timings, distance from station, and verified nearby services for all sacred shrines.
              </p>
            </div>
            <GayaSevaLogo size={68} showText={false} className="shrink-0 drop-shadow-lg" />
          </div>

          {/* Quick Feature Badges */}
          <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-[#F6C343]">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 48-Vedi Pind Daan Map
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <Navigation className="w-4 h-4 text-amber-400" /> Real Distance & Auto Fares
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <ShieldCheck className="w-4 h-4 text-orange-400" /> Verified Gayawal Panda Services
            </span>
          </div>

          {/* Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-2xl">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shrine by name (Vishnupad, Falgu, Akshayavat, Pretshila)..."
                className="w-full pl-12 pr-4 py-3.5 bg-white text-[#0F172A] placeholder:text-[#475569] text-sm font-semibold rounded-2xl shadow-lg border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#F6C343]"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all shadow-xs border ${
                  isSelected
                    ? 'bg-[#1C0D02] text-white border-[#1C0D02] ring-2 ring-[#F58220]'
                    : 'bg-white text-[#0F172A] border-slate-300 hover:bg-amber-50 hover:border-[#F58220]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F6C343]' : 'text-[#F58220]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((p) => (
            <div 
              key={p.slug} 
              className="bg-white rounded-3xl border border-slate-300 shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between space-y-5 relative overflow-hidden group"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-[#4A2E1A] text-[10px] font-black uppercase rounded-lg border border-amber-300 tracking-wider">
                    {p.badge}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {p.tag}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-sans font-extrabold text-lg text-[#0F172A] tracking-tight leading-tight group-hover:text-[#F58220] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs font-bold text-[#D96B00] mt-0.5">
                    {p.hindiName}
                  </p>
                </div>

                <p className="text-xs font-semibold text-[#1E293B] leading-relaxed">
                  {p.desc}
                </p>

                {/* Details Card */}
                <div className="bg-[#F8F6EF] p-3.5 rounded-2xl border border-[#EBE6D6] space-y-2 text-xs font-bold text-[#0F172A]">
                  <div className="flex items-center gap-2 text-slate-900">
                    <MapPin className="w-4 h-4 text-[#F58220] shrink-0" />
                    <span>{p.distanceFromStation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-900">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{p.timing}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{p.significance}</span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <Link
                href={`/gaya-guide/${p.slug}`}
                className="w-full py-3 bg-[#1C0D02] hover:bg-[#3D2310] text-white text-xs font-extrabold rounded-2xl text-center flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                Explore {p.name} Guide <ArrowRight className="w-4 h-4 text-[#F6C343]" />
              </Link>

            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-300 p-8 space-y-4">
            <Compass className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-sans font-extrabold text-xl text-[#0F172A]">No Shrines Found</h3>
            <p className="text-xs font-bold text-slate-600 max-w-md mx-auto">
              No shrines matched your search "{searchQuery}". Try selecting "All Shrines & Vedis" or clear your query.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

