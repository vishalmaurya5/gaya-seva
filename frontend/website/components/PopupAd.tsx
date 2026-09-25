'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageSquare, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
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
      const fetched = await PopupAdStore.fetchAdsFromApi();
      const activeAd = fetched.find((a) => a.isActive) || ContentStore.getActivePopupAd();
      if (activeAd && activeAd.isActive) {
        setAd(activeAd);
        const delayMs = (activeAd.delaySeconds || 1) * 1000;
        const timer = setTimeout(() => setIsVisible(true), delayMs);
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

  if (!mounted || !ad) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        >
          {/* Ambient Glow Aura in Background */}
          <div className="absolute w-[500px] h-[500px] bg-[#F58220]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#321808] via-[#1B0E05] to-[#0A0502] text-white rounded-3xl border border-[#F6C343]/35 shadow-[0_0_60px_rgba(245,130,32,0.3)] overflow-hidden p-6 sm:p-8 space-y-6"
          >
            {/* Close Button with Glass Hover Effect */}
            <button
              onClick={() => handleClose(false)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 backdrop-blur-md hover:rotate-90 transition-all duration-300 shadow-lg"
              aria-label="Close Ad"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Premium Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#F58220]/20 via-[#F6C343]/20 to-[#F58220]/10 border border-[#F6C343]/40 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#F6C343] animate-spin-slow" />
              <span className="text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#FFE599] via-[#F6C343] to-[#F58220] bg-clip-text text-transparent">
                {language === 'hi' ? 'गया सेवा आधिकारिक ऑफर' : 'GayaSeva Official Offer'}
              </span>
            </div>

            {/* Banner Graphic Image (if present) */}
            {ad.imageUrl && (
              <div className="group relative aspect-[16/9] sm:h-52 w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/40">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Gradient vignette mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B0E05] via-transparent to-transparent opacity-60" />
              </div>
            )}

            {/* Content Header & Subtitle */}
            <div className="space-y-2.5">
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF5EB] to-[#FFE0C2] leading-tight tracking-tight drop-shadow-md">
                {ad.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#F8F6EF]/90 leading-relaxed font-medium">
                {ad.subtitle}
              </p>
            </div>

            {/* Contact Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {ad.phone && (
                <a
                  href={`tel:${ad.phone}`}
                  className="px-5 py-3.5 bg-gradient-to-r from-[#F58220] via-[#FF9933] to-[#E07210] hover:from-[#E07210] hover:to-[#C05D00] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_6px_25px_rgba(245,130,32,0.45)] hover:shadow-[0_8px_30px_rgba(245,130,32,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
                >
                  <Phone className="w-4 h-4 fill-current" /> {t('btnCallNow')}
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
                  className="px-5 py-3.5 bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_6px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
                >
                  <MessageSquare className="w-4 h-4 fill-current" /> {t('btnWhatsApp')}
                </a>
              )}
            </div>

            {/* CTA Action Link */}
            {ad.actionUrl && (
              <Link
                href={ad.actionUrl}
                onClick={() => handleClose(false)}
                className="group w-full py-3.5 bg-gradient-to-r from-[#F6C343]/10 via-[#F58220]/10 to-[#F6C343]/10 hover:from-[#F6C343]/20 hover:to-[#F58220]/20 text-[#F6C343] hover:text-white border border-[#F6C343]/35 hover:border-[#F6C343]/70 font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 backdrop-blur-md shadow-md"
              >
                <span>{t('btnExploreMore')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            )}

            {/* Dismiss Footer Bar */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors group">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleClose(true);
                    }
                  }}
                  className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-[#F58220] focus:ring-[#F58220] cursor-pointer"
                />
                <span className="font-medium text-gray-300 group-hover:text-white">
                  {language === 'hi' ? 'आज दोबारा मत दिखाएं' : "Don't show again today"}
                </span>
              </label>
              <button
                onClick={() => handleClose(false)}
                className="text-gray-400 hover:text-white font-medium underline underline-offset-4 transition-colors"
              >
                {language === 'hi' ? 'बंद करें' : 'Dismiss'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
