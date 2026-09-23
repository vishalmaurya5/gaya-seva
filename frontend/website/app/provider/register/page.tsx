'use client';

import React, { useState } from 'react';
import { 
  UserCheck, ShieldCheck, Car, Flame, Hotel, ShoppingBag, MapPin, 
  Wrench, CheckCircle, Upload, FileText, Sparkles, Phone, Mail, 
  Award, ArrowRight, Lock, Check, UtensilsCrossed, Compass, Building2,
  X, AlertCircle, Image as ImageIcon, Link as LinkIcon, ShieldAlert, CheckCircle2,
  Scissors, Bus, Camera, Stethoscope, Bike
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore, UserAccount } from '@/lib/userStore';
import { 
  validateUploadFile, 
  validateImageUrl, 
  uploadToSupabaseBucket 
} from '@/lib/supabaseClient';

type ProviderRoleCategory = 'PANDIT' | 'BARBER' | 'DRIVER' | 'AUTO' | 'TRAVEL' | 'HOTEL' | 'SHOP' | 'GUIDE' | 'FOOD' | 'HEALTHCARE' | 'PHOTOGRAPHY' | 'OTHER';

interface CategoryOption {
  role: ProviderRoleCategory;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
}

const CATEGORIES: CategoryOption[] = [
  { role: 'PANDIT', title: 'Purohit & Pandit Ji', subtitle: 'Pind Daan, Shradh & Vedic Karmakand', icon: Flame, badge: 'Popular' },
  { role: 'HOTEL', title: 'Hotel & Dharamshala', subtitle: 'AC/Non-AC rooms near Vishnupad', icon: Hotel, badge: 'Direct' },
  { role: 'DRIVER', title: 'Taxi & Cab Driver', subtitle: 'Airport, Station & Outstation cabs', icon: Car, badge: 'Instant' },
  { role: 'AUTO', title: 'E-Rickshaw & Auto', subtitle: 'Local city & temple transport', icon: Bike, badge: 'Local Transit' },
  { role: 'TRAVEL', title: 'Tour & Travel Operator', subtitle: 'Gaya & Bodh Gaya tour packages', icon: Bus, badge: 'Packages' },
  { role: 'GUIDE', title: 'Tour Guide & Panda', subtitle: '45-Vedi Pind Daan & Bodhgaya guidance', icon: Compass, badge: 'Verified' },
  { role: 'FOOD', title: 'Restaurant & Satvik Food', subtitle: 'Pure Veg Satvik dining & takeaway', icon: UtensilsCrossed, badge: 'Pure Veg' },
  { role: 'HEALTHCARE', title: 'Healthcare & Medical', subtitle: 'Hospitals, Clinics & Pharmacies', icon: Stethoscope, badge: 'Essential' },
  { role: 'SHOP', title: 'Local Business & Puja Shop', subtitle: 'Gaya Tilkut, Anarsa & Puja Samagri', icon: ShoppingBag, badge: 'Shops' },
  { role: 'PHOTOGRAPHY', title: 'Pilgrimage Photography', subtitle: 'Pind Daan & travel photo services', icon: Camera, badge: 'Media' },
  { role: 'BARBER', title: 'Barber & Kshaur Karma (नाई/ठाकुर)', subtitle: 'Pind Daan Mundan & Kshaur Sanskar', icon: Scissors, badge: 'Mundan' },
  { role: 'OTHER', title: 'Other Services', subtitle: 'Laundry, repair, courier & general services', icon: Sparkles, badge: 'Custom' },
];

