import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';

const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.488 2.02 14.024.995 11.4 1.002c-5.438 0-9.864 4.372-9.869 9.803-.002 1.73.456 3.42 1.32 4.928l-.995 3.634 3.737-.977zm11.367-7.251c-.33-.164-1.953-.964-2.253-1.074-.3-.109-.519-.164-.738.164-.219.329-.85 1.074-1.041 1.293-.19.219-.382.246-.712.082-.33-.164-1.393-.513-2.653-1.637-1.01-.9-1.691-2.013-1.89-2.342-.19-.329-.02-.507.145-.671.149-.147.33-.384.495-.576.165-.191.219-.329.33-.548.11-.219.055-.411-.027-.575-.082-.164-.738-1.782-1.01-2.441-.266-.641-.539-.555-.738-.565-.19-.01-.409-.01-.628-.01-.219 0-.576.082-.877.411-.3.329-1.148 1.123-1.148 2.738 0 1.614 1.175 3.178 1.339 3.397.164.22 2.313 3.533 5.602 4.954.783.339 1.395.541 1.872.692.786.25 1.5.215 2.066.13.63-.094 1.953-.799 2.227-1.571.274-.773.274-1.436.191-1.571-.082-.136-.3-.219-.63-.383z"/>
  </svg>
);

export const FloatingCallButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex items-center gap-3.5 select-none pointer-events-none">
      {/* 1. Phone Call Action Button */}
      <motion.a
        href="tel:9579722268"
        className="pointer-events-auto flex items-center justify-center bg-slate-950/80 backdrop-blur-md border border-[#10b981]/30 hover:border-[#10b981]/80 text-[#10b981] hover:text-slate-950 rounded-full h-14 w-14 hover:w-36 transition-all duration-500 ease-out shadow-lg shadow-[#10b981]/10 hover:shadow-[#10b981]/30 group cursor-pointer overflow-hidden relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#10b981] to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0" />
        <div className="relative z-10 flex items-center justify-center font-orbitron font-extrabold text-[10px] tracking-widest uppercase">
          <PhoneCall className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300 ease-out" />
          <span className="max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-500 ease-out whitespace-nowrap overflow-hidden font-black text-slate-950">
            CALL NOW
          </span>
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/5 text-[9px] font-space text-slate-400 font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 scale-90 group-hover:scale-100 whitespace-nowrap z-50 shadow-md">
          <span>Connect Phone</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-2 h-2 rotate-45 bg-slate-950 border-r border-b border-white/5" />
        </div>
      </motion.a>

      {/* 2. WhatsApp Action Button */}
      <motion.a
        href="https://wa.me/919579722268?text=Hello%20I%20am%20interested%20in%20your%20products"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center justify-center bg-slate-950/80 backdrop-blur-md border border-[#25D366]/30 hover:border-[#25D366]/80 text-[#25D366] hover:text-slate-950 rounded-full h-14 w-14 hover:w-36 transition-all duration-500 ease-out shadow-lg shadow-[#25D366]/10 hover:shadow-[#25D366]/30 group cursor-pointer overflow-hidden relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -8, 0] }}
        // Slightly offset bounce from the call button for high-fidelity interactive feel!
        transition={{ y: { duration: 3, delay: 0.3, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#25D366] to-[#128C7E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0" />
        <div className="relative z-10 flex items-center justify-center font-orbitron font-extrabold text-[10px] tracking-widest uppercase">
          <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 ease-out" />
          <span className="max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-500 ease-out whitespace-nowrap overflow-hidden font-black text-slate-950">
            CHAT NOW
          </span>
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/5 text-[9px] font-space text-slate-400 font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 scale-90 group-hover:scale-100 whitespace-nowrap z-50 shadow-md">
          <span>Connect WhatsApp</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-2 h-2 rotate-45 bg-slate-950 border-r border-b border-white/5" />
        </div>
      </motion.a>
    </div>
  );
};
