-- =====================================================
-- EMAIL TEMPLATES - Database Migration
-- TitanFit V2 - Customizable Email System
-- =====================================================

-- Email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE, -- 'welcome', 'password_reset', 'subscription_confirmed', etc.
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT, -- Plain text fallback
    variables JSONB DEFAULT '[]', -- Available variables like {{user_name}}, {{reset_link}}
    category VARCHAR(50) DEFAULT 'transactional', -- 'transactional', 'marketing', 'notification'
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email sending logs
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES public.email_templates(id),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_user_id UUID REFERENCES auth.users(id),
    subject VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'bounced'
    error_message TEXT,
    provider VARCHAR(50), -- 'resend', 'sendgrid', 'mailgun'
    provider_message_id VARCHAR(255),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client tags for segmentation
CREATE TABLE IF NOT EXISTS public.client_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20) DEFAULT '#D4AF37',
    description TEXT,
    auto_assign_rules JSONB, -- Rules for auto-tagging
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-tag associations
CREATE TABLE IF NOT EXISTS public.user_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.client_tags(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tag_id)
);

-- User activity timeline
CREATE TABLE IF NOT EXISTS public.user_activity_timeline (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'login', 'workout_logged', 'meal_logged', 'achievement', 'subscription_change', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id),
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'general', -- 'general', 'billing', 'technical', 'feature_request', 'bug'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'waiting_customer', 'resolved', 'closed'
    assigned_to UUID REFERENCES auth.users(id),
    first_response_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    satisfaction_rating INTEGER, -- 1-5
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket messages
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id),
    sender_type VARCHAR(20) DEFAULT 'customer', -- 'customer', 'agent', 'system'
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_internal BOOLEAN DEFAULT false, -- Internal notes not visible to customer
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flash promotions / limited time offers
CREATE TABLE IF NOT EXISTS public.flash_promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    promo_code_id UUID REFERENCES public.promo_codes(id),
    discount_percentage INTEGER,
    discount_amount DECIMAL(10, 2),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    max_claims INTEGER,
    current_claims INTEGER DEFAULT 0,
    target_segments JSONB, -- Client tags to target
    banner_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_template ON public.email_logs(template_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_user ON public.user_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON public.user_activity_timeline(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.support_tickets(status);

-- RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_promotions ENABLE ROW LEVEL SECURITY;

-- Users can see their own activity
CREATE POLICY "Users see own activity"
    ON public.user_activity_timeline FOR SELECT
    USING (auth.uid() = user_id);

-- Users can see their own tickets
CREATE POLICY "Users see own tickets"
    ON public.support_tickets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
    ON public.support_tickets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can see messages on their tickets
CREATE POLICY "Users see ticket messages"
    ON public.ticket_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.support_tickets t 
            WHERE t.id = ticket_id AND t.user_id = auth.uid()
        )
        AND is_internal = false
    );

-- Insert default email templates
INSERT INTO public.email_templates (slug, name, subject, body_html, variables, category) VALUES
    ('welcome', 'Email de bienvenue', 'Bienvenue sur TitanFit, {{user_name}}!', 
     '<h1>Bienvenue {{user_name}}!</h1><p>Nous sommes ravis de vous accueillir sur TitanFit.</p>', 
     '["user_name", "email"]', 'transactional'),
    
    ('password_reset', 'Réinitialisation mot de passe', 'Réinitialisez votre mot de passe TitanFit',
     '<h1>Réinitialisation</h1><p>Cliquez sur ce lien: <a href="{{reset_link}}">Réinitialiser</a></p>',
     '["user_name", "reset_link"]', 'transactional'),
    
    ('subscription_confirmed', 'Abonnement confirmé', 'Bienvenue dans TitanFit Premium!',
     '<h1>Merci {{user_name}}!</h1><p>Votre abonnement {{plan_name}} est maintenant actif.</p>',
     '["user_name", "plan_name", "amount"]', 'transactional'),
    
    ('workout_reminder', 'Rappel entraînement', 'C''est l''heure de s''entraîner!',
     '<h1>Hey {{user_name}}!</h1><p>N''oubliez pas votre entraînement aujourd''hui.</p>',
     '["user_name"]', 'notification'),
    
    ('achievement_unlocked', 'Nouveau badge débloqué', 'Félicitations! Nouveau badge: {{badge_name}}',
     '<h1>Bravo {{user_name}}!</h1><p>Vous avez débloqué le badge {{badge_name}}!</p>',
     '["user_name", "badge_name", "badge_description"]', 'notification')
ON CONFLICT (slug) DO NOTHING;

-- Insert default client tags
INSERT INTO public.client_tags (name, color, description) VALUES
    ('VIP', '#D4AF37', 'Clients premium à haute valeur'),
    ('Nouveau', '#10B981', 'Inscrit dans les 30 derniers jours'),
    ('Inactif', '#EF4444', 'Pas d''activité depuis 30 jours'),
    ('Ambassadeur', '#8B5CF6', 'Parraine d''autres utilisateurs'),
    ('Beta Tester', '#3B82F6', 'Participant au programme beta'),
    ('À risque', '#F59E0B', 'Risque d''abandon détecté')
ON CONFLICT (name) DO NOTHING;
