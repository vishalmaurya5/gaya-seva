'use client';

import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  TrendingUp, 
  ExternalLink, 
  RefreshCw, 
  Download, 
  Printer, 
  Trash2, 
  X, 
  CheckCircle2, 
  Flame, 
  Car, 
  Hotel, 
  UtensilsCrossed, 
  Compass, 
  Bot, 
  ShieldCheck, 
  PhoneCall 
} from 'lucide-react';

interface QRSourceItem {
  key: string;
  name: string;
  nameHi: string;
  location: string;
  badge: string;
  url: string;
  tagline: string;
}

const SOURCES: QRSourceItem[] = [
  {
    key: 'station',
    name: 'Gaya Railway Station Exit',
    nameHi: 'गया जंक्शन मुख्य निकास द्वार',
    location: 'Station Road, Platform Gate No. 1',
    badge: 'Station Exit Poster',
    url: 'http://localhost:3000/?qr=station',
    tagline: 'स्टेशन से निकलते ही तीर्थ सेवा प्राप्त करें'
  },
  {
    key: 'hotel',
    name: 'Partner Hotel Reception Posters',
    nameHi: 'होटल / धर्मशाला रिसेप्शन पोस्टर',
    location: 'Vishnupad Temple Area, Gaya Ji',
    badge: 'Hotel Reception Standee',
    url: 'http://localhost:3000/?qr=hotel',
    tagline: 'होटल रिसेप्शन से 1-टैप डायरेक्ट सहायता'
  },
  {
    key: 'poster',
    name: 'Vishnupad City Banners',
    nameHi: 'विष्णुपद एवं फल्गु तट बैनर',
    location: 'Devghat & Falgu River Zone',
    badge: 'City Pilgrimage Banner',
    url: 'http://localhost:3000/?qr=poster',
    tagline: 'विष्णुपद मंदिर व फल्गु तट पर त्वरित सहायता'
  },
  {
    key: 'general',
    name: 'GayaSeva Universal QR',
    nameHi: 'गया सेवा यूनिवर्सल क्यूआर',
    location: 'Gaya Ji Sacred Dham Network',
    badge: 'Universal Official QR',
    url: 'http://localhost:3000/?qr=welcome',
    tagline: 'गया धाम की समस्त सेवाओं का एक मात्र क्यूआर'
  }
];

