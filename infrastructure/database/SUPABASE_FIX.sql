-- RUN THIS IN SUPABASE SQL EDITOR TO FIX "ERREUR DE SAUVEGARDE"

-- 1. Create Daily Metrics Table (if missing)
CREATE TABLE IF NOT EXISTS public.daily_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Bevel Scores
    recovery_score INTEGER CHECK (recovery_score BETWEEN 0 AND 100),
    sleep_score INTEGER CHECK (sleep_score BETWEEN 0 AND 100),
    strain_score INTEGER CHECK (strain_score BETWEEN 0 AND 21),
    stress_score INTEGER CHECK (stress_score BETWEEN 0 AND 100),
    energy_bank INTEGER CHECK (energy_bank BETWEEN 0 AND 100),
    
    -- Raw Data
    hrv_ms INTEGER,
    resting_hr INTEGER,
    sleep_duration_minutes INTEGER,
    deep_sleep_minutes INTEGER,
    rem_sleep_minutes INTEGER,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, date)
);

-- 2. Enable RLS
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;

-- 3. Add Policies (Drop first to avoid errors)
DROP POLICY IF EXISTS "Users view own metrics" ON public.daily_metrics;
CREATE POLICY "Users view own metrics" ON public.daily_metrics 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own metrics" ON public.daily_metrics;
CREATE POLICY "Users insert own metrics" ON public.daily_metrics 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own metrics" ON public.daily_metrics;
CREATE POLICY "Users update own metrics" ON public.daily_metrics 
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Create Index
CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON public.daily_metrics(user_id, date);
