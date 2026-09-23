'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Stethoscope, Phone, MapPin, Clock, ShieldCheck, Star, 
  Building2, AlertCircle, HeartPulse, PhoneCall, ExternalLink, 
  Search, ShieldAlert, CheckCircle2, Navigation, Ambulance, Sparkles
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';


interface HospitalInfo {
  id: string;
  nameEn: string;
  nameHi: string;
  type: 'MAJOR_PRIVATE' | 'GOVT_DISTRICT';
  rating?: number;
  isOpen24Hours: boolean;
  addressEn: string;
  addressHi: string;
  phone: string;
  cleanPhone: string;
  googleMapsQuery: string;
  specialitiesEn: string[];
  specialitiesHi: string[];
  badgeEn?: string;
  badgeHi?: string;
}

const HOSPITALS: HospitalInfo[] = [
  {
    id: 'snm-medica',
    nameEn: 'SNM Medica Multi Speciality Hospital',
    nameHi: 'एसएनएम मेडिका मल्टी स्पेशलिटी हॉस्पिटल (गया)',
    type: 'MAJOR_PRIVATE',
    rating: 4.9,
    isOpen24Hours: true,
    addressEn: 'Aliganj, Gaya, Bihar - 823001',
    addressHi: 'अलीनगर / अलीगंज, गया, बिहार',
    phone: '+91 62009 89651',
    cleanPhone: '6200989651',
    googleMapsQuery: 'SNM+Medica+Multi+Speciality+Hospital+Aliganj+Gaya',
    specialitiesEn: ['24/7 Emergency & ICU', 'Cardiology & Critical Care', 'Trauma & General Surgery', 'Modern Diagnostics'],
    specialitiesHi: ['24/7 आपातकालीन व आईसीयू', 'हृदय रोग एवं गंभीर देखभाल', 'ट्रॉमा व सर्जरी', 'डिजिटल पैथोलॉजी'],
    badgeEn: 'Best Hospital in Gaya',
    badgeHi: 'गया का सर्वश्रेष्ठ अस्पताल',
  },
  {
    id: 'arsh-superspeciality',
    nameEn: 'Arsh Superspeciality Hospital',
    nameHi: 'अर्श सुपरस्पेशलिटी हॉस्पिटल',
    type: 'MAJOR_PRIVATE',
    rating: 4.5,
    isOpen24Hours: true,
    addressEn: 'A.P. Colony, Gaya, Bihar - 823001',
    addressHi: 'ए.पी. कॉलोनी, गया, बिहार',
    phone: '+91 96619 13710',
    cleanPhone: '9661913710',
    googleMapsQuery: 'Arsh+Superspeciality+Hospital+AP+Colony+Gaya',
    specialitiesEn: ['24 Hours Emergency', 'Advanced Critical Care', 'Internal Medicine', 'Modular Operation Theater'],
    specialitiesHi: ['24 घंटे आपातकालीन सेवा', 'सुपरस्पेशलिटी देखभाल', 'जनरल मेडिसिन', 'ऑपरेशन थिएटर'],
    badgeEn: 'Superspeciality',
    badgeHi: 'सुपरस्पेशलिटी',
  },
  {
    id: 'naroma-ortho',
    nameEn: 'Naroma Advance Ortho & Multi Speciality Hospital',
    nameHi: 'नरोमा एडवांस ऑर्थो एवं मल्टी स्पेशलिटी हॉस्पिटल',
    type: 'MAJOR_PRIVATE',
    rating: 4.8,
    isOpen24Hours: true,
    addressEn: 'Katari Hill Road, Gaya (also serving Sherghati & Manpur)',
    addressHi: 'कटारी हिल रोड, गया (शेरघाटी एवं मानपुर क्षेत्र हेतु)',
    phone: '+91 98010 77628',
    cleanPhone: '9801077628',
    googleMapsQuery: 'Naroma+Advance+Ortho+Hospital+Katari+Hill+Road+Gaya',
    specialitiesEn: ['Advanced Joint & Bone Care', 'Trauma & Fracture Surgery', '24/7 Emergency Ward', 'Rehabilitation'],
    specialitiesHi: ['हड्डी व जोड़ रोग विशेषज्ञ', 'फैक्चर व ट्रॉमा सर्जरी', '24 घंटे इमरजेंसी', 'फिजियोथेरेपी'],
    badgeEn: 'Advanced Ortho Care',
    badgeHi: 'ऑर्थोपेडिक्स विशेषज्ञ',
  },
  {
    id: 'anmmch-govt',
    nameEn: 'Anugrah Narayan Magadh Medical College & Hospital (ANMMCH)',
    nameHi: 'अनुग्रह नारायण मगध मेडिकल कॉलेज एवं अस्पताल (ANMMCH)',
    type: 'GOVT_DISTRICT',
    isOpen24Hours: true,
    addressEn: 'Sherghati Road, Gaya, Bihar - 823001',
    addressHi: 'शेरघाटी रोड, गया, बिहार',
    phone: '0631-2410339',
    cleanPhone: '06312410339',
    googleMapsQuery: 'Anugrah+Narayan+Magadh+Medical+College+Gaya',
    specialitiesEn: ['Government Medical College', '24x7 Referral & Trauma Center', 'Free Emergency Services', 'Multi-Disciplinary Wards'],
    specialitiesHi: ['सरकारी मेडिकल कॉलेज', '24 घंटे रेफरल एवं इमरजेंसी', 'निशुल्क आपातकालीन इलाज', 'सभी विशेषज्ञ विभाग'],
    badgeEn: 'Govt Medical College',
    badgeHi: 'सरकारी मेडिकल कॉलेज',
  },
  {
    id: 'jp-narayan-govt',
    nameEn: 'Jai Prakash Narayan Hospital (District Hospital)',
    nameHi: 'जय प्रकाश नारायण अस्पताल (सदर जिला अस्पताल गया)',
    type: 'GOVT_DISTRICT',
    isOpen24Hours: true,
    addressEn: 'Golpatthar, G.B. Road, Gaya, Bihar - 823001',
    addressHi: 'गोलपत्थर, जी.बी. रोड, गया, बिहार',
    phone: '+91 9470003263',
    cleanPhone: '9470003263',
    googleMapsQuery: 'Jai+Prakash+Narayan+Hospital+Golpatthar+Gaya',
    specialitiesEn: ['Main District Government Hospital', '24x7 Emergency & Ambulance', 'District Admin Listed', 'Free OPD/IPD Care'],
    specialitiesHi: ['मुख्य जिला सरकारी अस्पताल', '24 घंटे आपातकालीन सेवा', 'जिला प्रशासन द्वारा सूचीकृत', 'निशुल्क ओपीडी व भर्ती'],
    badgeEn: 'District Hospital',
    badgeHi: 'सदर अस्पताल',
  },
  {
    id: 'prabhavati-govt',
    nameEn: 'Prabhavati Hospital (Govt Women & Child Care)',
    nameHi: 'प्रभावती अस्पताल (सरकारी महिला एवं शिशु अस्पताल)',
    type: 'GOVT_DISTRICT',
    isOpen24Hours: true,
    addressEn: 'Dak Bungalow Road, Gaya, Bihar - 823001',
    addressHi: 'डाक बंगला रोड, गया, बिहार',
    phone: '0631-2228458',
    cleanPhone: '06312228458',
    googleMapsQuery: 'Prabhavati+Hospital+Dak+Bungalow+Road+Gaya',
    specialitiesEn: ['Maternity & Women Healthcare', 'Pediatric & Neonatal Wards', 'District Admin Listed', '24x7 Emergency Care'],
    specialitiesHi: ['महिला एवं प्रसूति रोग विशेषज्ञ', 'शिशु स्वास्थ्य व एनआईसीयू', 'जिला प्रशासन सूचीकृत', '24 घंटे आपातकालीन'],
    badgeEn: 'Maternity & Child Care',
    badgeHi: 'महिला व शिशु अस्पताल',
  },
];

