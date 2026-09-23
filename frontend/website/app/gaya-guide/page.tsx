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
  Award,
  Lock,
  Star,
  Phone,
  ExternalLink,
  Trees,
  Sun
} from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';

interface TeerthPlace {
  slug: string;
  name: string;
  hindiName: string;
  rating: string;
  tag: string;
  category: 'TEMPLE' | 'VEDI' | 'GHAT' | 'HILL' | 'BODHGAYA' | 'NATURAL';
  locationAddress: string;
  phone?: string;
  desc: string;
  timing: string;
  distanceFromStation: string;
  significance: string;
  badge: string;
}

const PLACES: TeerthPlace[] = [
  // 1. Vishnupad Temple
  { 
    slug: 'vishnupad', 
    name: 'Vishnupad Temple', 
    hindiName: 'श्री विष्णुपद मंदिर (40 सेमी भगवान विष्णु पदचिह्न)',
    rating: '4.6',
    tag: 'Major Hindu Pilgrimage Site', 
    category: 'TEMPLE',
    locationAddress: 'Chand Chaura, Gaya',
    phone: '+91 98350 80683',
    desc: 'Major Hindu pilgrimage site; central 40-cm basalt footprint of Lord Vishnu stamped in solid rock for ancestor Pind Daan rites inside Queen Ahilyabai Holkar granite shrine.',
    timing: '5:00 AM - 9:00 PM',
    distanceFromStation: '4.0 km (15 mins auto/taxi)',
    significance: 'Primary 1st Vedi of 48-Vedi Shradh Parikrama & Lord Vishnu Footprint',
    badge: 'Hindu Temple • Open',
  },
  // 2. Akshay Vat
  { 
    slug: 'akshayavat', 
    name: 'Akshay Vat', 
    hindiName: 'अक्षयवट (अमर वटवृक्ष)',
    rating: '4.8',
    tag: 'Sacred Banyan Tree & Shradh Site', 
    category: 'VEDI',
    locationAddress: 'Vishnupad Area, Gaya',
    desc: 'Sacred banyan tree and essential final Pind Daan oblation location where Gayawal Purohits grant Suphal blessings for eternal ancestor salvation.',
    timing: '6:00 AM - 7:00 PM',
    distanceFromStation: '5.2 km (18 mins)',
    significance: 'Immortal Banyan Tree & Final Shradh Suphal Site',
    badge: 'Sacred Banyan Tree',
  },
  // 3. Sita Kund
  { 
    slug: 'sitakund', 
    name: 'Sita Kund', 
    hindiName: 'सीताकुंड (माता सीता बालुका पिंड दान स्थान)',
    rating: '4.7',
    tag: 'Mata Sita Sand Pind Shrine', 
    category: 'GHAT',
    locationAddress: 'Falgu River East Bank, Gaya',
    desc: 'Religious site associated with Goddess Sita offering sand Pinda to King Dasharatha when Lord Rama was gathering ritual items during Treta Yuga.',
    timing: '5:30 AM - 7:30 PM',
    distanceFromStation: '4.2 km (15 mins)',
    significance: 'Mata Sita Sand Pind Daan Memorial & Falgu Shrine',
    badge: 'Religious Site',
  },
  // 4. Ramshila Hill
  { 
    slug: 'ramshila', 
    name: 'Ramshila Hill', 
    hindiName: 'रामशिला पर्वत एवं रामेश्वर महादेव',
    rating: '4.5',
    tag: 'Pind Daan & Shiva Hill', 
    category: 'HILL',
    locationAddress: 'Ramshila, Gaya',
    desc: 'Religious hill associated with Lord Rama offering ancestral Pind Daan for King Dasharatha and consecrating the Rameshwar Mahadev Lingam.',
    timing: '6:00 AM - 7:00 PM',
    distanceFromStation: '5.0 km (15 mins)',
    significance: 'Treta Yuga Shri Ram Pind Site & Shiva Temple',
    badge: 'Religious Hill',
  },
  // 5. Pretshila Hill
  { 
    slug: 'pretshila', 
    name: 'Pretshila Hill', 
    hindiName: 'प्रेतशिला पर्वत (अकाल मृत्यु मुक्ति धाम)',
    rating: '4.6',
    tag: 'Untimely Death Salvation Hill', 
    category: 'HILL',
    locationAddress: 'Pretshila, Gaya',
    desc: 'Important Pind Daan/Pitru ritual location dedicated to peace for departed ancestors and salvation of souls who suffered premature or unnatural deaths.',
    timing: '6:00 AM - 6:00 PM',
    distanceFromStation: '11.0 km (30 mins)',
    significance: 'Pitru Moksha Shradh for Unnatural Deaths',
    badge: 'Pitru Ritual Location',
  },
  // 6. Brahmayoni Hill
  { 
    slug: 'brahmayoni', 
    name: 'Brahmayoni Hill', 
    hindiName: 'ब्रह्मयोनि पर्वत एवं अष्टभुजा मंदिर',
    rating: '4.6',
    tag: 'Pilgrimage Hill & Rebirth Liberation', 
    category: 'HILL',
    locationAddress: 'Godawari Area, Gaya',
    desc: 'Hill and sacred pilgrimage destination with 424 steps where Lord Buddha delivered Fire Sermon and Yatris perform ancestral Pind Daan to break rebirth cycles.',
    timing: '6:00 AM - 6:00 PM',
    distanceFromStation: '4.8 km (16 mins)',
    significance: 'Buddha Fire Sermon & Rebirth Freedom Hill',
    badge: 'Hill & Pilgrimage',
  },
  // 7. Mangla Gauri
  { 
    slug: 'mangla-gauri', 
    name: 'Mangla Gauri Temple', 
    hindiName: 'मां सर्व मंगला गौरी शक्तिपीठ मंदिर',
    rating: '4.6',
    tag: '51 Sacred Shakti Peethas', 
    category: 'TEMPLE',
    locationAddress: 'Godawari, Gaya',
    desc: 'Famous Shakti pilgrimage site mentioned in Padma Purana where the breast of Sati fell, highly revered for marital bliss and boons.',
    timing: '5:00 AM - 10:00 PM',
    distanceFromStation: '4.5 km (16 mins)',
    significance: '51 Shakti Peethas & Sacred Goddess Shrine',
    badge: 'Famous Shakti Peeth',
  },
  // 8. Phalgu River
  { 
    slug: 'falgu-river', 
    name: 'Phalgu River', 
    hindiName: 'फल्गु नदी एवं देवघाट',
    rating: '4.8',
    tag: 'Major Cultural & Religious Landmark', 
    category: 'GHAT',
    locationAddress: 'Devghat, Gaya',
    desc: 'Major religious and cultural landmark where Yatris take holy bath, perform tarpan, sand Pinda offerings, and view evening Falgu Aarti.',
    timing: '24 Hours Open (Bath 5:00 AM - 7:00 PM)',
    distanceFromStation: '3.5 km (12 mins)',
    significance: 'Antarsalila Holy River & Devghat Bathing Site',
    badge: 'Religious Landmark',
  },
  // 9. Mahabodhi Temple
  { 
    slug: 'mahabodhi-temple', 
    name: 'Mahabodhi Temple', 
    hindiName: 'महाबोधि मंदिर (यूनेस्को विश्व धरोहर)',
    rating: '4.9',
    tag: 'UNESCO World Heritage Site', 
    category: 'BODHGAYA',
    locationAddress: 'Bodh Gaya, Gaya District',
    desc: 'Buddhist pilgrimage site and UNESCO World Heritage Site featuring 55-meter grand stone temple where Lord Buddha attained Supreme Enlightenment under the Bodhi Tree.',
    timing: '5:00 AM - 9:00 PM',
    distanceFromStation: '13.5 km (35 mins)',
    significance: 'UNESCO World Heritage & Supreme Bodhi Tree',
    badge: 'UNESCO Heritage Site',
  },
  // 10. Bodh Gaya
  { 
    slug: 'bodh-gaya', 
    name: 'Bodh Gaya', 
    hindiName: 'बोधगया (अंतर्राष्ट्रीय बौद्ध तीर्थ क्षेत्र)',
    rating: '4.9',
    tag: 'Major International Buddhist Destination', 
    category: 'BODHGAYA',
    locationAddress: 'Bodh Gaya, Gaya District',
    desc: 'Major international Buddhist pilgrimage destination attracting seekers and pilgrims worldwide to international monasteries, stupas, & meditation centers.',
    timing: '5:00 AM - 9:00 PM',
    distanceFromStation: '13.5 km (35 mins)',
    significance: 'Global Spiritual Hub & International Monasteries',
    badge: 'International Destination',
  },
  // 11. Dungeshwari Cave Temples
  { 
    slug: 'dungeshwari-caves', 
    name: 'Dungeshwari Cave Temples', 
    hindiName: 'डुंगेश्वरी गुफा मंदिर (महाकाल गुफाएं)',
    rating: '4.7',
    tag: 'Buddhist Meditation & Cave Site', 
    category: 'HILL',
    locationAddress: 'Dungeshwari, Gaya District',
    desc: 'Buddhist meditation/pilgrimage location (Mahakala Caves) where Prince Siddhartha practiced 6 years of severe asceticism before reaching Bodh Gaya.',
    timing: '6:00 AM - 5:30 PM',
    distanceFromStation: '15.0 km (38 mins)',
    significance: 'Prince Siddhartha Ascetic Meditation Caves',
    badge: 'Buddhist Cave Location',
  },
  // 12. Sujata Stupa
  { 
    slug: 'sujata-stupa', 
    name: 'Sujata Stupa', 
    hindiName: 'सुजाता स्तूप (सुजाता कुटी, बकराौर)',
    rating: '4.6',
    tag: 'Buddhist Historical Site', 
    category: 'BODHGAYA',
    locationAddress: 'Bakraur, Bodh Gaya',
    desc: 'Buddhist historical site commemorating Sujata offering kheer (milk rice) to Buddha, breaking his extreme fast and saving his life before enlightenment.',
    timing: '6:00 AM - 6:30 PM',
    distanceFromStation: '14.2 km (36 mins)',
    significance: 'Sujata Kuti & Milk Rice Offering Memorial',
    badge: 'Historical Site',
  },
  // 13. Muchalinda Lake
  { 
    slug: 'muchalinda-lake', 
    name: 'Muchalinda Lake', 
    hindiName: 'मुचलिंद सरोवर (नागराज मुचलिंद स्थान)',
    rating: '4.7',
    tag: 'Important Buddhist Sacred Site', 
    category: 'BODHGAYA',
    locationAddress: 'Mahabodhi Complex, Bodh Gaya',
    desc: 'Important Buddhist site featuring central Buddha statue protected by Snake King Muchalinda’s hood during a storm in the 6th week post-enlightenment.',
    timing: '5:00 AM - 9:00 PM',
    distanceFromStation: '13.6 km (35 mins)',
    significance: 'Cobra King Protection Legend & Holy Lake',
    badge: 'Important Buddhist Site',
  },
  // 14. Royal Bhutan Monastery
  { 
    slug: 'bhutan-monastery', 
    name: 'Royal Bhutan Monastery', 
    hindiName: 'रॉयल भूटान बौद्ध मठ',
    rating: '4.7',
    tag: 'Traditional Bhutanese Monastery', 
    category: 'BODHGAYA',
    locationAddress: 'Bodh Gaya',
    desc: 'Buddhist monastery built by the King of Bhutan featuring traditional Bhutanese clay reliefs, colorful murals, and 7-foot serene Buddha statue.',
    timing: '7:00 AM - 7:00 PM',
    distanceFromStation: '13.8 km (35 mins)',
    significance: 'Bhutanese Buddhist Art & Meditation Monastery',
    badge: 'Buddhist Monastery',
  },
  // 15. Tibetan Temple
  { 
    slug: 'tibetan-temple', 
    name: 'Tibetan Temple', 
    hindiName: 'तिब्बती मंदिर एवं धर्मचक्र (बोधगया)',
    rating: '4.7',
    tag: 'Tibetan Monastery & Prayer Wheel', 
    category: 'BODHGAYA',
    locationAddress: 'Bodh Gaya',
    desc: 'Buddhist temple featuring a 20,000 kg bronze Prayer Wheel of Law (Dharmachakra) and colorful Tibetan murals opposite Mahabodhi complex.',
    timing: '6:00 AM - 6:00 PM',
    distanceFromStation: '13.2 km (34 mins)',
    significance: 'Tibetan Gelugpa Temple & Prayer Wheel',
    badge: 'Buddhist Temple',
  },
  // 16. Thai Temple
  { 
    slug: 'thai-temple', 
    name: 'Thai Temple (Wat Thai)', 
    hindiName: 'रॉयल थाई मंदिर (वाट थाई बोधगया)',
    rating: '4.8',
    tag: 'Thai Buddhist Architecture Shrine', 
    category: 'BODHGAYA',
    locationAddress: 'Wat Thai Road, Bodh Gaya',
    desc: 'Thai Buddhist temple built in 1956 with sloping gold-tiled roof, manicured gardens, and magnificent 25-meter bronze Buddha statue in Thai style.',
    timing: '6:00 AM - 6:00 PM',
    distanceFromStation: '13.0 km (33 mins)',
    significance: 'Royal Thai Buddhist Monastery & Golden Roof',
    badge: 'Thai Buddhist Temple',
  },
  // 17. Japanese Temple / Indosan Nipponji
  { 
    slug: 'japanese-temple', 
    name: 'Japanese Temple / Indosan Nipponji', 
    hindiName: 'इंदोसन निप्पनजी (जापानी मंदिर)',
    rating: '4.7',
    tag: 'Japanese Zen Pagoda & Temple', 
    category: 'BODHGAYA',
    locationAddress: 'Indosan Nipponji, Bodh Gaya',
    desc: 'Buddhist temple constructed in 1972 showcasing traditional Japanese wooden pagoda design, Zen gardens, and peace Bell of World Harmony.',
    timing: '6:00 AM - 6:00 PM',
    distanceFromStation: '13.5 km (35 mins)',
    significance: 'Japanese Zen Pagoda & World Peace Bell',
    badge: 'Buddhist Temple',
  },
  // 18. Chinese Temple
  { 
    slug: 'chinese-temple', 
    name: 'Chinese Temple', 
    hindiName: 'चीनी बौद्ध मंदिर (बोधगया)',
    rating: '4.5',
    tag: 'Traditional Han-Style Monastery', 
    category: 'BODHGAYA',
    locationAddress: 'Near Mahabodhi, Bodh Gaya',
    desc: 'Buddhist temple built in 1945 by Chinese monks housing 200-year-old marble Buddha icons brought from China and traditional Han architecture.',
    timing: '7:00 AM - 6:00 PM',
    distanceFromStation: '13.4 km (35 mins)',
    significance: 'Han-style Architecture & Ancient Marble Icons',
    badge: 'Buddhist Temple',
  },
  // 19. 80 Feet Buddha Statue
  { 
    slug: '80-feet-buddha', 
    name: '80 Feet Buddha Statue', 
    hindiName: '80 फीट महाबुद्ध प्रतिमा',
    rating: '4.8',
    tag: 'Major Tourist Attraction', 
    category: 'BODHGAYA',
    locationAddress: 'Bodh Gaya',
    desc: 'Major tourist attraction featuring an imposing 80-foot carved red sandstone Buddha statue seated in dhyana mudra meditation on a lotus throne.',
    timing: '6:00 AM - 6:30 PM',
    distanceFromStation: '13.8 km (36 mins)',
    significance: 'Daijokyo Japanese Giant Buddha Monument',
    badge: 'Major Tourist Attraction',
  },
  // 20. Gurpa Hill
  { 
    slug: 'gurpa-hill', 
    name: 'Gurpa Hill', 
    hindiName: 'गुरपा पर्वत (गुरुपद गिरि - महाकश्यप निर्वाण स्थल)',
    rating: '4.6',
    tag: 'Buddhist Pilgrimage & Natural Destination', 
    category: 'NATURAL',
    locationAddress: 'Gurpa, Gaya District',
    desc: 'Buddhist pilgrimage/natural destination where Buddha’s chief disciple Mahakasyapa entered meditative trance awaiting Future Maitreya Buddha.',
    timing: '6:00 AM - 5:00 PM',
    distanceFromStation: '33.0 km (65 mins)',
    significance: 'Gurupada Giri & Mahakasyapa Nirvana Cave',
    badge: 'Pilgrimage & Natural Destination',
  },
  // 21. Tapovan
  { 
    slug: 'tapovan-gaya', 
    name: 'Tapovan', 
    hindiName: 'तपोवन (प्राचीन ऋषि आश्रम एवं गर्म कुंड)',
    rating: '4.5',
    tag: 'Religious & Natural Destination', 
    category: 'NATURAL',
    locationAddress: 'Tapovan, Gaya District',
    desc: 'Religious/natural destination famous for ancient sulphur hot water springs (Kunds) where Sanatana sages performed penance and tapasya.',
    timing: '6:00 AM - 6:00 PM',
    distanceFromStation: '30.0 km (60 mins)',
    significance: 'Natural Sulphur Springs & Hermit Tapasya Site',
    badge: 'Religious & Natural Destination',
  },
  // 22. Koteshwar Nath Temple
  { 
    slug: 'koteshwar-nath', 
    name: 'Koteshwar Nath Temple', 
    hindiName: 'कोटेश्वर नाथ महादेव मंदिर',
    rating: '4.6',
    tag: 'Hindu Religious Destination', 
    category: 'TEMPLE',
    locationAddress: 'Gaya District (Belaganj / Morhar River)',
    desc: 'Hindu religious destination housing millions of swayambhu Shiva lingams in a single grand lingam, highly revered since Mahabharata era.',
    timing: '5:00 AM - 8:30 PM',
    distanceFromStation: '25.0 km (45 mins)',
    significance: 'Crore Shiva Lingam Shrine & Ancient Teerth',
    badge: 'Hindu Religious Destination',
  },
];

