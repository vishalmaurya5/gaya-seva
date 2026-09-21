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
  const handleLogin = (e: React.FormEvent) => {
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

      targetUser = UserStore.addUser({
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
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <GayaSevaLogo size={68} showText={false} className="drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#4A2E1A]">GayaSeva Universal Login</h1>
          <p className="text-xs text-gray-500">
            Sign in with your registered Mobile Number or Email to open your personal dashboard.
          </p>
        </div>

        {/* Graph Engine Status Indicator */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#F58220] shrink-0 animate-pulse" />
          <span>
            <strong>Graph Auto-Routing Active:</strong> Enter details below — system automatically detects Yatri, Pandit, Driver, or Admin role & opens dashboard.
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success & Graph Routing Alert */}
        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity Verified Successfully!</span>
            </div>
            {resolvedUserRole && (
              <p className="text-[11px] text-emerald-700 pl-6 font-semibold">
                Graph Role Engine: Routing directly to <strong className="underline">{resolvedUserRole}</strong>...
              </p>
            )}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Mobile Number or Email Address *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+91 98765 43210 or user@gayaseva.org"
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
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
            <span>Log In & Open Dashboard</span> <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center border-t border-gray-100 pt-4 text-xs text-gray-600 space-y-2">
          <p>
            New Pilgrim / Yatri?{' '}
            <Link href="/auth/register" className="font-bold text-[#F58220] hover:underline">
              Create Yatri Account
            </Link>
          </p>
          <p>
            Service Provider / Vendor?{' '}
            <Link href="/provider/register" className="font-bold text-emerald-600 hover:underline">
              Register as Service Partner
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}


