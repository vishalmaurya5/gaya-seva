'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Search, 
  Download, 
  Trash2, 
  RefreshCw, 
  UserCheck, 
  Lock, 
  FileText, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  CheckCircle,
  XCircle,
  PauseCircle,
  User,
  Shield
} from 'lucide-react';
import { AuditLogStore, AuditLogEntry } from '@/lib/auditLogStore';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [notification, setNotification] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await AuditLogStore.fetchLogsFromApi();
    setLogs(data);
    setLoading(false);
  };

  const syncLogs = () => {
    setLogs(AuditLogStore.getLogs());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', syncLogs);
    return () => window.removeEventListener('storage', syncLogs);
  }, []);

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all system audit logs? This action is permanent.')) {
      AuditLogStore.clearLogs();
      setLogs([]);
      setNotification('🗑️ All audit log entries have been cleared.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleExportCsv = () => {
    if (logs.length === 0) {
      alert('No audit logs available to export.');
      return;
    }

    const headers = ['Log ID', 'Actor Name', 'Actor Email', 'Action', 'Category', 'Target Resource', 'Details', 'IP Address', 'Timestamp'];
    const rows = logs.map((l) => [
      l.id,
      `"${l.actor.replace(/"/g, '""')}"`,
      `"${(l.actorEmail || '').replace(/"/g, '""')}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.target.replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      l.ip || '127.0.0.1',
      `"${new Date(l.timestamp).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GayaSeva_Audit_Logs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification('📥 Audit logs exported successfully as CSV!');
    setTimeout(() => setNotification(''), 4000);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalLogs = logs.length;
  const verificationLogs = logs.filter((l) => l.category === 'VERIFICATION').length;
  const userManagementLogs = logs.filter((l) => l.category === 'USER_MANAGEMENT').length;
  const securityLogs = logs.filter((l) => l.category === 'AUTH').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#3D2310] text-white p-6 sm:p-8 rounded-3xl border border-[#F58220]/40 shadow-xl gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#F6C343] font-bold uppercase tracking-widest px-3 py-1 bg-[#4A2E1A] rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#F58220]" />
              Security Audit Trail
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold px-2.5 py-0.5 bg-emerald-950/80 rounded-full border border-emerald-700/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Logger Active
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
            System Action Audit Logs
          </h1>
          <p className="text-xs text-[#F8F6EF]/80 max-w-xl">
            Real-time immutable record of administrative actions, provider approvals, user modifications, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Refresh Audit Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#F6C343] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-[#F58220] hover:bg-[#E07210] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="px-3 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/50 font-bold text-xs flex items-center gap-1 transition-all"
              title="Clear log history"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification feedback */}
      {notification && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Recorded Logs</span>
          <p className="font-serif text-3xl font-extrabold text-[#4A2E1A]">{totalLogs}</p>
          <p className="text-[10px] text-gray-400 font-medium">All administrative actions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Verification Events</span>
          <p className="font-serif text-3xl font-extrabold text-emerald-700">{verificationLogs}</p>
          <p className="text-[10px] text-gray-400 font-medium">Approved, rejected &amp; photos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">User Account Edits</span>
          <p className="font-serif text-3xl font-extrabold text-amber-700">{userManagementLogs}</p>
          <p className="text-[10px] text-gray-400 font-medium">Roles &amp; account modifications</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Auth &amp; Security</span>
          <p className="font-serif text-3xl font-extrabold text-purple-700">{securityLogs}</p>
          <p className="text-[10px] text-gray-400 font-medium">Super admin logins &amp; RBAC</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: `All Logs (${totalLogs})` },
            { key: 'VERIFICATION', label: `🔍 Verification (${verificationLogs})` },
            { key: 'USER_MANAGEMENT', label: `👥 Users (${userManagementLogs})` },
            { key: 'AUTH', label: `🔑 Auth (${securityLogs})` },
            { key: 'SYSTEM_CONFIG', label: `⚙️ System` },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat.key
                  ? 'bg-[#2A180B] text-[#F6C343] border-[#2A180B] shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#F58220]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actor, action, target..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220]"
          />
        </div>
      </div>

      {/* Audit Log Data Feed */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold text-lg text-gray-800">No Audit Log Entries Found</h3>
            <p className="text-xs text-gray-500">No events currently match the selected filter or query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#2A180B] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-4 font-bold">Admin Actor Profile</th>
                  <th className="px-5 py-4 font-bold">Action Performed</th>
                  <th className="px-5 py-4 font-bold">Target Resource</th>
                  <th className="px-5 py-4 font-bold">Details / Context</th>
                  <th className="px-5 py-4 font-bold">IP Address</th>
                  <th className="px-5 py-4 font-bold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredLogs.map((log) => {
                  const isVerifiedAction = log.action.includes('VERIFIED') || log.action.includes('APPROVED');
                  const isNegativeAction = log.action.includes('REJECTED') || log.action.includes('SUSPENDED') || log.action.includes('DELETED');
                  const isAuthAction = log.category === 'AUTH';

                  return (
                    <tr key={log.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="px-5 py-4 font-bold text-[#4A2E1A]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#3D2310] text-[#F6C343] flex items-center justify-center text-xs font-black shrink-0">
                            {log.actor.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{log.actor}</p>
                            {log.actorEmail && (
                              <p className="text-[10px] text-gray-500 font-normal">{log.actorEmail}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border font-mono ${
                          isVerifiedAction ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                          isNegativeAction ? 'bg-red-100 text-red-900 border-red-300' :
                          isAuthAction ? 'bg-purple-100 text-purple-900 border-purple-300' :
                          'bg-amber-100 text-amber-950 border-amber-300'
                        }`}>
                          {log.action}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-gray-800">
                        {log.target}
                      </td>

                      <td className="px-5 py-4 text-gray-600 max-w-xs text-[11px] leading-relaxed">
                        {log.details || 'N/A'}
                      </td>

                      <td className="px-5 py-4 font-mono text-[11px] text-gray-500">
                        {log.ip || '127.0.0.1'}
                      </td>

                      <td className="px-5 py-4 text-right font-mono text-[11px] text-gray-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
