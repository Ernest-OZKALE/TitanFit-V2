-- 📋 À EXÉCUTER DANS L'ÉDITEUR SQL SUPABASE POUR CORRIGER LES ERREURS DE SAUVEGARDE
-- Ce script assure l'existence des tables de métriques et des politiques de sécurité associées.

-- 1. Création de la table des métriques quotidiennes (si absente)
CREATE TABLE IF NOT EXISTS public.daily_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Scores de Performance (Algorithme Titan)
    recovery_score INTEGER CHECK (recovery_score BETWEEN 0 AND 100),
    sleep_score INTEGER CHECK (sleep_score BETWEEN 0 AND 100),
    strain_score INTEGER CHECK (strain_score BETWEEN 0 AND 21),
    stress_score INTEGER CHECK (stress_score BETWEEN 0 AND 100),
    energy_bank INTEGER CHECK (energy_bank BETWEEN 0 AND 100),
    
    -- Données Brutes (Biométrie)
    hrv_ms INTEGER,
    resting_hr INTEGER,
    sleep_duration_minutes INTEGER,
    deep_sleep_minutes INTEGER,
    rem_sleep_minutes INTEGER,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, date)
);

-- 2. Activation du RLS (Security First)
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;

-- 3. Configuration des Politiques (Propriété des données)
DROP POLICY IF EXISTS "Users view own metrics" ON public.daily_metrics;
CREATE POLICY "Users view own metrics" ON public.daily_metrics 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own metrics" ON public.daily_metrics;
CREATE POLICY "Users insert own metrics" ON public.daily_metrics 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own metrics" ON public.daily_metrics;
CREATE POLICY "Users update own metrics" ON public.daily_metrics 
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Optimisation des performances (Index)
CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON public.daily_metrics(user_id, date);
