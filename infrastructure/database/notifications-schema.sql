-- Notifications Schema

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Who receives the notification
  actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Who caused it (e.g. liker)
  type TEXT NOT NULL, -- 'like', 'comment', 'follow', 'system'
  resource_id UUID, -- ID of the post/comment/etc
  resource_type TEXT, -- 'activity_feed', 'user_achievements'
  content TEXT, -- Preview text
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can insert notifications" ON notifications;

-- Users see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

-- Users can update (mark read) their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- System or triggers create notifications (anyone can insert if they trigger it)
CREATE POLICY "Anyone can insert notifications" ON notifications
FOR INSERT WITH CHECK (true);

-- Index for speed
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Drop triggers functions and triggers before recreating
DROP TRIGGER IF EXISTS on_activity_like ON activity_likes;
DROP FUNCTION IF EXISTS notify_on_like();
DROP TRIGGER IF EXISTS on_user_follow ON user_follows;
DROP FUNCTION IF EXISTS notify_on_follow();

-- Trigger Function: Auto-create notification on Like
CREATE OR REPLACE FUNCTION notify_on_like() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id != (SELECT user_id FROM activity_feed WHERE id = NEW.activity_id) THEN
    INSERT INTO notifications (user_id, actor_id, type, resource_id, resource_type, content)
    VALUES (
      (SELECT user_id FROM activity_feed WHERE id = NEW.activity_id), -- Owner of post
      NEW.user_id, -- Liker
      'like',
      NEW.activity_id,
      'activity_feed',
      'liked your activity'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_activity_like
  AFTER INSERT ON activity_likes
  FOR EACH ROW EXECUTE FUNCTION notify_on_like();

-- Trigger Function: Auto-create notification on Follow
CREATE OR REPLACE FUNCTION notify_on_follow() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type, resource_id, resource_type, content)
  VALUES (
    NEW.following_id, -- Followed user
    NEW.follower_id, -- Follower
    'follow',
    NEW.follower_id,
    'profiles',
    'started following you'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_follow
  AFTER INSERT ON user_follows
  FOR EACH ROW EXECUTE FUNCTION notify_on_follow();
