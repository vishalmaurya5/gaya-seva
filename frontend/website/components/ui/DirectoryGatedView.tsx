'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ConfigStore, SystemConfig, DEFAULT_CONFIG } from '@/lib/configStore';
import { formatPhoneNumber } from '@/lib/whatsappHelper';

interface DirectoryGatedViewProps {
  categoryName: string;
  totalCount: number;
  maxPreviewCount?: number;
  children: (visibleItemsCount: number, hasAccess: boolean) => React.ReactNode;
}

export function DirectoryGatedView({
  categoryName,
  totalCount,
  maxPreviewCount = 2,
  children,
}: DirectoryGatedViewProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
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
          checkAccess(usr);
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
  }, []);

  const syncActiveAccess = (userId: string) => {
    if (typeof window === 'undefined' || !userId) return;
    try {
      const key = 'GAYASEVA_CUSTOMER_ACCESS_STORE';
      const stored = localStorage.getItem(key);
      let records: any[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(records)) records = [];
      const existing = records.find((r) => r.userId === userId && r.status === 'ACTIVE');
      if (!existing) {
        records.push({
          id: 'access_' + userId,
          userId: userId,
          accessType: 'LIFETIME',
          status: 'ACTIVE',
          amount: 5,
          currency: 'INR',
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(records));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('gayaseva_access_change'));
      }
    } catch (e) {}
  };

  const checkAccess = async (user: any) => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const res = await fetch('/api/providers/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.locked || data.hasAccess) {
          setHasAccess(true);
          syncActiveAccess(user.id);
        } else {
          setHasAccess(false);
        }
      } else {
        // Fallback check to access-status API
        const statusRes = await fetch(`/api/payments/access-status?userId=${user.id}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.hasAccess) {
            setHasAccess(true);
            syncActiveAccess(user.id);
          }
        }
      }
    } catch (e) {
      console.error('Failed checking directory access:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePayAndUnlock = async () => {
    if (!currentUser) return;
    setIsProcessingPayment(true);
    setPaymentMessage('Razorpay पेमेंट ऑर्डर जनरेट हो रहा है...');

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
        description: `Unlock full GayaSeva directory for ₹${orderData.amount}`,
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
              setHasAccess(true);
              await checkAccess(currentUser);
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

  const hiddenCount = Math.max(0, totalCount - maxPreviewCount);
  const visibleItemsCount = hasAccess ? totalCount : Math.min(totalCount, maxPreviewCount);

  return (
    <div className="space-y-6">
      {/* Active Access Banner if user has paid */}
      {hasAccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs font-black text-emerald-900 flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>₹{config.customer_access_fee} Access Pass Active: Entire Directory &amp; Contact Details Unlocked!</span>
          </span>
          <span className="px-3 py-1 bg-emerald-200 text-emerald-950 rounded-full text-[10px] uppercase font-black">
            Verified Pass
          </span>
        </div>
      )}

      {/* Render directory list */}
      {children(visibleItemsCount, hasAccess)}

      {/* Gated Directory Banner if user does NOT have active access */}
      {!hasAccess && (
        <div id="unlock-access-banner" className="bg-gradient-to-br from-[#2A180B] via-[#4A2E1A] to-[#1C0D02] text-white p-8 sm:p-10 rounded-3xl border-2 border-amber-500/50 shadow-2xl text-center space-y-5 my-8 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-[#F6C343] flex items-center justify-center mx-auto border border-amber-500/40 shadow-inner">
            <Lock className="w-7 h-7 text-[#F58220]" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
              <span>🔒 {hiddenCount > 0 ? `+${hiddenCount} Aur ${categoryName} Records Hidden` : `${categoryName} Phone & Address Details Locked`}</span>
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium leading-relaxed">
              गया जी के सभी {categoryName} एवं सत्यापित सेवा प्रदाताओं के संपूर्ण फोन नंबर, एड्रेस, व्हाट्सएप संपर्क विवरण अनलॉक करने के लिए ₹{config.customer_access_fee} Access Pass सक्रिय करें।
            </p>
          </div>

          <div className="pt-2 max-w-md mx-auto">
            {!currentUser ? (
              <Link
                href={`/auth/register?redirect=${encodeURIComponent(pathname || '/services')}`}
                id="unlock-access-btn"
                className="w-full py-4 bg-gradient-to-r from-[#F58220] to-[#F6C343] hover:from-[#E07210] hover:to-[#E5B232] text-slate-950 text-sm font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Create New Account &amp; Activate ₹{config.customer_access_fee} Access Pass</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                id="unlock-access-btn"
                onClick={handlePayAndUnlock}
                disabled={isProcessingPayment}
                className="w-full py-4 bg-gradient-to-r from-[#F58220] to-[#F6C343] hover:from-[#E07210] hover:to-[#E5B232] text-slate-950 text-sm font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-slate-950 animate-spin" />
                <span>
                  {isProcessingPayment
                    ? 'Processing Payment...'
                    : `Activate ₹${config.customer_access_fee} Access Pass Now (Razorpay)`}
                </span>
              </button>
            )}

            {paymentMessage && (
              <p className="text-xs font-bold text-emerald-400 mt-3 animate-pulse">
                {paymentMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
