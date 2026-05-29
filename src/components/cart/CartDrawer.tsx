import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Tag, Check, AlertCircle, ChevronRight, MapPin } from 'lucide-react';
import type { Product } from '../ui/ProductCard';
import { iconMap, type Offer } from '../../data/offers';

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
  onCheckout: (discountAmount: number, couponCode?: string, address?: any) => void;
  offers: Offer[];
}

const validateCoupon = (coupon: Offer, items: CartItem[]): { isValid: boolean; discountAmount: number; message: string } => {
  if (items.length === 0) {
    return { isValid: false, discountAmount: 0, message: 'Cart is empty.' };
  }

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const code = coupon.code.toUpperCase().trim();

  // 1. KINETIC30
  if (code === 'KINETIC30') {
    const runningItems = items.filter(item => item.product.category === 'Running');
    if (runningItems.length === 0) {
      return { isValid: false, discountAmount: 0, message: 'Only applicable to Running Gear.' };
    }
    const runningTotal = runningItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = Math.round(runningTotal * 0.3);
    return { isValid: true, discountAmount: discount, message: '30% Running Gear discount applied!' };
  }

  // 2. GYMPOWER15
  if (code === 'GYMPOWER15') {
    const gymItems = items.filter(item => item.product.category === 'Gym Equipment');
    const gymTotal = gymItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    if (gymTotal < 4000) {
      return { isValid: false, discountAmount: 0, message: 'Minimum cart value of ₹4,000 on Gym Equipment required.' };
    }
    return { isValid: true, discountAmount: 1500, message: '₹1,500 Gym Equipment discount applied!' };
  }

  // 3. CHAMP25
  if (code === 'CHAMP25') {
    const fieldItems = items.filter(item => item.product.category === 'Football' || item.product.category === 'Cricket');
    if (fieldItems.length === 0) {
      return { isValid: false, discountAmount: 0, message: 'Only valid on Football and Cricket items.' };
    }
    const fieldTotal = fieldItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = Math.round(fieldTotal * 0.25);
    return { isValid: true, discountAmount: discount, message: '25% Football & Cricket discount applied!' };
  }

  // 4. ZENFLOW
  if (code === 'ZENFLOW') {
    const hasMat = items.some(item => item.product.name.toLowerCase().includes('yoga mat'));
    if (!hasMat) {
      return { isValid: false, discountAmount: 0, message: 'Requires a Helix Pro Yoga Mat.' };
    }
    return { isValid: true, discountAmount: 300, message: 'Free Recovery Sleeve & ₹300 discount applied!' };
  }

  // 5. Generic Fallback Parser for Database Coupons
  let percent = 0;
  let flat = 0;
  
  const discountStr = coupon.discount.toUpperCase();
  if (discountStr.includes('%')) {
    const match = discountStr.match(/(\d+(?:\.\d+)?)\s*%/);
    if (match) {
      percent = parseFloat(match[1]);
    }
  } else if (discountStr.includes('₹') || discountStr.includes('INR') || discountStr.includes('RS')) {
    const match = discountStr.replace(/[^\d]/g, '');
    if (match) {
      flat = parseFloat(match);
    }
  } else {
    const match = discountStr.match(/(\d+)/);
    if (match) {
      const val = parseFloat(match[1]);
      if (val < 100) {
        percent = val;
      } else {
        flat = val;
      }
    }
  }

  const appliesTo = (coupon.appliesTo || '').toUpperCase();
  
  let targetCategory: string | null = null;
  if (appliesTo.includes('RUNNING')) targetCategory = 'Running';
  else if (appliesTo.includes('GYM') || appliesTo.includes('EQUIPMENT')) targetCategory = 'Gym Equipment';
  else if (appliesTo.includes('FOOTBALL')) targetCategory = 'Football';
  else if (appliesTo.includes('BASKETBALL')) targetCategory = 'Basketball';
  else if (appliesTo.includes('CRICKET')) targetCategory = 'Cricket';
  else if (appliesTo.includes('YOGA')) targetCategory = 'Yoga';

  let minAmount = 0;
  const priceMatch = appliesTo.match(/(?:ABOVE|MIN|MINIMUM)?\s*₹?\s*(\d+[\d,]*)/);
  if (priceMatch) {
    minAmount = parseFloat(priceMatch[1].replace(/,/g, ''));
  }

  if (targetCategory) {
    const categoryItems = items.filter(item => item.product.category === targetCategory);
    const categoryTotal = categoryItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    
    if (categoryItems.length === 0) {
      return { isValid: false, discountAmount: 0, message: `Only valid on ${targetCategory} items.` };
    }
    
    if (minAmount > 0 && categoryTotal < minAmount) {
      return { isValid: false, discountAmount: 0, message: `Requires minimum ₹${minAmount.toLocaleString('en-IN')} in ${targetCategory}.` };
    }

    let discount = 0;
    if (percent > 0) {
      discount = Math.round(categoryTotal * (percent / 100));
    } else if (flat > 0) {
      discount = Math.min(flat, categoryTotal);
    }
    return { isValid: true, discountAmount: discount, message: 'Coupon applied successfully!' };
  } else {
    if (minAmount > 0 && subtotal < minAmount) {
      return { isValid: false, discountAmount: 0, message: `Minimum cart value of ₹${minAmount.toLocaleString('en-IN')} required.` };
    }

    let discount = 0;
    if (percent > 0) {
      discount = Math.round(subtotal * (percent / 100));
    } else if (flat > 0) {
      discount = Math.min(flat, subtotal);
    }
    return { isValid: true, discountAmount: discount, message: 'Coupon applied successfully!' };
  }
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  offers
}) => {
  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; type: 'success' | 'error'; subtext?: string } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Checkout Multi-Step States
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'review'>('cart');
  const [address, setAddress] = useState({
    fullName: '',
    contactNumber: '',
    completeAddress: '',
    pinCode: ''
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Reset checkoutStep when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setCheckoutStep('cart');
      setAddressErrors({});
    }
  }, [isOpen]);

  // Load address from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('shippingAddress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAddress({
          fullName: parsed.fullName || '',
          contactNumber: parsed.contactNumber || '',
          completeAddress: parsed.completeAddress || '',
          pinCode: parsed.pinCode || ''
        });
      } catch (e) {
        console.error('Error parsing saved address:', e);
      }
    }
  }, []);

  const validateAddressForm = () => {
    const errors: Record<string, string> = {};
    if (!address.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }
    if (!address.completeAddress.trim()) {
      errors.completeAddress = 'Complete Address is required.';
    }
    
    const phoneTrimmed = address.contactNumber.trim();
    if (!phoneTrimmed) {
      errors.contactNumber = 'Contact Number is required.';
    } else {
      const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
      if (!phoneRegex.test(phoneTrimmed)) {
        errors.contactNumber = 'Enter a valid contact number (min 10 digits).';
      }
    }

    const pinTrimmed = address.pinCode.trim();
    if (!pinTrimmed) {
      errors.pinCode = 'PIN Code is required.';
    } else {
      const pinRegex = /^\d{4,8}$/;
      if (!pinRegex.test(pinTrimmed)) {
        errors.pinCode = 'PIN Code must contain digits only (4-8 digits).';
      }
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddressForm()) {
      localStorage.setItem('shippingAddress', JSON.stringify(address));
      setCheckoutStep('review');
    }
  };

  // Re-evaluate applied coupon on cart changes
  useEffect(() => {
    if (appliedCoupon) {
      const res = validateCoupon(appliedCoupon, cartItems);
      if (res.isValid) {
        setDiscountAmount(res.discountAmount);
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponMessage({
          text: 'Coupon not applicable.',
          type: 'error',
          subtext: `Conditions for coupon ${appliedCoupon.code} are no longer met: ${res.message}`
        });
      }
    } else {
      setDiscountAmount(0);
    }
  }, [cartItems, appliedCoupon]);

  const handleApplyCoupon = () => {
    const codeToSearch = couponInput.toUpperCase().trim();
    if (!codeToSearch) return;

    const coupon = offers.find(o => o.code.toUpperCase() === codeToSearch);
    if (!coupon) {
      setCouponMessage({
        text: 'Coupon not applicable.',
        type: 'error',
        subtext: 'Invalid coupon code.'
      });
      return;
    }

    const validation = validateCoupon(coupon, cartItems);
    if (!validation.isValid) {
      setCouponMessage({
        text: 'Coupon not applicable.',
        type: 'error',
        subtext: validation.message
      });
      return;
    }

    setAppliedCoupon(coupon);
    setCouponInput(coupon.code);
    setDiscountAmount(validation.discountAmount);
    setCouponMessage({
      text: 'Coupon applied successfully.',
      type: 'success',
      subtext: `${coupon.discount} discount active: ${validation.message}`
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setDiscountAmount(0);
    setCouponMessage(null);
  };

  const handleSelectCoupon = (coupon: Offer) => {
    const validation = validateCoupon(coupon, cartItems);
    if (validation.isValid) {
      setAppliedCoupon(coupon);
      setCouponInput(coupon.code);
      setDiscountAmount(validation.discountAmount);
      setCouponMessage({
        text: 'Coupon applied successfully.',
        type: 'success',
        subtext: `${coupon.discount} discount active: ${validation.message}`
      });
    }
  };

  const activeOffers = offers.filter(o => o.active !== false);

  const applicableCoupons = activeOffers.filter(coupon => {
    return validateCoupon(coupon, cartItems).isValid;
  });

  const lockedCoupons = activeOffers.filter(coupon => {
    return !validateCoupon(coupon, cartItems).isValid;
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 1999 ? 0 : 150;
  const total = Math.max(0, subtotal + shipping - discountAmount);

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
            ) : checkoutStep === 'address' ? (
              <form onSubmit={handleSaveAddress} className="space-y-5 animate-in fade-in slide-in-from-right duration-350">
                <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                  <MapPin className="w-4 h-4 text-[#10b981]" />
                  <h3 className="font-orbitron font-extrabold text-xs text-white uppercase tracking-wider">
                    SHIPPING ADDRESS
                  </h3>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-space font-bold text-slate-450 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden transition-all duration-300 ${
                      addressErrors.fullName 
                        ? 'border-rose-500/50 focus:border-rose-500/80' 
                        : 'border-white/5 focus:border-[#10b981]/40'
                    }`}
                  />
                  {addressErrors.fullName && (
                    <p className="text-[10px] font-space text-rose-500">{addressErrors.fullName}</p>
                  )}
                </div>

                {/* Contact Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-space font-bold text-slate-450 uppercase tracking-wider block">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={address.contactNumber}
                    onChange={(e) => setAddress(prev => ({ ...prev, contactNumber: e.target.value }))}
                    placeholder="e.g. +91 98765 43210"
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden transition-all duration-300 ${
                      addressErrors.contactNumber 
                        ? 'border-rose-500/50 focus:border-rose-500/80' 
                        : 'border-white/5 focus:border-[#10b981]/40'
                    }`}
                  />
                  {addressErrors.contactNumber && (
                    <p className="text-[10px] font-space text-rose-500">{addressErrors.contactNumber}</p>
                  )}
                </div>

                {/* Complete Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-space font-bold text-slate-450 uppercase tracking-wider block">
                    Complete Address
                  </label>
                  <textarea
                    value={address.completeAddress}
                    onChange={(e) => setAddress(prev => ({ ...prev, completeAddress: e.target.value }))}
                    placeholder="Enter street, landmark, city, state"
                    rows={3}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden transition-all duration-300 resize-none ${
                      addressErrors.completeAddress 
                        ? 'border-rose-500/50 focus:border-rose-500/80' 
                        : 'border-white/5 focus:border-[#10b981]/40'
                    }`}
                  />
                  {addressErrors.completeAddress && (
                    <p className="text-[10px] font-space text-rose-500">{addressErrors.completeAddress}</p>
                  )}
                </div>

                {/* PIN Code */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-space font-bold text-slate-450 uppercase tracking-wider block">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={address.pinCode}
                    onChange={(e) => setAddress(prev => ({ ...prev, pinCode: e.target.value }))}
                    placeholder="6-digit PIN code"
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden transition-all duration-300 ${
                      addressErrors.pinCode 
                        ? 'border-rose-500/50 focus:border-rose-500/80' 
                        : 'border-white/5 focus:border-[#10b981]/40'
                    }`}
                  />
                  {addressErrors.pinCode && (
                    <p className="text-[10px] font-space text-rose-500">{addressErrors.pinCode}</p>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="flex-1 py-3 rounded-xl border border-white/5 hover:border-white/10 bg-slate-950/60 hover:bg-[#030712] text-slate-350 font-orbitron text-xs font-bold transition-all duration-300 cursor-pointer text-center"
                  >
                    BACK TO CART
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-[#10b981] to-teal-500 text-slate-950 font-orbitron text-xs font-black uppercase tracking-wider hover:shadow-lg hover:shadow-[#10b981]/15 transition-all duration-300 cursor-pointer text-center"
                  >
                    SAVE & CONTINUE
                  </button>
                </div>
              </form>
            ) : checkoutStep === 'review' ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-350">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#10b981]" />
                    <h3 className="font-orbitron font-extrabold text-xs text-white uppercase tracking-wider">
                      CONFIRM ORDER
                    </h3>
                  </div>
                  <button
                    onClick={() => setCheckoutStep('address')}
                    className="text-[10px] font-space font-bold text-[#10b981] uppercase tracking-wider hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Edit Shipping
                  </button>
                </div>

                {/* Shipping Summary Card */}
                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/20 space-y-3 font-outfit text-xs text-slate-300">
                  <span className="font-space text-[10px] font-bold text-[#10b981] uppercase tracking-widest block">
                    Shipping Details
                  </span>
                  <div>
                    <p className="font-orbitron font-bold text-white text-sm">{address.fullName}</p>
                    <p className="font-space text-[10px] text-slate-500 mt-0.5">PH: {address.contactNumber}</p>
                  </div>
                  <div className="h-[1px] bg-white/5" />
                  <div>
                    <p className="leading-relaxed">{address.completeAddress}</p>
                    <p className="font-space text-[10px] text-slate-450 mt-1">PIN: {address.pinCode}</p>
                  </div>
                </div>

                {/* Order Summary Item List (Compact) */}
                <div className="space-y-3">
                  <span className="font-space text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Order Items ({cartItems.length})
                  </span>
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                    {cartItems.map((item) => (
                      <div 
                        key={item.product.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-slate-950/40 text-xs"
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-8 h-8 object-contain shrink-0 rounded bg-slate-950 p-0.5 border border-white/5" 
                          />
                          <div className="truncate">
                            <p className="font-orbitron font-bold text-white text-[11px] truncate">{item.product.name}</p>
                            <p className="text-[10px] text-slate-500 font-space">{item.product.category} x{item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-orbitron font-bold text-slate-200 shrink-0 ml-3">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('address')}
                    className="flex-1 py-3 rounded-xl border border-white/5 hover:border-white/10 bg-slate-950/60 hover:bg-[#030712] text-slate-350 font-orbitron text-xs font-bold transition-all duration-300 cursor-pointer text-center"
                  >
                    BACK TO ADDRESS
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
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
                  ))}
                </div>

                {/* Promo Codes & Coupons Section */}
                <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-[#10b981]" />
                    <h3 className="font-orbitron font-extrabold text-xs text-white uppercase tracking-wider">
                      PROMO DISCOUNTS
                    </h3>
                  </div>

                  {/* Input Field and Apply/Remove button */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      disabled={appliedCoupon !== null}
                      className={`flex-1 bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden tracking-widest font-orbitron transition-all duration-300 ${
                        appliedCoupon 
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/10' 
                          : couponMessage?.type === 'error'
                          ? 'border-rose-500/30 focus:border-rose-500/60'
                          : 'border-white/5 focus:border-[#10b981]/40'
                      }`}
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={handleRemoveCoupon}
                        className="px-4 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-orbitron text-xs font-bold transition-all cursor-pointer"
                      >
                        REMOVE
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2.5 rounded-xl bg-[#10b981] text-slate-950 font-orbitron text-xs font-black uppercase tracking-wider hover:shadow-lg hover:shadow-[#10b981]/15 transition-all duration-300 cursor-pointer"
                      >
                        APPLY
                      </button>
                    )}
                  </div>

                  {/* Coupon Feedback Message */}
                  {couponMessage && (
                    <div className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200 ${
                      couponMessage.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      {couponMessage.type === 'success' ? (
                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-bold">{couponMessage.text}</p>
                        {couponMessage.subtext && (
                          <p className="opacity-80 text-[10px] mt-0.5">{couponMessage.subtext}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Available Coupons Section */}
                  <div className="space-y-2">
                    <span className="font-space text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Available Campaigns
                    </span>
                    
                    {/* Applicable List */}
                    {applicableCoupons.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {applicableCoupons.map((coupon) => (
                          <button
                            key={coupon.id}
                            onClick={() => handleSelectCoupon(coupon)}
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                              appliedCoupon?.id === coupon.id
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                : 'glass-panel border-white/5 hover:border-[#10b981]/30 hover:bg-[#10b981]/5 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-slate-900 border border-white/5 text-emerald-400">
                                {iconMap[coupon.iconName] || <Tag className="w-4 h-4 text-emerald-400" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-orbitron font-extrabold text-xs text-white group-hover:text-[#10b981] duration-300">
                                    {coupon.code}
                                  </span>
                                  <span className="text-[9px] font-space text-[#10b981] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-500/10 uppercase tracking-wider">
                                    {coupon.discount}
                                  </span>
                                </div>
                                <span className="font-outfit text-[10px] text-slate-400 block mt-0.5">
                                  {coupon.title}
                                </span>
                              </div>
                            </div>
                            
                            <span className="font-orbitron font-extrabold text-[10px] text-[#10b981] uppercase tracking-wider group-hover:translate-x-1 duration-300 flex items-center gap-1">
                              Apply <ChevronRight className="w-3 h-3" />
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3.5 text-center glass-panel rounded-xl border border-white/5 bg-slate-950/20 text-slate-500 font-orbitron text-[10px] font-bold uppercase tracking-wider">
                        No coupons applicable.
                      </div>
                    )}

                    {/* Non-applicable/Locked Coupons */}
                    {lockedCoupons.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <span className="font-space text-[9px] font-semibold text-slate-500 uppercase tracking-widest block">
                          Locked Rewards (Add Items to Unlock)
                        </span>
                        <div className="grid grid-cols-1 gap-2 opacity-60">
                          {lockedCoupons.map((coupon) => (
                            <div
                              key={coupon.id}
                              className="p-3 rounded-xl border border-white/5 glass-panel flex items-center justify-between text-slate-400 text-left"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-slate-950 border border-white/5 text-slate-600">
                                  {iconMap[coupon.iconName] || <Tag className="w-4 h-4 text-slate-600" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-orbitron font-extrabold text-xs text-slate-350">
                                      {coupon.code}
                                    </span>
                                    <span className="text-[9px] font-space text-slate-500 font-bold px-1.5 py-0.5 rounded-sm bg-slate-900 uppercase tracking-wider border border-white/5">
                                      {coupon.discount}
                                    </span>
                                  </div>
                                  <span className="font-outfit text-[9.5px] text-slate-500 block mt-0.5 leading-relaxed">
                                    {coupon.terms_conditions || coupon.description}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Billing Section */}
          {cartItems.length > 0 && checkoutStep !== 'address' && (
            <div className="px-6 py-6 border-t border-white/5 bg-[#0a0f0d]/30 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between font-outfit text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-orbitron font-medium text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between font-outfit text-xs text-[#10b981] animate-in fade-in duration-300">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#10b981]" /> Coupon Discount ({appliedCoupon?.code})
                    </span>
                    <span className="font-orbitron font-bold">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
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
                onClick={() => {
                  if (checkoutStep === 'cart') {
                    setCheckoutStep('address');
                  } else if (checkoutStep === 'review') {
                    onCheckout(discountAmount, appliedCoupon?.code, address);
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#10b981] via-emerald-500 to-teal-400 text-slate-950 font-orbitron font-bold text-sm tracking-widest shadow-lg shadow-[#10b981]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2.5 group font-extrabold"
              >
                {checkoutStep === 'review' ? (
                  <>
                    <Check className="w-4 h-4 animate-pulse" />
                    <span>PLACE ORDER</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 animate-pulse" />
                    <span>ENGAGE CHECKOUT</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
