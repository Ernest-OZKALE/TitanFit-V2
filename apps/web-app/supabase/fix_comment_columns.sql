-- =============================================================================
-- FIX COMMENT COLUMN MISMATCH (comment_text vs content)
-- =============================================================================

DO $$
BEGIN
    -- 1. Check if the unexpected column 'comment_text' exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_comments' AND column_name = 'comment_text') THEN
        
        -- Check if 'content' (our desired column) ALSO exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_comments' AND column_name = 'content') THEN
            -- Both exist: Drop the old 'comment_text' (or make it nullable if you want to keep data, but simpler to drop or migrate)
            -- Let's migrate data first just in case
            UPDATE activity_comments SET content = comment_text WHERE content IS NULL OR content = '';
            
            -- Now safe to drop 'comment_text' to remove the NOT NULL constraint
            ALTER TABLE activity_comments DROP COLUMN comment_text;
            RAISE NOTICE 'Dropped old column comment_text after migrating to content.';
        ELSE
            -- Only 'comment_text' exists: Rename it to 'content'
            ALTER TABLE activity_comments RENAME COLUMN comment_text TO content;
            RAISE NOTICE 'Renamed comment_text to content.';
        END IF;

    ELSE
        RAISE NOTICE 'Column comment_text does not exist. No conflict found.';
    END IF;

    -- 2. Verify 'content' is definitely there and NOT NULL
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_comments' AND column_name = 'content') THEN
         ALTER TABLE activity_comments ADD COLUMN content TEXT NOT NULL DEFAULT '';
         RAISE NOTICE 'Created missing content column.';
    END IF;

END $$;

-- 3. Force Cache Reload
NOTIFY pgrst, 'reload schema';
