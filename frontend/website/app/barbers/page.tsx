'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scissors, ShieldCheck, MapPin, Languages, Phone, MessageSquare, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore, UserAccount } from '@/lib/userStore';
import { formatPhoneNumber, getProfessionalWhatsAppUrl } from '@/lib/whatsappHelper';

export default function BarberDirectoryPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    setUsers(UserStore.getUsers());
    UserStore.fetchUsersFromApi().then((apiUsers) => {
      if (apiUsers && apiUsers.length > 0) {
        setUsers(apiUsers);
      }
    });

    const handleStorage = () => setUsers(UserStore.getUsers());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const registeredBarbers = users.filter(
    (u) =>
      u.role === 'BARBER' ||
      (u.customRole && (u.customRole.toUpperCase().includes('BARBER') || u.customRole.includes('नाई') || u.customRole.includes('क्षौर')))
  );

  const defaultBarbers: Array<{
    id: string;
    name: string;
    languages: string[];
    services: string[];
    area: string;
    rating: number;
    experience: string;
    status: 'VERIFIED' | 'PENDING' | 'SUSPENDED';
    phone: string;
    availabilityStatus: 'AVAILABLE' | 'BOOKED';
    avatarUrl?: string;
  }> = [
    {
      id: 'brb_default_1',
      name: 'Ramu Thakur (Kshaur Karma)',
      languages: ['Hindi', 'Magahi'],
      services: ['Pind Daan Mundan', 'Kshaur Karma', 'Traditional Barber Rituals'],
      area: 'Vishnupad Ghat Area',
      rating: 4.9,
      experience: '15+ Years Experience',
      status: 'VERIFIED',
      phone: '+919876543250',
      availabilityStatus: 'AVAILABLE',
      avatarUrl: undefined,
    },
    {
      id: 'brb_default_2',
      name: 'Chanda Thakur',
      languages: ['Hindi', 'English'],
      services: ['Pind Daan Mundan', 'Kshaur Karma', 'Ghat Mundan Service'],
      area: 'Gaya Ji / Falgu Ghat',
      rating: 5.0,
      experience: 'GayaSeva Verified Partner',
      status: 'VERIFIED',
      phone: '+919939778855',
      availabilityStatus: 'AVAILABLE',
      avatarUrl: '/uploads/gayaseva-partner-profiles/IMG_20240829_204658_1790016073002_xpy2mvg_1790016075236.jpg',
    }
  ];

  const allBarbers = [
    ...registeredBarbers.map((u) => ({
      id: u.id,
      name: u.name,
      languages: u.languages || ['Hindi', 'Magahi'],
      services: [u.customRole || 'Pind Daan Mundan & Kshaur Karma'],
      area: u.city || 'Vishnupad Ghat Zone',
      rating: u.rating || 4.9,
      experience: 'Verified Traditional Barber (नाई / ठाकुर)',
      status: u.status,
      phone: u.phone,
      availabilityStatus: u.availabilityStatus || 'AVAILABLE',
      avatarUrl: u.avatarUrl || u.profilePicUrl,
    })),
    ...defaultBarbers.filter((db) => !registeredBarbers.some((rb) => rb.phone && rb.phone.replace(/\D/g, '') === db.phone.replace(/\D/g, ''))),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900 antialiased">
      {/* Hero Banner */}
      <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F58220] text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-sm">
            <Scissors className="w-4 h-4" /> <span>KSHAUR KARMA & MUNDAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            गया जी क्षौर कर्म एवं मुंडन नाई (ठाकुर) सेवा
          </h1>
          <p className="text-xs text-[#F8F6EF]/80 font-medium max-w-xl">
            पिंडदान मुंडन एवं क्षौर कर्म हेतु गया धाम के अधिकृत एवं सत्यापित पारंपरिक नाई (ठाकुर) से सीधे संपर्क करें।
          </p>
        </div>
        <GayaSevaLogo size={64} className="shrink-0 drop-shadow-md" />
      </div>

      {/* Barber Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allBarbers.map((brb) => {
          const isVerified = brb.status === 'VERIFIED';
          const isAvailable = brb.availabilityStatus !== 'BOOKED';
          return (
            <div key={brb.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#1C0D02] font-black text-base flex items-center justify-center shrink-0 border border-amber-300 overflow-hidden shadow-xs">
                      {brb.avatarUrl ? (
                        <img src={brb.avatarUrl} alt={brb.name} className="w-full h-full object-cover" />
                      ) : (
                        brb.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900 flex items-center gap-1.5">{brb.name}</h3>
                      
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
                            🟢 AVAILABLE FOR MUNDAN
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[10px] font-black bg-red-600 text-white rounded-full inline-flex items-center gap-1">
                            🔴 BUSY
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">⭐ {brb.rating}</span>
                </div>

                <div className="text-xs text-slate-700 font-medium space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <p className="font-bold text-slate-900">Languages: {brb.languages.join(' • ')}</p>
                  <p>Services: {brb.services.join(' • ')}</p>
                  <p>📍 {brb.area}</p>
                  <p className="text-slate-600 font-semibold">{brb.experience}</p>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <a
                  href={`tel:${brb.phone}`}
                  className="flex-1 py-3 bg-[#2A180B] hover:bg-[#3A2314] text-[#F6C343] text-xs font-black rounded-xl text-center shadow-sm flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F58220]" />
                  <span>Call Barber ({brb.phone})</span>
                </a>

                <a
                  href={getProfessionalWhatsAppUrl({
                    phone: formatPhoneNumber(brb.phone),
                    title: brb.name,
                    subtitle: 'Barber & Kshaur Karma Service',
                    lang: 'hi',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl text-center shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/services?category=BARBER"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
        >
          <span>View All Barbers in Services Directory &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
