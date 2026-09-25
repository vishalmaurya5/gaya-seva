'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  Link as LinkIcon, 
  Image as ImageIcon,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileImage
} from 'lucide-react';
import { ContentStore, PopupAd, PopupAdStore } from '../../lib/contentStore';

export default function AdminPopupAdsPage() {
  const [ads, setAds] = useState<PopupAd[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<PopupAd | null>(null);
  const [previewAd, setPreviewAd] = useState<PopupAd | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSizeKb, setImageSizeKb] = useState<number | undefined>(undefined);
  const [actionUrl, setActionUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [delaySeconds, setDelaySeconds] = useState(1);

  // Upload state & validation
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setImageSizeKb(undefined);
    setActionUrl('/services');
    setPhone('+919117588242');
    setWhatsapp('919117588242');
    setIsActive(true);
    setDelaySeconds(1);
    setUploadError(null);
    setUploadSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ad: PopupAd) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setSubtitle(ad.subtitle);
    setImageUrl(ad.imageUrl || '');
    setImageSizeKb(ad.imageSizeKb);
    setActionUrl(ad.actionUrl || '');
    setPhone(ad.phone || '');
    setWhatsapp(ad.whatsapp || '');
    setIsActive(ad.isActive);
    setDelaySeconds(ad.delaySeconds || 1);
    setUploadError(null);
    setUploadSuccess(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    // 1. Strict Client-side 200KB Validation Limit
    const MAX_SIZE_BYTES = 200 * 1024; // 200 KB
    const fileSizeKb = Math.round((file.size / 1024) * 10) / 10;

    if (file.size > MAX_SIZE_BYTES) {
      setUploadError(
        `⚠️ Photo size is ${fileSizeKb} KB, which exceeds the strict 200 KB limit! Please select an image under 200 KB.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Upload file via /api/upload endpoint
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'popup-ads');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      setImageUrl(data.url);
      setImageSizeKb(fileSizeKb);
      setUploadSuccess(`Photo uploaded successfully (${fileSizeKb} KB / Max 200 KB)`);
    } catch (err: any) {
      setUploadError(err?.message || 'Error uploading photo file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setImageUrl('');
    setImageSizeKb(undefined);
    setUploadSuccess(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a Popup Title');
      return;
    }

    const payload = {
      title,
      subtitle,
      imageUrl,
      imageSizeKb,
      actionUrl,
      phone,
      whatsapp,
      isActive,
      delaySeconds: Number(delaySeconds) || 1,
    };

    if (editingAd) {
      await PopupAdStore.updateAd(editingAd.id, payload);
    } else {
      await PopupAdStore.addAd(payload);
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

  const activeAdCount = ads.filter(a => a.isActive).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#F58220]" />
            <h1 className="text-2xl font-serif font-bold text-[#4A2E1A]">📢 Website Opening Popup Advertisements</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Full admin control over modal advertisements shown to pilgrims when opening GayaSeva. Enforces strict <strong>200KB Photo Limit</strong>.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-[#F58220] hover:bg-[#E07210] text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Add Popup Advertisement
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F58220] flex items-center justify-center font-bold text-xl">
            {ads.length}
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Ads</div>
            <div className="text-lg font-serif font-bold text-[#4A2E1A]">Configured Popups</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            {activeAdCount}
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Status</div>
            <div className="text-lg font-serif font-bold text-emerald-800">
              {activeAdCount > 0 ? '🟢 Live on Website' : '⚪ All Inactive'}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            200K
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Photo Limit Rule</div>
            <div className="text-xs font-bold text-gray-700">Strict Max 200KB Per Photo</div>
          </div>
        </div>
      </div>

      {/* Table Data List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#4A2E1A]">Configured Popup Advertisements Column View</h2>
            <p className="text-xs text-gray-500">Includes Photo Column (Max 200KB limit), Headline, Contacts, Delay & Controls</p>
          </div>
          <span className="text-xs font-bold bg-[#F8F6EF] px-3 py-1.5 rounded-full text-[#4A2E1A] border border-[#F58220]/20">
            Total: {ads.length} Popups
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6EF]/60 text-[#4A2E1A] font-bold border-b border-gray-200">
                <th className="p-4 w-40">📸 Photo (Max 200KB)</th>
                <th className="p-4">📢 Title & Offer Description</th>
                <th className="p-4 w-48">📞 Call / WA / Link</th>
                <th className="p-4 w-28">⚡ Popup Delay</th>
                <th className="p-4 w-32">Status Control</th>
                <th className="p-4 w-36 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Photo Column */}
                  <td className="p-4 align-top">
                    {ad.imageUrl ? (
                      <div className="space-y-1">
                        <div 
                          onClick={() => setLightboxImage(ad.imageUrl)} 
                          className="group relative w-28 h-20 rounded-xl overflow-hidden border border-gray-200 cursor-pointer shadow-sm bg-gray-100"
                        >
                          <img 
                            src={ad.imageUrl} 
                            alt={ad.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-5 h-5" />
                          </div>
                        </div>
                        {ad.imageSizeKb ? (
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {ad.imageSizeKb} KB
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] font-medium text-gray-500">
                            Image Set
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-28 h-20 bg-gray-100 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
                        <span className="text-[10px]">No Photo</span>
                      </div>
                    )}
                  </td>

                  {/* Headline & Description Column */}
                  <td className="p-4 align-top max-w-sm">
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-[#4A2E1A] leading-snug">{ad.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{ad.subtitle}</p>
                    </div>
                  </td>

                  {/* Contact Info Column */}
                  <td className="p-4 align-top space-y-1 text-[11px] text-gray-700">
                    {ad.phone && (
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <Phone className="w-3.5 h-3.5 text-[#F58220]" />
                        <span className="font-medium">{ad.phone}</span>
                      </div>
                    )}
                    {ad.whatsapp && (
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="font-medium">WA: {ad.whatsapp}</span>
                      </div>
                    )}
                    {ad.actionUrl && (
                      <div className="flex items-center gap-1.5 text-blue-600 truncate max-w-[180px]">
                        <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{ad.actionUrl}</span>
                      </div>
                    )}
                  </td>

                  {/* Delay Column */}
                  <td className="p-4 align-top">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                      <Clock className="w-3 h-3 text-[#F58220]" />
                      {ad.delaySeconds || 1} Sec
                    </span>
                  </td>

                  {/* Status Toggle Column */}
                  <td className="p-4 align-top">
                    <button
                      onClick={() => handleToggleActive(ad)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                        ad.isActive 
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${ad.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                      {ad.isActive ? 'Active Live' : 'Inactive'}
                    </button>
                  </td>

                  {/* Actions Column */}
                  <td className="p-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewAd(ad)}
                        title="Preview Modal as Pilgrim"
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors border border-amber-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(ad)}
                        title="Edit Popup Ad"
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors border border-gray-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        title="Delete Popup Ad"
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {ads.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 text-xs">
                    No popup advertisements configured yet. Click "Add Popup Advertisement" to create your first opening ad.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#4A2E1A]">
                  {editingAd ? '✏️ Edit Website Opening Popup Ad' : '➕ Create Website Opening Popup Ad'}
                </h3>
                <p className="text-xs text-gray-500">Configure modal popup controls, contacts, and 200KB banner photo.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Title */}
              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1.5">Popup Title / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🙏 Pitru Paksha 2026 Special Pinda Daan Package"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#F58220] transition-colors"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="font-bold text-[#4A2E1A] block mb-1.5">Subtitle / Offer Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Book verified Pandits & VIP Vishnupad Darshan Assistance with 0% extra fee."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#F58220] transition-colors"
                />
              </div>

              {/* PHOTO UPLOAD COLUMN WITH 200KB ENFORCEMENT */}
              <div className="p-4 bg-[#F8F6EF]/60 rounded-2xl border border-[#F58220]/20 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#4A2E1A] flex items-center gap-1.5">
                    <FileImage className="w-4 h-4 text-[#F58220]" />
                    <span>Upload Ad Photo (Strict 200KB Limit)</span>
                  </label>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Max File Size: 200 KB
                  </span>
                </div>

                {/* Upload Input & Drag Area */}
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="popup-photo-input"
                  />
                  <label
                    htmlFor="popup-photo-input"
                    className={`flex-1 w-full p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      uploading
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-white border-gray-300 hover:border-[#F58220] text-gray-700'
                    }`}
                  >
                    <Upload className="w-5 h-5 text-[#F58220]" />
                    <span className="font-bold">
                      {uploading ? 'Uploading photo...' : 'Click to Upload Photo (Max 200KB)'}
                    </span>
                  </label>

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3.5 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-200 shrink-0"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Upload Error Banner */}
                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-xs flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Upload Success Banner */}
                {uploadSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                {/* Image Preview & Alternative URL */}
                {imageUrl ? (
                  <div className="flex items-center gap-4 pt-1">
                    <img
                      src={imageUrl}
                      alt="Ad Preview"
                      className="w-24 h-16 object-cover rounded-xl border border-gray-300 shadow-sm"
                    />
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="text-[11px] font-bold text-gray-700 truncate">{imageUrl}</div>
                      {imageSizeKb && (
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Validated Size: {imageSizeKb} KB
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-[11px] text-gray-500 block mb-1">Or enter external image URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImageSizeKb(undefined);
                      }}
                      className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Contacts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">Call Phone Number (tel:)</label>
                  <input
                    type="text"
                    placeholder="+919117588242"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">WhatsApp Number (wa.me/)</label>
                  <input
                    type="text"
                    placeholder="919117588242"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
              </div>

              {/* Action Link & Quick presets */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-[#4A2E1A]">CTA Action Link URL</label>
                  <div className="flex gap-1.5 text-[10px]">
                    <button type="button" onClick={() => setActionUrl('/services')} className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded font-medium text-gray-700">/services</button>
                    <button type="button" onClick={() => setActionUrl('/pandit')} className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded font-medium text-gray-700">/pandit</button>
                    <button type="button" onClick={() => setActionUrl('/pick-drop')} className="px-2 py-0.5 bg-gray-100 hover:bg-[#F58220]/20 rounded font-medium text-gray-700">/pick-drop</button>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="/services or https://..."
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>

              {/* Delay & Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-bold text-[#4A2E1A] block mb-1">Popup Delay (Seconds)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={delaySeconds}
                    onChange={(e) => setDelaySeconds(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold text-sm"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#4A2E1A] bg-emerald-50 p-3 rounded-xl border border-emerald-200 w-full">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#F58220] focus:ring-[#F58220]"
                    />
                    <span>Active (Show live on website opening)</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
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
                  className="px-6 py-2.5 rounded-xl bg-[#F58220] hover:bg-[#E07210] text-white font-bold shadow-md hover:scale-[1.02] transition-transform"
                >
                  Save Popup Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Pilgrim View Preview Modal */}
      {previewAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-lg bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#321808] via-[#1B0E05] to-[#0A0502] text-white rounded-3xl border border-[#F6C343]/35 shadow-[0_0_60px_rgba(245,130,32,0.3)] overflow-hidden p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setPreviewAd(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 backdrop-blur-md hover:rotate-90 transition-all duration-300 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#F58220]/20 via-[#F6C343]/20 to-[#F58220]/10 border border-[#F6C343]/40 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#F6C343]" />
              <span className="text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#FFE599] via-[#F6C343] to-[#F58220] bg-clip-text text-transparent">
                GayaSeva Official Offer (Live Preview)
              </span>
            </div>

            {previewAd.imageUrl && (
              <div className="group relative aspect-[16/9] sm:h-52 w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/40">
                <img
                  src={previewAd.imageUrl}
                  alt={previewAd.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B0E05] via-transparent to-transparent opacity-60" />
              </div>
            )}

            <div className="space-y-2.5">
              <h2 className="text-2xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF5EB] to-[#FFE0C2] leading-tight tracking-tight drop-shadow-md">
                {previewAd.title}
              </h2>
              <p className="text-xs text-[#F8F6EF]/90 leading-relaxed font-medium">
                {previewAd.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {previewAd.phone && (
                <div className="px-5 py-3.5 bg-gradient-to-r from-[#F58220] via-[#FF9933] to-[#E07210] text-white font-extrabold text-xs rounded-2xl shadow-[0_6px_25px_rgba(245,130,32,0.45)] flex items-center justify-center gap-2 border border-white/20">
                  <Phone className="w-4 h-4 fill-current" /> Call Now
                </div>
              )}
              {previewAd.whatsapp && (
                <div className="px-5 py-3.5 bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#128C7E] text-white font-extrabold text-xs rounded-2xl shadow-[0_6px_25px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2 border border-white/20">
                  <MessageSquare className="w-4 h-4 fill-current" /> WhatsApp
                </div>
              )}
            </div>

            {previewAd.actionUrl && (
              <div className="w-full py-3.5 bg-gradient-to-r from-[#F6C343]/10 via-[#F58220]/10 to-[#F6C343]/10 text-[#F6C343] border border-[#F6C343]/35 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2.5 backdrop-blur-md">
                <span>Explore Link ({previewAd.actionUrl})</span>
                <LinkIcon className="w-4 h-4" />
              </div>
            )}

            <button
              onClick={() => setPreviewAd(null)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs rounded-2xl border border-white/15 transition-colors"
            >
              Close Live Preview
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-black p-2 rounded-2xl border border-gray-700 shadow-2xl">
            <button 
              onClick={() => setLightboxImage(null)} 
              className="absolute -top-4 -right-4 p-2 bg-white rounded-full text-black font-bold shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={lightboxImage} alt="Expanded preview" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
