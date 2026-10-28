import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, MessageSquare, Shield, Clock, Scissors, Check, HelpCircle, Share2, Layers } from 'lucide-react';
import ZoomableImage from '../components/ZoomableImage';
import AccessorySelector from '../components/AccessorySelector';
import PricePanelModal from '../components/PricePanelModal';
import { api } from '../services/api';
import { useConfig } from '../context/ConfigContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatINR, getWhatsAppLink } = useConfig();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected bespoke accessories array
  const [selectedAccessories, setSelectedAccessories] = useState([]);

  // Currently focused accessory for CSS transform-origin zoom
  const [activeZoomAccessory, setActiveZoomAccessory] = useState(null);

  // "Get This Item" Price Panel Modal State
  const [pricePanelOpen, setPricePanelOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getProductById(id).then((data) => {
      setProduct(data);
      setSelectedAccessories([]);
      setActiveZoomAccessory(null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-2 border-[#5C1A21] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <span className="font-serif text-lg text-[#5C1A21]">Opening Bespoke Fitting Suite...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#5C1A21]">Garment Not Found</h2>
        <Link to="/" className="inline-block text-xs uppercase tracking-widest text-[#A9812F] underline">
          Return to Collections
        </Link>
      </div>
    );
  }

  // Calculate accessory pricing
  const accessoriesTotal = selectedAccessories.reduce((sum, item) => sum + (item.price || 0), 0);
  const grandTotal = (product.basePrice || 0) + accessoriesTotal;

  // Toggle accessory selection & smart zoom
  const handleToggleAccessory = (acc) => {
    setSelectedAccessories((prev) => {
      const exists = prev.some((item) => item.key === acc.key);
      if (exists) {
        // When unselecting: Always reset zoom to full overview
        setActiveZoomAccessory(null);
        return prev.filter((item) => item.key !== acc.key);
      } else {
        // When selecting: Zoom into this accessory's calibrated coordinates
        setActiveZoomAccessory(acc);
        return [...prev, acc];
      }
    });
  };

  // Focus zoom on an accessory (from Inspect button)
  const handleFocusAccessory = (acc) => {
    if (activeZoomAccessory?.key === acc.key) {
      setActiveZoomAccessory(null); // toggle off zoom
    } else {
      setActiveZoomAccessory(acc);
    }
  };

  // Reset zoom
  const handleResetZoom = () => {
    setActiveZoomAccessory(null);
  };

  // Reset all selections and zoom
  const handleResetAllSelections = () => {
    setSelectedAccessories([]);
    setActiveZoomAccessory(null);
  };

  // Direct WhatsApp query
  const handleDirectWhatsApp = async () => {
    const accNames = selectedAccessories.map((a) => a.name).join(', ') || 'Standard Garment';
    const photoUrl = product?.realImageUrl
      ? (product.realImageUrl.startsWith('http') ? product.realImageUrl : `${window.location.origin}${product.realImageUrl}`)
      : '';
    const productPageUrl = `${window.location.origin}/product/${product?.id}`;

    let msg = `*👑 BESPOKE INQUIRY — M.S FASHION*\n\n`;
    if (photoUrl) {
      msg += `📸 *DESIGN PHOTO:* ${photoUrl}\n\n`;
    }
    msg += `Hello M.S Fashion Team,\nI am inquiring about *${product.title}* (Ref: ${product.id}):\n\n`;
    msg += `*Category:* ${product.category} (${product.subCategory})\n`;
    msg += `*Base Price:* ${formatINR(product.basePrice)}\n\n`;
    msg += `*Selected Accessories:* ${accNames}\n`;
    msg += `*Estimated Total:* ${formatINR(grandTotal)}\n\n`;
    msg += `🔗 *View on Boutique Site:* ${productPageUrl}\n\n`;
    msg += `Please advise on tailoring measurements, fabric availability, and delivery timeline.`;

    // Copy photo to clipboard on desktop so user can paste it directly into chat if desired
    if (photoUrl && navigator.clipboard && window.ClipboardItem) {
      try {
        const response = await fetch(photoUrl);
        if (response.ok) {
          const blob = await response.blob();
          if (blob.type === 'image/png') {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
          }
        }
      } catch (e) {}
    }

    // Direct WhatsApp opening strictly to M.S Fashion Master's Number
    window.open(getWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* ==================== TWO COLUMN COMPACT LAYOUT ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ==================== LEFT COLUMN: COMPACT ZOOMABLE PHOTO VIEWER ==================== */}
        <div className="lg:col-span-5 w-full max-w-[440px] mx-auto">
          <ZoomableImage
            product={product}
            activeAccessory={activeZoomAccessory}
            onResetZoom={handleResetZoom}
          />

          {/* Helper caption below image */}
          <div className="mt-2 text-center text-[11px] text-[#7A6E65] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#A9812F]" />
            <span>Select accessories on the right to zoom into craftsmanship details.</span>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN: PRODUCT DETAILS & ACCESSORIES ==================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header Info */}
          <div className="border-b border-[#E5D9C5] pb-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A796F]">
              <span className="uppercase tracking-widest text-[#8F6B24] font-semibold font-sans">
                {product.category} • {product.subCategory}
              </span>
              <span>Ref: {product.id}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5C1A21] leading-tight tracking-wide">
              {product.title}
            </h1>

            {product.tagline && (
              <p className="font-serif italic text-sm sm:text-base text-[#574940]">
                "{product.tagline}"
              </p>
            )}
          </div>

          {/* ==================== CATEGORY-SPECIFIC ACCESSORY BUTTONS ==================== */}
          <div className="space-y-3">
            <AccessorySelector
              product={product}
              selectedAccessories={selectedAccessories}
              activeZoomAccessory={activeZoomAccessory}
              onToggleAccessory={handleToggleAccessory}
              onFocusAccessory={handleFocusAccessory}
              onResetSelection={handleResetAllSelections}
            />
          </div>

          {/* ==================== "GET THIS ITEM" & CONSULTATION ACTIONS ==================== */}
          <div className="p-5 bg-[#ECE2D2] border border-[#D5C8B5] space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8A796F] block">
                  Bespoke Grand Estimate
                </span>
                <span className="font-serif font-bold text-2xl text-[#5C1A21]">
                  {formatINR(grandTotal)}
                </span>
              </div>

              <span className="text-[11px] text-[#6B5E55] text-right">
                {selectedAccessories.length > 0
                  ? `Includes ${selectedAccessories.length} bespoke add-ons`
                  : 'Garment only (Add accessories above)'}
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* "Get This Item" Button */}
              <button
                type="button"
                onClick={() => setPricePanelOpen(true)}
                className="w-full py-3.5 bg-[#5C1A21] hover:bg-[#421116] text-[#FBF6EC] font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg border border-[#A9812F]/50 flex items-center justify-center gap-2"
              >
                <span>Get This Item</span>
                <Sparkles className="w-4 h-4 text-[#C5A869]" />
              </button>

              {/* Direct WhatsApp CTA */}
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Contact via WhatsApp</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-[#73655B] pt-1">
              🛡️ No online checkout needed. Every piece is handcrafted upon personalized measurement verification with our master tailors.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== PRICE PANEL MODAL ==================== */}
      <PricePanelModal
        isOpen={pricePanelOpen}
        onClose={() => setPricePanelOpen(false)}
        product={product}
        selectedAccessories={selectedAccessories}
        totalPrice={grandTotal}
      />
    </div>
  );
}
