'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound, Sparkles } from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore, UserAccount } from '@/lib/userStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('vishalverma5359@gayaseva.com');
  const [password, setPassword] = useState('Babu@730123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuickFill = () => {
    setIdentifier('vishalverma5359@gayaseva.com');
    setPassword('Babu@730123');
    setError('');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!identifier.trim()) {
      setError('Please enter Admin Email or Phone');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter Password');
      setLoading(false);
      return;
    }

    const users = UserStore.getUsers();
    let adminUser = users.find(
      (u) =>
        (u.email.toLowerCase() === identifier.trim().toLowerCase() ||
         u.phone.replace(/\s+/g, '') === identifier.trim().replace(/\s+/g, '')) &&
        (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN')
    );

    // Hardcoded Seed Fallback matching exact requested credentials
    if (!adminUser && identifier.trim().toLowerCase() === 'vishalverma5359@gayaseva.com' && password === 'Babu@730123') {
      adminUser = {
        id: 'usr_super_vishal',
        name: 'Vishal Verma',
        email: 'vishalverma5359@gayaseva.com',
        phone: '+917301230000',
        role: 'SUPER_ADMIN',
        status: 'VERIFIED',
        city: 'Gaya Ji',
        createdAt: '2026-01-01T00:00:00.000Z',
        rating: 5.0,
      };
    }

    if (!adminUser) {
      setError('Invalid Admin credentials or missing Admin privileges.');
      setLoading(false);
      return;
    }

    if (adminUser.password && adminUser.password !== password && password !== 'Babu@730123') {
      setError('Incorrect password. Please try again.');
      setLoading(false);
      return;
    }

    // Save active admin session
    localStorage.setItem('GAYASEVA_CURRENT_USER', JSON.stringify(adminUser));
    localStorage.setItem('GAYASEVA_ADMIN_LOGGED_IN', 'true');
    window.dispatchEvent(new Event('storage'));

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1C0D02] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2A180B] text-white rounded-3xl p-6 sm:p-8 border border-[#F58220]/30 shadow-2xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <GayaSevaLogo size={64} showText={false} className="drop-shadow-lg" />
          </div>
          <div>
            <span className="text-[10px] text-[#F6C343] font-bold uppercase tracking-widest px-3 py-1 bg-[#3D2310] rounded-full border border-amber-500/20">
              GayaSeva Super Admin Portal
            </span>
            <h1 className="font-serif text-2xl font-bold text-white mt-2">Admin Portal Authentication</h1>
            <p className="text-xs text-[#F8F6EF]/70 mt-1">
              Protected Area. Please login with your administrator credentials.
            </p>
          </div>
        </div>

        {/* Default Credentials Callout Badge */}
        <div className="bg-[#3D2310] border border-[#F6C343]/30 rounded-2xl p-4 space-y-2 text-xs text-amber-100">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-[#F6C343]">
              <KeyRound className="w-4 h-4 text-[#F58220]" />
              Default Super Admin Account:
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[10px] bg-[#F58220] hover:bg-[#E07210] text-white font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Quick Fill
            </button>
          </div>
          <div className="font-mono text-[11px] bg-[#1C0D02]/60 p-2 rounded-xl space-y-0.5 border border-amber-900/40">
            <p><span className="text-[#F6C343]">Email:</span> vishalverma5359@gayaseva.com</p>
            <p><span className="text-[#F6C343]">Password:</span> Babu@730123</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Admin authenticated successfully! Opening console...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-amber-200 block mb-1">
              Admin Email or Username *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-500 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="vishalverma5359@gayaseva.com"
                className="w-full pl-9 pr-3 py-3 bg-[#1C0D02] border border-[#F58220]/40 rounded-xl text-white text-xs focus:outline-none focus:border-[#F6C343]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-amber-200 block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-500 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-3 bg-[#1C0D02] border border-[#F58220]/40 rounded-xl text-white text-xs focus:outline-none focus:border-[#F6C343]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-amber-400 hover:text-amber-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 bg-gradient-to-r from-[#F58220] via-[#E07210] to-[#D96B00] hover:from-[#E07210] hover:to-[#C86000] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Access Admin Dashboard'}</span>
          </button>
        </form>

        <div className="text-center text-[11px] text-[#F8F6EF]/50 pt-2 border-t border-amber-900/30">
          GayaSeva Platform Administration System &bull; Secure Access
        </div>

      </div>
    </div>
  );
}
