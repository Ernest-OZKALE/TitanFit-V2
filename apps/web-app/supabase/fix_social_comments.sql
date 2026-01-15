-- =============================================================================
-- SOCIAL FEATURES PATCH: Activity Comments
-- DATE: 2026-01-17
-- DESCRIPTION: Adds the missing 'activity_comments' table required by the Social API.
-- =============================================================================

CREATE TABLE IF NOT EXISTS activity_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES activity_feed(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_comments ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Read: Everyone can read comments
DROP POLICY IF EXISTS "Public can view comments" ON activity_comments;
CREATE POLICY "Public can view comments" ON activity_comments FOR SELECT USING (true);

-- 2. Insert: Authenticated users can comment
DROP POLICY IF EXISTS "Auth can comment" ON activity_comments;
CREATE POLICY "Auth can comment" ON activity_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Delete: Users can delete their own comments
DROP POLICY IF EXISTS "Users can delete own comments" ON activity_comments;
CREATE POLICY "Users can delete own comments" ON activity_comments FOR DELETE USING (auth.uid() = user_id);
