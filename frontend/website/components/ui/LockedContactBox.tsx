'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Lock, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ConfigStore, SystemConfig } from '@/lib/configStore';
import { PaymentStore } from '@/lib/paymentStore';
import { formatPhoneNumber, getProfessionalWhatsAppUrl } from '@/lib/whatsappHelper';

interface LockedContactBoxProps {
  providerId: string;
  providerName: string;
  defaultPhone?: string;
  serviceCategory?: string;
}

export function LockedContactBox({ providerId, providerName, defaultPhone, serviceCategory }: LockedContactBoxProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [config, setConfig] = useState<SystemConfig>(ConfigStore.getConfig());
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [unlockedPhone, setUnlockedPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  useEffect(() => {
    ConfigStore.fetchConfig().then(setConfig);

    try {
      const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (stored) {
        const usr = JSON.parse(stored);
        setCurrentUser(usr);
        checkAndFetchAccess(usr);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, [providerId]);

  const checkAndFetchAccess = async (user: any) => {
    setLoading(true);
    try {
      // Fetch fresh access status from backend
      const res = await fetch(`/api/providers/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, userId: user.id }),
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.locked && data.phone) {
          setHasAccess(true);
          setUnlockedPhone(data.phone);
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
    setPaymentMessage('Razorpay पेमेंट ऑर्डर जनरेट हो रहा है...');

    try {
      // 1. Create order on server (never accept amount from frontend)
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

      // Load Razorpay Script dynamically if not available
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
        description: `Unlock verified provider details for ₹${orderData.amount}`,
        image: 'https://gayaseva.org/logo.png',
        order_id: orderData.orderId.startsWith('order_') && orderData.keyId.startsWith('rzp_test_gayaseva') ? undefined : orderData.orderId,
        handler: async function (response: any) {
          setPaymentMessage('पेमेंट सत्यापन हो रहा है (Verifying Razorpay Signature)...');
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
              setPaymentMessage('✅ Access Pass Successfully Activated!');
              await checkAndFetchAccess(currentUser);
              window.dispatchEvent(new Event('storage'));
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

      // Launch official Razorpay Checkout modal
      if (typeof (window as any).Razorpay !== 'undefined') {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          alert(`Payment failed: ${response.error.description || 'Payment was cancelled or failed'}`);
          setIsProcessingPayment(false);
          setPaymentMessage(null);
        });
        rzp.open();
      } else {
        alert('Razorpay Checkout SDK failed to load. Please check your internet connection and try again.');
        setIsProcessingPayment(false);
        setPaymentMessage(null);
      }
    } catch (err: any) {
      alert(`Payment Order Error: ${err.message}`);
      setIsProcessingPayment(false);
      setPaymentMessage(null);
    }
  };

  // State 1: Active Access -> Display Unlocked Contact Buttons
  if (hasAccess && unlockedPhone) {
    const cleanPhone = formatPhoneNumber(unlockedPhone);
    const waUrl = getProfessionalWhatsAppUrl({
      phone: cleanPhone,
      title: providerName,
      subtitle: serviceCategory || 'GayaSeva Verified Service',
      lang: 'hi',
    });

    return (
      <div className="space-y-2 pt-2">
        <div className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-xl text-[11px] font-black text-emerald-900 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ₹{config.customer_access_fee} Access Pass Active
          </span>
          <span className="text-[10px] text-emerald-700">Unlocked</span>
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

  // State 2: Locked -> Prompt for Login or ₹5 Payment
  return (
    <div className="bg-amber-950 text-amber-100 p-4 rounded-2xl border-2 border-amber-500/40 shadow-inner space-y-3 mt-2">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-[#F6C343] flex items-center justify-center shrink-0 border border-amber-500/40">
          <Lock className="w-4 h-4 text-[#F58220]" />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
            <span>Direct Phone &amp; WhatsApp Locked</span>
            <span className="px-2 py-0.5 bg-[#F58220] text-slate-950 rounded-md text-[10px] font-black uppercase">
              ₹{config.customer_access_fee} Pass
            </span>
          </h4>
          <p className="text-[11px] text-amber-200/90 font-medium leading-tight">
            {providerName} के सीधे फोन नंबर एवं व्हाट्सएप संपर्क विवरण देखने के लिए ₹{config.customer_access_fee} Access Pass चालू करें।
          </p>
        </div>
      </div>

      {!currentUser ? (
        <Link
          href={`/auth/login?redirect=${encodeURIComponent('/services')}`}
          className="w-full py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white text-xs font-black rounded-xl text-center shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Register / Login &amp; Activate ₹{config.customer_access_fee} Access Pass</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <button
          onClick={handlePayAndUnlock}
          disabled={isProcessingPayment}
          className="w-full py-2.5 bg-gradient-to-r from-[#F58220] to-[#F6C343] hover:from-[#E07210] hover:to-[#E5B232] text-slate-950 text-xs font-black rounded-xl text-center shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
          <span>{isProcessingPayment ? 'Processing Payment...' : `Activate ₹${config.customer_access_fee} Access Pass (Razorpay)`}</span>
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
