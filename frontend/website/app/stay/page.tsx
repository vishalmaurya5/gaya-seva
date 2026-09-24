'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Hotel, Search, ShieldCheck, Phone, MessageSquare, Car, Star, 
  MapPin, CheckCircle2, Building2, Sparkles, Filter, Navigation, ExternalLink 
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { DirectoryGatedView } from '@/components/ui/DirectoryGatedView';
import { LockedContactBox } from '@/components/ui/LockedContactBox';
import { useLanguage } from '@/context/LanguageContext';

interface HotelItem {
  id: string;
  name: string;
  rating: number;
  locationEn: string;
  locationHi: string;
  category: 'BIHAR_TOURISM' | 'MAJOR_HOTEL' | 'RESORT' | 'DHARAMSHALA' | 'HOMESTAY';
  capacityEn: string;
  capacityHi: string;
  parking: boolean;
  phone: string;
  cleanPhone: string;
  isBiharTourismRecognized: boolean;
  googleMapsQuery: string;
  availabilityStatus?: 'AVAILABLE' | 'BOOKED';
  isRegistered?: boolean;
}

const OFFICIAL_HOTELS: HotelItem[] = [
  {
    id: 'htl-manisha',
    name: 'Hotel Manisha International',
    rating: 4.0,
    locationEn: 'Station Road, Gol Bagicha, Gaya, Bihar',
    locationHi: 'स्टेशन रोड, गोल बगीचा, गया, बिहार',
    category: 'MAJOR_HOTEL',
    capacityEn: 'AC Family Rooms, Executive Suites & Dining',
    capacityHi: 'एसी फैमिली रूम, सुइट्स एवं भोजनालय',
    parking: true,
    phone: '+91 72094 09663',
    cleanPhone: '7209409663',
    isBiharTourismRecognized: false,
    googleMapsQuery: 'Hotel+Manisha+International+Station+Road+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-gr-intl',
    name: 'HOTEL GR INTERNATIONAL',
    rating: 4.4,
    locationEn: 'Nagmatia Road, Nagmatia Colony, Gaya, Bihar',
    locationHi: 'नागमटिया रोड, नागमटिया कॉलोनी, गया, बिहार',
    category: 'MAJOR_HOTEL',
    capacityEn: 'Deluxe AC Rooms, Banquet & Restaurant',
    capacityHi: 'डेलक्स एसी कमरे, बैंक्वेट एवं भोजनालय',
    parking: true,
    phone: '+91 99559 93644',
    cleanPhone: '9955993644',
    isBiharTourismRecognized: false,
    googleMapsQuery: 'HOTEL+GR+INTERNATIONAL+Nagmatia+Road+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-bodhi-palace',
    name: 'The Bodhi Palace Resort',
    rating: 4.4,
    locationEn: 'Bodhgaya Road, near Gaya International Airport',
    locationHi: 'बोधगया रोड, गया अंतरराष्ट्रीय हवाई अड्डे के समीप',
    category: 'RESORT',
    capacityEn: 'Luxury Resort Cottages, Swimming Pool & Dining',
    capacityHi: 'लक्जरी रिसॉर्ट कॉटेज, स्विमिंग पूल एवं कैफे',
    parking: true,
    phone: '+91 93415 12721',
    cleanPhone: '9341512721',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'The+Bodhi+Palace+Resort+Bodhgaya+Road+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-mehta-star',
    name: 'Hotel Mehta Star / Sukhdeo Palace',
    rating: 4.5,
    locationEn: 'Manpur, Gaya, Bihar',
    locationHi: 'मानपुर, गया, बिहार',
    category: 'BIHAR_TOURISM',
    capacityEn: 'AC Deluxe Rooms & Wedding Banquet',
    capacityHi: 'एसी डेलक्स कमरे एवं वैवाहिक हॉल',
    parking: true,
    phone: '+91 70045 04212',
    cleanPhone: '7004504212',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'Hotel+Mehta+Star+Manpur+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-supreme',
    name: 'The Supreme Hotel & Banquet',
    rating: 4.6,
    locationEn: 'Police Line Road, Gaya, Bihar',
    locationHi: 'पुलिस लाइन रोड, गया, बिहार',
    category: 'BIHAR_TOURISM',
    capacityEn: 'Premium Family Rooms & Banquet Hall',
    capacityHi: 'प्रीमियम फैमिली रूम एवं बैंक्वेट हॉल',
    parking: true,
    phone: '+91 90316 03002',
    cleanPhone: '9031603002',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'The+Supreme+Hotel+Police+Line+Road+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-mahabodhi-resort',
    name: 'Mahabodhi Hotel Resort & Convention Centre',
    rating: 4.7,
    locationEn: 'Near Hariharpur, Bodh Gaya, Bihar',
    locationHi: 'हरिहरपुर के समीप, बोधगया, बिहार',
    category: 'RESORT',
    capacityEn: '5-Star Convention Resort & Spa',
    capacityHi: '5-स्टार कन्वेंशन रिसॉर्ट एवं स्पा',
    parking: true,
    phone: '+91 75469 88900',
    cleanPhone: '7546988900',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'Mahabodhi+Hotel+Resort+Bodh+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-delta-intl',
    name: 'Hotel Delta International',
    rating: 4.5,
    locationEn: 'Domuhan, Bodh Gaya, Bihar',
    locationHi: 'दोमुहान, बोधगया, बिहार',
    category: 'BIHAR_TOURISM',
    capacityEn: 'International Standard AC Suites & Restaurant',
    capacityHi: 'अंतरराष्ट्रीय मानक एसी सुइट्स एवं रेस्तरां',
    parking: true,
    phone: '+91 99730 11675',
    cleanPhone: '9973011675',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'Hotel+Delta+International+Domuhan+Bodh+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-taj-darbar',
    name: 'Hotel Taj Darbar',
    rating: 4.6,
    locationEn: 'Bodh Gaya (Near Mahabodhi Temple)',
    locationHi: 'बोधगया (महाबोधि मंदिर के पास)',
    category: 'MAJOR_HOTEL',
    capacityEn: 'Pilgrim Deluxe Rooms & Asian Buffet',
    capacityHi: 'तीर्थयात्री डेलक्स कमरे एवं एशियन बफे',
    parking: true,
    phone: '+91 77393 20524',
    cleanPhone: '7739320524',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'Hotel+Taj+Darbar+Bodh+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-dhamma-grand',
    name: 'Dhamma Grand Hotel & Resort',
    rating: 4.7,
    locationEn: 'Domuhan, Bodh Gaya, Bihar',
    locationHi: 'दोमुहान, बोधगया, बिहार',
    category: 'RESORT',
    capacityEn: 'Meditation Resort & Lush Gardens',
    capacityHi: 'ध्यान रिसॉर्ट एवं मनोरम उद्यान',
    parking: true,
    phone: '0631-2200121',
    cleanPhone: '06312200121',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'Dhamma+Grand+Hotel+Domuhan+Bodh+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-bodhgaya-regency',
    name: 'Bodhgaya Regency Hotel',
    rating: 4.5,
    locationEn: 'Bodh Gaya, Bihar',
    locationHi: 'बोधगया, बिहार',
    category: 'BIHAR_TOURISM',
    capacityEn: 'Heritage Deluxe Rooms & Multi-Cuisine',
    capacityHi: 'हेरिटेज डेलक्स रूम एवं मल्टी-कुजीन',
    parking: true,
    phone: '+91 70701 92141',
    cleanPhone: '7070192141',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'Bodhgaya+Regency+Hotel+Bodh+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-marasa-sarovar',
    name: 'Hotel Marasa Sarovar Premiere',
    rating: 4.9,
    locationEn: 'Bodh Gaya, Bihar',
    locationHi: 'बोधगया, बिहार',
    category: 'RESORT',
    capacityEn: 'Luxury 5-Star Pilgrimage Hotel & Wellness Spa',
    capacityHi: '5-स्टार लक्जरी तीर्थ होटल एवं वैलनेस स्पा',
    parking: true,
    phone: '+91 88003 90242',
    cleanPhone: '8800390242',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'Hotel+Marasa+Sarovar+Premiere+Bodh+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-anand-homestay',
    name: 'Anand Homestay',
    rating: 4.8,
    locationEn: 'Bodh Gaya, Bihar',
    locationHi: 'बोधगaya, बिहार',
    category: 'HOMESTAY',
    capacityEn: 'Homely Family Rooms & Home-cooked Food',
    capacityHi: 'पारिवारिक होमस्टे एवं घर का बना सात्विक भोजन',
    parking: true,
    phone: '+91 99399 95342',
    cleanPhone: '9939995342',
    isBiharTourismRecognized: true,
    googleMapsQuery: 'Anand+Homestay+Bodh+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-gayaji-guest',
    name: 'Gaya Ji Teerth Guest House',
    rating: 4.8,
    locationEn: 'Near Vishnupad Temple Corridor, Gaya',
    locationHi: 'विष्णुपद मंदिर कॉरिडोर के पास, गया',
    category: 'DHARAMSHALA',
    capacityEn: '2-4 Bed Family Rooms & Panda Care',
    capacityHi: '2-4 बेड फैमिली कमरे एवं पंडा सेवा',
    parking: true,
    phone: '+91 98765 43230',
    cleanPhone: '9876543230',
    isBiharTourismRecognized: false,
    googleMapsQuery: 'Vishnupad+Temple+Gaya',
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'htl-krishna-dharamshala',
    name: 'Shree Krishna Dharamshala',
    rating: 4.7,
    locationEn: 'Station Road, Gaya Ji',
    locationHi: 'स्टेशन रोड, गया जी',
    category: 'DHARAMSHALA',
    capacityEn: 'Budget Yatri Dormitory & AC Family Rooms',
    capacityHi: 'बजट तीर्थयात्री डॉर्मिटरी एवं एसी रूम',
    parking: false,
    phone: '+91 98765 43221',
    cleanPhone: '9876543221',
    isBiharTourismRecognized: false,
    googleMapsQuery: 'Gaya+Junction+Railway+Station',
    availabilityStatus: 'AVAILABLE',
  },
];

