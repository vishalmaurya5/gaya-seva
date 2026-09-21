'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Flame, 
  Car, 
  Hotel, 
  UtensilsCrossed, 
  ShoppingBag, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  MessageCircle, 
  Star, 
  Filter, 
  ExternalLink,
  Layers,
  CheckCircle2,
  Phone,
  Search,
  Check
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { ContentStore, ServiceConfigItem } from '@/lib/contentStore';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { formatPhoneNumber, getProfessionalWhatsAppUrl } from '@/lib/whatsappHelper';

// Standard Category Metadata Definition Map
const STANDARD_CATEGORY_META: Record<string, { labelEn: string; labelHi: string; icon: any; color: string; bg: string; border: string; descEn: string; descHi: string }> = {
  PANDIT: {
    labelEn: 'Pind Daan & Pandits',
    labelHi: 'पिंडदान एवं तीर्थ पुरोहित',
    icon: Flame,
    color: 'text-amber-600',
    bg: 'bg-amber-50/90',
    border: 'border-amber-300',
    descEn: 'Authentic Gayawal Teerth Purohits for Falgu River, Vishnupad & Akshayavat rituals.',
    descHi: 'विष्णुपद, फल्गु नदी तट और अक्षयवट हेतु अधिकृत गयावाल तीर्थ पुरोहित।',
  },
  DRIVER: {
    labelEn: 'Pick & Drop Taxi',
    labelHi: 'पिक एंड ड्रॉप (टैक्सी/ऑटो)',
    icon: Car,
    color: 'text-orange-600',
    bg: 'bg-orange-50/90',
    border: 'border-orange-300',
    descEn: '24/7 Verified station pickup, outstation cabs, SUVs & auto-rickshaws.',
    descHi: 'गया जंक्शन, एयरपोर्ट एवं बोधगया हेतु 24/7 सत्यापित टैक्सी एवं ऑटो।',
  },
  HOTEL: {
    labelEn: 'Hotels & Dharamshalas',
    labelHi: 'होटल एवं धर्मशालाएं',
    icon: Hotel,
    color: 'text-blue-600',
    bg: 'bg-blue-50/90',
    border: 'border-blue-300',
    descEn: 'Clean AC/Non-AC family rooms, dormitories & Yatri dharamshalas near Vishnupad.',
    descHi: 'विष्णुपद मंदिर के पास स्वच्छ एसी कमरे एवं बजट तीर्थ धर्मशालाएं।',
  },
  FOOD: {
    labelEn: 'Satvik Food & Catering',
    labelHi: 'शुद्ध सात्विक भोजनालय',
    icon: UtensilsCrossed,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50/90',
    border: 'border-emerald-300',
    descEn: 'Pure No-Onion No-Garlic Satvik Yatri thalis and ceremonial shradh food.',
    descHi: 'बिना लहसुन-प्याज का शुद्ध सात्विक भोजन एवं तीर्थयात्री थाली।',
  },
  PUJA: {
    labelEn: 'Puja Kits & Tilkut',
    labelHi: 'पूजा सामग्री एवं तिलकुट',
    icon: ShoppingBag,
    color: 'text-pink-600',
    bg: 'bg-pink-50/90',
    border: 'border-pink-300',
    descEn: '48-Vedi Pind Daan samagri kits and Ramna Road famous jaggery/sugar Tilkut.',
    descHi: '48 वेदी पिंडदान सामग्री किट एवं रामना रोड का प्रसिद्ध शुद्ध तिलकुट।',
  },
  GUIDE: {
    labelEn: 'Gaya Guide & Shrines',
    labelHi: 'गया दर्शनीय स्थल गाइड',
    icon: Compass,
    color: 'text-purple-600',
    bg: 'bg-purple-50/90',
    border: 'border-purple-300',
    descEn: 'Guided tours for 48 Vedis, Vishnupad, Pretshila & Bodh Gaya Mahabodhi Temple.',
    descHi: '48 वेदी, प्रेतशिला, फल्गु एवं बोधगया महाबोधि मंदिर हेतु मार्गदर्शक गाइड।',
  },
};

