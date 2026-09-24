'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Phone, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { ContentStore, PopupAd as PopupAdType, PopupAdStore } from '@/lib/contentStore';
import { useLanguage } from '@/context/LanguageContext';
import { getProfessionalWhatsAppUrl } from '@/lib/whatsappHelper';

export function PopupAd() {
  const { t, language } = useLanguage();
  const [ad, setAd] = useState<PopupAdType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if dismissed today
    const dismissedUntil = localStorage.getItem('gayaseva_popup_dismissed_until');
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      return;
    }

    const loadAd = async () => {
      await PopupAdStore.fetchAdsFromApi();
      const activeAd = ContentStore.getActivePopupAd();
      if (activeAd) {
        setAd(activeAd);
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    };

    loadAd();
  }, []);

  const handleClose = (dontShowToday: boolean = false) => {
    setIsVisible(false);
    if (dontShowToday) {
      // 24 hours expiry
      const nextDay = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('gayaseva_popup_dismissed_until', String(nextDay));
    }
  };

  if (!mounted || !isVisible || !ad) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#2A180B] via-[#3D2310] to-[#4A2E1A] text-white rounded-3xl border border-[#F58220]/30 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => handleClose(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close Ad"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F58220]/20 border border-[#F58220]/40 text-[#F6C343] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
          <span>{language === 'hi' ? 'गया सेवा आधिकारिक सूचना' : 'GayaSeva Official Offer'}</span>
        </div>

        {/* Banner Graphic Image (if present) */}
        {ad.imageUrl && (
          <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-white/10 shadow-md">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
            {ad.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#F8F6EF]/80 leading-relaxed font-medium">
            {ad.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {ad.phone && (
            <a
              href={`tel:${ad.phone}`}
              className="px-4 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> {t('btnCallNow')}
            </a>
          )}
          {ad.whatsapp && (
            <a
              href={getProfessionalWhatsAppUrl({
                phone: ad.whatsapp,
                title: ad.title,
                subtitle: ad.subtitle,
                sourceType: 'POPUP_AD',
                lang: language,
              })}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> {t('btnWhatsApp')}
            </a>
          )}
        </div>

        {ad.actionUrl && (
          <Link
            href={ad.actionUrl}
            onClick={() => handleClose(false)}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-[#F6C343] border border-[#F6C343]/30 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {t('btnExploreMore')} <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {/* Dismiss Option */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/10">
          <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  handleClose(true);
                }
              }}
              className="rounded bg-gray-800 border-gray-600 text-[#F58220] focus:ring-[#F58220]"
            />
            <span>{language === 'hi' ? 'आज दोबारा मत दिखाएं' : "Don't show again today"}</span>
          </label>
          <button
            onClick={() => handleClose(false)}
            className="hover:text-white underline"
          >
            {language === 'hi' ? 'बंद करें' : 'Dismiss'}
          </button>
        </div>
      </div>
    </div>
  );
}