export default function StayPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'BIHAR_TOURISM' | 'GAYA_CITY' | 'BODH_GAYA' | 'DHARAMSHALA'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setUsers(UserStore.getUsers());
    const handleStorage = () => setUsers(UserStore.getUsers());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const registeredHotels = users.filter((u) => u.role === 'HOTEL');

  const combinedHotels = useMemo<HotelItem[]>(() => {
    const fromUserStore: HotelItem[] = registeredHotels.map((u) => ({
      id: u.id,
      name: u.name,
      rating: u.rating || 4.8,
      locationEn: u.city || 'Vishnupad Temple Zone, Gaya',
      locationHi: u.city || 'विष्णुपद मंदिर क्षेत्र, गया',
      category: 'MAJOR_HOTEL',
      capacityEn: u.customRole || 'Family AC Rooms & Dharamshala',
      capacityHi: u.customRole || 'फैमिली एसी कमरे एवं धर्मशाला',
      parking: true,
      phone: u.phone,
      cleanPhone: u.phone.replace(/[^0-9]/g, ''),
      isBiharTourismRecognized: false,
      googleMapsQuery: encodeURIComponent(u.name + ' Gaya'),
      availabilityStatus: u.availabilityStatus || 'AVAILABLE',
      isRegistered: true,
    }));

    const officialList: HotelItem[] = OFFICIAL_HOTELS.map((oh) => ({
      ...oh,
      isRegistered: false,
    }));

    const merged = [
      ...fromUserStore,
      ...officialList.filter((oh) => !fromUserStore.some((rh) => rh.cleanPhone === oh.cleanPhone)),
    ];
    return merged;
  }, [registeredHotels]);

  const filteredHotels = useMemo(() => {
    return combinedHotels.filter(item => {
      let matchesCat = true;
      if (activeCategory === 'BIHAR_TOURISM') matchesCat = item.isBiharTourismRecognized;
      else if (activeCategory === 'GAYA_CITY') matchesCat = item.locationEn.toLowerCase().includes('gaya') && !item.locationEn.toLowerCase().includes('bodh gaya');
      else if (activeCategory === 'BODH_GAYA') matchesCat = item.locationEn.toLowerCase().includes('bodh gaya') || item.locationEn.toLowerCase().includes('bodhgaya');
      else if (activeCategory === 'DHARAMSHALA') matchesCat = item.category === 'DHARAMSHALA' || item.category === 'HOMESTAY';

      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        item.name.toLowerCase().includes(q) || 
        item.locationEn.toLowerCase().includes(q) || 
        item.locationHi.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [combinedHotels, activeCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900">
      
      {/* Hero Header */}
      <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/20 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#F6C343] font-semibold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#F58220]" />
              <span>OFFICIAL BIHAR TOURISM RECOGNIZED DIRECTORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
              🏨 {isHindi ? 'गया जी एवं बोधगया होटल व धर्मशालाएं' : 'Hotels & Accommodation in Gaya & Bodh Gaya'}
            </h1>
            <p className="text-xs sm:text-sm text-[#F8F6EF]/80 max-w-2xl">
              {isHindi
                ? 'बिहार पर्यटन द्वारा मान्यता प्राप्त होटल, गया स्टेशन व विष्णुपद के पास बजट धर्मशालाएं एवं बोधगया 5-स्टार रिसॉर्ट।'
                : 'Bihar Tourism recognized hotel directory, budget pilgrim dharamshalas near Vishnupad & Station, and luxury Bodh Gaya resorts.'}
            </p>
          </div>

          <div className="bg-amber-500/20 p-3 rounded-2xl border border-amber-500/30 text-right shrink-0 hidden sm:block">
            <span className="text-xs text-[#F6C343] font-bold block">100% Direct Booking</span>
            <span className="text-[11px] text-white/80">0% Commission Charged</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeCategory === 'ALL' ? 'bg-[#2A180B] text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Stays ({combinedHotels.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('BIHAR_TOURISM')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
              activeCategory === 'BIHAR_TOURISM' ? 'bg-[#2A180B] text-white shadow-xs font-bold' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Bihar Tourism Listed</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('GAYA_CITY')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeCategory === 'GAYA_CITY' ? 'bg-[#2A180B] text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gaya City / Station
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('BODH_GAYA')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeCategory === 'BODH_GAYA' ? 'bg-[#2A180B] text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bodh Gaya Resorts
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('DHARAMSHALA')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeCategory === 'DHARAMSHALA' ? 'bg-[#2A180B] text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dharamshala &amp; Homestay
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={isHindi ? 'होटल या स्थान खोजें...' : 'Search hotel or area...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Hotel Cards List */}
      <DirectoryGatedView categoryName={isHindi ? 'होटल एवं धर्मशालाएं' : 'Hotels & Dharamshalas'} totalCount={filteredHotels.length} maxPreviewCount={2}>
        {(visibleCount, hasAccess) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredHotels.slice(0, visibleCount).map((htl) => {
              const isAvailable = htl.availabilityStatus !== 'BOOKED';
              return (
                <div key={htl.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {htl.isBiharTourismRecognized && (
                            <span className="px-2.5 py-1 text-[10px] font-extrabold bg-amber-100 text-amber-950 rounded-full border border-amber-300 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-600" /> Bihar Tourism Recognized
                            </span>
                          )}

                          <span className="px-2.5 py-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-950 rounded-full border border-emerald-300 inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-700" /> GayaSeva Verified
                          </span>

                          {htl.isRegistered ? (
                            isAvailable ? (
                              <span className="px-2.5 py-1 text-[10px] font-black bg-emerald-500 text-slate-950 rounded-full inline-flex items-center gap-1 shadow-xs">
                                🟢 AVAILABLE FOR STAY
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 text-[10px] font-black bg-red-600 text-white rounded-full inline-flex items-center gap-1 shadow-xs">
                                🔴 FULLY BOOKED
                              </span>
                            )
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] font-black bg-amber-100 text-amber-950 rounded-full inline-flex items-center gap-1 border border-amber-400 shadow-xs">
                              📋 ENQUIRY NOW (पूछताछ उपलब्ध)
                            </span>
                          )}
                        </div>

                        <h3 className="font-sans font-black text-lg text-slate-950 tracking-tight pt-1 leading-snug">
                          {htl.name}
                        </h3>
                      </div>
                      
                      <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">⭐ {htl.rating}</span>
                    </div>

                    <div className="text-xs text-slate-900 font-bold space-y-1.5 bg-[#FDFBF7] p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
                      <p className="flex items-start gap-1.5 text-slate-900 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-[#F58220] shrink-0 mt-0.5" />
                        <span className="text-slate-950 font-extrabold">{hasAccess ? (isHindi ? htl.locationHi : htl.locationEn) : (isHindi ? '📍 सटीक पता एवं फोन नंबर लॉक है' : '📍 Location & Phone Locked')}</span>
                      </p>
                      <p className="text-slate-900 font-bold">🛏️ {isHindi ? htl.capacityHi : htl.capacityEn}</p>
                      <p className="text-slate-800 font-semibold">🚗 {htl.parking ? (isHindi ? 'वाहन पार्किंग सुविधा उपलब्ध' : 'Vehicle Parking Available') : (isHindi ? 'सीमित पार्किंग' : 'Limited Parking')}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <LockedContactBox 
                      providerId={htl.id} 
                      providerName={htl.name} 
                      defaultPhone={htl.phone}
                      serviceCategory="Hotels & Dharamshala Stay"
                    />

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(htl.googleMapsQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-800 bg-white border border-amber-200 py-1.5 rounded-xl hover:bg-amber-50 transition"
                    >
                      <Navigation className="w-3 h-3 text-[#F58220]" />
                      <span>{isHindi ? 'गूगल मैप्स नेविगेशन' : 'Google Maps Directions'}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DirectoryGatedView>
    </div>
  );
}

