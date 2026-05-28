-- Supabase Database Initialization Migration
-- Created at: 2026-05-28

-- -------------------------------------------------------------
-- 1. Create Tables
-- -------------------------------------------------------------

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    brand TEXT DEFAULT 'FitForChampions',
    price INTEGER NOT NULL,
    discount_price INTEGER,
    stock INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    new_arrival BOOLEAN DEFAULT false,
    trending BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',
    specifications TEXT[] DEFAULT '{}',
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    banner_image TEXT,
    offer_type TEXT,
    offer_value TEXT NOT NULL,
    coupon_code TEXT UNIQUE NOT NULL,
    expiry_date TEXT,
    active BOOLEAN DEFAULT true,
    terms_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT,
    products JSONB NOT NULL, -- Array of {product: Product, quantity: number}
    total_amount INTEGER NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY, -- REFERENCES auth.users ON DELETE CASCADE handled on auth schema triggers
    username TEXT,
    email TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------
-- 2. Seed Initial Products Data
-- -------------------------------------------------------------

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000001', 'Carbon Kinetic Shoe', 'carbon-kinetic-shoe', 'Ultra-light carbon fiber sole running shoe with pneumatic nitrogen cushioning cells and dynamic mesh construction.', 'Running', 8999, 12, false, true, true, ARRAY['Carbon Fiber Plate', 'Nitrogen-Cushion', '8mm drop'], '/images/carbon_kinetic_shoe.png')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, new_arrival = EXCLUDED.new_arrival, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000002', 'Nexus Pro Dumbbell', 'nexus-pro-dumbbell', 'Precision machined polygonal dumbbell featuring a soft tactile grip handle and a neon impact-absorption plate.', 'Gym Equipment', 4499, 8, false, false, false, ARRAY['Hexagonal Anti-Roll', 'Anodized Steel', 'Custom weight rings'], '/images/nexus_pro_dumbbell.png')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000003', 'AeroPulse Basketball', 'aeropulse-basketball', 'Next-generation basketball featuring moisture-wicking composite skin and a self-balancing aerodynamic core.', 'Basketball', 3299, 15, false, true, true, ARRAY['Micro-Fiber Grip', 'Cyber-Seam Tech', 'Moisture-Wick'], '/images/aeropulse_basketball.png')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, new_arrival = EXCLUDED.new_arrival, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000004', 'Quantum Leather Football', 'quantum-leather-football', 'Composite aerodynamic skin football with reflective neon lace markings and an off-center balance ring.', 'Football', 2899, 20, false, false, false, ARRAY['Thermo-bonded skin', 'Neon-Lace tracking', 'Waterproof Core'], '/images/quantum_football.png')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000005', 'Zenith Aero Uniform', 'zenith-aero-uniform', 'Intelligent thermal-regulating compression wear crafted from sleek nano-fibers with integrated biometric sync panels.', 'Running', 4999, 15, false, true, true, ARRAY['Biometric Sync', 'Nano-Knit fibers', 'Thermal Control'], 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, new_arrival = EXCLUDED.new_arrival, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000006', 'HyperGrip Cricket Bat', 'hypergrip-cricket-bat', 'English willow blade infused with carbon fiber weaves and complete with an anti-vibration rubber sleeve grip.', 'Cricket', 7499, 5, false, false, false, ARRAY['Premium Willow', 'Carbon Fiber Spine', 'Flex handle'], '/images/hypergrip_cricket_bat.png')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000007', 'Pulse-Sync Smart Band', 'pulse-sync-smart-band', 'Sleek biometric sports tracker band featuring advanced vascular monitoring and real-time athletic feedback projection.', 'Gym Equipment', 5999, 10, false, true, true, ARRAY['Vascular tracking', 'Haptic feedback', '14-Day Battery'], 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, new_arrival = EXCLUDED.new_arrival, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000008', 'Vector Iron Kettlebell', 'vector-iron-kettlebell', 'Glossy textured solid kettlebell with wide handles, designed for high-velocity ballistic kinetic training.', 'Gym Equipment', 3899, 10, false, false, false, ARRAY['Powder-Coat Cast', 'Wide Handle Grip', 'Dynamic Balance'], '/images/vector_iron_kettlebell.png')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000009', 'HyperVelocity Sneakers', 'hypervelocity-sneakers', 'Premium aerodynamic track spike sneakers engineered with carbon launch plates and reactive neon foam sole systems.', 'Running', 12999, 6, false, true, true, ARRAY['Carbon Launch Plate', 'Reactive Foam', 'Adaptive spikes'], 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, new_arrival = EXCLUDED.new_arrival, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000010', 'Matrix Fiber Racket', 'matrix-fiber-racket', 'High-modulus carbon composite frame racket with premium tension cyber-strings for max velocity outputs.', 'Gym Equipment', 5199, 0, false, false, false, ARRAY['Carbon Nano-Tube', '30 lbs Tension', 'Vibration Damper'], 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, image = EXCLUDED.image;

