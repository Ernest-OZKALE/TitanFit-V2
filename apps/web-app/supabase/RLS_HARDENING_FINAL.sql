-- =============================================================================
-- TITAN FIT V2 - RLS HARDENING FINAL
-- DESCRIPTION: Enforces strict Row Level Security policies for all features.
--              Fills gaps left by the Master Migration.
-- =============================================================================

-- 1. UTILITY: Helper function to check for admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. USER DATA PROTECTION (Food, Workout, Metrics, Goals)
-- =============================================================================

-- FOOD LOG
ALTER TABLE food_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own food_log" ON food_log;
CREATE POLICY "Users can view own food_log" ON food_log FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own food_log" ON food_log;
CREATE POLICY "Users can manage own food_log" ON food_log FOR ALL USING (auth.uid() = user_id);

-- USER METRICS
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own metrics" ON user_metrics;
CREATE POLICY "Users can manage own metrics" ON user_metrics FOR ALL USING (auth.uid() = user_id);

-- USER GOALS
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own goals" ON user_goals;
CREATE POLICY "Users can manage own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);

-- WEIGHT HISTORY
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own weight history" ON weight_history;
CREATE POLICY "Users can manage own weight history" ON weight_history FOR ALL USING (auth.uid() = user_id);

-- WORKOUT SESSIONS & PROGRAMS
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own sessions" ON workout_sessions;
CREATE POLICY "Users can manage own sessions" ON workout_sessions FOR ALL USING (auth.uid() = user_id);

ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view public programs" ON workout_programs;
CREATE POLICY "Users can view public programs" ON workout_programs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage programs" ON workout_programs;
CREATE POLICY "Admins can manage programs" ON workout_programs FOR ALL USING (is_admin());

-- NOTIFICATIONS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true); -- Or restricted to triggers usually
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- =============================================================================
-- 3. SOCIAL FEATURES (Feed, Likes, Follows)
-- =============================================================================

-- ACTIVITY FEED
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view feed" ON activity_feed;
CREATE POLICY "Public can view feed" ON activity_feed FOR SELECT USING (is_public = true);
DROP POLICY IF EXISTS "Users can manage own posts" ON activity_feed;
CREATE POLICY "Users can manage own posts" ON activity_feed FOR ALL USING (auth.uid() = user_id);

-- LIKES
ALTER TABLE activity_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view likes" ON activity_likes;
CREATE POLICY "Public can view likes" ON activity_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own likes" ON activity_likes;
CREATE POLICY "Users can manage own likes" ON activity_likes FOR ALL USING (auth.uid() = user_id);

-- FOLLOWS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view follows" ON user_follows;
CREATE POLICY "Public can view follows" ON user_follows FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own follows" ON user_follows;
CREATE POLICY "Users can manage own follows" ON user_follows FOR ALL USING (auth.uid() = follower_id);

-- =============================================================================
-- 4. CMS (Content Management System) - ADMIN ONLY FOR WRITE
-- =============================================================================

-- CMS PAGES
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public View Pages" ON cms_pages;
CREATE POLICY "Public View Pages" ON cms_pages FOR SELECT USING (is_published = true OR is_admin());
DROP POLICY IF EXISTS "Admin Manage Pages" ON cms_pages;
CREATE POLICY "Admin Manage Pages" ON cms_pages FOR ALL USING (is_admin());

-- CMS SECTIONS
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public View Sections" ON cms_sections;
CREATE POLICY "Public View Sections" ON cms_sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Sections" ON cms_sections;
CREATE POLICY "Admin Manage Sections" ON cms_sections FOR ALL USING (is_admin());

-- CMS MEDIA
ALTER TABLE cms_media_library ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public View Media" ON cms_media_library;
CREATE POLICY "Public View Media" ON cms_media_library FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Media" ON cms_media_library;
CREATE POLICY "Admin Manage Media" ON cms_media_library FOR ALL USING (is_admin());

-- =============================================================================
-- 5. AI INTERVENTIONS
-- =============================================================================
ALTER TABLE ai_interventions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see own AI chat" ON ai_interventions;
CREATE POLICY "Users can see own AI chat" ON ai_interventions FOR SELECT USING (auth.uid() = user_id);
-- Assuming AI response insertion happens via Edge Function (Service Role) or Client
DROP POLICY IF EXISTS "Users can insert AI interactions" ON ai_interventions;
CREATE POLICY "Users can insert AI interactions" ON ai_interventions FOR INSERT WITH CHECK (auth.uid() = user_id);
