-- =====================================================
-- PUSH NOTIFICATIONS & CLIENT NOTES - Database Migration
-- TitanFit V2
-- =====================================================

-- ================================
-- PUSH NOTIFICATIONS
-- ================================

-- User push tokens (FCM)
CREATE TABLE IF NOT EXISTS public.push_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    device_type VARCHAR(20) DEFAULT 'web', -- 'web', 'android', 'ios'
    device_name VARCHAR(255),
    browser VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, token)
);

-- Notification templates (admin-defined)
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    icon VARCHAR(255) DEFAULT '/icon-192.png',
    action_url VARCHAR(500),
    category VARCHAR(50) DEFAULT 'general', -- 'general', 'workout', 'achievement', 'social', 'marketing'
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled/sent notifications
CREATE TABLE IF NOT EXISTS public.push_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES public.notification_templates(id),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    icon VARCHAR(255),
    action_url VARCHAR(500),
    data JSONB DEFAULT '{}',
    target_type VARCHAR(20) DEFAULT 'all', -- 'all', 'segment', 'user', 'topic'
    target_value TEXT, -- User ID, segment name, or topic
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'cancelled'
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification delivery log
CREATE TABLE IF NOT EXISTS public.push_delivery_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_id UUID NOT NULL REFERENCES public.push_notifications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_id UUID REFERENCES public.push_tokens(id),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'clicked', 'failed'
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ
);

-- ================================
-- INTERNAL CLIENT NOTES
-- ================================

-- Notes on clients (visible only to admin/staff)
CREATE TABLE IF NOT EXISTS public.client_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general', -- 'general', 'billing', 'support', 'warning', 'priority'
    is_pinned BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false, -- Only visible to author
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- INDEXES
-- ================================

CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON public.push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_active ON public.push_tokens(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_push_notifications_status ON public.push_notifications(status);
CREATE INDEX IF NOT EXISTS idx_push_delivery_notification ON public.push_delivery_log(notification_id);
CREATE INDEX IF NOT EXISTS idx_client_notes_client ON public.client_notes(client_id);

-- ================================
-- RLS
-- ================================

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_delivery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;

-- Users can manage their own tokens
CREATE POLICY "Users manage own push tokens"
    ON public.push_tokens FOR ALL
    USING (auth.uid() = user_id);

-- ================================
-- DEFAULT DATA
-- ================================

-- Default notification templates
INSERT INTO public.notification_templates (slug, name, title, body, category, variables) VALUES
    ('workout_reminder', 'Rappel entraînement', 'C''est l''heure de s''entraîner! 💪', 'Hey {{user_name}}, n''oublie pas ton entraînement aujourd''hui.', 'workout', '["user_name"]'),
    ('achievement_unlocked', 'Badge débloqué', 'Nouveau badge! 🏆', 'Félicitations {{user_name}}! Tu as débloqué "{{badge_name}}"!', 'achievement', '["user_name", "badge_name"]'),
    ('streak_reminder', 'Streak en danger', 'Ta série est en danger! 🔥', 'Ne perds pas ta série de {{streak_days}} jours! Connecte-toi maintenant.', 'workout', '["streak_days"]'),
    ('new_challenge', 'Nouveau défi', 'Nouveau défi disponible! 🎯', 'Un nouveau défi t''attend: {{challenge_name}}', 'general', '["challenge_name"]'),
    ('friend_activity', 'Activité ami', '{{friend_name}} a terminé un entraînement!', 'Ton ami vient de terminer: {{workout_name}}', 'social', '["friend_name", "workout_name"]'),
    ('promo_alert', 'Promotion', 'Offre spéciale! 🎁', '{{promo_message}}', 'marketing', '["promo_message"]')
ON CONFLICT (slug) DO NOTHING;
