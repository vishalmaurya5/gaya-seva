'use client';

import React, { useState } from 'react';
import { Navigation, MapPin, CheckCircle2, AlertCircle, RefreshCw, X, Compass } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';

export const LocationBanner: React.FC = () => {
  const { locationStatus, locationName, requestLocation, hasUserSetLocation, errorMessage } = useLocation();
  const { language } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [dismissed, setDismissed] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || (dismissed && locationStatus !== 'locating')) return null;

  const isHindi = language === 'hi';

  return (
    <div className="bg-gradient-to-r from-[#180F08] via-[#2A180B] to-[#180F08] text-amber-100 border-b border-amber-800/40 px-2.5 py-1.5 text-[10px] sm:text-xs transition-all shadow-inner max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 text-center sm:text-left min-w-0 max-w-full">
          <div className="p-1 rounded-full bg-amber-500/20 text-amber-400 shrink-0">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="min-w-0 flex-1 truncate">
            <span className="font-semibold text-white flex items-center justify-center sm:justify-start gap-1 flex-wrap truncate">
              <span className="truncate">{isHindi ? '📍 नजदीकी सेवा और स्थान:' : '📍 Live Proximity:'}</span>
              <span className="text-[#F6C343] font-bold truncate">
                {locationName}
              </span>
            </span>

            {errorMessage && (
              <p className="text-[9px] text-amber-300/70 truncate">{errorMessage}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={requestLocation}
            disabled={locationStatus === 'locating'}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold shadow transition-all active:scale-95 text-[10px] sm:text-xs disabled:opacity-50"
          >
            {locationStatus === 'locating' ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>{isHindi ? 'स्थान खोजा जा रहा है...' : 'Locating...'}</span>
              </>
            ) : (
              <>
                <Navigation className="w-3 h-3 fill-current" />
                <span>{isHindi ? 'जीपीएस स्थान अपडेट करें' : 'Update GPS Location'}</span>
              </>
            )}
          </button>

          {!hasUserSetLocation && (
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-amber-900/50 rounded text-amber-300 hover:text-white transition"
              title={isHindi ? 'बंद करें' : 'Dismiss'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
