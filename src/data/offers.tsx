import React from 'react';
import { Zap, Flame, Sparkles, Percent, Tag } from 'lucide-react';

export interface Offer {
  id: string;
  title: string;
  discount: string;
  code: string;
  appliesTo: string;
  description: string;
  gradientClass: string;
  accentColor: string;
  glowClass: string;
  iconName: string; // Stores key name for database mapping
  image: string;
  active?: boolean;
  terms_conditions?: string;
  expiry_date?: string;
}

export const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-4 h-4 text-[#10b981]" />,
  Flame: <Flame className="w-4 h-4 text-purple-400" />,
  Sparkles: <Sparkles className="w-4 h-4 text-rose-400" />,
  Percent: <Percent className="w-4 h-4 text-cyan-400" />,
  Tag: <Tag className="w-4 h-4 text-amber-400" />
};

export const mockOffers: Offer[] = [
  {
    id: 'off-1',
    title: 'VELOCITY KINETIC RUN',
    discount: '30% OFF',
    code: 'KINETIC30',
    appliesTo: 'ALL RUNNING GEAR',
    description: 'Supercharge your velocity. Maximize kinetic energy return with carbon-weave plates.',
    gradientClass: 'from-[#10b981] to-teal-400',
    accentColor: '#10b981',
    glowClass: 'shadow-[#10b981]/20',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800&auto=format&fit=crop',
    active: true,
    terms_conditions: 'Applies to all products inside the Running Category.',
    expiry_date: '2026-09-30'
  },
  {
    id: 'off-2',
    title: 'APEX CORE GYM UNIT',
    discount: '₹1,500 OFF',
    code: 'GYMPOWER15',
    appliesTo: 'GYM EQUIPMENT ABOVE ₹4,000',
    description: 'Elevate your core conditioning. Engineered cast steel plates and tactical dumbbells.',
    gradientClass: 'from-purple-500 to-indigo-600',
    accentColor: '#9d4edd',
    glowClass: 'shadow-purple-500/20',
    iconName: 'Flame',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    active: true,
    terms_conditions: 'Minimum cart value of ₹4,000 required on Gym Equipment.',
    expiry_date: '2026-10-15'
  },
  {
    id: 'off-3',
    title: 'CHAMPIONS FIELD DROP',
    discount: '25% OFF',
    code: 'CHAMP25',
    appliesTo: 'FOOTBALL & CRICKET SPECIAL',
    description: 'Claim your victory. Handcrafted English willow blade and composite thermo-bonded skins.',
    gradientClass: 'from-rose-500 to-orange-500',
    accentColor: '#f43f5e',
    glowClass: 'shadow-rose-500/20',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    active: true,
    terms_conditions: 'Valid only on Cricket Bats and Football items.',
    expiry_date: '2026-08-31'
  },
  {
    id: 'off-4',
    title: 'ZEN YOGA COOLDOWN',
    discount: 'FREE SLEEVE',
    code: 'ZENFLOW',
    appliesTo: 'WITH ANY HELIX PRO YOGA MAT',
    description: 'Restore your physical sync. High-density alignment mats and recovery accessories.',
    gradientClass: 'from-cyan-400 to-blue-500',
    accentColor: '#00f2fe',
    glowClass: 'shadow-cyan-400/20',
    iconName: 'Percent',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    active: true,
    terms_conditions: 'Get one free custom recovery strap sleeve with any Helix Pro Yoga Mat purchase.',
    expiry_date: '2026-12-31'
  }
];