export default function HealthcarePage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MAJOR_PRIVATE' | 'GOVT_DISTRICT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = HOSPITALS.filter(h => {
    const matchesFilter = activeFilter === 'ALL' || h.type === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      h.nameEn.toLowerCase().includes(q) || 
      h.nameHi.toLowerCase().includes(q) || 
      h.addressEn.toLowerCase().includes(q) || 
      h.addressHi.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-gray-800 font-sans">
        
        {/* Header Hero Banner */}
        <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/30 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F6C343] font-semibold text-xs uppercase tracking-wider">
                <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
                <span>24/7 EMERGENCY MEDICAL &amp; HEALTHCARE DIRECTORY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
                🏥 {isHindi ? 'गया जी अस्पताल एवं आपातकालीन चिकित्सा सेवाएं' : 'Hospitals & Medical Services in Gaya Ji'}
              </h1>
              <p className="text-xs sm:text-sm text-[#F8F6EF]/80 max-w-2xl">
                {isHindi
                  ? 'तीर्थयात्रियों एवं बुजुर्गों हेतु गया जी के प्रमुख 24/7 सुपरस्पेशलिटी अस्पताल, जिला प्रशासन द्वारा सूचीकृत सरकारी अस्पताल एवं आपातकालीन फोन नंबर।'
                  : 'Essential 24/7 multi-speciality hospitals, government medical college, and district admin listed emergency facilities in Gaya for pilgrims and families.'}
              </p>
            </div>

            {/* Helpline Counter */}
            <div className="bg-red-500/20 p-4 rounded-2xl border border-red-500/30 text-right space-y-1">
              <span className="text-[10px] text-red-200 font-bold uppercase block tracking-wider">AMBULANCE / EMERGENCY</span>
              <a href="tel:108" className="text-xl font-bold text-white hover:text-[#F6C343] transition flex items-center justify-end gap-1.5">
                <PhoneCall className="w-5 h-5 text-red-400 shrink-0" />
                <span>Dial 108</span>
              </a>
              <span className="text-[10px] text-white/70 block">National Ambulance Helpline</span>
            </div>
          </div>
        </div>

        {/* Quick Pilgrim Medical Care Tips Banner */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 space-y-2 text-red-950">
          <div className="flex items-center gap-2 font-bold text-sm text-red-900">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <span>{isHindi ? 'बुजुर्ग यात्रियों हेतु विशेष स्वास्थ्य सलाह' : 'Essential Health Guidance for Senior Pilgrims'}</span>
          </div>
          <p className="text-xs text-red-900/90 leading-relaxed">
            {isHindi
              ? 'विष्णुपद एवं फल्गु नदी तर्पण के समय भीषण धूप में पर्याप्त पानी पिएं। यदि किसी परिजन का स्वास्थ्य बिगड़े, तो तुरंत 108 डायल करें या नीचे दिए गए 24/7 अस्पतालों के नंबर पर संपर्क करें।'
              : 'Gaya Ji experiences high temperatures during peak pilgrimage seasons. Stay well-hydrated during Falgu river rituals and keep prescription medications handy. All listed hospitals provide 24/7 emergency & ambulance services.'}
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeFilter === 'ALL' ? 'bg-[#2A180B] text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Facilities ({HOSPITALS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('MAJOR_PRIVATE')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeFilter === 'MAJOR_PRIVATE' ? 'bg-[#2A180B] text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Private Multispeciality (3)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('GOVT_DISTRICT')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeFilter === 'GOVT_DISTRICT' ? 'bg-[#2A180B] text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Govt &amp; District Admin (3)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isHindi ? 'अस्पताल या स्थान खोजें...' : 'Search hospital or location...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Hospital List Grid — Fully Unlocked (Emergency Service) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHospitals.map((h) => (
            <div key={h.id} className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-lg transition space-y-4 p-6 flex flex-col justify-between">

              <div className="space-y-3">
                {/* Header Badge & Name */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                        h.type === 'MAJOR_PRIVATE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {isHindi ? h.badgeHi : h.badgeEn}
                      </span>
                      {h.isOpen24Hours && (
                        <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-red-500" />
                          <span>24/7 Open</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#4A2E1A] pt-1">
                      {isHindi ? h.nameHi : h.nameEn}
                    </h3>
                  </div>
                  {h.rating && (
                    <div className="bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-xl text-center shrink-0">
                      <span className="text-sm font-bold text-amber-950 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{h.rating}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Location — always visible */}
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <MapPin className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
                  <span>{isHindi ? h.addressHi : h.addressEn}</span>
                </div>

                {/* Speciality Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(isHindi ? h.specialitiesHi : h.specialitiesEn).map((spec, i) => (
                    <span key={i} className="text-[11px] bg-orange-50 text-amber-900 border border-orange-100 px-2.5 py-1 rounded-lg">
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Phone & Directions — fully unlocked */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <a
                  href={`tel:${h.cleanPhone}`}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-2xl transition shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>{h.phone}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.googleMapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 bg-amber-50 text-amber-950 border border-amber-300 py-2 rounded-xl font-semibold text-xs hover:bg-amber-100 transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#F58220]" />
                  <span>{isHindi ? 'गूगल मैप्स नेविगेशन' : 'Google Maps Directions'}</span>
                  <ExternalLink className="w-3 h-3 text-amber-700" />
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Additional Emergency Contact Info */}
        <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-[#F6C343] font-bold text-xs uppercase tracking-wider">
            <Ambulance className="w-4 h-4 text-[#F58220]" />
            <span>GAYA DISTRICT EMERGENCY CONTROL ROOM</span>
          </div>

          <h3 className="text-xl font-serif font-bold text-white">
            {isHindi ? 'गया जिला प्रशासन आपातकालीन नंबर' : 'Gaya District Administration Helplines'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[#F6C343] font-bold block">🚨 District Police Helpline</span>
              <a href="tel:112" className="text-white font-bold underline hover:text-[#F6C343]">Dial 112 (Emergency)</a>
            </div>
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[#F6C343] font-bold block">🚑 ANMMCH Hospital Referral</span>
              <a href="tel:06312410339" className="text-white font-bold underline hover:text-[#F6C343]">0631-2410339</a>
            </div>
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[#F6C343] font-bold block">🏥 District Hospital JP Narayan</span>
              <a href="tel:9470003263" className="text-white font-bold underline hover:text-[#F6C343]">9470003263</a>
            </div>
          </div>
        </div>

    </div>
  );
}
