import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, Sparkles } from 'lucide-react';
import PlaceholderBox from './PlaceholderBox';

/**
 * ModelRotator
 * 3D Rotating Mannequin Model Component.
 * Sequence: 0° → 45° → 90° → 135° → 180° → 225° → 270° → 315° → 0° (Full 4-second cycle)
 *
 * Props:
 * - category: 'sherwani' | 'jodhpuri' | 'indo-western' | 'blazer'
 * - swingSequence: array of degrees in rotation order (default: [0, 45, 90, 135, 180, 225, 270, 315, 0])
 * - totalCycleDuration: total time for a complete cycle in ms (default: 4000ms = 4 seconds)
 * - frameDuration: optional manual hold time per frame (overrides totalCycleDuration / sequence length)
 * - badge: optional corner badge
 * - fallbackLabel: label if images don't exist
 * - folderPath: path for placeholder fallback
 */
export default function ModelRotator({
  category = 'sherwani',
  swingSequence = [0, 45, 90, 135, 180, 225, 270, 315, 0],
  totalCycleDuration = 4000,
  frameDuration = null,
  className = '',
  aspectRatio = 'aspect-[3/4]',
  badge = null,
  fallbackLabel = '[Garment 3D Model]',
  folderPath = ''
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasLoadedImages, setHasLoadedImages] = useState(true);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // Compute duration per frame to ensure exact 4-second full cycle
  const effectiveFrameDuration = frameDuration || Math.round(totalCycleDuration / swingSequence.length);

  // All unique angle frames needed for preloading
  const uniqueAngles = Array.from(new Set(swingSequence));

  // Current active angle degree
  const currentAngle = swingSequence[currentStepIndex] ?? 0;

  // Detect touch / mobile
  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768;
      setIsMobile(isTouch);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload all angle images in advance to prevent flicker
  useEffect(() => {
    let isMounted = true;
    const cat = category.toLowerCase();
    let loadedCount = 0;
    const totalToLoad = uniqueAngles.length;

    uniqueAngles.forEach((angle) => {
      const img = new Image();
      img.src = `/models/${cat}/${cat}-${angle}.png`;
      img.onload = () => {
        loadedCount++;
        if (isMounted && loadedCount === totalToLoad) {
          setImagesPreloaded(true);
        }
      };
      img.onerror = () => {
        if (angle === 0 && isMounted) {
          setHasLoadedImages(false);
        }
      };
    });

    return () => {
      isMounted = false;
    };
  }, [category]);

  // Rotation animation interval logic (Runs on hover for desktop, or continuously for mobile when in view)
  const shouldAnimate = isHovered || isMobile;

  useEffect(() => {
    if (shouldAnimate) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % swingSequence.length);
      }, effectiveFrameDuration);
    } else {
      // Smoothly return to front 0-degree view when hover stops
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentStepIndex(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [shouldAnimate, swingSequence.length, effectiveFrameDuration]);

  // If images failed to load, fallback to standard placeholder
  if (!hasLoadedImages) {
    return (
      <PlaceholderBox
        label={fallbackLabel}
        aspectRatio={aspectRatio}
        className={className}
        folderPath={folderPath}
        badge={badge}
      />
    );
  }

  const cat = category.toLowerCase();

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden bg-[#ECE6DC] ${aspectRatio} select-none group cursor-pointer border border-[#D5C8B5] transition-all duration-500 ${className}`}
    >
      {/* Background Soft Studio Ambient Vignette */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(251,246,236,0.85)_0%,_rgba(224,214,200,0.65)_70%,_rgba(197,185,169,0.9)_100%)]" />

      {/* Decorative Inner Luxury Framing */}
      <div className="absolute inset-2.5 border border-[#A9812F]/25 pointer-events-none z-20" />

      {/* ==================== PURE CSS CIRCULAR PEDESTAL / BASE ==================== */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center">
        {/* Outer Shadow Ellipse */}
        <div className="w-48 sm:w-56 h-6 rounded-[50%] bg-black/25 blur-[6px] transform translate-y-2" />

        {/* Main Circular Metallic Pedestal Base */}
        <div
          className="w-44 sm:w-52 h-8 rounded-[50%] -mt-4 border border-[#A9812F]/60 shadow-[inset_0_2px_6px_rgba(255,255,255,0.7),0_8px_16px_rgba(43,33,29,0.35)]"
          style={{
            background: 'radial-gradient(ellipse at center, #F4ECE1 0%, #D8C29D 45%, #8F6B24 85%, #573E14 100%)'
          }}
        >
          {/* Inner Ring Glow */}
          <div className="w-[85%] h-[65%] mx-auto mt-[4px] rounded-[50%] border border-[#FBF6EC]/80 bg-gradient-to-b from-[#FFFDF9]/40 to-transparent" />
        </div>
      </div>

      {/* ==================== STACKED CROSSFADE IMAGES ==================== */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-2 pb-6">
        {uniqueAngles.map((angle) => {
          const isActive = currentAngle === angle;
          const imageSrc = `/models/${cat}/${cat}-${angle}.png`;

          return (
            <img
              key={angle}
              src={imageSrc}
              alt={`${category} 3D Model ${angle} degrees`}
              className={`absolute inset-0 w-full h-full object-contain p-2 pb-6 transition-opacity duration-300 ease-in-out pointer-events-none ${
                isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-[0.99]'
              }`}
              style={{
                filter: 'drop-shadow(0 12px 18px rgba(43, 33, 29, 0.22))'
              }}
              draggable={false}
            />
          );
        })}
      </div>

      {/* Bottom Floating Hover Hint Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="px-3 py-1 bg-[#1C080B]/85 backdrop-blur-sm text-[#FBF6EC] text-[10px] uppercase tracking-widest rounded-full border border-[#A9812F]/40 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
          <Sparkles className="w-2.5 h-2.5 text-[#C5A869]" />
          <span>360° Rotating View</span>
        </span>
      </div>
    </div>
  );
}
