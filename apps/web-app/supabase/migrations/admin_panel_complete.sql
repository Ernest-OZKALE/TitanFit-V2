-- =====================================================
-- ADMIN PANEL - Complete Database Schema
-- TitanFit V2 - Full CMS Functionality
-- =====================================================

-- ================================
-- PROMO CODES SYSTEM
-- ================================

CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage', 'fixed', 'free_trial'
    discount_value DECIMAL(10, 2) NOT NULL, -- pourcentage ou montant
    max_uses INTEGER, -- null = illimité
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    minimum_purchase DECIMAL(10, 2) DEFAULT 0,
    applicable_plans TEXT[], -- ['monthly', 'yearly', 'lifetime'] ou null = tous
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log d'utilisation des codes promo
CREATE TABLE IF NOT EXISTS public.promo_code_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id VARCHAR(255), -- Stripe payment intent ou order ID
    discount_applied DECIMAL(10, 2),
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- USER ROLES & PERMISSIONS
-- ================================

-- Rôles personnalisés
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- 'vip', 'beta_tester', 'influencer', 'coach', 'admin', 'super_admin'
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]', -- Liste des permissions
    badge_color VARCHAR(20) DEFAULT '#D4AF37',
    badge_icon VARCHAR(50),
    priority INTEGER DEFAULT 0, -- Pour l'affichage (le plus haut en premier)
    is_system BOOLEAN DEFAULT false, -- Rôles système non supprimables
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attribution des rôles aux utilisateurs
CREATE TABLE IF NOT EXISTS public.user_role_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.user_roles(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- null = permanent
    reason TEXT,
    UNIQUE(user_id, role_id)
);

-- ================================
-- VIP / SUBSCRIPTION STATUS
-- ================================

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL, -- 'free', 'premium', 'elite', 'lifetime'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'trial'
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ================================
-- ADMIN ACTIVITY LOGS
-- ================================

CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'grant_role', 'revoke_role', etc.
    target_type VARCHAR(50), -- 'user', 'promo_code', 'content', 'settings'
    target_id UUID,
    target_email VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- CONTENT MANAGEMENT
-- ================================

CREATE TABLE IF NOT EXISTS public.cms_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    content_type VARCHAR(50) DEFAULT 'page', -- 'page', 'article', 'faq', 'announcement'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    featured_image TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    author_id UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- GLOBAL SETTINGS
-- ================================

CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general', -- 'general', 'features', 'payments', 'notifications'
    is_public BOOLEAN DEFAULT false, -- Accessible côté client
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- INDEXES
-- ================================

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON public.promo_codes(is_active, valid_until);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user ON public.user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_date ON public.admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_content_slug ON public.cms_content(slug);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON public.user_subscriptions(user_id);

-- ================================
-- RLS POLICIES
-- ================================

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Admin only policies (à ajuster selon votre logique d'admin)
CREATE POLICY "Admins can manage promo codes"
    ON public.promo_codes FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        JOIN public.user_roles ur ON ura.role_id = ur.id
        WHERE ura.user_id = auth.uid() AND ur.name IN ('admin', 'super_admin')
    ));

-- Users can see their own subscriptions
CREATE POLICY "Users can view own subscription"
    ON public.user_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Public content visible to all
CREATE POLICY "Published content is public"
    ON public.cms_content FOR SELECT
    USING (status = 'published');

-- Public settings visible to all
CREATE POLICY "Public settings are visible"
    ON public.app_settings FOR SELECT
    USING (is_public = true);

-- ================================
-- INITIAL DATA
-- ================================

-- Insert default roles
INSERT INTO public.user_roles (name, display_name, description, badge_color, priority, is_system) VALUES
    ('super_admin', 'Super Admin', 'Accès total au système', '#FF0000', 100, true),
    ('admin', 'Admin', 'Gestion des utilisateurs et contenu', '#D4AF37', 90, true),
    ('moderator', 'Modérateur', 'Modération du contenu et communauté', '#8B5CF6', 80, true),
    ('vip', 'VIP', 'Accès prioritaire et avantages exclusifs', '#D4AF37', 70, false),
    ('beta_tester', 'Beta Tester', 'Accès aux fonctionnalités en beta', '#10B981', 60, false),
    ('influencer', 'Influencer', 'Créateur de contenu partenaire', '#EC4899', 50, false),
    ('coach', 'Coach', 'Coach certifié TitanFit', '#3B82F6', 40, false)
ON CONFLICT (name) DO NOTHING;

-- Insert default settings
INSERT INTO public.app_settings (key, value, description, category, is_public) VALUES
    ('maintenance_mode', 'false', 'Activer le mode maintenance', 'general', false),
    ('registration_enabled', 'true', 'Permettre les nouvelles inscriptions', 'general', true),
    ('trial_days', '7', 'Nombre de jours d''essai gratuit', 'payments', false),
    ('default_language', '"fr"', 'Langue par défaut', 'general', true),
    ('features_ai_coach', 'true', 'Activer le coach IA', 'features', true),
    ('features_social', 'true', 'Activer les fonctionnalités sociales', 'features', true),
    ('features_challenges', 'true', 'Activer les défis mensuels', 'features', true)
ON CONFLICT (key) DO NOTHING;
