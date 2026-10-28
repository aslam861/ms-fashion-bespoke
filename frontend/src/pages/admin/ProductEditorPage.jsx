import React, { useState, useEffect, useRef } from 'react';
import {
  X, ArrowLeft, Save, Upload, Link2, Plus, Trash2, Crosshair, Check,
  AlertCircle, Image as ImageIcon, RotateCcw, Move, Sparkles, ZoomIn, ZoomOut,
  Crop, Scissors, Maximize2
} from 'lucide-react';
import { api } from '../../services/api';
import { useConfig } from '../../context/ConfigContext';

const CATEGORIES = ['Sherwani', 'Jodhpuri', 'Indo-Western', 'Blazer'];

const SUB_CATEGORIES = {
  Sherwani: ['Royal Bridal Sherwani', 'Heritage Velvet Sherwani', 'Brocade Classic', 'Silk Embroidered'],
  Jodhpuri: ['Jodhpuri-With-Jacket', 'Jodhpuri-Without-Jacket'],
  'Indo-Western': ['Indo-Western-With-Jacket', 'Indo-Western-Without-Jacket'],
  Blazer: ['Blazer-Single-Breasted', 'Blazer-Double-Breasted', 'Blazer-Shawl']
};

export const DEFAULT_CATEGORY_ACCESSORIES = {
  Sherwani: [
    { id: 'acc_mojdi', name: 'Royal Mojdi', key: 'mojdi', price: 1400, description: 'Matching velvet footwear with antique zardozi work', zoomOrigin: { x: 60, y: 94, scale: 2.3 } },
    { id: 'acc_safa', name: 'Chanderi Safa', key: 'safa', price: 2000, description: 'Hand-tied royal maroon & gold tissue Chanderi turban', zoomOrigin: { x: 55, y: 8, scale: 2.3 } },
    { id: 'acc_mala', name: 'Kundan & Pearl Mala', key: 'mala', price: 700, description: 'Layered pearl necklace with kundan centerpiece', zoomOrigin: { x: 54, y: 28, scale: 2.2 } },
    { id: 'acc_brooch', name: 'Antique Kalgi Brooch', key: 'brooch', price: 400, description: 'Vintage antique gold plated brooch with emerald droplet', zoomOrigin: { x: 58, y: 31, scale: 2.6 } },
    { id: 'acc_dupatta', name: 'Embroidered Dupatta', key: 'dupatta', price: 2000, description: 'Soft organza stole with scalloped zardozi border work', zoomOrigin: { x: 38, y: 48, scale: 2.1 } }
  ],
  Jodhpuri: [
    { id: 'acc_ps', name: 'Silk Pocket-Square', key: 'pocket-square', price: 1200, description: 'Ivory-gold hand-rolled border silk square', zoomOrigin: { x: 58, y: 31, scale: 2.6 } },
    { id: 'acc_brooch', name: 'Antique Chest Brooch', key: 'brooch', price: 2200, description: 'Royal eagle crest brooch with hanging curb chain', zoomOrigin: { x: 58, y: 31, scale: 2.6 } }
  ],
  'Indo-Western': [
    { id: 'acc_ps', name: 'Silk Pocket-Square', key: 'pocket-square', price: 1200, description: 'Asymmetric folded geometric satin square', zoomOrigin: { x: 58, y: 31, scale: 2.6 } },
    { id: 'acc_brooch', name: 'Antique Chest Brooch', key: 'brooch', price: 2200, description: 'Modern royal aesthetic lapel brooch with subtle chain', zoomOrigin: { x: 58, y: 31, scale: 2.6 } }
  ],
  Blazer: [
    { id: 'acc_ps', name: 'Silk Pocket-Square', key: 'pocket-square', price: 1400, description: 'Superfine Italian silk printed pocket square', zoomOrigin: { x: 58, y: 31, scale: 2.6 } },
    { id: 'acc_tux', name: 'Satin Tuxedo Accents', key: 'tuxedo-accents', price: 3500, description: 'Pure satin silk peak/shawl lapels with covered buttons', zoomOrigin: { x: 50, y: 35, scale: 2.2 } },
    { id: 'acc_brooch', name: 'Antique Lapel Brooch', key: 'brooch', price: 2200, description: 'Vintage evening pin brooch for black-tie affairs', zoomOrigin: { x: 58, y: 31, scale: 2.6 } },
    { id: 'acc_pant', name: 'Tailored Trousers / Pant', key: 'tailored-pant', price: 4500, description: 'Matching bespoke tailored trousers with satin side piping', zoomOrigin: { x: 50, y: 78, scale: 2.0 } }
  ]
};

