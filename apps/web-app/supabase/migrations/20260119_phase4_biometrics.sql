-- Phase 4: Real Biometrics (Time Series Data)

-- Stores granular data points synced from wearables
-- (e.g. HRV readings every hour, or a single Sleep Summary per night)

CREATE TABLE IF NOT EXISTS public.biometric_samples (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    source TEXT NOT NULL, -- 'apple_health', 'whoop', 'oura', 'manual'
    metric_type TEXT NOT NULL, -- 'hrv', 'resting_hr', 'sleep_duration', 'sleep_efficiency', 'respiratory_rate'
    
    value NUMERIC NOT NULL,
    unit TEXT, -- 'ms', 'bpm', 'minutes', '%'
    
    measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Metadata (e.g. device version, specific tags)
    raw_data JSONB DEFAULT '{}'::jsonb
);

-- Index for fast time-range querying (Charts)
CREATE INDEX IF NOT EXISTS idx_biometrics_user_metric_date ON public.biometric_samples(user_id, metric_type, measured_at DESC);

-- RLS
ALTER TABLE public.biometric_samples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own biometrics" ON public.biometric_samples 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own biometrics" ON public.biometric_samples 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
