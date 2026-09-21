'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Car, 
  Flame, 
  Hotel, 
  ShieldCheck, 
  Mail, 
  Activity, 
  RefreshCw, 
  Search, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  MapPin, 
  Sliders, 
  Layers, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  Crown,
  AlertTriangle,
  ArrowUpRight,
  Scissors,
  Package
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { AuditLogStore } from '@/lib/auditLogStore';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await UserStore.fetchUsersFromApi();
    setUsers(data);

    try {
      const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {}

    setLoading(false);
  };

  const syncLocalData = () => {
    setUsers(UserStore.getUsers());
    try {
      const stored = localStorage.getItem('GAYASEVA_CURRENT_USER');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', syncLocalData);
    return () => window.removeEventListener('storage', syncLocalData);
  }, []);

  const handleToggleStatus = (user: UserAccount) => {
    const newStatus = user.status === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED';
    UserStore.updateUser(user.id, { status: newStatus });
    AuditLogStore.log(
      newStatus === 'VERIFIED' ? 'USER_APPROVED' : 'USER_SUSPENDED',
      `Account: ${user.name} (${user.id})`,
      `Changed account status to ${newStatus}`,
      'USER_MANAGEMENT'
    );
    loadData();
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user from the system?')) {
      const targetUser = users.find(u => u.id === id);
      UserStore.deleteUser(id);
      AuditLogStore.log(
        'USER_DELETED',
        `Account: ${targetUser?.name || id}`,
        'Deleted user account from system store',
        'USER_MANAGEMENT'
      );
      loadData();
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalUsersCount = users.length;
  const verifiedProvidersCount = users.filter((u) => u.status === 'VERIFIED' && u.role !== 'PILGRIM').length;
  const pendingProvidersCount = users.filter((u) => u.status === 'PENDING' && u.role !== 'PILGRIM').length;
  const activeTaxisCount = users.filter((u) => u.role === 'DRIVER').length;
  const panditsCount = users.filter((u) => u.role === 'PANDIT').length;
  const barbersCount = users.filter((u) => u.role === 'BARBER').length;
  const hotelsCount = users.filter((u) => u.role === 'HOTEL').length;
  const otherVendorsCount = users.filter((u) => u.role === 'OTHER').length;

  const STATS = [
    { 
      title: 'Total Registered Accounts', 
      count: totalUsersCount.toLocaleString(), 
      label: 'Yatris, Partners & Admins', 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50/80', 
      border: 'border-blue-200 hover:border-blue-500',
      href: '/users',
      badge: null,
    },
    { 
      title: 'Verified Service Partners', 
      count: verifiedProvidersCount.toLocaleString(), 
      label: 'Approved Pandits, Drivers, Hotels', 
      icon: ShieldCheck, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50/80', 
      border: 'border-emerald-200 hover:border-emerald-500',
      href: '/verification?filter=VERIFIED',
      badge: null,
    },
    { 
      title: 'Taxi & Transport Fleet', 
      count: activeTaxisCount.toLocaleString(), 
      label: 'Sedans, SUVs, Bikes & Taxis', 
      icon: Car, 
      color: 'text-[#1E88E5]', 
      bg: 'bg-blue-50/80', 
      border: 'border-blue-200 hover:border-blue-500',
      href: '/drivers',
      badge: users.filter(u => u.role === 'DRIVER' && u.status === 'PENDING').length > 0 ? `${users.filter(u => u.role === 'DRIVER' && u.status === 'PENDING').length} Pending` : null,
    },
    { 
      title: 'Gaya Pandas & Purohits', 
      count: panditsCount.toLocaleString(), 
      label: 'Pinda Daan & Shraddha Priests', 
      icon: Flame, 
      color: 'text-[#F58220]', 
      bg: 'bg-amber-50/80', 
      border: 'border-amber-200 hover:border-amber-500',
      href: '/pandits',
      badge: users.filter(u => u.role === 'PANDIT' && u.status === 'PENDING').length > 0 ? `${users.filter(u => u.role === 'PANDIT' && u.status === 'PENDING').length} Pending` : null,
    },
    { 
      title: 'Barbers (नाई / ठाकुर)', 
      count: barbersCount.toLocaleString(), 
      label: 'Mundan & Kshaur Specialists', 
      icon: Scissors, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50/80', 
      border: 'border-rose-200 hover:border-rose-500',
      href: '/barbers',
      badge: users.filter(u => u.role === 'BARBER' && u.status === 'PENDING').length > 0 ? `${users.filter(u => u.role === 'BARBER' && u.status === 'PENDING').length} Pending` : null,
    },
    { 
      title: 'Pending Approval Queue', 
      count: pendingProvidersCount.toLocaleString(), 
      label: 'Requires Admin Verification', 
      icon: Clock, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50/80', 
      border: 'border-purple-300 hover:border-purple-500',
      href: '/verification',
      badge: pendingProvidersCount > 0 ? `${pendingProvidersCount} ACTION NEEDED` : null,
      badgeUrgent: pendingProvidersCount > 0
    },
    { 
      title: 'Hotel & Guest Houses', 
      count: hotelsCount.toLocaleString(), 
      label: 'Yatri Dharamshalas & Stays', 
      icon: Hotel, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50/80', 
      border: 'border-indigo-200 hover:border-indigo-500',
      href: '/hotels',
      badge: users.filter(u => u.role === 'HOTEL' && u.status === 'PENDING').length > 0 ? `${users.filter(u => u.role === 'HOTEL' && u.status === 'PENDING').length} Pending` : null,
    },
    { 
      title: 'Other Custom Vendors', 
      count: otherVendorsCount.toLocaleString(), 
      label: 'E-Rickshaw, Photo, Custom Services', 
      icon: Package, 
      color: 'text-teal-600', 
      bg: 'bg-teal-50/80', 
      border: 'border-teal-200 hover:border-teal-500',
      href: '/other-vendors',
      badge: users.filter(u => u.role === 'OTHER' && u.status === 'PENDING').length > 0 ? `${users.filter(u => u.role === 'OTHER' && u.status === 'PENDING').length} Pending` : null,
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Header Hero Banner with Vedic Aesthetics & Super Admin Badge */}
      <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-[#F58220]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#F58220]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-[#F6C343] font-bold uppercase tracking-widest px-3 py-1 bg-[#4A2E1A] rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-[#F58220]" />
              Super Admin Console
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold px-2.5 py-0.5 bg-emerald-950/80 rounded-full border border-emerald-700/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Node Sync Active
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
            GayaSeva Executive Administration
          </h1>
          <p className="text-xs text-[#F8F6EF]/80 max-w-xl">
            Welcome back, <strong className="text-[#F6C343] font-bold">{currentUser?.name || 'Vishal Verma'}</strong> ({currentUser?.email || 'vishalverma5359@gayaseva.com'}). Live data persistence & provider approval engine.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button 
            onClick={loadData} 
            className="px-4 py-2.5 rounded-xl border border-[#F58220]/40 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            title="Refresh Live Data Store"
          >
            <RefreshCw className={`w-4 h-4 text-[#F6C343] ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Stats</span>
          </button>
          
          <Link 
            href="/verification" 
            className="px-5 py-2.5 bg-gradient-to-r from-[#F58220] to-[#E07210] hover:from-[#E07210] hover:to-[#C86000] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Providers ({pendingProvidersCount})</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Performance Indicators Clickable Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={idx} 
              href={stat.href}
              className={`bg-white p-5 rounded-2xl shadow-xs border ${stat.border} space-y-2 transition-all hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden block cursor-pointer`}
            >
              {stat.badge && (
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs ${
                    stat.badgeUrgent 
                      ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-300' 
                      : 'bg-amber-400 text-amber-950 border border-amber-500/30'
                  }`}>
                    {stat.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-[#F58220] transition-colors">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <p className="font-serif text-3xl font-extrabold text-[#4A2E1A] group-hover:text-[#F58220] transition-colors">{stat.count}</p>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#F58220] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              
              <p className="text-[10px] text-gray-400 font-medium">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* 3. Executive Action Shortcuts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Popup Ads', href: '/popup-ads', icon: Sparkles, color: 'bg-amber-500' },
          { label: 'Slider Banners', href: '/slider-banners', icon: Layers, color: 'bg-orange-500' },
          { label: 'Sacred Places', href: '/places', icon: MapPin, color: 'bg-emerald-600' },
          { label: 'Fares & Services', href: '/services-config', icon: Sliders, color: 'bg-blue-600' },
          { label: 'QR Analytics', href: '/qr-sources', icon: Flame, color: 'bg-red-500' },
          { label: 'System Health', href: '/system-health', icon: ShieldCheck, color: 'bg-purple-600' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#F58220] shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl text-white ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#4A2E1A] group-hover:text-[#F58220] transition-colors">
                  {item.label}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#F58220] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          );
        })}
      </div>

      {/* 4. Live Registered Accounts & Service Providers Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden space-y-4 p-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#4A2E1A] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#F58220]" />
              Live User Accounts &amp; Service Provider Store
            </h2>
            <p className="text-xs text-gray-500">
              Synced with central data store. Search, filter, approve, suspend, or manage accounts.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, phone..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220] font-semibold bg-gray-50 text-gray-700"
            >
              <option value="ALL">All Roles</option>
              <option value="PILGRIM">Yatris / Pilgrims</option>
              <option value="PANDIT">Pandit Ji Partners</option>
              <option value="BARBER">Barbers (नाई / ठाकुर)</option>
              <option value="DRIVER">Driver Partners</option>
              <option value="HOTEL">Hotel Partners</option>
              <option value="OTHER">Other Custom Vendors</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                <th className="p-3.5 rounded-l-xl">User / Partner Name</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Role / Service Type</th>
                <th className="p-3.5">City / Zone</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Registered Date</th>
                <th className="p-3.5 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5 font-bold text-[#4A2E1A]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#4A2E1A] text-[#F6C343] font-extrabold flex items-center justify-center text-xs shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-[#4A2E1A]">{user.name}</p>
                          {user.customRole && (
                            <p className="text-[10px] text-[#F58220] font-medium">{user.customRole}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <p className="font-semibold text-gray-800">{user.email || 'N/A'}</p>
                      <p className="text-[11px] text-gray-500">{user.phone || 'N/A'}</p>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        user.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                        user.role === 'PANDIT' ? 'bg-orange-100 text-orange-900 border-orange-300' :
                        user.role === 'BARBER' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                        user.role === 'DRIVER' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                        user.role === 'HOTEL' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                        'bg-gray-100 text-gray-800 border-gray-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-600 font-medium">{user.city || 'Gaya Ji'}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        user.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : user.status === 'SUSPENDED'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {user.status === 'VERIFIED' ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-500 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          user.status === 'VERIFIED'
                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={user.status === 'VERIFIED' ? 'Suspend Account' : 'Verify & Approve Account'}
                      >
                        {user.status === 'VERIFIED' ? 'Suspend' : 'Approve'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
