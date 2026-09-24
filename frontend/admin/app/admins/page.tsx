'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Crown, Shield, UserPlus, Search, Edit3, Trash2, 
  CheckCircle2, X, RefreshCw, Key, Lock, Layers
} from 'lucide-react';
import { UserAccount, UserStore } from '@/lib/userStore';

export default function DedicatedAdminManagementPage() {
  const [admins, setAdmins] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<UserAccount | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN');
  const [sectionPermission, setSectionPermission] = useState('ALL');
  const [status, setStatus] = useState<'VERIFIED' | 'SUSPENDED'>('VERIFIED');

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const allUsers = await UserStore.fetchUsersFromApi();
      const adminUsers = allUsers.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');
      setAdmins(adminUsers);
    } catch (e) {
      console.error('Failed to fetch admin users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter((adm) => {
    const q = searchQuery.toLowerCase();
    return (
      adm.name.toLowerCase().includes(q) ||
      adm.email.toLowerCase().includes(q) ||
      adm.phone.includes(q) ||
      (adm.customRole && adm.customRole.toLowerCase().includes(q))
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingAdmin) {
      await UserStore.updateUser(editingAdmin.id, {
        name,
        email,
        phone,
        role,
        status,
        customRole: sectionPermission !== 'ALL' ? `${sectionPermission} Admin` : 'Super Administrator',
      });
    } else {
      await UserStore.addUser({
        name,
        email,
        phone: phone || '+917300000000',
        role,
        status,
        city: 'Gaya Ji Admin Desk',
        customRole: sectionPermission !== 'ALL' ? `${sectionPermission} Admin` : 'Super Administrator',
      });
    }

    await fetchAdmins();
    setShowCreateModal(false);
    setEditingAdmin(null);
    resetForm();
  };

  const handleStatusToggle = async (adm: UserAccount) => {
    const nextStatus = adm.status === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED';
    await UserStore.updateUser(adm.id, { status: nextStatus });
    await fetchAdmins();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('ADMIN');
    setSectionPermission('ALL');
    setStatus('VERIFIED');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-purple-600" /> Super Admin Privileged RBAC Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#4A2E1A] mt-1">
            System Administrators &amp; Permissions
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Assign section permissions, manage administrator credentials, and configure administrative access rights.
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          className="px-5 py-3 bg-[#4A2E1A] hover:bg-[#341F11] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Create Administrator</span>
        </button>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admin name, email..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220]"
            />
          </div>
          <span className="text-xs font-bold text-gray-500">{filteredAdmins.length} active administrators</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A2E1A]">
            <thead className="bg-[#2A180B] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Administrator Name</th>
                <th className="px-6 py-4">Role &amp; Privilege</th>
                <th className="px-6 py-4">Assigned Section</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredAdmins.map((adm) => (
                <tr key={adm.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                        {adm.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{adm.name}</p>
                        <p className="text-[11px] text-gray-500">{adm.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {adm.role === 'SUPER_ADMIN' ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300 inline-flex items-center gap-1">
                        <Crown className="w-3 h-3 text-purple-700" /> SUPER ADMIN
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 inline-flex items-center gap-1">
                        <Shield className="w-3 h-3 text-indigo-600" /> SECTION ADMIN
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                    {adm.customRole || 'All System Sections'}
                  </td>

                  <td className="px-6 py-4">
                    {adm.status === 'VERIFIED' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        SUSPENDED
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStatusToggle(adm)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                      >
                        {adm.status === 'VERIFIED' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingAdmin(adm);
                          setName(adm.name);
                          setEmail(adm.email);
                          setPhone(adm.phone);
                          setRole(adm.role as any);
                          setStatus(adm.status as any);
                          setShowCreateModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(showCreateModal || editingAdmin) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#4A2E1A]">
                {editingAdmin ? 'Edit Administrator Privileges' : 'Create New System Administrator'}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setEditingAdmin(null); }}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikramaditya Sharma"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#800020]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gayaseva.org"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#800020]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43200"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#800020]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Privilege Level</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#800020]"
                >
                  <option value="ADMIN">Section Administrator</option>
                  <option value="SUPER_ADMIN">Super Administrator (Full Rights)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Section Scope</label>
                <select
                  value={sectionPermission}
                  onChange={(e) => setSectionPermission(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#800020]"
                >
                  <option value="ALL">All Sections (Super Admin)</option>
                  <option value="Religious & Pandits">Religious &amp; Pandit Ji Desk</option>
                  <option value="Transport & Drivers">Transport &amp; Cab Desk</option>
                  <option value="Hotels & Stays">Hotel &amp; Dharamshala Desk</option>
                  <option value="Payments & Revenue">Payments &amp; Revenue Desk</option>
                  <option value="Support & Email">Support &amp; Email System</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setEditingAdmin(null); }}
                  className="px-4 py-2 border rounded-xl font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#800020] text-white font-bold rounded-xl shadow-md hover:bg-[#600018] cursor-pointer"
                >
                  Save Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
