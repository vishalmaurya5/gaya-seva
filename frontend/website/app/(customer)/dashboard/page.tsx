'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserStore, UserAccount } from '@/lib/userStore';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Bell, 
  Star, 
  User, 
  Navigation,
  ShieldCheck,
  Phone,
  MessageSquare,
  Edit3, 
  Trash2, 
  X, 
  Settings, 
  LogOut,
  Flame,
  ChevronRight
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ACTIVE_RIDE' | 'REQUESTS' | 'BOOKINGS' | 'SETTINGS'>('ACTIVE_RIDE');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');

  const refreshUserSession = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (stored) {
        try {
          const userObj: UserAccount = JSON.parse(stored);
          // Auto-redirect if Provider logged in
          if (['PANDIT', 'DRIVER', 'HOTEL'].includes(userObj.role)) {
            router.push(`/${userObj.role.toLowerCase()}/dashboard`);
            return;
          }
          const latest = UserStore.getUsers().find(u => u.id === userObj.id) || userObj;
          setCurrentUser(latest);
          setEditName(latest.name);
          setEditEmail(latest.email);
          setEditPhone(latest.phone);
          setEditCity(latest.city || 'Gaya Ji');
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    refreshUserSession();
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated = UserStore.updateUser(currentUser.id, {
      name: editName,
      email: editEmail,
      phone: editPhone,
      city: editCity,
    });

    if (updated) {
      localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(updated));
      setCurrentUser(updated);
      alert('प्रोफाइल की जानकारी सफलतापूर्वक अपडेट कर दी गई है! / Profile details updated successfully!');
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
      `क्या आप निश्चित रूप से अपना गयासेवा खाता हटाना चाहते हैं? (${currentUser.name})\nWarning: Deleting your account will remove your profile and active ride history.`
    );
    if (confirmDelete) {
      UserStore.deleteUser(currentUser.id);
      localStorage.removeItem('GAYASEVA_CURRENT_USER');
      alert('आपका खाता सफलतापूर्वक डिलीट कर दिया गया है / Account successfully deleted.');
      router.push('/');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900 antialiased">
      
      {/* 1. Customer Header Banner with Rich Vedic Dark Aesthetic & High Contrast */}
      <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#F58220]/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-60 h-60 bg-[#F58220]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F58220] to-[#F6C343] flex items-center justify-center text-white font-extrabold text-3xl shadow-lg border-2 border-white/20 shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'Y'}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              Welcome back, <span className="text-[#F6C343]">{currentUser?.name || 'GayaSeva Yatri'}</span>
            </h1>
            <p className="text-xs text-amber-200/90 font-bold flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold rounded-md border border-emerald-400/30 flex items-center gap-1 uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Yatri
              </span>
              <span>&bull;</span>
              <span className="font-mono text-white">{currentUser?.phone || '+91 98765 43210'}</span>
            </p>
          </div>
        </div>

        {/* Account Controls & Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto z-10">
          <div className="flex bg-[#1C0D02] p-1.5 rounded-2xl border border-amber-500/30 text-xs font-bold overflow-x-auto shadow-inner">
            <button
              onClick={() => setActiveTab('ACTIVE_RIDE')}
              className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'ACTIVE_RIDE' 
                  ? 'bg-[#F58220] text-white font-extrabold shadow-md border border-amber-300/40' 
                  : 'text-amber-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Navigation className="w-4 h-4 text-white shrink-0" />
              <span>Active Ride Tracking</span>
            </button>
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'REQUESTS' 
                  ? 'bg-[#F58220] text-white font-extrabold shadow-md border border-amber-300/40' 
                  : 'text-amber-100 hover:text-white hover:bg-white/10'
              }`}
            >
              My Requests
            </button>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs rounded-2xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            title="Edit Profile Details"
          >
            <Edit3 className="w-4 h-4" /> Edit Details
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl border border-slate-700 transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            title="Log out of your account"
          >
            <LogOut className="w-4 h-4 text-red-400" /> Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            title="Delete Account"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* 2. Active Ride View Container with 100% Crisp Visibility */}
      {activeTab === 'ACTIVE_RIDE' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-6">
            
            {/* Header Badge & ETA */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-slate-100 pb-5">
              <div className="space-y-1">
                <span className="px-3.5 py-1 bg-[#1C0D02] text-[#F6C343] rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/40">
                  RIDE IN PROGRESS &bull; ACTIVE
                </span>
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-2">
                  Pick &amp; Drop Ride <span className="text-[#F58220]">#RD-84920</span>
                </h2>
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-300/80 text-right min-w-[120px]">
                <span className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block">ESTIMATED ETA</span>
                <span className="text-2xl font-black text-[#D96B00]">8 Mins</span>
              </div>
            </div>

            {/* Driver & Vehicle Information Card */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 text-white p-5 rounded-2xl border-2 border-amber-500/30 shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#F58220] to-[#F6C343] text-white font-extrabold text-base flex items-center justify-center shadow-md shrink-0 border border-white/20">
                  DK
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-lg text-white tracking-wide">
                      Dinesh Kumar
                    </h3>
                    <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-md uppercase tracking-wider">
                      GayaSeva Verified
                    </span>
                  </div>
                  <p className="text-xs font-bold text-amber-200">
                    Maruti DZire &bull; <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">BR-02-AB-1234</span>
                  </p>
                </div>
              </div>

              {/* Driver Contact Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href="tel:+919876543210"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-slate-950 fill-current" />
                  <span>Call Driver</span>
                </a>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Dinesh,%20I%20am%20waiting%20at%20Gaya%20Station"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-slate-950 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Live GPS Map Frame */}
            <div className="relative w-full h-80 bg-[#0B132B] rounded-2xl border-2 border-amber-500/40 overflow-hidden flex flex-col justify-center items-center text-center p-6 shadow-inner space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F58220]/20 flex items-center justify-center border border-[#F58220]/50 animate-pulse">
                <Navigation className="w-8 h-8 text-[#F58220] animate-bounce" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-white tracking-wide">Live GPS Radar &amp; Route Active</p>
                <p className="text-xs text-amber-200 font-medium max-w-md mt-1">
                  Realtime tracking channel <code className="bg-slate-900 text-[#F6C343] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">ride:RD-84920</code> active via Leaflet maps.
                </p>
              </div>

              {/* iOS / PWA Background Notice */}
              <div className="w-full max-w-2xl bg-[#1C0D02] border border-amber-500/50 p-3 rounded-xl text-xs text-amber-200 font-bold flex items-center gap-2 text-left shadow-md">
                <AlertCircle className="w-4 h-4 text-[#F58220] shrink-0" />
                <span>
                  <strong className="text-[#F6C343]">iOS PWA Notice:</strong> Apple iOS Safari limits background location when screen locks. Keep screen active for continuous updates.
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. My Requests Tab */}
      {activeTab === 'REQUESTS' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-4">
          <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">My Service Requests</h2>
          <div className="space-y-3">
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex justify-between items-center text-xs font-bold">
              <div>
                <p className="font-extrabold text-base text-white">Pandit Booking for Pinda Daan Rites</p>
                <p className="text-amber-200 text-xs">Vishnupad Temple &bull; Tomorrow 8:00 AM</p>
              </div>
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black rounded-full text-xs uppercase tracking-wider">
                SEARCHING
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Edit Profile Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-5 animate-fadeIn border-2 border-slate-900 text-slate-900 font-sans">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-slate-950 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#F58220]" />
                Edit Profile Details
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
                <label className="block text-slate-900 font-extrabold mb-1">Full Name *</label>
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

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Home City</label>
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
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
