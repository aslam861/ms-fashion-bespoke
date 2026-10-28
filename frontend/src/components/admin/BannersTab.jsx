import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Save, Plus, Trash2, Upload, Link2, Eye, ArrowRight,
  CheckCircle, AlertCircle, RefreshCw, Image as ImageIcon, MoveUp, MoveDown
} from 'lucide-react';
import { api } from '../../services/api';

const DEFAULT_BANNERS = [
  {
    id: 'banner-sherwani',
    title: 'The Sovereignty Of',
    highlight: 'Sherwani',
    description: 'Regal silhouettes, exquisite detailing and master craftsmanship. Each sherwani is individually tailored to create a distinguished look for your most memorable celebrations.',
    primaryText: 'Explore Sherwanis',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring',
    image: '/banners/sherwani-banner.png'
  },
  {
    id: 'banner-jodhpuri',
    title: 'The Power Of',
    highlight: 'Jodhpuri',
    description: 'Regal silhouettes, refined detailing and impeccable craftsmanship, tailored for unforgettable celebrations.',
    primaryText: 'Explore Jodhpuri',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring',
    image: '/banners/jodhpuri-banner.png'
  },
  {
    id: 'banner-indo',
    title: 'The Legacy Of',
    highlight: 'Indo-Western',
    description: 'A contemporary interpretation of Indian occasionwear, blending timeless craftsmanship with modern silhouettes.',
    primaryText: 'Explore Indo-Western',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring',
    image: '/banners/indo-banner.png'
  },
  {
    id: 'banner-blazer',
    title: 'The Royality Of',
    highlight: 'Formalwear',
    description: 'Sharp silhouettes, luxurious fabrics and precision tailoring designed for the modern gentleman.',
    primaryText: 'Explore Blazers',
    primaryLink: '/ethnic-wear',
    secondaryText: 'Bespoke Tailoring',
    secondaryLink: '/bespoke-tailoring',
    image: '/banners/blazer-banner.png'
  }
];