INSERT INTO public.products (id, title, slug, description, category, price, stock, featured, new_arrival, trending, specifications, image)
VALUES
('00000000-0000-0000-0000-000000000011', 'Helix Pro Yoga Mat', 'helix-pro-yoga-mat', 'Eco-friendly thermoplastic elastomer mat with a high-density cushioning layer and laser-etched alignments.', 'Yoga', 1999, 25, false, false, false, ARRAY['TPE Eco-Material', 'Laser Alignment', '6mm High Cushion'], 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, price = EXCLUDED.price, stock = EXCLUDED.stock, image = EXCLUDED.image;

-- -------------------------------------------------------------
-- 3. Seed Initial Offers Data
-- -------------------------------------------------------------

INSERT INTO public.offers (id, title, description, banner_image, offer_type, offer_value, coupon_code, expiry_date, active, terms_conditions)
VALUES
('00000000-0000-0000-0000-000000000101', 'VELOCITY KINETIC RUN', 'Supercharge your velocity. Maximize kinetic energy return with carbon-weave plates.', 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800&auto=format&fit=crop', 'percentage', '30% OFF', 'KINETIC30', '2026-09-30', true, 'Applies to all products inside the Running Category.')
ON CONFLICT (coupon_code) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, offer_value = EXCLUDED.offer_value, banner_image = EXCLUDED.banner_image;

INSERT INTO public.offers (id, title, description, banner_image, offer_type, offer_value, coupon_code, expiry_date, active, terms_conditions)
VALUES
('00000000-0000-0000-0000-000000000102', 'APEX CORE GYM UNIT', 'Elevate your core conditioning. Engineered cast steel plates and tactical dumbbells.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop', 'fixed', '₹1,500 OFF', 'GYMPOWER15', '2026-10-15', true, 'Minimum cart value of ₹4,000 required on Gym Equipment.')
ON CONFLICT (coupon_code) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, offer_value = EXCLUDED.offer_value, banner_image = EXCLUDED.banner_image;

INSERT INTO public.offers (id, title, description, banner_image, offer_type, offer_value, coupon_code, expiry_date, active, terms_conditions)
VALUES
('00000000-0000-0000-0000-000000000103', 'CHAMPIONS FIELD DROP', 'Claim your victory. Handcrafted English willow blade and composite thermo-bonded skins.', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop', 'percentage', '25% OFF', 'CHAMP25', '2026-08-31', true, 'Valid only on Cricket Bats and Football items.')
ON CONFLICT (coupon_code) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, offer_value = EXCLUDED.offer_value, banner_image = EXCLUDED.banner_image;

INSERT INTO public.offers (id, title, description, banner_image, offer_type, offer_value, coupon_code, expiry_date, active, terms_conditions)
VALUES
('00000000-0000-0000-0000-000000000104', 'ZEN YOGA COOLDOWN', 'Restore your physical sync. High-density alignment mats and recovery accessories.', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop', 'free_gift', 'FREE SLEEVE', 'ZENFLOW', '2026-12-31', true, 'Get one free custom recovery strap sleeve with any Helix Pro Yoga Mat purchase.')
ON CONFLICT (coupon_code) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, offer_value = EXCLUDED.offer_value, banner_image = EXCLUDED.banner_image;

-- -------------------------------------------------------------
-- 4. Enable Row Level Security (RLS) Policies
-- -------------------------------------------------------------

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated admin all access to products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access to offers" ON public.offers;
DROP POLICY IF EXISTS "Allow authenticated admin all access to offers" ON public.offers;
DROP POLICY IF EXISTS "Allow public to place orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated admin all access to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated admin access to admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow authenticated admin access to analytics" ON public.analytics;

-- Products Policies
CREATE POLICY "Allow public read access to products"
    ON public.products FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated admin all access to products"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Offers Policies
CREATE POLICY "Allow public read access to offers"
    ON public.offers FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated admin all access to offers"
    ON public.offers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Orders Policies
CREATE POLICY "Allow public to place orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated admin all access to orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Admin Users Policies
CREATE POLICY "Allow authenticated admin access to admin_users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Analytics Policies
CREATE POLICY "Allow authenticated admin access to analytics"
    ON public.analytics FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- -------------------------------------------------------------
-- 5. Enable Realtime Publications
-- -------------------------------------------------------------

-- Recreate publication changes
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.products, public.offers, public.orders;
COMMIT;
