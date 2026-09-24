'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Phone, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { ContentStore, SliderBanner, SliderBannerStore } from '@/lib/contentStore';
import { useLanguage } from '@/context/LanguageContext';
import { getProfessionalWhatsAppUrl } from '@/lib/whatsappHelper';

export function RectangularBannerSlider() {
  const { language } = useLanguage();
  const [banners, setBanners] = useState<SliderBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadBanners = async () => {
      await SliderBannerStore.fetchBannersFromApi();
      setBanners(ContentStore.getActiveSliderBanners());
    };
    loadBanners();

    const handleStorage = () => {
      setBanners(ContentStore.getActiveSliderBanners());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!mounted || banners.length === 0) return null;

  const current = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 my-8">
      <div className="relative bg-gradient-to-r from-[#2A180B] via-[#4A2E1A] to-[#3D2310] text-white rounded-3xl border border-[#F58220]/30 shadow-2xl overflow-hidden p-6 sm:p-10 transition-all duration-500 min-h-[220px] flex flex-col justify-between">
        
        {/* Background Graphic Image Overlay */}
        {current.imageUrl && (
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Banner Card Content */}
        <div className="relative z-10 space-y-4 max-w-3xl">
          {current.badgeText && (
            <span className="px-3.5 py-1 rounded-full bg-[#F58220] text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider inline-block shadow-md">
              ✨ {current.badgeText}
            </span>
          )}

          <h2 className="text-xl sm:text-3xl font-serif font-bold text-white leading-tight drop-shadow">
            {current.title}
          </h2>

          <p className="text-xs sm:text-base text-[#F8F6EF]/90 font-medium leading-relaxed">
            {current.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {current.actionUrl && (
              <Link
                href={current.actionUrl}
                className="px-6 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                {current.buttonText || 'Explore Now'} <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {current.phone && (
              <a
                href={`tel:${current.phone}`}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-[#F6C343] border border-[#F6C343]/30 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-[#F58220]" /> {current.phone}
              </a>
            )}

            {current.whatsapp && (
              <a
                href={getProfessionalWhatsAppUrl({
                  phone: current.whatsapp,
                  title: current.title,
                  subtitle: current.subtitle,
                  sourceType: 'SLIDER_BANNER',
                  lang: language,
                })}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Carousel Navigation Arrows & Dots */}
        {banners.length > 1 && (
          <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 mt-6">
            <div className="flex items-center gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx ? 'w-8 bg-[#F58220]' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
