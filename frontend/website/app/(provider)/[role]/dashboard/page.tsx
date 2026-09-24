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
  LogOut,
  ExternalLink,
  MapPin,
  Sparkles
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
  const [editGoogleMapsUrl, setEditGoogleMapsUrl] = useState('');
  const [editLanguagesStr, setEditLanguagesStr] = useState('');
  const [editDescription, setEditDescription] = useState('');
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
          setEditName(freshUser.name || '');
          setEditPhone(freshUser.phone || '');
          setEditEmail(freshUser.email || '');
          setEditCity(freshUser.city || 'Gaya Ji');
          setEditCustomRole(freshUser.customRole || role.toUpperCase());
          setEditGoogleMapsUrl(freshUser.googleMapsUrl || '');
          setEditLanguagesStr(freshUser.languages ? freshUser.languages.join(', ') : 'Hindi, Sanskrit');
          setEditDescription(freshUser.description || '');
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

  const handleToggleAvailability = async (newStatus: 'AVAILABLE' | 'BOOKED') => {
    const nextIsAvailable = newStatus === 'AVAILABLE';
    setIsAvailable(nextIsAvailable);

    if (currentUser) {
      const updatedUser = await UserStore.updateUser(currentUser.id, {
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const resolvedRoleTitle = editCustomRole === 'Other Custom Vehicle (Manual Input)'
      ? (customVehicleInput.trim() || 'Custom Partner Service')
      : editCustomRole;

    const parsedLangs = editLanguagesStr.split(',').map((s) => s.trim()).filter(Boolean);

    const updated = await UserStore.updateUser(currentUser.id, {
      name: editName,
      phone: editPhone,
      email: editEmail,
      city: editCity,
      customRole: resolvedRoleTitle,
      googleMapsUrl: editGoogleMapsUrl.trim() || undefined,
      languages: parsedLangs.length > 0 ? parsedLangs : undefined,
      description: editDescription.trim() || undefined,
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

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const confirmDelete = confirm(
      `क्या आप निश्चित रूप से अपना गयासेवा पार्टनर खाता हटाना चाहते हैं? (${currentUser.name})\nWarning: Deleting your partner profile will remove your service listings and verification badge.`
    );
    if (confirmDelete) {
      await UserStore.deleteUser(currentUser.id);
      localStorage.removeItem('GAYASEVA_CURRENT_USER');
      alert('आपका पार्टनर खाता सफलतापूर्वक हटा दिया गया है / Partner account deleted successfully.');
      router.push('/');
    }
  };

  const isVerified = currentUser?.status === 'VERIFIED';
  const isPending = currentUser?.status === 'PENDING';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-950 antialiased">
      
      {/* 1. Header Banner with Dark Contrast */}
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
            onClick={() => handleToggleAvailability(isAvailable ? 'BOOKED' : 'AVAILABLE')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs shadow-lg transition-all cursor-pointer ${
              isAvailable 
                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 hover:bg-emerald-400' 
                : 'bg-red-600 text-white ring-4 ring-red-600/30 hover:bg-red-500'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isAvailable ? '🟢 ONLINE & AVAILABLE' : '🔴 FULLY BOOKED / BUSY'}</span>
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

      {/* 2. Verification Status Notice Banner */}
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

      {/* 3. Live Card Preview Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F58220]" /> Public Listing Card Live Preview (आपकी लाइव कार्ड प्रोफाइल)
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Pilgrims see your profile with live AVAILABLE / BOOKED status and custom details across GayaSeva directory.
            </p>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile Details
          </button>
        </div>

        {/* Public Card Mockup (Exact layout as shown in directory) */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-lg space-y-4 font-sans relative">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {isVerified ? (
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-900 rounded-full inline-flex items-center gap-1 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> GayaSeva Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-amber-100 text-amber-950 rounded-full inline-flex items-center gap-1 border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-700" /> Pending Admin Verification
                  </span>
                )}

                {isAvailable ? (
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-500 text-slate-950 rounded-full inline-flex items-center gap-1 animate-pulse">
                    🟢 AVAILABLE FOR BOOKING
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-red-600 text-white rounded-full inline-flex items-center gap-1">
                    🔴 FULLY BOOKED / BUSY
                  </span>
                )}
              </div>

              <h3 className="font-serif font-bold text-lg text-[#4A2E1A] pt-1">
                {currentUser?.name || `${role} Partner`}
              </h3>
            </div>

            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
              ⭐ {currentUser?.rating || 5.0}
            </span>
          </div>

          <div className="text-xs text-slate-700 space-y-2 bg-[#F8F6EF] p-4 rounded-2xl border border-orange-100">
            <p className="font-bold text-[#4A2E1A] flex items-center gap-1">
              📍 <span>{currentUser?.customRole || 'Dharamshala, Family Rooms, Pilgrim Stay'}</span>
            </p>
            <p className="text-slate-600 font-medium flex items-center gap-1">
              🏢 <span>{currentUser?.city || 'Near Vishnupad Temple Premises, Gaya Ji'}</span>
            </p>
            {currentUser?.description ? (
              <p className="text-slate-800 font-semibold pt-1 border-t border-amber-200/60">
                🛏️ {currentUser.description}
              </p>
            ) : (
              <p className="text-slate-600 font-semibold pt-1 border-t border-amber-200/60">
                🛏️ AC/Non-AC rooms near Vishnupad • Vehicle Parking Available
              </p>
            )}
            {currentUser?.languages && currentUser.languages.length > 0 && (
              <p className="text-slate-700 font-bold">
                🗣️ Languages: {currentUser.languages.join(' • ')}
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-950 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ₹5 Access Pass Active
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase font-black">Unlocked</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 bg-[#2A180B] text-[#F6C343] font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-xs">
                <Phone className="w-3.5 h-3.5 text-[#F58220]" /> Call ({currentUser?.phone || '9546101002'})
              </button>

              <button className="py-2.5 bg-[#075E54] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-xs">
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </button>
            </div>

            {currentUser?.googleMapsUrl ? (
              <a
                href={currentUser.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900 bg-white border border-amber-300 py-2.5 rounded-xl hover:bg-amber-50 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-[#F58220]" />
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </a>
            ) : (
              <button
                onClick={() => setShowEditModal(true)}
                className="w-full text-center text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 py-2.5 rounded-xl hover:bg-amber-100 transition"
              >
                + Add Google Maps Directions Link
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EDIT PROFILE DETAILS MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-5 animate-fadeIn border-2 border-slate-900 font-sans text-slate-950 my-8">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-slate-950 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#F58220]" />
                Manage Partner Details (अपनी जानकारी बदलें)
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
                <label className="block text-slate-900 font-extrabold mb-1">Partner / Property Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Suresh Kumar Agarwal (Hotel Gaya Dham)"
                  className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Mobile Phone (Calls & WhatsApp) *</label>
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

              {role === 'driver' ? (
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
              ) : (
                <div>
                  <label className="block text-slate-900 font-extrabold mb-1">Category Tags / Specialization Title</label>
                  <input
                    type="text"
                    value={editCustomRole}
                    onChange={(e) => setEditCustomRole(e.target.value)}
                    placeholder="e.g. Dharamshala, Family Rooms, Pilgrim Stay"
                    className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Room Specs / Features / Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="e.g. AC/Non-AC rooms near Vishnupad, Vehicle Parking Available"
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Languages Spoken (comma-separated)</label>
                <input
                  type="text"
                  value={editLanguagesStr}
                  onChange={(e) => setEditLanguagesStr(e.target.value)}
                  placeholder="e.g. Hindi, Sanskrit, English, Bengali, Maithili"
                  className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Operating Location / Full Address in Gaya Ji</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  placeholder="e.g. Dharamshala Road, Near Vishnupad Temple, Gaya Ji"
                  className="w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Google Maps Navigation Link (URL)</label>
                <input
                  type="url"
                  value={editGoogleMapsUrl}
                  onChange={(e) => setEditGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
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
                  Save Partner Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
