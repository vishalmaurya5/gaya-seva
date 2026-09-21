'use client';

import React, { useState, useEffect } from 'react';
import { 
  Car, 
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

export default function DriversManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<UserAccount | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('AC Dzire / Etios Sedan');
  const [customVehicleInput, setCustomVehicleInput] = useState('');
  const [status, setStatus] = useState<UserAccount['status']>('VERIFIED');
  const [city, setCity] = useState('Gaya Junction & Bodhgaya');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  const loadDrivers = async () => {
    const latest = await UserStore.fetchUsersFromApi();
    setUsers(latest);
  };

  const syncDrivers = () => {
    setUsers(UserStore.getUsers());
  };

  useEffect(() => {
    loadDrivers();
    window.addEventListener('storage', syncDrivers);
    return () => window.removeEventListener('storage', syncDrivers);
  }, []);

  // Filter only DRIVER accounts
  const driverAccounts = users.filter((usr) => usr.role === 'DRIVER');

  const filteredDrivers = driverAccounts.filter((drv) => {
    const matchesSearch = 
      drv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drv.phone.includes(searchQuery) ||
      (drv.city && drv.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (drv.customRole && drv.customRole.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || drv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getResolvedVehicleType = () => {
    if (vehicleType === 'Other Custom Vehicle (Manual Input)') {
      return customVehicleInput.trim() || 'Custom Vehicle Taxi';
    }
    return vehicleType;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    UserStore.addUser({
      name,
      email: email || `${phone.replace(/\s+/g, '')}@gayaseva.org`,
      phone,
      role: 'DRIVER',
      customRole: getResolvedVehicleType(),
      status,
      city: city || 'Gaya Junction & Bodhgaya',
      profilePicUrl: profilePicUrl || undefined,
      documentUrl: documentUrl || undefined,
      rating: 4.8,
    });

    loadDrivers();
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;

    UserStore.updateUser(editingDriver.id, {
      name,
      email,
      phone,
      customRole: getResolvedVehicleType(),
      status,
      city,
      profilePicUrl,
      documentUrl,
    });

    loadDrivers();
    setEditingDriver(null);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete driver record "${name}"?`)) {
      UserStore.deleteUser(id);
      loadDrivers();
    }
  };

  const handleApproveStatus = (driver: UserAccount) => {
    const newStatus: UserAccount['status'] = driver.status === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED';
    UserStore.updateUser(driver.id, { status: newStatus });
    loadDrivers();
  };

  const openEditModal = (driver: UserAccount) => {
    setEditingDriver(driver);
    setName(driver.name);
    setEmail(driver.email);
    setPhone(driver.phone);
    const predefined = [
      'Bike / Two-Wheeler Taxi (Motorcycle / Scooter)',
      'AC Dzire / Etios Sedan',
      'Innova Crysta 7-Seater',
      'E-Rickshaw / Auto Pickup',
      'Tempo Traveller 13-Seater'
    ];
    if (driver.customRole && predefined.includes(driver.customRole)) {
      setVehicleType(driver.customRole);
      setCustomVehicleInput('');
    } else {
      setVehicleType('Other Custom Vehicle (Manual Input)');
      setCustomVehicleInput(driver.customRole || '');
    }
    setStatus(driver.status);
    setCity(driver.city || 'Gaya Junction');
    setProfilePicUrl(driver.profilePicUrl || '');
    setDocumentUrl(driver.documentUrl || '');
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setVehicleType('AC Dzire / Etios Sedan');
    setCustomVehicleInput('');
    setStatus('VERIFIED');
    setCity('Gaya Junction & Bodhgaya');
    setProfilePicUrl('');
    setDocumentUrl('');
  };

  const totalDriversCount = driverAccounts.length;
  const verifiedDriversCount = driverAccounts.filter(d => d.status === 'VERIFIED').length;
  const pendingDriversCount = driverAccounts.filter(d => d.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-7 h-7 text-[#F58220]" />
            <h1 className="font-serif text-3xl font-bold text-[#4A2E1A]">🚕 Drivers &amp; Taxi Fleet Management</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">Manage registered taxi, auto, and airport pickup drivers in Gaya Ji &amp; Bodhgaya.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadDrivers} 
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
            <span>Register New Driver</span>
          </button>
        </div>
      </div>

      {/* Driver Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-gray-500 font-semibold block">Total Registered Drivers</span>
          <p className="text-2xl font-extrabold text-[#4A2E1A]">{totalDriversCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <span className="text-emerald-700 font-semibold block">Verified Cab Partners</span>
          <p className="text-2xl font-extrabold text-emerald-600">{verifiedDriversCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <span className="text-amber-700 font-semibold block">Pending Approval</span>
          <p className="text-2xl font-extrabold text-amber-600">{pendingDriversCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-1">
          <span className="text-blue-700 font-semibold block">Average Fleet Rating</span>
          <p className="text-2xl font-extrabold text-blue-600 flex items-center gap-1">
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
            placeholder="Search driver name, phone, vehicle type, station..."
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
            <option value="VERIFIED">Verified Drivers Only</option>
            <option value="PENDING">Pending Verification</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Drivers Data Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A2E1A]">
            <thead className="bg-[#2A180B] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Driver Profile</th>
                <th className="px-6 py-4">Vehicle Category</th>
                <th className="px-6 py-4">Contact &amp; Station</th>
                <th className="px-6 py-4">KYC / Govt ID</th>
                <th className="px-6 py-4">Status &amp; Verification</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No matching driver accounts found.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((drv) => (
                  <tr key={drv.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {drv.profilePicUrl ? (
                          <img src={drv.profilePicUrl} alt={drv.name} className="w-10 h-10 rounded-full object-cover border border-amber-300" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                            <Car className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-sm text-[#4A2E1A]">{drv.name}</p>
                            {drv.status === 'VERIFIED' && (
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px]" title="Verified Driver Partner">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500">ID: {drv.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-blue-50 text-blue-900 border border-blue-200 block w-fit">
                        🚗 {drv.customRole || 'Sedan Taxi'}
                      </span>
                    </td>

                    <td className="px-6 py-4 space-y-0.5">
                      <p className="flex items-center gap-1 text-gray-800 font-semibold"><Phone className="w-3 h-3 text-gray-400" /> {drv.phone}</p>
                      <p className="flex items-center gap-1 text-gray-500 text-[11px]"><Mail className="w-3 h-3 text-gray-400" /> {drv.email}</p>
                      <p className="flex items-center gap-1 text-amber-700 text-[10px] font-semibold"><MapPin className="w-3 h-3 text-amber-500" /> {drv.city || 'Gaya Station & Airport'}</p>
                    </td>

                    <td className="px-6 py-4">
                      {drv.documentUrl ? (
                        <a 
                          href={drv.documentUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 hover:bg-amber-100 transition-colors w-fit"
                        >
                          <FileText className="w-3 h-3 text-amber-600" /> View Driving License <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No DL uploaded</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {drv.status === 'VERIFIED' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> VERIFIED CAB
                        </span>
                      ) : drv.status === 'PENDING' ? (
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
                          onClick={() => handleApproveStatus(drv)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                            drv.status === 'VERIFIED' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          } transition-colors shadow-xs`}
                        >
                          {drv.status === 'VERIFIED' ? 'Suspend' : 'Approve & Verify'}
                        </button>

                        <button
                          onClick={() => openEditModal(drv)}
                          className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                          title="Edit Driver Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(drv.id, drv.name)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Driver"
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

      {/* Driver Add/Edit Modal */}
      {(showCreateModal || editingDriver) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-serif font-bold text-xl text-[#4A2E1A]">
                {editingDriver ? 'Edit Driver Details' : 'Register New Driver'}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setEditingDriver(null); }}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={editingDriver ? handleUpdate : handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Driver Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Ramesh Kumar (Taxi)"
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
                  placeholder="+91 98765 43220"
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Vehicle / Cab Category</label>
                <select 
                  value={vehicleType} 
                  onChange={(e) => setVehicleType(e.target.value)} 
                  className="w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#F58220]"
                >
                  <option value="Bike / Two-Wheeler Taxi (Motorcycle / Scooter)">🏍️ Bike / Two-Wheeler Taxi (Motorcycle / Scooter)</option>
                  <option value="AC Dzire / Etios Sedan">🚗 AC Dzire / Etios Sedan</option>
                  <option value="Innova Crysta 7-Seater">🚙 Innova Crysta 7-Seater</option>
                  <option value="E-Rickshaw / Auto Pickup">🛺 E-Rickshaw / Auto Pickup</option>
                  <option value="Tempo Traveller 13-Seater">🚐 Tempo Traveller 13-Seater</option>
                  <option value="Other Custom Vehicle (Manual Input)">✏️ Other Custom Vehicle (Manual Input)</option>
                </select>

                {vehicleType === 'Other Custom Vehicle (Manual Input)' && (
                  <input
                    type="text"
                    required
                    value={customVehicleInput}
                    onChange={(e) => setCustomVehicleInput(e.target.value)}
                    placeholder="Enter Custom Vehicle Name (e.g. Electric Scooter / Vintage Car)"
                    className="w-full mt-2 px-3 py-2 border border-amber-300 bg-amber-50/60 rounded-xl focus:outline-none focus:border-[#F58220] text-xs font-semibold"
                  />
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Operating Zone / Station</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="e.g. Gaya Junction Railway Station & Bodhgaya"
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
                <label className="block font-bold text-gray-700 mb-1">Driving License / Govt ID Document URL</label>
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
                  onClick={() => { setShowCreateModal(false); setEditingDriver(null); }} 
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
                >
                  {editingDriver ? 'Save Driver Changes' : 'Register Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
