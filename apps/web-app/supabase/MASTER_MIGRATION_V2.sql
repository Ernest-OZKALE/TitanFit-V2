-- =============================================================================
-- TITAN FIT V2 - MASTER MIGRATION V2
-- AUTHOR: Antigravity Agent
-- DATE: 2026-01-16
-- DESCRIPTION: Consolidated migration file including Core, CMS, Social, Workout, Progress, AI, and Storage tables.
-- INSTRUCTIONS: Copy this entire content into Supabase SQL Editor and Run.
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================================================
-- 1. CORE DATABASE SCHEMA (Profiles, Metrics, Food Log)
-- =============================================================================

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
  dietary_restrictions TEXT[], 
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
  meal_type TEXT, 
  food_name TEXT NOT NULL,
  calories INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  emotion_tag TEXT, 
  is_craving_event BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Interventions (Core definition)
CREATE TABLE IF NOT EXISTS ai_interventions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trigger_type TEXT, 
  ai_message TEXT,
  user_response TEXT,
  effectiveness_score INTEGER, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Core Tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interventions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Metrics Policies
DROP POLICY IF EXISTS "Users can view own metrics" ON user_metrics;
CREATE POLICY "Users can view own metrics" ON user_metrics FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own metrics" ON user_metrics;
CREATE POLICY "Users can insert own metrics" ON user_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own metrics" ON user_metrics;
CREATE POLICY "Users can update own metrics" ON user_metrics FOR UPDATE USING (auth.uid() = user_id);

-- Handle New User Function
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================================
-- 2. CMS V1 SCHEMA
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.cms_pages (
    id uuid default uuid_generate_v4() primary key,
    slug text not null unique,
    title text not null,
    seo_title text,
    seo_description text,
    is_published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS public.cms_sections (
    id uuid default uuid_generate_v4() primary key,
    page_id uuid references public.cms_pages(id) on delete cascade not null,
    section_type text not null,
    order_index integer not null default 0,
    title text,
    subtitle text,
    description text,
    content jsonb default '{}'::jsonb,
    style_config jsonb default '{}'::jsonb,
    component_name text,
    is_visible boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS public.cms_settings (
    key text primary key,
    value jsonb not null,
    description text
);

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on pages" ON public.cms_pages;
CREATE POLICY "Allow public read on pages" ON public.cms_pages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read on sections" ON public.cms_sections;
CREATE POLICY "Allow public read on sections" ON public.cms_sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read on settings" ON public.cms_settings;
CREATE POLICY "Allow public read on settings" ON public.cms_settings FOR SELECT USING (true);

-- =============================================================================
-- 3. CMS V2 EXTENSIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.cms_media_library (
    id uuid default uuid_generate_v4() primary key,
    filename text not null,
    original_filename text not null,
    storage_path text not null unique,
    public_url text,
    mime_type text not null,
    file_size bigint not null,
    width integer,
    height integer,
    alt_text text,
    title text,
    description text,
    uploaded_by uuid,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS public.cms_components (
    id uuid default uuid_generate_v4() primary key,
    component_name text not null unique,
    display_name text not null,
    category text,
    description text,
    icon text,
    props_schema jsonb default '{}'::jsonb,
    default_content jsonb default '{}'::jsonb,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS public.cms_menus (
    id uuid default uuid_generate_v4() primary key,
    location text not null,
    label text not null,
    url text,
    icon text,
    parent_id uuid references public.cms_menus(id) on delete cascade,
    order_index integer default 0,
    is_visible boolean default true,
    target text default '_self',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Extend cms_sections
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_sections' AND column_name = 'media_id') THEN
        alter table public.cms_sections add column media_id uuid references public.cms_media_library(id) on delete set null;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_sections' AND column_name = 'locked') THEN
        alter table public.cms_sections add column locked boolean default false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_sections' AND column_name = 'updated_at') THEN
        alter table public.cms_sections add column updated_at timestamp with time zone default timezone('utc'::text, now());
    END IF;
END $$;

ALTER TABLE public.cms_media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_menus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on media" ON public.cms_media_library;
CREATE POLICY "Allow public read on media" ON public.cms_media_library FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read on components" ON public.cms_components;
CREATE POLICY "Allow public read on components" ON public.cms_components FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read on menus" ON public.cms_menus;
CREATE POLICY "Allow public read on menus" ON public.cms_menus FOR SELECT USING (true);

-- =============================================================================
-- 4. STORAGE BUCKETS (Custom Configuration)
-- =============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('private-uploads', 'private-uploads', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('post_images', 'post_images', true) ON CONFLICT (id) DO NOTHING;

-- Policies for 'media'
DROP POLICY IF EXISTS "Public Access Media" ON storage.objects;
CREATE POLICY "Public Access Media" ON storage.objects FOR SELECT USING ( bucket_id = 'media' );
DROP POLICY IF EXISTS "Auth Upload Media" ON storage.objects;
CREATE POLICY "Auth Upload Media" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'media' AND auth.role() = 'authenticated' );

-- Policies for 'private-uploads'
DROP POLICY IF EXISTS "Auth Access Private" ON storage.objects;
CREATE POLICY "Auth Access Private" ON storage.objects FOR SELECT USING ( bucket_id = 'private-uploads' AND auth.uid() = owner );
DROP POLICY IF EXISTS "Auth Upload Private" ON storage.objects;
CREATE POLICY "Auth Upload Private" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'private-uploads' AND auth.uid() = owner );

-- Policies for 'avatars'
DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;
CREATE POLICY "Avatar Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );
DROP POLICY IF EXISTS "Avatar Auth Upload" ON storage.objects;
CREATE POLICY "Avatar Auth Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );

-- =============================================================================
-- 5. FEATURE SCHEMAS
-- =============================================================================

-- Social (Follows, Feed)
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  metadata JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  activity_id UUID REFERENCES activity_feed(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

CREATE TABLE IF NOT EXISTS activity_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  activity_id UUID REFERENCES activity_feed(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_comments ENABLE ROW LEVEL SECURITY;

-- Workout
CREATE TABLE IF NOT EXISTS workout_programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_weeks INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  program_id UUID REFERENCES workout_programs(id),
  workout_name TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

-- Progress (Weight, etc) - Already covered by user_metrics partially, but let's add weight_history
CREATE TABLE IF NOT EXISTS weight_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- AI Coaching (User Goals)
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  goal_type TEXT,
  target_weight_kg DECIMAL(5,2),
  target_calories INTEGER,
  target_protein_g INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