export default function AdminQRSourcesPage() {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [selectedBanner, setSelectedBanner] = useState<QRSourceItem | null>(null);

  const loadMetrics = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('GAYASEVA_QR_SCAN_METRICS');
      if (stored) {
        setMetrics(JSON.parse(stored));
      } else {
        setMetrics({});
      }
    } catch (e) {
      setMetrics({});
    }
  };

  useEffect(() => {
    loadMetrics();
    window.addEventListener('storage', loadMetrics);
    return () => window.removeEventListener('storage', loadMetrics);
  }, []);

  const resetAllMetrics = () => {
    if (confirm('क्या आप सभी टेस्ट डेटा एवं स्कैन स्टैट्स को रीसेट करना चाहते हैं? (Reset to Real Data 0 Scans)')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('GAYASEVA_QR_SCAN_METRICS');
        setMetrics({});
        window.dispatchEvent(new Event('storage'));
        alert('सफलतापूर्वक सभी डेटा रीसेट कर दिया गया है। अब केवल रियल लाइव स्कैन्स दिखेंगे।');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalScans = Object.values(metrics).reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black uppercase rounded-full tracking-wider">
              Real-Time Scan Data Mode
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Real Data Active
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#4A2E1A] mt-1">
            QR Campaign Analytics & Printable Banners
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track real customer scans from offline QR posters & download high-res printable GayaSeva banners.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadMetrics}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-[#4A2E1A] text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#F58220]" /> Sync Metrics
          </button>
          <button
            onClick={resetAllMetrics}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1.5 transition-all"
            title="Reset metrics to 0 real scans"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Reset Data to 0
          </button>
        </div>
      </div>

      {/* Metrics Overview Bar */}
      <div className="bg-gradient-to-r from-[#1C0D02] to-[#3D2310] text-white p-6 rounded-2xl border border-[#F58220]/30 shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="text-xs font-bold text-[#F6C343] uppercase tracking-wider">Total Real Live Scans Across Network</div>
          <div className="text-3xl font-serif font-extrabold text-white mt-1">
            {totalScans.toLocaleString()} <span className="text-xs font-sans font-normal text-emerald-400">Total Scans Recorded</span>
          </div>
        </div>
        <button
          onClick={() => setSelectedBanner(SOURCES[3])}
          className="px-5 py-2.5 bg-[#F58220] hover:bg-[#d96d13] text-white text-xs font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <Download className="w-4 h-4" /> Download Universal QR Banner
        </button>
      </div>

      {/* QR Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SOURCES.map((item) => {
          const liveScans = metrics[item.key] || 0;
          return (
            <div key={item.key} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-gray-500 text-xs font-semibold">
                  <span className="uppercase tracking-wider font-extrabold text-[#F58220] text-[11px]">{item.badge}</span>
                  <QrCode className="w-4 h-4 text-[#F58220]" />
                </div>
                
                <div>
                  <h3 className="font-bold text-[#4A2E1A] text-sm leading-snug">{item.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{item.nameHi}</p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1 w-fit bg-amber-50 px-2 py-1 rounded-md border border-amber-200"
                >
                  Test Scan URL <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-2xl font-serif font-extrabold text-[#4A2E1A]">{liveScans.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500 font-bold block">Real Live Scans</span>
                  </div>
                  {liveScans > 0 ? (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-600" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      0 Scans
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedBanner(item)}
                  className="w-full py-2 bg-[#1C0D02] hover:bg-[#3D2310] text-[#F6C343] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all border border-[#F6C343]/30 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download QR Banner
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Banner Modal */}
      {selectedBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header Controls */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#F6C343]" />
                <span className="font-bold text-sm text-white">{selectedBanner.badge} — Print Preview</span>
              </div>
              <button
                onClick={() => setSelectedBanner(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Banner Card Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-b from-amber-50 to-white" id="printable-banner-area">
              <div className="bg-white rounded-3xl border-4 border-[#1C0D02] p-6 shadow-2xl text-center space-y-5 relative overflow-hidden">
                
                {/* Banner Top Stamp */}
                <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#1C0D02] text-white py-4 px-5 rounded-2xl border border-[#F6C343]/50 shadow-md flex items-center justify-center gap-3.5">
                  <img 
                    src="/icongaya.jpeg" 
                    alt="GayaSeva Official Logo" 
                    className="w-12 h-12 rounded-full border-2 border-[#F6C343] object-cover shadow-md shrink-0" 
                  />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#F6C343]">
                      OFFICIAL GAYA DHAM PILGRIM AID NETWORK
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-white leading-tight">
                      गया सेवा (GayaSeva)
                    </h2>
                    <p className="text-xs font-bold text-amber-200 mt-0.5">
                      {selectedBanner.tagline}
                    </p>
                  </div>
                </div>

                {/* Slogan Prompt */}
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#0F172A] leading-snug">
                    🙏 जय श्री हरि विष्णु! गया धाम में आपका स्वागत है।
                  </h3>
                  <div className="inline-block bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black border border-amber-300">
                    हम आपकी क्या सेवा कर सकते हैं? (1-टैप QR स्कैन सहायता)
                  </div>
                </div>

                {/* Scannable QR Code Image */}
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <div className="bg-white p-3 rounded-2xl border-2 border-[#F58220] shadow-xl relative group">
                    {/* Dynamic QR API Image */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(selectedBanner.url)}`}
                      alt={`GayaSeva QR Code - ${selectedBanner.name}`}
                      className="w-48 h-48 object-contain"
                    />
                    {/* Centered Brand Logo Badge */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white p-1 rounded-full border-2 border-[#F58220] shadow-xl flex items-center justify-center">
                        <img
                          src="/icongaya.jpeg"
                          alt="GayaSeva QR Center Logo"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    SCAN WITH ANY CAMERA / PAYTM / GOOGLE PAY / PHONEPE
                  </span>
                </div>

                {/* Included Services Icons Badge */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-extrabold text-[#0F172A] mb-2">
                    ⚡ 1-स्कैन से डायरेक्ट प्राप्त करें:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-left text-[11px] font-bold text-slate-700">
                    <div className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-[#F58220]" /> पिंडदान एवं तीर्थ पुरोहित</div>
                    <div className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-orange-600" /> टैक्सी एवं ऑटो पिक & ड्रॉप</div>
                    <div className="flex items-center gap-1.5"><Hotel className="w-3.5 h-3.5 text-blue-600" /> होटल एवं धर्मशाला बुकिंग</div>
                    <div className="flex items-center gap-1.5"><UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" /> 100% शुद्ध सात्विक भोजन</div>
                    <div className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-purple-600" /> 48-वेदी एवं तीर्थ गाइड</div>
                    <div className="flex items-center gap-1.5"><Bot className="w-3.5 h-3.5 text-cyan-600" /> 24/7 AI गया सेवा गाइड</div>
                  </div>
                </div>

                {/* Footer Brand Verification */}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-extrabold text-slate-600">
                  <div className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 0% Commission Direct Service
                  </div>
                  <div className="flex items-center gap-1.5 text-[#1C0D02]">
                    <img src="/icongaya.jpeg" alt="GayaSeva Footer Logo" className="w-4 h-4 rounded-full object-cover" />
                    <PhoneCall className="w-3.5 h-3.5 text-[#F58220]" /> www.gayaseva.com
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center gap-3">
              <span className="text-xs font-bold text-slate-600">
                Ready for A4 Printing & Flex Banners
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#1C0D02] hover:bg-[#3D2310] text-[#F6C343] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Printer className="w-4 h-4" /> Print Banner (A4/Poster)
                </button>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(selectedBanner.url)}`}
                  download={`GayaSeva_QR_Code_${selectedBanner.key}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#F58220] hover:bg-[#d96d13] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" /> Download QR Code PNG
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
