'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, MapPin, Languages, Phone, MessageSquare, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore, UserAccount } from '@/lib/userStore';

export default function PanditDirectoryPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    setUsers(UserStore.getUsers());
    const handleStorage = () => setUsers(UserStore.getUsers());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const registeredPandits = users.filter((u) => u.role === 'PANDIT' || (u.customRole && u.customRole.toUpperCase().includes('PANDIT')));

  // Initial Seed Data merged with dynamic store
  const defaultPandits = [
    {
      id: 'pnd_1',
      name: 'Pandit Rajesh Shastri',
      languages: ['Hindi', 'Sanskrit', 'Bengali'],
      services: ['Pind Daan', 'Tripindi Shradh', 'Veda Puja'],
      area: 'Vishnupad Temple Zone',
      rating: 4.9,
      experience: '22+ Years Experience',
      status: 'VERIFIED',
      phone: '+919296804705',
      availabilityStatus: 'AVAILABLE' as const,
    },
    {
      id: 'pnd_2',
      name: 'Pandit Suresh Tiwari',
      languages: ['Hindi', 'Sanskrit', 'Maithili'],
      services: ['Pind Daan', 'Kalsarp Dosh Puja'],
      area: 'Falgu Ghat Zone',
      rating: 4.8,
      experience: '18+ Years Experience',
      status: 'VERIFIED',
      phone: '+918544491413',
      availabilityStatus: 'AVAILABLE' as const,
    },
  ];

  const allPandits = [
    ...registeredPandits.map((u) => ({
      id: u.id,
      name: u.name,
      languages: u.languages || ['Hindi', 'Sanskrit'],
      services: ['Pind Daan', 'Vedic Shradh Rites'],
      area: u.city || 'Vishnupad Zone',
      rating: u.rating || 4.9,
      experience: 'Verified Gaya Purohit',
      status: u.status,
      phone: u.phone,
      availabilityStatus: u.availabilityStatus || 'AVAILABLE',
    })),
    ...defaultPandits.filter((dp) => !registeredPandits.some((rp) => rp.phone === dp.phone)),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900">
      {/* Hero Banner */}
      <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Flame className="w-8 h-8 text-[#F6C343]" /> अपनी धार्मिक सेवा की योजना पहले करें।
          </h1>
          <p className="text-xs text-[#F8F6EF]/80 mt-1 font-medium">Book verified Gaya Ji Teerth Pandits for Pinda Daan and Shradh Rites.</p>
        </div>
        <GayaSevaLogo size={64} className="shrink-0 drop-shadow-md" />
      </div>

      {/* Pandit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allPandits.map((pnd) => {
          const isVerified = pnd.status === 'VERIFIED';
          const isAvailable = pnd.availabilityStatus !== 'BOOKED';
          return (
            <div key={pnd.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 flex items-center gap-1.5">{pnd.name}</h3>
                    
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      {isVerified ? (
                        <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-900 rounded-full inline-flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> GayaSeva Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-[10px] font-black bg-amber-100 text-amber-950 rounded-full inline-flex items-center gap-1 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-700" /> Pending Admin Approval
                        </span>
                      )}

                      {isAvailable ? (
                        <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-500 text-slate-950 rounded-full inline-flex items-center gap-1 animate-pulse">
                          🟢 AVAILABLE FOR PUJA
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-[10px] font-black bg-red-600 text-white rounded-full inline-flex items-center gap-1">
                          🔴 BUSY WITH RITUAL
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">⭐ {pnd.rating}</span>
                </div>

                <div className="text-xs text-slate-700 font-medium space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <p className="font-bold text-slate-900">Languages: {pnd.languages.join(' • ')}</p>
                  <p>Services: {pnd.services.join(' • ')}</p>
                  <p>📍 {pnd.area}</p>
                  <p className="text-slate-600 font-semibold">{pnd.experience}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`tel:${pnd.phone}`}
                  className="flex-1 py-3 bg-[#2A180B] hover:bg-[#3A2314] text-white text-xs font-black rounded-xl text-center shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F58220]" />
                  <span>Call Pandit Ji</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

