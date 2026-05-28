import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, Copy, Check } from 'lucide-react';
import { type Offer, iconMap, mockOffers } from '../../data/offers';

interface PromoCarouselProps {
  offers?: Offer[];
}

export const PromoCarousel: React.FC<PromoCarouselProps> = ({ offers = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fallback to static mockOffers if prop is empty
  const activeOffers = offers.length > 0 ? offers.filter(o => o.active !== false) : mockOffers;

  useEffect(() => {
    if (containerRef.current) {
      setScrollWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth);
    }
  }, [activeOffers]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 380; // Card width + gap
      const newScroll = 
        direction === 'left' 
          ? Math.max(0, containerRef.current.scrollLeft - scrollAmount)
          : Math.min(scrollWidth + 500, containerRef.current.scrollLeft + scrollAmount);
      
      containerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
      setCurrentScroll(newScroll);
    }
  };

  const handleScrollEvent = () => {
    if (containerRef.current) {
      setCurrentScroll(containerRef.current.scrollLeft);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const progress = scrollWidth > 0 ? (currentScroll / scrollWidth) * 100 : 0;

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 scroll-mt-24">
      {/* Title Header with Glowing Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg border border-amber-500/20 bg-amber-500/10 flex items-center justify-center">
            <Tag className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="font-space text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-400 uppercase tracking-widest">
              Exclusive Active Campaigns
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl md:text-3xl text-white tracking-tight">
              ONGOING OFFERS & PROMOS
            </h2>
          </div>
        </div>

        {/* Custom Holographic Arrows */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => scroll('left')}
            disabled={currentScroll <= 5}
            className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
              currentScroll <= 5
                ? 'border-white/5 text-slate-700 cursor-not-allowed'
                : 'border-white/10 hover:border-amber-400 hover:bg-amber-400/5 text-slate-350'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            disabled={currentScroll >= scrollWidth - 5}
            className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
              currentScroll >= scrollWidth - 5
                ? 'border-white/5 text-slate-700 cursor-not-allowed'
                : 'border-white/10 hover:border-amber-400 hover:bg-amber-400/5 text-slate-350'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div 
        ref={containerRef}
        onScroll={handleScrollEvent}
        className="w-full flex overflow-x-auto scrollbar-none space-x-6 pb-6 pt-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {activeOffers.map((offer) => {
          const isCopied = copiedId === offer.id;
          const activeIcon = iconMap[offer.iconName] || <Tag className="w-4 h-4 text-amber-400" />;
          return (
            <div 
              key={offer.id} 
              className="w-[340px] md:w-[380px] shrink-0 snap-start relative group"
            >
              {/* Glowing ticket background decoration */}
              <div className={`absolute -inset-0.5 rounded-2xl bg-linear-to-r ${offer.gradientClass} opacity-10 group-hover:opacity-20 blur-lg transition duration-500`} />
              
              {/* Ticket Container */}
              <div className="relative flex flex-col h-[265px] rounded-2xl glass-panel border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden">
                
                {/* Semi-circular ticket tear-notch (Left) */}
                <div className="absolute top-[185px] -left-3.5 w-7 h-7 rounded-full bg-[#030712] border-r border-white/5 z-20 -translate-y-1/2" />
                {/* Semi-circular ticket tear-notch (Right) */}
                <div className="absolute top-[185px] -right-3.5 w-7 h-7 rounded-full bg-[#030712] border-l border-white/5 z-20 -translate-y-1/2" />

                {/* Ticket Top Half (Full bleed Cover Image with Translucent overlay) */}
                <div className="relative h-[185px] w-full overflow-hidden">
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-110" 
                  />
                  {/* Glowing dynamic overlay gradient to merge with backplane and clear typography */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#030712] via-[#030712]/30 to-black/55 z-10" />

                  {/* Left HUD category tag */}
                  <div className="absolute top-4 left-5 z-20">
                    <span className="text-[9px] font-space font-extrabold uppercase tracking-widest text-slate-100 bg-[#030712]/85 backdrop-blur-xs border border-white/10 px-2.5 py-0.5 rounded shadow-sm">
                      {offer.appliesTo}
                    </span>
                  </div>

                  {/* Right HUD floating badge */}
                  <div className="absolute top-4 right-5 z-20 w-8 h-8 rounded-lg bg-[#030712]/85 backdrop-blur-xs border border-white/10 flex items-center justify-center shadow-sm">
                    {activeIcon}
                  </div>

                  {/* Bottom Text Overlays */}
                  <div className="absolute bottom-3.5 left-5 right-5 z-20">
                    <h3 className={`font-orbitron font-extrabold text-sm text-transparent bg-clip-text bg-linear-to-r ${offer.gradientClass} uppercase tracking-tight`}>
                      {offer.title}
                    </h3>
                    <p className="font-outfit text-[10.5px] text-slate-350 leading-relaxed mt-1 line-clamp-2 pr-1">
                      {offer.description}
                    </p>
                  </div>
                </div>

                {/* Cyber Dashed Separator Line */}
                <div className="relative w-full h-[1px]">
                  <div className="absolute left-4 right-4 h-full border-t border-dashed border-white/10 z-10" />
                </div>

                {/* Ticket Bottom Half */}
                <div className="p-5 pt-3.5 pb-4.5 bg-slate-900/30 flex items-center justify-between flex-grow">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-space text-slate-400 font-semibold uppercase tracking-wider">
                      Promo Discount
                    </span>
                    <span className={`font-orbitron font-black text-xl text-transparent bg-clip-text bg-linear-to-r ${offer.gradientClass}`}>
                      {offer.discount}
                    </span>
                  </div>

                  {/* Interactive Holographic Copy Ticket Code */}
                  <button
                    onClick={() => handleCopyCode(offer.code, offer.id)}
                    className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-orbitron text-xs font-bold transition-all duration-300 shadow-md cursor-pointer border ${
                      isCopied
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-[#10b981]'
                        : 'bg-slate-950/60 hover:bg-[#030712] border-white/5 hover:border-amber-400/40 text-slate-300'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isCopied ? (
                        <motion.span
                          key="copied"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center space-x-1.5 font-bold tracking-widest text-[#10b981]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>COPIED</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center space-x-1.5"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                          <span className="font-extrabold tracking-widest">{offer.code}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Glowing Neon Progress Gauge */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2 relative">
        <motion.div 
          className="h-full bg-linear-to-r from-amber-500 to-orange-400"
          style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
};

