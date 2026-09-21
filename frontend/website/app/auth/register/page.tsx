'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCheck, ShieldCheck, ArrowRight, User, Phone, Mail, MapPin, Eye, EyeOff, AlertCircle, CheckCircle2, HeartHandshake } from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore } from '@/lib/userStore';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('कृपया नाम दर्ज करें / Please enter your name');
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
      setError('यह मोबाइल नंबर पहले से पंजीकृत है / Phone number already registered');
      return;
    }

    const newUser = UserStore.addUser({
      name,
      email: email || `${phone.replace(/\s+/g, '')}@gayaseva.org`,
      phone,
      password,
      role: 'PILGRIM',
      status: 'VERIFIED',
      city: city || 'Gaya Ji',
    });

    localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(newUser));
    setSuccess(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <GayaSevaLogo size={72} showText={false} className="drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#4A2E1A]">Create User / Yatri Account</h1>
          <p className="text-xs text-gray-500">
            Register as a User / Yatri pilgrim to book Pind Daan pujas, Pick & Drop cabs, and Dharamshala stays in Gaya Ji.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>यूजर / यात्री खाता सफलता पूर्वक बनाया गया! Redirecting to home...</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunita Banerjee"
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Mobile Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Email Address (Optional)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yatri@example.com"
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Home City / Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kolkata / Patna / Varanasi"
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Create Password *</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#F58220] to-[#E07210] hover:from-[#E07210] hover:to-[#C86000] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Create User / Yatri Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center border-t border-gray-100 pt-4 text-xs text-gray-600 space-y-2">
          <p>
            Already have a User / Yatri account?{' '}
            <Link href="/auth/login" className="font-bold text-[#F58220] hover:underline">
              Log In
            </Link>
          </p>
          <p>
            Service Provider (Pandit, Driver, Hotel)?{' '}
            <Link href="/provider/register" className="font-bold text-emerald-600 hover:underline">
              Register as Service Partner →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

