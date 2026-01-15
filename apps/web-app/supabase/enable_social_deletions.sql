-- =============================================================================
-- ENABLE DELETIONS FOR SOCIAL FEATURES
-- =============================================================================

-- 1. Allow users to delete their own posts
DROP POLICY IF EXISTS "Users can delete own feed items" ON activity_feed;
CREATE POLICY "Users can delete own feed items" ON activity_feed FOR DELETE USING (auth.uid() = user_id);

-- 2. Allow users to delete their own likes (already covered by "toggle" typically, but let's be explicit if toggle used ALL)
-- "Users can toggle likes" was FOR ALL, so it covered DELETE. 

-- 3. Allow users to delete their own comments
DROP POLICY IF EXISTS "Users can delete own comments" ON activity_comments;
CREATE POLICY "Users can delete own comments" ON activity_comments FOR DELETE USING (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';
