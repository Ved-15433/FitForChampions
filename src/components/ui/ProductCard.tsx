import React from 'react';
import { Star, ShoppingCart, ShieldAlert } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  stockCount: number;
  specs?: string[];
  isNewArrival?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isAvailable = product.stockCount > 0;

  // Custom 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Rotate card on both axis (max 15 degrees) and scale up slightly
    card.style.transform = `perspective(1000px) rotateX(${(-y / box.height) * 12}deg) rotateY(${(x / box.width) * 12}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Dynamic lighting shine reflection overlay
    const glow = card.querySelector('.shine-overlay') as HTMLDivElement;
    if (glow) {
      const px = (e.clientX - box.left) / box.width * 100;
      const py = (e.clientY - box.top) / box.height * 100;
      glow.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(16, 185, 129, 0.12) 0%, rgba(255, 255, 255, 0) 60%)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    
    const glow = card.querySelector('.shine-overlay') as HTMLDivElement;
    if (glow) {
      glow.style.background = 'transparent';
    }
  };

  return (
    <div 
      className="relative flex flex-col h-full rounded-2xl glass-card border-neon-hover p-5 cursor-pointer select-none group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (isAvailable) onAddToCart(product);
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Shine lighting reflection layer */}
      <div className="shine-overlay absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 z-10" />

      {/* New Arrival Badge */}
      {product.isNewArrival && (
        <div className="absolute top-4 left-4 z-20" style={{ transform: 'translateZ(20px)' }}>
          <span className="text-[10px] font-orbitron font-extrabold uppercase px-2.5 py-1 rounded-full bg-linear-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border border-amber-500/20 shadow-xs shadow-amber-500/5 animate-pulse">
            ⚡ NEW ARRIVAL
          </span>
        </div>
      )}

      {/* Stock Status Badge */}
      <div className="absolute top-4 right-4 z-20" style={{ transform: 'translateZ(20px)' }}>
        {isAvailable ? (
          <span className="text-[10px] font-orbitron font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#10b981] border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
            Gear Active
          </span>
        ) : (
          <span className="text-[10px] font-orbitron font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm shadow-rose-500/5 animate-pulse flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Out of Stock
          </span>
        )}
      </div>

      {/* Product Image Viewer Container */}
      <div 
        className="relative w-full h-48 rounded-xl bg-linear-to-b from-slate-900 to-zinc-950 flex items-center justify-center overflow-hidden mb-5 border border-white/5 group-hover:border-[#10b981]/30 duration-300"
        style={{ transform: 'translateZ(10px)' }}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="max-h-36 w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 filter drop-shadow-lg" 
        />
        
        {/* Glow effect behind image */}
        <div className="absolute w-24 h-24 bg-[#10b981]/5 rounded-full blur-xl group-hover:bg-[#10b981]/15 transition-all duration-500" />
      </div>

      {/* Product Category and Rating */}
      <div className="flex items-center justify-between mb-2" style={{ transform: 'translateZ(15px)' }}>
        <span className="font-space text-xs font-semibold uppercase text-slate-400 tracking-wider">
          {product.category}
        </span>
        <div className="flex items-center space-x-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-orbitron font-bold text-xs text-slate-300">
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Product Name */}
      <h3 
        className="font-orbitron font-bold text-base text-white tracking-tight mb-2 group-hover:text-[#10b981] transition-colors"
        style={{ transform: 'translateZ(20px)' }}
      >
        {product.name}
      </h3>

      {/* Product Description */}
      <p 
        className="font-outfit text-xs text-slate-400 leading-relaxed mb-4 flex-grow"
        style={{ transform: 'translateZ(10px)' }}
      >
        {product.description}
      </p>

      {/* Spec list bullets if present */}
      {product.specs && product.specs.length > 0 && (
        <div 
          className="hidden group-hover:flex flex-wrap gap-1.5 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ transform: 'translateZ(15px)' }}
        >
          {product.specs.slice(0, 2).map((spec, idx) => (
            <span key={idx} className="text-[10px] font-space bg-slate-900/60 text-slate-350 px-2 py-0.5 rounded border border-white/5">
              {spec}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/5 mb-4" />

      {/* Price & Add to Cart Action */}
      <div className="flex items-center justify-between" style={{ transform: 'translateZ(25px)' }}>
        <div className="flex flex-col">
          <span className="text-[10px] font-space text-slate-400 font-semibold uppercase tracking-wider">
            Invest
          </span>
          <span className="font-orbitron font-black text-lg text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isAvailable) onAddToCart(product);
          }}
          disabled={!isAvailable}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-orbitron text-xs font-bold transition-all duration-300 shadow-md cursor-pointer ${
            isAvailable
              ? 'bg-linear-to-r from-[#10b981] to-teal-500 text-slate-950 hover:shadow-[#10b981]/20 hover:scale-105 active:scale-95 font-extrabold'
              : 'bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{isAvailable ? 'ADD TO CART' : 'LOCKED'}</span>
        </button>
      </div>
    </div>
  );
};
