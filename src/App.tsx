import { useState, useEffect } from 'react';
import { CyberGrid } from './components/3d/CyberGrid';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import type { CartItem } from './components/cart/CartDrawer';
import { Carousel } from './components/ui/Carousel';
import { PromoCarousel } from './components/ui/PromoCarousel';
import { ProductCard } from './components/ui/ProductCard';
import type { Product } from './components/ui/ProductCard';
import { mockProducts } from './data/products';
import { mockOffers, type Offer } from './data/offers';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  Zap, 
  Activity, 
  Flame, 
  Dumbbell, 
  Sliders, 
  LayoutGrid, 
  Compass, 
  Target,
  Lock,
  Loader2,
  Sparkles
} from 'lucide-react';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAdminPath, setIsAdminPath] = useState<boolean>(window.location.pathname === '/admin');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Handle URL path changes for SPA routing
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminPath(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handleLocationChange);
    
    // Check if auth session exists
    const checkSession = async () => {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAdminAuthenticated(true);
          setAdminEmail(session.user.email || 'admin@champions.com');
        }
      }
    };
    checkSession();

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Handle cursor glow movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch db data
  const fetchProducts = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          const mapped: Product[] = data.map(p => ({
            id: p.id,
            name: p.title,
            description: p.description,
            price: p.price,
            rating: p.rating || 4.8,
            category: p.category || 'Running',
            image: p.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            stockCount: p.stock ?? 0,
            specs: p.specifications || [],
            isNewArrival: !!p.new_arrival
          }));
          setProducts(mapped);
        } else {
          setProducts(mockProducts);
        }
      } catch (err) {
        setProducts(mockProducts);
      }
    } else {
      setProducts(mockProducts);
    }
  };

  const fetchOffers = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          const mapped: Offer[] = data.map(o => ({
            id: o.id,
            title: o.title,
            description: o.description,
            discount: o.offer_value,
            code: o.coupon_code,
            appliesTo: o.appliesTo || 'ALL SECTORS',
            gradientClass: o.gradientClass || 'from-[#10b981] to-teal-400',
            accentColor: o.accentColor || '#10b981',
            glowClass: o.glowClass || 'shadow-[#10b981]/20',
            iconName: o.iconName || 'Zap',
            image: o.banner_image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
            active: o.active,
            terms_conditions: o.terms_conditions,
            expiry_date: o.expiry_date
          }));
          setOffers(mapped);
        } else {
          setOffers(mockOffers);
        }
      } catch (err) {
        setOffers(mockOffers);
      }
    } else {
      setOffers(mockOffers);
    }
  };

  const fetchOrders = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data) {
          setOrders(data);
        }
      } catch (err) {
        console.warn('Orders selective fetch failed:', err);
      }
    }
  };

  // Sync databases and hook Realtime subscriptions
  useEffect(() => {
    fetchProducts();
    fetchOffers();
    fetchOrders();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('public-db-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          fetchProducts();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, () => {
          fetchOffers();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          fetchOrders();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      if (error) {
        alert('Authentication Denied: ' + error.message);
      } else if (data?.user) {
        setIsAdminAuthenticated(true);
        setAdminEmail(data.user.email || 'admin@champions.com');
      }
    } else {
      // Local passcode gate
      if (loginEmail === 'admin@champions.com' && loginPassword === 'champions') {
        setIsAdminAuthenticated(true);
        setAdminEmail('admin@champions.com');
      } else {
        alert('Access Denied! Standard passcode fallback: admin@champions.com / champions');
      }
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAdminAuthenticated(false);
    setAdminEmail('');
  };

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

  // Checkout order placement log mutation
  const handleCheckout = async (
    discountAmount: number = 0,
    appliedCouponCode?: string,
    address?: {
      fullName: string;
      contactNumber: string;
      completeAddress: string;
      pinCode: string;
    }
  ) => {
    const customerName = address?.fullName || 'Guest Athlete';
    const phone = address?.contactNumber || '+91 99999 99999';

    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shipping = subtotal > 1999 ? 0 : 150;
    const totalAmount = Math.max(0, subtotal + shipping - discountAmount);
    
    const newOrderPayload: any = {
      customer_name: customerName,
      phone: phone,
      products: cartItems.map(item => ({
        product: { id: item.product.id, name: item.product.name, price: item.product.price },
        quantity: item.quantity
      })),
      total_amount: totalAmount,
      discount_amount: discountAmount,
      applied_coupon: appliedCouponCode || null,
      complete_address: address?.completeAddress || null,
      pin_code: address?.pinCode || null,
      payment_method: 'UPI Cyberpay',
      status: 'pending'
    };

    if (isSupabaseConfigured) {
      let { error } = await supabase.from('orders').insert([newOrderPayload]);
      
      // Fallback: If DB does not contain the new schema columns (complete_address, pin_code, discount_amount, applied_coupon)
      if (error && error.message && error.message.toLowerCase().includes('column') && error.message.toLowerCase().includes('does not exist')) {
        console.warn('Supabase schema does not have the custom coupon/address columns. Retrying with metadata in products/payment_method.');
        
        const fallbackPayload = {
          customer_name: customerName,
          phone: phone,
          products: [
            ...cartItems.map(item => ({
              product: { id: item.product.id, name: item.product.name, price: item.product.price },
              quantity: item.quantity
            })),
            {
              is_metadata: true,
              complete_address: address?.completeAddress || null,
              pin_code: address?.pinCode || null,
              discount_amount: discountAmount,
              applied_coupon: appliedCouponCode || null
            } as any
          ],
          total_amount: totalAmount,
          payment_method: `UPI Cyberpay | Address: ${address?.completeAddress || 'N/A'}, PIN: ${address?.pinCode || 'N/A'}, Coupon: ${appliedCouponCode || 'None'}, Discount: ₹${discountAmount}`,
          status: 'pending'
        };
        
        const retryResult = await supabase.from('orders').insert([fallbackPayload]);
        error = retryResult.error;
      }

      if (error) {
        alert('Checkout sync failed: ' + error.message);
      } else {
        alert('ORDER SECURED! Syncing dispatcher database.');
        setCartItems([]);
        setIsCartOpen(false);
      }
    } else {
      alert('SIMULATED CHECKOUT AUTHORIZED! Mock order logged in active logs.');
      setOrders(prev => [
        {
          id: 'ord-' + Math.floor(Math.random() * 100000),
          customer_name: customerName,
          phone: phone,
          products: newOrderPayload.products,
          total_amount: totalAmount,
          discount_amount: discountAmount,
          applied_coupon: appliedCouponCode || null,
          complete_address: address?.completeAddress || null,
          pin_code: address?.pinCode || null,
          status: 'pending',
          created_at: new Date().toISOString()
        },
        ...prev
      ]);
      setCartItems([]);
      setIsCartOpen(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const categories = [
    { name: 'All', icon: <LayoutGrid className="w-5 h-5" />, color: 'from-neon-cyan to-neon-blue', textGlow: 'glow-text-cyan' },
    { name: 'Gym Equipment', icon: <Dumbbell className="w-5 h-5" />, color: 'from-neon-purple to-indigo-600', textGlow: 'glow-text-purple' },
    { name: 'Football', icon: <Compass className="w-5 h-5" />, color: 'from-neon-cyan to-teal-500', textGlow: 'glow-text-cyan' },
    { name: 'Basketball', icon: <Target className="w-5 h-5" />, color: 'from-orange-500 to-amber-500', textGlow: 'glow-text-cyan' },
    { name: 'Cricket', icon: <Flame className="w-5 h-5" />, color: 'from-rose-500 to-red-600', textGlow: 'glow-text-purple' },
    { name: 'Running', icon: <Zap className="w-5 h-5" />, color: 'from-neon-lime to-emerald-500', textGlow: 'glow-text-cyan' },
    { name: 'Yoga', icon: <Activity className="w-5 h-5" />, color: 'from-pink-500 to-rose-500', textGlow: 'glow-text-purple' },
  ];

  const scrollToShop = () => {
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // -------------------------------------------------------------
  // ADMIN DASHBOARD SCREEN ROUTER RENDERING
  // -------------------------------------------------------------
  if (isAdminPath) {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-6 relative select-none selection:bg-amber-500/20 selection:text-amber-400 overflow-hidden">
          {/* Cyber Background overlay layer */}
          <CyberGrid />

          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_40%,#1e1b4b,transparent)] pointer-events-none opacity-60" />

          {/* Secure Login glassmorphic card container */}
          <div className="relative w-full max-w-md p-8 rounded-2xl glass-panel border border-white/5 bg-slate-950/80 shadow-2xl relative z-10 overflow-hidden">
            
            {/* Ambient orange light behind lock */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-20 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center mb-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
              <h1 className="font-orbitron font-extrabold text-lg text-white uppercase tracking-widest">
                MAINFRAME LOCK
              </h1>
              <p className="font-space text-[10px] text-slate-500 mt-1.5 tracking-widest uppercase">
                Champions Admin portal authorization
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5 font-space text-xs">
              
              {/* Email */}
              <div className="space-y-2">
                <label className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">CONSOLE SECURE USERNAME</label>
                <input 
                  type="email" 
                  required
                  placeholder="admin@champions.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-3 text-white focus:outline-hidden placeholder-slate-600"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">CONSOLE PASSCODE ACCESS</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-3 text-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-orange-500/10 text-slate-950 font-orbitron font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-950" />
                      <span>DECRYPTING KEYS...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5 text-slate-950" />
                      <span>SECURE LOG IN</span>
                    </>
                  )}
                </button>
              </div>

              {/* Graceful tip warning */}
              <div className="p-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-500 text-[10px] leading-relaxed text-center">
                Local offline access: Use <code className="text-amber-500 font-bold">admin@champions.com</code> with passcode <code className="text-amber-500 font-bold">champions</code>.
              </div>

            </form>
          </div>
        </div>
      );
    }

    return (
      <AdminDashboard 
        products={products}
        offers={offers}
        orders={orders}
        onRefreshProducts={fetchProducts}
        onRefreshOffers={fetchOffers}
        onRefreshOrders={fetchOrders}
        onLogout={handleLogout}
        userEmail={adminEmail}
      />
    );
  }

  // -------------------------------------------------------------
  // STOREFRONT PUBLIC SCREEN RENDERING
  // -------------------------------------------------------------
  return (
    <div className="relative min-h-screen selection:bg-[#10b981]/30 select-none pb-12 overflow-x-hidden">
      
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

      {/* Cybernetic Promo Carousel for Ongoing Campaigns & Discounts */}
      <PromoCarousel offers={offers} />

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
                    : 'glass-panel border-white/5 text-slate-350 hover:border-[#10b981]/30 hover:scale-102 hover:shadow-md'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#10b981] to-teal-400 opacity-15 animate-pulse" />
                )}
                
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
          products={products.filter(p => p.isNewArrival && p.stockCount > 0)} 
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
        <Carousel products={products.filter(p => p.stockCount > 0)} onAddToCart={handleAddToCart} />
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
        offers={offers}
      />

      {/* Cybernetic Footer */}
      <Footer />
    </div>
  );
}

export default App;