export default function GayaGuideDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ALL', label: 'All 22 Popular Places', icon: Compass },
    { id: 'TEMPLE', label: 'Popular Temples', icon: Landmark },
    { id: 'BODHGAYA', label: 'Bodh Gaya UNESCO & Monasteries', icon: Sparkles },
    { id: 'HILL', label: 'Sacred Hills & Caves', icon: Mountain },
    { id: 'VEDI', label: '48 Vedis & Pind Sites', icon: Flame },
    { id: 'GHAT', label: 'Falgu River & Ghats', icon: Landmark },
    { id: 'NATURAL', label: 'Pilgrimage & Springs', icon: Sun },
  ];

  const filteredPlaces = useMemo(() => {
    return PLACES.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesQuery = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.locationAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                GayaSeva Official Pilgrim & Tourism Directory
              </span>
              <h1 className="text-2xl sm:text-4xl font-sans font-extrabold text-white tracking-tight leading-tight">
                Popular Places to Visit in Gaya &amp; Bodh Gaya
              </h1>
              <p className="text-sm sm:text-base text-[#F8F6EF]/90 max-w-2xl leading-relaxed font-medium">
                Gaya ko sirf dekhiye nahi… samjhiye. Complete official guide for all 22 popular places, sacred temples, Bodh Gaya UNESCO monasteries, Pind Daan hills, and natural hot springs.
              </p>
            </div>
            <GayaSevaLogo size={68} showText={false} className="shrink-0 drop-shadow-lg" />
          </div>

          {/* Quick Feature Badges */}
          <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-[#F6C343]">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 22 Verified Locations &amp; Descriptions
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <Navigation className="w-4 h-4 text-amber-400" /> Distance from Station &amp; GPS Directions
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <ShieldCheck className="w-4 h-4 text-orange-400" /> Protected Direct Contact Details
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
                placeholder="Search place by name or location (Vishnupad, Mahabodhi, Dungeshwari, Mangla Gauri, Thai Temple)..."
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

        {/* Places Grid — Fully Unlocked */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((p) => (
            <div
              key={p.slug}
              className="bg-white rounded-3xl border border-slate-300 shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between space-y-5 relative overflow-hidden group"
            >
              <div className="space-y-3">
                {/* Header Badges & Rating */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>{p.rating}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#4A2E1A] bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                    {p.badge}
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

                {/* Details Card — fully visible */}
                <div className="bg-[#F8F6EF] p-4 rounded-2xl border border-[#EBE6D6] space-y-2.5 text-xs font-bold text-[#0F172A]">
                  {/* Location */}
                  <div className="flex items-start gap-2 text-slate-900">
                    <MapPin className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-extrabold text-slate-500 block uppercase">Location</span>
                      <span className="font-extrabold text-slate-900">{p.locationAddress}</span>
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center gap-2 text-slate-900 pt-1 border-t border-[#E2DBC8]/60">
                    <Navigation className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">{p.distanceFromStation}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-slate-900 pt-1 border-t border-[#E2DBC8]/60">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    {p.phone ? (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-extrabold">{p.phone}</span>
                        <a
                          href={`tel:${p.phone.replace(/[^0-9+]/g, '')}`}
                          className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-extrabold hover:bg-emerald-700 transition-colors"
                        >
                          Call
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-medium">Visiting / Open Entry</span>
                    )}
                  </div>

                  {/* Timings */}
                  <div className="flex items-center gap-2 text-slate-900 pt-1 border-t border-[#E2DBC8]/60">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{p.timing}</span>
                  </div>

                  {/* Significance */}
                  <div className="flex items-center gap-2 text-emerald-800 pt-1 border-t border-[#E2DBC8]/60">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{p.significance}</span>
                  </div>
                </div>
              </div>

              {/* Map + Action Buttons — always visible */}
              <div className="flex flex-col gap-2">
                <div className="overflow-hidden rounded-2xl border border-amber-300 shadow-inner bg-amber-50/50">
                  <iframe
                    title={`Map location for ${p.name}`}
                    width="100%"
                    height="130"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(p.name + ' ' + p.locationAddress + ' Bihar')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + p.locationAddress + ' Bihar')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-2xl text-center flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Navigation className="w-4 h-4" /> Open in Google Maps App
                </a>
                <Link
                  href={`/gaya-guide/${p.slug}`}
                  className="w-full py-3 bg-[#1C0D02] hover:bg-[#3D2310] text-white text-xs font-extrabold rounded-2xl text-center flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  Explore {p.name} Guide <ArrowRight className="w-4 h-4 text-[#F6C343]" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-300 p-8 space-y-4">
            <Compass className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-sans font-extrabold text-xl text-[#0F172A]">No Places Found</h3>
            <p className="text-xs font-bold text-slate-600 max-w-md mx-auto">
              No places matched your search "{searchQuery}". Try selecting "All 22 Popular Places" or clear your query.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

