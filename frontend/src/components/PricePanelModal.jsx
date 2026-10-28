import React, { useState } from 'react';
import { X, MessageSquare, Check, ShieldCheck, Sparkles, Calendar, User, MapPin } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { api } from '../services/api';

/**
 * PricePanelModal
 * Opened by "Get This Item".
 * Shows:
 * 1. Base price of garment
 * 2. Selected accessories breakdown
 * 3. Grand Running Total
 * 4. Client input fields (Your Name, City / Location, Customization Notes)
 * 5. Primary "Contact via WhatsApp" CTA with pre-populated bespoke message.
 */
export default function PricePanelModal({
  isOpen,
  onClose,
  product,
  selectedAccessories = [],
  totalPrice = 0
}) {
  const { formatINR, getWhatsAppLink, brandConfig } = useConfig();

  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoCopiedToast, setPhotoCopiedToast] = useState(false);

  if (!isOpen || !product) return null;

  const accessoriesTotal = selectedAccessories.reduce((sum, item) => sum + (item.price || 0), 0);
  const grandTotal = (product.basePrice || 0) + accessoriesTotal;

  // Compute full photo URL
  const photoUrl = product?.realImageUrl
    ? (product.realImageUrl.startsWith('http') ? product.realImageUrl : `${window.location.origin}${product.realImageUrl}`)
    : '';
  const productPageUrl = `${window.location.origin}/product/${product?.id}`;

  // Build the rich WhatsApp consultation message
  const buildWhatsAppMessage = () => {
    const accList = selectedAccessories.length > 0
      ? selectedAccessories.map((a) => `• ${a.name} (+${formatINR(a.price)})`).join('\n')
      : 'None (Standard Garment Only)';

    let msg = `*👑 BESPOKE CONSULTATION REQUEST — M.S FASHION*\n\n`;
    if (photoUrl) {
      msg += `📸 *DESIGN PHOTO:* ${photoUrl}\n\n`;
    }
    msg += `Hello M.S Fashion Team,\nI am interested in tailoring this bespoke ensemble:\n\n`;
    msg += `*Garment:* ${product.title}\n`;
    msg += `*Reference ID:* ${product.id}\n`;
    msg += `*Category:* ${product.category} (${product.subCategory})\n`;
    msg += `*Base Price:* ${formatINR(product.basePrice)}\n\n`;
    msg += `*Selected Bespoke Accessories:*\n${accList}\n\n`;
    msg += `*Estimated Grand Total:* ${formatINR(grandTotal)}\n\n`;

    if (customerName) msg += `*Client Name:* ${customerName}\n`;
    if (customerCity) msg += `*City:* ${customerCity}\n`;
    if (customNotes) msg += `*Customization Notes:* ${customNotes}\n\n`;

    msg += `🔗 *View Design on Website:* ${productPageUrl}\n\n`;
    msg += `Please guide me with the measurement process, fabric swatch consultation, and bespoke delivery schedule.`;
    return msg;
  };

  const handleWhatsAppClick = async () => {
    setIsSubmitting(true);
    if (customerName || customerCity) {
      try {
        await api.submitInquiry({
          customerName: customerName || 'Bespoke Client (WhatsApp Direct)',
          customerPhone: 'Via WhatsApp',
          city: customerCity,
          consultationType: 'whatsapp',
          productId: product.id,
          productTitle: product.title,
          selectedAccessories: selectedAccessories.map((a) => a.name),
          estimatedTotal: grandTotal,
          notes: customNotes
        });
      } catch (err) {
        // Continue
      }
    }

    const messageText = buildWhatsAppMessage();

    // Clipboard Copy fallback (allows instant Ctrl+V into chat to attach photo directly)
    if (photoUrl && navigator.clipboard && window.ClipboardItem) {
      try {
        const response = await fetch(photoUrl);
        if (response.ok) {
          const blob = await response.blob();
          if (blob.type === 'image/png') {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setPhotoCopiedToast(true);
            setTimeout(() => setPhotoCopiedToast(false), 6000);
          }
        }
      } catch (e) {}
    }

    // Direct WhatsApp opening strictly to M.S Fashion Master's Number
    const waUrl = getWhatsAppLink(messageText);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#2B211D]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FBF6EC] border border-[#A9812F]/40 shadow-2xl rounded-none overflow-hidden my-auto">
        {/* Header Ribbon */}
        <div className="bg-[#5C1A21] text-[#FBF6EC] p-4 sm:p-5 flex items-center justify-between border-b border-[#A9812F]/30">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#C5A869] font-medium block">
              Bespoke Price Breakdown & Consultation
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FBF6EC] tracking-wide">
              {product.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#FBF6EC]/80 hover:text-[#FBF6EC] hover:bg-[#461319] rounded-full transition-colors cursor-pointer"
            title="Close panel"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Garment Visual Header with Photo & Ref */}
          <div className="bg-[#FAF4EB] border border-[#D5C8B5] p-3.5 flex items-center gap-3.5 shadow-xs">
            {product.realImageUrl ? (
              <div className="w-14 h-20 bg-white border border-[#A9812F]/40 shadow-xs shrink-0 overflow-hidden">
                <img
                  src={product.realImageUrl}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-14 h-20 bg-[#EAE2D5] border border-[#D5C8B5] flex items-center justify-center text-[9px] text-[#5C1A21] font-mono text-center p-1 shrink-0">
                Garment
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-[#5C1A21] text-[#FBF6EC] text-[9px] font-bold uppercase tracking-wider rounded">
                  {product.category}
                </span>
                <span className="px-1.5 py-0.5 bg-[#EAE2D5] border border-[#C5B49E] text-[#5C1A21] font-mono font-bold text-[10px] rounded">
                  Ref: {product.id}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#2B211D] truncate">
                {product.title}
              </h4>
              <p className="text-[11px] text-[#25D366] font-medium flex items-center gap-1">
                <span>✓ Design photo will be attached for WhatsApp</span>
              </p>
            </div>
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-[#F4ECE1] border border-[#E5D9C5] p-4 sm:p-5">
            <h3 className="font-serif font-bold text-base text-[#5C1A21] uppercase tracking-wider pb-2 border-b border-[#E5D9C5] mb-3 flex items-center justify-between">
              <span>Cost Summary</span>
              <span className="text-xs font-sans font-normal text-[#8A796F]">
                Handcrafted Tailoring
              </span>
            </h3>

            {/* Base Price Row */}
            <div className="flex items-center justify-between py-2 border-b border-[#E5D9C5]/60 text-sm">
              <div className="flex flex-col">
                <span className="font-medium text-[#2B211D]">Base Garment Crafting</span>
                <span className="text-xs text-[#7A6E65]">{product.fabric} • {product.embroidery}</span>
              </div>
              <span className="font-serif font-bold text-base text-[#2B211D]">
                {formatINR(product.basePrice)}
              </span>
            </div>

            {/* Selected Accessories Items */}
            {selectedAccessories.length > 0 ? (
              <div className="py-2 space-y-1.5 border-b border-[#E5D9C5]/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8F6B24] block">
                  Bespoke Accessories Included:
                </span>
                {selectedAccessories.map((acc) => (
                  <div key={acc.key} className="flex items-center justify-between text-xs sm:text-sm pl-2">
                    <span className="text-[#4A3E38] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#5C1A21]" />
                      {acc.name}
                    </span>
                    <span className="font-medium text-[#5C1A21]">
                      +{formatINR(acc.price)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-2.5 text-xs text-[#8A7D74] italic border-b border-[#E5D9C5]/60">
                No extra accessories selected. (You can toggle accessories on the product page).
              </div>
            )}

            {/* Running Total Row */}
            <div className="flex items-center justify-between pt-3 mt-1">
              <div>
                <span className="font-serif font-bold text-lg sm:text-xl text-[#5C1A21]">
                  Estimated Grand Total:
                </span>
                <span className="block text-[11px] text-[#7A6E65]">
                  Inclusive of master tailor fittings & hand craftsmanship
                </span>
              </div>
              <div className="text-right">
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#5C1A21]">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Bespoke Assurance Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#52443C] bg-[#ECE2D2]/50 p-3.5 border border-[#E0D4C0]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A9812F] shrink-0" />
              <span>100% Custom Fit Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A9812F] shrink-0" />
              <span>Pure Handloom Fabrics</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#A9812F] shrink-0" />
              <span>Delivery in {product.leadTime || '15-20 Days'}</span>
            </div>
          </div>

          {/* Client Details Input Fields (Clean, without the heading text) */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4A3E38] mb-1">Your Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#A9812F] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-8 pr-3 py-2 text-sm text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3E38] mb-1">City / Location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#A9812F] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, London"
                    className="w-full bg-[#FFFFFF] border border-[#D5C8B5] pl-8 pr-3 py-2 text-sm text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3E38] mb-1">Customization / Fitting Notes</label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Mention specific color preferences, wedding date, collar style or embroidery tweaks..."
                rows={2}
                className="w-full bg-[#FFFFFF] border border-[#D5C8B5] px-3 py-2 text-sm text-[#2B211D] focus:outline-none focus:border-[#5C1A21]"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer / WhatsApp Action Button */}
        <div className="bg-[#F4ECE1] border-t border-[#E5D9C5] p-4 sm:p-5 flex flex-col gap-3">
          {photoCopiedToast && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>📸 Design photo copied! You can also press <strong>Ctrl + V</strong> in WhatsApp chat to paste the photo.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6B5E55] text-center sm:text-left">
              <span>Direct consultation with M.S Fashion master stylist</span>
              <span className="block font-mono text-[11px] text-[#A9812F]">WhatsApp: {brandConfig.displayPhone}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-[#D5C8B5] text-[#5C1A21] hover:bg-[#E5D9C5] text-xs uppercase tracking-widest font-semibold transition-colors flex-1 sm:flex-none cursor-pointer"
              >
                Back to Garment
              </button>

              <button
                type="button"
                onClick={handleWhatsAppClick}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Contact via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
