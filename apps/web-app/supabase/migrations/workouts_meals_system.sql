-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT,
    duration_minutes INTEGER,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    protein DECIMAL(10, 2) DEFAULT 0,
    carbs DECIMAL(10, 2) DEFAULT 0,
    fat DECIMAL(10, 2) DEFAULT 0,
    meal_type VARCHAR(50) DEFAULT 'other', -- breakfast, lunch, dinner, snack, other
    notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress_photos table
CREATE TABLE IF NOT EXISTS public.progress_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    photo_url TEXT NOT NULL,
    weight_kg DECIMAL(10, 2),
    body_fat_percentage DECIMAL(5, 2),
    notes TEXT,
    taken_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_completed_at ON public.workouts(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_logged_at ON public.meals(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_id ON public.progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_taken_at ON public.progress_photos(taken_at DESC);

-- Enable Row Level Security
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workouts
CREATE POLICY "Users can view their own workouts"
    ON public.workouts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
    ON public.workouts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
    ON public.workouts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
    ON public.workouts FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for meals
CREATE POLICY "Users can view their own meals"
    ON public.meals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
    ON public.meals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
    ON public.meals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
    ON public.meals FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for progress_photos
CREATE POLICY "Users can view their own progress photos"
    ON public.progress_photos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress photos"
    ON public.progress_photos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress photos"
    ON public.progress_photos FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress photos"
    ON public.progress_photos FOR DELETE
    USING (auth.uid() = user_id);
