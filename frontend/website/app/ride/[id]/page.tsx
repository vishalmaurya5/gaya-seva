'use client';

import React from 'react';
import { Car, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LockedContactBox } from '@/components/ui/LockedContactBox';

export default function ActiveRidePage({ params }: { params: { id: string } }) {
  const rideId = params.id || 'RD-84920';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Active Header */}
      <div className="bg-[#2A180B] text-white p-6 rounded-3xl border border-[#F58220]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-1 bg-[#F58220] text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider">
            LIVE TRACKING ACTIVE
          </span>
          <h1 className="text-xl font-serif font-bold text-white mt-1">Pick & Drop Ride #{rideId}</h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block">ETA TO DESTINATION</span>
          <span className="text-2xl font-serif font-bold text-[#F6C343]">12 Mins</span>
        </div>
      </div>

      {/* Status Stepper */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="font-serif font-bold text-sm text-[#4A2E1A]">Ride Status Timeline</h2>
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-500 overflow-x-auto pb-2">
          <span className="text-emerald-600 flex items-center gap-1">✓ Searching</span>
          <span className="text-emerald-600 flex items-center gap-1">✓ Accepted</span>
          <span className="text-emerald-600 flex items-center gap-1">✓ Arriving</span>
          <span className="text-[#F58220] font-extrabold flex items-center gap-1">● In Progress</span>
          <span>Completed</span>
        </div>
      </div>

      {/* Driver Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#4A2E1A] text-white font-serif font-bold flex items-center justify-center">
            DK
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#4A2E1A] flex items-center gap-1.5">
              Dinesh Kumar
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded font-semibold">GayaSeva Verified</span>
            </h3>
            <p className="text-xs text-gray-600">Maruti DZire Sedan • BR-02-AB-1234</p>
          </div>
        </div>

        <LockedContactBox 
          providerId={params.id || 'drv_100'} 
          providerName="Dinesh Kumar (Driver)" 
          defaultPhone="+919876543210"
          serviceCategory="Pick & Drop Taxi Driver"
        />
      </div>

      {/* Map Display Container */}
      <div className="bg-gray-100 p-8 rounded-3xl border border-gray-200 h-80 flex flex-col items-center justify-center text-center space-y-2">
        <Navigation className="w-10 h-10 text-[#F58220] animate-bounce" />
        <h3 className="font-serif font-bold text-base text-[#4A2E1A]">Leaflet Live GPS Active</h3>
        <p className="text-xs text-gray-500 max-w-sm">Private Realtime channel <code className="bg-gray-200 px-1 rounded">ride:{rideId}</code> streaming coordinates.</p>
      </div>
    </div>
  );
}
