'use client';

import React, { useState, useEffect } from 'react';
import { Car, MapPin, Calendar, Clock, Users, Luggage, ShieldCheck, Phone, MessageSquare, Power, CheckCircle2 } from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { DirectoryGatedView } from '@/components/ui/DirectoryGatedView';
import { LockedContactBox } from '@/components/ui/LockedContactBox';

export default function PickDropPage() {
  const [pickup, setPickup] = useState('Gaya Railway Station');
  const [drop, setDrop] = useState('Vishnupad Temple');
  const [passengers, setPassengers] = useState(4);
  const [vehicleType, setVehicleType] = useState('Sedan');
  const [users, setUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    setUsers(UserStore.getUsers());
    const handleStorage = () => setUsers(UserStore.getUsers());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const registeredDrivers = users.filter((u) => u.role === 'DRIVER');

  const defaultDrivers = [
    { id: '1', name: 'Ramesh Kumar', vehicle: 'AC Dzire / Etios Sedan', passengers: 4, rating: 4.8, area: 'Gaya Railway Station', phone: '+919876543220', availabilityStatus: 'AVAILABLE' as const },
    { id: '2', name: 'Sunil Singh', vehicle: 'Maruti Ertiga 7-Seater', passengers: 7, rating: 4.9, area: 'Vishnupad Teerth', phone: '+919876543211', availabilityStatus: 'AVAILABLE' as const },
    { id: '3', name: 'Vijay Auto Service', vehicle: 'E-Rickshaw Auto', passengers: 3, rating: 4.7, area: 'Bodh Gaya Road', phone: '+919876543212', availabilityStatus: 'AVAILABLE' as const },
  ];

  const allDrivers = [
    ...registeredDrivers.map((u) => ({
      id: u.id,
      name: u.name,
      vehicle: u.customRole || 'AC Taxi / Auto',
      passengers: 4,
      rating: u.rating || 4.8,
      area: u.city || 'Gaya Junction & Vishnupad Zone',
      phone: u.phone,
      availabilityStatus: u.availabilityStatus || 'AVAILABLE',
    })),
    ...defaultDrivers.filter((dp) => !registeredDrivers.some((rp) => rp.phone === dp.phone)),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900">
      {/* Search Header */}
      <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/20 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
            <Car className="w-8 h-8 text-[#F58220]" /> Pick & Drop Vehicle Search
          </h1>
          <p className="text-xs text-[#F8F6EF]/80 mt-1">Book verified local taxis, autos, and teerth vehicles in Gaya Ji.</p>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#3D2310] p-4 rounded-2xl border border-[#F8F6EF]/10">
          <div>
            <label className="text-[11px] font-semibold text-[#F6C343] block mb-1">Pickup Location</label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-[#2A180B] border border-gray-600 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#F6C343] block mb-1">Drop Location</label>
            <input
              type="text"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              className="w-full bg-[#2A180B] border border-gray-600 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#F6C343] block mb-1">Passengers</label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-[#2A180B] border border-gray-600 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value={2}>1 - 2 Passengers</option>
              <option value={4}>3 - 4 Passengers</option>
              <option value={7}>5 - 7 Passengers (Large)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#F6C343] block mb-1">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-[#2A180B] border border-gray-600 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Bike">🏍️ Bike / Two-Wheeler Taxi</option>
              <option value="Sedan">🚗 AC Dzire / Etios Sedan</option>
              <option value="Auto">🛺 E-Rickshaw Auto Pickup</option>
              <option value="SUV">🚙 SUV Innova / Ertiga</option>
              <option value="Tempo">🚐 Tempo Traveller (Group)</option>
              <option value="Other">✏️ Other Custom Vehicle</option>
            </select>
          </div>
        </div>

        <button className="w-full py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-bold text-xs rounded-xl shadow-md transition-colors">
          Find Available Vehicles
        </button>
      </div>

      {/* Available Drivers List */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#4A2E1A]">Verified Pick & Drop Providers</h2>
        <DirectoryGatedView categoryName="Pick & Drop Taxi & Auto" totalCount={allDrivers.length} maxPreviewCount={2}>
          {(visibleCount, hasAccess) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allDrivers.slice(0, visibleCount).map((drv) => {
                const isAvailable = drv.availabilityStatus !== 'BOOKED';
                return (
                  <div key={drv.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-base text-[#4A2E1A]">{drv.name}</h3>
                          <div className="flex items-center gap-1.5 flex-wrap mt-1">
                            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded inline-flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> GayaSeva Verified
                            </span>

                            {isAvailable ? (
                              <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500 text-slate-950 rounded inline-flex items-center gap-1 animate-pulse">
                                🟢 AVAILABLE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white rounded inline-flex items-center gap-1">
                                🔴 BOOKED / BUSY
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">⭐ {drv.rating}</span>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1 bg-[#F8F6EF] p-3 rounded-xl">
                        <p>🚕 {drv.vehicle}</p>
                        <p>👥 Up to {drv.passengers} Passengers</p>
                        <p>📍 {hasAccess ? drv.area : '📍 Address & Location Locked'}</p>
                      </div>
                    </div>

                    <LockedContactBox 
                      providerId={drv.id} 
                      providerName={drv.name} 
                      defaultPhone={drv.phone}
                      serviceCategory="Pick & Drop Taxi Driver"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </DirectoryGatedView>
      </div>
    </div>
  );
}
