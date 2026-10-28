import React from 'react';
import { Check, Sparkles, ZoomIn, Eye } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

/**
 * AccessorySelector
 * Displays category-specific accessory buttons:
 * - Sherwani: Collar, Buttons, Mojdi, Safa, Mala, Brooch, Dupatta
 * - Jodhpuri: Collar, Buttons, Pocket-Square, Brooch
 * - Indo-Western: Collar, Buttons, Pocket-Square
 * - Blazer: SB-DB, Collar, Buttons, Pocket-Square, Tuxedo
 *
 * Clicking visually zooms the photo via CSS and updates the bespoke pricing total.
 */
export default function AccessorySelector({
  product,
  selectedAccessories = [],
  activeZoomAccessory = null,
  onToggleAccessory,
  onFocusAccessory,
  onResetSelection = () => {}
}) {
  const { formatINR } = useConfig();
  const accessories = product?.accessories || [];

  if (accessories.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#F4ECE1] border border-[#E5D9C5] p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5D9C5] mb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#5C1A21] flex items-center gap-2">
            <span>Bespoke Accessory Elements</span>
            <span className="text-xs font-sans font-normal px-2 py-0.5 bg-[#A9812F]/15 text-[#8F6B24] rounded-full border border-[#A9812F]/30">
              {product.category} Edition
            </span>
          </h3>
          <p className="text-xs text-[#6B5E55] mt-0.5">
            Click any element to <strong className="text-[#5C1A21]">zoom into details</strong> and customize your ensemble.
          </p>
        </div>
      </div>

      {/* Grid of accessory buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {accessories.map((acc) => {
          const isSelected = selectedAccessories.some((item) => item.key === acc.key);
          const isZoomFocused = activeZoomAccessory?.key === acc.key;

          return (
            <div
              key={acc.key}
              className={`relative flex flex-col p-3 rounded border transition-all duration-300 text-left ${
                isZoomFocused
                  ? 'border-[#A9812F] bg-[#FBF6EC] shadow-md ring-2 ring-[#A9812F]/40'
                  : isSelected
                  ? 'border-[#5C1A21]/50 bg-[#FDF9F3]'
                  : 'border-[#DCD2C2] bg-[#ECE4D8]/50 hover:bg-[#FBF6EC] hover:border-[#A9812F]/60'
              }`}
            >
              {/* Top Row: Name + Focus Badge + Checkbox */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Custom Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAccessory(acc);
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#5C1A21] text-[#FBF6EC]'
                        : 'border border-[#A9812F] bg-white text-transparent hover:border-[#5C1A21]'
                    }`}
                    title={isSelected ? 'Remove from ensemble' : 'Include in ensemble'}
                  >
                    <Check className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </button>

                  <span className="font-serif font-semibold text-sm text-[#2B211D] truncate">
                    {acc.name}
                  </span>
                </div>

                {/* Focus Zoom Button */}
                <button
                  type="button"
                  onClick={() => onFocusAccessory(acc)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                    isZoomFocused
                      ? 'bg-[#5C1A21] text-[#FBF6EC]'
                      : 'bg-[#E2D8C9] text-[#5C1A21] hover:bg-[#A9812F] hover:text-[#FBF6EC]'
                  }`}
                  title={`Zoom into ${acc.name}`}
                >
                  <Eye className="w-3 h-3" />
                  <span>{isZoomFocused ? 'Zoomed' : 'Inspect'}</span>
                </button>
              </div>

              {/* Description line */}
              {acc.description && (
                <p className="text-[11px] text-[#73655B] mt-1.5 line-clamp-1">
                  {acc.description}
                </p>
              )}

              {/* Price Row */}
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#E5D9C5]/60 text-xs">
                <span className="text-[11px] text-[#8C7E74]">Bespoke Crafting:</span>
                <span className="font-medium text-[#5C1A21]">
                  +{formatINR(acc.price)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary helper note with Select All and Reset Selection buttons */}
      <div className="mt-4 pt-3 border-t border-[#E5D9C5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#7A6E65]">
        <span>
          Selected: <strong className="text-[#5C1A21]">{selectedAccessories.length} of {accessories.length}</strong>
        </span>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              accessories.forEach((a) => {
                if (!selectedAccessories.some((item) => item.key === a.key)) {
                  onToggleAccessory(a);
                }
              });
            }}
            className="text-[#8F6B24] hover:text-[#5C1A21] font-medium underline underline-offset-2 transition-colors"
          >
            Select All Royal Accessories
          </button>

          {selectedAccessories.length > 0 && (
            <button
              type="button"
              onClick={onResetSelection}
              className="text-[#942C38] hover:text-[#5C1A21] font-medium underline underline-offset-2 transition-colors"
            >
              Reset Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
