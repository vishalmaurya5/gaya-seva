'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  PhoneCall, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  Filter, 
  X, 
  Luggage, 
  Smartphone, 
  CreditCard, 
  UserCheck, 
  HeartHandshake,
  Sparkles,
  Phone,
  Lock
} from 'lucide-react';
import { LostFoundStore, LostFoundItem } from '@/lib/contentStore';
import { useLanguage } from '@/context/LanguageContext';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';
import { DirectoryGatedView } from '@/components/ui/DirectoryGatedView';

export default function LostAndFoundPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | 'LOST' | 'FOUND' | 'PERSON' | 'REUNITED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State for reporting lost/found
  const [formType, setFormType] = useState<'LOST' | 'FOUND'>('LOST');
  const [formCategory, setFormCategory] = useState<'PERSON' | 'DOCUMENT' | 'VALUABLES' | 'ELECTRONICS' | 'LUGGAGE' | 'OTHER'>('PERSON');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formReporterName, setFormReporterName] = useState('');
  const [formReporterPhone, setFormReporterPhone] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  const loadItems = () => {
    setItems(LostFoundStore.getItems());
  };

  useEffect(() => {
    loadItems();
    window.addEventListener('storage', loadItems);
    return () => window.removeEventListener('storage', loadItems);
  }, []);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formLocation.trim() || !formReporterName.trim() || !formReporterPhone.trim()) {
      alert(isHindi ? 'कृपया सभी आवश्यक फ़ील्ड भरें!' : 'Please fill out all required fields!');
      return;
    }

    const newItem = await LostFoundStore.addItem({
      type: formType,
      category: formCategory,
      title: formTitle.trim(),
      description: formDescription.trim(),
      location: formLocation.trim(),
      date: formDate,
      reporterName: formReporterName.trim(),
      reporterPhone: formReporterPhone.trim(),
      imageUrl: formImageUrl.trim() || undefined,
      status: 'VERIFIED',
    });

    loadItems();
    setIsModalOpen(false);

    // Reset Form
    setFormTitle('');
    setFormDescription('');
    setFormLocation('');
    setFormReporterName('');
    setFormReporterPhone('');
    setFormImageUrl('');

    setSuccessMessage(
      isHindi 
        ? `✅ आपकी रिपोर्ट (ID: ${newItem.id}) सफलतापूर्वक दर्ज हो गई है! गयासेवा कंट्रोल रूम टीम जल्द ही सत्यापन करेगी।` 
        : `✅ Your report (ID: ${newItem.id}) has been successfully submitted to GayaSeva Helpline Desk!`
    );

    setTimeout(() => setSuccessMessage(null), 7000);
  };

  const handleMarkReunited = async (id: string, currentTitle: string) => {
    if (confirm(isHindi ? `क्या यह मामला ("${currentTitle}") सुलझ गया है / व्यक्ति-सामान मिल गया है?` : `Mark this report ("${currentTitle}") as Reunited/Found?`)) {
      await LostFoundStore.updateItem(id, { status: 'REUNITED' });
      loadItems();
    }
  };

  // Filtered Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporterName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'ALL') return true;
    if (filterType === 'LOST') return item.type === 'LOST' && item.status !== 'REUNITED';
    if (filterType === 'FOUND') return item.type === 'FOUND' && item.status !== 'REUNITED';
    if (filterType === 'PERSON') return item.category === 'PERSON';
    if (filterType === 'REUNITED') return item.status === 'REUNITED';

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
    <div className="min-h-screen bg-[#FAF9F5] text-[#2D1A0E] pb-24 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1C0D02] via-[#2A180B] to-[#1C0D02] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#F58220]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F58220]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-4 relative z-10 text-center sm:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F58220]/20 text-[#F6C343] rounded-full text-xs font-bold border border-[#F58220]/40">
            <ShieldCheck className="w-4 h-4 text-[#F58220]" />
            <span>{isHindi ? '24/7 गया धाम तीर्थयात्री सहायता केंद्र' : '24/7 Gaya Ji Pilgrim Emergency Desk'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-white leading-tight">
            🔎 {isHindi ? 'खोया और पाया सेवा (Lost & Found Portal)' : 'Lost & Found Emergency Portal'}
          </h1>
          
          <p className="text-sm sm:text-base text-slate-200 max-w-3xl font-medium leading-relaxed">
            {isHindi 
              ? 'पिंडदान एवं तीर्थयात्रा के दौरान परिजनों के बिछड़ने, पर्स, आधार कार्ड, मोबाइल या सामान गुम होने पर तुरंत रिपोर्ट दर्ज करें एवं खोजें। गया पुलिस एवं स्वयंसेवक 24/7 तैनात हैं।' 
              : 'Report or search missing relatives, lost documents, wallets, mobile phones, or baggage during Gaya Ji pilgrimage & Pind Daan. Direct 24/7 coordination with local volunteer desks.'}
          </p>

          {/* Quick Counter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center sm:text-left">
              <p className="text-[11px] text-amber-200 font-bold">{isHindi ? 'कुल दर्ज मामले' : 'Total Registered'}</p>
              <p className="text-2xl font-black text-white">{totalReports}</p>
            </div>
            <div className="bg-red-500/20 backdrop-blur-md p-3 rounded-2xl border border-red-500/30 text-center sm:text-left">
              <p className="text-[11px] text-red-200 font-bold">{isHindi ? 'सक्रिय खोए मामले' : 'Active Lost Cases'}</p>
              <p className="text-2xl font-black text-red-400">{lostCount}</p>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/30 text-center sm:text-left">
              <p className="text-[11px] text-emerald-200 font-bold">{isHindi ? 'मिले सामान (Found)' : 'Found Items'}</p>
              <p className="text-2xl font-black text-emerald-400">{foundCount}</p>
            </div>
            <div className="bg-amber-500/20 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 text-center sm:text-left">
              <p className="text-[11px] text-amber-200 font-bold">{isHindi ? 'सुलझे/मिले मामले' : 'Reunited / Resolved'}</p>
              <p className="text-2xl font-black text-amber-300">{reunitedCount}</p>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm font-extrabold flex items-center justify-between shadow-sm animate-in fade-in">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 2. Emergency Call Hotline Box */}
        <div className="bg-gradient-to-r from-amber-500 via-[#F58220] to-orange-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-orange-400">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-sans font-black text-lg sm:text-xl flex items-center justify-center md:justify-start gap-2">
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <span>{isHindi ? 'आपातकालीन खोया-पाया हेल्पलाइन कॉल' : 'Emergency Lost & Found Phone Helpline'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 font-medium">
              {isHindi ? 'किसी बुजुर्ग या बच्चे के बिछड़ने पर बिना देरी किए तुरंत फोन करें:' : 'Immediate emergency helpline for missing elders, children or lost valuables:'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a 
              href="tel:+918544491413" 
              className="px-5 py-3 bg-white text-[#C45E00] hover:bg-orange-50 font-extrabold text-sm rounded-2xl shadow-md transition-transform active:scale-95 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#F58220]" />
              <span>+91 85444 91413</span>
            </a>
            <a 
              href="tel:112" 
              className="px-4 py-3 bg-red-950/80 hover:bg-red-900 text-white font-extrabold text-sm rounded-2xl shadow-md border border-red-500/40 transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>🚔 Gaya Police Dial 112</span>
            </a>
          </div>
        </div>

        {/* 3. Action Buttons & Search Control */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? 'खोजें (नाम, स्थान, वस्तु, आधार नंबर)...' : 'Search by name, location, card, wallet...'}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F58220]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Report Trigger Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => { setFormType('LOST'); setIsModalOpen(true); }}
                className="flex-1 sm:flex-initial px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isHindi ? '🚨 खोया दर्ज करें (Report Lost)' : '🚨 Report Lost Item'}</span>
              </button>

              <button 
                onClick={() => { setFormType('FOUND'); setIsModalOpen(true); }}
                className="flex-1 sm:flex-initial px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isHindi ? '💚 पाया दर्ज करें (Report Found)' : '💚 Report Found Item'}</span>
              </button>
            </div>

          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
            <span className="text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{isHindi ? 'फ़िल्टर:' : 'Filter:'}</span>
            </span>

            {[
              { id: 'ALL', label: isHindi ? 'सभी मामले (All)' : 'All Reports' },
              { id: 'LOST', label: isHindi ? '🔴 खोए हुए (Lost Active)' : 'Lost Items' },
              { id: 'FOUND', label: isHindi ? '🟢 मिले हुए (Found Active)' : 'Found Items' },
              { id: 'PERSON', label: isHindi ? '👤 लापता व्यक्ति (Missing Person)' : 'Missing Persons' },
              { id: 'REUNITED', label: isHindi ? '🤝 सुलझे मामले (Reunited)' : 'Reunited / Resolved' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  filterType === tab.id 
                    ? 'bg-[#2A180B] text-white shadow-xs font-extrabold' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* 4. Lost & Found Items Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-[#2A180B] flex items-center gap-2">
              <span>{isHindi ? 'नवीनतम खोया-पाया सूची' : 'Recent Lost & Found Reports'}</span>
              <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                {filteredItems.length}
              </span>
            </h2>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-slate-700 text-base">
                {isHindi ? 'कोई रिपोर्ट नहीं मिली' : 'No Lost & Found Reports Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                {isHindi 
                  ? 'आपके द्वारा चुने गए फ़िल्टर या खोज शब्द के लिए कोई डेटा नहीं मिला। कृपया ऊपर दिए गए बटन से नई रिपोर्ट दर्ज करें।'
                  : 'No entries match your search criteria. Please submit a report using the buttons above.'}
              </p>
            </div>
          ) : (
            <DirectoryGatedView categoryName="Lost & Found Help Desk" totalCount={filteredItems.length} maxPreviewCount={2}>
              {(visibleCount, hasAccess) => (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredItems.slice(0, visibleCount).map((item) => {
                    const isReunited = item.status === 'REUNITED';
                    const isLost = item.type === 'LOST';

                    return (
                      <div 
                        key={item.id} 
                        className={`bg-white rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 relative ${
                          isReunited 
                            ? 'border-amber-300 bg-amber-50/30 opacity-90' 
                            : isLost 
                            ? 'border-red-200 hover:border-red-400 shadow-xs hover:shadow-md' 
                            : 'border-emerald-200 hover:border-emerald-400 shadow-xs hover:shadow-md'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Top Badge Row */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                isLost 
                                  ? 'bg-red-100 text-red-700 border border-red-200' 
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}>
                                {isLost ? (isHindi ? '🔴 खोया (LOST)' : 'LOST') : (isHindi ? '🟢 पाया (FOUND)' : 'FOUND')}
                              </span>

                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {getCategoryIcon(item.category)}
                                <span>{item.category}</span>
                              </span>
                            </div>

                            {/* Status Tag */}
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              isReunited 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {isReunited ? (isHindi ? '🤝 सुलझ गया (Reunited)' : 'REUNITED') : (isHindi ? '✓ सत्यापित (Verified)' : 'VERIFIED')}
                            </span>
                          </div>

                          {/* Image Preview if provided - Masked/Blurred if not paid */}
                          {item.imageUrl && (
                            <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className={`w-full h-full object-cover transition-all ${
                                  !hasAccess ? 'blur-md select-none pointer-events-none opacity-60' : ''
                                }`}
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                              {!hasAccess && (
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center text-white space-y-1">
                                  <Lock className="w-6 h-6 text-amber-400" />
                                  <span className="text-[11px] font-black text-amber-200">
                                    {isHindi ? '🔒 दस्तावेज/चित्र लॉक' : '🔒 Document/Image Locked'}
                                  </span>
                                  <span className="text-[9px] text-slate-200">
                                    {isHindi ? 'एक्सेस पास से अनलॉक करें' : 'Unlock with Access Pass'}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Title */}
                          <h3 className="font-sans font-black text-base text-[#2A180B] leading-snug">
                            {item.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            {item.description}
                          </p>

                          {/* Meta Info - Address & Contact Protected */}
                          <div className="space-y-1 text-xs text-slate-500 font-semibold pt-1">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-[#F58220] shrink-0" />
                              <span className="truncate font-extrabold">
                                {hasAccess ? item.location : (isHindi ? '📍 ***** (स्थान व पता लॉक)' : '📍 Address & Location Locked')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{isHindi ? 'घटना तिथि:' : 'Date:'} {item.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>
                                {isHindi ? 'रिपोर्टर:' : 'Reporter:'} {hasAccess ? item.reporterName : '🔒 ***** (Locked)'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Bar - Phone & WhatsApp Protected */}
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {hasAccess ? (
                              <a 
                                href={`tel:${item.reporterPhone}`}
                                className="py-2.5 px-3 bg-[#2A180B] hover:bg-[#1C0D02] text-white text-center rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-[#F6C343]" />
                                <span>{isHindi ? 'कॉल करें' : 'Call'}</span>
                              </a>
                            ) : (
                              <button 
                                onClick={() => {
                                  const banner = document.getElementById('unlock-access-banner');
                                  if (banner) banner.scrollIntoView({ behavior: 'smooth' });
                                  const btn = document.getElementById('unlock-access-btn');
                                  if (btn) btn.click();
                                  else alert(isHindi ? 'फोन नंबर अनलॉक करने के लिए Access Pass चालू करें!' : 'Unlock GayaSeva Access Pass to call!');
                                }}
                                className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white text-center rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-100" />
                                <span>{isHindi ? '🔒 कॉल लॉक' : '🔒 Call Locked'}</span>
                              </button>
                            )}

                            {hasAccess ? (
                              <a 
                                href={`https://wa.me/${item.reporterPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`GayaSeva Lost & Found Inquiry regarding: ${item.title}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            ) : (
                              <button 
                                onClick={() => {
                                  const banner = document.getElementById('unlock-access-banner');
                                  if (banner) banner.scrollIntoView({ behavior: 'smooth' });
                                  const btn = document.getElementById('unlock-access-btn');
                                  if (btn) btn.click();
                                  else alert(isHindi ? 'व्हाट्सएप संपर्क अनलॉक करने के लिए Access Pass चालू करें!' : 'Unlock GayaSeva Access Pass to WhatsApp!');
                                }}
                                className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-center rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                              >
                                <Lock className="w-3.5 h-3.5 text-emerald-200" />
                                <span>{isHindi ? '🔒 WhatsApp' : '🔒 WhatsApp'}</span>
                              </button>
                            )}
                          </div>

                          {!isReunited && (
                            <button
                              onClick={() => handleMarkReunited(item.id, item.title)}
                              className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-[11px] font-extrabold transition-colors flex items-center justify-center gap-1 border border-amber-300 cursor-pointer"
                            >
                              <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                              <span>{isHindi ? 'सामान/व्यक्ति मिल गया? सुलझा घोषित करें' : 'Mark as Reunited / Found'}</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </DirectoryGatedView>
          )}
        </div>

      </div>

      {/* 5. Report Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-sans font-black text-lg text-[#2A180B] flex items-center gap-2">
                <span>{formType === 'LOST' ? (isHindi ? '🚨 खोया हुआ दर्ज करें' : '🚨 Report Lost Item / Person') : (isHindi ? '💚 पाया हुआ दर्ज करें' : '💚 Report Found Item')}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs font-bold text-slate-800">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFormType('LOST')}
                  className={`py-2 rounded-xl text-center transition-all cursor-pointer font-extrabold ${
                    formType === 'LOST' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🔴 {isHindi ? 'खोया हुआ (LOST)' : 'LOST'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('FOUND')}
                  className={`py-2 rounded-xl text-center transition-all cursor-pointer font-extrabold ${
                    formType === 'FOUND' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🟢 पाया हुआ (FOUND)
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block mb-1 text-slate-700 font-extrabold">{isHindi ? 'कैटेगरी चुनें:' : 'Category:'}</label>
                <select 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                >
                  <option value="PERSON">👤 {isHindi ? 'लापता व्यक्ति / रिश्तेदार (Missing Person)' : 'Missing Person / Relative'}</option>
                  <option value="DOCUMENT">💳 {isHindi ? 'वॉलेट / आधार कार्ड / दस्तावेज (Wallet & Documents)' : 'Wallet & ID Documents'}</option>
                  <option value="ELECTRONICS">📱 {isHindi ? 'मोबाइल / कैमरा / इलेक्ट्रॉनिक्स (Mobile & Electronics)' : 'Mobile Phone & Electronics'}</option>
                  <option value="LUGGAGE">🧳 {isHindi ? 'बैग / सूटकेस / सामान (Baggage & Luggage)' : 'Baggage & Luggage'}</option>
                  <option value="VALUABLES">✨ {isHindi ? 'गहने / कीमती वस्तु (Jewelry & Valuables)' : 'Jewelry & Valuables'}</option>
                  <option value="OTHER">📦 {isHindi ? 'अन्य सामान (Other Items)' : 'Other Items'}</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block mb-1 text-slate-700 font-extrabold">{isHindi ? 'शीर्षक (Title): *' : 'Report Title: *'}</label>
                <input 
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={isHindi ? 'उदा. काला पर्स व आधार कार्ड (रामकुमार)' : 'e.g. Black Purse with Aadhaar Card'}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
              </div>

              {/* Location in Gaya */}
              <div>
                <label className="block mb-1 text-slate-700 font-extrabold">{isHindi ? 'स्थान (Gaya Ji Location): *' : 'Location in Gaya Ji: *'}</label>
                <input 
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder={isHindi ? 'उदा. फल्गु घाट 3, विष्णुपद मंदिर द्वार 2' : 'e.g. Falgu Devghat 3 or Gaya Junction Platform 1'}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block mb-1 text-slate-700 font-extrabold">{isHindi ? 'घटना तिथि:' : 'Incident Date:'}</label>
                <input 
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-slate-700 font-extrabold">{isHindi ? 'विस्तृत विवरण (विशेष पहचान चिंन्ह):' : 'Detailed Description & Distinctive Marks:'}</label>
                <textarea 
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={isHindi ? 'पहने हुए कपड़े, रंग, बैग का मेक या पर्स में मौजूद आईडी विवरण लिखें...' : 'Mention clothes worn, wallet contents, phone color or bag details...'}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                />
              </div>

              {/* Reporter Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700 font-extrabold">{isHindi ? 'आपका नाम: *' : 'Reporter Name: *'}</label>
                  <input 
                    type="text"
                    required
                    value={formReporterName}
                    onChange={(e) => setFormReporterName(e.target.value)}
                    placeholder={isHindi ? 'आपका नाम' : 'Your Full Name'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700 font-extrabold">{isHindi ? 'संपर्क मोबाइल नंबर: *' : 'Contact Mobile: *'}</label>
                  <input 
                    type="tel"
                    required
                    value={formReporterPhone}
                    onChange={(e) => setFormReporterPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                  />
                </div>
              </div>

              {/* Photo Upload & URL Selection */}
              <ImageUploadInput
                value={formImageUrl}
                onChange={setFormImageUrl}
                isHindi={isHindi}
              />

              {/* Submit */}
              <div className="pt-3">
                <button
                  type="submit"
                  className={`w-full py-3.5 text-white font-black text-sm rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer ${
                    formType === 'LOST' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {formType === 'LOST' ? (isHindi ? '🚨 खोया हुआ दर्ज करें' : 'Submit Lost Report') : (isHindi ? '💚 पाया हुआ दर्ज करें' : 'Submit Found Report')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
