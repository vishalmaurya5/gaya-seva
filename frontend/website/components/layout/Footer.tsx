'use client';

import React from 'react';
import Link from 'next/link';
import { 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Flame, 
  Car, 
  Hotel, 
  Utensils, 
  ShoppingBag,
  LifeBuoy
} from 'lucide-react';
import { GayaSevaLogo } from '@/components/ui/GayaSevaLogo';

export function Footer() {
  return (
    <footer className="bg-[#110A05] text-white pt-10 lg:pt-16 px-4 sm:px-8 md:px-16 lg:px-24 rounded-tl-3xl rounded-tr-3xl overflow-hidden border-t border-[#F58220]/25 shadow-2xl relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 md:gap-12 relative z-10">
        
        {/* Left Brand & Description Column (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <Link href="/" className="inline-block">
            <GayaSevaLogo size={58} showText={true} textColor="text-white" subtextColor="text-[#F6C343]" />
          </Link>

          <p className="text-sm text-neutral-300 max-w-md leading-relaxed">
            GayaSeva is the official 24/7 Teerth Yatri digital platform for Gaya Ji & Bodh Gaya. Connecting pilgrims directly with background-verified Teerth Pandits, station cabs, clean dharamshalas, and 24/7 emergency helplines.
          </p>

          {/* Direct Action Badges / Contact Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a 
              href="tel:+918544491413" 
              className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/30 text-[#F6C343] hover:bg-[#F58220] hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Call Helpline: +91 85444 91413"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>+91 85444 91413</span>
            </a>

            <a 
              href="https://wa.me/918544491413?text=Namaste%20GayaSeva!"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
              title="WhatsApp Support"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp</span>
            </a>

            <a 
              href="mailto:gayaseva84@gmail.com"
              className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-300 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Email Us: gayaseva84@gmail.com"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>gayaseva84@gmail.com</span>
            </a>
          </div>

          <div className="text-xs text-neutral-400 space-y-1">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F58220] shrink-0" />
              <span>Chandrachaud Line, Near Vishnupad Temple, Gaya Ji, Bihar - 823001</span>
            </p>
            <p className="text-[11px] text-amber-500/80 font-medium">
              Secondary Helplines: +91 92968 04705 | +91 73012 32069
            </p>
          </div>
        </div>

        {/* Right Navigation Links Columns (3 cols) */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 items-start">
          
          {/* Services Column */}
          <div>
            <h3 className="font-bold text-sm text-[#F6C343] mb-4 uppercase tracking-wider">Services</h3>
            <ul className="space-y-3 text-sm text-neutral-300 font-medium">
              <li><Link href="/pandit" className="hover:text-[#F58220] transition-colors">🪔 Pind Daan Pandits</Link></li>
              <li><Link href="/pick-drop" className="hover:text-[#F58220] transition-colors">🚕 Pick & Drop Cabs</Link></li>
              <li><Link href="/stay" className="hover:text-[#F58220] transition-colors">🏨 Stays & Hotels</Link></li>
              <li><Link href="/food" className="hover:text-[#F58220] transition-colors">🍱 Satvik Food</Link></li>
              <li><Link href="/healthcare" className="hover:text-[#F58220] transition-colors">🏥 Hospitals & Medical</Link></li>
              <li><Link href="/puja-material" className="hover:text-[#F58220] transition-colors">🛒 Puja Kits & Tilkut</Link></li>
            </ul>
          </div>

          {/* Gaya Guide Column */}
          <div>
            <h3 className="font-bold text-sm text-[#F6C343] mb-4 uppercase tracking-wider">Gaya Guide</h3>
            <ul className="space-y-3 text-sm text-neutral-300 font-medium">
              <li><Link href="/gaya-guide/vishnupad" className="hover:text-[#F58220] transition-colors">Vishnupad Temple</Link></li>
              <li><Link href="/gaya-guide/falgu-river" className="hover:text-[#F58220] transition-colors">Falgu River Devghat</Link></li>
              <li><Link href="/gaya-guide/bodh-gaya" className="hover:text-[#F58220] transition-colors">Bodh Gaya Mahabodhi</Link></li>
              <li><Link href="/gaya-guide" className="hover:text-[#F58220] transition-colors">48 Vedis Map Guide</Link></li>
              <li><Link href="/help" className="hover:text-red-400 transition-colors">🆘 Emergency 108/112</Link></li>
            </ul>
          </div>

          {/* Account & Partner Column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-sm text-[#F6C343] mb-4 uppercase tracking-wider">Yatri Portal</h3>
            <ul className="space-y-3 text-sm text-neutral-300 font-medium">
              <li><Link href="/auth/login" className="hover:text-[#F58220] transition-colors">Partner Login</Link></li>
              <li><Link href="/auth/register" className="hover:text-[#F58220] transition-colors">Create Yatri Account</Link></li>
              <li className="flex items-center gap-2">
                <Link href="/provider/register" className="hover:text-[#F58220] transition-colors">Register Service</Link>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 border border-amber-400 text-amber-300 font-bold">0% COMM</span>
              </li>
              <li><Link href="/help/lost-and-found" className="hover:text-[#F58220] transition-colors">Lost & Found</Link></li>
              <li><Link href="/ai" className="hover:text-[#F58220] transition-colors">AI Yatri Companion</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Arrangeman Innovation & Management Box */}
      <div className="max-w-7xl mx-auto mt-10 p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-[#2A180B] to-amber-950/80 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[#F6C343] font-extrabold text-[10px] uppercase tracking-wider border border-amber-400/30 inline-block">
            INNOVATION & MANAGEMENT NETWORK
          </span>
          <h4 className="font-serif font-bold text-sm text-white">
            This platform, website, brand & startup innovation is managed & powered by Arrangeman
          </h4>
          <p className="text-xs text-neutral-300">
            Visit <strong className="text-amber-300 font-bold">arrangeman.com</strong> for multi-city travel, event management, lodging & verified local services.
          </p>
        </div>
        <a 
          href="https://arrangeman.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 active:scale-95 border border-orange-400/40"
        >
          <span>Visit Arrangeman.com &rarr;</span>
        </a>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-neutral-800 flex flex-wrap justify-between items-center text-xs text-neutral-400 relative z-10 gap-2">
        <p>© 2026 GayaSeva Pilgrim Platform. All rights reserved. Managed by Arrangeman Innovation Group.</p>
        <p className="flex items-center gap-1">
          <span>Dedicated to Yatri Devotees Worldwide</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        </p>
      </div>

      {/* Bottom Mega Glow & Large Outlined Title */}
      <div className="relative z-0 overflow-hidden max-w-full">
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-[#F58220]/25 rounded-full blur-[160px] pointer-events-none" />
        <h3 className="text-center font-extrabold leading-[0.7] text-transparent text-[clamp(2.5rem,12vw,12rem)] [-webkit-text-stroke:1px_#8A4300] mt-6 select-none opacity-90 truncate max-w-full">
          GayaSeva
        </h3>
      </div>
    </footer>
  );
}

export default Footer;
