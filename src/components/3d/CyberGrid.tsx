import React from 'react';

export const CyberGrid: React.FC = () => {
  return (
    <div className="cyber-grid-container">
      {/* Static perspective grid lines */}
      <div className="perspective-grid" />
      
      {/* Background glow orbs for ambient fog */}
      <div className="cyber-glow-orb top-[-10%] left-[-10%] bg-emerald-500/10" />
      <div className="cyber-glow-orb bottom-[10%] right-[-10%] bg-emerald-500/5" />
      <div className="cyber-glow-orb top-[40%] left-[60%] bg-teal-500/5" />
    </div>
  );
};

