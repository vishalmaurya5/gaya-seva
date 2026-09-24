'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Key, Sparkles, CheckCircle2, Lock, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { ConfigStore, SystemConfig, DEFAULT_CONFIG } from '@/lib/configStore';
import { PaymentStore } from '@/lib/paymentStore';

export function StickyAccessPassBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    ConfigStore.fetchConfig().then(setConfig);

    const checkAuthAndAccess = () => {
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
        if (stored) {
          const usr = JSON.parse(stored);
          setCurrentUser((prev: any) => (!prev || prev.id !== usr.id ? usr : prev));
          
          // Fetch access status
          fetch(`/api/access/status?userId=${usr.id}`)
            .then((r) => r.json())
            .then((data) => {
              const isAccessActive = !!data?.hasAccess;
              setHasAccess((prev) => (prev !== isAccessActive ? isAccessActive : prev));
            })
            .catch(() => setHasAccess(false));
        } else {
          setCurrentUser(null);
          setHasAccess(false);
        }
      } catch {
        setCurrentUser(null);
        setHasAccess(false);
      }
    };

    checkAuthAndAccess();

    window.addEventListener('storage', checkAuthAndAccess);
    window.addEventListener('gayaseva_access_change', checkAuthAndAccess);

    return () => {
      window.removeEventListener('storage', checkAuthAndAccess);
      window.removeEventListener('gayaseva_access_change', checkAuthAndAccess);
    };
  }, []);

  // Hide on admin routes or auth routes if needed, or before component mounts on client
  if (!mounted || pathname?.startsWith('/admin') || pathname?.startsWith('/(admin)') || dismissed) {
    return null;
  }

  const handleBarButtonClick = async () => {
    // 1. IF NOT LOGGED IN -> Redirect to Auth Login page preserving return URL
    if (!currentUser) {
      const returnUrl = encodeURIComponent(pathname + (typeof window !== 'undefined' ? window.location.search : ''));
      router.push(`/auth/login?redirect=${returnUrl}`);
      return;
    }

    // 2. IF LOGGED IN -> Check if user ALREADY HAS ACCESS
    if (hasAccess) {
      alert('✨ GayaSeva ₹5 Global Access Pass is ALREADY ACTIVE for your account! All contact details are unlocked across GayaSeva.');
      return;
    }

    // 3. IF LOGGED IN & NO ACCESS -> Open Razorpay Payment Flow directly
    setIsProcessingPayment(true);
    setStatusMessage('Razorpay Order Generating...');

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
        setStatusMessage('✅ Pass already active!');
        setIsProcessingPayment(false);
        alert('✨ Access Pass is already active on your account!');
        return;
      }

      // Load Razorpay Checkout SDK
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
        name: 'GayaSeva Global Access Pass',
        description: `Unlock all 500+ verified Gaya Ji Pandit, Taxi & Hotel contacts for ₹${orderData.amount}`,
        image: 'https://gayaseva.org/logo.png',
        order_id: orderData.orderId.startsWith('order_') && orderData.keyId.startsWith('rzp_test_gayaseva') ? undefined : orderData.orderId,
        handler: async function (response: any) {
          setStatusMessage('Verifying payment signature...');
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.orderId,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'test_signature',
                userId: currentUser.id,
                purpose: 'CUSTOMER_ACCESS',
              }),
            });

            if (verifyRes.ok) {
              setHasAccess(true);
              setStatusMessage('✅ Access Pass Activated!');
              alert('🎉 Success! ₹5 Global Access Pass activated! All verified provider phone numbers & WhatsApp contacts are unlocked.');
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new Event('gayaseva_access_change'));
            } else {
              const err = await verifyRes.json();
              alert(`Payment Verification Error: ${err.error || 'Verification failed'}`);
            }
          } catch (e: any) {
            alert(`Payment verification error: ${e.message}`);
          } finally {
            setIsProcessingPayment(false);
            setStatusMessage(null);
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
        rzp.on('payment.failed', function (response: any) {
          alert(`Payment failed: ${response.error?.description || 'Cancelled'}`);
          setIsProcessingPayment(false);
          setStatusMessage(null);
        });
        rzp.open();
      } else {
        alert('Razorpay Checkout SDK failed to load. Please check internet connection.');
        setIsProcessingPayment(false);
        setStatusMessage(null);
      }
    } catch (err: any) {
      alert(`Payment Order Error: ${err.message}`);
      setIsProcessingPayment(false);
      setStatusMessage(null);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#1C0D02] border-b border-[#F58220]/50 text-white py-2 px-3 sm:px-6 relative z-30 font-sans shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left relative pr-8 md:pr-0">
        
        {/* Left Info Section */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#F58220] to-[#F6C343] text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
            <Key className="w-3.5 h-3.5 text-slate-950" />
          </div>

          <span className="font-extrabold text-xs sm:text-sm text-white tracking-wide">
            GayaSeva Global Access Pass
          </span>

          {hasAccess ? (
            <span className="px-2 py-0.5 text-[9px] font-black bg-emerald-500 text-slate-950 rounded-full inline-flex items-center gap-1 uppercase">
              <CheckCircle2 className="w-3 h-3 text-slate-950" /> Pass Active
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[9px] font-black bg-[#F58220] text-slate-950 rounded-full uppercase animate-pulse">
              ₹{config.customer_access_fee} ONE-TIME PASS
            </span>
          )}

          <span className="hidden lg:inline text-amber-200/50">•</span>

          <p className="text-[10px] sm:text-xs text-amber-200/90 font-medium leading-tight">
            {hasAccess
              ? '✨ All 500+ verified Gayawal Pandits, Taxis, & Hotels unlocked on your account!'
              : `गया के 500+ सत्यापित पुरोहित, टैक्सी एवं होटल का सीधा नंबर देखने के लिए ₹${config.customer_access_fee} Pass चालू करें।`}
          </p>
        </div>

        {/* Right Action Button & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBarButtonClick}
            disabled={isProcessingPayment}
            className={`px-4 py-1.5 rounded-xl font-extrabold text-[11px] sm:text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
              hasAccess
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-300'
                : 'bg-gradient-to-r from-[#F58220] via-[#F6C343] to-[#E07210] hover:from-[#E07210] hover:to-[#D96B00] text-slate-950 border border-amber-300'
            }`}
          >
            {isProcessingPayment ? (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-spin" />
                <span>{statusMessage || 'Processing...'}</span>
              </span>
            ) : hasAccess ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Pass Active (Unlocked)</span>
              </span>
            ) : !currentUser ? (
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-950" />
                <span>Activate ₹{config.customer_access_fee} Access Pass (Razorpay)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Activate ₹{config.customer_access_fee} Access Pass (Razorpay)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </span>
            )}
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-200/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0 absolute top-2 right-2 md:static"
            title="Dismiss bar"
            aria-label="Dismiss bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
