-- Add notifications bucket for future use if needed
-- INSERT INTO storage.buckets (id, name, public) VALUES ('notifications', 'notifications', true) ON CONFLICT (id) DO NOTHING;

-- This file is mainly to track the 7th schema file
SELECT 'Notifications schema created' as status;
