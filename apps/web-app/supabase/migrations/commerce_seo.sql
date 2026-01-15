-- =====================================================
-- COMMERCE & SEO - Database Migration
-- TitanFit V2
-- =====================================================

-- ================================
-- COMMERCE SYSTEM
-- ================================

-- Product Categories
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES public.product_categories(id),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (Physical or Digital)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2), -- Original price for sales
    cost_price DECIMAL(10, 2), -- For profit calculation
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    track_quantity BOOLEAN DEFAULT true,
    quantity INTEGER DEFAULT 0,
    type VARCHAR(50) DEFAULT 'physical', -- 'physical', 'digital', 'service'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'archived'
    images JSONB DEFAULT '[]',
    category_id UUID REFERENCES public.product_categories(id),
    tags TEXT[],
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Bundles
CREATE TABLE IF NOT EXISTS public.product_bundles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) DEFAULT 'percentage', -- 'percentage', 'fixed_amount', 'fixed_price'
    discount_value DECIMAL(10, 2),
    price DECIMAL(10, 2), -- Calculated or fixed
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundle Items (M2M)
CREATE TABLE IF NOT EXISTS public.bundle_items (
    bundle_id UUID NOT NULL REFERENCES public.product_bundles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY(bundle_id, product_id)
);

-- Product Upsells / Cross-sells
CREATE TABLE IF NOT EXISTS public.product_upsells (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    upsell_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'upsell', -- 'upsell' (upgrade), 'cross_sell' (complementary)
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(parent_product_id, upsell_product_id)
);

-- ================================
-- SEO MANAGER
-- ================================

-- URL Redirects (301)
CREATE TABLE IF NOT EXISTS public.url_redirects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_path VARCHAR(255) NOT NULL UNIQUE,
    target_path VARCHAR(255) NOT NULL,
    status_code INTEGER DEFAULT 301, -- 301, 302, 307
    is_active BOOLEAN DEFAULT true,
    hits INTEGER DEFAULT 0,
    last_hit_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO Metadata Templates
CREATE TABLE IF NOT EXISTS public.seo_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    route_pattern VARCHAR(255) NOT NULL UNIQUE, -- e.g., '/products/*', '/blog/*'
    title_template VARCHAR(255), -- '{{title}} | TitanFit'
    meta_description_template TEXT,
    og_image_template TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- INDEXES & RLS
-- ================================

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_url_redirects_source ON public.url_redirects(source_path);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.url_redirects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Public read bundles" ON public.product_bundles FOR SELECT USING (true);
CREATE POLICY "Public read redirects" ON public.url_redirects FOR SELECT USING (true);

-- Admin write access (simplified for brevity, assumes admin checks in API)
-- In production, add explicit admin checks here
