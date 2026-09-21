'use client';

import React, { useState, useEffect } from 'react';
import { 
  Hotel, 
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
  Check,
  Building
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';

export default function HotelsManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<UserAccount | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState('AC Yatri Dharamshala & Guest House');
  const [status, setStatus] = useState<UserAccount['status']>('VERIFIED');
  const [city, setCity] = useState('Vishnupad Temple Area, Gaya Ji');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  const loadHotels = async () => {
    const latest = await UserStore.fetchUsersFromApi();
    setUsers(latest);
  };

  const syncHotels = () => {
    setUsers(UserStore.getUsers());
  };

  useEffect(() => {
    loadHotels();
    window.addEventListener('storage', syncHotels);
    return () => window.removeEventListener('storage', syncHotels);
  }, []);

  // Filter only HOTEL accounts
  const hotelAccounts = users.filter((usr) => usr.role === 'HOTEL');

  const filteredHotels = hotelAccounts.filter((htl) => {
    const matchesSearch = 
      htl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      htl.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      htl.phone.includes(searchQuery) ||
      (htl.city && htl.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (htl.customRole && htl.customRole.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || htl.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    UserStore.addUser({
      name,
      email: email || `${phone.replace(/\s+/g, '')}@gayaseva.org`,
      phone,
      role: 'HOTEL',
      customRole: propertyType,
      status,
      city: city || 'Vishnupad Temple Area',
      profilePicUrl: profilePicUrl || undefined,
      documentUrl: documentUrl || undefined,
      rating: 4.9,
    });

    loadHotels();
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;

    UserStore.updateUser(editingHotel.id, {
      name,
      email,
      phone,
      customRole: propertyType,
      status,
      city,
      profilePicUrl,
      documentUrl,
    });

    loadHotels();
    setEditingHotel(null);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete Hotel / Dharamshala record "${name}"?`)) {
      UserStore.deleteUser(id);
      loadHotels();
    }
  };

  const handleApproveStatus = (hotel: UserAccount) => {
    const newStatus: UserAccount['status'] = hotel.status === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED';
    UserStore.updateUser(hotel.id, { status: newStatus });
    loadHotels();
  };

  const openEditModal = (hotel: UserAccount) => {
    setEditingHotel(hotel);
    setName(hotel.name);
    setEmail(hotel.email);
    setPhone(hotel.phone);
    setPropertyType(hotel.customRole || 'AC Yatri Dharamshala & Guest House');
    setStatus(hotel.status);
    setCity(hotel.city || 'Vishnupad Temple Area');
    setProfilePicUrl(hotel.profilePicUrl || '');
    setDocumentUrl(hotel.documentUrl || '');
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPropertyType('AC Yatri Dharamshala & Guest House');
    setStatus('VERIFIED');
    setCity('Vishnupad Temple Area, Gaya Ji');
    setProfilePicUrl('');
    setDocumentUrl('');
  };

  const totalHotelsCount = hotelAccounts.length;
  const verifiedHotelsCount = hotelAccounts.filter(h => h.status === 'VERIFIED').length;
  const pendingHotelsCount = hotelAccounts.filter(h => h.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Hotel className="w-7 h-7 text-[#F58220]" />
            <h1 className="font-serif text-3xl font-bold text-[#4A2E1A]">🏨 Hotels &amp; Dharamshala Stay Management</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">Manage verified hotels, guest houses, and Yatri Dharamshalas in Gaya Ji.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadHotels} 
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
            <span>Register New Hotel</span>
          </button>
        </div>
      </div>

      {/* Hotel Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-gray-500 font-semibold block">Total Stay Properties</span>
          <p className="text-2xl font-extrabold text-[#4A2E1A]">{totalHotelsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <span className="text-emerald-700 font-semibold block">Verified Stays (Green Tick)</span>
          <p className="text-2xl font-extrabold text-emerald-600">{verifiedHotelsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <span className="text-amber-700 font-semibold block">Pending Approval</span>
          <p className="text-2xl font-extrabold text-amber-600">{pendingHotelsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <span className="text-emerald-800 font-semibold block">Average Yatri Rating</span>
          <p className="text-2xl font-extrabold text-emerald-600 flex items-center gap-1">
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
            placeholder="Search hotel name, phone, property type, area..."
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
            <option value="VERIFIED">Verified Hotels Only</option>
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
                <th className="px-6 py-4">Property / Dharamshala Name</th>
                <th className="px-6 py-4">Stay Category</th>
                <th className="px-6 py-4">Contact &amp; Location</th>
                <th className="px-6 py-4">License / Trade ID</th>
                <th className="px-6 py-4">Status &amp; Verified Tick</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredHotels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No matching Hotel / Dharamshala accounts found.
                  </td>
                </tr>
              ) : (
                filteredHotels.map((htl) => (
                  <tr key={htl.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {htl.profilePicUrl ? (
                          <img src={htl.profilePicUrl} alt={htl.name} className="w-10 h-10 rounded-xl object-cover border border-emerald-300" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                            <Building className="w-5 h-5 text-emerald-600" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-sm text-[#4A2E1A]">{htl.name}</p>
                            {htl.status === 'VERIFIED' && (
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px]" title="Verified Hotel Partner">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500">ID: {htl.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-200 block w-fit">
                        🏨 {htl.customRole || 'Yatri Dharamshala'}
                      </span>
                    </td>

                    <td className="px-6 py-4 space-y-0.5">
                      <p className="flex items-center gap-1 text-gray-800 font-semibold"><Phone className="w-3 h-3 text-gray-400" /> {htl.phone}</p>
                      <p className="flex items-center gap-1 text-gray-500 text-[11px]"><Mail className="w-3 h-3 text-gray-400" /> {htl.email}</p>
                      <p className="flex items-center gap-1 text-amber-700 text-[10px] font-semibold"><MapPin className="w-3 h-3 text-amber-500" /> {htl.city || 'Vishnupad Temple Area'}</p>
                    </td>

                    <td className="px-6 py-4">
                      {htl.documentUrl ? (
                        <a 
                          href={htl.documentUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 hover:bg-amber-100 transition-colors w-fit"
                        >
                          <FileText className="w-3 h-3 text-amber-600" /> View License <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No document uploaded</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {htl.status === 'VERIFIED' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> VERIFIED STAY
                        </span>
                      ) : htl.status === 'PENDING' ? (
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
                          onClick={() => handleApproveStatus(htl)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                            htl.status === 'VERIFIED' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          } transition-colors shadow-xs`}
                        >
                          {htl.status === 'VERIFIED' ? 'Suspend' : 'Approve & Verify'}
                        </button>

                        <button
                          onClick={() => openEditModal(htl)}
                          className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                          title="Edit Hotel Profile"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(htl.id, htl.name)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Hotel"
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

      {/* Hotel Add/Edit Modal */}
      {(showCreateModal || editingHotel) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-serif font-bold text-xl text-[#4A2E1A]">
                {editingHotel ? 'Edit Hotel / Dharamshala Details' : 'Register New Hotel / Stay Property'}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setEditingHotel(null); }}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={editingHotel ? handleUpdate : handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Hotel / Dharamshala Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Sri Vishnupad Yatri Dharamshala"
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
                  placeholder="+91 98765 43230"
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Property Type / Category</label>
                <select 
                  value={propertyType} 
                  onChange={(e) => setPropertyType(e.target.value)} 
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]"
                >
                  <option value="AC Yatri Dharamshala & Guest House">AC Yatri Dharamshala &amp; Guest House</option>
                  <option value="3-Star Deluxe Hotel">3-Star Deluxe Hotel</option>
                  <option value="Budget Yatri Niwas">Budget Yatri Niwas</option>
                  <option value="Homestay &amp; Pilgrimage Lodge">Homestay &amp; Pilgrimage Lodge</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Location / Nearby Landmark</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="e.g. Vishnupad Temple Gate 1, Gaya Ji"
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Building Photo / Exterior Image URL</label>
                <input 
                  type="text" 
                  value={profilePicUrl} 
                  onChange={(e) => setProfilePicUrl(e.target.value)} 
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Trade License / Govt Registration Document URL</label>
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
                  onClick={() => { setShowCreateModal(false); setEditingHotel(null); }} 
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
                >
                  {editingHotel ? 'Save Hotel Profile' : 'Register Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
