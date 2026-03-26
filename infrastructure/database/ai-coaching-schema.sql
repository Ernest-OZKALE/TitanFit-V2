-- AI Coaching and Interventions Schema

-- AI Chat Messages
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Interventions (anti-craving, motivation)
CREATE TABLE IF NOT EXISTS ai_interventions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trigger_type TEXT, -- 'craving', 'emotion', 'manual'
  intervention_text TEXT NOT NULL,
  user_response TEXT,
  was_helpful BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Goals and Preferences
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  goal_type TEXT, -- 'weight_loss', 'muscle_gain', 'maintenance'
  target_weight_kg DECIMAL(5,2),
  target_calories INTEGER,
  target_protein_g INTEGER,
  target_carbs_g INTEGER,
  target_fat_g INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own chat" ON ai_chat_messages;
DROP POLICY IF EXISTS "Users can create own messages" ON ai_chat_messages;
DROP POLICY IF EXISTS "Admins can view all chat" ON ai_chat_messages;
DROP POLICY IF EXISTS "Users can view own interventions" ON ai_interventions;
DROP POLICY IF EXISTS "Users can manage own interventions" ON ai_interventions;
DROP POLICY IF EXISTS "Users can view own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can manage own goals" ON user_goals;

-- Chat: Users see own, admins see all
CREATE POLICY "Users can view own chat" ON ai_chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own messages" ON ai_chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all chat" ON ai_chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Interventions: Same as chat
CREATE POLICY "Users can view own interventions" ON ai_interventions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own interventions" ON ai_interventions FOR ALL USING (auth.uid() = user_id);

-- Goals: Users manage own
CREATE POLICY "Users can view own goals" ON user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_chat_user ON ai_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interventions_user ON ai_interventions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user ON user_goals(user_id);
