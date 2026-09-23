'use client';

import React from 'react';
import { ShieldCheck, Star, MapPin } from 'lucide-react';
import { LockedContactBox } from '@/components/ui/LockedContactBox';

export default function PublicProviderProfilePage({ params }: { params: { id: string } }) {
  const providerId = params.id || 'prov_100';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#4A2E1A] text-white font-serif font-bold text-2xl flex items-center justify-center">
              GP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif font-bold text-[#4A2E1A]">Gaya Ji Certified Services</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> GayaSeva Verified
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F58220]" /> Vishnupad Teerth & Station Zone • ⭐ 4.9 Rating
              </p>
            </div>
          </div>
        </div>

        <LockedContactBox 
          providerId={providerId} 
          providerName="Gaya Ji Certified Services" 
          defaultPhone="+919876543210"
          serviceCategory="Gaya Ji Teerth Provider"
        />

        <div className="space-y-3 bg-[#F8F6EF] p-5 rounded-2xl text-xs text-gray-700">
          <h3 className="font-serif font-bold text-sm text-[#4A2E1A]">Services Offered</h3>
          <p>• Pick & Drop Airport / Station Taxis</p>
          <p>• Pinda Daan Puja Assistance</p>
          <p>• Hotel & Guest House Booking</p>
        </div>
      </div>
    </div>
  );
}