function ServicesContent() {
  const { t, language } = useLanguage();
  const { sortByDistance, locationName } = useLocation();
  const searchParams = useSearchParams();
  const isHindi = language === 'hi';

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [servicesConfig, setServicesConfig] = useState<ServiceConfigItem[]>([]);

  useEffect(() => {
    // Read category from URL query param if present e.g. /services?category=PANDIT
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam.toUpperCase());
    }
    // Load state from UserStore & ContentStore
    setUsers(UserStore.getUsers());
    setServicesConfig(ContentStore.getServices());

    const handleStorage = () => {
      setUsers(UserStore.getUsers());
      setServicesConfig(ContentStore.getServices());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [searchParams]);

  // GRAPH ENGINE: Dynamically extract & loop through all registered categories (including custom vendor roles!)
  const dynamicCategories = useMemo(() => {
    const categorySet = new Set<string>(['ALL', 'PANDIT', 'DRIVER', 'HOTEL', 'FOOD', 'PUJA', 'GUIDE']);
    
    users.forEach((u) => {
      if (u.role && u.role !== 'PILGRIM' && u.role !== 'ADMIN' && u.role !== 'SUPER_ADMIN') {
        categorySet.add(u.role);
      }
      if (u.customRole && u.customRole.trim()) {
        const cleanCustom = u.customRole.trim().toUpperCase().replace(/\s+/g, '_');
        categorySet.add(cleanCustom);
      }
    });

    return Array.from(categorySet);
  }, [users]);

  // GRAPH ENGINE: Aggregate and sort all providers & services by distance
  const allListings = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      categoryKey: string;
      categoryDisplay: string;
      subtitle: string;
      phone: string;
      whatsapp: string;
      city: string;
      rating: number;
      avatarUrl?: string;
      isVerified: boolean;
      languages?: string[];
      details?: string;
      googleMapsUrl?: string;
      lat?: number;
      lng?: number;
    }> = [];

    // Map Users from UserStore
    users.forEach((u) => {
      if (u.role === 'PILGRIM' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN') return;

      const catKey = (u.customRole ? u.customRole.trim().toUpperCase().replace(/\s+/g, '_') : u.role) || 'OTHER';
      const meta = STANDARD_CATEGORY_META[catKey];
      const catDisplay = meta ? (isHindi ? meta.labelHi : meta.labelEn) : (u.customRole || u.role);

      items.push({
        id: u.id,
        title: u.name,
        categoryKey: catKey,
        categoryDisplay: catDisplay,
        subtitle: u.customRole || `${u.role} Service Provider`,
        phone: u.phone || '+91 8544491413',
        whatsapp: u.phone ? formatPhoneNumber(u.phone) : '918544491413',
        city: u.city || 'Gaya Ji',
        rating: u.rating || 4.9,
        avatarUrl: u.avatarUrl || u.profilePicUrl,
        isVerified: u.status === 'VERIFIED',
        languages: u.languages || ['Hindi', 'English'],
        details: 'GayaSeva Verified & Trusted Service Provider in Gaya Ji.',
        googleMapsUrl: u.googleMapsUrl,
        lat: u.lat,
        lng: u.lng,
      });
    });

    // Map Services from ContentStore
    servicesConfig.forEach((s) => {
      const catKey = s.category === 'PICK_DROP' ? 'DRIVER' : s.category === 'PUJA_KIT' ? 'PUJA' : s.category;
      const meta = STANDARD_CATEGORY_META[catKey];
      const catDisplay = meta ? (isHindi ? meta.labelHi : meta.labelEn) : s.category;

      items.push({
        id: s.id,
        title: s.title,
        categoryKey: catKey,
        categoryDisplay: catDisplay,
        subtitle: s.subtitle,
        phone: s.phone || '+91 8544491413',
        whatsapp: s.whatsapp || '918544491413',
        city: 'Gaya Ji',
        rating: 4.8,
        isVerified: true,
        details: s.details,
      });
    });

    return items;
  }, [users, servicesConfig, isHindi]);

  // Filter listings based on active category & search query
  const filteredListings = useMemo(() => {
    let result = allListings;
    if (selectedCategory !== 'ALL') {
      result = result.filter((item) => item.categoryKey === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.categoryDisplay.toLowerCase().includes(q)
      );
    }
    return sortByDistance(result);
  }, [allListings, selectedCategory, searchQuery, sortByDistance]);

  const activeCategoryMeta = STANDARD_CATEGORY_META[selectedCategory];

  return (
    <div className="min-h-screen bg-[#F8F6EF] font-sans text-slate-900 antialiased py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Header Hero Banner - High Contrast Premium Clean Typography */}
      <div className="bg-gradient-to-br from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-10 rounded-3xl border-2 border-[#F58220]/40 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-[#F58220]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
              <Layers className="w-4 h-4" />
              <span>DYNAMIC SERVICES & NETWORK</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {isHindi ? 'गया जी की सभी सत्यापित सेवाएं एवं प्रदाता' : 'Gaya Ji Verified Local Services & Providers'}
            </h1>
            
            <p className="text-slate-100 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
              {isHindi
                ? 'अपनी आवश्यकतानुसार श्रेणी चुनें — तीर्थ पुरोहित, टैक्सी/ऑटो, होटल, सात्विक भोजन, पूजा सामग्री एवं गाइड की 100% सीधी बुकिंग।'
                : 'Select any category below to discover nearby verified Purohits, Pick & Drop Cabs, Hotels, Satvik Food & Puja items with direct contact.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 space-y-2 w-full md:w-auto">
            <GayaSevaLogo size={56} className="mx-auto drop-shadow-md" />
            <div className="text-amber-300 font-extrabold text-xs tracking-wider uppercase">
              100% DIRECT & TRANSPARENT
            </div>
          </div>
        </div>

        {/* Instant Search Bar */}
        <div className="relative z-10 pt-2">
          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'प्रदाता, नाम या सेवा खोजें...' : 'Search by provider name, service or keyword...'}
              className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 placeholder:text-slate-500 rounded-2xl font-medium text-sm border-2 border-amber-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#F58220]"
            />
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC CATEGORY SELECTOR BAR (LOOPED GRAPH ENGINE) */}
      <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#F58220]" />
              <span>{isHindi ? 'सेवा की श्रेणी चुनें (Select Category):' : 'Select Service Category:'}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHindi ? 'सभी श्रेणियों में से अपनी पसंदीदा सेवा चुनें' : 'Filter service listings by category'}
            </p>
          </div>

          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold shrink-0">
            {filteredListings.length} {isHindi ? 'सेवाएं उपलब्ध' : 'Services Listed'}
          </div>
        </div>

        {/* Dynamic Category Pill Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none pt-1">
          {/* ALL Category Tab */}
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 border-2 ${
              selectedCategory === 'ALL'
                ? 'bg-[#1C0D02] text-[#F6C343] border-[#1C0D02] shadow-md scale-102'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#F58220] hover:bg-orange-50/50'
            }`}
          >
            <span>🌐 {isHindi ? 'सभी सेवाएं (All)' : 'All Services'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              selectedCategory === 'ALL' ? 'bg-[#F6C343] text-black' : 'bg-slate-200 text-slate-800'
            }`}>
              {allListings.length}
            </span>
          </button>

          {/* Dynamic Categories Looped */}
          {dynamicCategories.filter((cat) => cat !== 'ALL').map((catKey) => {
            const meta = STANDARD_CATEGORY_META[catKey];
            const isSelected = selectedCategory === catKey;
            const Icon = meta ? meta.icon : Sparkles;
            const label = meta ? (isHindi ? meta.labelHi : meta.labelEn) : catKey.replace(/_/g, ' ');
            const count = allListings.filter((i) => i.categoryKey === catKey).length;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2.5 border-2 ${
                  isSelected
                    ? 'bg-[#1C0D02] text-[#F6C343] border-[#1C0D02] shadow-md scale-102'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-[#F58220] hover:bg-orange-50/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F6C343]' : 'text-[#F58220]'}`} />
                <span>{label}</span>
                {count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                    isSelected ? 'bg-[#F6C343] text-black' : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE CATEGORY DETAILS CARD */}
      {selectedCategory !== 'ALL' && activeCategoryMeta && (
        <div className={`p-6 rounded-3xl border-2 ${activeCategoryMeta.border} ${activeCategoryMeta.bg} shadow-xs space-y-2 animate-fadeIn`}>
          <div className="flex items-center gap-2.5">
            {React.createElement(activeCategoryMeta.icon, { className: `w-6 h-6 ${activeCategoryMeta.color}` })}
            <h3 className="font-extrabold text-xl text-slate-900">
              {isHindi ? activeCategoryMeta.labelHi : activeCategoryMeta.labelEn}
            </h3>
            <span className="text-xs font-black bg-white px-3 py-1 rounded-full text-slate-900 border border-slate-300 shadow-2xs">
              Verified Category
            </span>
          </div>
          <p className="text-sm text-slate-800 font-semibold leading-relaxed">
            {isHindi ? activeCategoryMeta.descHi : activeCategoryMeta.descEn}
          </p>
        </div>
      )}

      {/* 4. DYNAMIC SERVICES & PROVIDERS LISTING FEED */}
      <div className="space-y-6">
        {filteredListings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="font-extrabold text-xl text-slate-900">No Services Found</h3>
            <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
              No registered service providers found matching your current selection or search term.
            </p>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
              className="px-6 py-3 bg-[#F58220] hover:bg-[#E07210] text-white text-sm font-extrabold rounded-xl shadow-md transition-all"
            >
              Reset Filter & View All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Category Pill & Verified Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 text-xs font-extrabold bg-amber-100 text-amber-950 rounded-full border border-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#F58220]" />
                      <span>{item.categoryDisplay}</span>
                    </span>

                    <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{item.rating}</span>
                    </span>
                  </div>

                  {/* Provider Header */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-[#1C0D02] font-black text-lg flex items-center justify-center shrink-0 border-2 border-amber-300 overflow-hidden shadow-sm">
                      {item.avatarUrl ? (
                        <img src={item.avatarUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        item.title.substring(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-lg text-slate-900 leading-snug flex items-center gap-1.5 flex-wrap">
                        <span>{item.title}</span>
                        {item.isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            Verified
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-bold text-[#F58220] tracking-wide">{item.subtitle}</p>
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#F58220]" />
                        <span>{item.city}</span>
                      </span>

                      {item.distanceFormatted && (
                        <span className="text-emerald-900 font-extrabold bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 text-[11px]">
                          📍 {item.distanceFormatted} away
                        </span>
                      )}
                    </div>

                    {item.languages && (
                      <p className="text-xs text-slate-700 font-medium">
                        Languages: <strong className="text-slate-900 font-bold">{item.languages.join(', ')}</strong>
                      </p>
                    )}

                    {item.details && (
                      <p className="text-xs text-slate-700 font-normal leading-relaxed pt-1 border-t border-slate-200">
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct Action Contact Buttons - Highly Visible & Large */}
                <div className="pt-2 flex items-center gap-2.5">
                  <a
                    href={`tel:${item.phone}`}
                    className="flex-1 py-3 px-4 bg-[#1C0D02] hover:bg-black text-[#F6C343] font-black text-xs rounded-2xl shadow-md text-center flex items-center justify-center gap-2 transition-all border border-amber-500/30 active:scale-95"
                  >
                    <Phone className="w-4 h-4 text-[#F58220]" />
                    <span>Call Now</span>
                  </a>

                  <a
                    href={getProfessionalWhatsAppUrl({
                      phone: item.whatsapp,
                      title: item.title,
                      subtitle: item.subtitle,
                      lang: language,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md text-center flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
                    title="WhatsApp Direct Inquiry"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. ARRANGEMAN MANAGEMENT BANNER */}
      <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#1C0D02] text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-[#F6C343] font-black text-xs tracking-wider uppercase border border-amber-400/40 inline-block">
            INNOVATED & MANAGED BY ARRANGEMAN
          </span>
          <h3 className="font-extrabold text-2xl text-white">Need Services Beyond Gaya Ji?</h3>
          <p className="text-sm text-slate-200 max-w-xl font-medium leading-relaxed">
            Visit <strong className="text-amber-300 font-bold">Arrangeman.com</strong> for multi-city travel, outstation taxi bookings, corporate events, and verified vendor solutions across India.
          </p>
        </div>
        
        <a
          href="https://arrangeman.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#F58220] hover:bg-[#E07210] text-white font-black text-sm px-7 py-4 rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 border border-orange-400/40 active:scale-95"
        >
          <span>Explore Arrangeman.com</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}

export default function DynamicServicesPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FFFDF9] p-8 text-center font-bold text-amber-900">Loading GayaSeva Services...</div>}>
      <ServicesContent />
    </React.Suspense>
  );
}
