'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
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
  FileText,
  ExternalLink,
  Star,
  Check
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';

export default function BarbersManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState<UserAccount | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Kshaur Karma & Mundan Specialist (नाई / ठाकुर)');
  const [languagesStr, setLanguagesStr] = useState('Hindi, Magahi');
  const [status, setStatus] = useState<UserAccount['status']>('VERIFIED');
  const [city, setCity] = useState('Vishnupad Devghat Area');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  const loadBarbers = async () => {
    const latest = await UserStore.fetchUsersFromApi();
    setUsers(latest);
  };

  const syncBarbers = () => {
    setUsers(UserStore.getUsers());
  };

  useEffect(() => {
    loadBarbers();
    window.addEventListener('storage', syncBarbers);
    return () => window.removeEventListener('storage', syncBarbers);
  }, []);

  // Filter only BARBER accounts
  const barberAccounts = users.filter(
    (usr) =>
      usr.role === 'BARBER' ||
      (usr.customRole && (usr.customRole.toUpperCase().includes('BARBER') || usr.customRole.includes('नाई') || usr.customRole.includes('क्षौर')))
  );

  const filteredBarbers = barberAccounts.filter((brb) => {
    const matchesSearch = 
      brb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brb.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brb.phone.includes(searchQuery) ||
      (brb.city && brb.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (brb.customRole && brb.customRole.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || brb.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const langs = languagesStr.split(',').map(s => s.trim()).filter(Boolean);

    await UserStore.addUser({
      name,
      email: email || `${phone.replace(/\s+/g, '')}@gayaseva.org`,
      phone,
      role: 'BARBER',
      customRole: specialty || 'Kshaur Karma & Mundan Specialist (नाई / ठाकुर)',
      languages: langs.length ? langs : ['Hindi', 'Magahi'],
      status,
      city: city || 'Vishnupad Devghat Area',
      profilePicUrl: profilePicUrl || undefined,
      documentUrl: documentUrl || undefined,
      rating: 4.9,
    });

    await loadBarbers();
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBarber) return;

    const langs = languagesStr.split(',').map(s => s.trim()).filter(Boolean);

    await UserStore.updateUser(editingBarber.id, {
      name,
      email,
      phone,
      customRole: specialty,
      languages: langs,
      status,
      city,
      profilePicUrl,
      documentUrl,
    });

    await loadBarbers();
    setEditingBarber(null);
    resetForm();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete Barber partner record "${name}"?`)) {
      await UserStore.deleteUser(id);
      await loadBarbers();
    }
  };

  const handleApproveStatus = async (barber: UserAccount) => {
    const newStatus: UserAccount['status'] = barber.status === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED';
    await UserStore.updateUser(barber.id, { status: newStatus });
    await loadBarbers();
  };

  const openEditModal = (barber: UserAccount) => {
    setEditingBarber(barber);
    setName(barber.name);
    setEmail(barber.email);
    setPhone(barber.phone);
    setSpecialty(barber.customRole || 'Kshaur Karma & Mundan Specialist (नाई / ठाकुर)');
    setLanguagesStr((barber.languages || ['Hindi', 'Magahi']).join(', '));
    setStatus(barber.status);
    setCity(barber.city || 'Vishnupad Devghat Area');
    setProfilePicUrl(barber.profilePicUrl || '');
    setDocumentUrl(barber.documentUrl || '');
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSpecialty('Kshaur Karma & Mundan Specialist (नाई / ठाकुर)');
    setLanguagesStr('Hindi, Magahi');
    setStatus('VERIFIED');
    setCity('Vishnupad Devghat Area');
    setProfilePicUrl('');
    setDocumentUrl('');
  };

  const totalBarbersCount = barberAccounts.length;
  const verifiedBarbersCount = barberAccounts.filter(b => b.status === 'VERIFIED').length;
  const pendingBarbersCount = barberAccounts.filter(b => b.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Scissors className="w-7 h-7 text-[#F58220]" />
            <h1 className="font-serif text-3xl font-bold text-[#4A2E1A]">✂️ Kshaur Karma Barbers &amp; Thakur Directory</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">Manage verified traditional Barbers (नाई / ठाकुर) for Pinda Daan Mundan &amp; Kshaur Karma rituals in Gaya Ji.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadBarbers} 
            className="p-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <span>Sync</span>
          </button>

          <button 
            onClick={() => { resetForm(); setShowCreateModal(true); }} 
            className="px-5 py-3 bg-[#4A2E1A] hover:bg-[#3A2314] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-[#F58220]" />
            <span>Register New Barber</span>
          </button>
        </div>
      </div>

      {/* Barber Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-gray-500 font-semibold block">Total Registered Barbers</span>
          <p className="text-2xl font-extrabold text-[#4A2E1A]">{totalBarbersCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <span className="text-emerald-700 font-semibold block">Verified Barbers (Green Tick)</span>
          <p className="text-2xl font-extrabold text-emerald-600">{verifiedBarbersCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <span className="text-amber-700 font-semibold block">Pending Approval</span>
          <p className="text-2xl font-extrabold text-amber-600">{pendingBarbersCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <span className="text-amber-800 font-semibold block">Average Yatri Rating</span>
          <p className="text-2xl font-extrabold text-amber-600 flex items-center gap-1">
            4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
          </p>
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
            placeholder="Search barber name, phone, ghat location..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F58220]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-semibold text-gray-600">Verification Status:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="VERIFIED">Verified Barbers Only</option>
            <option value="PENDING">Pending Verification</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A2E1A]">
            <thead className="bg-[#2A180B] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Barber Partner Profile</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Contact &amp; Location</th>
                <th className="px-6 py-4">Credentials &amp; ID</th>
                <th className="px-6 py-4">Status &amp; Verified Tick</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredBarbers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No matching Barber accounts found.
                  </td>
                </tr>
              ) : (
                filteredBarbers.map((brb) => (
                  <tr key={brb.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {brb.profilePicUrl ? (
                          <img src={brb.profilePicUrl} alt={brb.name} className="w-10 h-10 rounded-full object-cover border border-amber-400" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                            <Scissors className="w-5 h-5 text-amber-600" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-sm text-[#4A2E1A]">{brb.name}</p>
                            {brb.status === 'VERIFIED' && (
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px]" title="Verified Barber Partner">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500">ID: {brb.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 space-y-1">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200 block w-fit">
                        ✂️ {brb.customRole || 'Kshaur Karma & Mundan'}
                      </span>
                    </td>

                    <td className="px-6 py-4 space-y-0.5">
                      <p className="flex items-center gap-1 text-gray-800 font-semibold"><Phone className="w-3 h-3 text-gray-400" /> {brb.phone}</p>
                      <p className="flex items-center gap-1 text-gray-500 text-[11px]"><Mail className="w-3 h-3 text-gray-400" /> {brb.email}</p>
                      <p className="flex items-center gap-1 text-amber-700 text-[10px] font-semibold"><MapPin className="w-3 h-3 text-amber-500" /> {brb.city || 'Vishnupad Devghat Area'}</p>
                    </td>

                    <td className="px-6 py-4">
                      {brb.documentUrl ? (
                        <a 
                          href={brb.documentUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 hover:bg-amber-100 transition-colors w-fit"
                        >
                          <FileText className="w-3 h-3 text-amber-600" /> View Document <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No document uploaded</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {brb.status === 'VERIFIED' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> VERIFIED BARBER
                        </span>
                      ) : brb.status === 'PENDING' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> PENDING APPROVAL
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                          <X className="w-3.5 h-3.5 text-red-600" /> SUSPENDED
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveStatus(brb)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                            brb.status === 'VERIFIED' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          } transition-colors shadow-xs`}
                        >
                          {brb.status === 'VERIFIED' ? 'Suspend' : 'Approve & Verify'}
                        </button>

                        <button
                          onClick={() => openEditModal(brb)}
                          className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                          title="Edit Barber Profile"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(brb.id, brb.name)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Barber"
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

      {/* Barber Add/Edit Modal */}
      {(showCreateModal || editingBarber) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-serif font-bold text-xl text-[#4A2E1A]">
                {editingBarber ? 'Edit Barber Partner Details' : 'Register New Barber (नाई / ठाकुर)'}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setEditingBarber(null); }}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={editingBarber ? handleUpdate : handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Barber / Thakur Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Ramu Thakur (नाई)"
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
                <label className="block font-bold text-gray-700 mb-1">Specialization Description</label>
                <input 
                  type="text" 
                  value={specialty} 
                  onChange={(e) => setSpecialty(e.target.value)} 
                  placeholder="e.g. Kshaur Karma & Mundan Specialist (नाई / ठाकुर)"
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ghat / Temple Zone</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="e.g. Vishnupad Devghat Area"
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Profile Photo URL</label>
                <input 
                  type="text" 
                  value={profilePicUrl} 
                  onChange={(e) => setProfilePicUrl(e.target.value)} 
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Govt ID Document URL</label>
                <input 
                  type="text" 
                  value={documentUrl} 
                  onChange={(e) => setDocumentUrl(e.target.value)} 
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Verification Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as any)} 
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none"
                >
                  <option value="VERIFIED">VERIFIED (Show Green Tick Badge)</option>
                  <option value="PENDING">PENDING APPROVAL</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setShowCreateModal(false); setEditingBarber(null); }} 
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
                >
                  {editingBarber ? 'Save Barber Profile' : 'Register Barber'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
