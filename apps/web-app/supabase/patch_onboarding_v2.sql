-- =============================================================================
-- PATCH: ADD ONBOARDING_DATA TO PROFILES
-- Run this in Supabase SQL Editor to enable V2 Onboarding storage
-- =============================================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb;

-- Optional: ensure updated_at is auto-updated if you haven't already
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--    NEW.updated_at = NOW();
--    RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE
-- ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
