'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  Phone, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Clock, 
  HeartHandshake, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  ChefHat, 
  Truck, 
  Flame, 
  Filter, 
  Coffee,
  Check,
  ShoppingBag
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { getProfessionalWhatsAppUrl, formatPhoneNumber } from '@/lib/whatsappHelper';
import { DirectoryGatedView } from '@/components/ui/DirectoryGatedView';
import { LockedContactBox } from '@/components/ui/LockedContactBox';

interface FoodProvider {
  id: string;
  name: string;
  tagline: string;
  category: 'SATVIK' | 'ELDERLY' | 'RITUAL' | 'TILKUT';
  area: string;
  rating: number;
  reviewsCount: number;
  phone: string;
  timing: string;
  highlights: string[];
  isVerified: boolean;
  deliveryAvailable: boolean;
  priceRange: string;
  popularItems: string[];
  badge: string;
}

const DEFAULT_FOOD_PROVIDERS: FoodProvider[] = [
  {
    id: 'food_1',
    name: 'Sri Vishnupad Satvik Bhojanalaya',
    tagline: 'Pure Desi Ghee Satvik Thali (बिना लहसुन-प्याज)',
    category: 'SATVIK',
    area: 'Vishnupad Temple Gate No. 2, Gaya Ji',
    rating: 4.9,
    reviewsCount: 420,
    phone: '+919876543230',
    timing: '7:00 AM - 10:30 PM',
    highlights: ['Pure Desi Ghee', 'No Garlic No Onion', 'RO Purified Water'],
    isVerified: true,
    deliveryAvailable: true,
    priceRange: '₹120 - ₹220 per thali',
    popularItems: ['Special Satvik Thali', 'Falgu River Bath Special Khichdi', 'Kheer & Puri'],
    badge: 'Most Popular',
  },
  {
    id: 'food_2',
    name: 'Gaya Ji Elderly Care Yatri Bhojan',
    tagline: 'Less Oil, Soft & Easy to Digest Meals for Senior Pilgrims',
    category: 'ELDERLY',
    area: 'Gaya Junction & Station Road',
    rating: 4.9,
    reviewsCount: 310,
    phone: '+919876543231',
    timing: '6:30 AM - 10:00 PM',
    highlights: ['Soft Roti & Khichdi', 'Low Salt / Sugar-Free Option', 'Dharamshala Room Delivery'],
    isVerified: true,
    deliveryAvailable: true,
    priceRange: '₹100 - ₹180 per meal',
    popularItems: ['Moong Dal Khichdi Thali', 'Boiled Veg & Soft Phulka', 'Pappu Saag Rice'],
    badge: 'Senior Care',
  },
  {
    id: 'food_3',
    name: 'Teerth Purohit Shradh Sankalp Bhojan',
    tagline: 'Authentic Vedic Brahman Shradh & Pind Daan Ritual Meals',
    category: 'RITUAL',
    area: 'Falgu Ghat & Devghat Zone',
    rating: 4.8,
    reviewsCount: 280,
    phone: '+919876543232',
    timing: '8:00 AM - 4:00 PM',
    highlights: ['Prepared by Vedic Brahmins', 'Strict Cleanliness Standard', 'Bulk Booking for Shradh Groups'],
    isVerified: true,
    deliveryAvailable: true,
    priceRange: 'Custom Shradh Package',
    popularItems: ['Brahman Bhojan Package', 'Pind Daan Ritual Meals', 'Panchamrit & Kheer'],
    badge: 'Vedic Shradh',
  },
  {
    id: 'food_4',
    name: 'Ramna Road Special Gaya Tilkut & Anarsa',
    tagline: 'World Famous Gaya Jaggery Tilkut, Anarsa & Lai Store',
    category: 'TILKUT',
    area: 'Ramna Road, Main Market, Gaya Ji',
    rating: 5.0,
    reviewsCount: 580,
    phone: '+919876543233',
    timing: '8:00 AM - 9:30 PM',
    highlights: ['Fresh Daily Handmade', 'Gur & Sugar Tilkut', 'Secure Packing for Travel'],
    isVerified: true,
    deliveryAvailable: true,
    priceRange: '₹280 - ₹450 per kg',
    popularItems: ['Special Gur Tilkut', 'Traditional Anarsa', 'Kesar Sesame Khaja'],
    badge: 'Gaya Specialty',
  }
];

