'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // max 4
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    setStatus('LOADING');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('SUCCESS');
      } else {
        setStatus('ERROR');
        setErrorMsg(data.error || 'Failed to reset password. Link may be expired.');
      }
    } catch (err: any) {
      setStatus('ERROR');
      setErrorMsg('Network request error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#800020] text-amber-400 font-serif font-bold text-2xl shadow-lg mb-4">
          GS
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#4A2E1A] tracking-tight">
          GayaSeva
        </h2>
        <p className="mt-2 text-sm text-gray-600 font-medium">
          Create a new secure password for your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-gray-100 rounded-3xl sm:px-10">
          
          {status === 'SUCCESS' ? (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-[#4A2E1A]">Password Updated Successfully!</h3>
                <p className="mt-2 text-xs text-gray-600">
                  Your password has been changed securely. You can now log in to your GayaSeva account with your new credentials.
                </p>
              </div>

              <Link
                href="/auth/login"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#800020] hover:bg-[#600018] transition-all"
              >
                Login to GayaSeva <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>{errorMsg}</div>
                </div>
              )}

              {!token && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    No password reset token found in URL. If you opened this page directly, please request a reset link from the forgot password page.
                  </div>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="block w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800020] focus:border-transparent font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength >= 1 ? 'bg-rose-500 w-1/4' : ''}`} />
                      <div className={`h-full transition-all duration-300 ${strength >= 2 ? 'bg-amber-500 w-1/4' : ''}`} />
                      <div className={`h-full transition-all duration-300 ${strength >= 3 ? 'bg-blue-500 w-1/4' : ''}`} />
                      <div className={`h-full transition-all duration-300 ${strength >= 4 ? 'bg-emerald-500 w-1/4' : ''}`} />
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Strength: {strength === 1 && 'Weak'} {strength === 2 && 'Fair'} {strength === 3 && 'Good'} {strength >= 4 && 'Strong'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Re-enter new password"
                    className="block w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800020] focus:border-transparent font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'LOADING' || !token}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#800020] hover:bg-[#600018] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800020] disabled:opacity-50 transition-all"
              >
                {status === 'LOADING' ? 'Updating Password...' : 'Reset Password'}
              </button>

              <div className="text-center pt-2">
                <Link href="/auth/login" className="text-xs font-semibold text-[#800020] hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center text-sm font-medium text-gray-500">Loading reset portal...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