export default function ProductEditorPage({
  product = null,
  onClose = () => {},
  onSaved = () => {}
}) {
  const { formatINR } = useConfig();
  const isEditing = Boolean(product && product.id);

  // Specifications
  const [title, setTitle] = useState(product?.title || '');
  const [category, setCategory] = useState(product?.category || 'Sherwani');
  const [subCategory, setSubCategory] = useState(product?.subCategory || 'Royal Bridal Sherwani');
  const [basePrice, setBasePrice] = useState(product?.basePrice ?? 15000);
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [description, setDescription] = useState(product?.description || '');
  const [fabric, setFabric] = useState(product?.fabric || 'Pure Handloom Raw Silk & Velvet');
  const [embroidery, setEmbroidery] = useState(product?.embroidery || 'Handcrafted Zardozi, Dabka & Resham');
  const [fit, setFit] = useState(product?.fit || 'Bespoke Regal Tailored Fit');
  const [leadTime, setLeadTime] = useState(product?.leadTime || '15 - 20 Working Days');

  // Sequential Reference ID state
  const [assignedRef, setAssignedRef] = useState(product?.id || '');
  const [assignedRefNum, setAssignedRefNum] = useState(product?.refNumber || null);

  useEffect(() => {
    if (isEditing && product?.id) {
      setAssignedRef(product.id);
      setAssignedRefNum(product.refNumber || null);
    } else {
      let active = true;
      api.getNextRef(category).then((res) => {
        if (active && res) {
          setAssignedRef(res.id);
          setAssignedRefNum(res.refNumber);
        }
      }).catch(() => {});
      return () => { active = false; };
    }
  }, [category, isEditing, product?.id]);

  // Photo state
  const initialImageUrl = product?.realImageUrl || (product?.imageFileName ? `/uploads/references/${product.category}/${product.imageFileName}` : '');
  const [realImageUrl, setRealImageUrl] = useState(initialImageUrl);
  const [originalImageUrl, setOriginalImageUrl] = useState(initialImageUrl);
  const [imageFileName, setImageFileName] = useState(product?.imageFileName || '');
  const [imageUploadType, setImageUploadType] = useState('laptop');
  const [webUrlInput, setWebUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Image Crop & 4-Border Trimmer state (Phone Gallery Style)
  const [calibratorMode, setCalibratorMode] = useState('focus'); // 'focus' | 'crop'
  const [trimTop, setTrimTop] = useState(0); // 0% to 40%
  const [trimBottom, setTrimBottom] = useState(0); // 0% to 40%
  const [trimLeft, setTrimLeft] = useState(0); // 0% to 40%
  const [trimRight, setTrimRight] = useState(0); // 0% to 40%
  const [isDraggingBorder, setIsDraggingBorder] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 1200, height: 1800 });
  const [cropApplying, setCropApplying] = useState(false);
  const [cropSuccessMsg, setCropSuccessMsg] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const cropContainerRef = useRef(null);
  const modalCropContainerRef = useRef(null);
  const cropDragRef = useRef(null);

  // Stable accessories list with unique IDs
  const [accessories, setAccessories] = useState(() => {
    if (product?.accessories && product.accessories.length > 0) {
      return product.accessories.map((a, idx) => ({
        id: a.id || `acc_${idx}_${Date.now()}`,
        name: a.name || '',
        key: a.key || `acc_${idx}`,
        price: Number(a.price) || 0,
        description: a.description || '',
        zoomOrigin: {
          x: Number(a.zoomOrigin?.x) || 50,
          y: Number(a.zoomOrigin?.y) || 50,
          scale: Number(a.zoomOrigin?.scale) || 2.4
        }
      }));
    }
    const cat = product?.category || 'Sherwani';
    const defaults = DEFAULT_CATEGORY_ACCESSORIES[cat] || DEFAULT_CATEGORY_ACCESSORIES.Sherwani;
    return defaults.map((a, idx) => ({
      id: `acc_def_${idx}_${Date.now()}`,
      ...a,
      zoomOrigin: { ...a.zoomOrigin }
    }));
  });

  const [calibratingIndex, setCalibratingIndex] = useState(0);
  const [previewZoomActive, setPreviewZoomActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const fileInputRef = useRef(null);
  const photoCanvasRef = useRef(null);

  // Category switch
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const subList = SUB_CATEGORIES[newCat] || [];
    setSubCategory(subList[0] || newCat);

    if (!isEditing || accessories.length === 0) {
      const defaults = DEFAULT_CATEGORY_ACCESSORIES[newCat] || [];
      setAccessories(defaults.map((a, idx) => ({
        id: `acc_cat_${idx}_${Date.now()}`,
        ...a,
        zoomOrigin: { ...a.zoomOrigin }
      })));
      setCalibratingIndex(0);
    }
  };

  // 1. Laptop file upload
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

  // 2. Web URL upload
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
      setUploadError(err.response?.data?.message || err.message || 'Failed to download web photo');
    }
    setUploadingImage(false);
  };

  // 3. Accessory manager
  const handleAddAccessory = () => {
    const newAcc = {
      id: `acc_custom_${Date.now()}`,
      name: 'New Custom Accessory',
      key: `custom_${Date.now()}`,
      price: 1000,
      description: 'Handcrafted custom bespoke accessory description',
      zoomOrigin: { x: 50, y: 50, scale: 2.4 }
    };
    setAccessories([...accessories, newAcc]);
    setCalibratingIndex(accessories.length);
  };

  const handleUpdateAccessoryField = (index, field, value) => {
    const updated = [...accessories];
    if (field === 'price') {
      updated[index].price = Number(value) || 0;
    } else {
      updated[index][field] = value;
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

  // 4. Coordinates controller
  const activeAcc = accessories[calibratingIndex] || null;

  const handleCoordinateChange = (axis, val) => {
    if (!activeAcc) return;
    const num = Math.min(Math.max(0, Number(val) || 0), 100);
    const updated = [...accessories];
    updated[calibratingIndex].zoomOrigin = {
      ...updated[calibratingIndex].zoomOrigin,
      [axis]: num
    };
    setAccessories(updated);
  };

  const handleScaleChange = (scaleVal) => {
    if (!activeAcc) return;
    const num = Math.min(Math.max(1.0, Number(scaleVal) || 2.4), 4.0);
    const updated = [...accessories];
    updated[calibratingIndex].zoomOrigin = {
      ...updated[calibratingIndex].zoomOrigin,
      scale: num
    };
    setAccessories(updated);
  };

  const handlePhotoClick = (e) => {
    if (calibratorMode !== 'focus') return;
    if (!photoCanvasRef.current || !activeAcc) return;
    const rect = photoCanvasRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const updated = [...accessories];
    updated[calibratingIndex].zoomOrigin = {
      ...updated[calibratingIndex].zoomOrigin,
      x: Math.min(Math.max(2, x), 98),
      y: Math.min(Math.max(2, y), 98)
    };
    setAccessories(updated);
  };

  // Crop & 4-Border Drag Handlers (Phone Gallery Style)
  const handleBorderDragStart = (e, handleType, isModal = false) => {
    e.preventDefault();
    e.stopPropagation();
    const container = isModal ? modalCropContainerRef.current : cropContainerRef.current;
    const rect = container?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    cropDragRef.current = {
      handle: handleType,
      startX: clientX,
      startY: clientY,
      initTop: trimTop,
      initBottom: trimBottom,
      initLeft: trimLeft,
      initRight: trimRight,
      rectW: rect.width,
      rectH: rect.height
    };
    setIsDraggingBorder(true);
  };

  useEffect(() => {
    if (!isDraggingBorder) return;

    const handlePointerMove = (e) => {
      if (!cropDragRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const { handle, startX, startY, initTop, initBottom, initLeft, initRight, rectW, rectH } = cropDragRef.current;
      const deltaX = ((clientX - startX) / rectW) * 100;
      const deltaY = ((clientY - startY) / rectH) * 100;

      const MIN_REMAINING = 15; // Minimum 15% width and height remaining

      if (handle === 'top') {
        const maxTop = 100 - initBottom - MIN_REMAINING;
        setTrimTop(Math.round(Math.min(Math.max(0, initTop + deltaY), maxTop)));
      } else if (handle === 'bottom') {
        const maxBottom = 100 - initTop - MIN_REMAINING;
        setTrimBottom(Math.round(Math.min(Math.max(0, initBottom - deltaY), maxBottom)));
      } else if (handle === 'left') {
        const maxLeft = 100 - initRight - MIN_REMAINING;
        setTrimLeft(Math.round(Math.min(Math.max(0, initLeft + deltaX), maxLeft)));
      } else if (handle === 'right') {
        const maxRight = 100 - initLeft - MIN_REMAINING;
        setTrimRight(Math.round(Math.min(Math.max(0, initRight - deltaX), maxRight)));
      } else if (handle === 'tl') {
        const maxTop = 100 - initBottom - MIN_REMAINING;
        const maxLeft = 100 - initRight - MIN_REMAINING;
        setTrimTop(Math.round(Math.min(Math.max(0, initTop + deltaY), maxTop)));
        setTrimLeft(Math.round(Math.min(Math.max(0, initLeft + deltaX), maxLeft)));
      } else if (handle === 'tr') {
        const maxTop = 100 - initBottom - MIN_REMAINING;
        const maxRight = 100 - initLeft - MIN_REMAINING;
        setTrimTop(Math.round(Math.min(Math.max(0, initTop + deltaY), maxTop)));
        setTrimRight(Math.round(Math.min(Math.max(0, initRight - deltaX), maxRight)));
      } else if (handle === 'bl') {
        const maxBottom = 100 - initTop - MIN_REMAINING;
        const maxLeft = 100 - initRight - MIN_REMAINING;
        setTrimBottom(Math.round(Math.min(Math.max(0, initBottom - deltaY), maxBottom)));
        setTrimLeft(Math.round(Math.min(Math.max(0, initLeft + deltaX), maxLeft)));
      } else if (handle === 'br') {
        const maxBottom = 100 - initTop - MIN_REMAINING;
        const maxRight = 100 - initLeft - MIN_REMAINING;
        setTrimBottom(Math.round(Math.min(Math.max(0, initBottom - deltaY), maxBottom)));
        setTrimRight(Math.round(Math.min(Math.max(0, initRight - deltaX), maxRight)));
      } else if (handle === 'move') {
        const boxW = 100 - initLeft - initRight;
        const boxH = 100 - initTop - initBottom;
        const maxLeft = 100 - boxW;
        const maxTop = 100 - boxH;

        const newLeft = Math.round(Math.min(Math.max(0, initLeft + deltaX), maxLeft));
        const newTop = Math.round(Math.min(Math.max(0, initTop + deltaY), maxTop));

        setTrimLeft(newLeft);
        setTrimRight(Math.round(100 - boxW - newLeft));
        setTrimTop(newTop);
        setTrimBottom(Math.round(100 - boxH - newTop));
      }
    };

    const handlePointerUp = () => {
      setIsDraggingBorder(false);
      cropDragRef.current = null;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDraggingBorder]);

  // Center horizontally by equalizing left and right margins
  const handleBalanceHorizontal = () => {
    const avg = Math.round((trimLeft + trimRight) / 2);
    setTrimLeft(avg);
    setTrimRight(avg);
  };

  // Center vertically by equalizing top and bottom margins
  const handleBalanceVertical = () => {
    const avg = Math.round((trimTop + trimBottom) / 2);
    setTrimTop(avg);
    setTrimBottom(avg);
  };

  // Reset all borders to full photo
  const handleResetCrop = () => {
    setTrimTop(0);
    setTrimBottom(0);
    setTrimLeft(0);
    setTrimRight(0);
  };

  // Trim all 4 sides evenly
  const handlePresetTrim = (percent) => {
    setTrimTop(percent);
    setTrimBottom(percent);
    setTrimLeft(percent);
    setTrimRight(percent);
  };

  // Auto-fit 2:3 boutique portrait ratio
  const handleSnapPortrait = () => {
    const w = imageDimensions.width || 1200;
    const h = imageDimensions.height || 1800;
    const currentAspect = w / h;
    const targetAspect = 2 / 3;

    if (currentAspect > targetAspect) {
      const desiredW = h * targetAspect;
      const diffPercent = ((w - desiredW) / w) * 100;
      const sideTrim = Math.round(diffPercent / 2);
      setTrimLeft(Math.max(0, sideTrim));
      setTrimRight(Math.max(0, sideTrim));
      setTrimTop(0);
      setTrimBottom(0);
    } else {
      const desiredH = w / targetAspect;
      const diffPercent = ((h - desiredH) / h) * 100;
      const vertTrim = Math.round(diffPercent / 2);
      setTrimTop(Math.max(0, vertTrim));
      setTrimBottom(Math.max(0, vertTrim));
      setTrimLeft(0);
      setTrimRight(0);
    }
  };

  // Crop & Upload to Server
  const applyCropAndSave = async () => {
    if (!realImageUrl) return;
    setCropApplying(true);
    setCropSuccessMsg('');

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Unable to load photo on canvas for cropping.'));
        img.src = realImageUrl;
      });

      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      const sx = Math.round((trimLeft / 100) * naturalW);
      const sy = Math.round((trimTop / 100) * naturalH);
      const sw = Math.round(((100 - trimLeft - trimRight) / 100) * naturalW);
      const sh = Math.round(((100 - trimTop - trimBottom) / 100) * naturalH);

      const cropW = Math.max(20, Math.min(sw, naturalW - sx));
      const cropH = Math.max(20, Math.min(sh, naturalH - sy));

      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
      if (!blob) throw new Error('Canvas export failed');

      const croppedFile = new File([blob], `cropped-${Date.now()}.png`, { type: 'image/png' });

      const res = await api.uploadLaptopImage(croppedFile, category, product?.id || 'garment');
      if (res.success && res.imageUrl) {
        if (!originalImageUrl) {
          setOriginalImageUrl(realImageUrl);
        }
        setRealImageUrl(res.imageUrl);
        setImageFileName(res.fileName);
        setTrimTop(0);
        setTrimBottom(0);
        setTrimLeft(0);
        setTrimRight(0);
        setShowCropModal(false);
        setCropSuccessMsg('✓ Clean gallery cropped image saved successfully!');
        setTimeout(() => setCropSuccessMsg(''), 4500);
      } else {
        alert(res.message || 'Failed to upload cropped photo.');
      }
    } catch (err) {
      console.error('Crop Error:', err);
      alert('Failed to crop image: ' + (err.message || 'Unknown error'));
    }
    setCropApplying(false);
  };

  const handleRevertOriginal = () => {
    if (originalImageUrl) {
      setRealImageUrl(originalImageUrl);
      setTrimTop(0);
      setTrimBottom(0);
      setTrimLeft(0);
      setTrimRight(0);
      setCropSuccessMsg('Reverted to original uncropped photo.');
      setTimeout(() => setCropSuccessMsg(''), 3000);
    }
  };

  // 5. Save Product
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
      hasRealImage: Boolean(realImageUrl),
      accessories: accessories.map(a => ({
        name: a.name,
        key: a.key || a.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        price: Number(a.price) || 0,
        description: a.description || '',
        zoomOrigin: {
          x: Number(a.zoomOrigin?.x) || 50,
          y: Number(a.zoomOrigin?.y) || 50,
          scale: Number(a.zoomOrigin?.scale) || 2.4
        }
      }))
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

  const targetX = activeAcc?.zoomOrigin?.x ?? 50;
  const targetY = activeAcc?.zoomOrigin?.y ?? 50;
  const targetScale = activeAcc?.zoomOrigin?.scale ?? 2.4;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F7F3EB] text-[#2B211D] flex flex-col overflow-hidden animate-fadeIn">
      {/* ==================== TOP ACTION BAR ==================== */}
      <header className="bg-[#5C1A21] text-[#FBF6EC] border-b-2 border-[#A9812F] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="p-1.5 bg-[#461319] hover:bg-[#380e13] text-[#FBF6EC] rounded border border-[#A9812F]/40 transition-colors cursor-pointer"
            title="Return to Garments list"
          >
            <ArrowLeft className="w-5 h-5 text-[#C5A869]" />
          </button>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A869] block font-semibold">
              M.S Fashion Atelier Master Editor
            </span>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#FBF6EC] tracking-wide flex items-center gap-2">
              <span>{isEditing ? `Editing: ${product.title}` : 'Create New Bespoke Garment'}</span>
              {assignedRef && (
                <span className="text-xs px-2 py-0.5 bg-[#C5A869]/20 border border-[#C5A869]/50 font-mono text-[#FBF6EC] rounded font-normal">
                  Ref: {assignedRef}
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="px-4 py-2 border border-[#A9812F]/50 text-[#FBF6EC] hover:bg-[#461319] text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#A9812F] hover:bg-[#8F6B24] text-[#FBF6EC] text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 shadow-lg border border-[#FBF6EC]/30 cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish Garment'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="p-1.5 text-[#FBF6EC]/80 hover:text-[#FBF6EC] hover:bg-[#461319] rounded-full transition-colors cursor-pointer ml-1"
            title="Exit editor"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* ==================== 2x2 GRID WORKSPACE ==================== */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {generalError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* ==================== ROW 1: TOP LEFT (SECTION 1) + TOP RIGHT (SECTION 2) ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Section 1 (Top Left): Garment Specifications & Pricing */}
            <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-4 shadow-sm flex flex-col justify-between h-full">
              <div>
                <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider pb-2 border-b border-[#E5D9C5] mb-3">
                  1. Garment Specifications & Pricing
                </h3>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">Garment Title *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. The Royal Charcoal Bandhgala with Jacket"
                        className="w-full bg-white border border-[#D5C8B5] px-3 py-2 text-xs font-medium text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">Base Price (₹) *</label>
                      <input
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="42000"
                        className="w-full bg-white border border-[#D5C8B5] px-3 py-2 text-xs font-serif font-bold text-[#5C1A21] focus:outline-none focus:border-[#5C1A21]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full bg-white border border-[#D5C8B5] px-3 py-2 text-xs font-semibold text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">Sub-Category / Silhouette</label>
                      <select
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full bg-white border border-[#D5C8B5] px-3 py-2 text-xs font-semibold text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                      >
                        {(SUB_CATEGORIES[category] || []).map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Category-Wise Sequential Reference ID Display */}
                  <div className="flex items-center justify-between p-2.5 bg-[#FAF4EB] border border-[#D5C8B5] rounded text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#8F6B24] uppercase text-[10px] tracking-wider">
                        {isEditing ? 'Reference ID:' : 'Auto-Assigned Ref ID:'}
                      </span>
                      <span className="px-2 py-0.5 bg-[#5C1A21] text-[#FBF6EC] font-mono font-bold text-xs rounded tracking-wider shadow-sm">
                        {assignedRef || `${category.toLowerCase().replace(/[^a-z0-9]/g, '')}-...`}
                      </span>
                      {assignedRefNum && (
                        <span className="text-[11px] text-[#7A6E65] font-medium">
                          (Garment #{assignedRefNum} in {category})
                        </span>
                      )}
                    </div>
                    {!isEditing && (
                      <span className="text-[10px] text-[#8A796F] italic">
                        Sequence rule: Previous Ref + 1 per category
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3E38] uppercase mb-1">Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Sculpted Structured Bandhgala with Outer Layering Jacket"
                      className="w-full bg-white border border-[#D5C8B5] px-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                    />
                  </div>
                </div>
              </div>

              {/* Fabric Specs Row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E5D9C5] text-xs">
                <div>
                  <label className="block font-semibold text-[#4A3E38] text-[10px] uppercase mb-0.5">Fabric</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full bg-white border border-[#D5C8B5] px-2 py-1 text-[11px] text-[#2B211D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4A3E38] text-[10px] uppercase mb-0.5">Embroidery</label>
                  <input
                    type="text"
                    value={embroidery}
                    onChange={(e) => setEmbroidery(e.target.value)}
                    className="w-full bg-white border border-[#D5C8B5] px-2 py-1 text-[11px] text-[#2B211D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4A3E38] text-[10px] uppercase mb-0.5">Lead Time</label>
                  <input
                    type="text"
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    className="w-full bg-white border border-[#D5C8B5] px-2 py-1 text-[11px] text-[#2B211D]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 (Top Right): Garment Photograph (Dual Upload) */}
            <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-4 shadow-sm flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E5D9C5] mb-3">
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
                      📁 Laptop File
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
                      🌐 Web URL
                    </button>
                  </div>
                </div>

                {uploadError && (
                  <p className="text-xs text-red-600 font-semibold mb-2">{uploadError}</p>
                )}

                {imageUploadType === 'laptop' ? (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#A9812F]/60 bg-[#FBF6EC] p-5 text-center space-y-2.5">
                    <Upload className="w-7 h-7 text-[#A9812F]" />
                    <div>
                      <p className="text-xs font-semibold text-[#5C1A21] uppercase tracking-wider">
                        Upload Photo from your Laptop Storage
                      </p>
                      <p className="text-[11px] text-[#7A6E65]">
                        Supports portrait photographs (.jpg, .png, .webp)
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
                      className="px-5 py-2 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer shadow"
                    >
                      {uploadingImage ? 'Uploading...' : 'Browse Laptop Files'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#FBF6EC] p-4 border border-[#D5C8B5] space-y-2">
                    <label className="block text-xs font-semibold text-[#4A3E38] uppercase">
                      Paste Online Image / Web Browser Link
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link2 className="w-4 h-4 text-[#A9812F] absolute left-3 top-2.5" />
                        <input
                          type="url"
                          value={webUrlInput}
                          onChange={(e) => setWebUrlInput(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-white border border-[#D5C8B5] pl-9 pr-3 py-2 text-xs text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
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
              </div>

              {/* Photo Status Row */}
              <div className="flex items-center justify-between p-2.5 bg-[#EAE2D5] border border-[#D5C8B5]">
                <div className="flex items-center gap-3">
                  {realImageUrl ? (
                    <img
                      src={realImageUrl}
                      alt="Garment Preview"
                      className="w-10 h-12 object-contain bg-white border border-[#A9812F]"
                    />
                  ) : (
                    <div className="w-10 h-12 bg-[#D8CEBF] border border-[#B5A896] flex items-center justify-center text-[9px] text-[#5C1A21] font-mono text-center p-0.5">
                      No Photo
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-[#5C1A21] block">
                      {realImageUrl ? 'Real HD Photo Attached' : 'Neutral Luxury Placeholder Active'}
                    </span>
                    <span className="text-[10px] text-[#7A6E65] font-mono break-all line-clamp-1">
                      {realImageUrl || 'Awaiting photograph'}
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
          </div>

          {/* ==================== ROW 2: BOTTOM LEFT (SECTION 4) + BOTTOM RIGHT (SECTION 3) ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Section 4 (Bottom Left): Visual Zoom Calibrator & Crop Alignment */}
            <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-4 shadow-sm">
              <div className="space-y-2 pb-2.5 border-b border-[#E5D9C5]">
                {/* Top Row: Full-width Section Title & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider">
                      4. Visual Zoom Calibrator & Crop Alignment
                    </h3>
                  </div>

                  {realImageUrl && (
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <div className="flex items-center bg-[#EAE2D5] p-0.5 border border-[#D5C8B5] rounded shadow-xs">
                        <button
                          type="button"
                          onClick={() => setCalibratorMode('focus')}
                          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer rounded-sm ${
                            calibratorMode === 'focus'
                              ? 'bg-[#5C1A21] text-[#FBF6EC] shadow-sm'
                              : 'text-[#5C1A21] hover:bg-[#D5C8B5]'
                          }`}
                        >
                          🎯 Focus Zoom
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalibratorMode('crop')}
                          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer rounded-sm flex items-center gap-1 ${
                            calibratorMode === 'crop'
                              ? 'bg-[#5C1A21] text-[#FBF6EC] shadow-sm'
                              : 'text-[#5C1A21] hover:bg-[#D5C8B5]'
                          }`}
                        >
                          <Crop className="w-3.5 h-3.5 text-[#C5A869]" />
                          <span>Gallery Crop</span>
                          {(trimTop > 0 || trimBottom > 0 || trimLeft > 0 || trimRight > 0) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]" />
                          )}
                        </button>
                      </div>

                      {calibratorMode === 'focus' && (
                        <button
                          type="button"
                          onClick={() => setPreviewZoomActive(!previewZoomActive)}
                          className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            previewZoomActive
                              ? 'bg-[#5C1A21] text-[#FBF6EC] border-[#5C1A21]'
                              : 'bg-white text-[#5C1A21] border-[#D5C8B5] hover:bg-[#EAE2D5]'
                          }`}
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-[#C5A869]" />
                          <span>{previewZoomActive ? 'Reset Full View' : 'Test Zoom Focus'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Subtitle / Focus target info */}
                <div className="flex items-center justify-between text-[11px] text-[#7A6E65]">
                  <p>
                    {calibratorMode === 'focus'
                      ? (activeAcc ? (
                          <span>Focus Target: <strong className="text-[#5C1A21] font-semibold">{activeAcc.name}</strong></span>
                        ) : 'Select an accessory from the right panel to calibrate coordinates')
                      : 'Trim unwanted background margins & align garment to exact center of boutique frame'}
                  </p>
                </div>
              </div>

              {/* Large Photo Canvas */}
              <div className="flex flex-col items-center">
                {realImageUrl ? (
                  calibratorMode === 'focus' ? (
                    /* Focus Mode Canvas */
                    <div
                      ref={photoCanvasRef}
                      onClick={handlePhotoClick}
                      className="relative aspect-[2/3] w-full max-w-[340px] bg-[#EAE2D5] border-2 border-[#A9812F] shadow-lg overflow-hidden select-none cursor-crosshair"
                      title="Click anywhere on the photo to calibrate focus target coordinates"
                    >
                      <div
                        className="w-full h-full transition-transform duration-500 ease-out origin-center"
                        style={{
                          transformOrigin: `${targetX}% ${targetY}%`,
                          transform: previewZoomActive ? `scale(${targetScale})` : 'scale(1)'
                        }}
                      >
                        <img
                          src={realImageUrl}
                          alt="Garment Preview"
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      </div>

                      {/* Focus Mode Crosshair Pin */}
                      {activeAcc && !previewZoomActive && (
                        <div
                          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 transition-all duration-150"
                          style={{ left: `${targetX}%`, top: `${targetY}%` }}
                        >
                          <div className="w-8 h-8 rounded-full border-2 border-[#A9812F] shadow-gold-glow animate-ping opacity-75" />
                          <div className="w-5 h-5 rounded-full border-2 border-[#5C1A21] bg-[#FBF6EC] flex items-center justify-center shadow-md">
                            <Crosshair className="w-3 h-3 text-[#5C1A21]" />
                          </div>
                          <span className="mt-1 px-2 py-0.5 bg-[#5C1A21] text-[#FBF6EC] text-[9px] font-bold uppercase tracking-wider rounded shadow whitespace-nowrap">
                            {activeAcc.name} ({targetX}%, {targetY}%)
                          </span>
                        </div>
                      )}

                      {!previewZoomActive && (
                        <div className="absolute bottom-2 inset-x-2 bg-[#2B211D]/80 backdrop-blur-sm text-[#FBF6EC] text-[10px] text-center py-1 rounded pointer-events-none z-30">
                          🎯 Click anywhere on photo to set coordinates
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Phone Gallery Style 4-Border Crop Studio */
                    <div className="flex flex-col items-center w-full">
                      <div
                        ref={cropContainerRef}
                        className="relative inline-block max-w-[340px] max-h-[500px] bg-[#1a1412] border-2 border-[#A9812F] shadow-xl overflow-hidden select-none"
                      >
                        <img
                          src={realImageUrl}
                          alt="Garment Preview"
                          className="max-w-[340px] max-h-[500px] w-auto h-auto block select-none pointer-events-none"
                          onLoad={(e) => setImageDimensions({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
                        />

                        {/* 4 Dimmed Masks (Trims outside crop box - phone gallery style) */}
                        <div
                          className="absolute left-0 right-0 top-0 bg-black/65 pointer-events-none"
                          style={{ height: `${trimTop}%` }}
                        />
                        <div
                          className="absolute left-0 right-0 bottom-0 bg-black/65 pointer-events-none"
                          style={{ height: `${trimBottom}%` }}
                        />
                        <div
                          className="absolute left-0 bg-black/65 pointer-events-none"
                          style={{
                            top: `${trimTop}%`,
                            bottom: `${trimBottom}%`,
                            width: `${trimLeft}%`
                          }}
                        />
                        <div
                          className="absolute right-0 bg-black/65 pointer-events-none"
                          style={{
                            top: `${trimTop}%`,
                            bottom: `${trimBottom}%`,
                            width: `${trimRight}%`
                          }}
                        />

                        {/* Active Crop Box (The clear window with handles) */}
                        <div
                          className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(169,129,47,0.9),0_4px_16px_rgba(0,0,0,0.6)] cursor-move select-none"
                          style={{
                            left: `${trimLeft}%`,
                            top: `${trimTop}%`,
                            right: `${trimRight}%`,
                            bottom: `${trimBottom}%`
                          }}
                          onMouseDown={(e) => handleBorderDragStart(e, 'move', false)}
                          onTouchStart={(e) => handleBorderDragStart(e, 'move', false)}
                          title="Drag inside to center garment • Drag borders/corners to trim"
                        >
                          {/* 3x3 Rule-of-Thirds Grid */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/40 border-dashed" />
                            <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/40 border-dashed" />
                            <div className="absolute top-1/3 left-0 right-0 border-t border-white/40 border-dashed" />
                            <div className="absolute top-2/3 left-0 right-0 border-t border-white/40 border-dashed" />
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/80 bg-[#5C1A21]/80 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-[#C5A869] rounded-full" />
                            </div>
                          </div>

                          {/* 4 Corner Handles (Classic Gallery L-Brackets) */}
                          <div
                            className="absolute -top-1.5 -left-1.5 w-6 h-6 cursor-nwse-resize z-30"
                            onMouseDown={(e) => handleBorderDragStart(e, 'tl', false)}
                            onTouchStart={(e) => handleBorderDragStart(e, 'tl', false)}
                            title="Drag to trim Top and Left"
                          >
                            <div className="w-3.5 h-3.5 border-t-3 border-l-3 border-[#C5A869] bg-white shadow-md" />
                          </div>
                          <div
                            className="absolute -top-1.5 -right-1.5 w-6 h-6 cursor-nesw-resize z-30 flex justify-end"
                            onMouseDown={(e) => handleBorderDragStart(e, 'tr', false)}
                            onTouchStart={(e) => handleBorderDragStart(e, 'tr', false)}
                            title="Drag to trim Top and Right"
                          >
                            <div className="w-3.5 h-3.5 border-t-3 border-r-3 border-[#C5A869] bg-white shadow-md" />
                          </div>
                          <div
                            className="absolute -bottom-1.5 -left-1.5 w-6 h-6 cursor-nesw-resize z-30 flex items-end"
                            onMouseDown={(e) => handleBorderDragStart(e, 'bl', false)}
                            onTouchStart={(e) => handleBorderDragStart(e, 'bl', false)}
                            title="Drag to trim Bottom and Left"
                          >
                            <div className="w-3.5 h-3.5 border-b-3 border-l-3 border-[#C5A869] bg-white shadow-md" />
                          </div>
                          <div
                            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 cursor-nwse-resize z-30 flex items-end justify-end"
                            onMouseDown={(e) => handleBorderDragStart(e, 'br', false)}
                            onTouchStart={(e) => handleBorderDragStart(e, 'br', false)}
                            title="Drag to trim Bottom and Right"
                          >
                            <div className="w-3.5 h-3.5 border-b-3 border-r-3 border-[#C5A869] bg-white shadow-md" />
                          </div>

                          {/* 4 Edge Handles (Phone Gallery Border Bars) */}
                          <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 cursor-ns-resize z-20 flex items-center justify-center"
                            onMouseDown={(e) => handleBorderDragStart(e, 'top', false)}
                            onTouchStart={(e) => handleBorderDragStart(e, 'top', false)}
                            title="Drag down to trim Top margin"
                          >
                            <div className="w-7 h-1.5 bg-[#C5A869] rounded shadow border border-white" />
                          </div>
                          <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-4 cursor-ns-resize z-20 flex items-center justify-center"
                            onMouseDown={(e) => handleBorderDragStart(e, 'bottom', false)}
                            onTouchStart={(e) => handleBorderDragStart(e, 'bottom', false)}
                            title="Drag up to trim Bottom margin"
                          >
                            <div className="w-7 h-1.5 bg-[#C5A869] rounded shadow border border-white" />
                          </div>
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-12 cursor-ew-resize z-20 flex items-center justify-center"
                            onMouseDown={(e) => handleBorderDragStart(e, 'left', false)}
                            onTouchStart={(e) => handleBorderDragStart(e, 'left', false)}
                            title="Drag right to trim Left margin"
                          >
                            <div className="h-7 w-1.5 bg-[#C5A869] rounded shadow border border-white" />
                          </div>
                          <div
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-12 cursor-ew-resize z-20 flex items-center justify-center"
                            onMouseDown={(e) => handleBorderDragStart(e, 'right', false)}
                            onTouchStart={(e) => handleBorderDragStart(e, 'right', false)}
                            title="Drag left to trim Right margin"
                          >
                            <div className="h-7 w-1.5 bg-[#C5A869] rounded shadow border border-white" />
                          </div>
                        </div>

                        {/* Hint Badge */}
                        <div className="absolute bottom-2 inset-x-2 bg-[#2B211D]/85 backdrop-blur-sm text-[#FBF6EC] text-[10px] text-center py-1 rounded pointer-events-none z-30 flex items-center justify-center gap-1.5">
                          <Crop className="w-3 h-3 text-[#C5A869]" />
                          <span>Gallery Crop: Drag borders/corners to trim • Drag inside to center</span>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="aspect-[2/3] w-full max-w-[340px] bg-[#E5E0D8] border-2 border-dashed border-[#A9812F]/60 flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <ImageIcon className="w-12 h-12 text-[#A9812F] opacity-40" />
                    <p className="text-xs font-serif font-bold uppercase text-[#5C1A21]">
                      Neutral Luxury Placeholder Box Active
                    </p>
                    <p className="text-[11px] text-[#7A6E65]">
                      Upload a photo in Section 2 above to calibrate zoom coordinates and crop alignment.
                    </p>
                  </div>
                )}
              </div>

              {/* SUB-SECTION A: FOCUS COORDINATES (When calibratorMode === 'focus') */}
              {calibratorMode === 'focus' && activeAcc && (
                <div className="bg-[#FBF6EC] p-4 border border-[#D5C8B5] space-y-3">
                  <span className="text-xs font-bold text-[#5C1A21] uppercase tracking-wider block">
                    Target Focus for: <span className="text-[#A9812F] underline">{activeAcc.name}</span>
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A3E38] uppercase mb-1">
                        X-Axis Position (%):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={targetX}
                          onChange={(e) => handleCoordinateChange('x', e.target.value)}
                          className="w-full bg-white border border-[#D5C8B5] px-3 py-1.5 text-xs font-mono font-bold text-[#5C1A21] focus:outline-none focus:border-[#5C1A21]"
                        />
                        <span className="absolute right-3 top-1.5 text-xs text-[#7A6E65] font-mono">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A3E38] uppercase mb-1">
                        Y-Axis Position (%):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={targetY}
                          onChange={(e) => handleCoordinateChange('y', e.target.value)}
                          className="w-full bg-white border border-[#D5C8B5] px-3 py-1.5 text-xs font-mono font-bold text-[#5C1A21] focus:outline-none focus:border-[#5C1A21]"
                        />
                        <span className="absolute right-3 top-1.5 text-xs text-[#7A6E65] font-mono">%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#4A3E38] uppercase mb-1">
                      <span>Zoom Scale Magnification:</span>
                      <span className="font-mono text-[#5C1A21] font-bold">{targetScale}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.5"
                      max="3.5"
                      step="0.1"
                      value={targetScale}
                      onChange={(e) => handleScaleChange(e.target.value)}
                      className="w-full accent-[#5C1A21]"
                    />
                  </div>
                </div>
              )}

              {/* SUB-SECTION B: GALLERY IMAGE CROPPER & 4-BORDER TRIMMER (When calibratorMode === 'crop') */}
              {calibratorMode === 'crop' && (
                <div className="bg-[#FBF6EC] p-4 border border-[#D5C8B5] space-y-4">
                  {cropSuccessMsg && (
                    <div className="p-2.5 bg-green-100 border border-green-300 text-green-800 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-700 shrink-0" />
                      <span>{cropSuccessMsg}</span>
                    </div>
                  )}

                  {/* Live Trim Metrics Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#EAE2D5] border border-[#D5C8B5] text-[11px] font-mono">
                    <span className="font-bold text-[#5C1A21]">
                      ✂️ Trimmed: <strong className="text-[#A9812F]">
                        T:{trimTop}% • B:{trimBottom}% • L:{trimLeft}% • R:{trimRight}%
                      </strong>
                    </span>
                    <span className="text-[#4A3E38]">
                      Remaining Box: <strong>{100 - trimLeft - trimRight}% × {100 - trimTop - trimBottom}%</strong>
                    </span>
                  </div>

                  {/* 4 BORDER TRIM CONTROLS (Top, Bottom, Left, Right) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5C1A21] uppercase tracking-wider flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-[#A9812F]" />
                        <span>Trim Borders From All 4 Sides (Phone Gallery Style):</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleResetCrop}
                        className="text-[11px] text-[#A9812F] hover:underline font-semibold cursor-pointer"
                      >
                        Reset to 0%
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* 1. TOP BORDER */}
                      <div className="bg-white p-2.5 border border-[#D5C8B5] rounded shadow-sm">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#4A3E38] mb-1">
                          <span>⬆️ Top Border Trim:</span>
                          <span className="font-mono text-[#5C1A21] font-bold">{trimTop}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTrimTop(prev => Math.max(0, prev - 1))}
                            className="px-2 py-0.5 bg-[#EAE2D5] hover:bg-[#D5C8B5] text-xs font-bold rounded text-[#5C1A21] cursor-pointer"
                            title="Less top trim"
                          >-</button>
                          <input
                            type="range"
                            min="0"
                            max={Math.max(0, 100 - trimBottom - 15)}
                            value={trimTop}
                            onChange={(e) => setTrimTop(Number(e.target.value))}
                            className="flex-1 accent-[#5C1A21]"
                          />
                          <button
                            type="button"
                            onClick={() => setTrimTop(prev => Math.min(100 - trimBottom - 15, prev + 1))}
                            className="px-2 py-0.5 bg-[#EAE2D5] hover:bg-[#D5C8B5] text-xs font-bold rounded text-[#5C1A21] cursor-pointer"
                            title="More top trim"
                          >+</button>
                        </div>
                      </div>

                      {/* 2. BOTTOM BORDER */}
                      <div className="bg-white p-2.5 border border-[#D5C8B5] rounded shadow-sm">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#4A3E38] mb-1">
                          <span>⬇️ Bottom Border Trim:</span>
                          <span className="font-mono text-[#5C1A21] font-bold">{trimBottom}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTrimBottom(prev => Math.max(0, prev - 1))}
                            className="px-2 py-0.5 bg-[#EAE2D5] hover:bg-[#D5C8B5] text-xs font-bold rounded text-[#5C1A21] cursor-pointer"
                            title="Less bottom trim"
                          >-</button>
                          <input
                            type="range"
                            min="0"
                            max={Math.max(0, 100 - trimTop - 15)}
                            value={trimBottom}
                            onChange={(e) => setTrimBottom(Number(e.target.value))}
                            className="flex-1 accent-[#5C1A21]"
                          />
                          <button
                            type="button"
                            onClick={() => setTrimBottom(prev => Math.min(100 - trimTop - 15, prev + 1))}
                            className="px-2 py-0.5 bg-[#EAE2D5] hover:bg-[#D5C8B5] text-xs font-bold rounded text-[#5C1A21] cursor-pointer"
                            title="More bottom trim"
                          >+</button>
                        </div>
                      </div>

                      {/* 3. LEFT BORDER */}
                      <div className="bg-white p-2.5 border border-[#D5C8B5] rounded shadow-sm">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#4A3E38] mb-1">
                          <span>⬅️ Left Border Trim:</span>
                          <span className="font-mono text-[#5C1A21] font-bold">{trimLeft}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTrimLeft(prev => Math.max(0, prev - 1))}
                            className="px-2 py-0.5 bg-[#EAE2D5] hover:bg-[#D5C8B5] text-xs font-bold rounded text-[#5C1A21] cursor-pointer"
                            title="Less left trim"
                          >-</button>
                          <input
                            type="range"
                            min="0"
                            max={Math.max(0, 100 - trimRight - 15)}
                            value={trimLeft}
                            onChange={(e) => setTrimLeft(Number(e.target.value))}
                            className="flex-1 accent-[#5C1A21]"
                          />
                          <button
                            type="button"
                            onClick={() => setTrimLeft(prev => Math.min(100 - trimRight - 15, prev + 1))}
                            className="px-2 py-0.5 bg-[#EAE2D5] hover:bg-[#D5C8B5] text-xs font-bold rounded text-[#5C1A21] cursor-pointer"
                            title="More left trim"
                          >+</button>
                        </div>
                      </div>

                      {/* 4. RIGHT BORDER */}
                      <div className="bg-white p-2.5 border border-[#D5C8B5] rounded shadow-sm">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#4A3E38] mb-1">
                          <span>➡️ Right Border Trim:</span>
                          <span className="font-mono text-[#5C1A21] font-bold">{trimRight}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTrimRight(prev => Math.max(0, prev - 1))}
                            className="px-2 py-0.5 bg-[#EAE2D5] hover:bg-[#D5C8B5] text-xs font-bold rounded text-[#5C1A21] cursor-pointer"
                            title="Less right trim"
                          >-</button>
                          <input
                            type="range"
                            min="0"
                            max={Math.max(0, 100 - trimLeft - 15)}
                            value={trimRight}
                            onChange={(e) => setTrimRight(Number(e.target.value))}
                            className="flex-1 accent-[#5C1A21]"
                          />
                          <button
                            type="button"
                            onClick={() => setTrimRight(prev => Math.min(100 - trimLeft - 15, prev + 1))}
                            className="px-2 py-0.5 bg-[#EAE2D5] hover:bg-[#D5C8B5] text-xs font-bold rounded text-[#5C1A21] cursor-pointer"
                            title="More right trim"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QUICK PRESETS & CENTERING ALIGNMENT */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-semibold text-[#7A6E65] uppercase">
                      ⚡ Quick Presets & Alignment:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={handleResetCrop}
                        className="px-2.5 py-1 bg-white hover:bg-[#EAE2D5] text-[#5C1A21] border border-[#D5C8B5] text-[10px] font-bold rounded cursor-pointer"
                      >
                        🎯 Full Photo (0% Trim)
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetTrim(5)}
                        className="px-2.5 py-1 bg-white hover:bg-[#EAE2D5] text-[#5C1A21] border border-[#D5C8B5] text-[10px] font-bold rounded cursor-pointer"
                      >
                        ✂️ Trim 5% All Sides
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetTrim(10)}
                        className="px-2.5 py-1 bg-white hover:bg-[#EAE2D5] text-[#5C1A21] border border-[#D5C8B5] text-[10px] font-bold rounded cursor-pointer"
                      >
                        ✂️ Trim 10% All Sides
                      </button>
                      <button
                        type="button"
                        onClick={handleBalanceHorizontal}
                        className="px-2.5 py-1 bg-[#EAE2D5] hover:bg-[#D5C8B5] text-[#5C1A21] border border-[#A9812F] text-[10px] font-bold rounded cursor-pointer flex items-center gap-1"
                        title="Make Left and Right border cuts equal so garment sits right in the middle"
                      >
                        <span>🎯 Mid Center X (Balance L & R)</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSnapPortrait}
                        className="px-2.5 py-1 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] border border-[#A9812F] text-[10px] font-bold rounded cursor-pointer flex items-center gap-1"
                        title="Auto-trim borders to fit 2:3 Boutique Portrait ratio"
                      >
                        <span>📏 Snap 2:3 Portrait</span>
                      </button>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="pt-2 border-t border-[#D5C8B5] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCropModal(true)}
                        className="px-3 py-1.5 bg-white hover:bg-[#EAE2D5] text-[#5C1A21] border border-[#D5C8B5] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Open large cropper modal with live store card preview"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#A9812F]" />
                        <span>Open Cropper Modal</span>
                      </button>

                      {originalImageUrl && originalImageUrl !== realImageUrl && (
                        <button
                          type="button"
                          onClick={handleRevertOriginal}
                          className="px-3 py-1.5 text-xs text-[#7A6E65] hover:text-[#5C1A21] underline cursor-pointer"
                        >
                          ↩ Revert to Original Photo
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={cropApplying}
                      onClick={applyCropAndSave}
                      className="px-4 py-2 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-bold uppercase tracking-wider rounded transition-colors shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Scissors className="w-4 h-4 text-[#C5A869]" />
                      <span>{cropApplying ? 'Cropping & Uploading...' : '✂️ Apply Crop & Save Image'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3 (Bottom Right): Customization Accessories Manager */}
            <div className="bg-[#F4ECE1] p-5 border border-[#E5D9C5] space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5D9C5]">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider">
                    3. Customization Accessories ({accessories.length})
                  </h3>
                  <p className="text-[11px] text-[#7A6E65]">
                    Edit accessory names, descriptions, and bespoke add-on prices.
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

              <div className="space-y-3">
                {accessories.map((acc, index) => {
                  const isCalibrating = calibratingIndex === index;

                  return (
                    <div
                      key={acc.id}
                      className={`p-3.5 border transition-all space-y-2.5 ${
                        isCalibrating
                          ? 'bg-[#FBF6EC] border-[#A9812F] ring-2 ring-[#A9812F]/25 shadow-md'
                          : 'bg-[#EAE2D5]/70 border-[#D5C8B5]'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                        {/* Name Input */}
                        <div className="sm:col-span-8">
                          <label className="block text-[10px] font-bold text-[#4A3E38] uppercase mb-0.5">
                            Accessory Name
                          </label>
                          <input
                            type="text"
                            value={acc.name}
                            onChange={(e) => handleUpdateAccessoryField(index, 'name', e.target.value)}
                            placeholder="e.g. Silk Pocket-Square"
                            className="w-full bg-white border border-[#D5C8B5] px-2.5 py-1.5 text-xs font-semibold text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                          />
                        </div>

                        {/* Price Input */}
                        <div className="sm:col-span-4">
                          <label className="block text-[10px] font-bold text-[#4A3E38] uppercase mb-0.5">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            value={acc.price}
                            onChange={(e) => handleUpdateAccessoryField(index, 'price', e.target.value)}
                            placeholder="1200"
                            className="w-full bg-white border border-[#D5C8B5] px-2.5 py-1.5 text-xs font-serif font-bold text-[#5C1A21] focus:outline-none focus:border-[#5C1A21]"
                          />
                        </div>
                      </div>

                      {/* Description Input (Fully Editable!) */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#4A3E38] uppercase mb-0.5">
                          Accessory Description (e.g. fabric details, embroidery or trim)
                        </label>
                        <input
                          type="text"
                          value={acc.description || ''}
                          onChange={(e) => handleUpdateAccessoryField(index, 'description', e.target.value)}
                          placeholder="e.g. Ivory-gold hand-rolled border silk square"
                          className="w-full bg-white border border-[#D5C8B5] px-2.5 py-1.5 text-xs text-[#52443C] focus:outline-none focus:border-[#5C1A21]"
                        />
                      </div>

                      {/* Bottom Controls Row: Target Coordinates & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#D5C8B5]/60 text-xs">
                        <span className="font-mono text-[11px] text-[#7A6E65]">
                          Target: X: {acc.zoomOrigin?.x || 50}% • Y: {acc.zoomOrigin?.y || 50}% • {acc.zoomOrigin?.scale || 2.4}x
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCalibratingIndex(index);
                              setPreviewZoomActive(false);
                            }}
                            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                              isCalibrating
                                ? 'bg-[#5C1A21] text-[#FBF6EC] border-[#5C1A21] shadow'
                                : 'bg-white text-[#5C1A21] border-[#D5C8B5] hover:bg-[#EAE2D5]'
                            }`}
                            title="Select to calibrate target coordinates on photo"
                          >
                            <Crosshair className="w-3.5 h-3.5 text-[#C5A869]" />
                            <span>{isCalibrating ? 'Calibrating in Section 4' : 'Calibrate Zoom'}</span>
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
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ==================== PRECISION CROPPER & ALIGNMENT MODAL ==================== */}
      {showCropModal && (
        <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FBF6EC] border-2 border-[#A9812F] max-w-4xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D9C5]">
              <div className="flex items-center gap-2 text-[#5C1A21]">
                <Crop className="w-5 h-5 text-[#A9812F]" />
                <h3 className="font-serif font-bold text-lg uppercase tracking-wider">
                  Precision Image Cropper & Alignment Studio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="p-1.5 text-[#5C1A21] hover:bg-[#EAE2D5] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5C4D45]">
              Jaise mobile gallery me photos crop karte hain, waisi hi 4 sides se borders ko drag karke unwanted background trim kijiye.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left Column: Interactive Cropping Viewport */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-[11px] font-bold text-[#5C1A21] uppercase tracking-wider">
                  Interactive Crop Studio (Drag Borders or Corners)
                </span>
                <div
                  ref={modalCropContainerRef}
                  className="relative inline-block max-w-[280px] max-h-[420px] bg-[#1a1412] border-2 border-[#A9812F] shadow-xl overflow-hidden select-none"
                >
                  <img
                    src={realImageUrl}
                    alt="Garment Preview"
                    className="max-w-[280px] max-h-[420px] w-auto h-auto block select-none pointer-events-none"
                  />

                  {/* 4 Dimmed Masks */}
                  <div
                    className="absolute left-0 right-0 top-0 bg-black/65 pointer-events-none"
                    style={{ height: `${trimTop}%` }}
                  />
                  <div
                    className="absolute left-0 right-0 bottom-0 bg-black/65 pointer-events-none"
                    style={{ height: `${trimBottom}%` }}
                  />
                  <div
                    className="absolute left-0 bg-black/65 pointer-events-none"
                    style={{
                      top: `${trimTop}%`,
                      bottom: `${trimBottom}%`,
                      width: `${trimLeft}%`
                    }}
                  />
                  <div
                    className="absolute right-0 bg-black/65 pointer-events-none"
                    style={{
                      top: `${trimTop}%`,
                      bottom: `${trimBottom}%`,
                      width: `${trimRight}%`
                    }}
                  />

                  {/* Active Crop Box */}
                  <div
                    className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(169,129,47,0.9),0_4px_16px_rgba(0,0,0,0.6)] cursor-move select-none"
                    style={{
                      left: `${trimLeft}%`,
                      top: `${trimTop}%`,
                      right: `${trimRight}%`,
                      bottom: `${trimBottom}%`
                    }}
                    onMouseDown={(e) => handleBorderDragStart(e, 'move', true)}
                    onTouchStart={(e) => handleBorderDragStart(e, 'move', true)}
                    title="Drag inside to center garment • Drag borders/corners to trim"
                  >
                    {/* 3x3 Grid */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/40 border-dashed" />
                      <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/40 border-dashed" />
                      <div className="absolute top-1/3 left-0 right-0 border-t border-white/40 border-dashed" />
                      <div className="absolute top-2/3 left-0 right-0 border-t border-white/40 border-dashed" />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/80 bg-[#5C1A21]/80 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[#C5A869] rounded-full" />
                      </div>
                    </div>

                    {/* Corner Handles */}
                    <div
                      className="absolute -top-1.5 -left-1.5 w-6 h-6 cursor-nwse-resize z-30"
                      onMouseDown={(e) => handleBorderDragStart(e, 'tl', true)}
                      onTouchStart={(e) => handleBorderDragStart(e, 'tl', true)}
                    >
                      <div className="w-3.5 h-3.5 border-t-3 border-l-3 border-[#C5A869] bg-white shadow-md" />
                    </div>
                    <div
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 cursor-nesw-resize z-30 flex justify-end"
                      onMouseDown={(e) => handleBorderDragStart(e, 'tr', true)}
                      onTouchStart={(e) => handleBorderDragStart(e, 'tr', true)}
                    >
                      <div className="w-3.5 h-3.5 border-t-3 border-r-3 border-[#C5A869] bg-white shadow-md" />
                    </div>
                    <div
                      className="absolute -bottom-1.5 -left-1.5 w-6 h-6 cursor-nesw-resize z-30 flex items-end"
                      onMouseDown={(e) => handleBorderDragStart(e, 'bl', true)}
                      onTouchStart={(e) => handleBorderDragStart(e, 'bl', true)}
                    >
                      <div className="w-3.5 h-3.5 border-b-3 border-l-3 border-[#C5A869] bg-white shadow-md" />
                    </div>
                    <div
                      className="absolute -bottom-1.5 -right-1.5 w-6 h-6 cursor-nwse-resize z-30 flex items-end justify-end"
                      onMouseDown={(e) => handleBorderDragStart(e, 'br', true)}
                      onTouchStart={(e) => handleBorderDragStart(e, 'br', true)}
                    >
                      <div className="w-3.5 h-3.5 border-b-3 border-r-3 border-[#C5A869] bg-white shadow-md" />
                    </div>

                    {/* Edge Handles */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 cursor-ns-resize z-20 flex items-center justify-center"
                      onMouseDown={(e) => handleBorderDragStart(e, 'top', true)}
                      onTouchStart={(e) => handleBorderDragStart(e, 'top', true)}
                    >
                      <div className="w-7 h-1.5 bg-[#C5A869] rounded shadow border border-white" />
                    </div>
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-4 cursor-ns-resize z-20 flex items-center justify-center"
                      onMouseDown={(e) => handleBorderDragStart(e, 'bottom', true)}
                      onTouchStart={(e) => handleBorderDragStart(e, 'bottom', true)}
                    >
                      <div className="w-7 h-1.5 bg-[#C5A869] rounded shadow border border-white" />
                    </div>
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-12 cursor-ew-resize z-20 flex items-center justify-center"
                      onMouseDown={(e) => handleBorderDragStart(e, 'left', true)}
                      onTouchStart={(e) => handleBorderDragStart(e, 'left', true)}
                    >
                      <div className="h-7 w-1.5 bg-[#C5A869] rounded shadow border border-white" />
                    </div>
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-12 cursor-ew-resize z-20 flex items-center justify-center"
                      onMouseDown={(e) => handleBorderDragStart(e, 'right', true)}
                      onTouchStart={(e) => handleBorderDragStart(e, 'right', true)}
                    >
                      <div className="h-7 w-1.5 bg-[#C5A869] rounded shadow border border-white" />
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-[#7A6E65]">
                  📱 Phone gallery style: Drag handles to crop borders
                </span>
              </div>

              {/* Right Column: Live Boutique Card Preview */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-[11px] font-bold text-[#5C1A21] uppercase tracking-wider">
                  Live Boutique Store Preview
                </span>
                <div className="w-full max-w-[240px] bg-white border border-[#D5C8B5] p-2.5 shadow-md">
                  <div className="relative aspect-[2/3] w-full bg-[#1a1412] overflow-hidden">
                    <div className="relative w-full h-full overflow-hidden">
                      <img
                        src={realImageUrl}
                        alt="Garment Preview"
                        style={{
                          position: 'absolute',
                          width: `${10000 / Math.max(1, (100 - trimLeft - trimRight))}%`,
                          height: `${10000 / Math.max(1, (100 - trimTop - trimBottom))}%`,
                          left: `-${(trimLeft / Math.max(1, (100 - trimLeft - trimRight))) * 100}%`,
                          top: `-${(trimTop / Math.max(1, (100 - trimTop - trimBottom))) * 100}%`,
                          maxWidth: 'none',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 text-center space-y-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-[#A9812F] font-bold block">
                      {category} • {subCategory}
                    </span>
                    <h4 className="font-serif font-bold text-xs text-[#5C1A21] truncate">
                      {title || 'Garment Title'}
                    </h4>
                    <span className="text-xs font-serif font-bold text-[#2B211D] block">
                      {formatINR(basePrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Border Trim Sliders & Presets inside Modal */}
            <div className="bg-[#F4ECE1] p-4 border border-[#E5D9C5] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-2 border border-[#D5C8B5] rounded">
                  <div className="flex justify-between text-[11px] font-bold text-[#4A3E38] mb-1">
                    <span>⬆️ Top:</span>
                    <span className="font-mono text-[#5C1A21]">{trimTop}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, 100 - trimBottom - 15)}
                    value={trimTop}
                    onChange={(e) => setTrimTop(Number(e.target.value))}
                    className="w-full accent-[#5C1A21]"
                  />
                </div>

                <div className="bg-white p-2 border border-[#D5C8B5] rounded">
                  <div className="flex justify-between text-[11px] font-bold text-[#4A3E38] mb-1">
                    <span>⬇️ Bottom:</span>
                    <span className="font-mono text-[#5C1A21]">{trimBottom}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, 100 - trimTop - 15)}
                    value={trimBottom}
                    onChange={(e) => setTrimBottom(Number(e.target.value))}
                    className="w-full accent-[#5C1A21]"
                  />
                </div>

                <div className="bg-white p-2 border border-[#D5C8B5] rounded">
                  <div className="flex justify-between text-[11px] font-bold text-[#4A3E38] mb-1">
                    <span>⬅️ Left:</span>
                    <span className="font-mono text-[#5C1A21]">{trimLeft}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, 100 - trimRight - 15)}
                    value={trimLeft}
                    onChange={(e) => setTrimLeft(Number(e.target.value))}
                    className="w-full accent-[#5C1A21]"
                  />
                </div>

                <div className="bg-white p-2 border border-[#D5C8B5] rounded">
                  <div className="flex justify-between text-[11px] font-bold text-[#4A3E38] mb-1">
                    <span>➡️ Right:</span>
                    <span className="font-mono text-[#5C1A21]">{trimRight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, 100 - trimLeft - 15)}
                    value={trimRight}
                    onChange={(e) => setTrimRight(Number(e.target.value))}
                    className="w-full accent-[#5C1A21]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetCrop}
                  className="px-2.5 py-1 bg-white border border-[#D5C8B5] text-[10px] font-bold text-[#5C1A21] rounded cursor-pointer"
                >
                  🎯 Reset (0%)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTrim(5)}
                  className="px-2.5 py-1 bg-white border border-[#D5C8B5] text-[10px] font-bold text-[#5C1A21] rounded cursor-pointer"
                >
                  Trim 5%
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTrim(10)}
                  className="px-2.5 py-1 bg-white border border-[#D5C8B5] text-[10px] font-bold text-[#5C1A21] rounded cursor-pointer"
                >
                  Trim 10%
                </button>
                <button
                  type="button"
                  onClick={handleBalanceHorizontal}
                  className="px-2.5 py-1 bg-[#EAE2D5] border border-[#A9812F] text-[10px] font-bold text-[#5C1A21] rounded cursor-pointer"
                >
                  🎯 Mid Center X
                </button>
                <button
                  type="button"
                  onClick={handleSnapPortrait}
                  className="px-2.5 py-1 bg-[#5C1A21] text-[#FBF6EC] border border-[#A9812F] text-[10px] font-bold rounded cursor-pointer"
                >
                  📏 Snap 2:3 Portrait
                </button>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="px-5 py-2 border border-[#D5C8B5] text-[#5C1A21] text-xs font-semibold uppercase tracking-wider hover:bg-[#EAE2D5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={cropApplying}
                onClick={applyCropAndSave}
                className="px-6 py-2.5 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-bold uppercase tracking-wider rounded transition-colors shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Scissors className="w-4 h-4 text-[#C5A869]" />
                <span>{cropApplying ? 'Cropping & Uploading...' : '✂️ Apply Crop & Save Image'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EXIT CONFIRMATION MODAL ==================== */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FBF6EC] border border-[#A9812F] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#5C1A21]">
              <AlertCircle className="w-6 h-6 text-[#A9812F]" />
              <h3 className="font-serif font-bold text-lg">Exit without saving?</h3>
            </div>
            <p className="text-xs text-[#5C4D45]">
              Are you sure you want to discard your modifications? Any unsaved changes to this garment will be lost.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 border border-[#D5C8B5] text-[#5C1A21] text-xs font-semibold uppercase tracking-wider hover:bg-[#EAE2D5]"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                }}
                className="px-5 py-2 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] text-xs font-bold uppercase tracking-wider shadow"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
