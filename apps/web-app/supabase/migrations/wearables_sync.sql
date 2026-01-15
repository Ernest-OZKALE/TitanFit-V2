-- =====================================================
-- WEARABLES SYNC - Database Migration
-- TitanFit V2 - Terra API Integration
-- =====================================================

-- Table: Connexions wearables des utilisateurs
CREATE TABLE IF NOT EXISTS public.user_wearable_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'apple_health', 'google_fit', 'fitbit', 'garmin', 'oura', 'whoop'
    terra_user_id VARCHAR(255), -- ID utilisateur Terra API
    terra_resource_id VARCHAR(255), -- Resource ID pour les requêtes
    access_token TEXT, -- Token d'accès (chiffré)
    refresh_token TEXT, -- Token de refresh (chiffré)
    scopes TEXT[], -- Permissions accordées
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Table: Métriques de santé synchronisées
CREATE TABLE IF NOT EXISTS public.health_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    connection_id UUID REFERENCES public.user_wearable_connections(id) ON DELETE SET NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'steps', 'heart_rate', 'sleep', 'calories', 'distance', 'active_minutes', 'hrv'
    value DECIMAL(12, 4) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'count', 'bpm', 'hours', 'kcal', 'km', 'minutes', 'ms'
    recorded_at TIMESTAMPTZ NOT NULL, -- Quand la mesure a été prise
    source VARCHAR(50), -- 'apple_watch', 'fitbit_charge', etc.
    metadata JSONB DEFAULT '{}', -- Données supplémentaires
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Résumés quotidiens
CREATE TABLE IF NOT EXISTS public.daily_health_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_steps INTEGER DEFAULT 0,
    total_calories_burned INTEGER DEFAULT 0,
    total_active_minutes INTEGER DEFAULT 0,
    total_distance_km DECIMAL(8, 2) DEFAULT 0,
    avg_heart_rate INTEGER,
    min_heart_rate INTEGER,
    max_heart_rate INTEGER,
    sleep_hours DECIMAL(4, 2),
    sleep_quality_score INTEGER, -- 0-100
    hrv_avg DECIMAL(6, 2), -- Heart Rate Variability moyenne
    recovery_score INTEGER, -- 0-100
    strain_score DECIMAL(4, 2), -- Style Whoop
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_date ON public.health_metrics(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type ON public.health_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_wearable_connections_user ON public.user_wearable_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_summary_user_date ON public.daily_health_summary(user_id, date DESC);

-- RLS Policies
ALTER TABLE public.user_wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_health_summary ENABLE ROW LEVEL SECURITY;

-- Users can only see their own wearable connections
CREATE POLICY "Users can view own wearable connections"
    ON public.user_wearable_connections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wearable connections"
    ON public.user_wearable_connections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wearable connections"
    ON public.user_wearable_connections FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wearable connections"
    ON public.user_wearable_connections FOR DELETE
    USING (auth.uid() = user_id);

-- Health metrics policies
CREATE POLICY "Users can view own health metrics"
    ON public.health_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
    ON public.health_metrics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Daily summary policies
CREATE POLICY "Users can view own daily summary"
    ON public.daily_health_summary FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own daily summary"
    ON public.daily_health_summary FOR ALL
    USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_wearable_connections_updated_at
    BEFORE UPDATE ON public.user_wearable_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_summary_updated_at
    BEFORE UPDATE ON public.daily_health_summary
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
