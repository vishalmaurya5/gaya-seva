'use client';

import React, { useState, useEffect } from 'react';
import { Hotel, Search, ShieldCheck, Phone, MessageSquare, Car, Star } from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';

export default function StayPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    setUsers(UserStore.getUsers());
    const handleStorage = () => setUsers(UserStore.getUsers());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const registeredHotels = users.filter((u) => u.role === 'HOTEL');

  const defaultHotels = [
    { id: '1', name: 'Gaya Ji Teerth Guest House', rating: 4.8, location: 'Near Vishnupad Temple', capacity: '2-4 Bed Family Rooms', parking: true, phone: '+919876543230', availabilityStatus: 'AVAILABLE' as const },
    { id: '2', name: 'Shree Krishna Dharamshala', rating: 4.7, location: 'Station Road, Gaya Ji', capacity: 'Budget Dormitory & Rooms', parking: false, phone: '+919876543221', availabilityStatus: 'AVAILABLE' as const },
    { id: '3', name: 'Bodh Gaya Teerth Resort', rating: 4.9, location: 'Bodh Gaya Main Road', capacity: 'Premium AC Suites', parking: true, phone: '+919876543222', availabilityStatus: 'AVAILABLE' as const },
  ];

  const allHotels = [
    ...registeredHotels.map((u) => ({
      id: u.id,
      name: u.name,
      rating: u.rating || 4.8,
      location: u.city || 'Vishnupad Temple Zone',
      capacity: u.customRole || 'Family AC Rooms & Dharamshala',
      parking: true,
      phone: u.phone,
      availabilityStatus: u.availabilityStatus || 'AVAILABLE',
    })),
    ...defaultHotels.filter((dh) => !registeredHotels.some((rh) => rh.phone === dh.phone)),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900">
      {/* Hero Banner */}
      <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/20 shadow-xl space-y-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
          <Hotel className="w-8 h-8 text-[#1E88E5]" /> Gaya mein apna stay khojiye.
        </h1>
        <p className="text-xs text-[#F8F6EF]/80">Verified Hotels, Guest Houses, Dharamshalas for Pilgrims & Families.</p>
      </div>

      {/* Hotel Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allHotels.map((htl) => {
          const isAvailable = htl.availabilityStatus !== 'BOOKED';
          return (
            <div key={htl.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#4A2E1A]">{htl.name}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> GayaSeva Verified
                      </span>

                      {isAvailable ? (
                        <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500 text-slate-950 rounded inline-flex items-center gap-1 animate-pulse">
                          🟢 ROOMS AVAILABLE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white rounded inline-flex items-center gap-1">
                          🔴 FULLY BOOKED
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">⭐ {htl.rating}</span>
                </div>

                <div className="text-xs text-gray-600 space-y-1 bg-[#F8F6EF] p-3 rounded-xl">
                  <p>📍 {htl.location}</p>
                  <p>🛏️ {htl.capacity}</p>
                  <p>🚗 {htl.parking ? 'Vehicle Parking Available' : 'No Dedicated Parking'}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={isAvailable ? `tel:${htl.phone}` : '#'}
                  onClick={(e) => {
                    if (!isAvailable) {
                      e.preventDefault();
                      alert('यह होटल अभी फुल / बुक है! / Hotel is currently FULLY BOOKED.');
                    }
                  }}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl text-center flex items-center justify-center gap-1 transition-all ${
                    isAvailable
                      ? 'bg-[#4A2E1A] text-white cursor-pointer'
                      : 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" /> {isAvailable ? 'Call' : 'Fully Booked'}
                </a>
                <a
                  href={isAvailable ? `https://wa.me/${htl.phone.replace('+', '')}?text=Inquiry%20for%20room%20booking` : '#'}
                  onClick={(e) => {
                    if (!isAvailable) {
                      e.preventDefault();
                      alert('यह होटल अभी फुल / बुक है! / Hotel is currently FULLY BOOKED.');
                    }
                  }}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl text-center flex items-center justify-center gap-1 transition-all ${
                    isAvailable
                      ? 'bg-[#25D366] text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