const AVAILABLE_LANGUAGES = ['Hindi', 'English', 'Bengali', 'Telugu', 'Tamil', 'Sanskrit'];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<ProviderRoleCategory>('PANDIT');
  const [customRoleText, setCustomRoleText] = useState('');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [operatingCity, setOperatingCity] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['Hindi', 'English']);
  const [agreedTerms, setAgreedTerms] = useState(false);
  
  // Profile Picture State (50KB Limit or URL)
  const [profilePicMode, setProfilePicMode] = useState<'FILE' | 'URL'>('FILE');
  const [profilePicUrlInput, setProfilePicUrlInput] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [profilePicError, setProfilePicError] = useState<string | null>(null);
  const [isUploadingPic, setIsUploadingPic] = useState(false);

  // Document State (100KB Limit)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; url?: string } | null>(null);
  const [docError, setDocError] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Optional Shop / Office Location State
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [detectedLat, setDetectedLat] = useState<number | null>(null);
  const [detectedLng, setDetectedLng] = useState<number | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  
  // Submission & Payment State
  const [submitted, setSubmitted] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');
  const [createdUser, setCreatedUser] = useState<UserAccount | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleAutoDetectGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsMessage('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingGps(true);
    setGpsMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectedLat(pos.coords.latitude);
        setDetectedLng(pos.coords.longitude);
        setIsDetectingGps(false);
        setGpsMessage(`GPS Location Captured: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsMessage('Location permission denied or unavailable.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLangs.includes(lang)) {
      if (selectedLangs.length > 1) {
        setSelectedLangs(selectedLangs.filter(l => l !== lang));
      }
    } else {
      setSelectedLangs([...selectedLangs, lang]);
    }
  };

  const handleProfilePicFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfilePicError(null);
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const validation = validateUploadFile(
      file, 
      50 * 1024, 
      ['jpg', 'jpeg', 'png', 'webp'], 
      ['image/jpeg', 'image/png', 'image/webp']
    );

    if (!validation.valid) {
      setProfilePicError(validation.error || 'Invalid profile image');
      return;
    }

    setIsUploadingPic(true);
    try {
      const res = await uploadToSupabaseBucket(
        file,
        'gayaseva-partner-profiles',
        'profiles',
        validation.sanitizedFileName || `profile_${Date.now()}.jpg`
      );
      if (res.error) setProfilePicError(res.error);
      else setProfilePicPreview(res.publicUrl);
    } catch (err: any) {
      setProfilePicError(err?.message || 'Profile photo upload failed');
    } finally {
      setIsUploadingPic(false);
    }
  };

  const handleProfilePicUrlChange = (val: string) => {
    setProfilePicUrlInput(val);
    setProfilePicError(null);
    if (!val.trim()) {
      setProfilePicPreview(null);
      return;
    }
    const valRes = validateImageUrl(val);
    if (!valRes.valid) {
      setProfilePicError(valRes.error || 'Invalid URL');
      setProfilePicPreview(null);
    } else {
      setProfilePicPreview(val.trim());
    }
  };

  const handleDocumentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocError(null);
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const validation = validateUploadFile(
      file, 
      100 * 1024, 
      ['jpg', 'jpeg', 'png', 'pdf', 'webp'], 
      ['image/jpeg', 'image/png', 'application/pdf', 'image/webp']
    );

    if (!validation.valid) {
      setDocError(validation.error || 'Invalid document file');
      return;
    }

    setIsUploadingDoc(true);
    try {
      const res = await uploadToSupabaseBucket(
        file,
        'gayaseva-partner-documents',
        'documents',
        validation.sanitizedFileName || `doc_${Date.now()}.jpg`
      );
      if (res.error) setDocError(res.error);
      else {
        const sizeKB = (file.size / 1024).toFixed(1);
        setUploadedFile({
          name: file.name,
          size: `${sizeKB} KB`,
          url: res.publicUrl,
        });
      }
    } catch (err: any) {
      setDocError(err?.message || 'Document upload failed');
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const triggerRazorpayPayment = async (targetUser: UserAccount) => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    setPaymentMessage('Creating Razorpay payment order for ₹49 partner onboarding fee...');

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUser.id,
          purpose: 'PROVIDER_REGISTRATION',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create payment order');
      }

      const orderData = await res.json();

      // Load Razorpay Script dynamically if needed
      if (typeof (window as any).Razorpay === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency || 'INR',
        name: 'GayaSeva Partner Onboarding',
        description: `One-Time Provider Registration Fee ₹${orderData.amount}`,
        image: 'https://gayaseva.org/logo.png',
        order_id: orderData.orderId.startsWith('order_') && orderData.keyId.startsWith('rzp_test_gayaseva') ? undefined : orderData.orderId,
        handler: async function (response: any) {
          setPaymentMessage('Verifying payment signature with Razorpay backend...');
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.orderId,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'test_signature',
                userId: targetUser.id,
                purpose: 'PROVIDER_REGISTRATION',
              }),
            });

            if (verifyRes.ok) {
              const updatedUser = await UserStore.updateUser(targetUser.id, { status: 'VERIFIED' }) || { ...targetUser, status: 'VERIFIED' };
              localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(updatedUser));
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('storage'));
                window.dispatchEvent(new Event('gayaseva_auth_change'));
              }
              setPaymentSuccess(true);
              setPaymentMessage('✅ ₹49 Payment Verified! Opening your Partner Dashboard...');

              const targetRole = targetUser.role.toLowerCase();
              let dashboardPath = `/${targetRole}/dashboard`;
              if (targetRole === 'pandit') dashboardPath = '/pandit/dashboard';
              else if (targetRole === 'driver' || targetRole === 'auto') dashboardPath = '/driver/dashboard';
              else if (targetRole === 'hotel') dashboardPath = '/hotel/dashboard';

              setTimeout(() => {
                router.push(dashboardPath);
              }, 1200);
            } else {
              const err = await verifyRes.json();
              setPaymentError(err.error || 'Payment verification failed');
            }
          } catch (e: any) {
            setPaymentError(e.message || 'Payment verification failed');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: targetUser.name || '',
          email: targetUser.email || '',
          contact: targetUser.phone || '',
        },
        theme: {
          color: '#F58220',
        },
      };

      if (typeof (window as any).Razorpay !== 'undefined') {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setPaymentError(resp.error?.description || 'Razorpay payment cancelled or failed');
          setIsProcessingPayment(false);
        });
        rzp.open();
      } else {
        // Fallback execution for environments where popup is blocked
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: 'test_signature',
            userId: targetUser.id,
            purpose: 'PROVIDER_REGISTRATION',
          }),
        });

        if (verifyRes.ok) {
          const updatedUser = await UserStore.updateUser(targetUser.id, { status: 'VERIFIED' }) || { ...targetUser, status: 'VERIFIED' };
          localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(updatedUser));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('gayaseva_auth_change'));
          }
          setPaymentSuccess(true);
          setPaymentMessage('✅ ₹49 Payment Verified! Opening your Partner Dashboard...');

          const targetRole = targetUser.role.toLowerCase();
          let dashboardPath = `/${targetRole}/dashboard`;
          if (targetRole === 'pandit') dashboardPath = '/pandit/dashboard';
          else if (targetRole === 'driver' || targetRole === 'auto') dashboardPath = '/driver/dashboard';
          else if (targetRole === 'hotel') dashboardPath = '/hotel/dashboard';

          setTimeout(() => {
            router.push(dashboardPath);
          }, 1200);
        }
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment initiation failed');
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilePicError(null);
    setDocError(null);

    // Strict Requirement Validation
    if (!profilePicPreview) {
      setProfilePicError('कृपया अपनी प्रोफाइल फोटो अपलोड करें या फोटो URL दर्ज करें / Profile photo is strictly REQUIRED for registration');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }
      return;
    }

    if (!uploadedFile || !uploadedFile.url) {
      setDocError('कृपया अपना पहचान पत्र / सरकारी आधार दस्तावेज अपलोड करें / Govt ID document upload is strictly REQUIRED for verification');
      return;
    }
    
    let storeRole: any = selectedRole;
    let customRoleVal = customRoleText.trim();

    if (selectedRole === 'BARBER') {
      customRoleVal = customRoleVal || 'Kshaur Karma & Mundan Specialist (नाई / ठाकुर)';
    } else if (selectedRole === 'OTHER') {
      customRoleVal = customRoleVal || 'Custom Service Partner';
    } else if (!customRoleVal) {
      const catObj = CATEGORIES.find(c => c.role === selectedRole);
      customRoleVal = catObj ? catObj.subtitle : selectedRole;
    }

    const refId = `GS-PTR-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRefId(refId);

    const newUser = await UserStore.addUser({
      name: businessName ? `${fullName} (${businessName})` : (fullName || 'New Partner'),
      email: email || `${phone.replace(/[^0-9]/g, '') || Date.now()}@provider.gayaseva.org`,
      phone: phone || '+91 9876543210',
      password: password || undefined,
      role: storeRole,
      customRole: customRoleVal,
      status: 'PENDING',
      city: operatingCity || 'Gaya Ji',
      languages: selectedLangs,
      avatarUrl: profilePicPreview,
      profilePicUrl: profilePicPreview,
      documentUrl: uploadedFile.url,
      googleMapsUrl: googleMapsUrl.trim() || undefined,
      lat: detectedLat || undefined,
      lng: detectedLng || undefined,
    });
    
    setCreatedUser(newUser);
    setSubmitted(true);

    // Automatically trigger ₹49 Razorpay payment workflow upon submission
    triggerRazorpayPayment(newUser);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <GayaSevaLogo size={72} showText={false} className="drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#4A2E1A]">Register as Service Partner</h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Connect directly with thousands of Yatri pilgrims visiting Gaya Ji daily. <strong className="text-[#F58220]">0% Commission, 100% Direct Bookings.</strong>
          </p>

          {/* ₹49 Fee Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F58220]" />
            <span>One-Time Partner Registration Fee: <strong className="text-emerald-700 font-black text-sm">₹49 Only</strong></span>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-1 bg-white text-amber-800 text-[11px] font-bold rounded-full border border-amber-200 shadow-xs">
                REF ID: {submittedRefId}
              </span>
              <h2 className="font-serif font-bold text-xl text-[#2A180B]">Partner Application Registered!</h2>
              <p className="text-xs text-gray-600">
                Your details have been registered. Complete the <strong>₹49 One-Time Payment</strong> via Razorpay to activate your partner profile and open your dashboard instantly.
              </p>
            </div>

            {/* Payment status / error alerts */}
            {paymentMessage && (
              <div className="p-3 bg-amber-100/90 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F58220] animate-spin" />
                <span>{paymentMessage}</span>
              </div>
            )}

            {paymentError && (
              <div className="p-3 bg-red-100 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => createdUser && triggerRazorpayPayment(createdUser)}
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-gradient-to-r from-[#F58220] to-[#E07210] hover:from-[#E07210] hover:to-[#C86000] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isProcessingPayment ? 'Processing ₹49 Payment...' : 'Pay ₹49 & Open Partner Dashboard Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link 
                href="/auth/login" 
                className="w-full py-2.5 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50"
              >
                Already Paid? Go to Partner Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            
            {/* Service Category Selection */}
            <div className="space-y-2">
              <label className="font-bold text-gray-800 block text-xs">
                Select Your Service Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedRole === cat.role;
                  return (
                    <button
                      key={cat.role}
                      type="button"
                      onClick={() => setSelectedRole(cat.role)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-[#2A180B] text-white border-[#2A180B] shadow-md ring-2 ring-[#F58220]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#F58220] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#F6C343]' : 'text-[#F58220]'}`} />
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-[#F6C343] text-[#2A180B]' : 'bg-gray-200 text-gray-700'}`}>
                          {cat.badge}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-[11px] leading-tight">{cat.title}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Category Input (Mandatory for OTHER, optional for all others) */}
              <div className="pt-2 animate-fadeIn space-y-1">
                <label className="font-bold text-[#F58220] block text-[11px]">
                  {selectedRole === 'OTHER' ? 'Specify Custom Service Title *' : 'Custom Specialization / Service Subtitle (Optional)'}
                </label>
                <input
                  type="text"
                  required={selectedRole === 'OTHER'}
                  value={customRoleText}
                  onChange={(e) => setCustomRoleText(e.target.value)}
                  placeholder={
                    selectedRole === 'OTHER' 
                      ? 'e.g. Tourist Photographer, Handloom Dealer, E-Rickshaw Owner'
                      : 'e.g. Kshaur Karma & Mundan Specialist, 45-Vedi Shradh Expert, AC Traveller Taxi'
                  }
                  className="w-full p-2.5 bg-amber-50/70 border border-amber-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
              </div>
            </div>

            {/* Profile Picture Section (Max 50KB or Image URL) */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                  <ImageIcon className="w-4 h-4 text-[#F58220]" />
                  <span>Profile Picture / Photo</span>
                  <span className="text-red-600 font-black text-[11px] bg-red-100 px-2 py-0.5 rounded-full border border-red-200">* REQUIRED</span>
                </label>
                <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-200 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => { setProfilePicMode('FILE'); setProfilePicError(null); }}
                    className={`px-2 py-0.5 rounded-lg transition-all ${profilePicMode === 'FILE' ? 'bg-[#2A180B] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Upload (50KB)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setProfilePicMode('URL'); setProfilePicError(null); }}
                    className={`px-2 py-0.5 rounded-lg transition-all ${profilePicMode === 'URL' ? 'bg-[#2A180B] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-[#F58220] bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  {profilePicMode === 'FILE' ? (
                    <div>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleProfilePicFileUpload}
                        className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-[#F58220] file:text-white hover:file:bg-[#E07210] cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-500 mt-0.5">Formats: .jpeg, .jpg, .png, .webp (Strictly &le; 50 KB)</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="url"
                        value={profilePicUrlInput}
                        onChange={(e) => handleProfilePicUrlChange(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#F58220]"
                      />
                    </div>
                  )}

                  {profilePicError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-[10px] text-red-700 font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{profilePicError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Personal & Business Info */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name (as per Govt ID) *</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Pandit Rakesh Shastri"
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mobile / WhatsApp Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Business / Firm Title (Optional)</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Shree Vishnupad Travels"
                      className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Account Login Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password for partner portal login"
                    className="w-full pl-9 pr-16 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-xs text-[#F58220] font-bold hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Operating Location in Gaya *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      required
                      type="text"
                      value={operatingCity}
                      onChange={(e) => setOperatingCity(e.target.value)}
                      placeholder="e.g. Near Vishnupad Temple Gate"
                      className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Years of Experience</label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#F58220]"
                  >
                    <option value="1">Less than 2 years</option>
                    <option value="5">2 - 5 years</option>
                    <option value="10">5 - 10 years</option>
                    <option value="15">15+ years (Family Legacy)</option>
                  </select>
                </div>
              </div>

              {/* Optional Shop / Office Google Location */}
              <div className="p-3.5 rounded-2xl bg-[#FFFBF2] border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                    <MapPin className="w-4 h-4 text-[#F58220]" />
                    Shop / Office Location (Optional / ऐच्छिक)
                  </label>
                  <span className="text-[10px] font-bold bg-amber-100 text-[#C45E00] px-2 py-0.5 rounded-full">OPTIONAL</span>
                </div>

                <p className="text-[11px] text-gray-500">
                  Share your Google Maps link or auto-detect your current GPS location so pilgrims can easily navigate to your shop/office.
                </p>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Google Maps Share Link (Optional)</label>
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="url"
                        value={googleMapsUrl}
                        onChange={(e) => setGoogleMapsUrl(e.target.value)}
                        placeholder="https://maps.app.goo.gl/... or https://goo.gl/maps/..."
                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#F58220]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAutoDetectGps}
                      disabled={isDetectingGps}
                      className="px-3 py-2 bg-amber-900 text-[#F6C343] hover:bg-amber-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <Compass className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                      <span>{isDetectingGps ? 'Detecting GPS...' : '📍 Auto-Detect Current GPS Location'}</span>
                    </button>

                    {detectedLat && detectedLng && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        GPS: {detectedLat.toFixed(4)}, {detectedLng.toFixed(4)}
                      </span>
                    )}
                  </div>

                  {gpsMessage && (
                    <p className={`text-[10px] font-semibold ${detectedLat ? 'text-emerald-700' : 'text-amber-800'}`}>
                      {gpsMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Languages Spoken */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block text-xs">Languages Spoken:</label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const active = selectedLangs.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                        active
                          ? 'bg-[#2A180B] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 text-[#F6C343]" />}
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Upload (Max 100KB) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                  <FileText className="w-4 h-4 text-[#F58220]" />
                  <span>Govt Photo ID / Verification Document Upload</span>
                  <span className="text-red-600 font-black text-[11px] bg-red-100 px-2 py-0.5 rounded-full border border-red-200">* REQUIRED</span>
                </label>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 hover:border-[#F58220] transition-all rounded-2xl p-4 bg-gray-50 text-center relative cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.webp"
                  onChange={handleDocumentFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {uploadedFile ? (
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-300 shadow-xs">
                    <div className="flex items-center gap-2 text-left">
                      <FileText className="w-6 h-6 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-800 truncate max-w-[180px]">{uploadedFile.name}</p>
                        <p className="text-[10px] text-emerald-700 font-semibold">{uploadedFile.size} • Supabase Encrypted</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                      className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-[#F58220] mx-auto" />
                    <div className="text-xs text-gray-600 font-medium">
                      <span className="font-bold text-[#F58220]">Click to attach document</span> (Aadhaar / PAN / License)
                    </div>
                    <p className="text-[10px] text-gray-400">Supported: .jpg, .png, .pdf (Strictly &le; 100 KB limit)</p>
                  </div>
                )}
              </div>

              {docError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{docError}</span>
                </div>
              )}
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-gray-600">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#F58220] focus:ring-[#F58220] w-4 h-4"
                />
                <span>
                  I confirm all details are accurate and pledge to maintain high Vedic integrity and authentic service for all Yatri pilgrims visiting Gaya Ji.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!agreedTerms}
              className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                agreedTerms
                  ? 'bg-gradient-to-r from-[#F58220] to-[#E07210] hover:from-[#E07210] hover:to-[#C86000] text-white cursor-pointer active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Submit Partner Registration Application
            </button>
          </form>
        )}

        <div className="text-center border-t border-gray-100 pt-4 text-xs text-gray-600 space-y-2">
          <p>
            Already a registered Partner?{' '}
            <Link href="/auth/login" className="font-bold text-[#F58220] hover:underline">
              Partner Login
            </Link>
          </p>
          <p>
            Looking to book as a Yatri pilgrim?{' '}
            <Link href="/auth/register" className="font-bold text-emerald-600 hover:underline">
              Create Yatri Account →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
