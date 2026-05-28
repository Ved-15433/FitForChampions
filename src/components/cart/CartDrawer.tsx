import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import type { Product } from '../ui/ProductCard';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 1999 ? 0 : 150;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-500 animate-in fade-in"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-white/5 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-[#10b981]" />
              <h2 className="font-orbitron font-extrabold text-lg text-white tracking-wide">
                YOUR GEAR CORE
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/5 text-slate-450 hover:text-rose-500 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5">
                  <ShoppingBag className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-sm text-slate-200">YOUR CART IS EMPTIED</h3>
                  <p className="font-outfit text-xs text-slate-450 mt-1 max-w-[200px] mx-auto">
                    Secure and load some cyber-athletics equipment to start performance optimizations.
                  </p>
                </div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex items-center p-3 rounded-xl border border-white/5 bg-slate-900/40 shadow-xs hover:border-[#10b981]/25 transition-all group"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5 shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" 
                    />
                  </div>

                  {/* Details */}
                  <div className="ml-4 flex-grow">
                    <h4 className="font-orbitron font-bold text-sm text-white tracking-tight line-clamp-1 group-hover:text-[#10b981] duration-300">
                      {item.product.name}
                    </h4>
                    <span className="font-space text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.product.category}
                    </span>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 rounded-md border border-white/5 hover:border-[#10b981]/40 bg-white/5 hover:bg-[#10b981]/5 transition-all text-slate-350 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-orbitron font-bold text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 rounded-md border border-white/5 hover:border-[#10b981]/40 bg-white/5 hover:bg-[#10b981]/5 transition-all text-slate-350 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing / Remove */}
                  <div className="ml-4 text-right flex flex-col justify-between items-end h-full">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-450 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="font-orbitron font-bold text-sm text-slate-200 mt-3">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Billing Section */}
          {cartItems.length > 0 && (
            <div className="px-6 py-6 border-t border-white/5 bg-[#0a0f0d]/30 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between font-outfit text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-orbitron font-medium text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-outfit text-xs text-slate-400">
                  <span>Hyper-delivery</span>
                  <span className="font-orbitron font-medium text-slate-200">
                    {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[9px] font-space text-slate-400 text-right">
                    Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more for free delivery
                  </p>
                )}
                <div className="w-full h-[1px] bg-white/5 my-2" />
                <div className="flex justify-between font-orbitron text-base font-extrabold text-white">
                  <span>TOTAL INVESTMENT</span>
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#10b981] to-teal-400 font-black">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onCheckout}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#10b981] via-emerald-500 to-teal-400 text-slate-950 font-orbitron font-bold text-sm tracking-widest shadow-lg shadow-[#10b981]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2.5 group font-extrabold"
              >
                <CreditCard className="w-4 h-4 animate-pulse" />
                <span>ENGAGE CHECKOUT</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