export default function FoodPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dbProviders, setDbProviders] = useState<UserAccount[]>([]);

  useEffect(() => {
    // Read food providers from UserStore
    const users = UserStore.getUsers();
    const foodUsers = users.filter(u => 
      u.role === 'FOOD' || 
      u.role === 'SHOP' || 
      (u.customRole && (
        u.customRole.toLowerCase().includes('food') || 
        u.customRole.toLowerCase().includes('satvik') || 
        u.customRole.toLowerCase().includes('bhojan') ||
        u.customRole.toLowerCase().includes('tilkut')
      ))
    );
    setDbProviders(foodUsers);
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Food Services', icon: UtensilsCrossed },
    { id: 'SATVIK', label: 'Satvik Pure Veg', icon: Sparkles },
    { id: 'ELDERLY', label: 'Elderly Friendly', icon: HeartHandshake },
    { id: 'RITUAL', label: 'Pind Daan Ritual Meals', icon: Flame },
    { id: 'TILKUT', label: 'Gaya Tilkut & Sweets', icon: ShoppingBag },
  ];

  // Combined providers list
  const allProviders = useMemo(() => {
    const formattedDbProviders: FoodProvider[] = dbProviders.map((u, idx) => ({
      id: u.id,
      name: u.name,
      tagline: u.customRole || 'Satvik & Pure Veg Food Partner in Gaya Ji',
      category: u.customRole?.toLowerCase().includes('tilkut') ? 'TILKUT' : 'SATVIK',
      area: u.city || 'Vishnupad Temple Area, Gaya Ji',
      rating: u.rating || 4.9,
      reviewsCount: 120 + idx * 15,
      phone: u.phone,
      timing: '7:00 AM - 10:00 PM',
      highlights: u.languages ? u.languages.map(l => `Speaks ${l}`) : ['Verified Provider', 'Pure Satvik Food'],
      isVerified: u.status === 'VERIFIED',
      deliveryAvailable: true,
      priceRange: '₹120 - ₹250',
      popularItems: ['Satvik Thali', 'Desi Ghee Meals', 'Fresh Yatri Snacks'],
      badge: u.status === 'VERIFIED' ? 'Verified Partner' : 'New Provider',
    }));

    return [...DEFAULT_FOOD_PROVIDERS, ...formattedDbProviders];
  }, [dbProviders]);

  const filteredProviders = useMemo(() => {
    return allProviders.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesQuery = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [allProviders, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A] pb-16">
      
      {/* Premium Executive Hero Banner */}
      <div className="bg-gradient-to-br from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white py-12 px-4 sm:px-6 shadow-xl border-b border-[#F58220]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F58220]/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F6C343]/20 border border-[#F6C343]/40 flex items-center justify-center text-[#F6C343] shadow-md">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <span className="px-3 py-1 bg-[#F58220]/20 text-[#F6C343] text-xs font-bold rounded-full border border-[#F58220]/40 uppercase tracking-widest inline-block mb-1">
                GayaSeva Food Directory
              </span>
              <h1 className="text-2xl sm:text-3xl font-sans font-extrabold text-white tracking-tight leading-tight">
                Gaya Ji Satvik & Yatri Bhojan Directory
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#F8F6EF]/90 max-w-3xl leading-relaxed font-medium">
            100% verified No-Onion No-Garlic Satvik Bhojanalayas, Elderly-Friendly Soft Meals, Pind Daan Shradh Ritual Foods, and Authentic Gaya Tilkut Stores near Vishnupad Temple & Station.
          </p>

          {/* Quick Feature Badges */}
          <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-[#F6C343]">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Pure Satvik (No Garlic/Onion)
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <HeartHandshake className="w-4 h-4 text-amber-400" /> Senior Citizen Soft Meals
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <Truck className="w-4 h-4 text-orange-400" /> Room Delivery to Dharamshalas
            </span>
          </div>

          {/* Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-2xl">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by bhojanalaya name, location (Vishnupad, Station, Falgu)..."
                className="w-full pl-12 pr-4 py-3.5 bg-white text-[#0F172A] placeholder:text-[#475569] text-sm font-semibold rounded-2xl shadow-lg border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#F6C343]"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all shadow-xs border ${
                  isSelected
                    ? 'bg-[#1C0D02] text-white border-[#1C0D02] ring-2 ring-[#F58220]'
                    : 'bg-white text-[#0F172A] border-slate-300 hover:bg-amber-50 hover:border-[#F58220]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F6C343]' : 'text-[#F58220]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Grid */}
        <DirectoryGatedView categoryName="Satvik Food & Bhojanalaya" totalCount={filteredProviders.length} maxPreviewCount={2}>
          {(visibleCount, hasAccess) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.slice(0, visibleCount).map((res) => (
                <div 
                  key={res.id} 
                  className="bg-white rounded-3xl border border-slate-300 shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between space-y-5 relative overflow-hidden group"
                >
                  <div className="space-y-3">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 bg-amber-100 text-[#4A2E1A] text-[10px] font-black uppercase rounded-lg border border-amber-300 tracking-wider">
                        {res.badge}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-black text-amber-800">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{res.rating}</span>
                        <span className="text-[10px] text-slate-500 font-bold">({res.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="font-sans font-extrabold text-lg text-[#0F172A] tracking-tight leading-tight group-hover:text-[#F58220] transition-colors">
                        {res.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#1E293B] mt-1 leading-snug">
                        {res.tagline}
                      </p>
                    </div>

                    {/* Verification Badge */}
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-xl w-fit">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>GayaSeva Verified Provider</span>
                    </div>

                    {/* Details Card */}
                    <div className="bg-[#F8F6EF] p-3.5 rounded-2xl border border-[#EBE6D6] space-y-2 text-xs font-bold text-[#0F172A]">
                      <div className="flex items-center gap-2 text-slate-900">
                        <MapPin className="w-4 h-4 text-[#F58220] shrink-0" />
                        <span className="line-clamp-1">{hasAccess ? res.area : '📍 Address & Location Locked'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-900">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{res.timing}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{res.deliveryAvailable ? 'Dharamshala Room Delivery Available' : 'Dine-In & Takeaway'}</span>
                      </div>
                    </div>

                    {/* Popular Menu Preview */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Popular Items:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {res.popularItems.map((item, i) => (
                          <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-900 px-2 py-0.5 rounded-md border border-slate-300">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <LockedContactBox 
                    providerId={res.id} 
                    providerName={res.name} 
                    defaultPhone={res.phone}
                    serviceCategory="Satvik Food & Bhojanalaya"
                  />

                </div>
              ))}
            </div>
          )}
        </DirectoryGatedView>

        {filteredProviders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-300 p-8 space-y-4">
            <UtensilsCrossed className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-sans font-extrabold text-xl text-[#0F172A]">No Food Providers Found</h3>
            <p className="text-xs font-bold text-slate-600 max-w-md mx-auto">
              No food providers matched your query "{searchQuery}". Try selecting "All Food Services" or clear your search term.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

