import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, RotateCcw, Crosshair, Move, Maximize2 } from 'lucide-react';
import PlaceholderBox from './PlaceholderBox';

/**
 * ZoomableImage
 *
 * Behavior:
 * 1. Default State: Normal page scrolling is 100% free and never intercepted.
 * 2. Double-Click / Tap: Activates Interactive Zoom Mode (2.4x).
 * 3. In Zoom Mode:
 *    - Click & Drag with mouse/touch to freely pan in all directions.
 *    - 2-finger wheel/pinch to zoom in/out further (1.5x - 4x).
 *    - Double-Click again OR click "Full View" button to exit zoom mode and return to normal page scrolling.
 * 4. Accessory Selection: Focuses on accessory coordinate with a 1.5s indicator.
 */
export default function ZoomableImage({
  product,
  activeAccessory = null,
  onResetZoom = () => {}
}) {
  const [manualZoom, setManualZoom] = useState(1);
  const [manualOrigin, setManualOrigin] = useState({ x: 50, y: 50 });
  const [showIndicator, setShowIndicator] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, originX: 50, originY: 50 });
  const touchPinchRef = useRef({ initialDist: 0, initialZoom: 1 });
  const indicatorTimerRef = useRef(null);

  // Determine current active origin & scale
  const isAccessoryActive = Boolean(activeAccessory && activeAccessory.zoomOrigin);
  const originX = isAccessoryActive ? activeAccessory.zoomOrigin.x : manualOrigin.x;
  const originY = isAccessoryActive ? activeAccessory.zoomOrigin.y : manualOrigin.y;
  const scale = isAccessoryActive ? (activeAccessory.zoomOrigin.scale || 2.4) : manualZoom;

  const isZoomModeActive = scale > 1 || isAccessoryActive;

  // Auto-hide indicator after 1.5 seconds when an accessory is chosen
  useEffect(() => {
    if (isAccessoryActive) {
      setShowIndicator(true);
      if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current);
      indicatorTimerRef.current = setTimeout(() => {
        setShowIndicator(false);
      }, 1500);
    } else {
      setShowIndicator(false);
      if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current);
    }

    return () => {
      if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current);
    };
  }, [activeAccessory, isAccessoryActive]);

  // Wheel zoom ONLY active when already in Zoom Mode (so regular page scroll is NEVER stuck)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // If NOT in zoom mode, allow completely normal page scrolling!
      if (manualZoom <= 1 && !isAccessoryActive) {
        return;
      }

      // If IN zoom mode, adjust zoom level smoothly
      e.preventDefault();
      const zoomFactor = e.ctrlKey ? 0.05 : 0.15;
      const delta = e.deltaY < 0 ? zoomFactor : -zoomFactor;

      setManualZoom((prevZoom) => {
        const nextZoom = Math.min(Math.max(1, Number((prevZoom + delta).toFixed(2))), 4.0);
        if (nextZoom === 1) {
          setManualOrigin({ x: 50, y: 50 });
        }
        return nextZoom;
      });

      if (isAccessoryActive) {
        onResetZoom();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [manualZoom, isAccessoryActive, onResetZoom]);

  // Double-Click Handler: Toggle Zoom Mode On/Off
  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAccessoryActive) {
      onResetZoom();
      setManualZoom(1);
      setManualOrigin({ x: 50, y: 50 });
      return;
    }

    if (manualZoom > 1) {
      // Zoom out & exit zoom mode
      setManualZoom(1);
      setManualOrigin({ x: 50, y: 50 });
    } else {
      // Enter zoom mode centered around double-click point
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setManualZoom(2.4);
      setManualOrigin({
        x: Math.min(Math.max(10, x), 90),
        y: Math.min(Math.max(10, y), 90)
      });
    }
  };

  // Mouse Drag / Pan Handlers (Only active when in Zoom Mode)
  const handleMouseDown = (e) => {
    if (!isZoomModeActive) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      originX,
      originY
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current || !isZoomModeActive) return;

    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;

    const rect = containerRef.current.getBoundingClientRect();
    const percentX = (dx / (rect.width * scale)) * 100;
    const percentY = (dy / (rect.height * scale)) * 100;

    const newX = Math.min(Math.max(5, dragStartRef.current.originX - percentX), 95);
    const newY = Math.min(Math.max(5, dragStartRef.current.originY - percentY), 95);

    setManualOrigin({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile / tablet
  const handleTouchStart = (e) => {
    if (!isZoomModeActive) return;

    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      touchPinchRef.current = { initialDist: dist, initialZoom: manualZoom };
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        mouseX: e.touches[0].clientX,
        mouseY: e.touches[0].clientY,
        originX,
        originY
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isZoomModeActive) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const ratio = dist / touchPinchRef.current.initialDist;
      const newZoom = Math.min(Math.max(1, touchPinchRef.current.initialZoom * ratio), 4.0);
      setManualZoom(newZoom);
    } else if (e.touches.length === 1 && isDragging && containerRef.current) {
      const dx = e.touches[0].clientX - dragStartRef.current.mouseX;
      const dy = e.touches[0].clientY - dragStartRef.current.mouseY;

      const rect = containerRef.current.getBoundingClientRect();
      const percentX = (dx / (rect.width * scale)) * 100;
      const percentY = (dy / (rect.height * scale)) * 100;

      const newX = Math.min(Math.max(5, dragStartRef.current.originX - percentX), 95);
      const newY = Math.min(Math.max(5, dragStartRef.current.originY - percentY), 95);

      setManualOrigin({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Exit Zoom & Return to Normal
  const handleExitZoom = (e) => {
    e?.stopPropagation();
    setManualZoom(1);
    setManualOrigin({ x: 50, y: 50 });
    setShowIndicator(false);
    setIsDragging(false);
    onResetZoom();
  };

  return (
    <div className="relative flex flex-col bg-[#F4ECE1] border border-[#E5D9C5] shadow-luxury p-2 group max-w-md mx-auto select-none">
      {/* Main Image Viewport */}
      <div
        ref={containerRef}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative overflow-hidden aspect-[2/3] max-h-[580px] w-full bg-[#EAE2D5] border border-[#D8CEBF] ${
          isZoomModeActive
            ? (isDragging ? 'cursor-grabbing' : 'cursor-grab')
            : 'cursor-zoom-in'
        }`}
        title={isZoomModeActive ? 'Double-click to exit zoom mode • Drag to move' : 'Double-click to activate zoom mode'}
      >
        {/* Floating Controls when Zoom Mode is Active */}
        {isZoomModeActive && (
          <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2B211D]/85 text-[#FBF6EC] backdrop-blur-sm rounded text-[10px] uppercase font-mono tracking-wider shadow">
              <Move className="w-3 h-3 text-[#C5A869]" />
              <span>Zoom Mode • Drag to Move</span>
            </div>

            <button
              onClick={handleExitZoom}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 bg-[#5C1A21] hover:bg-[#461319] text-[#FBF6EC] rounded text-[11px] font-medium shadow-md transition-all uppercase tracking-wider cursor-pointer border border-[#A9812F]/50"
              title="Double-click image or click here to exit zoom"
            >
              <RotateCcw className="w-3 h-3 text-[#C5A869]" />
              <span>Exit Zoom</span>
            </button>
          </div>
        )}

        {/* The Scalable Canvas Container */}
        <div
          className="w-full h-full origin-center pointer-events-none"
          style={{
            transformOrigin: `${originX}% ${originY}%`,
            transform: `scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          <PlaceholderBox
            label={product.placeholderLabel || `[${product.title}]`}
            realImageUrl={product.realImageUrl}
            folderPath={product.folderPath}
            aspectRatio="aspect-auto h-full w-full"
            className="w-full h-full !border-0"
            badge={product.category}
            objectFit="contain"
          />
        </div>

        {/* Focus Target Indicator Crosshair - Auto-hides after 1.5 seconds */}
        {isZoomModeActive && (
          <div
            className={`absolute pointer-events-none transition-all duration-500 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20 ${
              showIndicator ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ left: `${originX}%`, top: `${originY}%` }}
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#A9812F] shadow-gold-glow animate-ping opacity-60" />
            <div className="w-6 h-6 rounded-full border-2 border-[#5C1A21] bg-[#FBF6EC]/90 flex items-center justify-center shadow-md">
              <Crosshair className="w-3.5 h-3.5 text-[#5C1A21]" />
            </div>
            {isAccessoryActive && (
              <span className="mt-1 px-2.5 py-0.5 bg-[#5C1A21] text-[#FBF6EC] text-[10px] uppercase font-bold tracking-widest shadow-md rounded whitespace-nowrap">
                {activeAccessory.name}
              </span>
            )}
          </div>
        )}

        {/* Default Help Tooltip */}
        {!isZoomModeActive && (
          <div className="absolute bottom-2.5 right-2.5 bg-[#2B211D]/80 backdrop-blur-sm text-[#FBF6EC] text-[10px] px-2.5 py-1 rounded flex items-center gap-1.5 pointer-events-none opacity-90 transition-opacity">
            <Maximize2 className="w-3 h-3 text-[#C5A869]" />
            <span>Double-click to activate zoom</span>
          </div>
        )}
      </div>
    </div>
  );
}
