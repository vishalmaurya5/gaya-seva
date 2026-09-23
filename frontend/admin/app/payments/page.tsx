'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CreditCard, DollarSign, Sliders, Search,
  CheckCircle2, Clock, AlertTriangle, RefreshCw, Save,
  TrendingUp, Users, BarChart3, PieChart as PieChartIcon,
  Eye, X, ShieldCheck, Calendar, Layers,
  UserCheck, Phone, Mail, ChevronDown, ChevronUp, Activity, Hash,
} from 'lucide-react';
import { ConfigStore, SystemConfig } from '@/lib/configStore';
import { PaymentStore, PaymentRecord } from '@/lib/paymentStore';
import { AuditLogStore } from '@/lib/auditLogStore';
import { UserStore, UserAccount } from '@/lib/userStore';

type GraphMode = 'DAY' | 'WEEK' | 'MONTH';
type Timeframe = 'ALL' | '30D' | '7D' | 'TODAY';

function getWeekLabel(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}
function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

function buildChartData(payments: PaymentRecord[], mode: GraphMode, timeframe: Timeframe) {
  const now = new Date();
  const map: { [key: string]: { amount: number; count: number } } = {};
  if (mode === 'DAY') {
    const days = timeframe === 'TODAY' ? 1 : timeframe === '7D' ? 7 : 14;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      map[d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })] = { amount: 0, count: 0 };
    }
  } else if (mode === 'WEEK') {
    const weeks = timeframe === '7D' ? 4 : timeframe === '30D' ? 8 : 12;
    for (let i = weeks - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i * 7);
      map[getWeekLabel(d)] = { amount: 0, count: 0 };
    }
  } else {
    const months = timeframe === 'ALL' ? 6 : 3;
    for (let i = months - 1; i >= 0; i--) {
      map[getMonthLabel(new Date(now.getFullYear(), now.getMonth() - i, 1))] = { amount: 0, count: 0 };
    }
  }
  payments.forEach((p) => {
    if (p.status !== 'SUCCESS') return;
    const d = new Date(p.createdAt);
    const key = mode === 'DAY'
      ? d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
      : mode === 'WEEK' ? getWeekLabel(d) : getMonthLabel(d);
    if (map[key] !== undefined) { map[key].amount += p.amount; map[key].count += 1; }
  });
  return Object.entries(map).map(([label, v]) => ({ label, ...v }));
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [config, setConfig] = useState<SystemConfig>(ConfigStore.getConfig());
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [notification, setNotification] = useState('');
  const [customerAccessFee, setCustomerAccessFee] = useState<number>(5);
  const [providerRegFee, setProviderRegFee] = useState<number>(49);
  const [accessDurationDays, setAccessDurationDays] = useState<number>(0);
  const [paymentEnabled, setPaymentEnabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');
  const [graphMode, setGraphMode] = useState<GraphMode>('DAY');
  const [whoSortAsc, setWhoSortAsc] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  const userMap = useMemo<Record<string, UserAccount>>(() => {
    const m: Record<string, UserAccount> = {};
    users.forEach((u) => { m[u.id] = u; });
    return m;
  }, [users]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [latestConfig, latestPayments, latestUsers] = await Promise.all([
        ConfigStore.fetchConfig(),
        PaymentStore.fetchPaymentsFromApi(),
        UserStore.fetchUsersFromApi(),
      ]);
      setConfig(latestConfig);
      setCustomerAccessFee(latestConfig.customer_access_fee);
      setProviderRegFee(latestConfig.provider_registration_fee);
      setAccessDurationDays(latestConfig.customer_access_duration_days);
      setPaymentEnabled(latestConfig.payment_enabled);
      setPayments(latestPayments);
      setUsers(latestUsers);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingConfig(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_access_fee: Number(customerAccessFee), provider_registration_fee: Number(providerRegFee), customer_access_duration_days: Number(accessDurationDays), payment_enabled: Boolean(paymentEnabled) }),
      });
      if (res.ok) {
        const updated = await res.json(); setConfig(updated); ConfigStore.saveConfig(updated);
        AuditLogStore.log('FEE_SETTINGS_UPDATED', 'System Config', `Updated fees`, 'SYSTEM_CONFIG');
        setNotification('Settings updated and audit logged!');
        setTimeout(() => setNotification(''), 4000);
      } else { alert('Failed to update config'); }
    } catch (err: any) { alert(`Error: ${err.message}`); }
    finally { setSavingConfig(false); }
  };

  const timeframedPayments = useMemo(() => {
    const now = new Date();
    return payments.filter((p) => {
      const d = new Date(p.createdAt);
      if (timeframe === 'TODAY') return d.toDateString() === now.toDateString();
      if (timeframe === '7D') return (now.getTime() - d.getTime()) / 86400000 <= 7;
      if (timeframe === '30D') return (now.getTime() - d.getTime()) / 86400000 <= 30;
      return true;
    });
  }, [payments, timeframe]);

  const filteredPayments = useMemo(() => {
    return timeframedPayments.filter((p) => {
      const u = userMap[p.userId]; const sl = searchQuery.toLowerCase();
      const ms = p.id.toLowerCase().includes(sl) || p.userId.toLowerCase().includes(sl) ||
        p.razorpayOrderId.toLowerCase().includes(sl) ||
        (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(sl)) ||
        (u?.name?.toLowerCase().includes(sl)) || (u?.email?.toLowerCase().includes(sl)) || (u?.phone?.toLowerCase().includes(sl));
      return ms && (purposeFilter === 'ALL' || p.purpose === purposeFilter) && (statusFilter === 'ALL' || p.status === statusFilter);
    });
  }, [timeframedPayments, searchQuery, purposeFilter, statusFilter, userMap]);

  const successPayments = useMemo(() => timeframedPayments.filter((p) => p.status === 'SUCCESS'), [timeframedPayments]);
  const totalRevenue = useMemo(() => successPayments.reduce((a, p) => a + p.amount, 0), [successPayments]);
  const customerRevenue = useMemo(() => successPayments.filter((p) => p.purpose === 'CUSTOMER_ACCESS').reduce((a, p) => a + p.amount, 0), [successPayments]);
  const providerRevenue = useMemo(() => successPayments.filter((p) => p.purpose === 'PROVIDER_REGISTRATION').reduce((a, p) => a + p.amount, 0), [successPayments]);
  const successCount = successPayments.length;
  const pendingCount = useMemo(() => timeframedPayments.filter((p) => p.status === 'PENDING').length, [timeframedPayments]);
  const failedCount = useMemo(() => timeframedPayments.filter((p) => p.status === 'FAILED').length, [timeframedPayments]);
  const totalCount = timeframedPayments.length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 100;

  const chartData = useMemo(() => buildChartData(timeframedPayments, graphMode, timeframe), [timeframedPayments, graphMode, timeframe]);
  const maxChart = Math.max(...chartData.map((d) => d.amount), 50);

  const whoPaidList = useMemo(() => [...successPayments]
    .sort((a, b) => { const diff = new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime(); return whoSortAsc ? -diff : diff; })
    .map((p) => ({ payment: p, user: userMap[p.userId] })), [successPayments, userMap, whoSortAsc]);

  const dayWiseData = useMemo(() => {
    const map: Record<string, { date: string; revenue: number; count: number }> = {};
    successPayments.forEach((p) => {
      const key = new Date(p.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
      if (!map[key]) map[key] = { date: key, revenue: 0, count: 0 };
      map[key].revenue += p.amount; map[key].count += 1;
    });
    return Object.values(map).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [successPayments]);

  const purposeBadge = (purpose: string) => {
    if (purpose === 'CUSTOMER_ACCESS') return <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">Customer</span>;
    if (purpose === 'PROVIDER_REGISTRATION') return <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">Provider</span>;
    return <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-gray-50 text-gray-600 border border-gray-200">{purpose}</span>;
  };
  const statusBadge = (status: string) => {
    if (status === 'SUCCESS') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />OK</span>;
    if (status === 'PENDING') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 inline-flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Failed</span>;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">

      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#2A180B] via-[#4A2E1A] to-[#2A180B] p-6 sm:p-8 rounded-3xl text-white shadow-xl gap-4 border border-amber-900/30">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider px-3 py-1 bg-amber-950/80 rounded-full border border-amber-500/40">Graph Analytics Revenue Engineering</span>
            <span className="text-[10px] text-emerald-300 font-bold px-2.5 py-0.5 bg-emerald-950/80 rounded-full border border-emerald-500/40">Razorpay HMAC Verified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-[#F58220]" />
            Revenue Intelligence Dashboard
          </h1>
          <p className="text-xs text-amber-200/80 mt-1 max-w-2xl">
            Day-wise, week-wise and month-wise revenue telemetry with real-time Who Paid identity resolution and Razorpay audit logs.
          </p>
        </div>
        <button onClick={loadData} className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs rounded-2xl border border-amber-500/30 flex items-center gap-2 transition-all cursor-pointer">
          <RefreshCw className={`w-4 h-4 text-[#F58220] ${loading ? 'animate-spin' : ''}`} />
          Sync Ledger
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />{notification}
        </div>
      )}

      {/* ─── Filters ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#F58220] ml-1" />
          <span className="font-bold text-gray-700">Timeframe:</span>
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            {(['ALL', '30D', '7D', 'TODAY'] as const).map((t) => (
              <button key={t} onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeframe === t ? 'bg-white text-[#4A2E1A] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                {t === 'ALL' ? 'All Time' : t === '30D' ? '30 Days' : t === '7D' ? '7 Days' : 'Today'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#F58220]" />
          <span className="font-bold text-gray-700">Graph:</span>
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            {(['DAY', 'WEEK', 'MONTH'] as const).map((m) => (
              <button key={m} onClick={() => setGraphMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${graphMode === m ? 'bg-[#F58220] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                {m === 'DAY' ? 'Day-wise' : m === 'WEEK' ? 'Week-wise' : 'Month-wise'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── KPI Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-white to-amber-50/60 p-5 rounded-3xl border border-amber-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold uppercase text-[10px] tracking-wider text-amber-900">Total Revenue</span>
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700"><DollarSign className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-black text-[#4A2E1A]">&#8377;{totalRevenue.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600"><TrendingUp className="w-3.5 h-3.5" />{successCount} transactions</div>
        </div>
        <div className="bg-gradient-to-br from-white to-emerald-50/60 p-5 rounded-3xl border border-emerald-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold uppercase text-[10px] tracking-wider text-emerald-900">Customer Pass</span>
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700"><Users className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-emerald-700">&#8377;{customerRevenue.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">{successPayments.filter((p) => p.purpose === 'CUSTOMER_ACCESS').length} passes</p>
        </div>
        <div className="bg-gradient-to-br from-white to-orange-50/60 p-5 rounded-3xl border border-orange-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold uppercase text-[10px] tracking-wider text-orange-900">Provider Reg.</span>
            <div className="p-2 bg-orange-100 rounded-xl text-orange-700"><Layers className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-[#F58220]">&#8377;{providerRevenue.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-orange-600 font-semibold">{successPayments.filter((p) => p.purpose === 'PROVIDER_REGISTRATION').length} partners</p>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50/60 p-5 rounded-3xl border border-blue-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold uppercase text-[10px] tracking-wider text-blue-900">Gateway Health</span>
            <div className="p-2 bg-blue-100 rounded-xl text-blue-700"><ShieldCheck className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-blue-700">{successRate}%</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 flex-wrap">
            <span className="text-emerald-600">{successCount} ok</span><span>·</span>
            <span className="text-amber-600">{pendingCount} pend</span><span>·</span>
            <span className="text-red-500">{failedCount} fail</span>
          </div>
        </div>
      </div>

      {/* ─── Graph Section ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#4A2E1A] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#F58220]" />
                Revenue Velocity — {graphMode === 'DAY' ? 'Day-wise' : graphMode === 'WEEK' ? 'Week-wise' : 'Month-wise'}
              </h2>
              <p className="text-xs text-gray-400">Gross revenue trajectory, loop-rendered bars</p>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">Loop Rendered</span>
          </div>
          <div className="h-64 w-full relative">
            {chartData.length > 0 ? (
              <div className="w-full h-full flex flex-col">
                <div className="relative flex-1 flex items-end gap-1.5 px-1">
                  {chartData.map((item, index) => {
                    const hp = maxChart > 0 ? Math.max((item.amount / maxChart) * 100, 4) : 4;
                    const empty = item.amount === 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-10 shadow-xl">
                          <p className="text-amber-300">{item.label}</p>
                          <p>&#8377;{item.amount.toLocaleString('en-IN')}</p>
                          <p className="text-gray-400">{item.count} txn</p>
                        </div>
                        {!empty && <span className="text-[9px] font-black text-[#4A2E1A] mb-1 group-hover:text-[#F58220] transition-colors">{item.amount >= 1000 ? `${(item.amount / 1000).toFixed(1)}k` : item.amount}</span>}
                        <div style={{ height: `${hp}%` }} className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 shadow-sm ${empty ? 'bg-gray-100' : 'bg-gradient-to-t from-[#4A2E1A] via-[#C4501A] to-[#F58220] hover:to-[#FFD580]'}`} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-1.5 border-t border-gray-200 pt-2 px-1">
                  {chartData.map((item, idx) => <span key={idx} className="flex-1 text-center truncate text-[9px] font-bold text-gray-400">{item.label}</span>)}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-400">No data for this timeframe.</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md space-y-5 flex flex-col">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="font-serif font-bold text-lg text-[#4A2E1A] flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-[#F58220]" />Revenue Split</h2>
            <p className="text-xs text-gray-400">Proportional by fee type</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Customer Pass</span>
                <span className="font-mono">&#8377;{customerRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${totalRevenue > 0 ? (customerRevenue / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F58220] inline-block" />Provider Reg</span>
                <span className="font-mono">&#8377;{providerRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#F58220] h-full rounded-full transition-all duration-700" style={{ width: `${totalRevenue > 0 ? (providerRevenue / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
          <div className="pt-1 space-y-2 flex-1">
            <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Daily Breakdown</p>
            <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
              {dayWiseData.length === 0 ? <p className="text-xs text-gray-400 text-center py-3">No data</p> : dayWiseData.slice(0, 10).map((d, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] bg-amber-50/60 px-3 py-2 rounded-xl border border-amber-100/80">
                  <span className="font-semibold text-gray-600">{d.date}</span>
                  <span className="font-black text-[#4A2E1A]">&#8377;{d.revenue.toLocaleString('en-IN')}</span>
                  <span className="text-gray-400 font-mono">{d.count}t</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-center text-gray-400 font-mono border-t border-gray-100 pt-2">GayaSeva Revenue Engine v3.0</div>
        </div>
      </div>

      {/* ─── Who Paid Ledger ──────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#F58220]" />
            <div>
              <h2 className="font-serif font-bold text-lg text-[#4A2E1A]">Who Paid — Identity Ledger</h2>
              <p className="text-xs text-gray-400">All successful transactions with user identity</p>
            </div>
          </div>
          <button onClick={() => setWhoSortAsc(!whoSortAsc)} className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#4A2E1A] font-bold text-xs rounded-xl transition-all cursor-pointer">
            {whoSortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {whoSortAsc ? 'Oldest First' : 'Newest First'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A2E1A]">
            <thead className="bg-[#2A180B] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Purpose</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Date &amp; Time</th>
                <th className="px-5 py-4">Payment ID</th>
                <th className="px-5 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {whoPaidList.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No successful payments for this timeframe.</td></tr>
              ) : whoPaidList.map(({ payment: p, user }) => (
                <tr key={p.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F58220] to-[#4A2E1A] flex items-center justify-center text-white font-black text-xs shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-bold">{user?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{p.userId.substring(0, 14)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {user ? (
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-[11px] text-gray-600"><Mail className="w-3 h-3 text-gray-400 shrink-0" /><span className="truncate max-w-[130px]">{user.email}</span></p>
                        <p className="flex items-center gap-1 text-[11px] text-gray-600"><Phone className="w-3 h-3 text-gray-400 shrink-0" />{user.phone}</p>
                      </div>
                    ) : <span className="text-gray-400 italic text-[11px]">Not resolved</span>}
                  </td>
                  <td className="px-5 py-4">
                    {p.purpose === 'CUSTOMER_ACCESS'
                      ? <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-200">Customer Pass</span>
                      : p.purpose === 'PROVIDER_REGISTRATION'
                        ? <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200">Provider Reg</span>
                        : <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-gray-50 text-gray-700 border border-gray-200">{p.purpose}</span>}
                    {user?.role && <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{user.role.toLowerCase()}</p>}
                  </td>
                  <td className="px-5 py-4 font-black text-sm">
                    &#8377;{p.amount.toLocaleString('en-IN')}
                    <p className="text-[10px] text-gray-400 font-normal">{p.currency}</p>
                  </td>
                  <td className="px-5 py-4 text-[11px] text-gray-600">
                    <p className="font-semibold">{new Date(p.paidAt || p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-gray-400">{new Date(p.paidAt || p.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-[10px] text-gray-500">
                    {p.razorpayPaymentId ? <div><p>{p.razorpayPaymentId}</p><p className="text-gray-400">{p.razorpayOrderId}</p></div> : <span className="text-gray-300 italic">Pending</span>}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => setSelectedPayment(p)} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#4A2E1A] font-bold text-[11px] rounded-xl border border-amber-200 inline-flex items-center gap-1 transition-all cursor-pointer">
                      <Eye className="w-3.5 h-3.5 text-[#F58220]" />Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── All Transactions ─────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#F58220]" />
            <h2 className="font-serif font-bold text-base text-[#4A2E1A]">All Transactions</h2>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-lg text-[10px]">{filteredPayments.length} records</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search name, ID, email..." className="pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#F58220] w-52" />
            </div>
            <select value={purposeFilter} onChange={(e) => setPurposeFilter(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none">
              <option value="ALL">All Purposes</option>
              <option value="CUSTOMER_ACCESS">Customer Access</option>
              <option value="PROVIDER_REGISTRATION">Provider Reg</option>
              <option value="BOOKING">Booking</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none">
              <option value="ALL">All Status</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A2E1A]">
            <thead className="bg-[#4A2E1A] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Transaction</th>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Purpose</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredPayments.length === 0
                ? <tr><td colSpan={7} className="text-center py-10 text-gray-400">No matching records found.</td></tr>
                : filteredPayments.map((p) => {
                  const user = userMap[p.userId];
                  return (
                    <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold truncate max-w-[120px]">{p.id}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]">{p.razorpayOrderId}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold">{user?.name || '—'}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate max-w-[100px]">{p.userId}</p>
                      </td>
                      <td className="px-5 py-3.5">{purposeBadge(p.purpose)}</td>
                      <td className="px-5 py-3.5 font-black">&#8377;{p.amount}</td>
                      <td className="px-5 py-3.5">{statusBadge(p.status)}</td>
                      <td className="px-5 py-3.5 text-[11px] text-gray-600">
                        {new Date(p.paidAt || p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => setSelectedPayment(p)} className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#4A2E1A] font-bold text-[10px] rounded-xl border border-amber-200 inline-flex items-center gap-1 transition-all cursor-pointer">
                          <Eye className="w-3 h-3 text-[#F58220]" />View
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Admin Fee Config ─────────────────────────────── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#F58220]" />
            <h2 className="font-serif font-bold text-lg text-[#4A2E1A]">Admin Configurable System Fees</h2>
          </div>
          <span className="text-[10px] font-bold text-gray-400">Server-Side Derived Rules</span>
        </div>
        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Customer Access Fee (&#8377;) *</label>
            <input type="number" required min={1} value={customerAccessFee} onChange={(e) => setCustomerAccessFee(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F58220] font-bold text-sm text-[#4A2E1A] bg-gray-50/50" />
            <p className="text-[10px] text-gray-400 mt-1">Fee to unlock provider contacts.</p>
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Provider Registration Fee (&#8377;) *</label>
            <input type="number" required min={1} value={providerRegFee} onChange={(e) => setProviderRegFee(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F58220] font-bold text-sm text-[#4A2E1A] bg-gray-50/50" />
            <p className="text-[10px] text-gray-400 mt-1">Onboarding fee for service providers.</p>
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Access Pass Validity (Days)</label>
            <input type="number" required min={0} value={accessDurationDays} onChange={(e) => setAccessDurationDays(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F58220] font-bold text-sm text-[#4A2E1A] bg-gray-50/50" />
            <p className="text-[10px] text-gray-400 mt-1">Set 0 for Lifetime Access.</p>
          </div>
          <div className="sm:col-span-3 flex justify-between items-center pt-4 border-t gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={paymentEnabled} onChange={(e) => setPaymentEnabled(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
              <span className="font-extrabold text-gray-800 text-xs">Master Razorpay Gateway Enabled</span>
            </label>
            <button type="submit" disabled={savingConfig} className="px-6 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50">
              <Save className="w-4 h-4" />
              {savingConfig ? 'Saving...' : 'Save & Log Configuration'}
            </button>
          </div>
        </form>
      </div>

      {/* ─── Inspection Modal ─────────────────────────────── */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 relative">
            <button onClick={() => setSelectedPayment(null)} className="absolute right-6 top-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-2xl text-[#F58220]"><CreditCard className="w-6 h-6" /></div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4A2E1A]">Transaction Inspection</h3>
                <p className="text-xs text-gray-400 font-mono">{selectedPayment.id}</p>
              </div>
            </div>
            {userMap[selectedPayment.userId] && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F58220] to-[#4A2E1A] flex items-center justify-center text-white font-black">
                  {userMap[selectedPayment.userId].name.charAt(0).toUpperCase()}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#4A2E1A] text-sm">{userMap[selectedPayment.userId].name}</p>
                  <p className="text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{userMap[selectedPayment.userId].email}</p>
                  <p className="text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{userMap[selectedPayment.userId].phone}</p>
                </div>
              </div>
            )}
            <div className="space-y-2.5 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
              {([
                ['Razorpay Order ID', selectedPayment.razorpayOrderId],
                ['Razorpay Payment ID', selectedPayment.razorpayPaymentId || 'N/A'],
                ['User Account ID', selectedPayment.userId],
                ['Payment Purpose', selectedPayment.purpose],
                ['Amount Paid', `\u20B9${selectedPayment.amount} ${selectedPayment.currency}`],
                ['Status', selectedPayment.status],
                ['Timestamp', new Date(selectedPayment.paidAt || selectedPayment.createdAt).toLocaleString('en-IN')],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between py-1 border-b border-gray-200/60 last:border-0">
                  <span className="font-semibold text-gray-500">{label}:</span>
                  <span className="font-bold text-gray-800 text-right max-w-[55%] break-all">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-1">
                <span className="font-semibold text-gray-500">Signature:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />HMAC SHA256 Verified</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setSelectedPayment(null)} className="px-6 py-2.5 bg-[#4A2E1A] hover:bg-[#2A180B] text-white font-bold text-xs rounded-xl transition-all cursor-pointer">Close Inspection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
