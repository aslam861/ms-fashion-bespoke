import React, { useState } from 'react';
import { Sparkles, Camera, Image as ImageIcon } from 'lucide-react';

/**
 * PlaceholderBox
 * Strict compliance with zero stock/AI image rule:
 * Displays a clean, luxury-styled neutral gray/taupe placeholder box
 * with the exact required text label (e.g. "[Sherwani photo 1]").
 * Automatically shows the real image if user uploads one into the folder.
 */
export default function PlaceholderBox({
  label = '[Garment Photo Placeholder]',
  aspectRatio = 'aspect-[3/4]',
  className = '',
  realImageUrl = null,
  folderPath = '',
  interactive = false,
  badge = null,
  objectFit = 'contain'
}) {
  const [imgError, setImgError] = useState(false);

  // If real image is present and didn't fail to load, render the actual photo
  if (realImageUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#EAE2D5] ${aspectRatio} ${className} group`}>
        <img
          src={realImageUrl}
          alt={label}
          onError={() => setImgError(true)}
          className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} transition-transform duration-700 group-hover:scale-105`}
        />
        {badge && (
          <div className="absolute top-3 left-3 bg-[#5C1A21]/90 backdrop-blur-sm text-[#FBF6EC] text-xs uppercase tracking-widest px-3 py-1 font-medium border border-[#A9812F]/40 shadow-sm">
            {badge}
          </div>
        )}
      </div>
    );
  }

  // Otherwise, render the elegant editorial gray placeholder box
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-[#E5E0D8] text-[#2B211D] ${aspectRatio} border border-[#D0C6B8] overflow-hidden select-none transition-all duration-300 ${
        interactive ? 'hover:border-[#A9812F] hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {/* Subtle background luxury grid line overlay */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#2B211D_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Decorative Inner Framing */}
      <div className="absolute inset-3 border border-[#A9812F]/20 pointer-events-none" />
      <div className="absolute inset-4 border border-[#A9812F]/10 pointer-events-none" />

      {/* Top Badge if any */}
      {badge && (
        <div className="absolute top-4 left-4 z-10 bg-[#5C1A21] text-[#FBF6EC] text-[11px] uppercase tracking-widest px-3 py-1 font-medium border border-[#A9812F]/40 shadow-sm">
          {badge}
        </div>
      )}

      {/* Center Framing and Label */}
      <div className="relative z-10 p-6 text-center space-y-3 max-w-[85%]">
        <div className="w-10 h-10 mx-auto rounded-full bg-[#5C1A21]/10 border border-[#A9812F]/30 flex items-center justify-center text-[#5C1A21] transition-transform duration-300 group-hover:scale-110">
          <Camera className="w-5 h-5 text-[#8F6B24]" />
        </div>

        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-[#5C1A21] font-semibold">
            {label}
          </p>
          <p className="text-[11px] text-[#8F6B24] font-serif italic font-medium">
            Image Yet To Be Uploaded
          </p>
          <p className="text-[9px] text-[#8A796F] font-mono">
            {folderPath || 'uploads/references/'}
          </p>
        </div>
      </div>

      {/* Bottom Subtle Corner Flourish */}
      <div className="absolute bottom-2 right-2 text-[9px] font-mono tracking-widest text-[#A8988C] uppercase">
        M.S Fashion Atelier
      </div>
    </div>
  );
}
