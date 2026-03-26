-- Add workout tracking tables to database

-- Workout Programs (pre-made programs)
CREATE TABLE IF NOT EXISTS workout_programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  duration_weeks INTEGER,
  category TEXT, -- 'strength', 'hypertrophy', 'endurance', 'crossfit'
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User's workout sessions
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  program_id UUID REFERENCES workout_programs(id),
  workout_name TEXT NOT NULL,
  notes TEXT,
  duration_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises in a session
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  sets INTEGER,
  reps INTEGER,
  weight_kg DECIMAL(5,2),
  notes TEXT,
  order_index INTEGER DEFAULT 0
);

-- RLS Policies
ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

-- Programs: Public read, admin write
CREATE POLICY "Anyone can view active programs" ON workout_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage programs" ON workout_programs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sessions: Users see own, admins see all
CREATE POLICY "Users can view own sessions" ON workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON workout_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all sessions" ON workout_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Exercises: Same as sessions
CREATE POLICY "Users can view own exercises" ON workout_exercises FOR SELECT USING (
  EXISTS (SELECT 1 FROM workout_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own exercises" ON workout_exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM workout_sessions WHERE id = session_id AND user_id = auth.uid())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_program ON workout_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_session ON workout_exercises(session_id);
