'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Car, 
  Flame, 
  Hotel, 
  ShoppingBag, 
  Map, 
  CheckCircle, 
  Clock, 
  Star, 
  Power, 
  Navigation, 
  ShieldCheck,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Trash2,
  X,
  LogOut
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { ContentStore } from '@/lib/contentStore';

export default function RoleProviderDashboardPage({ params }: { params: { role: string } }) {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const role = params.role ? params.role.toLowerCase() : 'driver';

  // Edit Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCustomRole, setEditCustomRole] = useState('');
  const [customVehicleInput, setCustomVehicleInput] = useState('');

  const loadProviderSession = () => {
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (storedSession) {
        try {
          const sessionObj: UserAccount = JSON.parse(storedSession);
          const freshUser = UserStore.getUsers().find((u) => u.id === sessionObj.id) || sessionObj;
          setCurrentUser(freshUser);
          setIsAvailable(freshUser.availabilityStatus !== 'BOOKED');
          setEditName(freshUser.name);
          setEditPhone(freshUser.phone);
          setEditEmail(freshUser.email);
          setEditCity(freshUser.city || 'Gaya Ji');
          setEditCustomRole(freshUser.customRole || role.toUpperCase());
        } catch {
          const fallback = UserStore.getUsers().find((u) => u.role.toLowerCase() === role);
          if (fallback) {
            setCurrentUser(fallback);
            setIsAvailable(fallback.availabilityStatus !== 'BOOKED');
          }
        }
      } else {
        const fallback = UserStore.getUsers().find((u) => u.role.toLowerCase() === role);
        if (fallback) {
          setCurrentUser(fallback);
          setIsAvailable(fallback.availabilityStatus !== 'BOOKED');
        }
      }
    }
  };

  useEffect(() => {
    loadProviderSession();
  }, [role]);

  const handleToggleAvailability = (newStatus: 'AVAILABLE' | 'BOOKED') => {
    const nextIsAvailable = newStatus === 'AVAILABLE';
    setIsAvailable(nextIsAvailable);

    if (currentUser) {
      const updatedUser = UserStore.updateUser(currentUser.id, {
        availabilityStatus: newStatus,
      });

      if (updatedUser) {
        localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      // Sync matching service listings in ContentStore
      const services = ContentStore.getServices();
      const userPhoneClean = currentUser.phone ? currentUser.phone.replace(/\D/g, '') : '';
      
      services.forEach((srv) => {
        const srvPhoneClean = srv.phone ? srv.phone.replace(/\D/g, '') : '';
        if (
          (userPhoneClean && srvPhoneClean && srvPhoneClean.includes(userPhoneClean.slice(-10))) ||
          (currentUser.name && srv.title.toLowerCase().includes(currentUser.name.toLowerCase()))
        ) {
          ContentStore.updateService(srv.id, { availabilityStatus: newStatus });
        }
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const resolvedRoleTitle = editCustomRole === 'Other Custom Vehicle (Manual Input)'
      ? (customVehicleInput.trim() || 'Custom Partner Service')
      : editCustomRole;

    const updated = UserStore.updateUser(currentUser.id, {
      name: editName,
      phone: editPhone,
      email: editEmail,
      city: editCity,
      customRole: resolvedRoleTitle,
    });

    if (updated) {
      localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(updated));
      setCurrentUser(updated);
      alert('पार्टनर प्रोफाइल विवरण सफलतापूर्वक अपडेट कर दिए गए हैं! / Partner profile details updated successfully!');
      setShowEditModal(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('GAYASEVA_CURRENT_USER');
    }
    router.push('/auth/login');
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;
    const confirmDelete = confirm(
      `क्या आप निश्चित रूप से अपना गयासेवा पार्टनर खाता हटाना चाहते हैं? (${currentUser.name})\nWarning: Deleting your partner profile will remove your service listings and verification badge.`
    );
    if (confirmDelete) {
      UserStore.deleteUser(currentUser.id);
      localStorage.removeItem('GAYASEVA_CURRENT_USER');
      alert('आपका पार्टनर खाता सफलतापूर्वक हटा दिया गया है / Partner account deleted successfully.');
      router.push('/');
    }
  };

  const isVerified = currentUser?.status === 'VERIFIED';
  const isPending = currentUser?.status === 'PENDING';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-950 antialiased">
      
      {/* 1. Header Banner with Dark Vedic Contrast */}
      <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-2 border-[#F58220]/40 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F58220] to-[#F6C343] flex items-center justify-center font-extrabold text-3xl text-white shadow-lg border-2 border-white/20 shrink-0">
            {currentUser?.name ? currentUser.name.substring(0, 1).toUpperCase() : role.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white capitalize tracking-wide">
                {currentUser?.name || `${role} Partner Console`}
              </h1>
              
              {isVerified && (
                <span className="px-3 py-1 text-xs font-black uppercase rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-slate-950" /> VERIFIED PARTNER
                </span>
              )}

              {isPending && (
                <span className="px-3 py-1 text-xs font-black uppercase rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md animate-pulse">
                  <Clock className="w-4 h-4 text-slate-950" /> PENDING ADMIN APPROVAL
                </span>
              )}
            </div>

            <p className="text-xs text-amber-200 font-bold">
              Role: <strong className="text-[#F6C343] font-extrabold">{currentUser?.customRole || role.toUpperCase()}</strong> &bull; Location: {currentUser?.city || 'Gaya Ji Central & Vishnupad Zone'}
            </p>
          </div>
        </div>

        {/* Actions & Availability Toggle */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs shadow-lg transition-all cursor-pointer ${
              isAvailable 
                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30' 
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isAvailable ? 'ONLINE & AVAILABLE' : 'OFFLINE'}</span>
          </button>

          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs rounded-2xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            title="Edit Partner Profile"
          >
            <Edit3 className="w-4 h-4" /> Edit Details
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-3 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl border border-slate-700 transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            title="Log out of partner account"
          >
            <LogOut className="w-4 h-4 text-amber-400" /> Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            title="Delete Partner Account"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* 2. High Contrast Verification Status Notice Banner */}
      {isPending && (
        <div className="bg-amber-950 text-amber-100 border-2 border-amber-500/50 rounded-3xl p-6 space-y-2 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 font-extrabold text-base text-[#F6C343]">
            <AlertTriangle className="w-5 h-5 text-[#F58220] shrink-0" />
            <span>PARTNER APPLICATION PENDING VERIFICATION (सत्यापन प्रक्रिया जारी है)</span>
          </div>
          <p className="text-xs text-amber-200 font-bold leading-relaxed">
            Your profile &amp; verification documents are currently undergoing administrative review by GayaSeva Admin. Once verified, your <strong className="underline text-emerald-400">Verified Tick Badge</strong> will automatically appear on all public service cards and search listings.
          </p>
        </div>
      )}

      {isVerified && (
        <div className="bg-emerald-950 text-emerald-100 border-2 border-emerald-500/50 rounded-3xl p-6 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 font-extrabold text-base text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>PARTNER ACCOUNT FULLY VERIFIED (आपका खाता सत्यापित है)</span>
          </div>
          <p className="text-xs text-emerald-200 font-bold leading-relaxed">
            Congratulations! Your account is background-verified. Your service card in public listings displays the green Verified Tick Badge.
          </p>
        </div>
      )}

      {/* 2.5 Live Service Availability Status Control Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-5 font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2.5">
              <Power className={`w-6 h-6 ${isAvailable ? 'text-emerald-500' : 'text-red-600'}`} />
              Service Booking Availability Status (बुक है / उपलब्ध)
            </h2>
            <p className="text-xs text-slate-700 font-bold leading-relaxed max-w-2xl">
              Toggle your availability below. When set to <strong className="text-emerald-600 font-extrabold">AVAILABLE</strong>, your card on the GayaSeva website displays a green status badge and accepts calls/bookings. When set to <strong className="text-red-600 font-extrabold">BOOKED</strong>, your card will update to show <strong className="text-red-600 font-extrabold">🔴 BOOKED / BUSY</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border-2 border-slate-800 shadow-lg shrink-0">
            <button
              type="button"
              onClick={() => handleToggleAvailability('AVAILABLE')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                isAvailable
                  ? 'bg-emerald-500 text-slate-950 shadow-md ring-4 ring-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-pulse" />
              🟢 AVAILABLE (उपलब्ध)
            </button>

            <button
              type="button"
              onClick={() => handleToggleAvailability('BOOKED')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                !isAvailable
                  ? 'bg-red-600 text-white shadow-md ring-4 ring-red-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              🔴 BOOKED (बुक है)
            </button>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-bold flex items-center justify-between gap-3">
          <span>Current Active Status: <strong className={isAvailable ? 'text-emerald-700 font-black' : 'text-red-700 font-black'}>{isAvailable ? 'AVAILABLE FOR BOOKING (🟢)' : 'CURRENTLY BOOKED / BUSY (🔴)'}</strong></span>
          <span className="text-[10px] text-slate-500 font-mono">Live Website Sync Enabled</span>
        </div>
      </div>

      {/* 3. Role-Specific Metric & Action View */}
      {role === 'driver' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-5">
            <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2.5">
              <Car className="w-6 h-6 text-[#F58220]" /> Active Ride Request
            </h2>

            <div className="p-5 bg-slate-950 text-white rounded-2xl border-2 border-amber-500/30 space-y-4 shadow-lg">
              <div className="flex justify-between items-start text-xs">
                <div className="space-y-1">
                  <p className="font-extrabold text-base text-white">Pick &amp; Drop: Station &rarr; Vishnupad Temple</p>
                  <p className="text-amber-200 font-bold text-xs">Customer: Rahul Kumar &bull; 2 Passengers &bull; Cash Payment</p>
                </div>
                <div className="text-right bg-amber-400/20 px-3 py-1.5 rounded-xl border border-amber-400/40">
                  <span className="font-black text-2xl text-[#F6C343] font-mono">₹350</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 bg-gradient-to-r from-[#F58220] to-[#E07210] hover:from-[#E07210] hover:to-[#C86000] text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer active:scale-95">
                  ACCEPT RIDE
                </button>
                <button className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer">
                  REJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === 'pandit' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-4">
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-[#F58220]" /> Pandit Ritual Bookings
          </h2>
          <p className="text-xs text-slate-800 font-bold">Manage Pinda Daan, Tripindi Shradh, and Teerth Puja requests.</p>
        </div>
      )}

      {role === 'hotel' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-4">
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2.5">
            <Hotel className="w-6 h-6 text-blue-600" /> Hotel &amp; Guest House Management
          </h2>
          <p className="text-xs text-slate-800 font-bold">Manage room capacity, parking, and teerth yatri room bookings.</p>
        </div>
      )}

      {/* 4. Edit Partner Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-5 animate-fadeIn border-2 border-slate-900 font-sans text-slate-950">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-slate-950 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#F58220]" />
                Edit Partner Profile Details
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Partner Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              {role === 'driver' && (
                <div>
                  <label className="block text-slate-900 font-extrabold mb-1">Vehicle / Cab Category</label>
                  <select
                    value={editCustomRole}
                    onChange={(e) => setEditCustomRole(e.target.value)}
                    className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                  >
                    <option value="Bike / Two-Wheeler Taxi (Motorcycle / Scooter)">🏍️ Bike / Two-Wheeler Taxi (Motorcycle / Scooter)</option>
                    <option value="AC Dzire / Etios Sedan">🚗 AC Dzire / Etios Sedan</option>
                    <option value="Innova Crysta 7-Seater">🚙 Innova Crysta 7-Seater</option>
                    <option value="E-Rickshaw / Auto Pickup">🛺 E-Rickshaw / Auto Pickup</option>
                    <option value="Tempo Traveller 13-Seater">🚐 Tempo Traveller 13-Seater</option>
                    <option value="Other Custom Vehicle (Manual Input)">✏️ Other Custom Vehicle (Manual Input)</option>
                  </select>

                  {editCustomRole === 'Other Custom Vehicle (Manual Input)' && (
                    <input
                      type="text"
                      required
                      value={customVehicleInput}
                      onChange={(e) => setCustomVehicleInput(e.target.value)}
                      placeholder="Enter Custom Vehicle Title (e.g. Electric Scooter / Vintage Car)"
                      className="w-full mt-2 px-3 py-2 border-2 border-amber-300 bg-amber-50 rounded-xl focus:outline-none focus:border-[#F58220] text-xs font-bold text-slate-900"
                    />
                  )}
                </div>
              )}

              {role !== 'driver' && (
                <div>
                  <label className="block text-slate-900 font-extrabold mb-1">Service Specialization / Role Title</label>
                  <input
                    type="text"
                    value={editCustomRole}
                    onChange={(e) => setEditCustomRole(e.target.value)}
                    placeholder="e.g. Pinda Daan & Vedic Specialist / AC Dharamshala"
                    className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Operating Location in Gaya Ji</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="pt-3 border-t-2 border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 border-2 border-slate-300 rounded-xl font-extrabold text-slate-800 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#F58220] to-[#E07210] text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Save Partner Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
