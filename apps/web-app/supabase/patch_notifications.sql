-- =============================================================================
-- PATCH: NOTIFICATIONS SYSTEM
-- Run this in Supabase SQL Editor
-- =============================================================================

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, error
    link TEXT, -- Optional URL to redirect
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can insert notifications (for anyone)
-- Note: Service Role bypasses RLS, so mostly needed if we do client-side admin inserts
-- But usually, system sends via API. Let's allow users to insert? No. only system.

-- 4. Realtime
-- Enable Realtime for this table to allow listening to new inserts
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.notifications;
-- OR if publication exists, add table:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
