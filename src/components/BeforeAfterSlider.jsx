import React, { useState, useRef, useCallback } from 'react';
import { BEFORE_AFTER_ITEMS } from '../data/servicesData';
import { Sparkles, MoveHorizontal, CheckCircle2 } from 'lucide-react';

export const BeforeAfterSlider = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const activeItem = BEFORE_AFTER_ITEMS[activeItemIndex];

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section id="before-after" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/20">
          Real Transformation
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
          결과로 증명하는 <span className="text-cyan-400">시공 전 & 후 비교</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          슬라이더를 좌우로 드래그하여 놀라운 광택 리플렉션의 변화를 직접 확인해 보세요.
        </p>
      </div>

      {/* Case Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {BEFORE_AFTER_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveItemIndex(idx);
              setSliderPos(50);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeItemIndex === idx
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{item.tag}</span>
            <span className="text-[11px] opacity-75 font-normal">({item.car})</span>
          </button>
        ))}
      </div>

      {/* Interactive Slider Container */}
      <div className="max-w-4xl mx-auto glass-card rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl">
        
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none bg-slate-950 border border-white/10"
        >
          {/* AFTER Image (Full Background) */}
          <img 
            src={activeItem.afterImg} 
            alt="시공 후 (After)"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
          />
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>시공 후 (AFTER)</span>
          </div>

          {/* BEFORE Image (Clipped Overlay) */}
          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            <img 
              src={activeItem.beforeImg} 
              alt="시공 전 (Before)"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
            />
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold backdrop-blur-md shadow-lg">
              <span>시공 전 (BEFORE)</span>
            </div>
          </div>

          {/* Vertical Divider Handle Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Center Handle Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xl border-2 border-white pointer-events-auto hover:scale-110 active:scale-95 transition-transform">
              <MoveHorizontal className="w-5 h-5 font-bold" />
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-slate-300 pointer-events-none border border-white/10 hidden sm:flex items-center gap-1.5">
            <MoveHorizontal className="w-3 h-3 text-cyan-400" />
            <span>핸들을 좌우로 밀어서 비교해보세요</span>
          </div>

        </div>

        {/* Case Info Details */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{activeItem.title}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {activeItem.description}
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 text-xs font-semibold shrink-0 border border-white/5">
            차종: {activeItem.car}
          </span>
        </div>

      </div>

    </section>
  );
};
