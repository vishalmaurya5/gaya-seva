'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Car, MapPin, Calendar, Clock, Users, Luggage, ShieldCheck, Phone, MessageSquare, Power, CheckCircle2, Search, Filter } from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { DirectoryGatedView } from '@/components/ui/DirectoryGatedView';
import { LockedContactBox } from '@/components/ui/LockedContactBox';
import { WebsiteProviderCard } from '@/components/ui/WebsiteProviderCard';

export default function PickDropPage() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [passengersFilter, setPassengersFilter] = useState<string>('ALL');
  const [vehicleType, setVehicleType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [users, setUsers] = useState<UserAccount[]>([]);

  const loadData = () => {
    setUsers(UserStore.getUsers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('gayaseva_user_change', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('gayaseva_user_change', loadData);
    };
  }, []);

  const registeredDrivers = useMemo(() => {
    return users.filter((u) => u.role === 'DRIVER' || u.role === 'AUTO' || u.role === 'TRAVEL');
  }, [users]);

  const defaultDrivers = [
    { id: 'usr_drv_ramesh', name: 'Ramesh Kumar', vehicle: 'AC Dzire / Etios Sedan', capacity: 'Up to 4 Passengers', rating: 4.8, city: 'Gaya Railway Station', phone: '+919876543220', availabilityStatus: 'AVAILABLE' as const, role: 'DRIVER' as const, status: 'VERIFIED' as const, description: 'Station & Vishnupad Pick & Drop Service' },
    { id: 'usr_drv_sunil', name: 'Sunil Singh (Ertiga SUV)', vehicle: 'Maruti Ertiga 7-Seater', capacity: 'Up to 7 Passengers', rating: 4.9, city: 'Vishnupad Teerth Zone', phone: '+919876543211', availabilityStatus: 'AVAILABLE' as const, role: 'DRIVER' as const, status: 'VERIFIED' as const, description: 'Family & Group Outstation SUV Service' },
    { id: 'usr_drv_vijay', name: 'Vijay Auto & E-Rickshaw', vehicle: 'E-Rickshaw Auto Pickup', capacity: 'Up to 3 Passengers', rating: 4.7, city: 'Bodh Gaya Road', phone: '+919876543212', availabilityStatus: 'AVAILABLE' as const, role: 'AUTO' as const, status: 'VERIFIED' as const, description: 'Local E-Rickshaw & Auto Commute' },
  ];

  const allDrivers = useMemo(() => {
    const regMapped = registeredDrivers.map((u) => ({
      id: u.id,
      name: u.name,
      vehicle: u.customRole || 'AC Taxi / Auto Pickup',
      capacity: u.capacity || 'Up to 4 Passengers',
      rating: u.rating || 4.8,
      city: u.city || 'Gaya Junction & Vishnupad Zone',
      phone: u.phone,
      availabilityStatus: u.availabilityStatus || 'AVAILABLE',
      avatarUrl: u.avatarUrl || u.profilePicUrl,
      role: u.role,
      status: u.status,
      description: u.description,
      googleMapsUrl: u.googleMapsUrl,
      languages: u.languages,
    }));

    const defaultsToInclude = defaultDrivers.filter((dp) => !registeredDrivers.some((rp) => rp.phone === dp.phone));
    return [...regMapped, ...defaultsToInclude];
  }, [registeredDrivers]);

  // ACTIVE FILTER ENGINE
  const filteredDrivers = useMemo(() => {
    return allDrivers.filter((drv) => {
      // 1. Location / Pickup Search Filter
      const q = (searchQuery || pickup || drop).toLowerCase().trim();
      if (q) {
        const matchesQuery = 
          drv.name.toLowerCase().includes(q) ||
          drv.vehicle.toLowerCase().includes(q) ||
          drv.city.toLowerCase().includes(q) ||
          (drv.description && drv.description.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Vehicle Type Dropdown Filter
      if (vehicleType !== 'ALL') {
        const vLower = vehicleType.toLowerCase();
        const drvVehicleLower = drv.vehicle.toLowerCase();
        if (vLower === 'sedan' && !drvVehicleLower.includes('sedan') && !drvVehicleLower.includes('dzire') && !drvVehicleLower.includes('etios') && !drvVehicleLower.includes('car')) return false;
        if (vLower === 'suv' && !drvVehicleLower.includes('suv') && !drvVehicleLower.includes('ertiga') && !drvVehicleLower.includes('innova')) return false;
        if (vLower === 'auto' && !drvVehicleLower.includes('auto') && !drvVehicleLower.includes('rickshaw') && !drvVehicleLower.includes('e-rickshaw')) return false;
        if (vLower === 'tempo' && !drvVehicleLower.includes('tempo') && !drvVehicleLower.includes('traveller')) return false;
      }

      // 3. Passenger Capacity Filter
      if (passengersFilter !== 'ALL') {
        const passNum = parseInt(passengersFilter, 10);
        if (!isNaN(passNum)) {
          const capacityStr = drv.capacity.toLowerCase();
          if (passNum > 4 && !capacityStr.includes('6') && !capacityStr.includes('7') && !capacityStr.includes('12')) return false;
          if (passNum <= 3 && capacityStr.includes('7') && !capacityStr.includes('3') && !capacityStr.includes('4')) return false;
        }
      }

      return true;
    });
  }, [allDrivers, searchQuery, pickup, drop, vehicleType, passengersFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900 antialiased">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#F58220]/40 shadow-xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#F58220] text-white px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide mb-2 shadow-xs">
            <Car className="w-4 h-4" />
            <span>DIRECT PICK & DROP SEARCH ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white flex items-center gap-2">
            Gaya Ji Pick & Drop Vehicle Search
          </h1>
          <p className="text-xs sm:text-sm text-[#F8F6EF]/90 mt-1 font-medium">
            Book 100% verified local taxis, e-rickshaws, autos, and SUVs directly from drivers (0% Commission).
          </p>
        </div>

        {/* Interactive Search & Filter Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#3D2310]/90 p-4 sm:p-5 rounded-2xl border border-amber-500/30">
          <div>
            <label className="text-[11px] font-extrabold text-[#F6C343] block mb-1">📍 Pickup Location / Area</label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="e.g. Gaya Railway Station"
              className="w-full bg-[#1C0D02] border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-400 font-bold focus:outline-none focus:border-[#F58220]"
            />
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-[#F6C343] block mb-1">🏁 Drop Location</label>
            <input
              type="text"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              placeholder="e.g. Vishnupad Temple / Bodh Gaya"
              className="w-full bg-[#1C0D02] border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-400 font-bold focus:outline-none focus:border-[#F58220]"
            />
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-[#F6C343] block mb-1">👥 Passengers Capacity</label>
            <select
              value={passengersFilter}
              onChange={(e) => setPassengersFilter(e.target.value)}
              className="w-full bg-[#1C0D02] border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#F58220]"
            >
              <option value="ALL">All Passenger Capacities</option>
              <option value="3">1 - 3 Passengers (Auto / E-Rickshaw)</option>
              <option value="4">3 - 4 Passengers (Sedan / Hatchback)</option>
              <option value="7">5 - 7 Passengers (Ertiga / Innova SUV)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-[#F6C343] block mb-1">🚗 Vehicle Category</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-[#1C0D02] border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#F58220]"
            >
              <option value="ALL">All Vehicle Types</option>
              <option value="Sedan">🚗 AC Dzire / Etios Sedan</option>
              <option value="Auto">🛺 E-Rickshaw Auto Pickup</option>
              <option value="SUV">🚙 SUV Innova / Ertiga 7-Seater</option>
              <option value="Tempo">🚐 Tempo Traveller (Group)</option>
            </select>
          </div>
        </div>

        {/* Global Keyword Quick Search Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Instant Search driver name, vehicle model, area..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1C0D02] text-xs text-white placeholder:text-gray-400 rounded-xl border border-amber-500/40 font-bold focus:outline-none focus:border-[#F58220]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => { setPickup(''); setDrop(''); setPassengersFilter('ALL'); setVehicleType('ALL'); setSearchQuery(''); }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
            >
              Reset Filters
            </button>
            <span className="px-3 py-2 bg-[#F6C343] text-slate-950 rounded-xl text-xs font-black">
              {filteredDrivers.length} Vehicles Active
            </span>
          </div>
        </div>
      </div>

      {/* Available Drivers List Feed */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h2 className="text-xl font-serif font-bold text-[#4A2E1A] flex items-center gap-2">
            <Car className="w-5 h-5 text-[#F58220]" />
            Verified Pick & Drop Providers ({filteredDrivers.length})
          </h2>
          <span className="text-xs font-extrabold text-[#F58220] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            0% Commission Direct Booking
          </span>
        </div>

        <DirectoryGatedView categoryName="Pick & Drop Taxi & Auto" totalCount={filteredDrivers.length} maxPreviewCount={2}>
          {(visibleCount) => (
            <div>
              {filteredDrivers.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                  <Car className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-black text-slate-900">No Pick & Drop Providers Found</h3>
                  <p className="text-xs text-slate-600 font-medium">Try resetting your pickup location or vehicle filter.</p>
                  <button
                    onClick={() => { setPickup(''); setDrop(''); setPassengersFilter('ALL'); setVehicleType('ALL'); setSearchQuery(''); }}
                    className="px-5 py-2.5 bg-[#F58220] text-white font-extrabold text-xs rounded-xl shadow-md"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredDrivers.slice(0, visibleCount).map((drv) => (
                    <WebsiteProviderCard 
                      key={drv.id} 
                      provider={drv as any} 
                      showContactBox={true} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </DirectoryGatedView>
      </div>
    </div>
  );
}
