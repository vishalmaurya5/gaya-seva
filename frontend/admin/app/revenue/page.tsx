'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Users, Layers, ShieldCheck, RefreshCw, 
  BarChart3, PieChart as PieChartIcon, Calendar, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

interface RevenueMetrics {
  grossRevenue: number;
  totalRefunds: number;
  netRevenue: number;
  customerAccessRevenue: number;
  providerRegistrationRevenue: number;
  bookingRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  activeCustomerPasses: number;
}

interface ChartItem {
  date: string;
  gross: number;
  count: number;
}

export default function DedicatedAdminRevenuePage() {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'TODAY' | '7D' | '30D' | 'ALL'>('30D');

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/revenue');
      const data = await res.json();
      if (data.metrics) {
        setMetrics(data.metrics);
        setChartData(data.chartData || []);
      }
    } catch (e) {
      console.error('Failed to fetch revenue metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const maxGross = Math.max(...chartData.map((d) => d.gross), 50);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#2A180B] via-[#4A2E1A] to-[#2A180B] p-6 sm:p-8 rounded-3xl text-white shadow-xl gap-4 border border-amber-900/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider px-3 py-1 bg-amber-950/80 rounded-full border border-amber-500/40">
              Server-Verified Database Revenue Audit
            </span>
            <span className="text-[10px] text-emerald-300 font-bold px-2.5 py-0.5 bg-emerald-950/80 rounded-full border border-emerald-500/40">
              Zero Fake Metrics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            GayaSeva Master Financial &amp; Revenue Telemetry
          </h1>
          <p className="text-xs text-amber-200/80 mt-1 max-w-2xl">
            Real-time server calculated Gross Revenue, Net Revenue, Refunds, and Purpose-wise Financial Ledger.
          </p>
        </div>

        <button
          onClick={fetchRevenue}
          disabled={loading}
          className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs rounded-2xl border border-amber-500/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          Sync Financial Data
        </button>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
          <div className="bg-gradient-to-br from-white to-amber-50/60 p-6 rounded-3xl border border-amber-100 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider">Gross Revenue</span>
            <p className="text-3xl font-black text-[#4A2E1A]">&#8377;{metrics.grossRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {metrics.successfulTransactions} verified payments
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-emerald-50/60 p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-emerald-900 tracking-wider">Net Revenue</span>
            <p className="text-3xl font-black text-emerald-700">&#8377;{metrics.netRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-gray-500">Gross minus processed refunds</p>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50/60 p-6 rounded-3xl border border-orange-100 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-orange-900 tracking-wider">Provider Registration</span>
            <p className="text-2xl font-black text-[#F58220]">&#8377;{metrics.providerRegistrationRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-orange-600 font-semibold">₹49 onboarding fee collection</p>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50/60 p-6 rounded-3xl border border-blue-100 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-blue-900 tracking-wider">Customer Access Passes</span>
            <p className="text-2xl font-black text-blue-700">&#8377;{metrics.customerAccessRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-blue-600 font-semibold">{metrics.activeCustomerPasses} active user passes</p>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#4A2E1A] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" /> Daily Revenue Velocity (Last 14 Days)
              </h2>
              <p className="text-xs text-gray-400">Server verified daily gross receipts</p>
            </div>
          </div>

          <div className="h-64 w-full relative">
            {chartData.length > 0 ? (
              <div className="w-full h-full flex flex-col">
                <div className="relative flex-1 flex items-end gap-2 px-2">
                  {chartData.map((item, idx) => {
                    const hp = maxGross > 0 ? Math.max((item.gross / maxGross) * 100, 4) : 4;
                    const empty = item.gross === 0;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-10">
                          {item.date}: &#8377;{item.gross} ({item.count} txn)
                        </div>
                        {!empty && (
                          <span className="text-[9px] font-bold text-gray-700 mb-1">&#8377;{item.gross}</span>
                        )}
                        <div
                          style={{ height: `${hp}%` }}
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            empty ? 'bg-gray-100' : 'bg-gradient-to-t from-[#4A2E1A] to-emerald-600 hover:to-emerald-500'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2 border-t border-gray-100 pt-2 px-2">
                  {chartData.map((item, idx) => (
                    <span key={idx} className="flex-1 text-center truncate text-[9px] font-bold text-gray-400">
                      {item.date}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-400">Loading chart data...</div>
            )}
          </div>
        </div>

        {/* Timeframe Summary Card */}
        {metrics && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md space-y-5">
            <h2 className="font-serif font-bold text-lg text-[#4A2E1A] border-b pb-3">Timeframe Summaries</h2>
            <div className="space-y-3 text-xs font-medium">
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 flex justify-between items-center">
                <span className="text-gray-600">Today's Revenue</span>
                <span className="font-black text-base text-[#4A2E1A]">&#8377;{metrics.todayRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex justify-between items-center">
                <span className="text-gray-600">This Week (7 Days)</span>
                <span className="font-black text-base text-emerald-800">&#8377;{metrics.weekRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex justify-between items-center">
                <span className="text-gray-600">This Month (30 Days)</span>
                <span className="font-black text-base text-blue-800">&#8377;{metrics.monthRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex justify-between items-center">
                <span className="text-gray-600">All-Time Gross</span>
                <span className="font-black text-base text-purple-900">&#8377;{metrics.grossRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
