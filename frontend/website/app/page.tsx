'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Flame, 
  Hotel, 
  ShoppingBag, 
  Map, 
  HelpCircle, 
  Search, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Bot, 
  ArrowRight,
  Star,
  Compass,
  Navigation,
  Sparkles,
  BookOpen,
  Waves,
  Utensils,
  CheckCircle2,
  Calendar,
  PhoneCall,
  ChevronDown,
  Info,
  ShieldAlert,
  Megaphone,
  Clock,
  Landmark,
  UserCheck,
  Languages,
  Heart,
  Zap,
  Check,
  Quote,
  MapPin,
  Users,
  Award,
  QrCode,
  HeartHandshake,
  Download,
  AlertTriangle,
  Hospital,
  Train,
  CheckSquare,
  Lock,
  BadgeCheck,
  ThumbsUp,
  FileText,
  Bus,
  Route,
  Globe,
  Trees,
  Layers,
  ShoppingBasket
} from 'lucide-react';

import { PopupAd } from '@/components/PopupAd';
import { RectangularBannerSlider } from '@/components/RectangularBannerSlider';
import { ContentStore, SacredPlace } from '@/lib/contentStore';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { sortByDistance, locationName, requestLocation } = useLocation();
  const [activeTab, setActiveTab] = useState<'TAXI' | 'PANDIT' | 'STAY' | 'FOOD' | 'MALLS' | 'HELP'>('TAXI');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dynamicPlaces, setDynamicPlaces] = useState<SacredPlace[]>([]);
  const [activeItineraryDay, setActiveItineraryDay] = useState<1 | 2 | 3>(1);

  // Multi-Search Bar State
  const [searchCategory, setSearchCategory] = useState<string>('PANDIT');

  const navigateToCategoryPage = (category: string) => {
    if (category === 'PANDIT') {
      window.location.href = `/pandit`;
    } else if (category === 'TAXI') {
      window.location.href = `/pick-drop`;
    } else if (category === 'STAY') {
      window.location.href = `/stay`;
    } else if (category === 'FOOD') {
      window.location.href = `/food`;
    } else if (category === 'PUJA') {
      window.location.href = `/puja-material`;
    } else if (category === 'BARBER') {
      window.location.href = `/services?category=BARBER`;
    } else if (category === 'GUIDE') {
      window.location.href = `/gaya`;
    } else if (category === 'LOST_FOUND') {
      window.location.href = `/help/lost-and-found`;
    } else if (category === 'ALL') {
      window.location.href = `/services`;
    } else {
      window.location.href = `/services`;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToCategoryPage(searchCategory);
  };

  useEffect(() => {
    setDynamicPlaces(ContentStore.getPlaces());
    const handleStorage = () => setDynamicPlaces(ContentStore.getPlaces());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const sortedPlaces = sortByDistance(
    dynamicPlaces.length > 0 ? dynamicPlaces : ContentStore.getPlaces()
  );

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const isHindi = language === 'hi';

  const stats = [
    { label: isHindi ? 'तीर्थयात्री सेवा' : 'Pilgrims Served', value: '50,000+', icon: Users, color: 'text-amber-500' },
    { label: isHindi ? 'सत्यापित सेवा प्रदाता' : 'Verified Providers', value: '100%', icon: ShieldCheck, color: 'text-emerald-500' },
    { label: isHindi ? 'औसत पिकअप समय' : 'Avg Pickup Time', value: '15 Mins', icon: Clock, color: 'text-blue-500' },
    { label: isHindi ? 'हेल्पलाइन सपोर्ट' : 'Helpline Support', value: '24 / 7', icon: PhoneCall, color: 'text-red-500' },
  ];

  const testimonials = [
    {
      name: 'Rameshwar Banerjee',
      location: 'Kolkata, West Bengal',
      text: isHindi ? 'गयासेवा के ज़रिये पंडितजी और टैक्सी पहले से ही बुक कर ली थी। फल्गु घाट पर पिंड दान का अनुभव बहुत सुगम और पारदर्शी रहा।' : 'Booked Panditji and Taxi pre-arrival through GayaSeva. Pind Daan at Falgu Ghat was completely seamless with transparent pricing.',
      rating: 5,
      date: 'Pitru Paksha Pilgrim'
    },
    {
      name: 'Sunita Sharma',
      location: 'Varanasi, UP',
      text: isHindi ? 'विष्णुपद मंदिर के पास स्वच्छ धर्मशाला और सात्विक भोजन मिला। बुजुर्गों के लिए व्हीलचेयर सहायता भी तुरंत मिली।' : 'Found a clean, verified dharamshala near Vishnupad Temple with satvik food. Wheelchair assistance for elderly parents was provided instantly.',
      rating: 5,
      date: 'Family Pilgrim'
    },
    {
      name: 'Vikramaditya Rao',
      location: 'Hyderabad, Telangana',
      text: isHindi ? 'गया जंक्शन से बोधगया के लिए रात 2 बजे भी तुरंत एसी कैब उपलब्ध हुई। बहुत ही सुरक्षित और आधिकारिक सेवा!' : 'Got a clean AC sedan cab at 2 AM from Gaya Junction to Bodh Gaya. Completely safe, official yatri service!',
      rating: 5,
      date: 'Teerth Yatri'
    }
  ];

  const faqs = [
    {
      q: isHindi ? 'गया जी में पिंडदान की सही प्रक्रिया क्या है?' : 'What is the complete Pind Daan process in Gaya Ji?',
      a: isHindi 
        ? 'पिंडदान मुख्य रूप से फल्गु नदी तट, विष्णुपद मंदिर और अक्षयवट वृक्ष पर संपन्न किया जाता है। गयासेवा के माध्यम से आप पहले ही अनुभवी एवं अधिकृत तीर्थ पुरोहितों से संपर्क कर सकते हैं।'
        : 'Pind Daan is traditionally performed at Falgu River banks, Vishnupad Temple, and Akshayavat. GayaSeva connects you directly with verified Teerth Pandits with fixed transparent rituals.'
    },
    {
      q: isHindi ? 'क्या गया जंक्शन या एयरपोर्ट से पिक एंड ड्रॉप की सुविधा उपलब्ध है?' : 'Is Pick & Drop available from Gaya Junction & Airport?',
      a: isHindi 
        ? 'हाँ! गयासेवा पर एसी / नॉन-एसी टैक्सी, ऑटो और ई-रिक्शा तुरंत लाइव बुकिंग एवं जीपीएस डिस्टेंस ट्रैकिंग के साथ उपलब्ध हैं।'
        : 'Yes! Instant pick & drop cabs, sedans, SUVs, and auto-rickshaws are available 24/7 directly with verified local drivers.'
    },
    {
      q: isHindi ? 'क्या होटल और धर्मशाला की ऑनलाइन प्री-बुकिंग सुरक्षित है?' : 'Is pre-booking hotels and dharamshalas safe?',
      a: isHindi 
        ? 'जी बिल्कुल! सभी सूचीबद्ध कमरे एवं गेस्ट हाउस गया प्रशासन एवं स्थानीय सत्यापन के बाद ही दिखाए जाते हैं।'
        : 'Absolutely. All listed hotels and dharamshalas are strictly background checked and physically verified.'
    },
    {
      q: isHindi ? 'आपातकालीन सहायता के लिए हेल्पलाइन नंबर क्या है?' : 'What is the emergency Yatri helpline number?',
      a: isHindi 
        ? 'किसी भी आपात स्थिति में 24/7 हेल्पलाइन नंबर +91 85444 91413 या 112 पर तुरंत संपर्क करें।'
        : 'For any emergency assistance, call our 24/7 dedicated Yatri helpline +91 85444 91413 immediately.'
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 pb-24 bg-[#FAFAF7] text-[#2D1A0E] overflow-x-hidden selection:bg-[#F58220] selection:text-white">
      {/* Active Popup Modal */}
      <PopupAd />

      {/* SECTION 1: 📢 TOP PITRU PAKSHA & TEERTH TICKER BAR */}
      <div className="bg-gradient-to-r from-[#180F08] via-[#2A180B] to-[#180F08] text-white py-1.5 px-3 sm:px-8 xl:px-12 text-center border-b border-[#F58220]/25 text-[11px] sm:text-xs font-medium relative z-20 max-w-full overflow-hidden">
        <div className="w-full flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs max-w-full">
          <div className="flex items-center gap-1.5 mx-auto md:mx-0 truncate max-w-full">
            <span className="px-2 py-0.5 bg-[#F58220] text-white font-extrabold rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase animate-pulse flex items-center gap-1 shadow-sm shrink-0">
              <Megaphone className="w-3 h-3" /> PITRU PAKSHA
            </span>
            <span className="text-[#F6C343] font-semibold truncate">
              {t('sec1Notice')}
            </span>
          </div>
          <div className="flex items-center gap-2 mx-auto md:mx-0 shrink-0">
            <a 
              href="tel:+918544491413" 
              className="text-[#F6C343] hover:text-white font-bold underline flex items-center gap-1 transition-colors text-[10px] sm:text-xs"
            >
              <PhoneCall className="w-3 h-3 text-[#F58220]" />
              <span>{isHindi ? '24/7 हेल्पलाइन: +91 85444 91413' : 'Helpline: +91 85444 91413'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 2: 🏛️ MASTER HERO SECTION WITH BACKGROUND IMAGE */}
      <div className="w-full px-2 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 max-w-full overflow-hidden">
        <section className="relative min-h-[460px] sm:min-h-[540px] bg-[url('/hero-background.png')] bg-cover bg-center bg-no-repeat text-white py-8 sm:py-14 px-3 sm:px-8 rounded-3xl border-2 border-[#F58220]/35 shadow-2xl overflow-hidden max-w-full">
          {/* Dark Gradient Overlay for Maximum Text Visibility & Background Richness */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C0D02]/85 via-[#2A180B]/75 to-[#1C0D02]/90 pointer-events-none" />

          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#F58220]/25 via-[#F59E0B]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-[#F58220]/15 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute top-1/3 left-0 w-[400px] h-[300px] bg-[#F6C343]/10 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-6xl mx-auto text-center space-y-4 sm:space-y-7 max-w-full">
          {/* Logo & Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-2.5 max-w-full"
          >
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#F58220] via-[#F6C343] to-[#D97706] opacity-75 blur group-hover:opacity-100 transition duration-500 animate-pulse" />
              <GayaSevaLogo 
                size={80} 
                className="relative drop-shadow-[0_12px_35px_rgba(245,130,32,0.5)] transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <span className="px-3 sm:px-4 py-1 rounded-full bg-[#F58220]/15 text-[#F6C343] font-bold text-[10px] sm:text-xs uppercase tracking-wider border border-[#F58220]/30 inline-flex items-center gap-1.5 backdrop-blur-md shadow-inner max-w-full truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#F58220] shrink-0" />
              <span className="truncate">{t('heroBadge')}</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-black tracking-tight leading-snug text-white drop-shadow-lg max-w-4xl mx-auto break-words"
          >
            {t('heroTitle1')} — <span className="bg-gradient-to-r from-[#F6C343] via-[#F58220] to-[#FDE047] bg-clip-text text-transparent">{t('heroTitleHighlight')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xs sm:text-base lg:text-lg text-slate-100 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-sm px-2"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* SECTION 3: 🔍 ULTRA-PROFESSIONAL MULTI-SEARCH BAR */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-2"
          >
            <form onSubmit={handleSearchSubmit} className="bg-white/95 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 text-gray-900 shadow-2xl border border-amber-500/30 max-w-3xl mx-auto font-sans">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                
                {/* Single Field: Service Category */}
                <div className="flex-1 bg-gray-50/90 hover:bg-white p-3.5 rounded-2xl border border-gray-200/80 transition-all text-left shadow-xs">
                  <label className="text-[11px] font-extrabold text-[#C45E00] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#F58220]" />
                    <span>{isHindi ? 'गया सेवा चुनें (Select Service):' : 'Select Service Category:'}</span>
                  </label>
                  <select 
                    value={searchCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchCategory(val);
                      navigateToCategoryPage(val);
                    }}
                    className="w-full bg-transparent text-sm sm:text-base font-extrabold text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="PANDIT">🪔 {isHindi ? 'पिंडदान एवं तीर्थ पुरोहित (Pandits & Pind Daan)' : 'Pind Daan & Pandits'}</option>
                    <option value="TAXI">🚕 {isHindi ? 'पिक एंड ड्रॉप (टैक्सी/ऑटो) (Pick & Drop Taxi)' : 'Pick & Drop Taxi / Auto'}</option>
                    <option value="STAY">🏨 {isHindi ? 'होटल एवं धर्मशालाएं (Hotels & Dharamshalas)' : 'Hotels & Dharamshalas'}</option>
                    <option value="FOOD">🍱 {isHindi ? 'शुद्ध सात्विक भोजन (Satvik Food)' : 'Pure Satvik Food & Catering'}</option>
                    <option value="BARBER">💈 {isHindi ? 'क्षौर कर्म एवं नाई (Kshaur Karma / Barber)' : 'Barber & Kshaur Karma (नाई/ठाकुर)'}</option>
                    <option value="PUJA">🛒 {isHindi ? 'पूजा किट एवं गया तिलकुट (Puja Kits)' : 'Puja Kits & Gaya Tilkut'}</option>
                    <option value="GUIDE">🗺️ {isHindi ? 'गया गाइड एवं दर्शनीय स्थल (Gaya Guide)' : 'Gaya Guide & Shrines'}</option>
                    <option value="LOST_FOUND">🔍 {isHindi ? 'खोया और पाया सेवा (Lost & Found Portal)' : 'Lost & Found Portal (खोया और पाया)'}</option>
                    <option value="ALL">🧰 {isHindi ? 'सभी गया सेवाएं (All Services Directory)' : 'All Services Directory'}</option>
                  </select>
                </div>

                {/* Search Button */}
                <button 
                  type="submit"
                  className="sm:w-auto px-8 bg-gradient-to-r from-[#F58220] via-[#E07210] to-[#D96B00] hover:from-[#E07210] hover:to-[#C45E00] text-white font-extrabold text-sm sm:text-base py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 border border-orange-400/40 cursor-pointer shrink-0"
                >
                  <Search className="w-5 h-5 shrink-0" />
                  <span>{isHindi ? 'खोजें' : 'Search'}</span>
                </button>

              </div>

              {/* Popular Quick Search Tags */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 font-medium px-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-gray-700">{isHindi ? 'लोकप्रिय खोज:' : 'Popular:'}</span>
                  <Link href="/pandit" className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-[#C45E00] font-bold transition-all">
                    🪔 Vishnupad Pandit
                  </Link>
                  <Link href="/pick-drop" className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-[#C45E00] font-bold transition-all">
                    🚕 Station Pickup
                  </Link>
                  <Link href="/stay" className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-all">
                    🏨 Near Temple Stay
                  </Link>
                  <Link href="/food" className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-all">
                    🍱 Satvik Thali
                  </Link>
                </div>

                <div className="hidden lg:flex items-center gap-3 text-[10px] text-emerald-700 font-bold">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Verified Services</span>
                </div>
              </div>

            </form>
          </motion.div>

          {/* Key Assurance Badges Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#F8F6EF]/90 font-medium"
          >
            <span className="flex items-center gap-1.5 bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-500/20">
              <BadgeCheck className="w-4 h-4 text-[#F6C343]" />
              <span>{isHindi ? 'सत्यापित तीर्थ पुरोहित' : 'Verified Teerth Pandits'}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-500/20">
              <Car className="w-4 h-4 text-[#F6C343]" />
              <span>{isHindi ? '24/7 जीपीएस टैक्सी नेटवर्क' : '24/7 GPS Taxi Fleet'}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-500/20">
              <Hotel className="w-4 h-4 text-[#F6C343]" />
              <span>{isHindi ? 'स्वच्छ धर्मशाला एवं कमरे' : 'Clean Dharamshalas'}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-500/20">
              <PhoneCall className="w-4 h-4 text-[#F6C343]" />
              <span>{isHindi ? '24/7 आपातकालीन सहायता' : '24/7 Yatri Helpline'}</span>
            </span>
          </motion.div>
        </div>
      </section>
      </div>

      {/* SECTION 4: 📊 LIVE YATRI KEY METRICS COUNTER */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center space-y-1 border-r last:border-r-0 border-slate-100 px-2"
              >
                <Icon className={`w-6 h-6 mx-auto ${st.color} mb-1`} />
                <h3 className="text-2xl sm:text-3xl font-sans font-black text-slate-900">{st.value}</h3>
                <p className="text-xs text-slate-700 font-bold">{st.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: 🖼️ RECTANGULAR BANNER SLIDER */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <RectangularBannerSlider />
      </section>

      {/* SECTION 6: 🪔 COMPLETE PIND DAAN RITUALS & PANDITS OVERVIEW */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
        <div className="bg-gradient-to-r from-amber-950 via-[#3D2310] to-[#2A180B] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#F58220]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="px-3.5 py-1 bg-[#F58220] text-white rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <Flame className="w-4 h-4" /> Authentic Teerth Pandits
            </span>
            <h2 className="text-2xl sm:text-4xl font-sans font-black text-white">
              {isHindi ? 'गया जी में विधि-विधानपूर्वक पिंडदान एवं श्राद्ध कर्म' : 'Complete Authentic Pind Daan & Shradh Rites'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              Book traditional Gaya Gayawal Teerth Pandits with fixed transparent rituals at Vishnupad, Falgu River, and Akshayavat.
            </p>
          </div>
          <Link
            href="/pandit"
            className="bg-[#F6C343] hover:bg-amber-400 text-gray-950 font-black text-xs px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 border border-amber-300"
          >
            <span>Book Verified Pandit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION 7: 🚕 PICK & DROP TAXI & AUTO RATES CARD */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#F58220]">Pick & Drop Services</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-black text-slate-900 mt-1">
              {isHindi ? 'गया जंक्शन, एयरपोर्ट एवं बोधगया टैक्सी दरें' : 'Verified Taxi & Auto Fares'}
            </h2>
          </div>
          <Link href="/pick-drop" className="text-xs font-extrabold text-[#F58220] hover:underline flex items-center gap-1">
            <span>View All Cab Types</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-3 bg-amber-50 text-[#F58220] rounded-2xl"><Car className="w-6 h-6" /></span>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">Instant 15 Mins</span>
            </div>
            <h3 className="font-sans font-black text-lg text-slate-900">Gaya Junction &rarr; Vishnupad</h3>
            <p className="text-xs text-slate-700 font-medium">AC Sedan / Hatchback / Auto-Rickshaw available 24/7.</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm font-black text-slate-900">₹300 - ₹600</span>
              <Link href="/pick-drop" className="text-xs font-black text-[#F58220]">Book Cab &rarr;</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Car className="w-6 h-6" /></span>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">Airport Pickup</span>
            </div>
            <h3 className="font-sans font-black text-lg text-slate-900">Gaya Airport (GAY) &rarr; Bodh Gaya</h3>
            <p className="text-xs text-slate-700 font-medium">Spacious SUV & AC Sedans for international & domestic Yatri arrival.</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm font-black text-slate-900">₹500 - ₹900</span>
              <Link href="/pick-drop" className="text-xs font-black text-blue-600">Book Cab &rarr;</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Car className="w-6 h-6" /></span>
              <span className="text-xs font-extrabold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">Full Day Sightseeing</span>
            </div>
            <h3 className="font-sans font-black text-lg text-slate-900">Gaya Teerth Circuit Full Day</h3>
            <p className="text-xs text-slate-700 font-medium">Covers Vishnupad, Falgu, Akshayavat, Pretshila & Bodh Gaya.</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm font-black text-slate-900">₹1,800 / day</span>
              <Link href="/pick-drop" className="text-xs font-black text-purple-600">Reserve Day &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: 🏨 YATRI STAYS, DHARAMSHALAS & HOTELS DIRECTORY */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">Stays & Accommodation</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-black text-slate-900 mt-1">
              {isHindi ? 'सत्यापित होटल एवं धर्मशालाएं' : 'Verified Pilgrim Stays & Dharamshalas'}
            </h2>
          </div>
          <Link href="/stay" className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1">
            <span>View All Stays</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">Near Vishnupad (&lt; 300m)</span>
            <h3 className="font-sans font-black text-lg text-slate-900">Sri Vishnupad Yatri Dharamshala</h3>
            <p className="text-xs text-slate-700 font-medium">Clean AC / Non-AC rooms with hot water, lift & pure satvik kitchen.</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-black text-slate-900">From ₹450 / night</span>
              <Link href="/stay" className="text-xs font-black text-blue-600">Book Room &rarr;</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-800 rounded-full border border-blue-200">Near Gaya Station</span>
            <h3 className="font-sans font-black text-lg text-slate-900">Hotel Teerth Residency</h3>
            <p className="text-xs text-slate-700 font-medium">3-Star comfortable rooms with free station pickup & 24hr room service.</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-black text-slate-900">From ₹1,200 / night</span>
              <Link href="/stay" className="text-xs font-black text-blue-600">Book Room &rarr;</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-purple-100 text-purple-800 rounded-full border border-purple-200">Bodh Gaya Temple Zone</span>
            <h3 className="font-sans font-black text-lg text-slate-900">Mahabodhi Heritage Guest House</h3>
            <p className="text-xs text-slate-700 font-medium">Peaceful garden guest house with meditation space & airport transport.</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-black text-slate-900">From ₹950 / night</span>
              <Link href="/stay" className="text-xs font-black text-blue-600">Book Room &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: 🍱 PURE SATVIK FOOD & GAYA TILKUT SWEET DELIVERY */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 border border-emerald-700/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <Utensils className="w-4 h-4" /> Pure Satvik Kitchen
            </span>
            <h2 className="text-2xl sm:text-4xl font-sans font-black text-white">
              {isHindi ? 'बिना लहसुन-प्याज का शुद्ध सात्विक भोजन एवं गया तिलकुट' : 'Pure No-Onion No-Garlic Satvik Thali & Gaya Tilkut'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
              Order hygiene-certified Yatri food delivered directly to your Hotel, Dharamshala, or Vishnupad Ghat.
            </p>
          </div>
          <Link
            href="/food"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 border border-emerald-300"
          >
            <span>Order Satvik Thali</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION 10: 🛍️ COMPLETE PUJA SAMAGRI KIT BOOKING */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-pink-600">Puja Items</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-black text-slate-900 mt-1">
              {isHindi ? 'पिंडदान एवं पूजा सामग्री किट' : 'Pind Daan Samagri & Puja Kits'}
            </h2>
          </div>
          <Link href="/puja-material" className="text-xs font-extrabold text-pink-600 hover:underline flex items-center gap-1">
            <span>View All Kits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="p-3 bg-pink-50 text-pink-600 rounded-2xl inline-block"><ShoppingBag className="w-6 h-6" /></span>
            <h3 className="font-sans font-black text-lg text-slate-900">Complete Pind Daan Kit</h3>
            <p className="text-xs text-slate-700 font-medium">Includes pure sesame, barley flour, kusha grass, brass diya, honey, and sacred thread.</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm font-black text-slate-900">₹350</span>
              <Link href="/puja-material" className="text-xs font-black text-pink-600">Order Kit &rarr;</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl inline-block"><Flame className="w-6 h-6" /></span>
            <h3 className="font-sans font-black text-lg text-slate-900">Tripindi Shradh Special Kit</h3>
            <p className="text-xs text-slate-700 font-medium">Complete items for Tripindi Shradh rites with pure cow ghee and samidha wood.</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm font-black text-slate-900">₹550</span>
              <Link href="/puja-material" className="text-xs font-black text-pink-600">Order Kit &rarr;</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl inline-block"><ShoppingBasket className="w-6 h-6" /></span>
            <h3 className="font-sans font-black text-lg text-slate-900">Original Gaya Tilkut Pack</h3>
            <p className="text-xs text-slate-700 font-medium">Fresh Ramna Road traditional white sesame & jaggery Tilkut gift boxes.</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm font-black text-slate-900">₹280 / kg</span>
              <Link href="/puja-material" className="text-xs font-black text-emerald-600">Order Pack &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: 📍 SACRED TEERTH SHRINES DIRECTORY */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#F58220]">Teerth Darshan</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-black text-slate-900 mt-1">
              {isHindi ? 'गया जी के प्रमुख पवित्र स्थल' : 'Sacred Shrines & Holy Teerth Sites'}
            </h2>
          </div>
          <Link href="/gaya-guide" className="text-xs font-extrabold text-[#F58220] hover:underline flex items-center gap-1">
            <span>{isHindi ? 'सभी स्थल देखें' : 'View Full Guide'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedPlaces.slice(0, 3).map((pl) => (
            <div key={pl.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-950 rounded-full border border-amber-300">
                    📍 {pl.distanceKm != null ? `${pl.distanceKm} km away` : pl.category}
                  </span>
                  <span className="text-xs text-slate-700 font-bold">🕒 05:00 AM - 09:00 PM</span>
                </div>
                <h3 className="font-sans font-black text-lg text-slate-900">{pl.title}</h3>
                <p className="text-xs text-slate-700 font-medium line-clamp-2">{pl.description}</p>
              </div>
              <Link href={`/gaya-guide/${pl.id}`} className="text-xs font-black text-[#F58220] hover:underline pt-2 inline-block">
                Read Yatri Guide &amp; Timings &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 12: 🗺️ LIVE DISTANCE MATRIX & GPS MAP LOCATOR WIDGET */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-black text-[#F58220] uppercase tracking-wider">GPS Live Location</span>
            <h3 className="font-sans font-black text-xl text-slate-900">
              {isHindi ? 'लाइव जीपीएस दूरी गणक' : 'Live GPS Yatri Distance Matrix'}
            </h3>
            <p className="text-xs text-slate-700 font-medium">Currently active location: <span className="font-black text-slate-900">{locationName}</span></p>
          </div>
          <button
            onClick={requestLocation}
            className="bg-[#2A180B] hover:bg-[#3D2310] text-[#F6C343] font-black text-xs px-6 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 shrink-0 border border-amber-500/30"
          >
            <MapPin className="w-4 h-4 text-[#F58220]" />
            <span>Update Live GPS Distance</span>
          </button>
        </div>
      </section>

      {/* SECTION 13: 📜 GAYA TEERTH HISTORY & SPIRITUAL SIGNIFICANCE */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-4">
        <div className="bg-[#2A180B] text-white p-8 sm:p-12 rounded-3xl border border-[#F58220]/30 shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-sans font-black text-[#F6C343]">
            {isHindi ? 'गया जी महात्म्य एवं पिंड दान का महत्व' : 'Spiritual Significance of Gaya Ji Pind Daan'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
            According to the Vayu Purana and Garuda Purana, Gaya Ji is the supreme holy land where Lord Vishnu stamped His footstep on solid basalt rock at Vishnupad Temple to bless Gayasura. Performing Pind Daan oblations at Falgu River, Vishnupad, and Akshayavat grants permanent liberation (Moksha) to seven generations of departed ancestors.
          </p>
        </div>
      </section>

      {/* SECTION 14: 🤖 AI YATRI ASSISTANT SHOWCASE */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-gradient-to-r from-amber-900 via-[#4A2E1A] to-[#2A180B] text-white rounded-3xl p-8 sm:p-12 border border-[#F6C343]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 bg-[#F6C343] text-gray-950 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <Bot className="w-4 h-4 text-gray-950" /> AI Yatri Companion
            </span>
            <h2 className="text-2xl sm:text-4xl font-sans font-black text-white">
              {isHindi ? 'गयासेवा एआई तीर्थ गाइड से कुछ भी पूछें' : 'Instant AI Guidance for Gaya Pilgrims'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              Ask questions about Pind Daan vidhi, temple muhurat timings, local transport fares, or family dharamshala bookings.
            </p>
          </div>
          <Link
            href="/ai"
            className="bg-[#F58220] hover:bg-[#E07210] text-white font-black text-xs px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 border border-orange-400/40"
          >
            <Sparkles className="w-4 h-4 text-[#F6C343]" />
            <span>Start AI Yatri Chat</span>
          </Link>
        </div>
      </section>

      {/* SECTION 15: 🆘 24/7 EMERGENCY HELPLINES & AMBULANCE */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-red-950 text-white rounded-3xl p-6 sm:p-8 border border-red-700/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Hospital className="w-10 h-10 text-red-500 shrink-0" />
            <div className="space-y-1">
              <h3 className="font-sans font-black text-xl text-white">24/7 Yatri Medical & Ambulance Helpline</h3>
              <p className="text-xs text-red-100 font-medium">ANMMCH Government Medical College & Hospital Gaya & Verified Ambulance Support.</p>
            </div>
          </div>
          <a href="tel:108" className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-6 py-3 rounded-xl shadow-md shrink-0 border border-red-400/40">
            Call Ambulance 108
          </a>
        </div>
      </section>

      {/* SECTION 16: 👵 SPECIAL YATRI CARE & WHEELCHAIR ASSISTANCE */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <HeartHandshake className="w-10 h-10 text-[#F58220] shrink-0" />
            <div className="space-y-1">
              <h3 className="font-sans font-black text-xl text-slate-900">Elderly & Wheelchair Assistance</h3>
              <p className="text-xs text-slate-700 font-medium">Special assistance for senior citizen Yatris at Vishnupad Temple & Falgu Ghat.</p>
            </div>
          </div>
          <a href="tel:+919876543200" className="bg-[#2A180B] text-[#F6C343] font-black text-xs px-6 py-3 rounded-xl shrink-0 border border-amber-500/30">
            Book Wheelchair Support
          </a>
        </div>
      </section>

      {/* SECTION 17: 🔎 LOST & FOUND RELATIVES PORTAL BANNER */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-700/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Search className="w-10 h-10 text-purple-400 shrink-0" />
            <div className="space-y-1">
              <h3 className="font-sans font-black text-xl text-white">Lost & Found Relatives & Belongings Portal</h3>
              <p className="text-xs text-purple-100 font-medium">Report or search missing family members or belongings during Pitru Paksha Mela.</p>
            </div>
          </div>
          <Link href="/help/lost-and-found" className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-6 py-3 rounded-xl shrink-0 border border-purple-400/40">
            Open Lost & Found Portal
          </Link>
        </div>
      </section>

      {/* SECTION 18: 📋 STEP-BY-STEP PIND DAAN RITUAL TIMELINE */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#F58220]">Ritual Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-sans font-black text-slate-900">
            {isHindi ? 'गया जी पिंड दान चरण-दर-चरण गाइड' : 'Step-by-Step Pind Daan Ritual Guide'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-[#F58220] font-black text-xs flex items-center justify-center border border-amber-300">1</span>
            <h4 className="font-sans font-black text-sm text-slate-900">Falgu River Bath</h4>
            <p className="text-xs text-slate-700 font-medium">Holy dip and Sankalp oblations at Falgu River banks.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-[#F58220] font-black text-xs flex items-center justify-center border border-amber-300">2</span>
            <h4 className="font-sans font-black text-sm text-slate-900">Vishnupad Footstep</h4>
            <p className="text-xs text-slate-700 font-medium">Offering Pinda at Lord Vishnu basalt footstep shrine.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-[#F58220] font-black text-xs flex items-center justify-center border border-amber-300">3</span>
            <h4 className="font-sans font-black text-sm text-slate-900">Akshayavat Tree</h4>
            <p className="text-xs text-slate-700 font-medium">Completing final oblations under immortal Banyan tree.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-[#F58220] font-black text-xs flex items-center justify-center border border-amber-300">4</span>
            <h4 className="font-sans font-black text-sm text-slate-900">Brahmin Bhojan</h4>
            <p className="text-xs text-slate-700 font-medium">Offering Yatri Dakshina & Satvik meal to Gayawal Panda.</p>
          </div>
        </div>
      </section>

      {/* SECTION 19: 🤝 VERIFIED LOCAL SERVICE PROVIDER REGISTRATION CTA */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">For Local Providers</span>
            <h3 className="font-sans font-black text-xl text-slate-900">
              Are you a Gaya Ji Teerth Pandit, Taxi Driver, or Hotel Owner?
            </h3>
            <p className="text-xs text-slate-700 font-medium">Register on GayaSeva platform to receive direct yatri bookings with zero commission.</p>
          </div>
          <Link href="/provider/register" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3 rounded-xl shrink-0 border border-emerald-400/40 shadow-sm">
            Register as Provider &rarr;
          </Link>
        </div>
      </section>

      {/* SECTION 20: 🏷️ ZERO MIDDLEMAN COMMISSION & TRANSPARENT PRICE GUARANTEE */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-300 flex items-center gap-4 shadow-xs">
          <BadgeCheck className="w-8 h-8 text-[#F58220] shrink-0" />
          <div>
            <h4 className="font-black text-sm text-amber-950">Zero Middleman Commission & Transparent Pricing</h4>
            <p className="text-xs text-amber-900 font-bold">All rates displayed on GayaSeva are fixed directly by local providers without hidden fees.</p>
          </div>
        </div>
      </section>

      {/* SECTION 21: 🌐 MULTILINGUAL YATRI SUPPORT MATRIX */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#4A2E1A] text-xs font-extrabold uppercase tracking-wider border border-amber-300">
            <Languages className="w-4 h-4 text-[#F58220]" />
            <span>Multilingual Yatri Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-black text-slate-900">
            {isHindi ? '🌐 भारत के सभी राज्यों के लिए बहुभाषी सहायता' : '🌐 Multilingual Yatri Support Matrix'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {isHindi
              ? 'गया जी पिंडदान एवं तीर्थयात्रा हेतु हिंदी, बंगाली, अंग्रेजी, तेलुगु एवं तमिल भाषी पंडे, ड्राइवर एवं 24/7 हेल्पलाइन सहायता।'
              : 'Dedicated pilgrimage assistance & verified local pandits available across 5 primary Indian languages for seamless Yatra.'}
          </p>
        </div>

        {/* 5 Language Support Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              code: 'HI',
              name: 'हिंदी (Hindi)',
              region: 'North & Central India',
              greeting: '🙏 गया जी पिंडदान एवं पंडित सेवा',
              desc: 'समस्त पिंडदान विधान, फल्गु स्नान एवं विष्णुपद दर्शन सहायता।',
              badge: 'Primary Language',
              badgeBg: 'bg-amber-100 text-amber-950 border border-amber-300',
            },
            {
              code: 'BN',
              name: 'বাংলা (Bengali)',
              region: 'West Bengal & Tripura',
              greeting: '🙏 গয়া ধাম পিন্ডদান ও তীর্থ সহায়তা',
              desc: 'বাংলা ভাষী অভিজ্ঞ পুরোহিত ও স্থান পরিষেবা ব্যবস্থা।',
              badge: 'Bengali Special',
              badgeBg: 'bg-rose-100 text-rose-950 border border-rose-300',
            },
            {
              code: 'EN',
              name: 'English',
              region: 'Pan-India & Global NRI',
              greeting: '🙏 Official Gaya Pilgrim Portal',
              desc: 'Comprehensive English guides, cab bookings & instant support.',
              badge: 'Global & NRI',
              badgeBg: 'bg-blue-100 text-blue-950 border border-blue-300',
            },
            {
              code: 'TE',
              name: 'తెలుగు (Telugu)',
              region: 'Andhra & Telangana',
              greeting: '🙏 గయా క్షేత్ర పిండ ప్రదాన సేవలు',
              desc: 'తెలుగు మాట్లాడే తీర్థ పురోహితులు మరియు రవాణా సేవలు.',
              badge: 'Telugu Yatri',
              badgeBg: 'bg-emerald-100 text-emerald-950 border border-emerald-300',
            },
            {
              code: 'TA',
              name: 'தமிழ் (Tamil)',
              region: 'Tamil Nadu & South',
              greeting: '🙏 கயா தீர்த்த யாத்திரை சேவைகள்',
              desc: 'தமிழ் பேசும் புரோகிதர்கள் மற்றும் தங்கும் வசதிகள்.',
              badge: 'Tamil Yatri',
              badgeBg: 'bg-purple-100 text-purple-950 border border-purple-300',
            },
          ].map((langItem) => (
            <div
              key={langItem.code}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#F58220]/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#F58220] group-hover:text-white font-black text-xs flex items-center justify-center text-slate-900 transition-colors">
                    {langItem.code}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${langItem.badgeBg}`}>
                    {langItem.badge}
                  </span>
                </div>
                <h3 className="font-sans font-black text-base text-slate-900 group-hover:text-[#F58220] transition-colors">
                  {langItem.name}
                </h3>
                <p className="text-[11px] font-black text-slate-900">{langItem.greeting}</p>
                <p className="text-[11px] text-slate-700 font-medium leading-normal">{langItem.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-bold">{langItem.region}</span>
                <span className="font-black text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Support Matrix Capability Badges */}
        <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/30 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#F58220]/20 rounded-2xl shrink-0">
              <Languages className="w-6 h-6 text-[#F6C343]" />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">Native Speaking Purohits</h4>
              <p className="text-slate-100 font-medium text-[11px]">Pandits available for Hindi, Bengali, Telugu & Tamil rituals.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-2xl shrink-0">
              <PhoneCall className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">24/7 Multilingual Phone Line</h4>
              <p className="text-slate-100 font-medium text-[11px]">Helpline support in your native spoken language.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-2xl shrink-0">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">Regional Pind Daan Guides</h4>
              <p className="text-slate-100 font-medium text-[11px]">Step-by-step rituals explained in 5 major languages.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-2xl shrink-0">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">Verified Local Assistance</h4>
              <p className="text-slate-100 font-medium text-[11px]">Language-matched drivers & hotel concierge staff.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 22: 📱 MOBILE WEB APP (PWA) & QR DOWNLOAD BANNER */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-[#180F08] text-white rounded-3xl p-8 border border-[#F58220]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-sans font-black text-xl text-[#F6C343]">Install GayaSeva Web App</h3>
            <p className="text-xs text-slate-100 font-medium">Add GayaSeva to your mobile home screen for offline access during Yatra.</p>
          </div>
          <button className="bg-[#F58220] hover:bg-[#E07210] text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 shrink-0 border border-orange-400/40">
            <Download className="w-4 h-4" /> Install App
          </button>
        </div>
      </section>

      {/* SECTION 23: 💬 REAL YATRI REVIEWS & TESTIMONIALS */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#F58220]">Verified Pilgrim Experiences</span>
          <h2 className="text-2xl sm:text-3xl font-sans font-black text-slate-900">
            {isHindi ? 'तीर्थयात्रियों के विचार एवं अनुभव' : 'What Gaya Pilgrims Say'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tst, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {'★'.repeat(tst.rating)}
                </div>
                <p className="text-xs text-slate-700 font-medium italic">"{tst.text}"</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-xs text-slate-900">{tst.name}</h4>
                  <span className="text-[10px] text-slate-600 font-bold">{tst.location}</span>
                </div>
                <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">{tst.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 24: 🛡️ BACKGROUND VERIFICATION & SAFETY AUDIT SHIELD */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-black text-sm text-slate-900">Background Checked & Verified Network</h4>
            <p className="text-xs text-slate-700 font-medium">Every driver, pandit, and hotel partner undergoes strict identity & document verification.</p>
          </div>
        </div>
      </section>

      {/* SECTION 25: 🗺️ 1-DAY, 2-DAY & 3-DAY YATRA ITINERARY GUIDES */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#F58220]">Yatra Planning</span>
          <h2 className="text-2xl sm:text-3xl font-sans font-black text-slate-900">
            {isHindi ? 'गया जी यात्रा समय-सारणी योजना' : 'Custom Yatra Itinerary Planner'}
          </h2>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((day) => (
            <button
              key={day}
              onClick={() => setActiveItineraryDay(day as any)}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                activeItineraryDay === day
                  ? 'bg-[#2A180B] text-[#F6C343] shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}
            >
              {day}-Day Plan
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 text-xs text-slate-800 font-medium space-y-2 max-w-2xl mx-auto shadow-xs">
          {activeItineraryDay === 1 && (
            <p><strong className="font-black text-slate-900">1-Day Express Plan:</strong> Morning Falgu River bath &rarr; Vishnupad Temple Pind Daan &rarr; Afternoon Akshayavat final oblations &rarr; Evening departure.</p>
          )}
          {activeItineraryDay === 2 && (
            <p><strong className="font-black text-slate-900">2-Day Complete Plan:</strong> Day 1: Vishnupad & Falgu rituals &rarr; Day 2: Bodh Gaya Mahabodhi Temple & Thai Monastery tour.</p>
          )}
          {activeItineraryDay === 3 && (
            <p><strong className="font-black text-slate-900">3-Day Teerth Circuit:</strong> Day 1: Gaya Pind Daan &rarr; Day 2: Pretshila & Ramshila Hills &rarr; Day 3: Bodh Gaya & Rajgir excursion.</p>
          )}
        </div>
      </section>

      {/* SECTION 26: 🏛️ OFFICIAL BIHAR TOURISM & DISTRICT HELPLINES */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-800 font-bold flex flex-wrap items-center justify-between gap-2 border border-slate-200">
          <span>Official Bihar Tourism Helpline: <strong className="text-slate-900 font-black">1800-345-6345</strong></span>
          <span>Gaya District Police Helpline: <strong className="text-slate-900 font-black">+91 631 2220004</strong></span>
        </div>
      </section>

      {/* SECTION 27: ❓ FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-sans font-black text-slate-900">
            {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-slate-900 focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#F58220] transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-800 font-medium border-t border-slate-100 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 28: ✉️ YATRI UPDATES & PITRU PAKSHA SUBSCRIPTION BOX */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <h3 className="font-sans font-black text-xl text-slate-900">
            {isHindi ? 'गया जी तीर्थ अपडेट एवं पितृ पक्ष सूचनाएं प्राप्त करें' : 'Get Pitru Paksha & Gaya Teerth Updates'}
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Enter WhatsApp / Mobile Number" 
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F58220]"
            />
            <button className="bg-[#F58220] hover:bg-[#E07210] text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-sm">
              Subscribe Free
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 29: 🏆 AWARDS, RECOGNITION & TRUST BADGES */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-800 font-black">
          <span className="flex items-center gap-1">🏆 Bihar Local Innovation Award 2026</span>
          <span className="flex items-center gap-1">🛡️ 100% SSL Encrypted Yatri Safety</span>
        </div>
      </section>

      {/* SECTION 30: 🚀 FINAL HIGH-IMPACT CONVERSION CALL-TO-ACTION BANNER */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-gradient-to-r from-[#180F08] via-[#2A180B] to-[#3D2310] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl border border-[#F58220]/30 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F58220]/15 blur-3xl pointer-events-none rounded-full" />
          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-sans font-black text-white">
              {isHindi ? 'अपनी गया जी यात्रा की योजना आज ही शुरू करें' : 'Plan Your Gaya Ji Teerth Yatra Today'}
            </h2>
            <p className="text-xs sm:text-base text-slate-100 font-medium">
              Direct connection with verified Pandits, Cabs, Dharamshalas & 24/7 Helpline.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/pandit"
                className="bg-[#F58220] hover:bg-[#E07210] text-white font-black text-xs px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center gap-2 border border-orange-400/40"
              >
                <span>Book Pind Daan Pandit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="tel:+918544491413"
                className="bg-white/10 hover:bg-white/20 text-[#F6C343] font-black text-xs px-8 py-4 rounded-2xl border border-[#F6C343]/30 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#F58220]" />
                <span>Call Helpline: +91 85444 91413</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
