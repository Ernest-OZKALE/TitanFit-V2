-- =============================================================================
-- FORCE SCHEMA CACHE RELOAD
-- =============================================================================
-- This script explicitly tells Supabase API (PostgREST) to refresh its cache.
-- Run this if you see error: "Could not find the '...' column in the schema cache"

NOTIFY pgrst, 'reload schema';

-- Optional: Verify the column exists just to be sure
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_comments' AND column_name = 'content') THEN
        RAISE EXCEPTION 'Column content is STILL MISSING in activity_comments table!';
    ELSE
        RAISE NOTICE 'Column content EXISTS. Cache should be reloading now.';
    END IF;
END $$;
