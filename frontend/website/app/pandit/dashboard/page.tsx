'use client';

import React from 'react';
import DynamicRoleProviderDashboardPage from '@/app/(provider)/[role]/dashboard/page';

export default function PanditDashboardPage() {
  return <DynamicRoleProviderDashboardPage params={{ role: 'pandit' }} />;
}
