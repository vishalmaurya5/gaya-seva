'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  QrCode, 
  Flame, 
  Car, 
  Hotel, 
  UtensilsCrossed, 
  Compass, 
  ShoppingBag, 
  Bot, 
  X, 
  CheckCircle2, 
  Sparkles, 
  MapPin,
  ArrowRight,
  PhoneCall,
  HeartHandshake
} from 'lucide-react';

interface QRSourceMeta {
  name: string;
  nameHi: string;
  location: string;
  badge: string;
}

const QR_SOURCE_MAP: Record<string, QRSourceMeta> = {
  station: {
    name: 'Gaya Railway Station Exit',
    nameHi: 'गया जंक्शन मुख्य निकास द्वार',
    location: 'Station Road, Platform Gate No. 1',
    badge: 'Station Exit Scan',
  },
  hotel: {
    name: 'Partner Hotel Reception Poster',
    nameHi: 'होटल / धर्मशाला रिसेप्शन पोस्टर',
    location: 'Vishnupad Temple Area, Gaya Ji',
    badge: 'Hotel Reception Scan',
  },
  poster: {
    name: 'Vishnupad City Banner',
    nameHi: 'विष्णुपद एवं फल्गु तट बैनर',
    location: 'Devghat & Falgu River Zone',
    badge: 'City Poster Scan',
  },
  general: {
    name: 'GayaSeva Universal QR',
    nameHi: 'गया सेवा यूनिवर्सल क्यूआर',
    location: 'Gaya Ji Sacred Dham Network',
    badge: 'Universal QR',
  },
};

