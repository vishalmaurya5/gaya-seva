'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Car, 
  Flame, 
  Hotel, 
  Utensils, 
  ShoppingBag,
  X,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
  Scissors,
  Compass,
  Sparkles,
  Phone,
  MessageCircle,
  Search
} from 'lucide-react';
import { ContentStore, ServiceConfigItem } from '../../lib/contentStore';
import { AuditLogStore } from '../../lib/auditLogStore';

export default function AdminServicesConfigPage() {
  const [services, setServices] = useState<ServiceConfigItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceConfigItem | null>(null);

  // Form State
  const [category, setCategory] = useState<'PICK_DROP' | 'PANDIT' | 'BARBER' | 'STAY' | 'FOOD' | 'PUJA_KIT' | 'GUIDE'>('PICK_DROP');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [priceText, setPriceText] = useState('');
  const [details, setDetails] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const loadServices = () => {
    setServices(ContentStore.getServices());
  };

  useEffect(() => {
    loadServices();
    window.addEventListener('storage', loadServices);
    return () => window.removeEventListener('storage', loadServices);
  }, []);

  const handleOpenAddModal = () => {
    setEditingService(null);
    setCategory('PICK_DROP');
    setTitle('');
    setSubtitle('');
    setPriceText('₹300');
    setDetails('');
    setImageUrl('');
    setPhone('+918544491413');
    setWhatsapp('918544491413');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (srv: ServiceConfigItem) => {
    setEditingService(srv);
    setCategory(srv.category);
    setTitle(srv.title);
    setSubtitle(srv.subtitle);
    setPriceText(srv.priceText);
    setDetails(srv.details);
    setImageUrl(srv.imageUrl || '');
    setPhone(srv.phone || '');
    setWhatsapp(srv.whatsapp || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingService) {
      ContentStore.updateService(editingService.id, {
        category,
        title: title.trim(),
        subtitle: subtitle.trim(),
        priceText: priceText.trim(),
        details: details.trim(),
        imageUrl: imageUrl.trim() || undefined,
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
      });
      AuditLogStore.log('SERVICE_LISTING_UPDATED', `Listing: ${title}`, `Updated ${category} service entry details & pricing`, 'SYSTEM_CONFIG');
      setNotification(`✏️ Updated service entry: "${title}"`);
    } else {
      ContentStore.addService({
        category,
        title: title.trim(),
        subtitle: subtitle.trim(),
        priceText: priceText.trim(),
        details: details.trim(),
        imageUrl: imageUrl.trim() || undefined,
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
      });
      AuditLogStore.log('SERVICE_LISTING_CREATED', `Listing: ${title}`, `Created new ${category} service entry with price ${priceText}`, 'SYSTEM_CONFIG');
      setNotification(`✅ Added new service entry: "${title}". Live on public website /services!`);
    }

    setIsModalOpen(false);
    loadServices();
    setTimeout(() => setNotification(''), 5000);
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (confirm(`Are you sure you want to delete "${itemTitle}" from service catalog?`)) {
      ContentStore.deleteService(id);
      AuditLogStore.log('SERVICE_LISTING_DELETED', `Listing: ${itemTitle} (${id})`, 'Deleted service listing entry from catalog', 'SYSTEM_CONFIG');
      loadServices();
      setNotification(`🗑️ Deleted service entry: "${itemTitle}"`);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const filteredServices = services.filter((srv) => {
    const matchesCat = activeCategory === 'ALL' || srv.category === activeCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-amber-900 font-extrabold uppercase px-2.5 py-0.5 bg-amber-100 rounded-full border border-amber-300">
              0% COMMISSION FARES ENGINE
            </span>
            <span className="text-[10px] text-emerald-800 font-bold px-2 py-0.5 bg-emerald-100 rounded-full border border-emerald-300">
              Live Website Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A2E1A]">
            Service Catalog &amp; Fares CRUD Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, edit, and delete Pick &amp; Drop routes, Purohit listings, Mundan Barbers, Stay fares, and Puja Kits. Changes immediately sync to main website.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <a
            href="http://localhost:3000/services"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-2xl border border-amber-300 shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>🌐 View Public Website (/services)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#F58220]" />
          </a>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Service Listing
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Category Tabs & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {[
              { key: 'ALL', label: `All Services (${services.length})` },
              { key: 'PICK_DROP', label: '🚕 Taxi / Pick & Drop' },
              { key: 'PANDIT', label: '🙏 Purohit & Pandit' },
              { key: 'BARBER', label: '✂️ Barber (नाई / ठाकुर)' },
              { key: 'STAY', label: '🏨 Hotel & Dharamshala' },
              { key: 'FOOD', label: '🍲 Satvik Food' },
              { key: 'PUJA_KIT', label: '🛍️ Puja Kit & Tilkut' },
              { key: 'GUIDE', label: '🧭 Gaya Guide' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  activeCategory === cat.key 
                    ? 'bg-[#2A180B] text-[#F6C343] border-[#2A180B] shadow-sm' 
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#F58220]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, details..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#F58220]"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <Sparkles className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-bold text-lg text-gray-800">No Service Listings Found</h3>
          <p className="text-xs text-gray-500">No catalog entries currently match this filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => (
            <div 
              key={srv.id} 
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#F58220] hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                    {srv.category}
                  </span>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ID: {srv.id}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  {srv.imageUrl && (
                    <img 
                      src={srv.imageUrl} 
                      alt={srv.title} 
                      className="w-14 h-14 rounded-2xl object-cover border border-amber-300 shrink-0 shadow-xs" 
                    />
                  )}

                  <div>
                    <h3 className="font-bold text-base text-[#4A2E1A] group-hover:text-[#F58220] transition-colors">{srv.title}</h3>
                    <p className="text-xs font-bold text-[#F58220] mt-0.5">{srv.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {srv.details}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
                  {srv.phone && (
                    <span className="flex items-center gap-1 font-bold text-gray-800">
                      <Phone className="w-3.5 h-3.5 text-[#F58220]" /> {srv.phone}
                    </span>
                  )}
                  {srv.whatsapp && (
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WA: {srv.whatsapp}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-serif font-bold text-sm text-[#4A2E1A] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {srv.priceText}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(srv)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    title="Edit Service Entry"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    title="Delete Service Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-serif font-bold text-lg text-[#4A2E1A]">
                {editingService ? `Edit Service Entry (${editingService.id})` : 'Add New Service Listing Entry'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Service Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 font-bold focus:outline-none focus:border-[#F58220]"
                >
                  <option value="PICK_DROP">PICK_DROP (Taxi / Pick &amp; Drop Transfer)</option>
                  <option value="PANDIT">PANDIT (Verified Purohit &amp; Pandit Ji)</option>
                  <option value="BARBER">BARBER (Kshaur Karma &amp; Mundan Barber ناई/ठाकुर)</option>
                  <option value="STAY">STAY (Hotel, Dharamshala &amp; Yatri Stay)</option>
                  <option value="FOOD">FOOD (Satvik Food &amp; Pure Veg Meal)</option>
                  <option value="PUJA_KIT">PUJA_KIT (Pinda Daan Kit &amp; Ramna Tilkut)</option>
                  <option value="GUIDE">GUIDE (Gaya Guide &amp; Shrine Tour)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaya Station → Vishnupad Temple or Pandit Rajesh Shastri"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 font-medium focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Subtitle / Vehicle / Experience Sub-heading</label>
                <input
                  type="text"
                  placeholder="e.g. AC Sedan Cab • 22+ Yrs Experience • Mundan Specialist"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 font-medium focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Price / Fare Estimate Text *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹250 - ₹350 or GayaSeva 0% Commission Direct Rate"
                  value={priceText}
                  onChange={(e) => setPriceText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 font-medium focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Service Photo Image URL (Optional)</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-gray-50 border border-gray-300 font-medium focus:outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Details &amp; Description</label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive service description for pilgrims..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 font-medium focus:outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">Call Phone Number</label>
                  <input
                    type="text"
                    placeholder="+918544491413"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 font-medium focus:outline-none focus:border-[#F58220]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">WhatsApp Direct Number</label>
                  <input
                    type="text"
                    placeholder="918544491413"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 font-medium focus:outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F58220] hover:bg-[#E07210] text-white font-bold shadow-md cursor-pointer"
                >
                  {editingService ? 'Save Changes' : 'Publish Service Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
