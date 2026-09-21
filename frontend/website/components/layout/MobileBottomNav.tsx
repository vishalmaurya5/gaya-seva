'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Bot, HelpCircle, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { name: t('mobHome'), href: '/', icon: Home },
    { name: t('mobServices'), href: '/services', icon: Grid },
    { name: t('mobAi'), href: '/ai', icon: Bot },
    { name: t('mobHelp'), href: '/help', icon: HelpCircle },
    { name: t('mobAccount'), href: '/dashboard', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#2A180B] text-white border-t border-[#F58220]/20 md:hidden px-2 py-2 shadow-2xl">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-[#F58220] font-bold' : 'text-[#F8F6EF]/70 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
