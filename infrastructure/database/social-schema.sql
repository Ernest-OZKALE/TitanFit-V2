-- Social Features Schema

-- User Follows (who follows who)
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Activity Feed (posts, achievements, workouts)
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'workout', 'meal', 'achievement', 'post', 'weight_update'
  content TEXT,
  image_url TEXT,
  metadata JSONB, -- flexible data storage
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments on activity
CREATE TABLE IF NOT EXISTS activity_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  activity_id UUID REFERENCES activity_feed(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes on activity
CREATE TABLE IF NOT EXISTS activity_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  activity_id UUID REFERENCES activity_feed(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- Update profiles table for public info
-- NOTE: We used IF NOT EXISTS in CREATE TABLE, but columns need separate handling if adding
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;

-- RLS Policies
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view follows" ON user_follows;
DROP POLICY IF EXISTS "Users can follow others" ON user_follows;
DROP POLICY IF EXISTS "Users can unfollow" ON user_follows;
DROP POLICY IF EXISTS "Public activity visible to all" ON activity_feed;
DROP POLICY IF EXISTS "Users can create own activity" ON activity_feed;
DROP POLICY IF EXISTS "Users can update own activity" ON activity_feed;
DROP POLICY IF EXISTS "Users can delete own activity" ON activity_feed;
DROP POLICY IF EXISTS "Comments visible to all" ON activity_comments;
DROP POLICY IF EXISTS "Users can comment" ON activity_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON activity_comments;
DROP POLICY IF EXISTS "Likes visible to all" ON activity_likes;
DROP POLICY IF EXISTS "Users can like" ON activity_likes;
DROP POLICY IF EXISTS "Users can unlike" ON activity_likes;

-- Follows: Users manage own follows
CREATE POLICY "Users can view follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON user_follows FOR DELETE USING (auth.uid() = follower_id);

-- Activity: Public posts visible to all, private to followers
CREATE POLICY "Public activity visible to all" ON activity_feed FOR SELECT USING (
  is_public = true OR 
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM user_follows WHERE following_id = activity_feed.user_id AND follower_id = auth.uid())
);
CREATE POLICY "Users can create own activity" ON activity_feed FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activity" ON activity_feed FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activity" ON activity_feed FOR DELETE USING (auth.uid() = user_id);

-- Comments: Visible to all who can see the activity
CREATE POLICY "Comments visible to all" ON activity_comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON activity_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON activity_comments FOR DELETE USING (auth.uid() = user_id);

-- Likes: Visible to all
CREATE POLICY "Likes visible to all" ON activity_likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON activity_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON activity_likes FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_comments_activity ON activity_comments(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_likes_activity ON activity_likes(activity_id);
