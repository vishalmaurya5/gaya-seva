'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Users, 
  Car, 
  Flame, 
  Hotel, 
  ShieldCheck, 
  Mail, 
  Settings, 
  Activity, 
  LayoutDashboard,
  LogOut,
  Sparkles,
  MapPin,
  Sliders,
  Layers,
  User,
  Crown,
  Scissors,
  Package,
  Search,
  HelpCircle
} from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserStore, UserAccount } from '@/lib/userStore';
import { LostFoundStore } from '@/lib/contentStore';

const ADMIN_NAV = [
  { key: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { key: 'verification', name: '🔍 Verification Portal', href: '/verification', icon: ShieldCheck },
  { key: 'lost_found', name: '🔎 Lost & Found Desk', href: '/lost-found', icon: Search },
  { key: 'barbers', name: 'Barbers (नाई / ठाकुर)', href: '/barbers', icon: Scissors },
  { key: 'drivers', name: 'Drivers (टैक्सी / ड्राइवर)', href: '/drivers', icon: Car },
  { key: 'pandits', name: 'Pandits (पंडित जी / पुरोहित)', href: '/pandits', icon: Flame },
  { key: 'hotels', name: 'Hotels & Stays', href: '/hotels', icon: Hotel },
  { key: 'other_vendors', name: 'Other Vendors (अन्य)', href: '/other-vendors', icon: Package },
  { key: 'users', name: 'Users & Admins', href: '/users', icon: Users },
  { key: 'popup_ads', name: '📢 Popup Advertisements', href: '/popup-ads', icon: Sparkles },
  { key: 'slider_banners', name: '🖼️ Slider Banners', href: '/slider-banners', icon: Layers },
  { key: 'places', name: '📍 Sacred Places & Markets', href: '/places', icon: MapPin },
  { key: 'services_config', name: '🛠️ Service Catalog & Fares', href: '/services-config', icon: Sliders },
  { key: 'analytics', name: '📊 Analytics & Conversion', href: '/analytics', icon: Activity },
  { key: 'email_smtp', name: 'Email & SMTP', href: '/email-templates', icon: Mail },
  { key: 'qr_analytics', name: 'QR Campaign Analytics', href: '/qr-sources', icon: Flame },
  { key: 'system_health', name: '100k System Health', href: '/system-health', icon: ShieldCheck },
  { key: 'audit_logs', name: 'Audit Logs', href: '/audit-logs', icon: Activity },
];

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>({});

  const checkAuth = () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (stored) {
        const user: UserAccount = JSON.parse(stored);
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
          setCurrentUser(user);
          setCheckingAuth(false);
          return;
        }
      }
    } catch (e) {
      console.error('Error checking admin auth', e);
    }

    setCurrentUser(null);
    setCheckingAuth(false);

    if (pathname !== '/login') {
      router.push('/login');
    }
  };

  const loadBadgeCounts = async () => {
    try {
      const users = await UserStore.fetchUsersFromApi();
      const counts: Record<string, number> = {
        verification: users.filter((u) => u.status === 'PENDING' && u.role !== 'PILGRIM').length,
        barbers: users.filter((u) => u.role === 'BARBER' && u.status === 'PENDING').length,
        drivers: users.filter((u) => u.role === 'DRIVER' && u.status === 'PENDING').length,
        pandits: users.filter((u) => u.role === 'PANDIT' && u.status === 'PENDING').length,
        hotels: users.filter((u) => u.role === 'HOTEL' && u.status === 'PENDING').length,
        other_vendors: users.filter((u) => u.role === 'OTHER' && u.status === 'PENDING').length,
      };
      setBadgeCounts(counts);
    } catch (e) {}
  };

  useEffect(() => {
    checkAuth();
    loadBadgeCounts();
    window.addEventListener('storage', loadBadgeCounts);
    return () => window.removeEventListener('storage', loadBadgeCounts);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('GAYASEVA_CURRENT_USER');
    localStorage.removeItem('GAYASEVA_ADMIN_LOGGED_IN');
    window.dispatchEvent(new Event('storage'));
    setCurrentUser(null);
    router.push('/login');
  };

  // If on login page, render child directly without sidebar layout
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#1C0D02] flex items-center justify-center text-white text-sm">
        <div className="flex items-center gap-3">
          <GayaSevaLogo size={40} showText={false} className="animate-spin" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  // Fallback if auth check failed & waiting for redirect
  if (!currentUser && pathname !== '/login') {
    return (
      <div className="min-h-screen bg-[#1C0D02] flex flex-col items-center justify-center text-white text-sm space-y-4">
        <p className="text-amber-300 font-bold">Access Denied. Please log in to open Admin Panel.</p>
        <Link 
          href="/login"
          className="px-5 py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white font-bold rounded-xl shadow-lg"
        >
          Go to Admin Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-[#4A2E1A] antialiased">
      
      {/* Premium Dark Sidebar */}
      <aside className="w-64 bg-[#2A180B] text-white flex flex-col justify-between hidden md:flex border-r border-[#F58220]/20 shrink-0">
        <div className="p-6 space-y-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <GayaSevaLogo size={42} showText={false} className="group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-serif font-bold text-xl text-white group-hover:text-[#F6C343] transition-colors">
                Gaya<span className="text-[#F58220]">Seva</span>
              </span>
              <span className="block text-[10px] text-[#F6C343] font-semibold uppercase tracking-wider">ADMIN CONSOLE</span>
            </div>
          </Link>

          {/* Active Logged-In Admin User Profile Card */}
          <div className="p-3.5 bg-[#3D2310] rounded-2xl border border-[#F6C343]/20 space-y-2 relative shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F58220] to-[#F6C343] flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <Crown className="w-5 h-5 text-white" />}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-white truncate">{currentUser?.name || 'Super Admin'}</p>
                <p className="text-[10px] text-[#F8F6EF]/70 truncate">{currentUser?.email || 'vishalverma5359@gayaseva.com'}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-900/40 flex items-center justify-between text-[10px]">
              <span className="px-2 py-0.5 bg-[#F58220]/20 text-[#F6C343] font-bold rounded-md border border-[#F58220]/30 uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3 text-[#F58220]" />
                {currentUser?.role || 'SUPER_ADMIN'}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-100 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                title="Logout Admin Session"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const badge = badgeCounts[item.key] || 0;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors group ${
                    isActive 
                      ? 'bg-[#F58220] text-white font-bold shadow-md'
                      : 'text-[#F8F6EF]/80 hover:text-white hover:bg-[#4A2E1A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#F58220]'}`} />
                    <span>{item.name}</span>
                  </div>

                  {badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse shadow-sm border border-red-300">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-amber-900/30 text-[10px] text-[#F8F6EF]/40 text-center">
          GayaSeva Engine v2.4 &bull; Admin RBAC
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10">
        {children}
      </main>

    </div>
  );
}
