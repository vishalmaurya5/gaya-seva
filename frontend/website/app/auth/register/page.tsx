'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Briefcase,
  Flame,
  Hotel,
  Car,
  Bike,
  Compass,
  UtensilsCrossed,
  Stethoscope,
  ShoppingBag,
  Camera,
  Scissors,
  Sparkles,
  Building2,
  Lock,
  Upload,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  ShieldAlert,
  Check,
  X,
  Bus
} from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore, UserAccount } from '@/lib/userStore';
import { 
  validateUploadFile, 
  validateImageUrl, 
  uploadToSupabaseBucket 
} from '@/lib/supabaseClient';

type AccountType = 'PILGRIM' | 'PROVIDER';

type ProviderRoleCategory = 
  | 'PANDIT' 
  | 'HOTEL' 
  | 'DRIVER' 
  | 'AUTO' 
  | 'TRAVEL'
  | 'GUIDE' 
  | 'FOOD' 
  | 'BARBER' 
  | 'SHOP' 
  | 'HEALTHCARE' 
  | 'PHOTOGRAPHY' 
  | 'OTHER';

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

export default function RegisterPage() {
  const router = useRouter();

  // Tab State: Pilgrim vs Service Provider
  const [accountType, setAccountType] = useState<AccountType>('PILGRIM');

  // Common Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Provider Specific State
  const [selectedRole, setSelectedRole] = useState<ProviderRoleCategory>('PANDIT');
  const [customRoleText, setCustomRoleText] = useState('');
  const [specialization, setSpecialization] = useState('Pind Daan, Tripindi Shradh & Vedic Karmakand');
  const [businessName, setBusinessName] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['Hindi', 'English']);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Profile Picture State (Optional / 50KB or URL)
  const [profilePicMode, setProfilePicMode] = useState<'FILE' | 'URL'>('FILE');
  const [profilePicUrlInput, setProfilePicUrlInput] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [profilePicError, setProfilePicError] = useState<string | null>(null);
  const [isUploadingPic, setIsUploadingPic] = useState(false);

  // Document State (Required for Provider / 100KB Limit)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; url?: string } | null>(null);
  const [docError, setDocError] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Shop / Location GPS State
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [detectedLat, setDetectedLat] = useState<number | null>(null);
  const [detectedLng, setDetectedLng] = useState<number | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // UI Status State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDocError(null);
    setProfilePicError(null);

    if (!name.trim()) {
      setError('कृपया अपना नाम दर्ज करें / Please enter full name');
      return;
    }
    if (!phone.trim()) {
      setError('कृपया मोबाइल नंबर दर्ज करें / Please enter phone number');
      return;
    }
    if (!password || password.length < 4) {
      setError('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए / Password must be at least 4 characters');
      return;
    }

    const existingUser = UserStore.findUserByIdentifier(phone);
    if (existingUser) {
      setError('यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉग इन करें / Phone number already registered');
      return;
    }

    setIsSubmitting(true);

    if (accountType === 'PILGRIM') {
      // Create Yatri Account
      const newUser = await UserStore.addUser({
        name,
        email: email || `${phone.replace(/\s+/g, '')}@gayaseva.org`,
        phone,
        password,
        role: 'PILGRIM',
        status: 'VERIFIED',
        city: city || 'Gaya Ji',
      });

      localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(newUser));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('gayaseva_auth_change'));
      }
      setSuccessMessage('यूजर / यात्री खाता सफलता पूर्वक बनाया गया! रीडायरेक्ट किया जा रहा है...');
      setSuccess(true);
      setTimeout(() => {
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const target = urlParams?.get('redirect') || '/dashboard';
        router.push(target);
      }, 1400);

    } else {
      // Service Provider Registration
      if (!businessName.trim()) {
        setError('कृपया सेवा / व्यापार / प्रतिष्ठान का नाम दर्ज करें / Business title is required');
        setIsSubmitting(false);
        return;
      }

      if (!uploadedFile || !uploadedFile.url) {
        setDocError('कृपया अपना पहचान पत्र / सरकारी आधार दस्तावेज अपलोड करें / Govt ID document upload is REQUIRED for verification');
        setIsSubmitting(false);
        return;
      }

      let customRoleVal = customRoleText.trim();
      if (selectedRole === 'BARBER') {
        customRoleVal = customRoleVal || 'Kshaur Karma & Mundan Specialist (नाई / ठाकुर)';
      } else if (selectedRole === 'OTHER') {
        customRoleVal = customRoleVal || 'Custom Service Partner';
      } else if (!customRoleVal) {
        const catObj = CATEGORIES.find(c => c.role === selectedRole);
        customRoleVal = catObj ? catObj.subtitle : selectedRole;
      }

      const newProvider = await UserStore.addUser({
        name: businessName ? `${name} (${businessName})` : name,
        email: email || `${phone.replace(/[^0-9]/g, '')}@provider.gayaseva.org`,
        phone,
        password,
        role: selectedRole,
        customRole: selectedRole === 'PANDIT' && specialization ? specialization : customRoleVal,
        specialization: selectedRole === 'PANDIT' ? specialization : undefined,
        status: 'PENDING',
        city: serviceAddress || city || 'Gaya Ji',
        languages: selectedLangs,
        avatarUrl: profilePicPreview || undefined,
        profilePicUrl: profilePicPreview || undefined,
        documentUrl: uploadedFile.url,
        googleMapsUrl: googleMapsUrl.trim() || undefined,
        lat: detectedLat || undefined,
        lng: detectedLng || undefined,
        availabilityStatus: 'AVAILABLE',
      });

      try {
        setSuccessMessage('Razorpay ₹49 Onboarding Fee Order Created. Opening payment window...');
        
        const res = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: newProvider.id,
            purpose: 'PROVIDER_REGISTRATION',
          }),
        });

        if (res.ok) {
          const orderData = await res.json();

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
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id || orderData.orderId,
                  razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                  razorpay_signature: response.razorpay_signature || 'test_signature',
                  userId: newProvider.id,
                  purpose: 'PROVIDER_REGISTRATION',
                }),
              });

              if (verifyRes.ok) {
                const verifiedUser = await UserStore.updateUser(newProvider.id, { status: 'VERIFIED' }) || { ...newProvider, status: 'VERIFIED' };
                localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(verifiedUser));
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('storage'));
                  window.dispatchEvent(new Event('gayaseva_auth_change'));
                }
                setSuccessMessage(`✅ ₹49 Payment Verified! Partner Account Activated. Redirecting...`);
                setSuccess(true);

                const roleLower = selectedRole.toLowerCase();
                let dashUrl = `/${roleLower}/dashboard`;
                if (selectedRole === 'PANDIT') dashUrl = '/pandit/dashboard';
                else if (selectedRole === 'DRIVER' || selectedRole === 'AUTO') dashUrl = '/driver/dashboard';
                else if (selectedRole === 'HOTEL') dashUrl = '/hotel/dashboard';

                setTimeout(() => {
                  router.push(dashUrl);
                }, 1200);
              }
            },
            prefill: {
              name,
              email: newProvider.email,
              contact: phone,
            },
            theme: { color: '#F58220' },
          };

          if (typeof (window as any).Razorpay !== 'undefined') {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          } else {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: orderData.orderId,
                razorpay_payment_id: `pay_mock_${Date.now()}`,
                razorpay_signature: 'test_signature',
                userId: newProvider.id,
                purpose: 'PROVIDER_REGISTRATION',
              }),
            });

            if (verifyRes.ok) {
              const verifiedUser = await UserStore.updateUser(newProvider.id, { status: 'VERIFIED' }) || { ...newProvider, status: 'VERIFIED' };
              localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(verifiedUser));
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('storage'));
                window.dispatchEvent(new Event('gayaseva_auth_change'));
              }
              setSuccessMessage(`✅ ₹49 Payment Verified! Partner Account Activated. Redirecting...`);
              setSuccess(true);

              const roleLower = selectedRole.toLowerCase();
              let dashUrl = `/${roleLower}/dashboard`;
              if (selectedRole === 'PANDIT') dashUrl = '/pandit/dashboard';
              else if (selectedRole === 'DRIVER' || selectedRole === 'AUTO') dashUrl = '/driver/dashboard';
              else if (selectedRole === 'HOTEL') dashUrl = '/hotel/dashboard';

              setTimeout(() => {
                router.push(dashUrl);
              }, 1200);
            }
          }
        }
      } catch (err: any) {
        console.error('Payment order failed:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-14 font-sans">
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
        
        {/* Top Premium Color Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-950 via-[#F58220] to-[#F6C343]" />

        {/* Header Branding */}
        <div className="text-center space-y-3 pt-2">
          <div className="flex justify-center mb-1">
            <GayaSevaLogo size={68} showText={false} className="drop-shadow-md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Get Started / Create Account
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto">
            Gaya Ji pilgrimage booking & direct service partner portal. <strong className="text-[#F58220]">0% Commission</strong>.
          </p>
        </div>

        {/* Account Type Selector Tabs */}
        <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setAccountType('PILGRIM');
              setError('');
            }}
            className={`py-3 px-3 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              accountType === 'PILGRIM'
                ? 'bg-[#2A180B] text-white shadow-md border border-amber-500/30'
                : 'bg-transparent text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <span className="flex items-center gap-1.5 text-sm">
              <span>🙏</span>
              <span>Yatri / Pilgrim</span>
            </span>
            <span className={`text-[10px] font-bold ${accountType === 'PILGRIM' ? 'text-amber-300' : 'text-slate-500'}`}>
              यात्री / यूजर खाता
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAccountType('PROVIDER');
              setError('');
            }}
            className={`py-3 px-3 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              accountType === 'PROVIDER'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-400/40'
                : 'bg-transparent text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <span className="flex items-center gap-1.5 text-sm">
              <span>💼</span>
              <span>Service Provider</span>
            </span>
            <span className={`text-[10px] font-bold ${accountType === 'PROVIDER' ? 'text-emerald-200' : 'text-slate-500'}`}>
              सेवा प्रदाता / पार्टनर
            </span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200/90 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200/90 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* PROVIDER SPECIFIC ALL FIELDS */}
          {accountType === 'PROVIDER' && (
            <div className="space-y-5">
              
              {/* Service Category Selection Grid */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-[#0F172A] tracking-tight block">
                  Select Your Service Category * (सेवा श्रेणी चुनें)
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
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#2A180B] text-white border-[#2A180B] shadow-md ring-2 ring-[#F58220]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#F58220] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F6C343]' : 'text-[#F58220]'}`} />
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-[#F6C343] text-[#2A180B]' : 'bg-gray-200 text-gray-700'}`}>
                            {cat.badge}
                          </span>
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight">{cat.title}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Subtitle Input */}
                <div className="pt-1.5 space-y-1">
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

                {/* Pandit Specific Specialization Field */}
                {selectedRole === 'PANDIT' && (
                  <div className="pt-2 animate-fadeIn space-y-2 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[#4A2E1A] flex items-center gap-1.5 text-xs">
                        <Flame className="w-4 h-4 text-[#F58220]" />
                        <span>Pandit Specialization / पूजा एवं कर्मकांड विशेषज्ञता *</span>
                      </label>
                      <span className="text-[10px] font-bold bg-[#F58220] text-white px-2 py-0.5 rounded-full">REQUIRED</span>
                    </div>
                    
                    <p className="text-[11px] text-gray-600 font-medium">
                      Select or type your core Vedic specialties (अपनी मुख्य पूजा विशेषज्ञता चुनें या लिखें):
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        'Pind Daan (पिंडदान)',
                        'Tripindi Shradh (त्रिपिंडी श्राद्ध)',
                        'Narayan Bali (नारायण बलि)',
                        'Kaal Sarp Dosh (कालसर्प दोष)',
                        'Vedic Karmakand (वैदिक कर्मकांड)',
                        'Mundan Sanskar (मुंडन संस्कार)',
                        'Ekoddishta Shradh (एकोद्दिष्ट श्राद्ध)',
                        'Mahalaya Tarpan (महालय तर्पण)'
                      ].map((spec) => {
                        const cleanTag = spec.split(' ')[0];
                        const isActive = specialization.toLowerCase().includes(cleanTag.toLowerCase());
                        return (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => {
                              if (isActive) {
                                const updated = specialization
                                  .split(', ')
                                  .filter(s => !s.toLowerCase().includes(cleanTag.toLowerCase()))
                                  .join(', ');
                                setSpecialization(updated);
                              } else {
                                setSpecialization(specialization ? `${specialization}, ${spec}` : spec);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                              isActive
                                ? 'bg-[#2A180B] text-[#F6C343] border-[#2A180B] shadow-xs'
                                : 'bg-white text-gray-700 border-amber-200 hover:border-[#F58220]'
                            }`}
                          >
                            {isActive ? '✓ ' : '+ '}
                            {spec}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      required
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Pind Daan, Tripindi Shradh, Kaal Sarp Dosh Nivaran"
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                    />
                  </div>
                )}
              </div>

              {/* Profile Photo Section (Explicitly Optional) */}
              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Profile Picture / Photo</span>
                    <span className="text-emerald-700 font-bold text-[11px] bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      (Optional / ऐच्छिक)
                    </span>
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
                  <div className="w-14 h-14 rounded-full border-2 border-emerald-500 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    {profilePicPreview ? (
                      <img src={profilePicPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    {profilePicMode === 'FILE' ? (
                      <div>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleProfilePicFileUpload}
                          className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-500 mt-0.5">Formats: .jpeg, .jpg, .png, .webp (&le; 50 KB limit)</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="url"
                          value={profilePicUrlInput}
                          onChange={(e) => handleProfilePicUrlChange(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-emerald-500"
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

              {/* Business / Service Name */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 tracking-tight block mb-1.5">
                  Business / Purohit / Service Name * (सेवा या व्यापार का नाम)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Pandit Ramesh Shastri / Gaya Express Taxi / Bodh Gaya Guest House"
                    className="w-full pl-10 pr-4 py-3.5 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 transition-all outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Contact Person Name */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 tracking-tight block mb-1.5">
              {accountType === 'PROVIDER' ? 'Contact Person Full Name * (आपका नाम)' : 'Full Name * (आपका नाम)'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Chandra Sharma"
                className="w-full pl-10 pr-4 py-3.5 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70 focus:bg-white focus:border-[#F58220] focus:ring-4 focus:ring-[#F58220]/15 transition-all outline-none"
              />
            </div>
          </div>

          {/* Mobile Phone Number */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 tracking-tight block mb-1.5">Mobile Phone Number * (मोबाइल नंबर)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3.5 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70 focus:bg-white focus:border-[#F58220] focus:ring-4 focus:ring-[#F58220]/15 transition-all outline-none"
              />
            </div>
          </div>

          {/* Location / Address */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 tracking-tight block mb-1.5">
              {accountType === 'PROVIDER' ? 'Service Address in Gaya * (सेवा स्थान / पता)' : 'Home City / State (शहर)'}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              <input
                type="text"
                value={accountType === 'PROVIDER' ? serviceAddress : city}
                onChange={(e) => accountType === 'PROVIDER' ? setServiceAddress(e.target.value) : setCity(e.target.value)}
                placeholder={accountType === 'PROVIDER' ? 'e.g. Chand Chaura / Platform 1 Exit, Gaya Junction' : 'e.g. Kolkata / Patna / Varanasi'}
                className="w-full pl-10 pr-4 py-3.5 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70 focus:bg-white focus:border-[#F58220] focus:ring-4 focus:ring-[#F58220]/15 transition-all outline-none"
              />
            </div>
          </div>

          {/* ADDITIONAL PROVIDER SPECIFIC DETAILS */}
          {accountType === 'PROVIDER' && (
            <div className="space-y-4 pt-1">
              
              {/* Years of Experience */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1.5">Years of Experience (अनुभव)</label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full py-3.5 px-3.5 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70 focus:bg-white focus:border-emerald-600"
                >
                  <option value="1">Less than 2 years</option>
                  <option value="5">2 - 5 years</option>
                  <option value="10">5 - 10 years</option>
                  <option value="15">15+ years (Family Legacy)</option>
                </select>
              </div>

              {/* Languages Spoken */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 block">Languages Spoken (भाषाएं):</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const active = selectedLangs.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                          active
                            ? 'bg-[#2A180B] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5 text-[#F6C343]" />}
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shop / Office Google Location */}
              <div className="p-4 rounded-2xl bg-[#FFFBF2] border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                    <MapPin className="w-4 h-4 text-[#F58220]" />
                    Shop / Office Location (Optional / ऐच्छिक)
                  </label>
                  <span className="text-[10px] font-bold bg-amber-100 text-[#C45E00] px-2 py-0.5 rounded-full">OPTIONAL</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Google Maps Share Link (Optional)</label>
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="url"
                        value={googleMapsUrl}
                        onChange={(e) => setGoogleMapsUrl(e.target.value)}
                        placeholder="https://maps.app.goo.gl/... or https://goo.gl/maps/..."
                        className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:border-[#F58220]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAutoDetectGps}
                      disabled={isDetectingGps}
                      className="px-3.5 py-2 bg-amber-900 text-[#F6C343] hover:bg-amber-800 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
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

              {/* Govt Photo ID Verification Document Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                    <FileText className="w-4 h-4 text-[#F58220]" />
                    <span>Govt Photo ID / Verification Document Upload *</span>
                    <span className="text-red-600 font-extrabold text-[11px] bg-red-100 px-2 py-0.5 rounded-full border border-red-200">* REQUIRED</span>
                  </label>
                </div>
                
                <div className="border-2 border-dashed border-slate-300 hover:border-[#F58220] transition-all rounded-2xl p-4 bg-slate-50 text-center relative cursor-pointer">
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
                          <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{uploadedFile.name}</p>
                          <p className="text-[10px] text-emerald-700 font-semibold">{uploadedFile.size} • Encrypted Upload</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                        className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-[#F58220] mx-auto" />
                      <div className="text-xs text-slate-600 font-medium">
                        <span className="font-bold text-[#F58220]">Click to attach document</span> (Aadhaar / PAN / Voter ID)
                      </div>
                      <p className="text-[10px] text-slate-400">Supported: .jpg, .png, .pdf (&le; 100 KB limit)</p>
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

            </div>
          )}

          {/* Email Address (Optional) */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 tracking-tight block mb-1.5">Email Address (Optional / ईमेल)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3.5 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70 focus:bg-white focus:border-[#F58220] focus:ring-4 focus:ring-[#F58220]/15 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 tracking-tight block mb-1.5">Create Password * (पासवर्ड दर्ज करें)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3.5 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70 focus:bg-white focus:border-[#F58220] focus:ring-4 focus:ring-[#F58220]/15 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms Agreement (For Provider) */}
          {accountType === 'PROVIDER' && (
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] font-semibold text-slate-600">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>
                  I confirm all details are accurate and pledge to maintain high Vedic integrity and authentic service for all Yatri pilgrims visiting Gaya Ji.
                </span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (accountType === 'PROVIDER' && !agreedTerms)}
            className={`w-full py-4 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer tracking-wide ${
              accountType === 'PROVIDER'
                ? (agreedTerms ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800' : 'bg-slate-300 text-slate-500 cursor-not-allowed')
                : 'bg-gradient-to-r from-[#F58220] via-[#E07210] to-[#D96B00] hover:from-[#E07210] hover:to-[#C45E00]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isSubmitting 
                ? 'Processing...' 
                : (accountType === 'PROVIDER' ? 'Submit Partner Registration (Pay ₹49 Fee)' : 'Create User / Yatri Account')
              }
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-5 text-xs font-bold text-slate-600 space-y-2">
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="font-extrabold text-[#F58220] hover:text-[#E07210] hover:underline transition-colors">
              Log In Here →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
