import type { Product } from '../components/ui/ProductCard';

// Real product images from successfully generated assets and high-fidelity Unsplash listings
const imgShoe = '/images/carbon_kinetic_shoe.png';
const imgDumbbell = '/images/nexus_pro_dumbbell.png';
const imgBasketball = '/images/aeropulse_basketball.png';
const imgFootball = '/images/quantum_football.png';
const imgCricketBat = '/images/hypergrip_cricket_bat.png';
const imgKettlebell = '/images/vector_iron_kettlebell.png';
const imgRacket = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop';
const imgYogaMat = 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop';

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Carbon Kinetic Shoe',
    description: 'Ultra-light carbon fiber sole running shoe with pneumatic nitrogen cushioning cells and dynamic mesh construction.',
    price: 8999,
    rating: 4.9,
    category: 'Running',
    image: imgShoe,
    stockCount: 12,
    specs: ['Carbon Fiber Plate', 'Nitrogen-Cushion', '8mm drop'],
    isNewArrival: true
  },
  {
    id: 'prod-2',
    name: 'Nexus Pro Dumbbell',
    description: 'Precision machined polygonal dumbbell featuring a soft tactile grip handle and a neon impact-absorption plate.',
    price: 4499,
    rating: 4.8,
    category: 'Gym Equipment',
    image: imgDumbbell,
    stockCount: 8,
    specs: ['Hexagonal Anti-Roll', 'Anodized Steel', 'Custom weight rings']
  },
  {
    id: 'prod-3',
    name: 'AeroPulse Basketball',
    description: 'Next-generation basketball featuring moisture-wicking composite skin and a self-balancing aerodynamic core.',
    price: 3299,
    rating: 4.7,
    category: 'Basketball',
    image: imgBasketball,
    stockCount: 15,
    specs: ['Micro-Fiber Grip', 'Cyber-Seam Tech', 'Moisture-Wick'],
    isNewArrival: true
  },
  {
    id: 'prod-4',
    name: 'Quantum Leather Football',
    description: 'Composite aerodynamic skin football with reflective neon lace markings and an off-center balance ring.',
    price: 2899,
    rating: 4.6,
    category: 'Football',
    image: imgFootball,
    stockCount: 20,
    specs: ['Thermo-bonded skin', 'Neon-Lace tracking', 'Waterproof Core']
  },
  {
    id: 'prod-new-1',
    name: 'Zenith Aero Uniform',
    description: 'Intelligent thermal-regulating compression wear crafted from sleek nano-fibers with integrated biometric sync panels.',
    price: 4999,
    rating: 4.8,
    category: 'Running',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    stockCount: 15,
    specs: ['Biometric Sync', 'Nano-Knit fibers', 'Thermal Control'],
    isNewArrival: true
  },
  {
    id: 'prod-5',
    name: 'HyperGrip Cricket Bat',
    description: 'English willow blade infused with carbon fiber weaves and complete with an anti-vibration rubber sleeve grip.',
    price: 7499,
    rating: 4.9,
    category: 'Cricket',
    image: imgCricketBat,
    stockCount: 5,
    specs: ['Premium Willow', 'Carbon Fiber Spine', 'Flex handle']
  },
  {
    id: 'prod-new-2',
    name: 'Pulse-Sync Smart Band',
    description: 'Sleek biometric sports tracker band featuring advanced vascular monitoring and real-time athletic feedback projection.',
    price: 5999,
    rating: 4.7,
    category: 'Gym Equipment',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop',
    stockCount: 10,
    specs: ['Vascular tracking', 'Haptic feedback', '14-Day Battery'],
    isNewArrival: true
  },
  {
    id: 'prod-6',
    name: 'Vector Iron Kettlebell',
    description: 'Glossy textured solid kettlebell with wide handles, designed for high-velocity ballistic kinetic training.',
    price: 3899,
    rating: 4.8,
    category: 'Gym Equipment',
    image: imgKettlebell,
    stockCount: 10,
    specs: ['Powder-Coat Cast', 'Wide Handle Grip', 'Dynamic Balance']
  },
  {
    id: 'prod-new-3',
    name: 'HyperVelocity Sneakers',
    description: 'Premium aerodynamic track spike sneakers engineered with carbon launch plates and reactive neon foam sole systems.',
    price: 12999,
    rating: 4.9,
    category: 'Running',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    stockCount: 6,
    specs: ['Carbon Launch Plate', 'Reactive Foam', 'Adaptive spikes'],
    isNewArrival: true
  },
  {
    id: 'prod-7',
    name: 'Matrix Fiber Racket',
    description: 'High-modulus carbon composite frame racket with premium tension cyber-strings for max velocity outputs.',
    price: 5199,
    rating: 4.7,
    category: 'Gym Equipment',
    image: imgRacket,
    stockCount: 0, // Mock out of stock
    specs: ['Carbon Nano-Tube', '30 lbs Tension', 'Vibration Damper']
  },
  {
    id: 'prod-8',
    name: 'Helix Pro Yoga Mat',
    description: 'Eco-friendly thermoplastic elastomer mat with a high-density cushioning layer and laser-etched alignments.',
    price: 1999,
    rating: 4.5,
    category: 'Yoga',
    image: imgYogaMat,
    stockCount: 25,
    specs: ['TPE Eco-Material', 'Laser Alignment', '6mm High Cushion']
  }
];

