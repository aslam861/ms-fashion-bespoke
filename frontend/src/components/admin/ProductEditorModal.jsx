import React, { useState, useRef } from 'react';
import {
  X, Upload, Link2, Plus, Trash2, Crosshair, Check, Sparkles, AlertCircle, Image as ImageIcon, RotateCcw
} from 'lucide-react';
import { api } from '../../services/api';

const CATEGORIES = ['Sherwani', 'Jodhpuri', 'Indo-Western', 'Blazer'];

const SUB_CATEGORIES = {
  Sherwani: ['Royal Bridal Sherwani', 'Heritage Velvet Sherwani', 'Brocade Classic', 'Silk Embroidered'],
  Jodhpuri: ['Classic Bandhgala', 'Velvet Embroidered Bandhgala', 'Textured Silk Bandhgala', 'Modern Tailored Jodhpuri'],
  'Indo-Western': ['Asymmetrical Drape', 'Achkan Silhouette', 'Open-Front Fusion', 'Modern Layered Ensemble'],
  Blazer: ['Single-Breasted', 'Double-Breasted', 'Shawl Lapel', 'Tuxedo Evening Wear']
};

export default function ProductEditorModal({
  isOpen,
  onClose,
  product = null,
  onSaved = () => {}
}) {
  const isEditing = Boolean(product && product.id);

  // Form states
  const [title, setTitle] = useState(product?.title || '');
  const [category, setCategory] = useState(product?.category || 'Sherwani');
  const [subCategory, setSubCategory] = useState(product?.subCategory || 'Royal Bridal Sherwani');
  const [basePrice, setBasePrice] = useState(product?.basePrice || 15000);
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [description, setDescription] = useState(product?.description || '');
  const [fabric, setFabric] = useState(product?.fabric || 'Pure Handloom Raw Silk & Velvet');
  const [embroidery, setEmbroidery] = useState(product?.embroidery || 'Handcrafted Zardozi, Dabka & Resham');
  const [fit, setFit] = useState(product?.fit || 'Bespoke Regal Tailored Fit');
  const [leadTime, setLeadTime] = useState(product?.leadTime || '15 - 20 Working Days');

  // Image states
  const [imageUploadType, setImageUploadType] = useState('laptop'); // 'laptop' | 'url'
  const [realImageUrl, setRealImageUrl] = useState(product?.realImageUrl || '');
  const [imageFileName, setImageFileName] = useState(product?.imageFileName || '');
  const [webUrlInput, setWebUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Accessories array state
  const [accessories, setAccessories] = useState(
    product?.accessories && product.accessories.length > 0
      ? product.accessories.map(a => ({ ...a }))
      : [
          { name: 'Royal Mojdi', key: 'mojdi', price: 1400, description: 'Coordinating handcrafted footwear', zoomOrigin: { x: 58, y: 92, scale: 2.2 } },
          { name: 'Chanderi Safa', key: 'safa', price: 2000, description: 'Hand-tied royal turban', zoomOrigin: { x: 55, y: 8, scale: 2.3 } },
          { name: 'Kundan & Pearl Mala', key: 'mala', price: 700, description: 'Layered royal necklace', zoomOrigin: { x: 54, y: 28, scale: 2.2 } },
          { name: 'Antique Kalgi Brooch', key: 'brooch', price: 400, description: 'Antique gold plated brooch', zoomOrigin: { x: 58, y: 31, scale: 2.6 } },
          { name: 'Embroidered Dupatta', key: 'dupatta', price: 2000, description: 'Embroidered drape stole', zoomOrigin: { x: 38, y: 48, scale: 2.1 } }
        ]
  );

  // Active accessory selected for zoom calibration
  const [calibratingIndex, setCalibratingIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const fileInputRef = useRef(null);
  const photoPreviewRef = useRef(null);

  if (!isOpen) return null;

  // Handle category change & reset default subcategory
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const subList = SUB_CATEGORIES[newCat] || [];
    setSubCategory(subList[0] || newCat);
  };

  // ==================== 1. LAPTOP FILE UPLOAD ====================
  const handleLaptopFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError('');

    try {
      const res = await api.uploadLaptopImage(file, category, product?.id || 'garment');
      if (res.success && res.imageUrl) {
        setRealImageUrl(res.imageUrl);
        setImageFileName(res.fileName);
      } else {
        setUploadError(res.message || 'Upload failed');
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload photo from laptop');
    }
    setUploadingImage(false);
  };

  // ==================== 2. WEB URL UPLOAD ====================
  const handleWebUrlUpload = async () => {
    if (!webUrlInput || !webUrlInput.startsWith('http')) {
      setUploadError('Please enter a valid HTTP / HTTPS image URL.');
      return;
    }

    setUploadingImage(true);
    setUploadError('');

    try {
      const res = await api.uploadImageUrl(webUrlInput, category, product?.id || 'garment');
      if (res.success && res.imageUrl) {
        setRealImageUrl(res.imageUrl);
        setImageFileName(res.fileName || '');
        setWebUrlInput('');
      } else {
        setUploadError(res.message || 'Failed to process image URL');
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Failed to download web image');
    }
    setUploadingImage(false);
  };

  // ==================== 3. ACCESSORY MANAGER ====================
  const handleAddAccessory = () => {
    const newAcc = {
      name: 'New Custom Accessory',
      key: `acc_${Date.now()}`,
      price: 1000,
      description: 'Handcrafted custom embellishment',
      zoomOrigin: { x: 50, y: 50, scale: 2.2 }
    };
    setAccessories([...accessories, newAcc]);
    setCalibratingIndex(accessories.length);
  };

  const handleUpdateAccessory = (index, field, value) => {
    const updated = [...accessories];
    updated[index][field] = field === 'price' ? Number(value) || 0 : value;
    if (field === 'name') {
      updated[index].key = value.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    setAccessories(updated);
  };

  const handleRemoveAccessory = (index) => {
    const updated = accessories.filter((_, i) => i !== index);
    setAccessories(updated);
    if (calibratingIndex >= updated.length) {
      setCalibratingIndex(Math.max(0, updated.length - 1));
    }
  };

  // ==================== 4. VISUAL ZOOM COORDINATE CALIBRATOR ====================
  const handlePhotoClickToCalibrate = (e) => {
    if (!photoPreviewRef.current || accessories.length === 0) return;
    const rect = photoPreviewRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const updated = [...accessories];
    const currentAcc = updated[calibratingIndex];
    if (currentAcc) {
      currentAcc.zoomOrigin = {
        x: Math.min(Math.max(5, x), 95),
        y: Math.min(Math.max(5, y), 95),
        scale: currentAcc.zoomOrigin?.scale || 2.4
      };
      setAccessories(updated);
    }
  };

  const handleScaleChange = (scaleVal) => {
    const updated = [...accessories];
    const currentAcc = updated[calibratingIndex];
    if (currentAcc) {
      currentAcc.zoomOrigin = {
        ...(currentAcc.zoomOrigin || { x: 50, y: 50 }),
        scale: Number(scaleVal)
      };
      setAccessories(updated);
    }
  };

  // ==================== 5. SAVE PRODUCT ====================
  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !basePrice) {
      setGeneralError('Garment title and base price are required.');
      return;
    }

    setSaving(true);
    setGeneralError('');

    const payload = {
      title,
      category,
      subCategory,
      basePrice: Number(basePrice),
      tagline,
      description,
      fabric,
      embroidery,
      fit,
      leadTime,
      realImageUrl: realImageUrl || null,
      imageFileName: imageFileName || '',
      accessories
    };

    try {
      if (isEditing) {
        await api.updateProduct(product.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setSaving(false);
      onSaved();
      onClose();
    } catch (err) {
      setGeneralError(err.response?.data?.message || err.message || 'Failed to save garment');
      setSaving(false);
    }
  };

  const activeCalibratingAcc = accessories[calibratingIndex];

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#2B211D]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#FBF6EC] border border-[#A9812F] shadow-2xl rounded-none overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#5C1A21] text-[#FBF6EC] p-4 sm:p-5 flex items-center justify-between border-b border-[#A9812F]/40 shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#C5A869] font-medium block">
              M.S Fashion Atelier Catalog Editor
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FBF6EC]">
              {isEditing ? `Edit Garment: ${product.title}` : 'Add New Bespoke Garment'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#FBF6EC]/80 hover:text-[#FBF6EC] hover:bg-[#461319] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {generalError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="bg-[#F4ECE1] p-4 sm:p-5 border border-[#E5D9C5] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider pb-2 border-b border-[#E5D9C5]">
              1. Garment Specifications & Pricing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">Garment Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Maharaja Zardozi Velvet Sherwani"
                  className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-sm text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">Base Garment Price (₹) *</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="e.g. 11999"
                  className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-sm font-serif font-bold text-[#5C1A21] focus:outline-none focus:border-[#5C1A21]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-sm text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">Sub-Category / Silhouette</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-sm text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                >
                  {(SUB_CATEGORIES[category] || []).map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3E38] uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Deep Maroon Velvet with Antique Gold Zardozi & Resham"
                className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-sm text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-[#4A3E38] mb-1">Fabric Composition</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-2.5 py-1.5 text-xs text-[#2B211D]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#4A3E38] mb-1">Embroidery & Work</label>
                <input
                  type="text"
                  value={embroidery}
                  onChange={(e) => setEmbroidery(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-2.5 py-1.5 text-xs text-[#2B211D]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#4A3E38] mb-1">Bespoke Lead Time</label>
                <input
                  type="text"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-2.5 py-1.5 text-xs text-[#2B211D]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dual Photo Upload (Laptop + Web URL) */}
          <div className="bg-[#F4ECE1] p-4 sm:p-5 border border-[#E5D9C5] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5D9C5]">
              <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider">
                2. Garment Photograph (Dual Upload)
              </h3>
              <div className="flex items-center gap-1 bg-[#EAE2D5] p-1 border border-[#D5C8B5]">
                <button
                  type="button"
                  onClick={() => setImageUploadType('laptop')}
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    imageUploadType === 'laptop'
                      ? 'bg-[#5C1A21] text-[#FBF6EC]'
                      : 'text-[#5C1A21] hover:bg-[#D5C8B5]'
                  }`}
                >
                  📁 From Laptop Media
                </button>
                <button
                  type="button"
                  onClick={() => setImageUploadType('url')}
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    imageUploadType === 'url'
                      ? 'bg-[#5C1A21] text-[#FBF6EC]'
                      : 'text-[#5C1A21] hover:bg-[#D5C8B5]'
                  }`}
                >
                  🌐 From Web / Browser Link
                </button>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-red-600 font-medium">{uploadError}</p>
            )}

            {imageUploadType === 'laptop' ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#A9812F]/50 bg-[#FBF6EC] p-6 text-center space-y-3">
                <Upload className="w-8 h-8 text-[#A9812F]" />
                <div>
                  <p className="text-xs font-semibold text-[#5C1A21] uppercase tracking-wider">
                    Select Photograph from your Computer / Laptop
                  </p>
                  <p className="text-[11px] text-[#7A6E65]">
                    Supports JPG, PNG, WEBP high-resolution portrait photos (Aspect 2:3 recommended)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleLaptopFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-5 py-2 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer shadow-md"
                >
                  {uploadingImage ? 'Uploading Image...' : 'Browse Laptop Files'}
                </button>
              </div>
            ) : (
              <div className="bg-[#FBF6EC] p-4 border border-[#D5C8B5] space-y-2">
                <label className="block text-xs font-semibold text-[#4A3E38] uppercase">
                  Paste Online Image / Web Browser Link
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="w-4 h-4 text-[#A9812F] absolute left-3 top-3" />
                    <input
                      type="url"
                      value={webUrlInput}
                      onChange={(e) => setWebUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-... or any public link"
                      className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleWebUrlUpload}
                    disabled={uploadingImage}
                    className="px-4 py-2 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    {uploadingImage ? 'Fetching...' : 'Attach Web Photo'}
                  </button>
                </div>
              </div>
            )}

            {/* Current Active Photo Preview */}
            <div className="flex items-center justify-between p-3 bg-[#EAE2D5] border border-[#D5C8B5]">
              <div className="flex items-center gap-3">
                {realImageUrl ? (
                  <img
                    src={realImageUrl}
                    alt="Garment Preview"
                    className="w-12 h-16 object-contain bg-white border border-[#A9812F]/40 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-16 bg-[#D8CEBF] border border-[#B5A896] flex items-center justify-center text-[10px] text-[#5C1A21] font-mono">
                    No Photo
                  </div>
                )}
                <div>
                  <span className="text-xs font-bold text-[#5C1A21] block">
                    {realImageUrl ? 'Active Photo Attached' : 'Neutral Luxury Placeholder Box Active'}
                  </span>
                  <span className="text-[11px] text-[#7A6E65] font-mono break-all">
                    {realImageUrl || 'Awaiting high-resolution photograph'}
                  </span>
                </div>
              </div>

              {realImageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setRealImageUrl('');
                    setImageFileName('');
                  }}
                  className="text-xs text-red-700 hover:text-red-900 underline font-medium cursor-pointer"
                >
                  Remove & Use Placeholder
                </button>
              )}
            </div>
          </div>

          {/* Section 3: Customization Options & Accessories Editor */}
          <div className="bg-[#F4ECE1] p-4 sm:p-5 border border-[#E5D9C5] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5D9C5]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider">
                  3. Accessories & Customization Items
                </h3>
                <p className="text-[11px] text-[#7A6E65]">
                  Add, remove, rename, and set individual prices for accessories (Mojdi, Brooch, Dupatta, Safa, Mala, etc.)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddAccessory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A869]" />
                <span>Add Accessory</span>
              </button>
            </div>

            <div className="space-y-2">
              {accessories.map((acc, index) => (
                <div
                  key={acc.key || index}
                  className={`p-3 border transition-all flex flex-col sm:flex-row items-center gap-3 ${
                    calibratingIndex === index
                      ? 'bg-[#FBF6EC] border-[#A9812F] shadow-sm'
                      : 'bg-[#EAE2D5]/70 border-[#D5C8B5]'
                  }`}
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#4A3E38] uppercase">Name</label>
                      <input
                        type="text"
                        value={acc.name}
                        onChange={(e) => handleUpdateAccessory(index, 'name', e.target.value)}
                        placeholder="e.g. Royal Mojdi"
                        className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-2.5 py-1 text-xs text-[#2B211D] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#4A3E38] uppercase">Price (₹)</label>
                      <input
                        type="number"
                        value={acc.price}
                        onChange={(e) => handleUpdateAccessory(index, 'price', e.target.value)}
                        placeholder="1400"
                        className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-2.5 py-1 text-xs font-bold text-[#5C1A21]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#4A3E38] uppercase">Target Coordinates</label>
                      <div className="text-[11px] font-mono text-[#7A6E65] pt-1 flex items-center gap-2">
                        <span>X: {acc.zoomOrigin?.x || 50}%</span>
                        <span>Y: {acc.zoomOrigin?.y || 50}%</span>
                        <span>Scale: {acc.zoomOrigin?.scale || 2.2}x</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setCalibratingIndex(index)}
                      className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border transition-colors flex items-center gap-1 cursor-pointer ${
                        calibratingIndex === index
                          ? 'bg-[#5C1A21] text-[#FBF6EC] border-[#5C1A21]'
                          : 'bg-white text-[#5C1A21] border-[#D5C8B5] hover:bg-[#EAE2D5]'
                      }`}
                      title="Click to visually calibrate zoom target on photo"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Calibrate Zoom</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveAccessory(index)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete accessory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Visual Zoom Target Calibrator */}
          {realImageUrl && activeCalibratingAcc && (
            <div className="bg-[#F4ECE1] p-4 sm:p-5 border border-[#E5D9C5] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5D9C5]">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider">
                    4. Visual Zoom Coordinate Calibrator
                  </h3>
                  <p className="text-[11px] text-[#7A6E65]">
                    Calibrating: <strong className="text-[#5C1A21]">{activeCalibratingAcc.name}</strong> • Click anywhere on the photograph below to set the exact focus point!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[#4A3E38] uppercase">Zoom Scale:</label>
                  <input
                    type="range"
                    min="1.5"
                    max="3.5"
                    step="0.1"
                    value={activeCalibratingAcc.zoomOrigin?.scale || 2.4}
                    onChange={(e) => handleScaleChange(e.target.value)}
                    className="w-24 accent-[#5C1A21]"
                  />
                  <span className="text-xs font-mono font-bold text-[#5C1A21]">
                    {activeCalibratingAcc.zoomOrigin?.scale || 2.4}x
                  </span>
                </div>
              </div>

              {/* Photo Canvas with Interactive Crosshair Pin */}
              <div className="flex justify-center bg-[#2B211D]/10 p-4 border border-[#D5C8B5]">
                <div
                  ref={photoPreviewRef}
                  onClick={handlePhotoClickToCalibrate}
                  className="relative aspect-[2/3] max-h-[460px] cursor-crosshair overflow-hidden bg-white border-2 border-[#A9812F] shadow-lg select-none"
                >
                  <img
                    src={realImageUrl}
                    alt="Calibration Target"
                    className="w-full h-full object-contain pointer-events-none"
                  />

                  {/* Target Crosshair Marker */}
                  <div
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
                    style={{
                      left: `${activeCalibratingAcc.zoomOrigin?.x || 50}%`,
                      top: `${activeCalibratingAcc.zoomOrigin?.y || 50}%`
                    }}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-[#A9812F] shadow-gold-glow animate-ping opacity-75" />
                    <div className="w-5 h-5 rounded-full border-2 border-[#5C1A21] bg-[#FBF6EC] flex items-center justify-center shadow-md">
                      <Crosshair className="w-3 h-3 text-[#5C1A21]" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 bg-[#5C1A21] text-[#FBF6EC] text-[9px] font-bold uppercase tracking-wider rounded shadow">
                      {activeCalibratingAcc.name} ({activeCalibratingAcc.zoomOrigin?.x || 50}%, {activeCalibratingAcc.zoomOrigin?.y || 50}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Bottom Actions */}
          <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#D5C8B5] text-[#5C1A21] hover:bg-[#E5D9C5] text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-2.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg border border-[#A9812F]/40 cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#C5A869]" />
              <span>{saving ? 'Saving Garment...' : 'Save Garment & Customizations'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
