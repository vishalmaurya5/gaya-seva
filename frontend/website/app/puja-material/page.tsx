'use client';

import React from 'react';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { DirectoryGatedView } from '@/components/ui/DirectoryGatedView';
import { LockedContactBox } from '@/components/ui/LockedContactBox';

export default function PujaMaterialPage() {
  const items = [
    { id: '1', name: 'Complete Pinda Daan Puja Kit', price: '₹450', category: 'Puja Essentials', provider: 'Vishnupad Teerth Samagri', phone: '+919876543240' },
    { id: '2', name: 'Fresh Lotus & Flower Mala Set', price: '₹150', category: 'Flowers & Mala', provider: 'Falgu Flower Centre', phone: '+919876543241' },
    { id: '3', name: 'Authentic Gaya Tilkut Prasad Box (1kg)', price: '₹280', category: 'Prasad', provider: 'Shree Ram Sweets', phone: '+919876543242' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="bg-[#2A180B] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/20 shadow-xl space-y-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-pink-400" /> Puja ke liye kya chahiye?
        </h1>
        <p className="text-xs text-[#F8F6EF]/80">Verified Puja Material, Flowers, Prasad & Samagri Suppliers in Gaya Ji.</p>
      </div>

      <DirectoryGatedView categoryName="Puja Kits & Samagri" totalCount={items.length} maxPreviewCount={2}>
        {(visibleCount, hasAccess) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.slice(0, visibleCount).map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#4A2E1A]">{item.name}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded inline-flex items-center gap-1 mt-1">
                        <ShieldCheck className="w-3 h-3" /> GayaSeva Verified
                      </span>
                    </div>
                    <span className="text-sm font-serif font-bold text-[#F58220]">{item.price}</span>
                  </div>

                  <div className="text-xs text-gray-600 bg-[#F8F6EF] p-3 rounded-xl">
                    <p>🪔 Category: {item.category}</p>
                    <p>🏪 Provider: {hasAccess ? item.provider : '🔒 Provider Details Locked'}</p>
                  </div>
                </div>

                <LockedContactBox 
                  providerId={item.id} 
                  providerName={item.provider} 
                  defaultPhone={item.phone}
                  serviceCategory="Puja Material & Tilkut"
                />
              </div>
            ))}
          </div>
        )}
      </DirectoryGatedView>
    </div>
  );
}
