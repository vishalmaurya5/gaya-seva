'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, ShieldCheck, Search, Filter, RefreshCw, UserCheck, 
  Clock, AlertTriangle, CheckCircle2, XCircle, Mail, Phone, Lock, Unlock
} from 'lucide-react';
import { CustomerAccessRecord } from '@/lib/paymentStore';
import { UserAccount, UserStore } from '@/lib/userStore';

export default function AdminAccessPassReportPage() {
  const [accessRecords, setAccessRecords] = useState<CustomerAccessRecord[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAccessData = async () => {
    setLoading(true);
    try {
      const [accRes, usersData] = await Promise.all([
        fetch('/api/payments/access-status'),
        UserStore.fetchUsersFromApi(),
      ]);
      const recordsData = await accRes.json();
      setAccessRecords(Array.isArray(recordsData) ? recordsData : (recordsData.records || []));
      setUsers(usersData);
    } catch (e) {
      console.error('Failed to load customer access pass data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessData();
  }, []);

  const handleToggleRevokeAccess = async (rec: CustomerAccessRecord) => {
    const nextStatus = rec.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
    const confirmAction = confirm(
      `Are you sure you want to change Access Pass status to ${nextStatus} for user ID ${rec.userId}?`
    );

    if (!confirmAction) return;

    try {
      const res = await fetch('/api/access/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessId: rec.id,
          userId: rec.userId,
          newStatus: nextStatus,
        }),
      });

      if (res.ok) {
        setActionMessage(`Access pass status successfully changed to ${nextStatus}.`);
        await fetchAccessData();
      } else {
        const err = await res.json();
        alert(`Failed to update access status: ${err.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      alert(`Error updating access status: ${e.message}`);
    }
  };

  const userMap = new Map<string, UserAccount>();
  users.forEach((u) => userMap.set(u.id, u));

  const filteredRecords = accessRecords.filter((rec) => {
    const user = userMap.get(rec.userId);
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      rec.id.toLowerCase().includes(query) ||
      rec.userId.toLowerCase().includes(query) ||
      (user?.name && user.name.toLowerCase().includes(query)) ||
      (user?.email && user.email.toLowerCase().includes(query));

    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = accessRecords.filter((r) => r.status === 'ACTIVE').length;
  const expiredCount = accessRecords.filter((r) => r.status === 'EXPIRED').length;
  const pendingCount = accessRecords.filter((r) => r.status === 'PENDING').length;
  const revokedCount = accessRecords.filter((r) => r.status === 'REVOKED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4 text-emerald-600" /> Customer Access Pass Audit Ledger
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#4A2E1A] mt-1">
            "Who Has Access" Report
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Direct correlation of user accounts, ₹5 payment receipts, and active provider detail view permissions.
          </p>
        </div>

        <button
          onClick={fetchAccessData}
          disabled={loading}
          className="px-4 py-2.5 bg-[#4A2E1A] text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-sm hover:bg-[#341F11] cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          Sync Access Ledger
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl flex justify-between items-center">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-gray-500 font-semibold block">Total Access Passes</span>
          <p className="text-2xl font-extrabold text-[#4A2E1A]">{accessRecords.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <span className="text-emerald-700 font-semibold block">Active Unlocked Passes</span>
          <p className="text-2xl font-extrabold text-emerald-700">{activeCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <span className="text-amber-700 font-semibold block">Pending / Unverified</span>
          <p className="text-2xl font-extrabold text-amber-700">{pendingCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-1">
          <span className="text-rose-700 font-semibold block">Expired / Revoked</span>
          <p className="text-2xl font-extrabold text-rose-700">{expiredCount + revokedCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name, email, pass ID..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F58220]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-semibold text-gray-600">Access Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PENDING">PENDING</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="REVOKED">REVOKED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A2E1A]">
            <thead className="bg-[#2A180B] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">User Account</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Access Type</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Activated At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No customer access pass records found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const user = userMap.get(rec.userId);
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            {user?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-bold">{user?.name || 'Unknown User'}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{rec.userId}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 space-y-0.5 text-[11px]">
                        {user ? (
                          <>
                            <p className="flex items-center gap-1 text-gray-700"><Mail className="w-3 h-3 text-gray-400" /> {user.email}</p>
                            <p className="flex items-center gap-1 text-gray-500"><Phone className="w-3 h-3 text-gray-400" /> {user.phone}</p>
                          </>
                        ) : (
                          <span className="text-gray-400 italic">No user metadata</span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-bold text-[11px]">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                          {rec.accessType}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-black">
                        &#8377;{rec.amount} {rec.currency}
                      </td>

                      <td className="px-6 py-4">
                        {rec.status === 'ACTIVE' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ACTIVE
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" /> {rec.status}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-[11px] text-gray-600 font-mono">
                        {rec.activatedAt ? new Date(rec.activatedAt).toLocaleDateString('en-IN') : '—'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleRevokeAccess(rec)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition cursor-pointer ${
                            rec.status === 'ACTIVE'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {rec.status === 'ACTIVE' ? (
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Revoke Access</span>
                          ) : (
                            <span className="flex items-center gap-1"><Unlock className="w-3 h-3" /> Restore Access</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
