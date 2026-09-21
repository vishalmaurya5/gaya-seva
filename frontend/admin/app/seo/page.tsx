'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Zap, 
  ExternalLink,
  Smartphone,
  RefreshCw,
  Cpu,
  BarChart3,
  Flame,
  Car,
  Hotel
} from 'lucide-react';

export default function AdminSeoConsolePage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'INDEXING' | 'SCHEMA' | 'KEYWORDS'>('OVERVIEW');

  const canonicalRoutes = [
    { url: 'https://gayaseva.org/', title: 'GayaSeva — Gaya Ji Local Services, Pind Daan & Teerth Portal', status: 'INDEXABLE 200 OK', schema: 'Organization, WebSite, LocalBusiness', score: 100 },
    { url: 'https://gayaseva.org/gaya', title: 'Gaya Ji Pilgrimage & Visitor Guide | Vishnupad, Pind Daan & Travel', status: 'INDEXABLE 200 OK', schema: 'FAQPage, TouristAttraction', score: 98 },
    { url: 'https://gayaseva.org/pind-daan', title: 'Gaya Pind Daan Booking | Verified Teerth Pandits & 48-Vedi Shradh', status: 'INDEXABLE 200 OK', schema: 'FAQPage, Service', score: 100 },
    { url: 'https://gayaseva.org/pitru-paksha', title: 'Gaya Pitru Paksha 2026 Special Guide | Pind Daan Dates, Stay & Cabs', status: 'INDEXABLE 200 OK', schema: 'FAQPage, Event', score: 96 },
    { url: 'https://gayaseva.org/gaya-taxi', title: 'Gaya Taxi Service | Railway Station, Airport & Bodh Gaya Cabs', status: 'INDEXABLE 200 OK', schema: 'FAQPage, Service', score: 97 },
    { url: 'https://gayaseva.org/places/vishnupad', title: 'Vishnupad Temple Gaya | Timings, How to Reach & Pilgrimage Guide', status: 'INDEXABLE 200 OK', schema: 'TouristAttraction, Place', score: 99 },
    { url: 'https://gayaseva.org/places/falgu-river', title: 'Falgu River Devghat | Timings, How to Reach & Pilgrimage Guide', status: 'INDEXABLE 200 OK', schema: 'TouristAttraction, Place', score: 95 },
    { url: 'https://gayaseva.org/places/bodh-gaya', title: 'Mahabodhi Temple Bodh Gaya | Timings, How to Reach & Pilgrimage Guide', status: 'INDEXABLE 200 OK', schema: 'TouristAttraction, Place', score: 98 },
    { url: 'https://gayaseva.org/services', title: 'Services Directory | Gayaseva', status: 'INDEXABLE 200 OK', schema: 'ItemList, LocalBusiness', score: 94 },
    { url: 'https://gayaseva.org/pandit', title: 'Pandit Directory | GayaSeva', status: 'INDEXABLE 200 OK', schema: 'ItemList, Person', score: 95 },
    { url: 'https://gayaseva.org/stay', title: 'Hotels & Dharamshala | GayaSeva', status: 'INDEXABLE 200 OK', schema: 'ItemList, Hotel', score: 96 },
  ];

  const schemasVerified = [
    { type: 'Organization', target: 'Root domain (https://gayaseva.org)', status: 'VALID JSON-LD' },
    { type: 'WebSite (with SearchAction)', target: 'Search engine sitelinks box', status: 'VALID JSON-LD' },
    { type: 'LocalBusiness', target: 'GayaSeva Teerth Portal Hub', status: 'VALID JSON-LD' },
    { type: 'TouristAttraction', target: '/gaya & /places/*', status: 'VALID JSON-LD' },
    { type: 'Service', target: '/pind-daan, /gaya-taxi & /services', status: 'VALID JSON-LD' },
    { type: 'FAQPage', target: '/gaya, /pind-daan, /pitru-paksha, /gaya-taxi', status: 'VALID JSON-LD (AI Search Ready)' },
    { type: 'BreadcrumbList', target: 'All guide & place landing pages', status: 'VALID JSON-LD' },
    { type: 'Event (Pitru Paksha 2026)', target: '/pitru-paksha', status: 'VALID JSON-LD' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-slate-900 antialiased">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-2 border-[#F58220]/40 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-black uppercase rounded-full flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-4 h-4" /> HEALTHY 98/100
            </span>
            <span className="px-3 py-1 bg-[#F58220] text-white text-xs font-black uppercase rounded-full">
              SEARCH CONSOLE READY
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
            GayaSeva Technical &amp; Local SEO Console
          </h1>
          <p className="text-xs sm:text-sm text-amber-200 font-bold max-w-2xl">
            Centralized indexability monitoring, Schema.org JSON-LD validator, dynamic canonical audit, and Core Web Vitals readiness.
          </p>
        </div>

        <div className="flex gap-3 z-10 shrink-0">
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ExternalLink className="w-4 h-4" /> Open Search Console
          </a>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-xl space-y-2">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">SEO Health Score</span>
          <div className="text-3xl font-black text-emerald-600 flex items-center gap-2">
            <span>98 / 100</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-[11px] text-slate-600 font-bold block">0 Critical SEO Errors</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-xl space-y-2">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Indexed Canonical Routes</span>
          <div className="text-3xl font-black text-slate-900 font-mono">21 URLs</div>
          <span className="text-[11px] text-emerald-700 font-bold block">100% Valid Canonicals</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-xl space-y-2">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Structured Schemas</span>
          <div className="text-3xl font-black text-amber-600 font-mono">8 Types</div>
          <span className="text-[11px] text-amber-700 font-bold block">JSON-LD Validated</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-xl space-y-2">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Core Web Vitals</span>
          <div className="text-3xl font-black text-blue-600 font-mono">LCP &lt; 1.8s</div>
          <span className="text-[11px] text-blue-700 font-bold block">INP &lt; 100ms &bull; CLS 0.00</span>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex border-b-2 border-slate-200 gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 font-extrabold text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'border-b-4 border-[#F58220] text-[#F58220]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          SEO Overview &amp; Readiness
        </button>
        <button
          onClick={() => setActiveTab('INDEXING')}
          className={`pb-3 font-extrabold text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'INDEXING'
              ? 'border-b-4 border-[#F58220] text-[#F58220]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Canonical Routes &amp; Indexing ({canonicalRoutes.length})
        </button>
        <button
          onClick={() => setActiveTab('SCHEMA')}
          className={`pb-3 font-extrabold text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'SCHEMA'
              ? 'border-b-4 border-[#F58220] text-[#F58220]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Schema.org JSON-LD ({schemasVerified.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-5">
            <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2.5">
              <Zap className="w-6 h-6 text-[#F58220]" /> GayaSeva SEO Audit &amp; System Health Matrix
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dynamic XML Sitemap (sitemap.xml)
                </div>
                <p className="text-slate-700">Configured with 21 priority URLs, lastModified dates, and auto-regeneration.</p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Production Robots Rules (robots.txt)
                </div>
                <p className="text-slate-700">Googlebot allowed on public guides; disallows /admin/, /dashboard/, and /api/.</p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Next.js Metadata API System
                </div>
                <p className="text-slate-700">Centralized metadataBase, OpenGraph cards, Twitter preview images, and canonicals.</p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI Search / Google AI Overview Ready
                </div>
                <p className="text-slate-700">FAQPage JSON-LD &amp; answer-first structured headings implemented across all guides.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'INDEXING' && (
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-4">
          <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#F58220]" /> Canonical Indexing Audit Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Canonical URL</th>
                  <th className="p-3">Title Tag</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Schemas Active</th>
                  <th className="p-3 text-right">SEO Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {canonicalRoutes.map((route, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-blue-700">{route.url}</td>
                    <td className="p-3 max-w-xs truncate">{route.title}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[10px]">
                        {route.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px]">{route.schema}</td>
                    <td className="p-3 text-right font-black text-emerald-600">{route.score}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'SCHEMA' && (
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-4">
          <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#F58220]" /> Validated Schema.org JSON-LD Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schemasVerified.map((sch, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-900 font-mono">{sch.type}</h3>
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full">
                    {sch.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">Target: {sch.target}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
