import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { compressImageToMax100KB } from '@/lib/imageUtils';

interface ImageUploadInputProps {
  value: string;
  onChange: (value: string) => void;
  isHindi?: boolean;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({ value, onChange, isHindi = false }) => {
  const [mode, setMode] = useState<'UPLOAD' | 'URL'>('UPLOAD');
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [sizeInfo, setSizeInfo] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSizeInfo('');
    setIsCompressing(true);

    try {
      const res = await compressImageToMax100KB(file);
      onChange(res.dataUrl);
      setSizeInfo(
        isHindi
          ? `✓ फोटो सफलतापूर्वक तैयार (${res.sizeKb} KB)`
          : `✓ Image ready & compressed (${res.sizeKb} KB)`
      );
    } catch (err: any) {
      setError(err?.message || (isHindi ? 'इमेज अपलोड में त्रुटि हुई। साइज 100KB से कम रखें।' : 'Failed to process image. Max allowed size is 100KB.'));
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
    setSizeInfo('');
  };

  return (
    <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="block text-slate-800 font-extrabold text-xs">
          {isHindi ? 'फोटो संलग्न करें (ऐच्छिक - Max 100KB / URL):' : 'Attach Photo (Optional - Max 100KB / URL):'}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3 h-3" /> {isHindi ? 'हटाएं' : 'Remove Photo'}
          </button>
        )}
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { setMode('UPLOAD'); setError(''); }}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
            mode === 'UPLOAD'
              ? 'bg-[#2A180B] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-[#F58220]" />
          <span>{isHindi ? '📁 फ़ाइल अपलोड (Max 100KB)' : '📁 File Upload (Max 100KB)'}</span>
        </button>

        <button
          type="button"
          onClick={() => { setMode('URL'); setError(''); }}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
            mode === 'URL'
              ? 'bg-[#2A180B] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>{isHindi ? '🔗 वेब इमेज URL' : '🔗 Web Image URL'}</span>
        </button>
      </div>

      {/* Mode 1: File Upload */}
      {mode === 'UPLOAD' ? (
        <div className="space-y-2 pt-1">
          <div className="relative border-2 border-dashed border-slate-300 hover:border-[#F58220] rounded-xl p-3 bg-white text-center transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <ImageIcon className="w-5 h-5 text-[#F58220]" />
              <span className="font-bold text-xs">
                {isHindi ? 'इमेज फाइल चुनें (JPG/PNG - Max 100KB)' : 'Choose Photo File (JPG, PNG, WEBP - Max 100KB)'}
              </span>
            </div>
          </div>

          {isCompressing && (
            <p className="text-[11px] font-bold text-amber-700 animate-pulse flex items-center gap-1">
              ⏳ {isHindi ? 'इमेज प्रोसेस एवं 100KB में कम्प्रेस हो रही है...' : 'Compressing image under 100KB...'}
            </p>
          )}

          {sizeInfo && (
            <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" /> {sizeInfo}
            </p>
          )}

          {error && (
            <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 inline" /> {error}
            </p>
          )}
        </div>
      ) : (
        /* Mode 2: Direct Image URL */
        <div className="space-y-1 pt-1">
          <input
            type="url"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setError('');
              setSizeInfo('');
            }}
            placeholder="https://images.unsplash.com/... or https://..."
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#F58220]"
          />
          <p className="text-[10px] text-slate-400 font-medium">
            {isHindi ? 'यहाँ वेब पर होस्ट की गई इमेज का सीधा URL दर्ज करें।' : 'Paste any valid public image link / URL.'}
          </p>
        </div>
      )}

      {/* Live Preview */}
      {value && (
        <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border shrink-0">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setError(isHindi ? 'इमेज लोड नहीं हो सकी, URL की जांच करें' : 'Invalid image URL or unable to load preview')}
            />
          </div>
          <div className="text-xs space-y-0.5 truncate flex-1">
            <p className="font-extrabold text-slate-800">
              {isHindi ? 'इमेज पूर्वावलोकन (Preview):' : 'Image Preview:'}
            </p>
            <p className="text-[10px] text-slate-500 truncate max-w-[220px] font-mono">
              {value.startsWith('data:') ? 'Attached Upload File (<100KB Data URL)' : value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
