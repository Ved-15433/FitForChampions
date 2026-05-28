import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from './ProductCard';

interface CarouselProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  title?: string;
  subtitle?: string;
  badgeIcon?: React.ReactNode;
  accentColorClass?: string;
  badgeBorderClass?: string;
  hoverBorderClass?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ 
  products, 
  onAddToCart,
  title = "FEATURED CYBER GEAR",
  subtitle = "High Performance Selection",
  badgeIcon = <Award className="w-4 h-4 text-[#10b981]" />,
  accentColorClass = "from-[#10b981] to-teal-400",
  badgeBorderClass = "border-[#10b981]/20 bg-[#10b981]/10",
  hoverBorderClass = "hover:border-[#10b981] hover:bg-[#10b981]/5"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [currentScroll, setCurrentScroll] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setScrollWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth);
    }
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 340; // Card width + gap
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

  // Determine progress percentage
  const progress = scrollWidth > 0 ? (currentScroll / scrollWidth) * 100 : 0;

  return (
    <div className="relative w-full">
      {/* Title Header with Glowing Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-2">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg ${badgeBorderClass} flex items-center justify-center`}>
            {badgeIcon}
          </div>
          <div>
            <span className={`font-space text-xs font-bold text-transparent bg-clip-text bg-linear-to-r ${accentColorClass} uppercase tracking-widest`}>
              {subtitle}
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl md:text-3xl text-white tracking-tight">
              {title}
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
                : `border-white/10 ${hoverBorderClass} text-slate-300`
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
                : `border-white/10 ${hoverBorderClass} text-slate-300`
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Drag and Track Container */}
      <div 
        ref={containerRef}
        onScroll={handleScrollEvent}
        className="w-full flex overflow-x-auto scrollbar-none space-x-6 pb-6 pt-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-[290px] md:w-[320px] shrink-0 snap-start">
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>

      {/* Glowing Neon Progress Gauge */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2 relative">
        <motion.div 
          className={`h-full bg-linear-to-r ${accentColorClass}`}
          style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
};
