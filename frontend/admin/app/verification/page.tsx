'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  PauseCircle, 
  FileText, 
  MapPin, 
  ExternalLink, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Upload,
  Camera,
  Edit3,
  Image as ImageIcon,
  ZoomIn
} from 'lucide-react';
import { UserStore, UserAccount } from '@/lib/userStore';
import { AuditLogStore } from '@/lib/auditLogStore';

export default function VerificationPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'SUSPENDED'>('ALL');
  const [notification, setNotification] = useState('');

  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Direct Profile Photo Edit State
  const [editingProfileUser, setEditingProfileUser] = useState<UserAccount | null>(null);
  const [profileInputUrl, setProfileInputUrl] = useState('');

  // Direct Document Edit State
  const [editingDocUser, setEditingDocUser] = useState<UserAccount | null>(null);
  const [docInputUrl, setDocInputUrl] = useState('');

  const reloadUsers = async () => {
    const latest = await UserStore.fetchUsersFromApi();
    setUsers(latest);
  };

  const syncUsers = () => {
    setUsers(UserStore.getUsers());
  };

  useEffect(() => {
    reloadUsers();
    window.addEventListener('storage', syncUsers);
    return () => window.removeEventListener('storage', syncUsers);
  }, []);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleProfileFileUpload = (user: UserAccount, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      UserStore.updateUser(user.id, { avatarUrl: dataUrl, profilePicUrl: dataUrl });
      setFailedImages((prev) => ({ ...prev, [user.id]: false }));
      AuditLogStore.log('PROFILE_PHOTO_UPLOADED', `Partner: ${user.name} (${user.id})`, 'Uploaded device photo for provider profile', 'VERIFICATION');
      reloadUsers();
      setNotification(`📸 Profile photo uploaded for ${user.name}`);
      setTimeout(() => setNotification(''), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleDocFileUpload = (user: UserAccount, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      UserStore.updateUser(user.id, { documentUrl: dataUrl });
      AuditLogStore.log('DOCUMENT_UPLOADED', `Partner: ${user.name} (${user.id})`, 'Uploaded device file for Govt verification document', 'VERIFICATION');
      reloadUsers();
      setNotification(`📄 Verification document uploaded for ${user.name}`);
      setTimeout(() => setNotification(''), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfileUser) return;

    const newUrl = profileInputUrl.trim() || undefined;
    UserStore.updateUser(editingProfileUser.id, { avatarUrl: newUrl, profilePicUrl: newUrl });
    AuditLogStore.log('PROFILE_PHOTO_UPDATED', `Partner: ${editingProfileUser.name} (${editingProfileUser.id})`, 'Updated profile photo URL', 'VERIFICATION');
    setFailedImages((prev) => ({ ...prev, [editingProfileUser.id]: false }));
    reloadUsers();
    setEditingProfileUser(null);
    setProfileInputUrl('');
    setNotification(`📸 Profile photo updated for ${editingProfileUser.name}`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleSaveDocumentUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocUser) return;

    UserStore.updateUser(editingDocUser.id, { documentUrl: docInputUrl.trim() || undefined });
    AuditLogStore.log('DOCUMENT_UPDATED', `Partner: ${editingDocUser.name} (${editingDocUser.id})`, 'Updated Govt ID document URL', 'VERIFICATION');
    reloadUsers();
    setEditingDocUser(null);
    setDocInputUrl('');
    setNotification(`📄 Govt ID document updated for ${editingDocUser.name}`);
    setTimeout(() => setNotification(''), 4000);
  };

  // Filter out non-provider pilgrims to focus on service providers
  const providers = users.filter((u) => u.role !== 'PILGRIM');

  const filteredProviders = providers.filter((p) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'PENDING') return p.status === 'PENDING';
    if (filterStatus === 'VERIFIED') return p.status === 'VERIFIED';
    if (filterStatus === 'SUSPENDED') return p.status === 'SUSPENDED' || (p.status as string) === 'REJECTED';
    return true;
  });

  const handleAction = (id: string, name: string, newStatus: 'VERIFIED' | 'REJECTED' | 'SUSPENDED') => {
    const updated = UserStore.updateUser(id, { status: newStatus as any });
    if (updated) {
      reloadUsers();
      if (newStatus === 'VERIFIED') {
        AuditLogStore.log('PROVIDER_APPROVED', `Partner: ${name} (${id})`, 'Approved partner application & activated verified tick badge', 'VERIFICATION');
        setNotification(`✅ ${name} has been APPROVED! Verified Tick Badge is now active on public service lists.`);
      } else if (newStatus === 'REJECTED') {
        AuditLogStore.log('PROVIDER_REJECTED', `Partner: ${name} (${id})`, 'Rejected partner application', 'VERIFICATION');
        setNotification(`🔴 ${name} application was REJECTED.`);
      } else {
        AuditLogStore.log('PROVIDER_SUSPENDED', `Partner: ${name} (${id})`, 'Suspended partner account', 'VERIFICATION');
        setNotification(`⏸️ ${name} account has been SUSPENDED.`);
      }
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const pendingCount = providers.filter((p) => p.status === 'PENDING').length;
  const verifiedCount = providers.filter((p) => p.status === 'VERIFIED').length;
  const suspendedCount = providers.filter((p) => p.status === 'SUSPENDED' || (p.status as string) === 'REJECTED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A2E1A] flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-[#F58220]" />
            Provider Verification Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review partner applications, inspect or upload profile photos & Govt Aadhaar/PAN IDs, and approve verified tick badges.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
          <Clock className="w-4 h-4 text-[#F58220]" />
          <span className="text-xs font-bold text-amber-900">
            {pendingCount} Pending Applications
          </span>
        </div>
      </div>

      {/* Action Notification Feedback */}
      {notification && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: `All Partners (${providers.length})` },
          { key: 'PENDING', label: `⏳ Pending Review (${pendingCount})` },
          { key: 'VERIFIED', label: `🟢 Verified (${verifiedCount})` },
          { key: 'SUSPENDED', label: `🔴 Rejected / Suspended (${suspendedCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
              filterStatus === tab.key
                ? 'bg-[#2A180B] text-[#F6C343] border-[#2A180B] shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#F58220]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Provider List Feed */}
      {filteredProviders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-bold text-lg text-gray-800">No Providers Found</h3>
          <p className="text-xs text-gray-500">No partner accounts currently match this filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProviders.map((p) => {
            const isPending = p.status === 'PENDING';
            const isVerified = p.status === 'VERIFIED';
            const isSuspended = p.status === 'SUSPENDED' || (p.status as string) === 'REJECTED';
            const picSrc = p.avatarUrl || p.profilePicUrl;
            const hasValidPic = picSrc && !failedImages[p.id];

            return (
              <div 
                key={p.id} 
                className={`bg-white p-6 sm:p-8 rounded-3xl border-2 shadow-sm space-y-6 transition-all ${
                  isPending ? 'border-amber-300 ring-2 ring-amber-400/20' : isVerified ? 'border-emerald-200' : 'border-red-200'
                }`}
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    
                    {/* Profile Picture Box with Upload & Zoom Controls */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div 
                        onClick={() => {
                          if (hasValidPic) {
                            setPreviewModalUrl(picSrc);
                            setPreviewTitle(`${p.name} — Profile Photo`);
                          }
                        }}
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 border-2 border-amber-300 overflow-hidden shrink-0 flex items-center justify-center font-bold text-amber-900 text-xl shadow-xs relative group ${
                          hasValidPic ? 'cursor-pointer hover:border-[#F58220]' : ''
                        }`}
                        title={hasValidPic ? 'Click to inspect full photo' : 'No valid photo preview'}
                      >
                        {hasValidPic ? (
                          <>
                            <img 
                              src={picSrc} 
                              alt={p.name} 
                              onError={() => handleImageError(p.id)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black">
                              Zoom 🔍
                            </div>
                          </>
                        ) : (
                          <span className="text-amber-950 font-black text-xl">
                            {p.name ? p.name.substring(0, 2).toUpperCase() : 'GS'}
                          </span>
                        )}
                      </div>

                      {/* Upload / Edit Profile Buttons */}
                      <div className="flex items-center gap-1">
                        <label 
                          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-extrabold rounded-lg cursor-pointer transition-colors flex items-center gap-1 border border-amber-300"
                          title="Upload photo from device"
                        >
                          <Camera className="w-3 h-3 text-[#F58220]" />
                          <span>Upload</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleProfileFileUpload(p, e)} 
                            className="hidden" 
                          />
                        </label>

                        <button
                          onClick={() => {
                            setEditingProfileUser(p);
                            setProfileInputUrl(p.avatarUrl || p.profilePicUrl || '');
                          }}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 border border-gray-300"
                          title="Paste photo URL"
                        >
                          <Edit3 className="w-3 h-3 text-gray-600" />
                          <span>URL</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif font-bold text-xl text-[#2A180B]">{p.name}</h3>
                        
                        {isVerified && (
                          <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            VERIFIED PARTNER
                          </span>
                        )}

                        {isPending && (
                          <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            PENDING ADMIN APPROVAL
                          </span>
                        )}

                        {isSuspended && (
                          <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-red-100 text-red-900 border border-red-300 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            REJECTED / SUSPENDED
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 font-medium">
                        Role: <strong className="text-gray-900 font-bold">{p.customRole || p.role}</strong> • Applied: {new Date(p.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                        <span className="flex items-center gap-1 font-bold text-gray-800">
                          <Phone className="w-3.5 h-3.5 text-[#F58220]" /> {p.phone}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" /> {p.email}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-gray-600">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {p.city || 'Gaya Ji'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                    ID: {p.id}
                  </span>
                </div>

                {/* Details & Verification Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#F8F6EF] p-4 sm:p-5 rounded-2xl border border-gray-200">
                  
                  {/* Document Column */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="font-bold text-[#4A2E1A] flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#F58220]" /> Verification Document (Govt ID / Aadhaar / PAN)
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {/* Direct File Upload Button for Document */}
                        <label className="text-[10px] font-extrabold bg-[#F58220] hover:bg-[#E07210] text-white px-2.5 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-xs">
                          <Upload className="w-3 h-3" />
                          <span>Upload File</span>
                          <input 
                            type="file" 
                            accept="image/*,.pdf" 
                            onChange={(e) => handleDocFileUpload(p, e)} 
                            className="hidden" 
                          />
                        </label>

                        <button
                          onClick={() => {
                            setEditingDocUser(p);
                            setDocInputUrl(p.documentUrl || '');
                          }}
                          className="text-[10px] font-extrabold text-gray-700 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-lg transition-colors"
                        >
                          {p.documentUrl ? 'Edit URL' : '+ Add URL'}
                        </button>
                      </div>
                    </div>

                    {p.documentUrl ? (
                      <div className="bg-white p-3 rounded-xl border border-gray-300 space-y-2">
                        {/* Inline Image Preview if document is an image URL or dataURL */}
                        {p.documentUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) || p.documentUrl.startsWith('data:image/') || p.documentUrl.startsWith('http') ? (
                          <div 
                            onClick={() => {
                              setPreviewModalUrl(p.documentUrl!);
                              setPreviewTitle(`${p.name} — Govt ID Document`);
                            }}
                            className="relative h-32 w-full bg-slate-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group flex items-center justify-center"
                          >
                            <img 
                              src={p.documentUrl} 
                              alt="Govt ID Document" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                              🔍 Click to Zoom Document
                            </div>
                          </div>
                        ) : null}

                        <div className="flex items-center justify-between gap-2 text-xs">
                          <a 
                            href={p.documentUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 font-extrabold rounded-xl border border-emerald-300 hover:bg-emerald-100 transition-colors truncate"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">Open Full Document</span>
                            <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0" />
                          </a>

                          <button
                            onClick={() => {
                              setPreviewModalUrl(p.documentUrl!);
                              setPreviewTitle(`${p.name} — Govt ID Document`);
                            }}
                            className="px-3 py-1.5 bg-[#1C0D02] text-[#F6C343] font-bold rounded-xl text-xs hover:bg-[#3D2310]"
                          >
                            Preview Modal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-2">
                        <p className="font-bold flex items-center gap-1 text-amber-900">
                          <AlertCircle className="w-4 h-4 text-amber-600" /> Govt Document Not Attached
                        </p>
                        <p className="text-[11px] text-amber-800">
                          Click &apos;Upload File&apos; above to attach document image/PDF, or click &apos;+ Add URL&apos;.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Location Column */}
                  <div className="space-y-2">
                    <p className="font-bold text-[#4A2E1A] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Shop / Office Location
                    </p>
                    {p.googleMapsUrl ? (
                      <div className="bg-white p-3 rounded-xl border border-gray-300 space-y-2">
                        <a 
                          href={p.googleMapsUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-900 font-extrabold rounded-xl border border-blue-300 hover:bg-blue-100 transition-colors text-xs"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>Google Maps Share Link</span>
                          <ExternalLink className="w-3 h-3 text-blue-600" />
                        </a>
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-gray-600 text-xs">
                        <p className="font-medium">
                          {p.lat && p.lng ? `GPS Coordinates: ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}` : 'Standard Gaya Ji Location'}
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Admin Verification Actions Bar */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => handleAction(p.id, p.name, 'VERIFIED')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                      isVerified
                        ? 'bg-emerald-700 text-white cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" /> 
                    <span>{isVerified ? '✓ Already Approved & Verified' : '🟢 Verify & Approve Badge'}</span>
                  </button>

                  <button
                    onClick={() => handleAction(p.id, p.name, 'REJECTED')}
                    className="py-3 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> 
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleAction(p.id, p.name, 'SUSPENDED')}
                    className="py-3 px-5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <PauseCircle className="w-4 h-4" /> 
                    <span>Suspend</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL-SCREEN IMAGE / DOCUMENT PREVIEW MODAL */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <span className="font-bold text-sm text-white">{previewTitle || 'Document & Image Preview'}</span>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-slate-950 flex items-center justify-center min-h-[350px]">
              <img
                src={previewModalUrl}
                alt="Full Preview"
                className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
                onError={() => alert('Failed to load image preview. The link may be broken or restricted.')}
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
              <a
                href={previewModalUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#F58220] hover:bg-[#d96d13] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" /> Open Original Image in New Tab
              </a>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE PHOTO URL MODAL */}
      {editingProfileUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-[#4A2E1A]">Update Profile Photo for {editingProfileUser.name}</h3>
              <button onClick={() => setEditingProfileUser(null)}>
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileUrl} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Profile Photo Image URL</label>
                <input
                  type="url"
                  required
                  value={profileInputUrl}
                  onChange={(e) => setProfileInputUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F58220] font-medium"
                />
              </div>

              {profileInputUrl && (
                <div className="p-2 bg-gray-100 rounded-xl flex items-center gap-3">
                  <img 
                    src={profileInputUrl} 
                    alt="Preview" 
                    className="w-12 h-12 rounded-lg object-cover border border-gray-300"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <span className="text-[11px] text-gray-600 font-medium">Image preview from link</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProfileUser(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F58220] hover:bg-[#E07210] text-white font-bold rounded-xl shadow-md"
                >
                  Save Photo URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DOCUMENT URL MODAL */}
      {editingDocUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-[#4A2E1A]">Update Govt ID Document for {editingDocUser.name}</h3>
              <button onClick={() => setEditingDocUser(null)}>
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveDocumentUrl} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Uploaded Document URL / Link</label>
                <input
                  type="text"
                  required
                  value={docInputUrl}
                  onChange={(e) => setDocInputUrl(e.target.value)}
                  placeholder="https://... or image link"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F58220] font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingDocUser(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F58220] hover:bg-[#E07210] text-white font-bold rounded-xl shadow-md"
                >
                  Save Document URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
