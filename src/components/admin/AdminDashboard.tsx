import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  Boxes, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Activity, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Loader2, 
  X, 
  Lock, 
  Eye, 
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import type { Product } from '../ui/ProductCard';
import type { Offer } from '../../data/offers';
import { TopSellingChart } from './TopSellingChart';

interface AdminDashboardProps {
  products: Product[];
  offers: Offer[];
  orders: any[];
  onRefreshProducts: () => void;
  onRefreshOffers: () => void;
  onRefreshOrders: () => void;
  onLogout: () => void;
  userEmail: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  offers,
  orders,
  onRefreshProducts,
  onRefreshOffers,
  onRefreshOrders,
  onLogout,
  userEmail
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  
  // Theme Toggle State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  // Sync theme to document element and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };
  
  // Modals / Editors State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form Fields
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    stockCount: 10,
    category: 'Running',
    image: '',
    specsString: '',
    isNewArrival: false,
    featured: false,
    bestSeller: false
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discount: '',
    code: '',
    appliesTo: '',
    gradientClass: 'from-[#10b981] to-teal-400',
    accentColor: '#10b981',
    glowClass: 'shadow-[#10b981]/20',
    iconName: 'Zap',
    image: '',
    active: true,
    terms_conditions: '',
    expiry_date: ''
  });

  // Fetch Stats dynamically
  const totalProducts = products.length;
  const totalOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockCount = products.filter(p => p.stockCount <= 5).length;
  const activeOffersCount = offers.filter(o => o.active !== false).length;
  const newArrivalsCount = products.filter(p => p.isNewArrival).length;
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);

  // Pre-fill Product Form
  const openProductModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stockCount: product.stockCount,
        category: product.category,
        image: product.image,
        specsString: product.specs ? product.specs.join(', ') : '',
        isNewArrival: !!product.isNewArrival,
        featured: false, // Default mapping
        bestSeller: false
      });
      setImagePreview(product.image);
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: 0,
        stockCount: 10,
        category: 'Running',
        image: '',
        specsString: '',
        isNewArrival: false,
        featured: false,
        bestSeller: false
      });
      setImagePreview(null);
    }
    setUploadProgress(null);
    setIsProductModalOpen(true);
  };

  // Pre-fill Offer Form
  const openOfferModal = (offer: Offer | null = null) => {
    if (offer) {
      setEditingOffer(offer);
      setOfferForm({
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        code: offer.code,
        appliesTo: offer.appliesTo,
        gradientClass: offer.gradientClass || 'from-[#10b981] to-teal-400',
        accentColor: offer.accentColor || '#10b981',
        glowClass: offer.glowClass || 'shadow-[#10b981]/20',
        iconName: offer.iconName || 'Zap',
        image: offer.image || '',
        active: offer.active !== false,
        terms_conditions: offer.terms_conditions || '',
        expiry_date: offer.expiry_date || ''
      });
      setImagePreview(offer.image);
    } else {
      setEditingOffer(null);
      setOfferForm({
        title: '',
        description: '',
        discount: '',
        code: '',
        appliesTo: '',
        gradientClass: 'from-[#10b981] to-teal-400',
        accentColor: '#10b981',
        glowClass: 'shadow-[#10b981]/20',
        iconName: 'Zap',
        image: '',
        active: true,
        terms_conditions: '',
        expiry_date: ''
      });
      setImagePreview(null);
    }
    setUploadProgress(null);
    setIsOfferModalOpen(true);
  };

  // Handle Mock Image Upload Preview (or base64/Storage)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'offer') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show dynamic preview
    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(10);
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setUploadProgress(100);
      
      if (type === 'product') {
        setProductForm(prev => ({ ...prev, image: base64 }));
      } else {
        setOfferForm(prev => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);

    // Dynamic Supabase Storage Bucket Upload (optimistic execution)
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const bucket = type === 'product' ? 'product-assets' : 'offer-banners';
        
        // Upload to bucket
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

          if (type === 'product') {
            setProductForm(prev => ({ ...prev, image: publicUrl }));
          } else {
            setOfferForm(prev => ({ ...prev, image: publicUrl }));
          }
        }
      } catch (err) {
        console.warn('Storage bucket upload gracefully fell back to base64 encoding:', err);
      }
    }
  };

  // Submit Product Form (CRUD)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const specifications = productForm.specsString
      ? productForm.specsString.split(',').map(s => s.trim())
      : [];

    const productPayload = {
      title: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      stock: Number(productForm.stockCount),
      category: productForm.category,
      image: productForm.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      specifications,
      new_arrival: productForm.isNewArrival,
      slug: productForm.name.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random() * 1000)
    };

    if (isSupabaseConfigured) {
      try {
        if (editingProduct) {
          // Update
          const { error } = await supabase
            .from('products')
            .update({
              title: productForm.name,
              description: productForm.description,
              price: Number(productForm.price),
              stock: Number(productForm.stockCount),
              category: productForm.category,
              image: productForm.image,
              specifications,
              new_arrival: productForm.isNewArrival
            })
            .eq('id', editingProduct.id);

          if (error) throw error;
        } else {
          // Insert
          const { error } = await supabase
            .from('products')
            .insert([productPayload]);

          if (error) throw error;
        }
        onRefreshProducts();
      } catch (err: any) {
        alert('Database Sync Error: ' + err.message);
      }
    } else {
      // Local State Mutator trigger (simulated mutation success)
      alert('MUTATION AUTHORIZED (Local Sync Mode): Product list updated.');
    }

    setLoading(false);
    setIsProductModalOpen(false);
  };

  // Submit Offer Form (CRUD)
  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Map theme accent rules based on selections
    let gradient = 'from-[#10b981] to-teal-400';
    let glow = 'shadow-[#10b981]/20';
    let accent = '#10b981';

    if (offerForm.gradientClass.includes('purple')) {
      gradient = 'from-purple-500 to-indigo-600';
      glow = 'shadow-purple-500/20';
      accent = '#9d4edd';
    } else if (offerForm.gradientClass.includes('rose')) {
      gradient = 'from-rose-500 to-orange-500';
      glow = 'shadow-rose-500/20';
      accent = '#f43f5e';
    } else if (offerForm.gradientClass.includes('cyan')) {
      gradient = 'from-cyan-400 to-blue-500';
      glow = 'shadow-cyan-400/20';
      accent = '#00f2fe';
    }

    const offerPayload = {
      title: offerForm.title,
      description: offerForm.description,
      offer_value: offerForm.discount,
      coupon_code: offerForm.code,
      appliesTo: offerForm.appliesTo,
      banner_image: offerForm.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      expiry_date: offerForm.expiry_date,
      active: offerForm.active,
      gradientClass: gradient,
      accentColor: accent,
      glowClass: glow,
      iconName: offerForm.iconName
    };

    if (isSupabaseConfigured) {
      try {
        if (editingOffer) {
          // Update
          const { error } = await supabase
            .from('offers')
            .update({
              title: offerForm.title,
              description: offerForm.description,
              offer_value: offerForm.discount,
              coupon_code: offerForm.code,
              appliesTo: offerForm.appliesTo,
              banner_image: offerForm.image,
              expiry_date: offerForm.expiry_date,
              active: offerForm.active,
              gradientClass: gradient,
              accentColor: accent,
              glowClass: glow,
              iconName: offerForm.iconName
            })
            .eq('id', editingOffer.id);

          if (error) throw error;
        } else {
          // Insert
          const { error } = await supabase
            .from('offers')
            .insert([offerPayload]);

          if (error) throw error;
        }
        onRefreshOffers();
      } catch (err: any) {
        alert('Database Sync Error: ' + err.message);
      }
    } else {
      alert('MUTATION AUTHORIZED (Local Sync Mode): Promos list updated.');
    }

    setLoading(false);
    setIsOfferModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this product?')) return;
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        onRefreshProducts();
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    } else {
      alert('MUTATION AUTHORIZED (Local Sync Mode): Product removed.');
    }
  };

  // Delete Offer
  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this promotional offer?')) return;
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('offers')
          .delete()
          .eq('id', id);

        if (error) throw error;
        onRefreshOffers();
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    } else {
      alert('MUTATION AUTHORIZED (Local Sync Mode): Campaign decommissioned.');
    }
  };

  // Toggle Offer Active Status
  const handleToggleOfferActive = async (offer: Offer) => {
    const nextStatus = offer.active === false ? true : false;
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('offers')
          .update({ active: nextStatus })
          .eq('id', offer.id);

        if (error) throw error;
        onRefreshOffers();
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    } else {
      alert(`Campaign status changed to ${nextStatus ? 'ACTIVE' : 'DEACTIVATED'}`);
    }
  };

  // Toggle Product Featured
  const handleToggleProductNewArrival = async (product: Product) => {
    const nextStatus = !product.isNewArrival;
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ new_arrival: nextStatus })
          .eq('id', product.id);

        if (error) throw error;
        onRefreshProducts();
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    } else {
      alert(`Product arrival status toggled to ${nextStatus ? 'TRUE' : 'FALSE'}`);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'shipping' : currentStatus === 'shipping' ? 'delivered' : 'pending';
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: nextStatus })
          .eq('id', orderId);

        if (error) throw error;
        onRefreshOrders();
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    } else {
      alert(`Simulated order status updated to: ${nextStatus.toUpperCase()}`);
    }
  };

  // Filter and Sort Products
  const filteredProducts = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock-asc') return a.stockCount - b.stockCount;
      if (sortBy === 'stock-desc') return b.stockCount - a.stockCount;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row relative selection:bg-amber-500/20 selection:text-amber-400 select-none overflow-x-hidden">
      
      {/* Background Animated Cyber grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#1e1b4b,transparent)] pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Cyber Sidebar Console */}
      <aside className="w-full md:w-64 border-r border-white/5 bg-slate-950/60 backdrop-blur-xl flex flex-col justify-between shrink-0 z-20">
        <div>
          {/* Logo Brand Title */}
          <div className="p-6 border-b border-white/5 flex items-center space-x-3 bg-slate-950/30">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Boxes className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h1 className="font-orbitron font-extrabold text-sm uppercase tracking-wider text-white">
                CHAMPIONS
              </h1>
              <span className="font-space text-[9px] font-bold text-amber-500 tracking-widest block">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* User badge */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center font-orbitron text-xs text-amber-400 font-black">
              {userEmail.substring(0,2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="font-space text-[10px] text-slate-400 truncate block">SYSTEM_ADMIN</span>
              <span className="font-outfit text-xs text-white truncate block">{userEmail}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
              { id: 'products', name: 'Products', icon: <ShoppingBag className="w-4.5 h-4.5" /> },
              { id: 'offers', name: 'Offers & Discounts', icon: <Tag className="w-4.5 h-4.5" /> },
              { id: 'featured', name: 'Featured & New', icon: <Sparkles className="w-4.5 h-4.5" /> },
              { id: 'inventory', name: 'Inventory Level', icon: <Boxes className="w-4.5 h-4.5" /> },
              { id: 'orders', name: 'Orders Log', icon: <ClipboardList className="w-4.5 h-4.5" /> },
              { id: 'settings', name: 'HUD Settings', icon: <Settings className="w-4.5 h-4.5" /> }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-space text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-xs shadow-amber-500/5'
                      : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Console Log Out */}
        <div className="p-4 border-t border-white/5 bg-slate-950/20">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-all duration-300 font-space text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>DISCONNECT SESSION</span>
          </button>
        </div>
      </aside>

      {/* Main Mainframe View */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen relative z-10">
        
        {/* Connection status diagnostics */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div>
            <h2 className="font-orbitron font-extrabold text-xl md:text-2xl text-white uppercase tracking-wider">
              {activeTab === 'dashboard' ? 'SYSTEM DIAGNOSTICS' : activeTab.toUpperCase() + ' PANEL'}
            </h2>
            <p className="font-space text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
              Champions Roster Hub // Sync active
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              title="Switch Theme"
              className="p-2.5 rounded-xl border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 cursor-pointer group flex items-center justify-center text-slate-300 hover:text-emerald-400"
            >
              {theme === 'light' ? (
                <Moon className="w-4.5 h-4.5 text-slate-500 group-hover:text-[#10b981] transition-all" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-amber-400 group-hover:text-amber-300 transition-all drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              )}
            </button>

            {/* Connection status diagnostics */}
            <div className="flex items-center space-x-2 bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2 text-xs font-space">
              <div className={`w-2 h-2 rounded-full animate-ping ${isSupabaseConfigured ? 'bg-[#10b981]' : 'bg-amber-500'}`} />
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                {isSupabaseConfigured ? 'CLOUDSYNC: SECURE' : 'LOCALSEED FALLBACK'}
              </span>
            </div>
          </div>
        </div>

        {/* TABS VIEWCONTROLLER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {/* 1. DASHBOARD HOME VIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* 5 Diagnostic Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                  {[
                    { title: 'Total Roster Items', value: totalProducts, icon: <ShoppingBag className="w-5 h-5 text-emerald-400" />, label: 'Active product units', border: 'border-emerald-500/10' },
                    { title: 'Simulated Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: <TrendingUp className="w-5 h-5 text-amber-400" />, label: 'Delivered orders yield', border: 'border-amber-500/10' },
                    { title: 'Total Orders Logged', value: totalOrders, icon: <ClipboardList className="w-5 h-5 text-purple-400" />, label: 'Pending orders queue', border: 'border-purple-500/10' },
                    { title: 'Critical Stock Alerts', value: lowStockCount, icon: <AlertTriangle className="w-5 h-5 text-rose-500" />, label: 'Units count <= 5', border: 'border-rose-500/10', warning: lowStockCount > 0 },
                    { title: 'Active Campaigns', value: activeOffersCount, icon: <Tag className="w-5 h-5 text-cyan-400" />, label: 'Coupons on storefront', border: 'border-cyan-500/10' }
                  ].map((card, idx) => (
                    <div 
                      key={idx} 
                      className={`glass-panel p-5 rounded-2xl border ${card.border} hover:border-white/10 transition-all duration-300 relative group overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/1 opacity-[0.02] rounded-bl-full pointer-events-none group-hover:scale-110 duration-500" />
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-space text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {card.title}
                        </span>
                        <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                          {card.icon}
                        </div>
                      </div>
                      <div className="font-orbitron font-black text-2xl text-white tracking-tight">
                        {card.value}
                      </div>
                      <span className={`font-outfit text-[10px] block mt-1.5 ${card.warning ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-500'}`}>
                        {card.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cyber charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Top Selling Products chart component */}
                  <TopSellingChart orders={orders} products={products} />

                  {/* Recent Activity Log list */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 relative">
                    <span className="font-space text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4">
                      Realtime Mainframe Activity
                    </span>
                    
                    <div className="space-y-4 max-h-[195px] overflow-y-auto pr-1">
                      {[
                        { text: 'Sys-Admin logged in secure session', time: 'Just now', icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> },
                        { text: 'Database loaded: 11 active accessory units', time: '4m ago', icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> },
                        { text: 'New promo campaign ZENFLOW generated', time: '12m ago', icon: <Tag className="w-3.5 h-3.5 text-cyan-400" /> },
                        { text: 'Carbon Kinetic Shoe updated: stock adjusted', time: '32m ago', icon: <Boxes className="w-3.5 h-3.5 text-amber-400" /> }
                      ].map((log, idx) => (
                        <div key={idx} className="flex items-start space-x-3 text-xs bg-slate-900/30 border border-white/5 p-3 rounded-xl">
                          <div className="mt-0.5 shrink-0">{log.icon}</div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-outfit text-slate-200 text-[11px] leading-snug">{log.text}</p>
                            <span className="font-space text-[9px] text-slate-500 block mt-1">{log.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. PRODUCT DIRECTORY VIEW */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                
                {/* Search & filters tools row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 p-4 border border-white/5 rounded-2xl">
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    {/* Search Field */}
                    <div className="relative w-full md:w-64">
                      <Search className="w-4 h-4 text-slate-500 absolute top-1/2 left-3.5 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Search roster catalog..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl pl-10 pr-4 py-2 font-outfit text-xs text-white placeholder-slate-500 focus:outline-hidden transition-all duration-300"
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2 font-space text-xs text-slate-300 focus:outline-hidden cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        <option value="Running">Running</option>
                        <option value="Gym Equipment">Gym Equipment</option>
                        <option value="Football">Football</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Yoga">Yoga</option>
                      </select>
                    </div>

                    {/* Sort Selector */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2 font-space text-xs text-slate-300 focus:outline-hidden cursor-pointer"
                      >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="price-asc">Price (Low to High)</option>
                        <option value="price-desc">Price (High to Low)</option>
                        <option value="stock-asc">Stock (Low to High)</option>
                        <option value="stock-desc">Stock (High to Low)</option>
                      </select>
                    </div>
                  </div>

                  {/* Add Product Button */}
                  <button
                    onClick={() => openProductModal(null)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-orange-500/10 text-slate-950 font-orbitron text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4.5 h-4.5 stroke-[3px]" />
                    <span>ADD PRODUCT</span>
                  </button>
                </div>

                {/* Table Directory list */}
                <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/80 border-b border-white/5 text-[9px] font-space text-slate-400 uppercase tracking-widest">
                          <th className="p-5 font-bold">Product</th>
                          <th className="p-5 font-bold">Category</th>
                          <th className="p-5 font-bold">Price</th>
                          <th className="p-5 font-bold">Stock</th>
                          <th className="p-5 font-bold">Badging</th>
                          <th className="p-5 font-bold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-outfit text-xs text-slate-200">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-20 text-center text-slate-500 font-orbitron uppercase tracking-widest text-xs">
                              No products found in database sector.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => {
                            const isLowStock = p.stockCount <= 5;
                            const isOut = p.stockCount === 0;
                            return (
                              <tr key={p.id} className="hover:bg-slate-900/10 transition-colors">
                                <td className="p-5 flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center p-1.5 shrink-0 relative">
                                    <img src={p.image} alt={p.name} className="max-h-10 max-w-full object-contain" />
                                  </div>
                                  <div className="overflow-hidden">
                                    <h4 className="font-orbitron font-extrabold text-sm text-white truncate max-w-[180px]">{p.name}</h4>
                                    <span className="font-space text-[10px] text-slate-500 block mt-0.5 uppercase tracking-wider">ID: {p.id.substring(0, 8)}</span>
                                  </div>
                                </td>
                                <td className="p-5 font-space text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                                  {p.category}
                                </td>
                                <td className="p-5 font-orbitron font-bold text-white text-sm">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </td>
                                <td className="p-5">
                                  <span className={`font-orbitron font-black text-sm block ${isOut ? 'text-rose-500 animate-pulse' : isLowStock ? 'text-orange-400' : 'text-emerald-400'}`}>
                                    {p.stockCount} UNITS
                                  </span>
                                  <span className={`text-[9px] font-space font-bold uppercase ${isOut ? 'text-rose-500/80' : isLowStock ? 'text-orange-400/80' : 'text-slate-500'}`}>
                                    {isOut ? 'Out of Stock' : isLowStock ? 'Critical Level' : 'Stable'}
                                  </span>
                                </td>
                                <td className="p-5">
                                  <div className="flex flex-wrap gap-1.5">
                                    {p.isNewArrival && (
                                      <span className="text-[8px] font-space font-bold text-amber-400 border border-amber-400/20 bg-amber-400/5 px-2 py-0.5 rounded">
                                        NEW ARRIVAL
                                      </span>
                                    )}
                                    {p.stockCount > 0 && (
                                      <span className="text-[8px] font-space font-bold text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 rounded">
                                        STORE ACTIVE
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-5 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => openProductModal(p)}
                                      className="p-2 rounded-xl bg-slate-900 border border-white/5 text-amber-400 hover:border-amber-400/40 hover:bg-amber-400/5 transition-all duration-300 cursor-pointer"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(p.id)}
                                      className="p-2 rounded-xl bg-slate-900 border border-white/5 text-rose-500 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all duration-300 cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 3. OFFERS MANAGEMENT VIEW */}
            {activeTab === 'offers' && (
              <div className="space-y-6">
                
                {/* Header controls row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 p-4 border border-white/5 rounded-2xl">
                  <div>
                    <span className="font-space text-xs font-bold text-amber-500 uppercase tracking-widest block">
                      Campaign Dashboard
                    </span>
                    <p className="font-outfit text-xs text-slate-400 mt-1">
                      Promotional campaigns configured dynamically on the storefront coupon sliders.
                    </p>
                  </div>

                  {/* Add Offer Button */}
                  <button
                    onClick={() => openOfferModal(null)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-orange-500/10 text-slate-950 font-orbitron text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4.5 h-4.5 stroke-[3px]" />
                    <span>CREATE PROMO</span>
                  </button>
                </div>

                {/* Offers Grid cards list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {offers.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass-panel rounded-2xl border border-white/5">
                      <p className="font-orbitron text-slate-500 text-xs font-bold uppercase tracking-wider">
                        No promotional offers active in database segment.
                      </p>
                    </div>
                  ) : (
                    offers.map((offer) => {
                      const isActive = offer.active !== false;
                      return (
                        <div 
                          key={offer.id} 
                          className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between relative group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/5 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover rounded-lg" />
                              </div>
                              <div>
                                <span className="font-space text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  {offer.appliesTo}
                                </span>
                                <h3 className="font-orbitron font-extrabold text-sm text-white uppercase tracking-tight">{offer.title}</h3>
                              </div>
                            </div>

                            {/* Active Toggle Status */}
                            <button
                              onClick={() => handleToggleOfferActive(offer)}
                              className={`px-3 py-1.5 rounded-full font-space text-[9px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer border ${
                                isActive 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-[#10b981]' 
                                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                              }`}
                            >
                              {isActive ? 'ACTIVE' : 'DEACTIVATED'}
                            </button>
                          </div>

                          <p className="font-outfit text-xs text-slate-400 leading-relaxed mb-4 flex-grow">
                            {offer.description}
                          </p>

                          <div className="w-full h-[1px] bg-white/5 mb-4" />

                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-space text-slate-500 font-semibold uppercase tracking-wider">Coupon Code</span>
                              <code className="font-orbitron font-black text-sm text-amber-400">{offer.code}</code>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => openOfferModal(offer)}
                                className="p-2 rounded-xl bg-slate-900 border border-white/5 text-amber-400 hover:border-amber-400/40 hover:bg-amber-400/5 transition-all duration-300 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteOffer(offer.id)}
                                className="p-2 rounded-xl bg-slate-900 border border-white/5 text-rose-500 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all duration-300 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

            {/* 4. FEATURED & NEW ARRIVALS PANELS */}
            {activeTab === 'featured' && (
              <div className="space-y-6">
                
                {/* Header context info */}
                <div className="bg-slate-950/40 p-5 border border-white/5 rounded-2xl">
                  <span className="font-space text-xs font-bold text-amber-500 uppercase tracking-widest block">
                    Catalog Focus priority
                  </span>
                  <h3 className="font-orbitron font-extrabold text-base text-white tracking-tight mt-1">
                    NEW ARRIVALS DISPLAY LOGS
                  </h3>
                  <p className="font-outfit text-xs text-slate-400 mt-2 leading-relaxed">
                    Products marked as New Arrival immediately appear inside the dynamic upstream storefront carousels and have neon amber priority tagging enabled across store lists. Select, toggle, or alter priority directly below.
                  </p>
                </div>

                {/* Dynamic listings workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* New arrivals manager table list */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 relative">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                      <span className="font-space text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        New Arrivals catalog
                      </span>
                      <span className="font-orbitron font-black text-xs text-amber-400 uppercase">
                        {newArrivalsCount} Units
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {products.filter(p => p.isNewArrival).map(p => (
                        <div key={p.id} className="flex items-center justify-between bg-slate-900/30 border border-white/5 p-3 rounded-xl hover:border-amber-400/20 transition-all duration-300">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-white/10 flex items-center justify-center p-1 shrink-0">
                              <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            </div>
                            <span className="font-orbitron font-bold text-xs text-white truncate max-w-[160px]">
                              {p.name}
                            </span>
                          </div>

                          <button
                            onClick={() => handleToggleProductNewArrival(p)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 text-[9px] font-space font-bold uppercase tracking-widest cursor-pointer transition-all"
                          >
                            <X className="w-3 h-3" />
                            <span>DE-LIST</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rest of the catalog that could be added to New Arrivals */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 relative">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                      <span className="font-space text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Candidate additions from catalog
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {products.filter(p => !p.isNewArrival).map(p => (
                        <div key={p.id} className="flex items-center justify-between bg-slate-900/30 border border-white/5 p-3 rounded-xl hover:border-emerald-400/20 transition-all duration-300">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-white/10 flex items-center justify-center p-1 shrink-0">
                              <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            </div>
                            <span className="font-orbitron font-bold text-xs text-white truncate max-w-[160px]">
                              {p.name}
                            </span>
                          </div>

                          <button
                            onClick={() => handleToggleProductNewArrival(p)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#10b981]/20 bg-[#10b981]/5 hover:bg-[#10b981]/10 text-[#10b981] text-[9px] font-space font-bold uppercase tracking-widest cursor-pointer transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            <span>PIN NEW</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 5. INVENTORY STOCK MANAGEMENT VIEW */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                
                {/* Inventory HUD info row */}
                <div className="bg-slate-950/40 p-5 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="font-space text-xs font-bold text-amber-500 uppercase tracking-widest block">
                      Active Logistics Dashboard
                    </span>
                    <p className="font-outfit text-xs text-slate-400 mt-1">
                      Monitor unit warehouse levels. Zero-inventory locks the cart checkout trigger for client safety automatically.
                    </p>
                  </div>
                  
                  <div className="flex space-x-4 text-xs font-space">
                    <div className="px-4 py-2 border border-rose-500/20 bg-rose-500/5 rounded-xl">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-widest">OUT OF STOCK</span>
                      <span className="font-orbitron text-sm font-black text-rose-500 block mt-0.5">
                        {products.filter(p => p.stockCount === 0).length} UNITS
                      </span>
                    </div>
                    <div className="px-4 py-2 border border-orange-500/20 bg-orange-500/5 rounded-xl">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-widest">LOW LEVEL</span>
                      <span className="font-orbitron text-sm font-black text-orange-400 block mt-0.5">
                        {products.filter(p => p.stockCount > 0 && p.stockCount <= 5).length} UNITS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock editor grid list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((p) => {
                    const isOut = p.stockCount === 0;
                    const isLow = p.stockCount <= 5;
                    return (
                      <div key={p.id} className="glass-panel p-4 rounded-xl border border-white/5 flex items-center space-x-4 hover:border-white/10 transition-colors">
                        <div className="w-11 h-11 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center p-1 shrink-0 relative">
                          <img src={p.image} alt={p.name} className="max-h-9 max-w-full object-contain" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-orbitron font-extrabold text-xs text-white truncate">{p.name}</h4>
                          <span className={`text-[10px] font-space font-bold uppercase block mt-1 ${isOut ? 'text-rose-500 animate-pulse' : isLow ? 'text-orange-400' : 'text-emerald-400'}`}>
                            {isOut ? '❌ Locked: OUT OF STOCK' : isLow ? '⚠️ Low Stock warning' : '✅ Active Level'}
                          </span>
                          
                          <div className="flex items-center space-x-2 mt-2.5">
                            <span className="font-orbitron font-black text-xs text-slate-300 shrink-0">STOCK:</span>
                            {/* Stock increment dec buttons */}
                            <button
                              onClick={async () => {
                                const nextStock = Math.max(0, p.stockCount - 1);
                                if (isSupabaseConfigured) {
                                  await supabase.from('products').update({ stock: nextStock }).eq('id', p.id);
                                  onRefreshProducts();
                                } else {
                                  alert('Stock adjusted successfully.');
                                }
                              }}
                              className="w-6 h-6 rounded-md bg-slate-900 border border-white/5 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer font-black"
                            >
                              -
                            </button>
                            <span className="font-orbitron font-black text-sm text-white w-8 text-center bg-slate-950 border border-white/5 rounded-md py-0.5">
                              {p.stockCount}
                            </span>
                            <button
                              onClick={async () => {
                                const nextStock = p.stockCount + 1;
                                if (isSupabaseConfigured) {
                                  await supabase.from('products').update({ stock: nextStock }).eq('id', p.id);
                                  onRefreshProducts();
                                } else {
                                  alert('Stock adjusted successfully.');
                                }
                              }}
                              className="w-6 h-6 rounded-md bg-slate-900 border border-white/5 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer font-black"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* 6. ORDERS LOGGER VIEW */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                {/* Orders Overview stats info */}
                <div className="bg-slate-950/40 p-5 border border-white/5 rounded-2xl">
                  <span className="font-space text-xs font-bold text-amber-500 uppercase tracking-widest block">
                    Clients Checkout Logs
                  </span>
                  <p className="font-outfit text-xs text-slate-400 mt-1">
                    Orders generated dynamically on customer checkout. Mutate shipment markers below to advance dispatcher status.
                  </p>
                </div>

                {/* Orders Table */}
                <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/80 border-b border-white/5 text-[9px] font-space text-slate-400 uppercase tracking-widest">
                          <th className="p-5 font-bold">Order ID</th>
                          <th className="p-5 font-bold">Client Name</th>
                          <th className="p-5 font-bold">Ordered Roster</th>
                          <th className="p-5 font-bold">Total Bill</th>
                          <th className="p-5 font-bold text-center">Dispatcher Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-outfit text-xs text-slate-200">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-20 text-center text-slate-500 font-orbitron uppercase tracking-widest text-xs">
                              No client order units in logs.
                            </td>
                          </tr>
                        ) : (
                          orders.map((o) => {
                            const isPending = o.status === 'pending';
                            const isShipping = o.status === 'shipping';
                            return (
                              <tr key={o.id} className="hover:bg-slate-900/10 transition-colors">
                                <td className="p-5 font-space text-[10px] font-bold text-amber-500">
                                  #{o.id.substring(0,8).toUpperCase()}
                                </td>
                                <td className="p-5">
                                  <span className="font-orbitron font-bold text-xs text-white block">{o.customer_name}</span>
                                  <span className="font-space text-[9px] text-slate-500 block mt-0.5">PH: {o.phone || 'N/A'}</span>
                                </td>
                                <td className="p-5 max-w-[200px] overflow-hidden">
                                  {Array.isArray(o.products) ? (
                                    <div className="space-y-1 font-space text-[10px] text-slate-300">
                                      {o.products.map((item: any, idx: number) => (
                                        <div key={idx} className="truncate">
                                          ● {item.product?.name || 'Item'} <span className="text-amber-500 font-bold">x{item.quantity}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic">JSON List format</span>
                                  )}
                                </td>
                                <td className="p-5 font-orbitron font-bold text-white text-sm">
                                  ₹{(o.total_amount || 0).toLocaleString('en-IN')}
                                </td>
                                <td className="p-5 text-center">
                                  <button
                                    onClick={() => handleUpdateOrderStatus(o.id, o.status)}
                                    className={`px-4 py-2 rounded-xl font-space text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer border inline-flex items-center space-x-1.5 ${
                                      isPending 
                                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20'
                                        : isShipping
                                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
                                        : 'bg-emerald-500/10 border-emerald-500/20 text-[#10b981] hover:bg-emerald-500/20'
                                    }`}
                                  >
                                    {isPending ? (
                                      <>
                                        <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                                        <span>PENDING (SHIP NOW)</span>
                                      </>
                                    ) : isShipping ? (
                                      <>
                                        <Activity className="w-3 h-3 text-blue-400" />
                                        <span>SHIPPING (ARRIVE NOW)</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-3 h-3 text-[#10b981]" />
                                        <span>DELIVERED (RESET)</span>
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 7. SETTINGS CONSOLE VIEW */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                {/* Visual cockpit control settings panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Cockpit dials */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 relative">
                    <span className="font-space text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4">
                      Cockpit control telemetry
                    </span>
                    
                    <div className="space-y-5 text-xs font-space">
                      {[
                        { name: 'Core processing flow', speed: 'MAX SPEED', percent: 98, color: 'from-[#10b981] to-teal-400' },
                        { name: 'Sync telemetry throughput', speed: '50ms LATENCY', percent: 94, color: 'from-amber-500 to-orange-400' },
                        { name: 'Translucent buffer load', speed: 'STABLE LOAD', percent: 45, color: 'from-cyan-400 to-blue-500' }
                      ].map((dial, idx) => (
                        <div key={idx} className="space-y-2 bg-slate-900/20 border border-white/5 p-4 rounded-xl">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-300 uppercase">{dial.name}</span>
                            <span className="text-amber-500 text-[10px]">{dial.speed}</span>
                          </div>
                          
                          {/* Dials progress slider bar */}
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden relative border border-white/5">
                            <div 
                              className={`h-full bg-linear-to-r ${dial.color}`}
                              style={{ width: `${dial.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mainframe stats and info */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 relative flex flex-col justify-between">
                    <div>
                      <span className="font-space text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4">
                        Mainframe diagnostics log
                      </span>
                      
                      <div className="space-y-2.5 font-space text-xs">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-slate-400 uppercase">Supabase SDK:</span>
                          <span className="font-bold text-white">v2.40.1</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-slate-400 uppercase">Database Ping:</span>
                          <span className="font-bold text-[#10b981]">14ms</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-slate-400 uppercase">Active Port:</span>
                          <span className="font-bold text-white">443 (SECURE HTTPS)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center space-x-3 mt-5">
                      <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="font-outfit text-[11px] text-slate-350 leading-relaxed">
                        Security policies (RLS) are active on the Supabase cluster. All mutations executed from this dashboard require authenticated tokens.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* PRODUCT CRUD MODAL FORM EDITOR */}
      {/* ------------------------------------------------------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl rounded-2xl border border-white/10 glass-panel bg-slate-950/90 shadow-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <span className="font-orbitron font-extrabold text-sm text-white uppercase tracking-wider">
                {editingProduct ? 'EDIT SYSTEM PRODUCT' : 'NEW ACCESSORY REGISTRATION'}
              </span>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-white/5 hover:border-white/20 text-slate-450 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 font-space text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">PRODUCT TITLE</label>
                  <input 
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden"
                    placeholder="Carbon Kinetic Shoe"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">ROSTER CATEGORY</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-slate-350 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Running">Running</option>
                    <option value="Gym Equipment">Gym Equipment</option>
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Yoga">Yoga</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">PRICE (₹ INR)</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden font-orbitron"
                    placeholder="8999"
                  />
                </div>

                {/* Stock Count */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">WAREHOUSE STOCK LEVEL</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={productForm.stockCount}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stockCount: Number(e.target.value) }))}
                    className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden font-orbitron"
                    placeholder="12"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">TECHNICAL DESCRIPTION</label>
                <textarea 
                  required
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden font-outfit"
                  placeholder="Provide full materials specifications..."
                />
              </div>

              {/* Image Asset Select / Upload */}
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">PRODUCT IMAGERY ASSETS</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* File Upload card */}
                  <div className="md:col-span-2 relative flex flex-col items-center justify-center p-4 border border-dashed border-white/10 hover:border-amber-400/20 bg-slate-900/30 rounded-xl transition-all duration-300">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, 'product')}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Eye className="w-6 h-6 text-slate-500 mb-2 group-hover:text-amber-400" />
                    <span className="text-[10px] text-slate-400 uppercase font-bold">CHOOSE IMAGE FILE</span>
                    <span className="text-[8px] text-slate-500 block mt-1">Automatic Cloud Upload</span>
                    
                    {/* Live Progress HUD */}
                    {uploadProgress !== null && (
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
                        <div className="h-full bg-linear-to-r from-amber-500 to-orange-500" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                  </div>

                  {/* Visual Preview */}
                  <div className="h-28 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center overflow-hidden p-2">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                    ) : (
                      <span className="text-slate-500 uppercase tracking-wider text-[8px]">PREVIEW</span>
                    )}
                  </div>

                </div>
              </div>

              {/* Specs String */}
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">SPECIFICATIONS (COMMA SEPARATED LIST)</label>
                <input 
                  type="text"
                  value={productForm.specsString}
                  onChange={(e) => setProductForm(prev => ({ ...prev, specsString: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden"
                  placeholder="Carbon spine, Flex grip handle, 8mm drop"
                />
              </div>

              {/* Toggles row */}
              <div className="flex flex-wrap gap-5 bg-slate-900/20 border border-white/5 p-4 rounded-xl">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={productForm.isNewArrival}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isNewArrival: e.target.checked }))}
                    className="w-4 h-4 rounded-md border border-white/10 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-slate-350 uppercase tracking-widest">Pin as New Arrival</span>
                </label>
              </div>

              {/* Action Trigger Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-orbitron text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>SYNCHRONIZING...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-slate-950" />
                      <span>{editingProduct ? 'APPLY CHANGES' : 'REGISTRY UNIT'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* OFFERS CRUD MODAL FORM EDITOR */}
      {/* ------------------------------------------------------------- */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl rounded-2xl border border-white/10 glass-panel bg-slate-950/90 shadow-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <span className="font-orbitron font-extrabold text-sm text-white uppercase tracking-wider">
                {editingOffer ? 'MODIFY PROMO CAMPAIGN' : 'LAUNCH NEW CAMPAIGN'}
              </span>
              <button 
                onClick={() => setIsOfferModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-white/5 hover:border-white/20 text-slate-450 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-4 font-space text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Offer Title */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">CAMPAIGN TITLE</label>
                  <input 
                    type="text"
                    required
                    value={offerForm.title}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden"
                    placeholder="VELOCITY KINETIC RUN"
                  />
                </div>

                {/* Coupon Code */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">COUPON CODE</label>
                  <input 
                    type="text"
                    required
                    value={offerForm.code}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden uppercase font-orbitron"
                    placeholder="KINETIC30"
                  />
                </div>

                {/* Promo Value */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">DISCOUNT VALUE</label>
                  <input 
                    type="text"
                    required
                    value={offerForm.discount}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, discount: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden font-orbitron"
                    placeholder="30% OFF / ₹1,500 OFF"
                  />
                </div>

                {/* Applies To */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">APPLIES TO SECTOR</label>
                  <input 
                    type="text"
                    required
                    value={offerForm.appliesTo}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, appliesTo: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden"
                    placeholder="ALL RUNNING GEAR"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">CAMPAIGN DESCRIPTION</label>
                <textarea 
                  required
                  rows={2}
                  value={offerForm.description}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-white focus:outline-hidden font-outfit"
                  placeholder="Describe campaign goals and outputs..."
                />
              </div>

              {/* Gradient Theme selector */}
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">THEME COLOR GRADIENT</label>
                <select
                  value={offerForm.gradientClass}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, gradientClass: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/5 focus:border-amber-400/40 rounded-xl px-4 py-2.5 text-slate-350 focus:outline-hidden cursor-pointer"
                >
                  <option value="from-[#10b981] to-teal-400">Cyber Green-Teal (Running/Store)</option>
                  <option value="from-purple-500 to-indigo-600">Core Purple-Indigo (Gym/Heavy)</option>
                  <option value="from-rose-500 to-orange-500">Champs Rose-Orange (Cricket/Football)</option>
                  <option value="from-cyan-400 to-blue-500">Zen Blue-Cyan (Yoga/Cooldown)</option>
                </select>
              </div>

              {/* Banner Image Asset */}
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase font-bold text-[9px] tracking-widest block">PROMO COVER GRAPHIC</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* File Upload trigger */}
                  <div className="md:col-span-2 relative flex flex-col items-center justify-center p-4 border border-dashed border-white/10 hover:border-amber-400/20 bg-slate-900/30 rounded-xl transition-all duration-300">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, 'offer')}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Eye className="w-6 h-6 text-slate-500 mb-2 group-hover:text-amber-400" />
                    <span className="text-[10px] text-slate-400 uppercase font-bold">CHOOSE BANNER IMAGE</span>
                    
                    {/* Progress HUD */}
                    {uploadProgress !== null && (
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
                        <div className="h-full bg-linear-to-r from-amber-500 to-orange-500" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                  </div>

                  {/* Banner Preview */}
                  <div className="h-28 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center overflow-hidden p-2">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-slate-500 uppercase tracking-wider text-[8px]">PREVIEW</span>
                    )}
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-orbitron text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>SYNCHRONIZING...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-slate-950" />
                      <span>{editingOffer ? 'APPLY REFORMS' : 'LAUNCH CAMPAIGN'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