export function QRConciergeContent() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSource, setActiveSource] = useState<QRSourceMeta>(QR_SOURCE_MAP.general);

  useEffect(() => {
    // Detect QR parameter from URL
    const qrParam = searchParams.get('qr') || searchParams.get('source') || searchParams.get('scan');
    
    if (qrParam) {
      const cleanKey = qrParam.toLowerCase().trim();
      const matched = QR_SOURCE_MAP[cleanKey] || {
        name: `QR Source: ${qrParam}`,
        nameHi: `क्यूआर माध्यम: ${qrParam}`,
        location: 'Gaya Ji Pilgrimage Network',
        badge: `${qrParam.toUpperCase()} Scan`,
      };

      setActiveSource(matched);
      setIsOpen(true);

      // Track scan count in localStorage & dispatches
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('GAYASEVA_QR_SCAN_METRICS') || '{}';
          const metrics = JSON.parse(stored);
          metrics[cleanKey] = (metrics[cleanKey] || 0) + 1;
          metrics.total = (metrics.total || 0) + 1;
          localStorage.setItem('GAYASEVA_QR_SCAN_METRICS', JSON.stringify(metrics));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}
      }
    }

    // Listen for manual trigger custom event
    const handleOpenModal = (e: any) => {
      if (e.detail?.sourceKey && QR_SOURCE_MAP[e.detail.sourceKey]) {
        setActiveSource(QR_SOURCE_MAP[e.detail.sourceKey]);
      } else {
        setActiveSource(QR_SOURCE_MAP.general);
      }
      setIsOpen(true);
    };

    window.addEventListener('open_qr_concierge', handleOpenModal);
    return () => window.removeEventListener('open_qr_concierge', handleOpenModal);
  }, [searchParams]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Open GayaSeva Smart QR Concierge"
        className="fixed bottom-44 sm:bottom-36 right-4 sm:right-6 z-40 bg-[#1C0D02] hover:bg-[#3D2310] text-[#F6C343] p-3 rounded-full shadow-2xl border-2 border-[#F6C343]/60 flex items-center justify-center group transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <QrCode className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-bold text-white px-0 group-hover:px-2">
          GayaSeva Smart Concierge
        </span>
      </button>
    );
  }

  const services = [
    {
      id: 'pandit',
      title: 'पिंडदान एवं तीर्थ पुरोहित',
      subtitle: 'Pind Daan & Gayawal Purohits',
      icon: Flame,
      color: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100',
      iconColor: 'text-[#F58220]',
      href: '/pandit',
      badge: 'Popular',
    },
    {
      id: 'taxi',
      title: 'पिक एंड ड्रॉप (टैक्सी & ऑटो)',
      subtitle: 'Station & Airport Cabs',
      icon: Car,
      color: 'bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100',
      iconColor: 'text-orange-600',
      href: '/pick-drop',
      badge: 'Instant',
    },
    {
      id: 'stay',
      title: 'होटल एवं धर्मशाला कमरे',
      subtitle: 'AC Rooms Near Vishnupad',
      icon: Hotel,
      color: 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100',
      iconColor: 'text-blue-600',
      href: '/stay',
      badge: 'Direct Stay',
    },
    {
      id: 'food',
      title: '100% शुद्ध सात्विक भोजन',
      subtitle: 'No Onion No Garlic Thali',
      icon: UtensilsCrossed,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100',
      iconColor: 'text-emerald-600',
      href: '/food',
      badge: 'Pure Veg',
    },
    {
      id: 'guide',
      title: '48-वेदी एवं तीर्थ गाइड',
      subtitle: '48-Vedi Shradh Guide Map',
      icon: Compass,
      color: 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100',
      iconColor: 'text-purple-600',
      href: '/gaya-guide',
      badge: 'Shrine Guide',
    },
    {
      id: 'samagri',
      title: 'पूजा सामग्री एवं गया तिलकुट',
      subtitle: 'Puja Kits & Famous Sweets',
      icon: ShoppingBag,
      color: 'bg-pink-50 text-pink-900 border-pink-300 hover:bg-pink-100',
      iconColor: 'text-pink-600',
      href: '/puja-material',
      badge: 'Top Goods',
    },
    {
      id: 'ai',
      title: '24/7 AI गया सेवा असिस्टेंट',
      subtitle: 'Voice & Multilingual AI Guide',
      icon: Bot,
      color: 'bg-cyan-50 text-cyan-900 border-cyan-300 hover:bg-cyan-100',
      iconColor: 'text-cyan-600',
      href: '/ai',
      badge: '24/7 AI Guide',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* Executive Header Banner */}
        <div className="bg-gradient-to-br from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-5 sm:p-6 border-b border-[#F58220]/40 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <img
              src="/icongaya.jpeg"
              alt="GayaSeva Official Logo"
              className="w-12 h-12 rounded-full border-2 border-[#F6C343] object-cover shadow-lg shrink-0 mt-1"
            />
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#F6C343] text-[#1C0D02] text-[10px] font-black uppercase rounded-full tracking-wider flex items-center gap-1">
                  <QrCode className="w-3 h-3" /> {activeSource.badge}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Scan Verified
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-sans font-extrabold text-white tracking-tight leading-tight">
                🙏 जय श्री हरि विष्णु! गया धाम में आपका स्वागत है।
              </h2>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F8F6EF]/90 bg-white/10 p-2 rounded-xl border border-white/15 w-fit">
                <MapPin className="w-4 h-4 text-[#F58220] shrink-0" />
                <span>{activeSource.nameHi} ({activeSource.location})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Section */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-sans font-extrabold text-sm sm:text-base text-[#0F172A]">
                हम आपकी क्या सेवा कर सकते हैं?
              </h3>
              <p className="text-xs font-bold text-slate-700">
                Please select the service you need for your Gaya Ji pilgrimage:
              </p>
            </div>
            <Sparkles className="w-6 h-6 text-[#F58220] shrink-0 animate-bounce" />
          </div>

          {/* 1-Tap Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <Link
                  key={srv.id}
                  href={srv.href}
                  onClick={() => setIsOpen(false)}
                  className={`p-3.5 rounded-2xl border ${srv.color} transition-all duration-200 flex items-center justify-between group shadow-xs hover:shadow-md`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0">
                      <Icon className={`w-5 h-5 ${srv.iconColor}`} />
                    </div>
                    <div>
                      <div className="font-sans font-extrabold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#F58220] transition-colors">
                        {srv.title}
                      </div>
                      <div className="text-[11px] font-bold text-slate-600">
                        {srv.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F58220] group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#F58220]" />
            <span>0% Commission • 100% Direct Verified Gaya Ji Services</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto px-5 py-2 bg-[#1C0D02] hover:bg-[#3D2310] text-white rounded-xl text-xs font-extrabold transition-all"
          >
            Continue Browsing Website
          </button>
        </div>

      </div>
    </div>
  );
}

export function QRConciergeModal() {
  return (
    <React.Suspense fallback={null}>
      <QRConciergeContent />
    </React.Suspense>
  );
}
