'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  Filter, 
  X, 
  UserCheck, 
  CreditCard, 
  Sparkles, 
  Smartphone, 
  Luggage, 
  FileText,
  HeartHandshake
} from 'lucide-react';
import { LostFoundStore, LostFoundItem } from '../../lib/contentStore';
import { ImageUploadInput } from '@/components/ImageUploadInput';

export default function AdminLostFoundPage() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LostFoundItem | null>(null);

  // Form State
  const [type, setType] = useState<'LOST' | 'FOUND'>('LOST');
  const [category, setCategory] = useState<'PERSON' | 'DOCUMENT' | 'VALUABLES' | 'ELECTRONICS' | 'LUGGAGE' | 'OTHER'>('PERSON');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'REPORTED' | 'VERIFIED' | 'REUNITED' | 'CLOSED'>('VERIFIED');

  const loadItems = async () => {
    setItems(LostFoundStore.getItems());
    const fresh = await LostFoundStore.fetchItemsFromApi();
    if (fresh && fresh.length > 0) {
      setItems(fresh);
    }
  };

  useEffect(() => {
    loadItems();
    window.addEventListener('storage', loadItems);
    return () => window.removeEventListener('storage', loadItems);
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setType('LOST');
    setCategory('PERSON');
    setTitle('');
    setDescription('');
    setLocation('');
    setDate(new Date().toISOString().split('T')[0]);
    setReporterName('GayaSeva Control Room');
    setReporterPhone('+91 8544491413');
    setImageUrl('');
    setStatus('VERIFIED');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: LostFoundItem) => {
    setEditingItem(item);
    setType(item.type);
    setCategory(item.category);
    setTitle(item.title);
    setDescription(item.description);
    setLocation(item.location);
    setDate(item.date);
    setReporterName(item.reporterName);
    setReporterPhone(item.reporterPhone);
    setImageUrl(item.imageUrl || '');
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !reporterName.trim() || !reporterPhone.trim()) {
      alert('Please fill all required fields!');
      return;
    }

    if (editingItem) {
      await LostFoundStore.updateItem(editingItem.id, {
        type,
        category,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date,
        reporterName: reporterName.trim(),
        reporterPhone: reporterPhone.trim(),
        imageUrl: imageUrl.trim() || undefined,
        status,
      });
    } else {
      await LostFoundStore.addItem({
        type,
        category,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date,
        reporterName: reporterName.trim(),
        reporterPhone: reporterPhone.trim(),
        imageUrl: imageUrl.trim() || undefined,
        status,
      });
    }

    await loadItems();
    setIsModalOpen(false);
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    await LostFoundStore.updateItem(id, { status: newStatus });
    await loadItems();
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (confirm(`Are you sure you want to permanently delete report "${itemTitle}"?`)) {
      await LostFoundStore.deleteItem(id);
      await loadItems();
    }
  };

  // Filtered list
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporterPhone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;

    return true;
  });

  const totalReports = items.length;
  const lostCount = items.filter(i => i.type === 'LOST' && i.status !== 'REUNITED').length;
  const foundCount = items.filter(i => i.type === 'FOUND' && i.status !== 'REUNITED').length;
  const reunitedCount = items.filter(i => i.status === 'REUNITED').length;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'PERSON': return <UserCheck className="w-4 h-4 text-purple-600" />;
      case 'DOCUMENT': return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'VALUABLES': return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'ELECTRONICS': return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case 'LUGGAGE': return <Luggage className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#2A180B] flex items-center gap-2">
            <span>🔎 Lost & Found Emergency Console</span>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full border border-red-200">
              Admin Helpline Control
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage missing pilgrims, lost wallets, luggage & Aadhaar cards reported via website or 24/7 Helpline (+91 85444 91413).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Helpline Report</span>
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-bold text-slate-500">Total Registered Cases</p>
          <p className="text-2xl font-black text-slate-900">{totalReports}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-2xl border border-red-200 shadow-2xs space-y-1">
          <p className="text-xs font-bold text-red-700">Active Lost Reports</p>
          <p className="text-2xl font-black text-red-600">{lostCount}</p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
          <p className="text-xs font-bold text-emerald-800">Found Items Waiting Owner</p>
          <p className="text-2xl font-black text-emerald-600">{foundCount}</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
          <p className="text-xs font-bold text-amber-900">Reunited / Resolved Cases</p>
          <p className="text-2xl font-black text-amber-600">{reunitedCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, reporter name, phone number..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F58220]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Types (LOST & FOUND)</option>
              <option value="LOST">🔴 LOST Reports Only</option>
              <option value="FOUND">🟢 FOUND Items Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported (Pending Verification)</option>
              <option value="VERIFIED">Verified Active</option>
              <option value="REUNITED">Reunited / Resolved</option>
              <option value="CLOSED">Closed Case</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Type & ID</th>
                <th className="p-3.5">Title & Category</th>
                <th className="p-3.5">Location & Incident Date</th>
                <th className="p-3.5">Reporter Contact</th>
                <th className="p-3.5">Status Update</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                    No Lost & Found reports match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Type & ID */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                          item.type === 'LOST' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {item.type}
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono font-bold">{item.id}</p>
                      </div>
                    </td>

                    {/* Title & Category */}
                    <td className="p-3.5 max-w-xs">
                      <div className="flex items-start gap-2.5">
                        {item.imageUrl && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <p className="font-extrabold text-slate-900 line-clamp-2">{item.title}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                            {getCategoryIcon(item.category)}
                            <span>{item.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location & Date */}
                    <td className="p-3.5">
                      <div className="space-y-1 text-[11px]">
                        <p className="font-extrabold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#F58220]" />
                          <span>{item.location}</span>
                        </p>
                        <p className="text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{item.date}</span>
                        </p>
                      </div>
                    </td>

                    {/* Reporter Contact */}
                    <td className="p-3.5">
                      <div className="space-y-1 text-[11px]">
                        <p className="font-extrabold text-slate-900">{item.reporterName}</p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <a 
                            href={`tel:${item.reporterPhone}`} 
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-[10px] flex items-center gap-1 border border-slate-200"
                          >
                            <PhoneCall className="w-3 h-3 text-[#F58220]" />
                            <span>{item.reporterPhone}</span>
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Status Select */}
                    <td className="p-3.5">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`p-1.5 rounded-lg text-xs font-black border cursor-pointer focus:outline-none ${
                          item.status === 'REUNITED' 
                            ? 'bg-amber-100 text-amber-950 border-amber-300' 
                            : item.status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'REPORTED'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="REPORTED">REPORTED (Pending)</option>
                        <option value="VERIFIED">VERIFIED Active</option>
                        <option value="REUNITED">REUNITED / Found</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          title="Edit Report"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                          title="Delete Report"
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

      {/* Modal Form for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-base text-[#2A180B]">
                {editingItem ? 'Edit Lost & Found Case' : 'Add Helpline Lost & Found Case'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-bold text-slate-800">
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Type: *</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  >
                    <option value="LOST">🔴 LOST</option>
                    <option value="FOUND">🟢 FOUND</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Category: *</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  >
                    <option value="PERSON">PERSON (Missing Person)</option>
                    <option value="DOCUMENT">DOCUMENT (Wallet/ID)</option>
                    <option value="ELECTRONICS">ELECTRONICS (Phone)</option>
                    <option value="LUGGAGE">LUGGAGE (Baggage)</option>
                    <option value="VALUABLES">VALUABLES (Jewelry)</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Title: *</label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Case title"
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-1">Location in Gaya Ji: *</label>
                <input 
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Falgu River Devghat or Vishnupad Gate 1"
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Incident Date: *</label>
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-1">Status: *</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  >
                    <option value="REPORTED">REPORTED</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="REUNITED">REUNITED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Detailed Description:</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description of item or person..."
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Reporter Name: *</label>
                  <input 
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Name"
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-1">Reporter Phone: *</label>
                  <input 
                    type="tel"
                    required
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="+91 8544491413"
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              {/* Photo Upload & URL Selection */}
              <ImageUploadInput
                value={imageUrl}
                onChange={setImageUrl}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Report'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
