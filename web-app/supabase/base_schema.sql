-- TitanFit V2 - Fix Profiles Table
-- This adds missing columns to the existing profiles table

-- Add missing columns to profiles if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create content_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    status TEXT DEFAULT 'draft',
    author_id UUID REFERENCES public.profiles(id),
    featured_image TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create media table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    size BIGINT,
    alt_text TEXT,
    title TEXT,
    description TEXT,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
    DROP POLICY IF EXISTS "Only authenticated users can modify products" ON public.products;
    DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
    DROP POLICY IF EXISTS "Only authenticated users can create orders" ON public.orders;
    DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON public.content_posts;
    DROP POLICY IF EXISTS "Only authenticated users can create posts" ON public.content_posts;
    DROP POLICY IF EXISTS "Media is viewable by everyone" ON public.media;
    DROP POLICY IF EXISTS "Authenticated users can upload media" ON public.media;
    DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.site_settings;
    DROP POLICY IF EXISTS "Only authenticated users can modify settings" ON public.site_settings;
END $$;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can modify products" ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only authenticated users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Content posts policies
CREATE POLICY "Published posts are viewable by everyone" ON public.content_posts FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can create posts" ON public.content_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Media policies
CREATE POLICY "Media is viewable by everyone" ON public.media FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload media" ON public.media FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Settings policies
CREATE POLICY "Settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can modify settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_posts_slug ON public.content_posts(slug);

DO $$
BEGIN
    RAISE NOTICE '✅ Schema migration completed successfully!';
    RAISE NOTICE '📊 Tables ready: profiles (updated), products, orders, content_posts, media, site_settings';
    RAISE NOTICE '';
    RAISE NOTICE '🔜 Next: Run seed.sql to add demo data';
END $$;
