-- =============================================================================
-- SOCIAL FEATURE REPAIR SCRIPT
-- DATE: 2026-01-17
-- DESCRIPTION: Guarantees social tables exist and have correct columns/RLS.
-- =============================================================================

-- 1. Ensure activity_feed exists
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

-- 2. Ensure Schema Correctness (Handle 'type' vs 'activity_type' confusion)
DO $$
BEGIN
    -- If 'type' column exists but 'activity_type' does not, rename it
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_feed' AND column_name = 'type') THEN
        ALTER TABLE activity_feed RENAME COLUMN "type" TO activity_type;
    END IF;
END $$;

-- 3. Ensure activity_likes exists
CREATE TABLE IF NOT EXISTS activity_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  activity_id UUID REFERENCES activity_feed(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- 4. Ensure Schema Correctness for Likes
DO $$
BEGIN
    -- If 'post_id' column exists but 'activity_id' does not, rename it
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_likes' AND column_name = 'post_id') THEN
        ALTER TABLE activity_likes RENAME COLUMN post_id TO activity_id;
    END IF;
END $$;

-- 5. Ensure activity_comments exists (The missing piece!)
CREATE TABLE IF NOT EXISTS activity_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  activity_id UUID REFERENCES activity_feed(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. RESET RLS (To be absolutely sure)
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_comments ENABLE ROW LEVEL SECURITY;

-- Feed Policies
DROP POLICY IF EXISTS "Public can view feed" ON activity_feed;
CREATE POLICY "Public can view feed" ON activity_feed FOR SELECT USING (true); -- Open for now

DROP POLICY IF EXISTS "Users can insert feed" ON activity_feed;
CREATE POLICY "Users can insert feed" ON activity_feed FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Likes Policies
DROP POLICY IF EXISTS "Public can view likes" ON activity_likes;
CREATE POLICY "Public can view likes" ON activity_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can toggle likes" ON activity_likes;
CREATE POLICY "Users can toggle likes" ON activity_likes FOR ALL USING (auth.uid() = user_id);

-- Comments Policies
DROP POLICY IF EXISTS "Public can view comments" ON activity_comments;
CREATE POLICY "Public can view comments" ON activity_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can comment" ON activity_comments;
-- 8. Ensure 'content' column exists (if table existed but was empty/different)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_comments' AND column_name = 'content') THEN
        ALTER TABLE activity_comments ADD COLUMN "content" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- 9. FORCE SCHEMA CACHE RELOAD (Critical for PGRST204 error)
NOTIFY pgrst, 'reload schema';
