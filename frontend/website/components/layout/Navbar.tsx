'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Car, 
  Flame, 
  Hotel, 
  MapPin, 
  LifeBuoy, 
  Menu, 
  X, 
  Search,
  Sparkles,
  ChevronDown,
  Megaphone,
  User,
  ShieldCheck,
  Globe,
  Compass,
  ArrowUpRight,
  Luggage,
  LogOut,
  LayoutDashboard,
  Crown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';
import { UserAccount } from '@/lib/userStore';

export function Navbar() {
  const { t, language } = useLanguage();
  const { locationName, requestLocation } = useLocation();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const isHindi = language === 'hi';

  const checkUserSession = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkUserSession();
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', checkUserSession);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkUserSession);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('GAYASEVA_CURRENT_USER');
    window.dispatchEvent(new Event('storage'));
    setCurrentUser(null);
    setProfileDropdownOpen(false);
    window.location.href = '/';
  };

  const getDashboardHref = (user: UserAccount) => {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      return process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';
    }
    if (user.role === 'PANDIT') return '/pandit/dashboard';
    if (user.role === 'DRIVER') return '/driver/dashboard';
    if (user.role === 'HOTEL') return '/hotel/dashboard';
    return '/dashboard';
  };

  const getRoleLabel = (user: UserAccount) => {
    if (user.role === 'SUPER_ADMIN') return isHindi ? 'सुपर एडमिन' : 'Super Admin';
    if (user.role === 'ADMIN') return isHindi ? 'एडमिन' : 'Admin';
    if (user.role === 'PANDIT') return isHindi ? 'पंडित जी पार्टनर' : 'Pandit Ji Partner';
    if (user.role === 'DRIVER') return isHindi ? 'ड्राइवर पार्टनर' : 'Driver Partner';
    if (user.role === 'HOTEL') return isHindi ? 'होटल / धर्मशाला' : 'Hotel Partner';
    return isHindi ? 'यात्री / तीर्थयात्री' : 'Yatri Pilgrim';
  };

  const getRoleBadgeStyle = (user: UserAccount) => {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return 'bg-amber-100 text-amber-900 border-amber-300';
    if (user.role === 'PANDIT') return 'bg-orange-100 text-orange-900 border-orange-300';
    if (user.role === 'DRIVER') return 'bg-blue-100 text-blue-900 border-blue-300';
    if (user.role === 'HOTEL') return 'bg-purple-100 text-purple-900 border-purple-300';
    return 'bg-emerald-100 text-emerald-900 border-emerald-300';
  };

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300 max-w-full overflow-x-hidden">
      
      {/* 1. Top Announcement & Marquee Bar */}
      <div className="w-full bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-[10px] sm:text-[11px] py-1 px-3 sm:px-8 xl:px-12 text-[#F6C343] font-medium flex items-center justify-between border-b border-amber-500/20 shadow-xs max-w-full overflow-hidden gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
          <Megaphone className="w-3 h-3 text-[#F58220] animate-bounce shrink-0" />
          <span className="truncate text-amber-100 font-semibold">{t('topBarWelcome')}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageSelector variant="topbar" />
        </div>
      </div>

      {/* 2. Main Floating Glassmorphic Navbar */}
      <nav 
        className={`w-full transition-all duration-300 max-w-full ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-1.5 border-b border-slate-200' 
            : 'bg-white py-2 border-b border-slate-100 shadow-xs'
        }`}
      >
        <div className="w-full px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 flex items-center justify-between gap-2 sm:gap-4 max-w-full overflow-hidden">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 transition-transform duration-200 hover:scale-102">
            <GayaSevaLogo size={32} showText={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            
            {/* Home */}
            <Link 
              href="/" 
              className={`px-2.5 py-1 rounded-lg text-xs xl:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                pathname === '/' 
                  ? 'text-[#F58220] bg-orange-50/80 shadow-2xs' 
                  : 'text-slate-800 hover:text-[#F58220] hover:bg-slate-50'
              }`}
            >
              <span>{t('navHome')}</span>
            </Link>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link 
                href="/services" 
                className={`px-3 py-1 rounded-full text-xs xl:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 border shadow-2xs hover:-translate-y-0.5 ${
                  pathname.startsWith('/services')
                    ? 'bg-[#F58220] text-white border-[#F58220] shadow-md' 
                    : 'bg-amber-50 text-[#C45E00] border-amber-200 hover:bg-amber-100 hover:border-amber-300'
                }`}
              >
                <span className="text-xs">🧰</span>
                <span>{t('navServices')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#F58220]" />
              </Link>

              {servicesDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-2xl border border-amber-200 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 space-y-1">
                  <div className="p-2.5 bg-amber-50/90 rounded-xl border border-amber-200/80 mb-1">
                    <p className="font-extrabold text-[#4A2E1A] text-xs">गया धाम की समस्त सेवाएं</p>
                    <p className="text-[10px] text-slate-600 font-bold">1-टैप डायरेक्ट सत्यापित प्रदाता एवं बुकिंग</p>
                  </div>

                  <Link 
                    href="/services"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50 text-[#0F172A] hover:text-[#F58220] font-extrabold text-xs transition-colors"
                  >
                    <span className="flex items-center gap-2">🌐 <span>{isHindi ? 'सभी सेवाएं (All Services)' : 'All Services Directory'}</span></span>
                    <span className="text-[10px] bg-[#F58220] text-white px-2 py-0.5 rounded-full font-black">Open</span>
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />

                  <Link 
                    href="/services?category=PANDIT"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-[#F58220] font-bold text-xs transition-colors"
                  >
                    <Flame className="w-4 h-4 text-[#F58220] shrink-0" />
                    <span>{isHindi ? 'पिंडदान एवं तीर्थ पुरोहित' : 'Pind Daan & Pandits'}</span>
                  </Link>

                  <Link 
                    href="/services?category=BARBER"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-[#F58220] font-bold text-xs transition-colors"
                  >
                    <span className="text-sm">✂️</span>
                    <span>{isHindi ? 'क्षौर कर्म एवं नाई (मुंडन)' : 'Mundan Barber (Kshaur Karma)'}</span>
                  </Link>

                  <Link 
                    href="/services?category=DRIVER"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-orange-50 text-slate-800 hover:text-orange-600 font-bold text-xs transition-colors"
                  >
                    <Car className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>{isHindi ? 'पिक एंड ड्रॉप (टैक्सी & ऑटो)' : 'Pick & Drop Taxi/Auto'}</span>
                  </Link>

                  <Link 
                    href="/services?category=HOTEL"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-blue-600 font-bold text-xs transition-colors"
                  >
                    <Hotel className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{isHindi ? 'होटल एवं धर्मशालाएं' : 'Hotels & Dharamshalas'}</span>
                  </Link>

                  <Link 
                    href="/services?category=FOOD"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-600 font-bold text-xs transition-colors"
                  >
                    <span className="text-sm">🍲</span>
                    <span>{isHindi ? '100% शुद्ध सात्विक भोजन' : 'Satvik Food & Thali'}</span>
                  </Link>

                  <Link 
                    href="/services?category=PUJA"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-pink-50 text-slate-800 hover:text-pink-600 font-bold text-xs transition-colors"
                  >
                    <span className="text-sm">🛍️</span>
                    <span>{isHindi ? 'पूजा सामग्री एवं गया तिलकुट' : 'Puja Kits & Tilkut'}</span>
                  </Link>

                  <Link 
                    href="/services?category=GUIDE"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-purple-50 text-slate-800 hover:text-purple-600 font-bold text-xs transition-colors"
                  >
                    <Compass className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>{isHindi ? '48-वेदी एवं तीर्थ गाइड' : '48-Vedi Shradh Guide'}</span>
                  </Link>

                  <Link 
                    href="/help/lost-and-found"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-red-50 text-slate-800 hover:text-red-600 font-bold text-xs transition-colors"
                  >
                    <Search className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{isHindi ? '🔎 खोया और पाया पोर्टल (Lost & Found)' : '🔎 Lost & Found Portal'}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Famous Places */}
            <Link 
              href="/gaya-guide" 
              className={`px-2.5 py-1 rounded-lg text-xs xl:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                pathname === '/gaya-guide' 
                  ? 'text-[#F58220] bg-orange-50/80' 
                  : 'text-slate-800 hover:text-[#F58220] hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#F58220]" />
              <span>{isHindi ? 'प्रसिद्ध स्थल' : 'Famous Places'}</span>
            </Link>

            {/* Trip Plan */}
            <Link 
              href="/my-trip" 
              className={`px-2.5 py-1 rounded-lg text-xs xl:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                pathname === '/my-trip' 
                  ? 'text-blue-600 bg-blue-50/80' 
                  : 'text-slate-800 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Luggage className="w-3.5 h-3.5 text-blue-500" />
              <span>{isHindi ? 'यात्रा प्लान' : 'Trip Plan'}</span>
            </Link>

            {/* Arrangeman Link */}
            <a 
              href="https://arrangeman.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-3.5 py-1 rounded-full bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#1C0D02] text-[#F6C343] hover:text-white transition-all duration-300 font-extrabold text-xs flex items-center gap-1.5 border border-amber-400/50 shadow-xs hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5 ml-1"
              title="Visit Arrangeman.com for multi-city travel & local services"
            >
              <Globe className="w-3.5 h-3.5 text-[#F58220] shrink-0 animate-spin" style={{ animationDuration: '10s' }} />
              <span className="tracking-wide">Arrangeman (More Services)</span>
              <ArrowUpRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* AI Assistant */}
            <Link 
              href="/ai" 
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-[#C45E00] border border-[#F58220]/30 hover:border-[#F58220] hover:bg-[#F58220] hover:text-white transition-all duration-200 font-extrabold text-xs flex items-center gap-1 shadow-2xs hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F58220] group-hover:text-white shrink-0" />
              <span>{t('navAiAssistant')}</span>
            </Link>
          </div>

          {/* Right Action Area — Dynamic User Session Profile Widget */}
          <div className="hidden lg:flex items-center gap-2.5 relative shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#4A2E1A] hover:bg-[#3A2213] text-white rounded-full transition-all border border-[#F58220]/40 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#F58220] to-[#F6C343] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-inner">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left max-w-[130px] truncate">
                    <p className="text-xs font-bold text-white truncate leading-tight">{currentUser.name}</p>
                    <p className="text-[9px] text-[#F6C343] font-semibold truncate leading-tight">{getRoleLabel(currentUser)}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#F6C343]" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2">
                      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 mb-1">
                        <p className="font-extrabold text-[#4A2E1A] truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{currentUser.email || currentUser.phone}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${getRoleBadgeStyle(currentUser)}`}>
                          {getRoleLabel(currentUser)}
                        </span>
                      </div>

                      <a
                        href={getDashboardHref(currentUser)}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-800 font-bold hover:bg-orange-50 hover:text-[#F58220] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#F58220]" />
                        <span>{isHindi ? 'मेरा डैशबोर्ड खोलें' : 'Open My Dashboard'}</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>{isHindi ? 'लॉगआउट करें' : 'Log Out'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-300 hover:border-[#F58220] hover:text-[#F58220] rounded-full transition-all duration-200"
                >
                  {t('navLogin')}
                </Link>

                <Link 
                  href="/auth/register"
                  className="bg-gradient-to-r from-[#D96B00] via-[#E07210] to-[#F58220] hover:from-[#C45E00] hover:to-[#D96B00] text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm border border-orange-400/30"
                >
                  <span>{t('navGetStarted')}</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Action Trigger */}
          <div className="lg:hidden flex items-center gap-1.5 shrink-0">
            <Link 
              href="/services" 
              className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-extrabold flex items-center gap-1 shadow-xs"
            >
              <span>🧰</span>
              <span>Services</span>
            </Link>

            <button 
              aria-label="Toggle Navigation Menu" 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-slate-800 hover:bg-slate-100 active:scale-90 transition-all border border-slate-200 shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#F58220]" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* 3. Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute top-full left-0 right-0 w-full bg-white shadow-2xl border-b border-slate-200 p-4 sm:p-5 lg:hidden z-50 max-h-[85vh] overflow-y-auto space-y-4 animate-in fade-in slide-in-from-top-3 max-w-full">
            
            {/* Mobile User Header Box */}
            {currentUser ? (
              <div className="p-3.5 bg-[#2A180B] text-white rounded-2xl border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F58220] to-[#F6C343] text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-amber-200/80 truncate">{currentUser.email || currentUser.phone}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-900/50 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${getRoleBadgeStyle(currentUser)}`}>
                    {getRoleLabel(currentUser)}
                  </span>

                  <a
                    href={getDashboardHref(currentUser)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1 bg-[#F58220] text-white text-[11px] font-bold rounded-lg hover:bg-[#E07210] transition-colors"
                  >
                    My Dashboard
                  </a>
                </div>
              </div>
            ) : (
              <div className="pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Navigation Menu</span>
                <LanguageSelector variant="topbar" />
              </div>
            )}

            <ul className="flex flex-col space-y-2 text-xs font-bold text-slate-800">
              <li>
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/80 text-[#F58220]"
                >
                  <span>{t('navHome')}</span>
                  <span>🏠</span>
                </Link>
              </li>

              <li>
                <Link 
                  href="/services" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 text-[#C45E00] border border-amber-200"
                >
                  <span className="flex items-center gap-2">
                    <span>🧰</span> {t('navServices')}
                  </span>
                  <span className="text-[10px] font-extrabold bg-[#F58220] text-white px-2 py-0.5 rounded-full">All Services</span>
                </Link>
              </li>

              <li>
                <Link 
                  href="/gaya-guide" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100"
                >
                  <Compass className="w-4 h-4 text-[#F58220]" />
                  <span>{isHindi ? 'प्रसिद्ध स्थल' : 'Famous Places'}</span>
                </Link>
              </li>

              <li>
                <Link 
                  href="/my-trip" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100"
                >
                  <Luggage className="w-4 h-4 text-blue-500" />
                  <span>{isHindi ? 'यात्रा प्लान' : 'Trip Plan'}</span>
                </Link>
              </li>

              <li>
                <a 
                  href="https://arrangeman.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#1C0D02] to-[#2A180B] text-[#F6C343] border border-amber-500/40"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#F58220]" /> Arrangeman.com
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                </a>
              </li>

              <li>
                <Link 
                  href="/ai" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-orange-50/50 text-[#F58220]"
                >
                  <Sparkles className="w-4 h-4 text-[#F58220]" />
                  <span>{t('navAiAssistant')}</span>
                </Link>
              </li>

              <li>
                <Link 
                  href="/help" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-red-50 text-red-600"
                >
                  <LifeBuoy className="w-4 h-4 text-red-600" />
                  <span>{t('navHelp')}</span>
                </Link>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              {currentUser ? (
                <>
                  <a 
                    href={getDashboardHref(currentUser)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-[#F58220] text-white text-center font-extrabold py-3 text-xs rounded-xl shadow-md w-full block active:scale-95 transition-all"
                  >
                    Open My Dashboard
                  </a>
                  <button 
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="bg-red-50 text-red-700 text-center font-bold py-2.5 text-xs rounded-xl hover:bg-red-100 transition-colors w-full block cursor-pointer"
                  >
                    Log Out ({currentUser.name})
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-[#D96B00] via-[#E07210] to-[#F58220] text-white text-center font-extrabold py-3 text-xs rounded-xl shadow-md w-full block active:scale-95 transition-all"
                  >
                    {t('navGetStarted')}
                  </Link>

                  <Link 
                    href="/auth/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-slate-100 text-slate-800 text-center font-bold py-2.5 text-xs rounded-xl hover:bg-slate-200 transition-colors w-full block"
                  >
                    {t('navLogin')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

    </header>
  );
}
