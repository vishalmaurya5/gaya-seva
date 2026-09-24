'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  Phone, 
  MessageSquare, 
  Link as LinkIcon, 
  Image as ImageIcon,
  X,
  ArrowRight
} from 'lucide-react';
import { ContentStore, SliderBanner, SliderBannerStore } from '../../lib/contentStore';

export default function AdminSliderBannersPage() {
  const [banners, setBanners] = useState<SliderBanner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<SliderBanner | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sequence, setSequence] = useState(1);

  const loadBanners = async () => {
    const fetched = await SliderBannerStore.fetchBannersFromApi();
    setBanners(fetched);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setBadgeText('SPECIAL OFFER');
    setImageUrl('');
    setActionUrl('/pick-drop');
    setButtonText('Book Now');
    setPhone('+919876543201');
    setWhatsapp('919876543201');
    setIsActive(true);
    setSequence(banners.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: SliderBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setBadgeText(banner.badgeText || '');
    setImageUrl(banner.imageUrl);
    setActionUrl(banner.actionUrl);
    setButtonText(banner.buttonText || 'Book Now');
    setPhone(banner.phone);
    setWhatsapp(banner.whatsapp);
    setIsActive(banner.isActive);
    setSequence(banner.sequence);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingBanner) {
      await SliderBannerStore.updateBanner(editingBanner.id, {
        title,
        subtitle,
        badgeText,
        imageUrl,
        actionUrl,
        buttonText,
        phone,
        whatsapp,
        isActive,
        sequence,
      });
    } else {
      await SliderBannerStore.addBanner({
        title,
        subtitle,
        badgeText,
        imageUrl,
        actionUrl,
        buttonText,
        phone,
        whatsapp,
        isActive,
        sequence,
      });
    }

    setIsModalOpen(false);
    await loadBanners();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this slider banner?')) {
      await SliderBannerStore.deleteBanner(id);
      await loadBanners();
    }
  };

  const handleToggleActive = async (banner: SliderBanner) => {
    await SliderBannerStore.updateBanner(banner.id, { isActive: !banner.isActive });
    await loadBanners();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#F58220]" />
            <h1 className="text-2xl font-serif font-bold text-[#4A2E1A]">🖼️ Homepage Rectangular Slider Banners</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage auto-sliding rectangular promotional banners displayed directly below the Hero section on the homepage.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Slider Banner
        </button>
      </div>

      {/* Grid / List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-serif font-bold text-lg text-[#4A2E1A]">Homepage Rectangular Banners</h2>
          <span className="text-xs font-bold bg-[#F8F6EF] px-3 py-1 rounded-full text-[#4A2E1A]">
            Total: {banners.length} Banners
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {banners.map((banner) => (
            <div key={banner.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-4 flex-1">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.title} className="w-32 h-20 object-cover rounded-2xl border border-gray-200" />
                ) : (
                  <div className="w-32 h-20 bg-[#F8F6EF] rounded-2xl flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {banner.badgeText && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#F58220] text-white">
                        {banner.badgeText}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      banner.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {banner.isActive ? '🟢 Active Slide' : '⚪ Inactive'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">Seq #{banner.sequence}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#4A2E1A]">{banner.title}</h3>
                  <p className="text-xs text-gray-500 max-w-xl">{banner.subtitle}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-600">
                    {banner.buttonText && (
                      <span className="font-bold text-[#F58220]">CTA: {banner.buttonText}</span>
                    )}
                    {banner.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#F58220]" /> {banner.phone}
                      </span>
                    )}
                    {banner.whatsapp && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-emerald-600" /> WA: {banner.whatsapp}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(banner)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
                    banner.isActive ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {banner.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleOpenEditModal(banner)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="p-12 text-center text-gray-500 text-xs">
              No slider banners configured yet. Click "Add Slider Banner" to create your first homepage rectangular banner.
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
                {editingBanner ? 'Edit Homepage Slider Banner' : 'Create Homepage Slider Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Badge Text (e.g. EXPRESS TRANSPORT)</label>
                <input
                  type="text"
                  placeholder="EXPRESS TRANSPORT, SPECIAL OFFER..."
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Banner Title / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🚕 Gaya Railway Station Express Pick & Drop Cab"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 24/7 Guaranteed direct pickup from GAYA Junction to Vishnupad Temple."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1">Rectangular Graphic Image URL</label>
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
                  <label className="font-bold text-[#4A2E1A] block mb-1">Button Text</label>
                  <input
                    type="text"
                    placeholder="Book Cab Now"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">Action Link URL</label>
                  <input
                    type="text"
                    placeholder="/pick-drop"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">Call Phone Number (tel:)</label>
                  <input
                    type="text"
                    placeholder="+919876543201"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">WhatsApp Number (wa.me/)</label>
                  <input
                    type="text"
                    placeholder="919876543201"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">Display Sequence Order</label>
                  <input
                    type="number"
                    min="1"
                    value={sequence}
                    onChange={(e) => setSequence(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#4A2E1A]">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-[#F58220] focus:ring-[#F58220]"
                    />
                    <span>Active Slide</span>
                  </label>
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
                  className="px-6 py-2.5 rounded-xl bg-[#F58220] hover:bg-[#E07210] text-white font-bold"
                >
                  Save Slider Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
