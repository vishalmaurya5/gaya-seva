'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard,
  User,
  Power,
  CalendarCheck,
  Star,
  Wallet,
  Bell,
  HelpCircle,
  Car,
  Flame,
  Hotel,
  ShoppingBag,
  Compass,
  Navigation,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit3,
  Trash2,
  X,
  LogOut,
  ExternalLink,
  MapPin,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  Check,
  Scissors,
  CheckCircle,
  Play,
  StopCircle,
  AlertCircle
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { getProviderRoleConfig, normalizeProviderRole, AvailabilityStatusType } from '@/lib/providerRoleMap';
import { realtimeAvailabilityEngine } from '@/lib/realtimeAvailability';
import { ProviderProfileService } from '@/lib/providerProfileService';
import { ServiceBookingRecord, getBookingStatusBadge, BookingStatus } from '@/lib/bookingStateMachine';
import { WebsiteProviderCard } from '@/components/ui/WebsiteProviderCard';
import { validateUploadFile, uploadToSupabaseBucket } from '@/lib/supabaseClient';

export default function DynamicRoleProviderDashboardPage({ params }: { params: { role: string } }) {
  const router = useRouter();
  const normalizedRole = normalizeProviderRole(params.role);
  const roleConfig = getProviderRoleConfig(normalizedRole);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentStatus, setCurrentStatus] = useState<AvailabilityStatusType>('AVAILABLE');
  
  // Bookings state
  const [bookings, setBookings] = useState<ServiceBookingRecord[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  const [bookingActionError, setBookingActionError] = useState<string | null>(null);

  // Edit Profile Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCustomRole, setEditCustomRole] = useState('');
  const [editSpecialization, setEditSpecialization] = useState('');
  const [editProfilePicUrl, setEditProfilePicUrl] = useState('');
  const [editDocumentUrl, setEditDocumentUrl] = useState('');
  const [editGoogleMapsUrl, setEditGoogleMapsUrl] = useState('');
  const [editLanguagesStr, setEditLanguagesStr] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Live GPS Tracking state for Drivers
  const [isGPSTrackingActive, setIsGPSTrackingActive] = useState<boolean>(false);
  const [gpsWatchId, setGpsWatchId] = useState<number | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Load Session
  const loadProviderSession = () => {
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (storedSession) {
        try {
          const sessionObj: UserAccount = JSON.parse(storedSession);
          const freshUser = UserStore.getUsers().find((u) => u.id === sessionObj.id) || sessionObj;
          setCurrentUser(freshUser);
          setCurrentStatus((freshUser.availabilityStatus as AvailabilityStatusType) || 'AVAILABLE');
          populateEditFields(freshUser);
        } catch {
          const fallback = UserStore.getUsers().find((u) => u.role.toUpperCase() === normalizedRole);
          if (fallback) {
            setCurrentUser(fallback);
            setCurrentStatus((fallback.availabilityStatus as AvailabilityStatusType) || 'AVAILABLE');
            populateEditFields(fallback);
          }
        }
      } else {
        const fallback = UserStore.getUsers().find((u) => u.role.toUpperCase() === normalizedRole);
        if (fallback) {
          setCurrentUser(fallback);
          setCurrentStatus((fallback.availabilityStatus as AvailabilityStatusType) || 'AVAILABLE');
          populateEditFields(fallback);
        }
      }
    }
  };

  const populateEditFields = (user: UserAccount) => {
    setEditName(user.name || '');
    setEditPhone(user.phone || '');
    setEditEmail(user.email || '');
    setEditCity(user.city || 'Gaya Ji Central');
    setEditCustomRole(user.customRole || roleConfig.title);
    setEditSpecialization(user.specialization || user.customRole || '');
    setEditProfilePicUrl(user.profilePicUrl || user.avatarUrl || '');
    setEditDocumentUrl(user.documentUrl || '');
    setEditGoogleMapsUrl(user.googleMapsUrl || '');
    setEditLanguagesStr(user.languages ? user.languages.join(', ') : 'Hindi, Sanskrit');
    setEditDescription(user.description || '');
    setEditCapacity(user.capacity || 'Up to 4 Passengers');
  };

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoUploadError(null);
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const validation = validateUploadFile(file, 50 * 1024, ['jpg', 'jpeg', 'png', 'webp'], ['image/jpeg', 'image/png', 'image/webp']);
    if (!validation.valid) {
      setPhotoUploadError(validation.error || 'Invalid photo');
      return;
    }
    setIsUploadingPhoto(true);
    try {
      const res = await uploadToSupabaseBucket(file, 'gayaseva-partner-profiles', 'profiles', validation.sanitizedFileName || `profile_${Date.now()}.jpg`);
      if (res.error) setPhotoUploadError(res.error);
      else setEditProfilePicUrl(res.publicUrl);
    } catch (err: any) {
      setPhotoUploadError(err?.message || 'Photo upload failed');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const fetchBookings = async (providerId: string) => {
    setLoadingBookings(true);
    try {
      const res = await fetch(`/api/provider/bookings?providerId=${providerId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch bookings:', e);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadProviderSession();
  }, [params.role]);

  useEffect(() => {
    if (currentUser) {
      fetchBookings(currentUser.id);
    }
  }, [currentUser?.id]);

  // Toggle Live Availability Status
  const handleToggleAvailability = async (newStatus: AvailabilityStatusType) => {
    if (!currentUser) return;
    if (currentUser.status === 'SUSPENDED') {
      alert('Your provider account is currently suspended. Please contact admin support.');
      return;
    }

    setCurrentStatus(newStatus);
    await realtimeAvailabilityEngine.setProviderAvailability(currentUser.id, newStatus);
    
    // Sync local user object state
    const updated = await UserStore.updateUser(currentUser.id, {
      availabilityStatus: newStatus as any,
    });
    if (updated) {
      setCurrentUser(updated);
      localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(updated));
    }
  };

  // Submit Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const parsedLangs = editLanguagesStr.split(',').map((s) => s.trim()).filter(Boolean);

    const updates = {
      name: editName,
      phone: editPhone,
      email: editEmail,
      city: editCity,
      customRole: editCustomRole,
      specialization: editSpecialization.trim() || undefined,
      profilePicUrl: editProfilePicUrl.trim() || undefined,
      avatarUrl: editProfilePicUrl.trim() || undefined,
      documentUrl: editDocumentUrl.trim() || undefined,
      googleMapsUrl: editGoogleMapsUrl.trim() || undefined,
      languages: parsedLangs.length > 0 ? parsedLangs : undefined,
      description: editDescription.trim() || undefined,
      capacity: editCapacity.trim() || undefined,
    };

    const res = await ProviderProfileService.updateProviderProfile(currentUser.id, updates, currentUser.id);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      alert('Provider profile updated successfully with audit trail recording.');
      setShowEditModal(false);
    } else {
      alert(`Profile Update Failed: ${res.error || 'Unknown error'}`);
    }
  };

  // Handle Booking State Machine Actions
  const handleBookingStateAction = async (bookingId: string, nextStatus: BookingStatus) => {
    setBookingActionError(null);
    if (!currentUser) return;

    try {
      const res = await fetch('/api/provider/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          nextStatus,
          actorUserId: currentUser.id,
          actorRole: 'PROVIDER',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBookingActionError(data.error || 'Failed to update booking status.');
        alert(`Booking Status Change Rejected: ${data.error || 'Invalid transition'}`);
        return;
      }

      // Re-fetch bookings on success
      await fetchBookings(currentUser.id);
      alert(`Booking status successfully changed to ${nextStatus}!`);
    } catch (e: any) {
      setBookingActionError(e?.message || 'Network error updating booking status');
    }
  };

  // Toggle Driver Live Geolocation Tracking
  const toggleGPSTracking = () => {
    if (isGPSTrackingActive) {
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        setGpsWatchId(null);
      }
      setIsGPSTrackingActive(false);
      alert('Live GPS tracking stopped.');
    } else {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentCoordinates(coords);
          console.log('📍 Live GPS position recorded:', coords);
        },
        (err) => {
          console.warn('GPS Watch error:', err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      setGpsWatchId(watchId);
      setIsGPSTrackingActive(true);
      alert('🟢 Live GPS location sharing activated! Passenger map will receive your position.');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('GAYASEVA_CURRENT_USER');
    }
    router.push('/auth/login');
  };

  const isVerified = currentUser?.status === 'VERIFIED';
  const isPending = currentUser?.status === 'PENDING';
  const isSuspended = currentUser?.status === 'SUSPENDED';

  const completeness = currentUser ? ProviderProfileService.calculateProfileCompleteness(currentUser) : { score: 70, missingItems: [] };

  // Calculate metrics
  const pendingCount = bookings.filter((b) => b.status === 'NEW').length;
  const confirmedCount = bookings.filter((b) => ['ACCEPTED', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)).length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const totalEarnings = bookings.filter((b) => b.status === 'COMPLETED').reduce((acc, b) => acc + (b.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-950 antialiased">
      
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-2 border-[#F58220]/40 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F58220] to-[#F6C343] flex items-center justify-center font-extrabold text-3xl text-slate-950 shadow-lg border-2 border-white/20 shrink-0">
            {currentUser?.name ? currentUser.name.substring(0, 1).toUpperCase() : roleConfig.title.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white capitalize tracking-wide">
                {currentUser?.name || `${roleConfig.title} Console`}
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

              {isSuspended && (
                <span className="px-3 py-1 text-xs font-black uppercase rounded-full bg-red-600 text-white flex items-center gap-1 shadow-md">
                  <AlertTriangle className="w-4 h-4 text-white" /> ACCOUNT SUSPENDED
                </span>
              )}
            </div>

            <p className="text-xs text-amber-200 font-bold">
              Role: <strong className="text-[#F6C343] font-extrabold">{currentUser?.customRole || roleConfig.title}</strong> &bull; Location: {currentUser?.city || 'Gaya Ji Central'}
            </p>
          </div>
        </div>

        {/* Dynamic Availability Controls */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          {/* Role-Specific Status Buttons */}
          <div className="flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-amber-500/30 gap-1">
            {roleConfig.availableStatuses.map((st) => (
              <button
                key={st.key}
                onClick={() => handleToggleAvailability(st.key)}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  currentStatus === st.key
                    ? st.badgeClass + ' shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {st.label.split(' ')[0]} {st.label.split(' ').slice(1).join(' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs rounded-2xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-3 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl border border-slate-700 transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
          >
            <LogOut className="w-4 h-4 text-amber-400" /> Logout
          </button>
        </div>
      </div>

      {/* 2. PROFILE COMPLETENESS BAR */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-extrabold">
          <span className="text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F58220]" /> Partner Profile Completion
          </span>
          <span className="text-[#F58220] font-black text-sm">{completeness.score}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
          <div 
            className="bg-gradient-to-r from-[#F58220] to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${completeness.score}%` }}
          />
        </div>
        {completeness.missingItems.length > 0 && (
          <p className="text-[11px] text-amber-900 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            💡 <strong>Complete your profile to get higher booking visibility:</strong> Missing {completeness.missingItems.join(', ')}
          </p>
        )}
      </div>

      {/* 3. METRICS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500">New Requests</p>
          <p className="text-2xl font-black text-blue-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500">Active / Confirmed</p>
          <p className="text-2xl font-black text-amber-600">{confirmedCount}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500">Completed Service</p>
          <p className="text-2xl font-black text-emerald-600">{completedCount}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500">Total Earnings</p>
          <p className="text-2xl font-black text-[#4A2E1A]">₹{totalEarnings.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* 4. MODULE TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {roleConfig.modules.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveTab(m.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === m.id
                ? 'bg-[#1C0D02] text-[#F6C343] shadow-md border border-amber-500/40'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* 5. TAB CONTENT PANELS */}
      
      {/* A. OVERVIEW / REQUESTS TAB */}
      {(activeTab === 'overview' || activeTab === 'requests') && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#F58220]" />
              Incoming Pilgrim Requests &amp; Bookings ({bookings.length})
            </h2>
            <button
              onClick={() => fetchBookings(currentUser?.id || '')}
              className="text-xs font-bold text-[#F58220] hover:underline"
            >
              🔄 Refresh List
            </button>
          </div>

          {bookingActionError && (
            <div className="p-4 bg-red-100 border border-red-300 text-red-900 font-bold text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{bookingActionError}</span>
            </div>
          )}

          {loadingBookings ? (
            <div className="p-12 text-center text-slate-500 text-xs font-bold">
              Loading booking requests from database...
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-3xl border border-slate-200 space-y-2">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-extrabold text-slate-800">No customer requests received yet.</p>
              <p className="text-xs text-slate-500">
                Ensure your availability status is set to 🟢 <strong>AVAILABLE</strong> so pilgrims can send booking requests.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => {
                const badge = getBookingStatusBadge(b.status);
                return (
                  <div key={b.id} className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4 font-sans relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2.5 py-1 text-[10px] uppercase rounded-full inline-block ${badge.badgeClass}`}>
                          {badge.label}
                        </span>
                        <h3 className="font-serif font-bold text-base text-slate-950 pt-2">
                          {b.serviceTitle}
                        </h3>
                        <p className="text-xs font-bold text-slate-600">
                          Customer: <strong className="text-slate-900">{b.customerName}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-[#4A2E1A]">₹{b.amount}</span>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{b.paymentStatus}</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 bg-[#F8F6EF] p-3.5 rounded-2xl space-y-1">
                      <p>📅 <strong>Date &amp; Time:</strong> {b.bookingDate} at {b.bookingTime}</p>
                      {b.pickupAddress && <p>📍 <strong>Pickup:</strong> {b.pickupAddress}</p>}
                      {b.dropAddress && <p>🏁 <strong>Drop:</strong> {b.dropAddress}</p>}
                      {b.passengersCount && <p>👥 <strong>Passengers / Group:</strong> {b.passengersCount} Persons</p>}
                    </div>

                    {/* STATE MACHINE ACTION BUTTONS */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                      {b.status === 'NEW' && (
                        <>
                          <button
                            onClick={() => handleBookingStateAction(b.id, 'ACCEPTED')}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleBookingStateAction(b.id, 'REJECTED')}
                            className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 font-extrabold text-xs rounded-xl transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {b.status === 'ACCEPTED' && (
                        <>
                          <button
                            onClick={() => handleBookingStateAction(b.id, 'CONFIRMED')}
                            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition"
                          >
                            Confirm Booking
                          </button>
                          <button
                            onClick={() => handleBookingStateAction(b.id, 'CANCELLED')}
                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs rounded-xl transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleBookingStateAction(b.id, 'IN_PROGRESS')}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-4 h-4 fill-white" /> Start Service / Ride
                        </button>
                      )}

                      {b.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleBookingStateAction(b.id, 'COMPLETED')}
                          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" /> Complete Service
                        </button>
                      )}

                      {['COMPLETED', 'REJECTED', 'CANCELLED', 'EXPIRED'].includes(b.status) && (
                        <span className="text-xs text-slate-500 font-bold italic py-1">
                          Booking archived ({b.status.toLowerCase()})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* B. ACTIVE RIDE & GPS TRACKING TAB (For Drivers & Transport Partners) */}
      {(activeTab === 'active_ride' || activeTab === 'vehicle') && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#F58220]" />
                Live GPS Ride Location Sharing (चालक लाइव लोकेशन ट्रैकिंग)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Share live GPS coordinates with pilgrims during an active IN_PROGRESS ride.
              </p>
            </div>

            <button
              onClick={toggleGPSTracking}
              className={`px-5 py-3 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                isGPSTrackingActive
                  ? 'bg-red-600 text-white ring-4 ring-red-600/30 hover:bg-red-700'
                  : 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 hover:bg-emerald-400'
              }`}
            >
              {isGPSTrackingActive ? (
                <>
                  <StopCircle className="w-4 h-4 text-white" /> Stop GPS Sharing
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" /> Start Live GPS Sharing
                </>
              )}
            </button>
          </div>

          <div className="bg-[#F8F6EF] p-5 rounded-2xl border border-orange-100 space-y-2 text-xs text-slate-700">
            <p className="font-bold text-[#4A2E1A]">GPS Status Indicator:</p>
            <p className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isGPSTrackingActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              <strong>{isGPSTrackingActive ? 'LIVE GPS BROADCASTING ACTIVE' : 'GPS TRACKING INACTIVE'}</strong>
            </p>
            {currentCoordinates && (
              <p className="font-mono text-slate-900 font-bold">
                Current Position: Lat {currentCoordinates.lat.toFixed(5)}, Lng {currentCoordinates.lng.toFixed(5)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* C. PUBLIC WEBSITE PROVIDER CARD LIVE PREVIEW */}
      {currentUser && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F58220]" />
            Website Provider Card Live Preview (आपकी सार्वजनिक कार्ड प्रोफाइल)
          </h2>
          <p className="text-xs text-slate-500">
            This card updates in real-time across the GayaSeva website when you change your profile or online status.
          </p>
          <div className="max-w-md mx-auto">
            <WebsiteProviderCard provider={currentUser} />
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-5 border-2 border-slate-900 font-sans text-slate-950 my-8">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-slate-950 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#F58220]" />
                Edit Provider Profile (जानकारी अपडेट करें)
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-bold max-h-[75vh] overflow-y-auto pr-1">
              
              {/* Profile Photo / Avatar Section */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <label className="block text-slate-900 font-extrabold text-xs">Profile Photo / Avatar (प्रोफाइल फोटो)</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl border-2 border-[#F58220] bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    {editProfilePicUrl ? (
                      <img src={editProfilePicUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handlePhotoFileUpload}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-[#F58220] file:text-white hover:file:bg-[#E07210] cursor-pointer"
                    />
                    <input
                      type="url"
                      value={editProfilePicUrl}
                      onChange={(e) => setEditProfilePicUrl(e.target.value)}
                      placeholder="Or paste photo URL (https://...)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:border-[#F58220]"
                    />
                    {photoUploadError && (
                      <p className="text-[10px] text-red-600 font-bold">{photoUploadError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Provider / Business Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-900 font-extrabold mb-1">Phone Number (Calls &amp; WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                  />
                </div>

                <div>
                  <label className="block text-slate-900 font-extrabold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Service Title / Role Subtitle</label>
                <input
                  type="text"
                  value={editCustomRole}
                  onChange={(e) => setEditCustomRole(e.target.value)}
                  placeholder="e.g. Purohit & Pandit Service, AC Cab Operator, Dharamshala"
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              {/* Specialization Field */}
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl space-y-2">
                <label className="block text-[#4A2E1A] font-extrabold text-xs">
                  Specialization / पूजा एवं सेवा विशेषज्ञता (Specialization)
                </label>
                
                {/* Quick Select Chips */}
                <div className="flex flex-wrap gap-1">
                  {[
                    'Pind Daan (पिंडदान)',
                    'Tripindi Shradh (त्रिपिंडी श्राद्ध)',
                    'Narayan Bali (नारायण बलि)',
                    'Kaal Sarp Dosh (कालसर्प दोष)',
                    'Vedic Karmakand (वैदिक कर्मकांड)',
                    'Mundan Sanskar (मुंडन संस्कार)',
                    'Outstation Taxi',
                    'Airport Pick & Drop',
                    'AC Yatri Rooms',
                    'Pure Veg Satvik Food'
                  ].map((chip) => {
                    const cleanTag = chip.split(' ')[0];
                    const isActive = editSpecialization.toLowerCase().includes(cleanTag.toLowerCase());
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          if (isActive) {
                            const updated = editSpecialization
                              .split(', ')
                              .filter(s => !s.toLowerCase().includes(cleanTag.toLowerCase()))
                              .join(', ');
                            setEditSpecialization(updated);
                          } else {
                            setEditSpecialization(editSpecialization ? `${editSpecialization}, ${chip}` : chip);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border ${
                          isActive
                            ? 'bg-[#2A180B] text-[#F6C343] border-[#2A180B]'
                            : 'bg-white text-slate-700 border-amber-200 hover:border-[#F58220]'
                        }`}
                      >
                        {isActive ? '✓ ' : '+ '}
                        {chip}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  placeholder="e.g. Pind Daan, Tripindi Shradh, Narayan Bali, Kaal Sarp Dosh"
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">
                  👥 Passenger / Seating / Room Capacity (क्षमता)
                </label>
                <div className="space-y-2">
                  <select
                    value={['Up to 3 Passengers', 'Up to 4 Passengers', 'Up to 6 Passengers', 'Up to 7 Passengers', 'Up to 12 Passengers'].includes(editCapacity) ? editCapacity : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setEditCapacity(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 bg-white focus:outline-none focus:border-[#F58220]"
                  >
                    <option value="Up to 4 Passengers">Up to 4 Passengers (4 सवारी - Sedan / Hatchback)</option>
                    <option value="Up to 6 Passengers">Up to 6 Passengers (6 सवारी - Ertiga / SUV)</option>
                    <option value="Up to 7 Passengers">Up to 7 Passengers (7 सवारी - Innova / SUV)</option>
                    <option value="Up to 3 Passengers">Up to 3 Passengers (3 सवारी - Toto / E-Rickshaw)</option>
                    <option value="Up to 12 Passengers">Up to 12 Passengers (12 सवारी - Tempo Traveller)</option>
                    <option value="custom">Custom Text Input (कस्टम दर्ज करें)...</option>
                  </select>
                  <input
                    type="text"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    placeholder="e.g. Up to 4 Passengers or 4 सवारी"
                    className="w-full px-3.5 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Service Description &amp; Features</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe your services, family legacy, or special Yatri facilities..."
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Languages Spoken (comma-separated)</label>
                <input
                  type="text"
                  value={editLanguagesStr}
                  onChange={(e) => setEditLanguagesStr(e.target.value)}
                  placeholder="Hindi, Sanskrit, English, Bengali"
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Operating Location in Gaya Ji</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  placeholder="e.g. Vishnupad Temple Area, Falgu Ghat"
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Google Maps Navigation Share Link (URL)</label>
                <input
                  type="url"
                  value={editGoogleMapsUrl}
                  onChange={(e) => setEditGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Govt ID / Verification Document (URL)</label>
                <input
                  type="text"
                  value={editDocumentUrl}
                  onChange={(e) => setEditDocumentUrl(e.target.value)}
                  placeholder="Document URL / Link"
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="pt-3 border-t-2 border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 border-2 border-slate-300 rounded-xl font-extrabold text-slate-800 hover:bg-slate-100 cursor-pointer"
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
