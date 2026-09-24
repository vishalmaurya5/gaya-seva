'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  ExternalLink,
  ShieldCheck,
  CalendarCheck,
  Building2,
  Car,
  Flame,
  ShoppingBag,
  Compass,
  Scissors,
  UserCheck,
  Users
} from 'lucide-react';
import { UserAccount } from '@/lib/userStore';
import { realtimeAvailabilityEngine } from '@/lib/realtimeAvailability';
import { getProviderRoleConfig, AvailabilityStatusType } from '@/lib/providerRoleMap';
import { LockedContactBox } from './LockedContactBox';

interface WebsiteProviderCardProps {
  provider: UserAccount;
  onRequestBooking?: (provider: UserAccount) => void;
  showContactBox?: boolean;
}

export const WebsiteProviderCard: React.FC<WebsiteProviderCardProps> = ({
  provider,
  onRequestBooking,
  showContactBox = false,
}) => {
  const roleConfig = getProviderRoleConfig(provider.role || provider.customRole);
  
  const [currentStatus, setCurrentStatus] = useState<AvailabilityStatusType>(
    (provider.availabilityStatus as AvailabilityStatusType) || 
    (provider.availabilityStatus !== 'BOOKED' ? 'AVAILABLE' : 'BOOKED')
  );

  useEffect(() => {
    // Subscribe to realtime status updates
    const unsubscribe = realtimeAvailabilityEngine.subscribe((payload) => {
      if (payload.providerId === provider.id) {
        setCurrentStatus(payload.status);
      }
    });

    return () => unsubscribe();
  }, [provider.id]);

  const isVerified = provider.status === 'VERIFIED';
  const isPending = provider.status === 'PENDING';

  // Find status badge config from roleConfig
  const statusCfg = roleConfig.availableStatuses.find((s) => s.key === currentStatus) || roleConfig.availableStatuses[0];

  const getCategoryIcon = () => {
    switch (roleConfig.category) {
      case 'TRANSPORT': return <Car className="w-4 h-4 text-[#F58220]" />;
      case 'RELIGIOUS': return <Flame className="w-4 h-4 text-[#F58220]" />;
      case 'ACCOMMODATION': return <Building2 className="w-4 h-4 text-[#F58220]" />;
      case 'SHOPPING': return <ShoppingBag className="w-4 h-4 text-[#F58220]" />;
      case 'GUIDANCE': return <Compass className="w-4 h-4 text-[#F58220]" />;
      default: return <UserCheck className="w-4 h-4 text-[#F58220]" />;
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-200/80 shadow-md hover:shadow-xl transition-all font-sans relative overflow-hidden group space-y-4">
      
      {/* Top Banner Row */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-3.5">
          {/* Avatar or Initial */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1C0D02] to-[#3D2310] text-amber-300 font-serif font-black text-2xl flex items-center justify-center border-2 border-amber-500/30 shadow-md shrink-0">
            {provider.avatarUrl || provider.profilePicUrl ? (
              <img
                src={provider.avatarUrl || provider.profilePicUrl}
                alt={provider.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              provider.name.charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Verification Badge */}
              {isVerified ? (
                <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-900 rounded-full inline-flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> GayaSeva Verified
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-[10px] font-black bg-amber-100 text-amber-950 rounded-full inline-flex items-center gap-1 border border-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-700" /> Pending Admin Verification
                </span>
              )}

              {/* Dynamic Live Status Badge */}
              <span className={`px-2.5 py-0.5 text-[10px] uppercase rounded-full inline-flex items-center gap-1 shadow-xs ${statusCfg.badgeClass}`}>
                {statusCfg.label}
              </span>
            </div>

            <h3 className="font-serif font-bold text-lg text-slate-950 pt-0.5 group-hover:text-[#F58220] transition-colors">
              {provider.name}
            </h3>

            <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
              {getCategoryIcon()}
              <span>{provider.customRole || roleConfig.title}</span>
            </p>
          </div>
        </div>

        {/* Rating Pill */}
        <div className="text-xs font-black text-amber-900 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200/80 shrink-0 shadow-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{provider.rating ? provider.rating.toFixed(1) : '5.0'}</span>
        </div>
      </div>

      {/* Description & Details Box */}
      <div className="text-xs text-slate-700 space-y-2 bg-[#F8F6EF] p-4 rounded-2xl border border-orange-100">
        <p className="font-bold text-[#4A2E1A] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#F58220] shrink-0" />
          <span>{provider.city || 'Gaya Ji Central & Vishnupad Area'}</span>
        </p>

        {(provider.capacity || provider.role === 'DRIVER' || provider.role === 'AUTO' || provider.role === 'TRAVEL') && (
          <p className="font-extrabold text-[#F58220] flex items-center gap-1.5 pt-0.5">
            <Users className="w-3.5 h-3.5 text-[#F58220] shrink-0" />
            <span>{provider.capacity || 'Up to 4 Passengers'}</span>
          </p>
        )}

        {provider.description && (
          <p className="text-slate-800 font-semibold pt-1 border-t border-amber-200/60 leading-relaxed">
            {provider.description}
          </p>
        )}

        {provider.specialization && (
          <p className="text-slate-800 font-bold pt-1 border-t border-amber-200/60">
            ☸️ <strong className="text-[#4A2E1A]">Specialization:</strong> {provider.specialization}
          </p>
        )}

        {provider.languages && provider.languages.length > 0 && (
          <p className="text-slate-700 font-bold pt-1">
            🗣️ Languages: <span className="text-slate-900">{provider.languages.join(' • ')}</span>
          </p>
        )}
      </div>

      {/* Navigation Link if Present */}
      {provider.googleMapsUrl && (
        <a
          href={provider.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-50 border border-amber-300/80 py-2.5 rounded-xl hover:bg-amber-100 transition shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5 text-[#F58220]" />
          <span>Google Maps Directions</span>
          <ExternalLink className="w-3 h-3 text-amber-700" />
        </a>
      )}

      {/* Locked Contact Box Integration or Direct Actions */}
      {showContactBox ? (
        <LockedContactBox
          providerId={provider.id}
          providerName={provider.name}
          defaultPhone={provider.phone}
          serviceCategory={provider.customRole || roleConfig.title}
        />
      ) : (
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
          {onRequestBooking && (
            <button
              onClick={() => onRequestBooking(provider)}
              disabled={['BUSY', 'BOOKED', 'FULL', 'CLOSED', 'OFFLINE'].includes(currentStatus)}
              className={`col-span-2 py-3 px-4 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                ['BUSY', 'BOOKED', 'FULL', 'CLOSED', 'OFFLINE'].includes(currentStatus)
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#F58220] to-[#E07210] text-white hover:opacity-95 active:scale-95'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>
                {['BUSY', 'BOOKED', 'FULL', 'CLOSED', 'OFFLINE'].includes(currentStatus)
                  ? 'TEMPORARILY UNAVAILABLE'
                  : 'REQUEST SERVICE / BOOK NOW'}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
