import React, { useState } from 'react';
import { Send, Share2, Camera, Tv, Compass, Mail, Phone, MapPin, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative w-full border-t border-white/5 bg-[#050806]/90 backdrop-blur-xl mt-24 overflow-hidden z-10">
      {/* Dynamic Background Neon Light Lines in Footer */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-[#10b981] to-transparent shadow-lg" />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#10b981]/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* BRAND INFO */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-[#10b981] to-teal-400 p-[1px] flex items-center justify-center">
              <div className="w-full h-full rounded-[8px] bg-slate-950 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#10b981] group-hover:rotate-180 transition-transform duration-500" />
              </div>
            </div>
            <span className="font-orbitron font-extrabold text-lg tracking-wider text-white">
              APEX<span className="text-transparent bg-clip-text bg-linear-to-r from-[#10b981] to-teal-400 font-black">GEAR</span>
            </span>
          </div>
          <p className="font-outfit text-xs text-slate-400 leading-relaxed">
            The next evolution in athletic support and high-performance equipment. Optimized for peak kinetic outputs.
          </p>
          
          {/* Socials */}
          <div className="flex items-center space-x-3 pt-3">
            {[
              { icon: <Share2 className="w-4 h-4" />, color: 'hover:text-sky-400 hover:border-sky-400/40 hover:bg-sky-400/5' },
              { icon: <Camera className="w-4 h-4" />, color: 'hover:text-pink-500 hover:border-pink-500/40 hover:bg-pink-500/5' },
              { icon: <Tv className="w-4 h-4" />, color: 'hover:text-rose-600 hover:border-rose-600/40 hover:bg-rose-600/5' },
              { icon: <Compass className="w-4 h-4" />, color: 'hover:text-[#10b981] hover:border-[#10b981]/40 hover:bg-[#10b981]/5' },
            ].map((soc, idx) => (
              <a 
                key={idx} 
                href="#" 
                className={`w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 ${soc.color}`}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-4">
          <h4 className="font-orbitron font-extrabold text-xs text-white uppercase tracking-widest">
            CORE PLATFORM
          </h4>
          <ul className="space-y-2 font-space text-xs text-slate-400 font-medium">
            {['Home Base', 'Store Access', 'Categories', 'Premium Gear', 'Science R&D'].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-[#10b981] transition-colors flex items-center group">
                  <span className="w-0 h-[1.5px] bg-[#10b981] mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT DATA */}
        <div className="space-y-4">
          <h4 className="font-orbitron font-extrabold text-xs text-white uppercase tracking-widest">
            LAB CHANNELS
          </h4>
          <ul className="space-y-3 font-outfit text-xs text-slate-400">
            <li className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-[#10b981] shrink-0" />
              <span>support@apexgear.cyber</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-[#10b981] shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-[#10b981] shrink-0" />
              <span>Orbit Research Labs, Sector 94</span>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="space-y-4">
          <h4 className="font-orbitron font-extrabold text-xs text-white uppercase tracking-widest">
            KINETIC INJECTIONS
          </h4>
          <p className="font-outfit text-xs text-slate-400 leading-relaxed">
            Subscribe to receive premium engineering breakthroughs and secret inventory updates.
          </p>

          <form onSubmit={handleSubscribe} className="relative flex items-center mt-3">
            <input 
              type="email" 
              required
              placeholder="Inject your email..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0f0d]/60 border border-white/10 focus:border-[#10b981]/50 focus:bg-[#0a0f0d]/90 rounded-xl px-4 py-2.5 text-xs text-white outline-hidden transition-all pr-12 font-space shadow-xs"
            />
            <button 
              type="submit" 
              className="absolute right-1.5 p-1.5 rounded-lg bg-linear-to-r from-emerald-600 to-teal-500 text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {subscribed && (
            <p className="text-[10px] font-space font-bold text-emerald-500 animate-pulse">
              SYNCED. Welcome to the elite roster.
            </p>
          )}
        </div>
      </div>

      <div className="w-full border-t border-white/5 py-6 text-center z-10 relative">
        <p className="font-orbitron text-[10px] font-bold tracking-widest text-slate-500">
          © 2026 APEX_GEAR LABS. ALL KINETIC PATENTS RESERVED.
        </p>
      </div>
    </footer>
  );
};
