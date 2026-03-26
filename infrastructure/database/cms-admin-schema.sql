-- TitanFit CMS Admin - Schéma de Base de Données Étendu
-- À exécuter dans l'éditeur SQL Supabase après le schéma initial.

-- ============================================================================
-- 1. PROFILS : Ajout du système de rôles
-- ============================================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Mise à jour des utilisateurs existants vers le rôle 'user' par défaut
UPDATE profiles SET role = 'user' WHERE role IS NULL;

-- ============================================================================
-- 2. PRODUITS (Suppléments, Programmes, Équipement)
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_usd DECIMAL(10,2),
  price_coins INTEGER,
  category TEXT, -- 'supplement', 'program', 'equipment'
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. COMMANDES & ARTICLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'cancelled', 'refunded'
  payment_method TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. GESTION DE CONTENU (Articles Blog, Vidéos, Pages)
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id),
  category TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'scheduled'
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. PARAMÈTRES DU SITE
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  type TEXT, -- 'string', 'number', 'boolean', 'json'
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des paramètres par défaut (uniquement si inexistants)
INSERT INTO site_settings (key, value, type, description) VALUES
  ('site_name', 'TitanFit', 'string', 'Nom du site Web'),
  ('site_description', 'Votre Voyage Fitness', 'string', 'Slogan du site'),
  ('currency', 'EUR', 'string', 'Devise par défaut'),
  ('coins_per_euro', '100', 'number', 'Taux de conversion'),
  ('maintenance_mode', 'false', 'boolean', 'Statut de maintenance du site')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- 6. SÉCURITÉ (ROW LEVEL SECURITY)
-- ============================================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Suppression des anciennes politiques pour éviter les doublons
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can view published posts" ON content_posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON content_posts;
DROP POLICY IF EXISTS "Anyone can view settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON site_settings;

-- Produits : Lecture publique, écriture réservée aux admins
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Commandes : Les utilisateurs voient les leurs, les admins voient tout
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Articles de commande : Identique aux commandes
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Contenu : Lecture publique si publié, écriture réservée aux admins
CREATE POLICY "Anyone can view published posts" ON content_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage posts" ON content_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Paramètres : Lecture publique, modification réservée aux admins
CREATE POLICY "Anyone can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 7. OPTIMISATION (INDEXES)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_status ON content_posts(status);
CREATE INDEX IF NOT EXISTS idx_content_posts_slug ON content_posts(slug);

-- ============================================================================
-- TERMINÉ ! Note : Pour nommer un admin :
-- UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
-- ============================================================================
