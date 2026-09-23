'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Search, 
  X, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  RefreshCw,
  Crown,
  Shield,
  User
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';

export default function UsersAndAdminsPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserAccount['role']>('PILGRIM');
  const [status, setStatus] = useState<UserAccount['status']>('VERIFIED');
  const [city, setCity] = useState('');

  const loadUsers = async () => {
    const latest = await UserStore.fetchUsersFromApi();
    setUsers(latest);
  };

  const syncUsers = () => {
    setUsers(UserStore.getUsers());
  };

  useEffect(() => {
    loadUsers();
    window.addEventListener('storage', syncUsers);
    return () => window.removeEventListener('storage', syncUsers);
  }, []);

  // Filter for Users & Admins (Pilgrim, Admin, Super Admin or All Users)
  const usersAndAdmins = users.filter((usr) => {
    const isUserOrAdminRole = roleFilter === 'ALL' 
      ? ['PILGRIM', 'ADMIN', 'SUPER_ADMIN'].includes(usr.role) || true // Show all if specified
      : usr.role === roleFilter;

    const matchesSearch = 
      usr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usr.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usr.phone.includes(searchQuery) ||
      (usr.city && usr.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || usr.status === statusFilter;

    return isUserOrAdminRole && matchesSearch && matchesStatus;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    await UserStore.addUser({
      name,
      email: email || `${phone.replace(/\s+/g, '')}@gayaseva.org`,
      phone,
      role,
      status,
      city: city || 'Gaya Ji',
    });

    await loadUsers();
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    await UserStore.updateUser(editingUser.id, {
      name,
      email,
      phone,
      role,
      status,
      city,
    });

    await loadUsers();
    setEditingUser(null);
    resetForm();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user account "${name}"? This action cannot be undone.`)) {
      await UserStore.deleteUser(id);
      await loadUsers();
    }
  };

  const handleStatusToggle = async (user: UserAccount) => {
    const nextStatus: UserAccount['status'] = 
      user.status === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED';
    await UserStore.updateUser(user.id, { status: nextStatus });
    await loadUsers();
  };

  const openEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
    setStatus(user.status);
    setCity(user.city || '');
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('PILGRIM');
    setStatus('VERIFIED');
    setCity('');
  };

  const getRoleBadge = (role: UserAccount['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1"><Crown className="w-3 h-3 text-purple-700" /> SUPER ADMIN</span>;
      case 'ADMIN':
        return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1"><Shield className="w-3 h-3 text-indigo-600" /> ADMIN</span>;
      case 'PANDIT':
        return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">🪔 PANDIT</span>;
      case 'DRIVER':
        return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">🚕 DRIVER</span>;
      case 'HOTEL':
        return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">🏨 HOTEL</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1"><User className="w-3 h-3 text-gray-600" /> YATRI (PILGRIM)</span>;
    }
  };

  const getStatusBadge = (status: UserAccount['status']) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED</span>;
      case 'PENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-600" /> PENDING</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1"><X className="w-3 h-3 text-red-600" /> SUSPENDED</span>;
    }
  };

  const superAdminsCount = users.filter(u => u.role === 'SUPER_ADMIN').length;
  const adminsCount = users.filter(u => u.role === 'ADMIN').length;
  const pilgrimsCount = users.filter(u => u.role === 'PILGRIM').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="text-xs font-bold text-[#F58220] uppercase tracking-wider">USER ACCOUNTS &amp; ADMIN RBAC PORTAL</span>
          <h1 className="font-serif text-3xl font-bold text-[#4A2E1A] mt-1">Users &amp; System Administrators</h1>
          <p className="text-xs text-gray-500 mt-1">Manage Yatri pilgrim accounts, section admins, and super administrator privileges.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadUsers} 
            className="p-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            title="Refresh User List"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <span>Sync</span>
          </button>

          <button 
            onClick={() => { resetForm(); setShowCreateModal(true); }} 
            className="px-5 py-3 bg-[#4A2E1A] hover:bg-[#3A2314] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-[#F58220]" />
            <span>Add User or Admin</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-gray-500 font-semibold block">Total User Accounts</span>
          <p className="text-2xl font-extrabold text-[#4A2E1A]">{users.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-1">
          <span className="text-purple-700 font-semibold block">Super Administrators</span>
          <p className="text-2xl font-extrabold text-purple-800">{superAdminsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-1">
          <span className="text-indigo-700 font-semibold block">Section Admins</span>
          <p className="text-2xl font-extrabold text-indigo-700">{adminsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <span className="text-amber-700 font-semibold block">Yatri Pilgrims</span>
          <p className="text-2xl font-extrabold text-amber-600">{pilgrimsCount}</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, city..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F58220]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-semibold text-gray-600">Role:</span>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="PILGRIM">Yatri (Pilgrim)</option>
              <option value="ADMIN">Section Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="PANDIT">Teerth Pandit</option>
              <option value="DRIVER">Taxi Driver</option>
              <option value="HOTEL">Hotel Owner</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-600">Status:</span>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A2E1A]">
            <thead className="bg-[#2A180B] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">User Account Profile</th>
                <th className="px-6 py-4">Role &amp; Privilege</th>
                <th className="px-6 py-4">Contact &amp; Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {usersAndAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No matching user accounts found.
                  </td>
                </tr>
              ) : (
                usersAndAdmins.map((usr) => (
                  <tr key={usr.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#F58220]/20 text-[#F58220] flex items-center justify-center font-bold text-sm shrink-0">
                          {usr.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#4A2E1A]">{usr.name}</p>
                          <p className="text-[11px] text-gray-500">ID: {usr.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getRoleBadge(usr.role)}
                    </td>

                    <td className="px-6 py-4 space-y-0.5">
                      <p className="flex items-center gap-1 text-gray-800"><Phone className="w-3 h-3 text-gray-400" /> {usr.phone}</p>
                      <p className="flex items-center gap-1 text-gray-500 text-[11px]"><Mail className="w-3 h-3 text-gray-400" /> {usr.email}</p>
                      {usr.city && <p className="flex items-center gap-1 text-amber-700 text-[10px] font-semibold"><MapPin className="w-3 h-3 text-amber-500" /> {usr.city}</p>}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(usr.status)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStatusToggle(usr)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                          title="Toggle Status"
                        >
                          Toggle Status
                        </button>

                        <button
                          onClick={() => openEditModal(usr)}
                          className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                          title="Edit Account"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(usr.id, usr.name)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {(showCreateModal || editingUser) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-serif font-bold text-xl text-[#4A2E1A]">
                {editingUser ? 'Edit User Account' : 'Create New Account'}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setEditingUser(null); }}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={editingUser ? handleUpdate : handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Vikramaditya Sharma"
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="user@gayaseva.org"
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">City / Zone</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="e.g. Gaya Ji / Kolkata"
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Role Assignment</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value as any)} 
                    className="w-full px-3 py-2.5 border rounded-xl focus:outline-none"
                  >
                    <option value="PILGRIM">Yatri (Pilgrim)</option>
                    <option value="ADMIN">Section Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="PANDIT">Teerth Pandit</option>
                    <option value="DRIVER">Taxi Driver</option>
                    <option value="HOTEL">Hotel Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Verification Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as any)} 
                    className="w-full px-3 py-2.5 border rounded-xl focus:outline-none"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setShowCreateModal(false); setEditingUser(null); }} 
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
                >
                  {editingUser ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
