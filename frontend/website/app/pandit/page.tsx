'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, MapPin, Languages, Phone, MessageSquare, CheckCircle2, Clock, AlertCircle, UserPlus } from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore, UserAccount } from '@/lib/userStore';
import { LockedContactBox } from '@/components/ui/LockedContactBox';
import { DirectoryGatedView } from '@/components/ui/DirectoryGatedView';

export default function PanditDirectoryPage() {
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

  // Filter ONLY real registered Pandits from user store / database
  const registeredPandits = users.filter((u) => u.role === 'PANDIT' || (u.customRole && u.customRole.toUpperCase().includes('PANDIT')));

  const allPandits = registeredPandits.map((u) => ({
    id: u.id,
    name: u.name,
    languages: u.languages && u.languages.length > 0 ? u.languages : ['Hindi', 'Sanskrit'],
    services: u.customRole ? [u.customRole] : ['Pind Daan', 'Vedic Shradh Rites'],
    area: u.city || 'Gaya Ji / Vishnupad Area',
    rating: u.rating || 5.0,
    experience: 'Verified Gaya Purohit',
    status: u.status,
    phone: u.phone,
    availabilityStatus: u.availabilityStatus || 'AVAILABLE',
    avatarUrl: u.avatarUrl || u.profilePicUrl,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900">
      {/* Hero Banner */}
      <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Flame className="w-8 h-8 text-[#F6C343]" /> अपनी धार्मिक सेवा की योजना पहले करें।
          </h1>
          <p className="text-xs text-[#F8F6EF]/80 mt-1 font-medium">Verified Gaya Ji Teerth Pandits for Pinda Daan and Shradh Rites.</p>
        </div>
        <GayaSevaLogo size={64} className="shrink-0 drop-shadow-md" />
      </div>

      {/* If No Registered Pandits Exist */}
      {allPandits.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto my-12">
          <AlertCircle className="w-12 h-12 text-[#F58220] mx-auto" />
          <h2 className="text-xl font-black text-[#4A2E1A]">No Registered Pandits Available Yet</h2>
          <p className="text-xs text-amber-900 font-medium">
            Are you a Teerth Purohit or Pandit Ji in Gaya Ji? Register your profile now to get verified and listed on GayaSeva.
          </p>
          <Link 
            href="/provider/register?role=PANDIT" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F58220] hover:bg-[#e07210] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Register as Gaya Pandit
          </Link>
        </div>
      ) : (
        /* Pandit Cards Directory Gated View */
        <DirectoryGatedView categoryName="Pandit & Teerth Purohit" totalCount={allPandits.length} maxPreviewCount={6}>
          {(visibleCount) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allPandits.slice(0, visibleCount).map((pnd) => {
                const isVerified = pnd.status === 'VERIFIED';
                const isAvailable = pnd.availabilityStatus !== 'BOOKED';
                return (
                  <div key={pnd.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#F58220]/40 transition-colors">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {pnd.avatarUrl ? (
                            <img src={pnd.avatarUrl} alt={pnd.name} className="w-12 h-12 rounded-2xl object-cover border border-amber-200 shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-[#4A2E1A] text-amber-400 font-bold flex items-center justify-center text-sm shrink-0 border border-amber-300">
                              {pnd.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
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

                    <LockedContactBox 
                      providerId={pnd.id} 
                      providerName={pnd.name} 
                      defaultPhone={pnd.phone}
                      serviceCategory="Purohit & Pandit Service"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </DirectoryGatedView>
      )}
    </div>
  );
}
