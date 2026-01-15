-- =====================================================
-- NEWSLETTER & A/B TESTING - Database Migration
-- TitanFit V2
-- =====================================================

-- ================================
-- NEWSLETTER SYSTEM
-- ================================

-- Newsletter campaigns
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    preview_text VARCHAR(255),
    content_html TEXT NOT NULL,
    content_json JSONB, -- For drag-and-drop builder state
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'cancelled'
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    target_segments JSONB, -- Client tags to target
    total_recipients INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_unsubscribed INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers (separate from users for guests)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
    source VARCHAR(50), -- 'signup', 'homepage', 'checkout', 'import'
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter send log
CREATE TABLE IF NOT EXISTS public.newsletter_sends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.newsletter_campaigns(id) ON DELETE CASCADE,
    subscriber_id UUID NOT NULL REFERENCES public.newsletter_subscribers(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained'
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    click_count INTEGER DEFAULT 0,
    user_agent TEXT,
    ip_address VARCHAR(50),
    UNIQUE(campaign_id, subscriber_id)
);

-- ================================
-- A/B TESTING SYSTEM
-- ================================

-- A/B Test experiments
CREATE TABLE IF NOT EXISTS public.ab_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_type VARCHAR(50) NOT NULL, -- 'email_subject', 'email_content', 'landing_page', 'cta_button', 'pricing', 'feature'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'running', 'paused', 'completed', 'cancelled'
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    winner_variant_id UUID,
    traffic_split INTEGER DEFAULT 50, -- % for each variant (50/50 by default)
    target_metric VARCHAR(50) DEFAULT 'conversion', -- 'conversion', 'clicks', 'signups', 'revenue'
    min_sample_size INTEGER DEFAULT 100,
    confidence_level INTEGER DEFAULT 95, -- 95% or 99%
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B Test variants
CREATE TABLE IF NOT EXISTS public.ab_test_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Control', 'Variant A', 'Variant B'
    is_control BOOLEAN DEFAULT false,
    content JSONB NOT NULL, -- Variant-specific content (subject line, HTML, etc.)
    traffic_weight INTEGER DEFAULT 50, -- % of traffic
    impressions INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B Test participant tracking
CREATE TABLE IF NOT EXISTS public.ab_test_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.ab_test_variants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    session_id VARCHAR(255),
    converted BOOLEAN DEFAULT false,
    conversion_value DECIMAL(10, 2),
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(test_id, user_id),
    UNIQUE(test_id, session_id)
);

-- ================================
-- INDEXES
-- ================================

CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON public.newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_campaign ON public.newsletter_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test ON public.ab_test_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_participants_test ON public.ab_test_participants(test_id);

-- ================================
-- RLS
-- ================================

ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_participants ENABLE ROW LEVEL SECURITY;

-- Subscribers can manage their own subscription
CREATE POLICY "Users manage own subscription"
    ON public.newsletter_subscribers FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL);
