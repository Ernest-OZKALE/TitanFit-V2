-- Phase 3: Strength Builder & Monetization
-- Migration for VBT (Velocity Based Training) and Freemium Gating

-- 1. Strength Builder (Workouts & Sets)
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. "Push Day", "Legs 1"
    
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    ended_at TIMESTAMP WITH TIME ZONE,
    
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'canceled'
    
    -- Analytics
    total_volume_load INTEGER DEFAULT 0, -- Sum of weight * reps
    total_reps INTEGER DEFAULT 0,
    total_sets INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.workout_sets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    exercise_id TEXT NOT NULL, -- Matches ID in exercise-db.ts (e.g. 'bench-press')
    exercise_name TEXT NOT NULL,
    
    set_number INTEGER NOT NULL,
    weight_kg FLOAT NOT NULL,
    reps INTEGER NOT NULL,
    
    -- VBT / RPE Logic
    rpe INTEGER, -- Rate of Perceived Exertion (1-10) or Velocity Proxy
    velocity_ms FLOAT, -- Optional: If we ever integrate a real sensor
    
    -- Strength Calculation
    estimated_1rm FLOAT GENERATED ALWAYS AS (weight_kg * (1 + reps::float / 30)) STORED,
    
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Freemium Monetization
-- Add is_premium flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'; -- 'free', 'pro', 'elite'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive'; -- 'active', 'canceled'

-- RLS Policies

-- Workouts
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own workouts" ON public.workouts 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own workouts" ON public.workouts 
    FOR ALL USING (auth.uid() = user_id);

-- Sets
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own sets" ON public.workout_sets 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own sets" ON public.workout_sets 
    FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workouts_user_status ON public.workouts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_sets_workout_id ON public.workout_sets(workout_id);
CREATE INDEX IF NOT EXISTS idx_sets_exercise_id ON public.workout_sets(exercise_id);
