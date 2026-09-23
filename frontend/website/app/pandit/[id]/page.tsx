'use client';

import React from 'react';
import { Flame, ShieldCheck, MapPin, Languages, Calendar, CheckCircle } from 'lucide-react';
import { LockedContactBox } from '@/components/ui/LockedContactBox';

export default function PanditDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Pandit Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#4A2E1A] text-white font-serif font-bold text-2xl flex items-center justify-center">
              PS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif font-bold text-[#4A2E1A]">Pandit Rajesh Shastri</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> GayaSeva Verified
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">22+ Years Official Teerth Purohit Experience • Vishnupad Zone</p>
            </div>
          </div>
        </div>

        <LockedContactBox 
          providerId={params.id || 'pnd_100'} 
          providerName="Pandit Rajesh Shastri" 
          defaultPhone="+919876543210"
          serviceCategory="Pind Daan Pandit & Teerth Purohit"
        />

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
          <div className="space-y-3 bg-[#F8F6EF] p-5 rounded-2xl">
            <h3 className="font-serif font-bold text-sm text-[#4A2E1A]">Languages Spoken</h3>
            <p className="font-semibold text-gray-800">Hindi • Sanskrit • Bengali • Maithili</p>
            <h3 className="font-serif font-bold text-sm text-[#4A2E1A] pt-2">Services Provided</h3>
            <ul className="space-y-1">
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Pinda Daan Rituals</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Tripindi Shradh Rites</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Narayan Bali & Veda Puja</li>
            </ul>
          </div>

          <div className="space-y-3 bg-[#F8F6EF] p-5 rounded-2xl">
            <h3 className="font-serif font-bold text-sm text-[#4A2E1A]">Approximate Dakshina & Pricing</h3>
            <p className="text-gray-700">Pinda Daan Package: ₹1,500 - ₹3,500 (Depending on Samagri & rituals)</p>
            <h3 className="font-serif font-bold text-sm text-[#4A2E1A] pt-2">Location</h3>
            <p className="text-gray-700">Vishnupad Temple Premises & Falgu River Ghats</p>
          </div>
        </div>

        {/* Service Request Form */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h3 className="font-serif font-bold text-base text-[#4A2E1A]">Request Service Booking</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Select Date</label>
              <input type="date" className="w-full border border-gray-200 rounded-xl p-2.5 text-xs" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Ritual Type</label>
              <select className="w-full border border-gray-200 rounded-xl p-2.5 text-xs">
                <option>Pinda Daan</option>
                <option>Tripindi Shradh</option>
                <option>Navgrah Puja</option>
              </select>
            </div>
          </div>
          <button className="w-full py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-bold text-xs rounded-xl shadow-md">
            Request Service Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}
