'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Languages, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { LockedContactBox } from '@/components/ui/LockedContactBox';

import DynamicRoleProviderDashboardPage from '@/app/(provider)/[role]/dashboard/page';

export default function PanditDetailPage({ params }: { params: { id: string } }) {
  if (params.id === 'dashboard') {
    return <DynamicRoleProviderDashboardPage params={{ role: 'pandit' }} />;
  }

  const [pandit, setPandit] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const users = UserStore.getUsers();
    const found = users.find((u) => u.id === params.id);
    if (found) {
      setPandit(found);
      setLoading(false);
    } else {
      UserStore.fetchUsersFromApi().then((apiUsers) => {
        const u = apiUsers.find((x) => x.id === params.id);
        if (u) setPandit(u);
        setLoading(false);
      });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 font-medium">
        Loading Pandit Ji profile details...
      </div>
    );
  }

  if (!pandit) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Pandit Profile Not Found</h2>
        <p className="text-xs text-slate-600">The requested purohit profile does not exist or has been removed.</p>
        <Link href="/pandit" className="inline-flex items-center gap-1 text-xs font-bold text-[#F58220]">
          <ArrowLeft className="w-4 h-4" /> Back to Pandits Directory
        </Link>
      </div>
    );
  }

  const isVerified = pandit.status === 'VERIFIED';
  const avatarUrl = pandit.avatarUrl || pandit.profilePicUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900">
      <Link href="/pandit" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#F58220] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Pandits Directory
      </Link>

      {/* Pandit Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt={pandit.name} className="w-16 h-16 rounded-2xl object-cover border border-amber-200 shrink-0 shadow-sm" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#4A2E1A] text-amber-400 font-black text-2xl flex items-center justify-center shrink-0 border border-amber-300 shadow-sm">
                {pandit.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900">{pandit.name}</h1>
                {isVerified ? (
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-900 rounded-full inline-flex items-center gap-1 border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> GayaSeva Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-amber-100 text-amber-950 rounded-full inline-flex items-center gap-1 border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-700" /> Pending Verification
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {pandit.customRole || 'Purohit & Pandit Service'} • {pandit.city || 'Gaya Ji'}
              </p>
            </div>
          </div>
        </div>

        <LockedContactBox 
          providerId={pandit.id} 
          providerName={pandit.name} 
          defaultPhone={pandit.phone}
          serviceCategory="Pind Daan Pandit & Teerth Purohit"
        />

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-[#4A2E1A]">Languages Spoken</h3>
            <p className="font-semibold text-slate-800">
              {pandit.languages && pandit.languages.length > 0 ? pandit.languages.join(' • ') : 'Hindi • Sanskrit'}
            </p>
            <h3 className="font-bold text-sm text-[#4A2E1A] pt-2">Services Provided</h3>
            <ul className="space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Pinda Daan Rituals</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Tripindi Shradh Rites</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Narayan Bali & Veda Puja</li>
            </ul>
          </div>

          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-[#4A2E1A]">Purohit Rating & Location</h3>
            <p className="text-slate-800 font-bold">⭐ {pandit.rating || 5.0} / 5.0 Rating</p>
            <h3 className="font-bold text-sm text-[#4A2E1A] pt-2">Location Zone</h3>
            <p className="text-slate-700 font-medium">📍 {pandit.city || 'Vishnupad Temple Premises & Falgu River Ghats'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
