'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserStore, UserAccount } from '@/lib/userStore';
import DynamicRoleProviderDashboardPage from '@/app/(provider)/[role]/dashboard/page';

export default function SharedProviderDashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('driver');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (stored) {
        try {
          const user: UserAccount = JSON.parse(stored);
          if (user?.role) {
            setUserRole(user.role.toLowerCase());
          }
        } catch (e) {
          // fallback
        }
      }
    }
  }, []);

  return <DynamicRoleProviderDashboardPage params={{ role: userRole }} />;
}
