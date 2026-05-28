import { useState, useEffect } from 'react';
import { CyberGrid } from './components/3d/CyberGrid';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import type { CartItem } from './components/cart/CartDrawer';
import { Carousel } from './components/ui/Carousel';
import { ProductCard } from './components/ui/ProductCard';
import type { Product } from './components/ui/ProductCard';
import { mockProducts } from './data/products';
import { 
  Zap, 
  Activity, 
  Flame, 
  Dumbbell, 
  Sliders, 
  LayoutGrid, 
  Compass, 
  Target
} from 'lucide-react';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle cursor glow movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    // Open cart drawer automatically for visual confirmation
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    alert('SECURE LINK INITIATED: Synced checkout terminal simulation. Purchase mock-authorized!');
    setCartItems([]);
    setIsCartOpen(false);
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? mockProducts
      : mockProducts.filter((product) => product.category === selectedCategory);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Custom configuration for categories, matching requested ones + icons
  const categories = [
    { name: 'All', icon: <LayoutGrid className="w-5 h-5" />, color: 'from-neon-cyan to-neon-blue', textGlow: 'glow-text-cyan' },
    { name: 'Gym Equipment', icon: <Dumbbell className="w-5 h-5" />, color: 'from-neon-purple to-indigo-600', textGlow: 'glow-text-purple' },
    { name: 'Football', icon: <Compass className="w-5 h-5" />, color: 'from-neon-cyan to-teal-500', textGlow: 'glow-text-cyan' },
    { name: 'Basketball', icon: <Target className="w-5 h-5" />, color: 'from-orange-500 to-amber-500', textGlow: 'glow-text-cyan' },
    { name: 'Cricket', icon: <Flame className="w-5 h-5" />, color: 'from-rose-500 to-red-600', textGlow: 'glow-text-purple' },
    { name: 'Running', icon: <Zap className="w-5 h-5" />, color: 'from-neon-lime to-emerald-500', textGlow: 'glow-text-cyan' },
    { name: 'Yoga', icon: <Activity className="w-5 h-5" />, color: 'from-pink-500 to-rose-500', textGlow: 'glow-text-purple' },
  ];

  // Scroll to shop helper
  const scrollToShop = () => {
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-neon-cyan/30 select-none pb-12">
      
      {/* Moving 3D Grid + Particles background (ThreeJS Canvas layer) */}
      <CyberGrid />

      {/* Floating active Cursor Glow overlay */}
      <div 
        className="cursor-glow hidden md:block" 
        style={{ 
          left: `${mousePos.x}px`, 
          top: `${mousePos.y}px` 
        }} 
      />

      {/* Translucent Glass Navbar */}
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <header id="home" className="relative pt-44 pb-20 px-6 max-w-5xl mx-auto z-10 flex flex-col items-center text-center justify-center min-h-[85vh]">
        
        {/* Tilted Brand Badge */}
        <div className="inline-flex items-center justify-center px-5 py-2.5 bg-[#091510] border border-[#10b981]/30 rounded-xs transform -skew-x-12 shadow-[0_0_20px_rgba(16,185,129,0.08)] mb-8">
          <div className="transform skew-x-12 flex items-center space-x-2">
            <span className="text-sm">🏆</span>
            <span className="font-space text-[10px] font-bold tracking-widest text-[#10b981] uppercase">
              INDIA'S PREMIER SPORTS BRAND
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] uppercase mb-8 max-w-4xl">
          FIT FOR <br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #10b981' }}>
            CHAMPIONS
          </span> <br />
          <span className="text-[#10b981]">
            ONLY.
          </span>
        </h1>

        {/* Description */}
        <p className="font-outfit text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed mb-12">
          Professional-grade cricket bats, tennis rackets, balls & premium uniforms — crafted for athletes who demand the best.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          <button 
            onClick={scrollToShop}
            className="relative px-8 py-4 bg-[#0a0f0d] text-white font-serif font-bold text-xs tracking-wider uppercase border border-[#10b981]/40 rounded-sm hover:border-[#10b981] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 cursor-pointer"
          >
            <span>🛍️ SHOP NOW</span>
          </button>
          
          <button 
            onClick={() => {
              const catEl = document.getElementById('categories');
              if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative px-8 py-4 bg-[#0a0f0d] text-white font-serif font-bold text-xs tracking-wider uppercase border border-[#10b981]/40 rounded-sm hover:border-[#10b981] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 cursor-pointer"
          >
            <span>EXPLORE CATEGORIES</span>
          </button>
        </div>
      </header>

      {/* Infinite Scrolling Slogan Marquee */}
      <section className="relative z-10 my-10 w-full overflow-hidden py-5 border-y border-white/10 bg-[#091510]/40 backdrop-blur-md shadow-xs">
        <div className="marquee-content flex space-x-12 uppercase font-orbitron text-[10px] md:text-xs font-black tracking-widest text-slate-400">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center space-x-12 shrink-0">
              <span>APEX_GEAR // PRECISION FLOW</span>
              <span className="text-[#10b981] glow-text-cyan">●</span>
              <span>KINETIC OUTPUT OPTIMIZED</span>
              <span className="text-teal-400">●</span>
              <span>ZERO LIMITS // FUTURE ATHLETICS</span>
              <span className="text-[#10b981]">●</span>
            </span>
          ))}
        </div>
      </section>

      {/* Interactive Categories Section */}
      <section id="categories" className="relative z-10 max-w-7xl mx-auto px-6 py-12 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="font-space text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-[#10b981] to-teal-400 uppercase tracking-widest">
            Select Roster
          </span>
          <h2 className="font-orbitron font-extrabold text-3xl text-white uppercase tracking-tight mt-1">
            Browse Gear Domains
          </h2>
          <p className="font-outfit text-xs text-slate-400 mt-2">
            Filter our premium athletic accessories by discipline. Select a channel below to optimize inventory.
          </p>
        </div>

        {/* Circular / Futuristic Category Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`relative flex flex-col items-center justify-center p-5 w-28 h-28 rounded-2xl border transition-all duration-500 cursor-pointer group ${
                  isActive 
                    ? `bg-[#0a1c12] border-[#10b981]/50 text-white shadow-lg shadow-[#10b981]/25 scale-105` 
                    : 'glass-panel border-white/5 text-slate-300 hover:border-[#10b981]/30 hover:scale-102 hover:shadow-md'
                }`}
              >
                {/* Glowing neon ring behind active icon */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#10b981] to-teal-400 opacity-15 animate-pulse" />
                )}
                
                {/* Rotating / Scaling Icon wrapper */}
                <div className={`p-2.5 rounded-xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-linear-to-r from-[#10b981] to-teal-400 text-slate-950' 
                    : 'bg-slate-900/60 text-slate-400 group-hover:bg-[#10b981]/10 group-hover:text-[#10b981] group-hover:rotate-12'
                }`}>
                  {cat.icon}
                </div>

                <span className={`font-space text-[10px] font-bold uppercase tracking-wider mt-3.5 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {cat.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* New Arrivals Carousel Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <Carousel 
          products={mockProducts.filter(p => p.isNewArrival && p.stockCount > 0)} 
          onAddToCart={handleAddToCart}
          title="NEW ARRIVALS INBOUND"
          subtitle="⚡ Real-Time Drops Sector"
          badgeIcon={<Zap className="w-4 h-4 text-orange-400" />}
          accentColorClass="from-orange-500 to-amber-400"
          badgeBorderClass="border-orange-500/20 bg-orange-500/10"
          hoverBorderClass="hover:border-orange-400 hover:bg-orange-500/5"
        />
      </section>

      {/* Featured Products Carousel Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <Carousel products={mockProducts.filter(p => p.stockCount > 0)} onAddToCart={handleAddToCart} />
      </section>

      {/* Product Catalog Showcase Section */}
      <section id="shop" className="relative z-10 max-w-7xl mx-auto px-6 py-16 scroll-mt-24">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-white/10 pb-6">
          <div>
            <span className="font-space text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-[#10b981] to-teal-400 uppercase tracking-widest">
              Core Grid
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl md:text-3xl text-white uppercase tracking-tight mt-1">
              STORE INVENTORY
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0 font-space text-xs text-slate-400 font-medium">
            <Sliders className="w-4 h-4 text-[#10b981]" />
            <span>Showing {filteredProducts.length} accessories in {selectedCategory}</span>
          </div>
        </div>

        {/* Responsive Grid layout */}
        {filteredProducts.length === 0 ? (
          <div className="w-full py-20 text-center glass-panel rounded-2xl border border-dashed border-white/10 bg-black/20">
            <p className="font-orbitron text-slate-500 text-sm font-bold uppercase tracking-wider">
              No products found in this sector.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="h-full animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Translucent sliding Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Cybernetic Footer */}
      <Footer />
    </div>
  );
}

export default App;
