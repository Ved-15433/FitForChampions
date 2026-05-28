import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Cpu } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'py-4 glass-panel border-b border-white/10 shadow-lg' 
        : 'py-6 bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#10b981] to-teal-400 p-[1px] flex items-center justify-center shadow-lg group-hover:shadow-[#10b981]/20 duration-300">
            <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#10b981] group-hover:rotate-180 transition-transform duration-700" />
            </div>
          </div>
          <span className="font-orbitron font-extrabold text-xl tracking-wider text-white">
            APEX<span className="text-transparent bg-clip-text bg-linear-to-r from-[#10b981] to-teal-400 font-black">GEAR</span>
          </span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center space-x-8 font-space font-medium text-sm tracking-wide text-slate-300">
          {['Home', 'Shop', 'Categories', 'New Arrivals', 'Contact'].map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="relative py-2 transition-colors duration-300 hover:text-white group"
            >
              {link}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-linear-to-r from-[#10b981] to-teal-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center space-x-4">
          {/* Cart Button */}
          <button 
            onClick={onCartClick}
            className="relative p-2.5 rounded-xl border border-white/10 hover:border-[#10b981]/50 hover:bg-[#10b981]/5 transition-all duration-300 cursor-pointer group flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 text-slate-300 group-hover:text-[#10b981] transition-colors" />
            
            {/* Live Count Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 rounded-full bg-linear-to-r from-[#10b981] to-teal-400 text-slate-950 text-[10px] font-orbitron font-bold flex items-center justify-center animate-pulse border border-[#050806]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-white/10 text-slate-300 hover:text-[#10b981] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-panel border-b border-white/10 p-6 flex flex-col space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-300">
          {['Home', 'Shop', 'Categories', 'New Arrivals', 'Contact'].map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMobileMenuOpen(false)}
              className="font-space text-lg font-semibold text-slate-200 hover:text-[#10b981] transition-colors py-2 border-b border-white/5"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
