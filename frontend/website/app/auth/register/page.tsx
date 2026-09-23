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
  HeartHandshake,
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
  Building2
} from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore } from '@/lib/userStore';

type AccountType = 'PILGRIM' | 'PROVIDER';

type ProviderCategory = 
  | 'PANDIT' 
  | 'HOTEL' 
  | 'DRIVER' 
  | 'AUTO' 
  | 'GUIDE' 
  | 'FOOD' 
  | 'BARBER' 
  | 'SHOP' 
  | 'HEALTHCARE' 
  | 'PHOTOGRAPHY' 
  | 'OTHER';

interface ProviderCategoryOption {
  id: ProviderCategory;
  role: 'PANDIT' | 'BARBER' | 'DRIVER' | 'AUTO' | 'HOTEL' | 'SHOP' | 'GUIDE' | 'FOOD' | 'HEALTHCARE' | 'PHOTOGRAPHY' | 'OTHER';
  labelHi: string;
  labelEn: string;
  icon: React.ElementType;
  emoji: string;
}

const PROVIDER_CATEGORIES: ProviderCategoryOption[] = [
  { id: 'PANDIT', role: 'PANDIT', labelHi: 'पंडित / पुरोहित (पिंडदान एवं पूजा)', labelEn: 'Pandit & Purohit', icon: Flame, emoji: '🕉️' },
  { id: 'HOTEL', role: 'HOTEL', labelHi: 'होटल / धर्मशाला / गेस्ट हाउस', labelEn: 'Hotel & Dharamshala', icon: Hotel, emoji: '🏨' },
  { id: 'DRIVER', role: 'DRIVER', labelHi: 'टैक्सी / कैब ड्राइवर', labelEn: 'Taxi & Cab Driver', icon: Car, emoji: '🚕' },
  { id: 'AUTO', role: 'AUTO', labelHi: 'ई-रिक्शा / ऑटो ड्राइवर', labelEn: 'E-Rickshaw & Auto', icon: Bike, emoji: '🛺' },
  { id: 'GUIDE', role: 'GUIDE', labelHi: 'टूर गाइड / पंडा जी', labelEn: 'Tour Guide & Panda', icon: Compass, emoji: '🧑‍🏫' },
  { id: 'FOOD', role: 'FOOD', labelHi: 'सात्विक रेस्टोरेंट / भोजन', labelEn: 'Satvik Food & Restaurant', icon: UtensilsCrossed, emoji: '🍛' },
  { id: 'BARBER', role: 'BARBER', labelHi: 'नाई / ठाकुर (मुंडन संस्कार)', labelEn: 'Barber (Mundan Sanskar)', icon: Scissors, emoji: '💈' },
  { id: 'SHOP', role: 'SHOP', labelHi: 'पूजा सामग्री / स्थानीय दुकान', labelEn: 'Puja Kit & Local Shop', icon: ShoppingBag, emoji: '🛍️' },
  { id: 'HEALTHCARE', role: 'HEALTHCARE', labelHi: 'स्वास्थ्य / क्लिनिक / मेडिकल', labelEn: 'Healthcare & Medical', icon: Stethoscope, emoji: '🏥' },
  { id: 'PHOTOGRAPHY', role: 'PHOTOGRAPHY', labelHi: 'तीर्थ फोटोग्राफी / मीडिया', labelEn: 'Pilgrimage Photography', icon: Camera, emoji: '📸' },
  { id: 'OTHER', role: 'OTHER', labelHi: 'अन्य सेवाएं (लॉन्ड्री / रिपेयर आदि)', labelEn: 'Other Services', icon: Sparkles, emoji: '🧺' },
];

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

  // Provider Specific Form State
  const [providerCategory, setProviderCategory] = useState<ProviderCategory>('PANDIT');
  const [businessName, setBusinessName] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');

  // UI Status State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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

    if (accountType === 'PROVIDER' && !businessName.trim()) {
      setError('कृपया सेवा / दुकान / पंडित जी का नाम दर्ज करें / Please enter business or service name');
      return;
    }

    const existingUser = UserStore.findUserByIdentifier(phone);
    if (existingUser) {
      setError('यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉग इन करें / Phone number already registered');
      return;
    }

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
      setSuccessMessage('यूजर / यात्री खाता सफलता पूर्वक बनाया गया! Dashboard पर रीडायरेक्ट किया जा रहा है...');
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1400);

    } else {
      // Create Service Provider Account & Launch ₹49 Razorpay Payment Workflow
      const selectedCategoryObj = PROVIDER_CATEGORIES.find(c => c.id === providerCategory) || PROVIDER_CATEGORIES[0];
      
      const newProvider = await UserStore.addUser({
        name: businessName ? `${businessName} (${name})` : name,
        email: email || `${phone.replace(/\s+/g, '')}@provider.gayaseva.org`,
        phone,
        password,
        role: selectedCategoryObj.role,
        customRole: selectedCategoryObj.labelHi,
        status: 'PENDING',
        city: serviceAddress || city || 'Gaya Ji',
        availabilityStatus: 'AVAILABLE',
      });

      try {
        setSuccessMessage('Razorpay ₹49 Registration Order Created. Proceeding with Payment...');
        
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

          // Dynamically load Razorpay checkout script if needed
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
            description: `One-Time Registration Charge ₹${orderData.amount}`,
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
                setSuccessMessage(`✅ ₹49 Payment Successful! Partner Account Verified. Opening Dashboard...`);
                setSuccess(true);

                const roleLower = selectedCategoryObj.role.toLowerCase();
                let dashUrl = `/${roleLower}/dashboard`;
                if (selectedCategoryObj.role === 'PANDIT') dashUrl = '/pandit/dashboard';
                else if (selectedCategoryObj.role === 'DRIVER' || selectedCategoryObj.role === 'AUTO') dashUrl = '/driver/dashboard';
                else if (selectedCategoryObj.role === 'HOTEL') dashUrl = '/hotel/dashboard';

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
            // Fallback for non-popup environments
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
              setSuccessMessage(`✅ ₹49 Payment Verified! Partner Account Verified. Opening Dashboard...`);
              setSuccess(true);

              const roleLower = selectedCategoryObj.role.toLowerCase();
              let dashUrl = `/${roleLower}/dashboard`;
              if (selectedCategoryObj.role === 'PANDIT') dashUrl = '/pandit/dashboard';
              else if (selectedCategoryObj.role === 'DRIVER' || selectedCategoryObj.role === 'AUTO') dashUrl = '/driver/dashboard';
              else if (selectedCategoryObj.role === 'HOTEL') dashUrl = '/hotel/dashboard';

              setTimeout(() => {
                router.push(dashUrl);
              }, 1200);
            }
          }
        }
      } catch (err: any) {
        console.error('Payment order failed:', err);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <GayaSevaLogo size={68} showText={false} className="drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-sans font-extrabold text-[#1C0D02]">
            Create GayaSeva Account
          </h1>
          <p className="text-xs font-semibold text-slate-600 max-w-sm mx-auto">
            Choose your account type below to register as a Yatri or register directly as a Service Provider.
          </p>
        </div>

        {/* Account Type Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setAccountType('PILGRIM');
              setError('');
            }}
            className={`py-3 px-3 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              accountType === 'PILGRIM'
                ? 'bg-[#1C0D02] text-white shadow-md ring-2 ring-[#F58220]'
                : 'bg-transparent text-slate-700 hover:bg-slate-200/60'
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
                ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-400'
                : 'bg-transparent text-slate-700 hover:bg-slate-200/60'
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
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4 text-xs font-bold text-slate-700">
          
          {/* Provider Specific Category Selection */}
          {accountType === 'PROVIDER' && (
            <div className="space-y-2 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
              <label className="font-extrabold text-[#0F172A] flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" /> Select Your Service Category (सेवा श्रेणी का चयन करें) *
              </label>
              
              <select
                value={providerCategory}
                onChange={(e) => setProviderCategory(e.target.value as ProviderCategory)}
                className="w-full py-3 px-3 bg-white border border-emerald-300 rounded-xl text-xs font-extrabold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PROVIDER_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.labelHi} ({cat.labelEn})
                  </option>
                ))}
              </select>

              <p className="text-[11px] text-emerald-800 font-semibold">
                (Pandits, Taxi Cabs, Hotels, Tour Guides, Barbers, Satvik Food &amp; Local Shops can offer services directly).
              </p>
            </div>
          )}

          {/* Business / Service Name (Only for Provider) */}
          {accountType === 'PROVIDER' && (
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">
                Business / Purohit / Service Name * (सेवा या व्यापार का नाम)
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Pandit Ramesh Shastri / Gaya Express Taxi / Bodh Gaya Guest House"
                  className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="font-extrabold text-slate-800 block mb-1">
              {accountType === 'PROVIDER' ? 'Contact Person Full Name * (आपका नाम)' : 'Full Name * (आपका नाम)'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Chandra Sharma"
                className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
            </div>
          </div>

          {/* Mobile Phone Number */}
          <div>
            <label className="font-extrabold text-slate-800 block mb-1">Mobile Phone Number * (मोबाइल नंबर)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
            </div>
          </div>

          {/* Location / Address */}
          <div>
            <label className="font-extrabold text-slate-800 block mb-1">
              {accountType === 'PROVIDER' ? 'Service Address in Gaya * (सेवा स्थान / पता)' : 'Home City / State (शहर)'}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={accountType === 'PROVIDER' ? serviceAddress : city}
                onChange={(e) => accountType === 'PROVIDER' ? setServiceAddress(e.target.value) : setCity(e.target.value)}
                placeholder={accountType === 'PROVIDER' ? 'e.g. Chand Chaura / Platform 1 Exit, Gaya Junction' : 'e.g. Kolkata / Patna / Varanasi'}
                className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
            </div>
          </div>

          {/* Email Address (Optional) */}
          <div>
            <label className="font-extrabold text-slate-800 block mb-1">Email Address (Optional / ईमेल)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-extrabold text-slate-800 block mb-1">Create Password * (पासवर्ड दर्ज करें)</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3.5 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
              accountType === 'PROVIDER'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800'
                : 'bg-gradient-to-r from-[#F58220] to-[#E07210] hover:from-[#E07210] hover:to-[#C86000]'
            }`}
          >
            <span>
              {accountType === 'PROVIDER' ? 'Register as Service Partner' : 'Create User / Yatri Account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-4 text-xs font-bold text-slate-600 space-y-2">
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="font-extrabold text-[#F58220] hover:underline">
              Log In Here →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}


