-- Phase 2: TitanFit Evolution (Bevel Intelligence)
-- Migration for Energy Bank, Nutrition 2.0, and Intelligence Engine

-- 1. Daily Metrics (Energy Bank Core)
CREATE TABLE IF NOT EXISTS public.daily_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Bevel Scores (0-100)
    recovery_score INTEGER CHECK (recovery_score BETWEEN 0 AND 100),
    sleep_score INTEGER CHECK (sleep_score BETWEEN 0 AND 100),
    strain_score INTEGER CHECK (strain_score BETWEEN 0 AND 21), -- Whoop/Bevel scale 0-21
    stress_score INTEGER CHECK (stress_score BETWEEN 0 AND 100),
    energy_bank INTEGER CHECK (energy_bank BETWEEN 0 AND 100),
    
    -- Raw Data for Algorithm
    hrv_ms INTEGER, -- rMSSD
    resting_hr INTEGER,
    sleep_duration_minutes INTEGER,
    deep_sleep_minutes INTEGER,
    rem_sleep_minutes INTEGER,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, date)
);

-- 2. Nutrition 2.0 (AHEI Structure)
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    
    -- Macros per 100g/serving
    calories INTEGER NOT NULL,
    protein FLOAT NOT NULL,
    carbs FLOAT NOT NULL,
    fats FLOAT NOT NULL,
    fiber FLOAT DEFAULT 0,
    sugar FLOAT DEFAULT 0,
    
    -- Quality Tags (AHEI)
    -- JSON array of strings: ['processed_meat', 'green_leafy', 'added_sugar']
    quality_tags JSONB DEFAULT '[]'::jsonb, 
    
    -- Impact Score (Calculated or Pre-defined)
    -- Positive for good foods, Negative for bad
    impact_score INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    food_id UUID REFERENCES public.food_items(id),
    
    quantity_amount FLOAT NOT NULL,
    quantity_unit TEXT NOT NULL, -- 'g', 'cup', 'serving'
    meal_type TEXT, -- 'breakfast', 'lunch', 'dinner', 'snack'
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Snapshot of impact at time of eating (context matters)
    calculated_impact INTEGER
);

-- 3. Titan Intelligence (Journal & Habits)
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Tags: JSON array of strings e.g. ['sauna', 'alcohol', 'late_meal', 'magnesium']
    tags JSONB DEFAULT '[]'::jsonb,
    
    notes TEXT,
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, date)
);

-- RLS Policies
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Metrics: Users see only their own
CREATE POLICY "Users view own metrics" ON public.daily_metrics 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own metrics" ON public.daily_metrics 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own metrics" ON public.daily_metrics 
    FOR UPDATE USING (auth.uid() = user_id);

-- Food: Public read, Authenticated create
CREATE POLICY "Everyone reads food" ON public.food_items 
    FOR SELECT USING (true);
CREATE POLICY "Auth users create food" ON public.food_items 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Logs: Users see only their own
CREATE POLICY "Users view own logs" ON public.nutrition_logs 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own logs" ON public.nutrition_logs 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Journal: Users see only their own
CREATE POLICY "Users view own journal" ON public.journal_entries 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own journal" ON public.journal_entries 
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for Analysis
CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON public.daily_metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_logs_user_date ON public.nutrition_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_journal_user_date ON public.journal_entries(user_id, date);
