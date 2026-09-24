'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  Link as LinkIcon, 
  Image as ImageIcon,
  X
} from 'lucide-react';
import { ContentStore, PopupAd, PopupAdStore } from '../../lib/contentStore';

export default function AdminPopupAdsPage() {
  const [ads, setAds] = useState<PopupAd[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<PopupAd | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [delaySeconds, setDelaySeconds] = useState(1);

  const loadAds = async () => {
    const fetched = await PopupAdStore.fetchAdsFromApi();
    setAds(fetched);
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAd(null);
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    setActionUrl('/pandit');
    setPhone('+919876543200');
    setWhatsapp('919876543200');
    setIsActive(true);
    setDelaySeconds(1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ad: PopupAd) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setSubtitle(ad.subtitle);
    setImageUrl(ad.imageUrl);
    setActionUrl(ad.actionUrl);
    setPhone(ad.phone);
    setWhatsapp(ad.whatsapp);
    setIsActive(ad.isActive);
    setDelaySeconds(ad.delaySeconds || 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingAd) {
      await PopupAdStore.updateAd(editingAd.id, {
        title,
        subtitle,
        imageUrl,
        actionUrl,
        phone,
        whatsapp,
        isActive,
        delaySeconds,
      });
    } else {
      await PopupAdStore.addAd({
        title,
        subtitle,
        imageUrl,
        actionUrl,
        phone,
        whatsapp,
        isActive,
        delaySeconds,
      });
    }

    setIsModalOpen(false);
    await loadAds();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this popup advertisement?')) {
      await PopupAdStore.deleteAd(id);
      await loadAds();
    }
  };

  const handleToggleActive = async (ad: PopupAd) => {
    await PopupAdStore.updateAd(ad.id, { isActive: !ad.isActive });
    await loadAds();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#F58220]" />
            <h1 className="text-2xl font-serif font-bold text-[#4A2E1A]">📢 Website Opening Popup Advertisements</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage modal advertisements that pop up instantly when pilgrims open the website.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Popup Advertisement
        </button>
      </div>

      {/* Grid / List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-serif font-bold text-lg text-[#4A2E1A]">Configured Popup Advertisements</h2>
          <span className="text-xs font-bold bg-[#F8F6EF] px-3 py-1 rounded-full text-[#4A2E1A]">
            Total: {ads.length} Ads
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {ads.map((ad) => (
            <div key={ad.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-4 flex-1">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="w-24 h-18 object-cover rounded-2xl border border-gray-200" />
                ) : (
                  <div className="w-24 h-18 bg-[#F8F6EF] rounded-2xl flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ad.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ad.isActive ? '🟢 Active Modal Ad' : '⚪ Inactive'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#4A2E1A]">{ad.title}</h3>
                  <p className="text-xs text-gray-500 max-w-xl">{ad.subtitle}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-600">
                    {ad.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#F58220]" /> Call: {ad.phone}
                      </span>
                    )}
                    {ad.whatsapp && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-emerald-600" /> WA: {ad.whatsapp}
                      </span>
                    )}
                    {ad.actionUrl && (
                      <span className="flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-blue-600" /> URL: {ad.actionUrl}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(ad)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
                    ad.isActive ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {ad.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleOpenEditModal(ad)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {ads.length === 0 && (
            <div className="p-12 text-center text-gray-500 text-xs">
              No popup advertisements configured yet. Click "Add Popup Advertisement" to create your first popup ad.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-serif font-bold text-lg text-[#4A2E1A]">
                {editingAd ? 'Edit Website Opening Popup Ad' : 'Create Website Opening Popup Ad'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Popup Title / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🙏 Pitru Paksha 2026 Special Pinda Daan Package"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Subtitle / Offer Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Book verified Pandits & VIP Vishnupad Darshan Assistance."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Banner Image / Graphic URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">Call Phone Number (tel:)</label>
                  <input
                    type="text"
                    placeholder="+919876543200"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">WhatsApp Number (wa.me/)</label>
                  <input
                    type="text"
                    placeholder="919876543200"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">CTA Action Link URL</label>
                <input
                  type="text"
                  placeholder="/pandit or https://..."
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#4A2E1A]">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-[#F58220] focus:ring-[#F58220]"
                  />
                  <span>Active (Show as Website Opening Modal)</span>
                </label>
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
                  className="px-6 py-2.5 rounded-xl bg-[#F58220] hover:bg-[#E07210] text-white font-bold"
                >
                  Save Popup Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
