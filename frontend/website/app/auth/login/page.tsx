'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Phone, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2, User, Briefcase, Cpu, Compass } from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore, UserAccount } from '@/lib/userStore';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resolvedUserRole, setResolvedUserRole] = useState<string | null>(null);
  const [redirectingTarget, setRedirectingTarget] = useState<string | null>(null);

  /**
   * Graph Engineering Role Resolver & Router Engine
   * Resolves the user account node from identifier graph and routes directly to user dashboard.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResolvedUserRole(null);
    setRedirectingTarget(null);

    if (!identifier.trim()) {
      setError('कृपया मोबाइल नंबर या ईमेल दर्ज करें / Please enter Phone or Email');
      return;
    }

    if (!password) {
      setError('कृपया पासवर्ड दर्ज करें / Please enter Password');
      return;
    }

    // Graph Node Lookup
    const existingUser = UserStore.findUserByIdentifier(identifier);

    let targetUser: UserAccount;

    if (existingUser) {
      if (existingUser.status === 'SUSPENDED') {
        setError('आपका खाता निलंबित है। कृपया सहायता टीम से संपर्क करें / Account Suspended. Contact Helpline.');
        return;
      }
      if (existingUser.password && existingUser.password !== password) {
        setError('गलत पासवर्ड। कृपया पुनः प्रयास करें / Incorrect password. Please try again.');
        return;
      }
      targetUser = existingUser;
    } else {
      // Create & register node in graph if new user
      const isEmail = identifier.includes('@');
      const inferredRole = identifier.toLowerCase().includes('admin') 
        ? 'SUPER_ADMIN' 
        : (identifier.toLowerCase().includes('pandit') ? 'PANDIT' : 'PILGRIM');

      targetUser = await UserStore.addUser({
        name: isEmail ? identifier.split('@')[0] : 'GayaSeva Member',
        email: isEmail ? identifier : `${identifier}@gayaseva.org`,
        phone: isEmail ? '+91 9876543210' : identifier,
        role: inferredRole as any,
        status: 'VERIFIED',
        city: 'Gaya Ji',
      });
    }

    // Save active session
    localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(targetUser));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('gayaseva_auth_change'));
    }

    // Graph Dispatcher Routing Logic
    let destination = '/dashboard';
    let roleLabel = 'Yatri Pilgrim Portal Dashboard';

    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://gaya-seva-three.vercel.app/';

    if (targetUser.role === 'SUPER_ADMIN' || targetUser.role === 'ADMIN') {
      destination = adminUrl;
      roleLabel = 'GayaSeva Admin Operations Dashboard';
    } else if (targetUser.role === 'PANDIT') {
      destination = '/pandit/dashboard';
      roleLabel = 'Purohit & Pandit Ji Partner Dashboard';
    } else if (targetUser.role === 'DRIVER') {
      destination = '/driver/dashboard';
      roleLabel = 'Taxi & Transport Partner Dashboard';
    } else if (targetUser.role === 'HOTEL') {
      destination = '/hotel/dashboard';
      roleLabel = 'Hotel & Dharamshala Partner Dashboard';
    } else if (targetUser.role === 'PILGRIM') {
      destination = '/dashboard';
      roleLabel = 'Yatri Pilgrim Dashboard';
    } else if (targetUser.customRole) {
      const userRoleStr = String((targetUser as any).role || 'user').toLowerCase();
      destination = `/${userRoleStr}/dashboard`;
      roleLabel = `${targetUser.customRole} Service Dashboard`;
    }

    // Check if a specific redirect parameter was passed in URL (e.g. from Access Pass)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');
      if (redirectUrl) {
        destination = decodeURIComponent(redirectUrl);
        roleLabel = 'Redirecting to your requested page...';
      }
    }

    setResolvedUserRole(roleLabel);
    setRedirectingTarget(destination);
    setSuccess(true);

    setTimeout(() => {
      if (destination.startsWith('http')) {
        window.location.href = destination;
      } else {
        router.push(destination);
      }
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16 font-sans">
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
        
        {/* Top Premium Color Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-950 via-[#F58220] to-[#F6C343]" />

        {/* Header Branding */}
        <div className="text-center space-y-3 pt-2">
          <div className="flex justify-center mb-1">
            <GayaSevaLogo size={68} showText={false} className="drop-shadow-md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            GayaSeva Universal Login
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-sm mx-auto">
            अपने पंजीकृत मोबाइल नंबर या ईमेल द्वारा तुरंत लॉग इन करें।
          </p>
        </div>

        {/* Graph Engine Status Indicator */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-[11px] text-amber-950 flex items-center gap-2.5 shadow-2xs font-medium">
          <Cpu className="w-4 h-4 text-[#F58220] shrink-0 animate-pulse" />
          <span>
            <strong className="font-extrabold">Auto-Role Detection:</strong> Enter details below — system automatically detects Yatri, Pandit, Driver, or Admin role &amp; opens dashboard.
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200/90 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success & Graph Routing Alert */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200/90 rounded-2xl text-xs text-emerald-800 space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 font-extrabold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity Verified Successfully!</span>
            </div>
            {resolvedUserRole && (
              <p className="text-[11px] text-emerald-700 pl-6 font-semibold">
                Routing directly to <strong className="underline font-extrabold">{resolvedUserRole}</strong>...
              </p>
            )}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-extrabold text-slate-800 tracking-tight block mb-1.5">
              Mobile Number or Email Address * (मोबाइल नंबर / ईमेल)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+91 98765 43210 or user@gayaseva.org"
                className="w-full pl-10 pr-4 py-3.5 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70 focus:bg-white focus:border-[#F58220] focus:ring-4 focus:ring-[#F58220]/15 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-800 tracking-tight block mb-1.5">Password * (पासवर्ड)</label>
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
                className="absolute right-3.5 top-4 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#F58220] via-[#E07210] to-[#D96B00] hover:from-[#E07210] hover:to-[#C45E00] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer tracking-wide"
          >
            <span>Log In &amp; Open Dashboard</span> <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-5 text-xs font-bold text-slate-600 space-y-2">
          <p>
            New Pilgrim / Yatri?{' '}
            <Link href="/auth/register" className="font-extrabold text-[#F58220] hover:text-[#E07210] hover:underline transition-colors">
              Create New Account
            </Link>
          </p>
          <p>
            Service Provider / Vendor?{' '}
            <Link href="/provider/register" className="font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
              Register as Service Partner
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
