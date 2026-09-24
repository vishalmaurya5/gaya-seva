'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserStore, UserAccount } from '@/lib/userStore';
import { PaymentStore, PaymentRecord } from '@/lib/paymentStore';
import { ConfigStore } from '@/lib/configStore';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Navigation,
  ShieldCheck,
  Phone,
  MessageSquare,
  Edit3, 
  Trash2, 
  X, 
  LogOut,
  Flame,
  CreditCard,
  Key,
  Layers,
  Sparkles,
  ShoppingBag,
  Hotel,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ACTIVE_RIDE' | 'BOOKINGS' | 'PAYMENTS' | 'SETTINGS'>('OVERVIEW');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [userPayments, setUserPayments] = useState<PaymentRecord[]>([]);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [accessRecord, setAccessRecord] = useState<any>(null);
  const [config, setConfig] = useState<any>(ConfigStore.getConfig());
  const [loading, setLoading] = useState(true);

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');

  // Payment State
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const refreshUserSession = async () => {
    setLoading(true);
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

          // Fetch fresh payments
          const allPayments = await PaymentStore.fetchPaymentsFromApi();
          const myPayments = allPayments.filter(p => p.userId === latest.id);
          setUserPayments(myPayments);

          // Fetch access status
          const accessRes = await fetch('/api/payments/access-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: latest.id }),
          });

          if (accessRes.ok) {
            const accessData = await accessRes.json();
            setHasAccess(accessData.hasAccess);
            setAccessRecord(accessData.record);
          }

          const latestConfig = await ConfigStore.fetchConfig();
          setConfig(latestConfig);
        } catch (e) {
          console.error(e);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUserSession();
    window.addEventListener('storage', refreshUserSession);
    window.addEventListener('gayaseva_access_change', refreshUserSession);
    return () => {
      window.removeEventListener('storage', refreshUserSession);
      window.removeEventListener('gayaseva_access_change', refreshUserSession);
    };
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated = await UserStore.updateUser(currentUser.id, {
      name: editName,
      email: editEmail,
      phone: editPhone,
      city: editCity,
    });

    if (updated) {
      localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(updated));
      setCurrentUser(updated);
      alert('प्रोफाइल अपडेट हो गई है! / Profile details updated successfully!');
      setShowEditModal(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('GAYASEVA_CURRENT_USER');
      window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
      alert('आपका खाता डिलीट कर दिया गया है / Account successfully deleted.');
      router.push('/');
    }
  };

  const handleOpenPaymentModal = () => {
    if (!currentUser) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }
    if (hasAccess) {
      alert('✨ GayaSeva ₹5 Global Access Pass is ALREADY ACTIVE for your account!');
      return;
    }
    setShowPaymentModal(true);
  };

  const triggerInstantTestAccessPassPayment = async () => {
    if (!currentUser) return;
    setIsProcessingPayment(true);
    setPaymentMessage('Activating ₹5 Access Pass...');
    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: `order_demo_${Date.now()}`,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: 'test_signature',
          userId: currentUser.id,
          purpose: 'CUSTOMER_ACCESS',
        }),
      });

      if (verifyRes.ok) {
        setHasAccess(true);
        setShowPaymentModal(false);
        alert('🎉 Success! ₹5 Global Access Pass activated on your account! All verified Gaya Ji provider contacts are unlocked.');
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('gayaseva_access_change'));
        refreshUserSession();
      } else {
        const err = await verifyRes.json();
        alert(`Payment Error: ${err.error || 'Activation failed'}`);
      }
    } catch (e: any) {
      alert(`Error activating pass: ${e.message}`);
    } finally {
      setIsProcessingPayment(false);
      setPaymentMessage(null);
    }
  };

  const triggerRazorpayAccessPassPayment = async () => {
    if (!currentUser) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }

    if (hasAccess) {
      alert('✨ GayaSeva ₹5 Global Access Pass is ALREADY ACTIVE for your account!');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentMessage('Generating Razorpay payment order for ₹5 Access Pass...');

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          purpose: 'CUSTOMER_ACCESS',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create payment order');
      }

      const orderData = await res.json();

      if (orderData.alreadyActive) {
        setHasAccess(true);
        setIsProcessingPayment(false);
        setPaymentMessage(null);
        setShowPaymentModal(false);
        alert('✨ Access Pass is already active on your account!');
        return;
      }

      // Load Razorpay Checkout SDK dynamically if needed
      if (typeof (window as any).Razorpay === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const cleanOrderId = orderData.orderId && orderData.orderId.startsWith('order_mock_') ? undefined : orderData.orderId;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency || 'INR',
        name: 'GayaSeva Global Access Pass',
        description: `Unlock all 500+ verified Gaya Ji Pandit, Taxi & Hotel contacts for ₹${orderData.amount}`,
        image: 'https://gayaseva.org/logo.png',
        order_id: cleanOrderId,
        handler: async function (response: any) {
          setPaymentMessage('Verifying payment signature with Razorpay backend...');
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.orderId || `order_${Date.now()}`,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'test_signature',
                userId: currentUser.id,
                purpose: 'CUSTOMER_ACCESS',
              }),
            });

            if (verifyRes.ok) {
              setHasAccess(true);
              setPaymentMessage('✅ ₹5 Pass Activated!');
              setShowPaymentModal(false);
              alert('🎉 Success! ₹5 Global Access Pass activated on your account! All verified Gaya Ji provider contacts are unlocked.');
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new Event('gayaseva_access_change'));
              refreshUserSession();
            } else {
              const err = await verifyRes.json();
              alert(`Payment Verification Error: ${err.error || 'Verification failed'}`);
            }
          } catch (e: any) {
            alert(`Payment verification error: ${e.message}`);
          } finally {
            setIsProcessingPayment(false);
            setPaymentMessage(null);
          }
        },
        prefill: {
          name: currentUser.name || '',
          email: currentUser.email || '',
          contact: currentUser.phone || '',
        },
        theme: {
          color: '#F58220',
        },
      };

      if (typeof (window as any).Razorpay !== 'undefined') {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          alert(`Payment failed: ${resp.error?.description || 'Cancelled'}`);
          setIsProcessingPayment(false);
          setPaymentMessage(null);
        });
        rzp.open();
      } else {
        alert('Razorpay Checkout SDK failed to load. Please check your internet connection.');
        setIsProcessingPayment(false);
        setPaymentMessage(null);
      }
    } catch (err: any) {
      alert(`Payment Order Error: ${err.message}`);
      setIsProcessingPayment(false);
      setPaymentMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6EF] font-sans text-slate-900 antialiased py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Unified Executive Profile Banner */}
      <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#F58220]/40 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#F58220]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Info */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#F58220] to-[#F6C343] flex items-center justify-center text-slate-950 font-black text-2xl sm:text-3xl shadow-lg border-2 border-white/20 shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'Y'}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                {currentUser?.name || 'GayaSeva Yatri'}
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold rounded-md border border-emerald-400/30 text-[10px] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Pilgrim
              </span>
            </div>
            
            <p className="text-xs text-amber-200/90 font-medium flex items-center gap-2 flex-wrap">
              <span>📱 {currentUser?.phone || '+91 98765 43210'}</span>
              <span>&bull;</span>
              <span>📍 {currentUser?.city || 'Gaya Ji'}</span>
              {currentUser?.email && (
                <>
                  <span>&bull;</span>
                  <span>✉️ {currentUser.email}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Access Status & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto relative z-10">
          {hasAccess ? (
            <div className="px-4 py-2.5 bg-emerald-950/80 border border-emerald-400/40 rounded-2xl text-left shadow-inner flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 font-extrabold uppercase block tracking-wider">Access Pass Status</span>
                <span className="text-xs font-black text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ₹{config.customer_access_fee} Active Pass
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenPaymentModal}
              disabled={isProcessingPayment}
              className="px-4 py-2.5 bg-gradient-to-r from-[#F58220] to-[#F6C343] text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:from-[#E07210] hover:to-[#E5B232] transition-all cursor-pointer active:scale-95"
            >
              {isProcessingPayment ? (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>{paymentMessage || 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-slate-950" />
                  <span>Activate ₹{config.customer_access_fee} Access Pass</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#F58220]" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2.5 bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white font-bold text-xs rounded-2xl border border-red-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Seamless Unified Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
        {(['OVERVIEW', 'ACTIVE_RIDE', 'BOOKINGS', 'PAYMENTS', 'SETTINGS'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === tab
                ? 'bg-[#1C0D02] text-[#F6C343] shadow-md scale-101'
                : 'text-slate-700 hover:bg-amber-50 hover:text-[#F58220]'
            }`}
          >
            {tab === 'OVERVIEW' && <Layers className="w-4 h-4 text-[#F58220]" />}
            {tab === 'ACTIVE_RIDE' && <Navigation className="w-4 h-4 text-[#F58220]" />}
            {tab === 'BOOKINGS' && <Calendar className="w-4 h-4 text-[#F58220]" />}
            {tab === 'PAYMENTS' && <CreditCard className="w-4 h-4 text-[#F58220]" />}
            {tab === 'SETTINGS' && <User className="w-4 h-4 text-[#F58220]" />}

            <span>
              {tab === 'OVERVIEW' ? 'Dashboard Overview' :
               tab === 'ACTIVE_RIDE' ? 'Active Ride Tracking' :
               tab === 'BOOKINGS' ? 'My Bookings & Requests' :
               tab === 'PAYMENTS' ? 'Payment History & Access' : 'Profile Settings'}
            </span>
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT VIEWS */}

      {/* OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Executive Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Access Pass Status</span>
              <p className="text-2xl font-black text-slate-900 flex items-center gap-2">
                {hasAccess ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" /> Active Pass
                  </span>
                ) : (
                  <span className="text-amber-600">Inactive</span>
                )}
              </p>
              <p className="text-xs text-slate-600 font-semibold">
                {hasAccess ? 'Full directory & phone contacts unlocked' : `Activate ₹${config.customer_access_fee} Pass to view full details`}
              </p>

              {!hasAccess && (
                <button
                  type="button"
                  onClick={handleOpenPaymentModal}
                  disabled={isProcessingPayment}
                  className="mt-1 text-xs font-black text-[#F58220] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Activate ₹{config.customer_access_fee} Pass (Razorpay) &rarr;</span>
                </button>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Total Transactions</span>
              <p className="text-2xl font-black text-slate-900">{userPayments.length}</p>
              <p className="text-xs text-slate-600 font-semibold">
                {userPayments.filter(p => p.status === 'SUCCESS').length} Successful Payments
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Active Services</span>
              <p className="text-2xl font-black text-[#F58220] flex items-center gap-2">
                <Navigation className="w-6 h-6 text-[#F58220]" /> 1 Active Ride
              </p>
              <p className="text-xs text-slate-600 font-semibold">Pick &amp; Drop DZire #RD-84920</p>
            </div>
          </div>

          {/* Quick Service Action Launcher */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F58220]" />
              <span>गया जी त्वरित सेवा बुकिंग (Quick Service Launcher)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
              <Link
                href="/pandit"
                className="p-4 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-2xl text-[#1C0D02] space-y-2 transition-all hover:shadow-md"
              >
                <Flame className="w-6 h-6 text-[#F58220]" />
                <span className="block font-black text-sm">पिंडदान एवं पुरोहित</span>
                <span className="text-[11px] text-slate-600 font-medium block">Book Teerth Purohit &rarr;</span>
              </Link>

              <Link
                href="/barbers"
                className="p-4 bg-orange-50 hover:bg-orange-100/80 border border-orange-200 rounded-2xl text-[#1C0D02] space-y-2 transition-all hover:shadow-md"
              >
                <span className="text-xl">✂️</span>
                <span className="block font-black text-sm">क्षौर कर्म एवं मुंडन</span>
                <span className="text-[11px] text-slate-600 font-medium block">Traditional Barber &rarr;</span>
              </Link>

              <Link
                href="/pick-drop"
                className="p-4 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-2xl text-[#1C0D02] space-y-2 transition-all hover:shadow-md"
              >
                <Car className="w-6 h-6 text-blue-600" />
                <span className="block font-black text-sm">टैक्सी एवं ऑटो</span>
                <span className="text-[11px] text-slate-600 font-medium block">Pick &amp; Drop Cab &rarr;</span>
              </Link>

              <Link
                href="/stay"
                className="p-4 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-2xl text-[#1C0D02] space-y-2 transition-all hover:shadow-md"
              >
                <Hotel className="w-6 h-6 text-purple-600" />
                <span className="block font-black text-sm">होटल एवं धर्मशाला</span>
                <span className="text-[11px] text-slate-600 font-medium block">Book Accommodation &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE RIDE TAB */}
      {activeTab === 'ACTIVE_RIDE' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-5">
            <div className="space-y-1">
              <span className="px-3.5 py-1 bg-[#1C0D02] text-[#F6C343] rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/40">
                RIDE IN PROGRESS &bull; ACTIVE
              </span>
              <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-2">
                Pick &amp; Drop Ride <span className="text-[#F58220]">#RD-84920</span>
              </h2>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-300 text-right min-w-[120px]">
              <span className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block">ESTIMATED ETA</span>
              <span className="text-2xl font-black text-[#D96B00]">8 Mins</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 text-white p-5 rounded-2xl border border-amber-500/30 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58220] to-[#F6C343] text-white font-extrabold text-base flex items-center justify-center shadow-md shrink-0 border border-white/20">
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

          <div className="relative w-full h-72 bg-[#0B132B] rounded-2xl border border-amber-500/40 overflow-hidden flex flex-col justify-center items-center text-center p-6 shadow-inner space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#F58220]/20 flex items-center justify-center border border-[#F58220]/50 animate-pulse">
              <Navigation className="w-7 h-7 text-[#F58220] animate-bounce" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-white tracking-wide">Live GPS Radar &amp; Route Active</p>
              <p className="text-xs text-amber-200 font-medium max-w-md mt-1">
                Realtime tracking channel <code className="bg-slate-900 text-[#F6C343] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">ride:RD-84920</code> active.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'BOOKINGS' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">My Service Bookings &amp; Requests</h2>
          <div className="space-y-3">
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex justify-between items-center text-xs font-bold">
              <div>
                <p className="font-extrabold text-base text-white">Pandit Booking for Pinda Daan Rites</p>
                <p className="text-amber-200 text-xs">Vishnupad Temple &bull; Tomorrow 8:00 AM</p>
              </div>
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black rounded-full text-xs uppercase tracking-wider">
                CONFIRMED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === 'PAYMENTS' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-5">
            <div className="space-y-1">
              <span className="px-3.5 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-300">
                💳 RAZORPAY VERIFIED PAYMENTS
              </span>
              <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-2">
                Payment History &amp; Access Pass Status
              </h2>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 text-right">
              <span className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block">ACCESS PASS STATUS</span>
              <span className="text-xl font-black text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" /> {hasAccess ? 'ACTIVE PASS' : 'INACTIVE'}
              </span>
            </div>
          </div>

          {hasAccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-950 space-y-1">
              <p className="font-extrabold text-sm text-emerald-900">✨ ₹{config.customer_access_fee} Customer Contact Access Pass Activated!</p>
              <p className="text-emerald-800">You can view direct phone numbers and WhatsApp links for all GayaSeva verified Pandits, Barbers, Taxis, Hotels, and Services.</p>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs font-bold text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-extrabold text-sm text-[#4A2E1A]">🔒 ₹{config.customer_access_fee} Global Access Pass Inactive</p>
                <p className="text-amber-900">Activate your pass now via Razorpay to unlock 500+ verified Gaya Ji Pandit &amp; Service contacts.</p>
              </div>
              <button
                type="button"
                onClick={handleOpenPaymentModal}
                disabled={isProcessingPayment}
                className="px-4 py-2 bg-gradient-to-r from-[#F58220] to-[#E07210] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
              >
                Activate ₹{config.customer_access_fee} Pass Now &rarr;
              </button>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-extrabold text-lg text-slate-950">Payment Transactions Ledger</h3>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-900 text-white font-extrabold text-xs grid grid-cols-4 sm:grid-cols-5 gap-2">
                <span>Purpose</span>
                <span>Amount</span>
                <span>Payment ID</span>
                <span>Status</span>
                <span className="hidden sm:inline text-right">Date</span>
              </div>
              <div className="divide-y divide-slate-200 text-xs font-semibold text-slate-900">
                {userPayments.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 font-medium">
                    No payment transactions recorded yet.
                  </div>
                ) : (
                  userPayments.map(p => (
                    <div key={p.id} className="p-4 grid grid-cols-4 sm:grid-cols-5 gap-2 items-center">
                      <span className="font-bold text-[#F58220]">🔑 {p.purpose}</span>
                      <span className="font-black text-slate-950">₹{p.amount} {p.currency}</span>
                      <span className="font-mono text-slate-600 text-[11px]">{p.razorpayPaymentId || p.razorpayOrderId}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-black text-[10px] rounded-full w-fit">
                        {p.status}
                      </span>
                      <span className="hidden sm:inline text-right text-slate-500 text-[11px]">
                        {new Date(p.paidAt || p.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">Profile &amp; Account Settings</h2>
          
          <div className="space-y-4 max-w-xl text-xs font-bold">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <p className="text-slate-500 uppercase text-[10px] font-extrabold">Account Identity</p>
              <p className="text-base text-slate-900 font-black">{currentUser?.name}</p>
              <p className="text-slate-600 font-mono">{currentUser?.phone}</p>
              <p className="text-slate-600">{currentUser?.email}</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="px-5 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold rounded-xl shadow-md cursor-pointer"
              >
                Edit Account Details
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-5 border border-gray-200 text-slate-900 font-sans">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-xl text-slate-950 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#F58220]" />
                Edit Profile Details
              </h3>
              <button 
                type="button"
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
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Home City</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl font-extrabold text-slate-800 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RAZORPAY PAYMENT CHECKOUT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-6 border border-amber-300 text-slate-900 font-sans relative overflow-hidden animate-in fade-in zoom-in-95">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1C0D02] via-[#F58220] to-[#F6C343]" />

            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F58220] to-[#F6C343] text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                  <Key className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-950">
                    GayaSeva Global Access Pass
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    1-Time Pass &bull; Unlock All Verified Provider Contacts
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">Special Pass Fee</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950">₹{config.customer_access_fee}</span>
                  <span className="text-xs text-slate-500 font-semibold line-through">₹49</span>
                  <span className="ml-2 px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-black uppercase">90% Off</span>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 bg-[#1C0D02] text-[#F6C343] rounded-full text-xs font-black uppercase tracking-wider">
                  Lifetime Access
                </span>
              </div>
            </div>

            {/* Included Features */}
            <div className="space-y-2.5 text-xs font-bold text-slate-800">
              <p className="text-[11px] uppercase font-extrabold text-slate-500 tracking-wider">What you get with this pass:</p>
              
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>500+ गयावाल पुरोहित, टैक्सी, नाई एवं होटल का सीधा फोन एवं व्हाट्सएप नंबर</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>0% कमीशन — बिना किसी बिचौलिए के सीधे सेवा प्रदाता से बात करें</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>लाइव लोकेशन, गूगल मैप्स दिशा-निर्देश और सत्यापित प्रोफाइल एक्सेस</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={triggerRazorpayAccessPassPayment}
                disabled={isProcessingPayment}
                className="w-full py-4 bg-gradient-to-r from-[#F58220] via-[#E07210] to-[#D96B00] hover:from-[#E07210] hover:to-[#C45E00] text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <Sparkles className="w-5 h-5 text-white animate-spin" />
                    <span>{paymentMessage || 'Opening Razorpay Gateway...'}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 text-white" />
                    <span>Pay ₹{config.customer_access_fee} via Razorpay (UPI / Card / Netbanking)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={triggerInstantTestAccessPassPayment}
                disabled={isProcessingPayment}
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Instant Demo Pay ₹5 (One-Click Test Activate)</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-medium">
              🔒 256-Bit SSL Encrypted &bull; Razorpay Verified Payment Gateway &bull; GayaSeva Official
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
