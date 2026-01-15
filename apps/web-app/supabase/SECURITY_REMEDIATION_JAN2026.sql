-- =============================================================================
-- TITAN FIT V2 - SECURITY REMEDIATION PATCH V2 (CORRECTED)
-- =============================================================================

-- 1. [STORAGE] POLICIES ONLY (Fixed Error 42501)
-- We do NOT run "ALTER TABLE" here as it requires superuser. RLS is already active.

-- Allow public access ONLY to 'avatars' bucket
DROP POLICY IF EXISTS "Public Access to Avatars" ON storage.objects;
CREATE POLICY "Public Access to Avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Users can only upload their own avatars (Strict Image Types)
DROP POLICY IF EXISTS "Users Upload Own Avatars" ON storage.objects;
CREATE POLICY "Users Upload Own Avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid() = owner
    -- Simple check for image extensions in the filename
    AND (name ILIKE '%.jpg' OR name ILIKE '%.png' OR name ILIKE '%.jpeg' OR name ILIKE '%.webp')
  );

-- Users can update/delete their own avatars
DROP POLICY IF EXISTS "Users Update Own Avatars" ON storage.objects;
CREATE POLICY "Users Update Own Avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Users Delete Own Avatars" ON storage.objects;
CREATE POLICY "Users Delete Own Avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);


-- 2. [REALTIME] LOCKDOWN
-- Only allow Realtime for essential tables to prevent token leakage.
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  -- Re-create only for safe tables
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.notifications, 
    public.activity_feed, 
    public.activity_likes; 
COMMIT;


-- 3. [RLS] PROFILE PROTECTION
-- Mitigation for "API Version Disclosure" by ensuring no table is fully public.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
