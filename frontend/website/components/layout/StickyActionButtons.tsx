'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Sparkles, PhoneCall } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function StickyActionButtons() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <>
      {/* LEFT STICKY BUTTON: WhatsApp Yatri Enquiry */}
      <a
        href="https://wa.me/918544491413?text=Namaste%20GayaSeva!%20I%20want%20to%20enquire%20about%20Pind%20Daan,%20Taxi%20Pick%20%26%20Drop,%20and%20Stays%20in%20Gaya%20Ji."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Enquiry"
        className="fixed bottom-28 sm:bottom-20 left-3 sm:left-6 z-50 pointer-events-auto cursor-pointer bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl rounded-full px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 font-bold text-xs transition-all active:scale-95 border border-white/20 group hover:shadow-green-500/30"
      >
        <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 shrink-0 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">
          {isHindi ? 'WhatsApp सहायता' : 'WhatsApp Enquiry'}
        </span>
      </a>

      {/* RIGHT STICKY BUTTON: AI Yatri Assistant */}
      <Link
        href="/ai"
        aria-label="AI Yatri Assistant"
        className="fixed bottom-28 sm:bottom-20 right-3 sm:right-6 z-50 pointer-events-auto cursor-pointer bg-gradient-to-r from-[#F58220] via-[#E07210] to-[#D97706] hover:from-[#E07210] hover:to-[#B45309] text-white shadow-2xl rounded-full px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2 font-black text-xs sm:text-sm transition-all active:scale-95 border-2 border-white/40 group hover:shadow-orange-500/40"
      >
        <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-[#F6C343] shrink-0 animate-pulse group-hover:rotate-12 transition-transform" />
        <span className="inline">
          {isHindi ? 'AI तीर्थ गाइड' : 'AI Yatri Guide'}
        </span>
      </Link>
    </>
  );
}
export default StickyActionButtons;
