-- TitanFit V2 - Database Schema
-- Copy this entire file and paste it in Supabase SQL Editor, then click "Run"

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users & Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  organization_id UUID,
  subscription_tier_id TEXT DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user',
  bio TEXT,
  avatar_url TEXT,
  is_public BOOLEAN DEFAULT true,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Goals & Metrics
CREATE TABLE IF NOT EXISTS user_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2),
  height_cm INTEGER,
  age INTEGER,
  goal_type TEXT, -- 'lose_weight', 'gain_muscle', 'maintain'
  activity_level TEXT, -- 'sedentary', 'light', 'moderate', 'very_active'
  dietary_restrictions TEXT[], -- ['vegetarian', 'gluten_free', etc.]
  target_calories INTEGER,
  target_protein_g INTEGER,
  target_carbs_g INTEGER,
  target_fat_g INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food Log
CREATE TABLE IF NOT EXISTS food_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type TEXT, -- 'breakfast', 'lunch', 'dinner', 'snack'
  food_name TEXT NOT NULL,
  calories INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  emotion_tag TEXT, -- 'stressed', 'bored', 'hungry', 'happy'
  is_craving_event BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Interventions
CREATE TABLE IF NOT EXISTS ai_interventions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trigger_type TEXT, -- 'emotional_eating', 'missed_meal', 'over_calories'
  ai_message TEXT,
  user_response TEXT,
  effectiveness_score INTEGER, -- 1-5 rating
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interventions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid errors on re-run
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own metrics" ON user_metrics;
DROP POLICY IF EXISTS "Users can insert own metrics" ON user_metrics;
DROP POLICY IF EXISTS "Users can update own metrics" ON user_metrics;
DROP POLICY IF EXISTS "Users can view own food log" ON food_log;
DROP POLICY IF EXISTS "Users can insert own food log" ON food_log;
DROP POLICY IF EXISTS "Users can update own food log" ON food_log;
DROP POLICY IF EXISTS "Users can delete own food log" ON food_log;
DROP POLICY IF EXISTS "Users can view own interventions" ON ai_interventions;
DROP POLICY IF EXISTS "Users can insert own interventions" ON ai_interventions;

-- Profiles: Users can only see/edit their own profile (or view others if public, handled in social schema)
-- Basic profile access
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Metrics: Full CRUD for own data
CREATE POLICY "Users can view own metrics" ON user_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own metrics" ON user_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own metrics" ON user_metrics FOR UPDATE USING (auth.uid() = user_id);

-- Food Log: Full CRUD for own data
CREATE POLICY "Users can view own food log" ON food_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own food log" ON food_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own food log" ON food_log FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own food log" ON food_log FOR DELETE USING (auth.uid() = user_id);

-- AI Interventions: Read/Write own data
CREATE POLICY "Users can view own interventions" ON ai_interventions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interventions" ON ai_interventions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function: Handle New User
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'username',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: On Auth User Created
-- Drop trigger first to avoid error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- DONE!
-- ============================================================================
-- If you see "Success. No rows returned" - that's GOOD! It means it worked.
