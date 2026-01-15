-- Progress Tracking Schema

-- Weight History
CREATE TABLE IF NOT EXISTS weight_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL,
  body_fat_percentage DECIMAL(4,2),
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Summaries (aggregated stats)
CREATE TABLE IF NOT EXISTS daily_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_calories INTEGER DEFAULT 0,
  total_protein_g DECIMAL(6,2) DEFAULT 0,
  total_carbs_g DECIMAL(6,2) DEFAULT 0,
  total_fat_g DECIMAL(6,2) DEFAULT 0,
  meals_logged INTEGER DEFAULT 0,
  workouts_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  category TEXT -- 'nutrition', 'workout', 'streak', 'social'
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User Stats (XP, level, streaks)
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  total_meals_logged INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own weight" ON weight_history;
DROP POLICY IF EXISTS "Users can manage own weight" ON weight_history;
DROP POLICY IF EXISTS "Users can view own summaries" ON daily_summaries;
DROP POLICY IF EXISTS "Users can manage own summaries" ON daily_summaries;
DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
DROP POLICY IF EXISTS "Admins can manage achievements" ON achievements;
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can earn achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can manage own stats" ON user_stats;

-- Weight: Users manage own
CREATE POLICY "Users can view own weight" ON weight_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own weight" ON weight_history FOR ALL USING (auth.uid() = user_id);

-- Summaries: Users see own
CREATE POLICY "Users can view own summaries" ON daily_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own summaries" ON daily_summaries FOR ALL USING (auth.uid() = user_id);

-- Achievements: Public read
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON achievements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User Achievements: Users see own
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stats: Users see own
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own stats" ON user_stats FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_weight_history_user ON weight_history(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_date ON daily_summaries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);

-- Insert default achievements safely
INSERT INTO achievements (name, description, icon, xp_reward, category) VALUES
  ('First Meal', 'Log your first meal', '🍽️', 10, 'nutrition'),
  ('First Workout', 'Complete your first workout', '💪', 10, 'workout'),
  ('Week Warrior', '7 day streak', '🔥', 50, 'streak'),
  ('Macro Master', 'Hit your macros 5 days in a row', '🎯', 100, 'nutrition'),
  ('Iron Dedication', '30 workouts completed', '🏋️', 200, 'workout')
ON CONFLICT (name) DO NOTHING;