export default function BannersTab() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  // File upload refs
  const fileInputRefs = useRef({});

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await api.getBanners();
      if (Array.isArray(data) && data.length > 0) {
        setBanners(data);
      } else {
        setBanners(DEFAULT_BANNERS);
      }
    } catch (e) {
      setBanners(DEFAULT_BANNERS);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUpdateField = (index, field, value) => {
    const updated = [...banners];
    updated[index][field] = value;
    setBanners(updated);
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `banner-${Date.now()}`,
      title: 'The Royal Allure Of',
      highlight: 'Bespoke Couture',
      description: 'Handcrafted luxury occasionwear tailored to precision for royal weddings and celebrations.',
      primaryText: 'Explore Collection',
      primaryLink: '/ethnic-wear',
      secondaryText: 'Book Consultation',
      secondaryLink: '/bespoke-tailoring',
      image: '/banners/sherwani-banner.png'
    };
    setBanners([...banners, newSlide]);
    setActivePreviewIndex(banners.length);
  };

  const handleDeleteSlide = (index) => {
    if (banners.length <= 1) {
      alert('You must have at least one hero banner slide.');
      return;
    }
    const updated = banners.filter((_, i) => i !== index);
    setBanners(updated);
    if (activePreviewIndex >= updated.length) {
      setActivePreviewIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleMoveSlide = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= banners.length) return;
    const updated = [...banners];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setBanners(updated);
    setActivePreviewIndex(targetIdx);
  };

  const handleLaptopImageUpload = async (index, file) => {
    if (!file) return;
    try {
      const res = await api.uploadLaptopImage(file, 'Banners', `banner-${index}`);
      if (res.success && res.imageUrl) {
        handleUpdateField(index, 'image', res.imageUrl);
        setSuccessMsg(`Banner #${index + 1} image uploaded successfully.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg('Failed to upload banner photo.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.updateBanners(banners);
      if (res.success) {
        setSuccessMsg('Hero banners updated and published live on client homepage!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.message || 'Failed to save banners.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to save banners.');
    }
    setSaving(false);
  };

  const previewSlide = banners[activePreviewIndex] || banners[0] || DEFAULT_BANNERS[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F4ECE1] p-5 border border-[#E5D9C5] shadow-sm">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#A9812F] block">
            Homepage Visuals
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#5C1A21]">
            Hero & Promotional Banners Manager
          </h2>
          <p className="text-xs text-[#7A6E65] mt-0.5">
            Customize homepage carousel slides, headlines, descriptions, CTA buttons, and background imagery.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleAddSlide}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#EAE2D5] border border-[#D5C8B5] text-[#5C1A21] text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#A9812F]" />
            <span>+ Add Slide</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-bold uppercase tracking-widest rounded shadow-md border border-[#A9812F]/40 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#C5A869]" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Banners'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 rounded shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-900 text-xs font-semibold flex items-center gap-2 rounded shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Left Banners List (7 cols) + Right Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==================== LEFT COLUMN: SLIDES EDITOR (7 COLS) ==================== */}
        <div className="lg:col-span-7 space-y-4">
          {banners.map((slide, index) => {
            const isPreviewing = activePreviewIndex === index;

            return (
              <div
                key={slide.id || index}
                className={`bg-[#FBF6EC] border p-5 transition-all shadow-sm space-y-4 ${
                  isPreviewing
                    ? 'border-[#A9812F] ring-2 ring-[#A9812F]/20'
                    : 'border-[#E5D9C5]'
                }`}
              >
                {/* Header Bar for each slide */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5D9C5]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#5C1A21] text-[#FBF6EC] text-xs font-bold flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                    <span className="font-serif font-bold text-sm text-[#5C1A21]">
                      Slide #{index + 1}: {slide.highlight || 'Hero Banner'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-[#7A6E65] hover:text-[#5C1A21] disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(index, 1)}
                      disabled={index === banners.length - 1}
                      className="p-1 text-[#7A6E65] hover:text-[#5C1A21] disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePreviewIndex(index)}
                      className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded border transition-colors flex items-center gap-1 cursor-pointer ml-2 ${
                        isPreviewing
                          ? 'bg-[#5C1A21] text-[#FBF6EC] border-[#5C1A21]'
                          : 'bg-white text-[#5C1A21] border-[#D5C8B5] hover:bg-[#EAE2D5]'
                      }`}
                    >
                      <Eye className="w-3 h-3 text-[#C5A869]" />
                      <span>{isPreviewing ? 'Previewing' : 'Preview'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(index)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer ml-1"
                      title="Delete slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3E38] uppercase mb-1">
                        Pre-Headline *
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleUpdateField(index, 'title', e.target.value)}
                        placeholder="e.g. The Sovereignty Of"
                        className="w-full bg-white border border-[#D5C8B5] px-3 py-1.5 text-xs text-[#2B211D] font-medium focus:outline-none focus:border-[#5C1A21]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3E38] uppercase mb-1">
                        Highlight Word / Category *
                      </label>
                      <input
                        type="text"
                        value={slide.highlight}
                        onChange={(e) => handleUpdateField(index, 'highlight', e.target.value)}
                        placeholder="e.g. Sherwani"
                        className="w-full bg-white border border-[#D5C8B5] px-3 py-1.5 text-xs font-serif font-bold text-[#5C1A21] focus:outline-none focus:border-[#5C1A21]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3E38] uppercase mb-1">
                      Slide Description Paragraph
                    </label>
                    <textarea
                      rows={2}
                      value={slide.description}
                      onChange={(e) => handleUpdateField(index, 'description', e.target.value)}
                      placeholder="Enter captivating editorial copy for this collection..."
                      className="w-full bg-white border border-[#D5C8B5] px-3 py-1.5 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                    />
                  </div>

                  {/* Buttons Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#4A3E38] uppercase">
                        Primary CTA Button Text & Link
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={slide.primaryText}
                          onChange={(e) => handleUpdateField(index, 'primaryText', e.target.value)}
                          placeholder="Button Text"
                          className="w-full bg-white border border-[#D5C8B5] px-2 py-1 text-xs text-[#2B211D]"
                        />
                        <input
                          type="text"
                          value={slide.primaryLink}
                          onChange={(e) => handleUpdateField(index, 'primaryLink', e.target.value)}
                          placeholder="/ethnic-wear"
                          className="w-full bg-white border border-[#D5C8B5] px-2 py-1 text-xs font-mono text-[#5C1A21]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#4A3E38] uppercase">
                        Secondary CTA Button Text & Link
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={slide.secondaryText}
                          onChange={(e) => handleUpdateField(index, 'secondaryText', e.target.value)}
                          placeholder="Button Text"
                          className="w-full bg-white border border-[#D5C8B5] px-2 py-1 text-xs text-[#2B211D]"
                        />
                        <input
                          type="text"
                          value={slide.secondaryLink}
                          onChange={(e) => handleUpdateField(index, 'secondaryLink', e.target.value)}
                          placeholder="/bespoke-tailoring"
                          className="w-full bg-white border border-[#D5C8B5] px-2 py-1 text-xs font-mono text-[#5C1A21]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Attachment Row */}
                  <div className="pt-2 border-t border-[#E5D9C5] space-y-2">
                    <label className="block text-[10px] font-bold text-[#4A3E38] uppercase">
                      Banner Background Image (File or URL)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        value={slide.image}
                        onChange={(e) => handleUpdateField(index, 'image', e.target.value)}
                        placeholder="/banners/sherwani-banner.png or https://..."
                        className="w-full sm:flex-1 bg-white border border-[#D5C8B5] px-3 py-1.5 text-xs font-mono text-[#2B211D]"
                      />

                      <input
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLaptopImageUpload(index, e.target.files?.[0])}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[index]?.click()}
                        className="w-full sm:w-auto px-3 py-1.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================== RIGHT COLUMN: LIVE BANNER PREVIEW (5 COLS) ==================== */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5D9C5]">
              <span className="font-serif font-bold text-sm text-[#5C1A21] uppercase tracking-wider">
                Live Banner Preview
              </span>
              <span className="text-[10px] font-mono text-[#A9812F] font-semibold uppercase">
                Slide {activePreviewIndex + 1} of {banners.length}
              </span>
            </div>

            {/* Simulated Hero Slider Container */}
            <div className="relative aspect-[16/10] bg-[#1C080B] rounded overflow-hidden shadow-2xl border border-[#A9812F]/40 flex flex-col justify-end p-5 text-left">
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={previewSlide.image || '/banners/sherwani-banner.png'}
                  alt="Banner preview"
                  className="w-full h-full object-cover opacity-60"
                  onError={(e) => {
                    e.currentTarget.src = '/banners/sherwani-banner.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C080B] via-[#1C080B]/60 to-transparent" />
              </div>

              {/* Slide Content Overlay */}
              <div className="relative z-10 space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C5A869] font-bold block">
                  {previewSlide.title}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FBF6EC] leading-tight drop-shadow">
                  {previewSlide.highlight}
                </h3>
                <p className="text-[10px] text-[#E0D0BE] line-clamp-2 leading-relaxed">
                  {previewSlide.description}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <span className="px-3 py-1 bg-[#A9812F] text-[#1C080B] text-[9px] font-bold uppercase tracking-wider rounded shadow">
                    {previewSlide.primaryText || 'Explore'}
                  </span>
                  <span className="px-3 py-1 border border-[#FBF6EC]/50 text-[#FBF6EC] text-[9px] font-semibold uppercase tracking-wider rounded">
                    {previewSlide.secondaryText || 'Tailoring'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#7A6E65] text-center pt-1 italic">
              Changes reflect immediately on the client homepage once saved.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
