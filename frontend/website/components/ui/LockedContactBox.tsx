'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ConfigStore, SystemConfig, DEFAULT_CONFIG } from '@/lib/configStore';
import { formatPhoneNumber, getProfessionalWhatsAppUrl } from '@/lib/whatsappHelper';

interface LockedContactBoxProps {
  providerId: string;
  providerName: string;
  defaultPhone?: string;
  serviceCategory?: string;
}

export function LockedContactBox({ providerId, providerName, defaultPhone, serviceCategory }: LockedContactBoxProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [unlockedPhone, setUnlockedPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  useEffect(() => {
    ConfigStore.fetchConfig().then(setConfig);

    const handleAuthOrAccessChange = () => {
      try {
        const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
        if (stored) {
          const usr = JSON.parse(stored);
          setCurrentUser(usr);
          checkAndFetchAccess(usr);
        } else {
          setCurrentUser(null);
          setHasAccess(false);
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    handleAuthOrAccessChange();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleAuthOrAccessChange);
      window.addEventListener('gayaseva_access_change', handleAuthOrAccessChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleAuthOrAccessChange);
        window.removeEventListener('gayaseva_access_change', handleAuthOrAccessChange);
      }
    };
  }, [providerId, defaultPhone]);

  const checkAndFetchAccess = async (user: any) => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      // Server-side authorization check
      const res = await fetch(`/api/providers/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, userId: user.id }),
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.locked) {
          setHasAccess(true);
          setUnlockedPhone(data.phone || defaultPhone || null);
        }
      } else {
        // Fallback global status API check
        const statusRes = await fetch(`/api/access/status?userId=${user.id}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.hasAccess) {
            setHasAccess(true);
            setUnlockedPhone(defaultPhone || null);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch unlocked provider details:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePayAndUnlock = async () => {
    if (!currentUser) return;
    setIsProcessingPayment(true);
    setPaymentMessage('Processing Access Pass request...');

    try {
      // 1. Create payment order on server (verifies existing entitlement first)
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          purpose: 'CUSTOMER_ACCESS',
          providerId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create payment order');
      }

      const orderData = await res.json();

      // Check if server returned alreadyActive
      if (orderData.alreadyActive) {
        setHasAccess(true);
        setPaymentMessage('✅ Access Pass is already active for your account!');
        await checkAndFetchAccess(currentUser);
        setIsProcessingPayment(false);
        return;
      }

      // Load Razorpay Checkout SDK dynamically
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
        name: 'GayaSeva Access Pass',
        description: `Unlock all GayaSeva contact & service details for ₹${orderData.amount}`,
        image: 'https://gayaseva.org/logo.png',
        order_id: orderData.orderId.startsWith('order_') && orderData.keyId.startsWith('rzp_test_gayaseva') ? undefined : orderData.orderId,
        handler: async function (response: any) {
          setPaymentMessage('Verifying payment signature with GayaSeva server...');
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
              setPaymentMessage('✅ Access Pass Activated Globally!');
              setHasAccess(true);
              if (defaultPhone) setUnlockedPhone(defaultPhone);
              await checkAndFetchAccess(currentUser);
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('storage'));
                window.dispatchEvent(new Event('gayaseva_access_change'));
              }
            } else {
              const err = await verifyRes.json();
              alert(`Payment Verification Error: ${err.error || 'Verification failed'}`);
            }
          } catch (e: any) {
            alert(`Payment verification error: ${e.message}`);
          } finally {
            setIsProcessingPayment(false);
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
          alert(`Payment failed: ${response.error?.description || 'Payment was cancelled'}`);
          setIsProcessingPayment(false);
          setPaymentMessage(null);
        });
        rzp.open();
      } else {
        alert('Razorpay Checkout SDK failed to load. Please check internet connection.');
        setIsProcessingPayment(false);
        setPaymentMessage(null);
      }
    } catch (err: any) {
      alert(`Payment Order Error: ${err.message}`);
      setIsProcessingPayment(false);
      setPaymentMessage(null);
    }
  };

  const returnUrl = typeof window !== 'undefined'
    ? encodeURIComponent(pathname + window.location.search)
    : encodeURIComponent(pathname || '/services');

  // State 1: Active Access Pass -> Unlocked Contact Details
  if (hasAccess && unlockedPhone) {
    const cleanPhone = formatPhoneNumber(unlockedPhone);
    const waUrl = getProfessionalWhatsAppUrl({
      phone: cleanPhone,
      title: providerName,
      subtitle: serviceCategory || 'GayaSeva Verified Service',
      lang: 'hi',
    });

    return (
      <div className="space-y-2 pt-2 font-sans">
        <div className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-xl text-[11px] font-black text-emerald-900 flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ₹{config.customer_access_fee} Access Pass Active
          </span>
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-200/80 px-2 py-0.5 rounded-full uppercase">Global Account Unlocked</span>
        </div>

        <div className="flex gap-2.5">
          <a
            href={`tel:${unlockedPhone}`}
            className="flex-1 py-3 bg-[#2A180B] hover:bg-[#3A2314] text-[#F6C343] text-xs font-black rounded-xl text-center shadow-md flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 text-[#F58220]" />
            <span>Call ({unlockedPhone})</span>
          </a>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl text-center shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  // State 2: Locked -> Login Required or Pay ₹5 Access Pass
  return (
    <div className="bg-amber-950 text-amber-100 p-4 rounded-2xl border-2 border-amber-500/40 shadow-inner space-y-3 mt-2 font-sans">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-[#F6C343] flex items-center justify-center shrink-0 border border-amber-500/40">
          <Lock className="w-4 h-4 text-[#F58220]" />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
            <span>Direct Contact Locked</span>
            <span className="px-2 py-0.5 bg-[#F58220] text-slate-950 rounded-md text-[10px] font-black uppercase">
              ₹{config.customer_access_fee} Global Pass
            </span>
          </h4>
          <p className="text-[11px] text-amber-200/90 font-medium leading-tight">
            {providerName} के फोन नंबर और व्हाट्सएप देखने के लिए 1-टाइम ₹{config.customer_access_fee} Global Access Pass एक्टिवेट करें।
          </p>
        </div>
      </div>

      {!currentUser ? (
        <Link
          href={`/auth/login?redirect=${returnUrl}`}
          className="w-full py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white text-xs font-black rounded-xl text-center shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Login / Register &amp; Activate ₹{config.customer_access_fee} Access Pass</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <button
          onClick={handlePayAndUnlock}
          disabled={isProcessingPayment}
          className="w-full py-2.5 bg-gradient-to-r from-[#F58220] to-[#F6C343] hover:from-[#E07210] hover:to-[#E5B232] text-slate-950 text-xs font-black rounded-xl text-center shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
          <span>{isProcessingPayment ? 'Processing...' : `Activate ₹${config.customer_access_fee} Global Access Pass (Razorpay)`}</span>
        </button>
      )}

      {paymentMessage && (
        <p className="text-[10px] font-bold text-emerald-400 text-center animate-pulse">
          {paymentMessage}
        </p>
      )}
    </div>
  );
}
