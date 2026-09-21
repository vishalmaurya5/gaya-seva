'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles, Phone, ShieldCheck, CheckCircle2, Smartphone, ArrowRight } from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('GayaSeva SW registered:', reg.scope))
        .catch((err) => console.log('SW registration error:', err));
    }

    // 2. Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 3. Detect iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIos(isIosDevice);

    // 4. Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. 30-Second Timer to trigger PWA install modal automatically
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('GAYASEVA_PWA_PROMPT_DISMISSED');
      if (!dismissed) {
        setShowPrompt(true);
      }
    }, 30000); // Exactly 30 seconds after opening website

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      alert('To install GayaSeva App on iPhone/iPad:\n1. Tap the Share button at the bottom of Safari.\n2. Select "Add to Home Screen".');
    } else {
      alert('GayaSeva App install prompt ready! Click "Install" or add page to home screen from browser menu.');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('GAYASEVA_PWA_PROMPT_DISMISSED', 'true');
    }
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-gradient-to-br from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-5 rounded-3xl border-2 border-[#F58220] shadow-2xl relative overflow-hidden backdrop-blur-xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F58220]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-amber-200/70 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Dismiss for now"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F58220] to-[#F6C343] p-0.5 shadow-lg shrink-0">
              <img src="/icongaya.jpeg" alt="GayaSeva App Icon" className="w-full h-full rounded-[14px] object-cover" />
            </div>

            <div>
              <span className="px-2 py-0.5 text-[9px] font-black bg-[#F58220] text-white rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" /> INSTALL OFFICIAL APP
              </span>
              <h3 className="font-serif font-bold text-base text-white leading-snug mt-0.5">
                Install GayaSeva App
              </h3>
              <p className="text-[11px] text-amber-100/90 font-medium">
                1-Tap Fast Offline Access &amp; 24/7 Helpline
              </p>
            </div>
          </div>

          <div className="bg-amber-950/70 p-3 rounded-2xl border border-amber-500/30 text-[11px] space-y-1.5 text-amber-100 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F6C343] shrink-0" />
              <span>100% Free Direct Booking for Yatri Pilgrims</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F6C343] shrink-0" />
              <span>Offline Station Pickup &amp; Teerth Pandits List</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#F58220] to-[#E07210] hover:from-[#E07210] hover:to-[#C86000] text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 border border-orange-400/40 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>Install App Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDismiss}
              className="px-3 py-3 text-amber-200/80 hover:text-white font-bold text-xs hover:bg-white/10 rounded-xl transition-colors"
            >
              Later
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
