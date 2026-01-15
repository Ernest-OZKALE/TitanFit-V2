-- =====================================================
-- LIVE CHAT - Database Migration
-- TitanFit V2
-- =====================================================

-- Chat Sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Nullable for guests
    guest_id UUID DEFAULT gen_random_uuid(), -- For tracking guests
    guest_name VARCHAR(100),
    guest_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed', 'archived'
    assigned_to UUID REFERENCES auth.users(id), -- Admin/Agent ID
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, -- 'user', 'agent', 'system'
    sender_id UUID, -- User ID or Agent ID
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_guest ON public.chat_sessions(guest_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);

-- RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies (simplified for brevity)
CREATE POLICY "Users access own sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = user_id OR guest_id::text = current_setting('request.headers.x-guest-id', true));

CREATE POLICY "Users access own messages" ON public.chat_messages
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.chat_sessions 
            WHERE auth.uid() = user_id OR guest_id::text = current_setting('request.headers.x-guest-id', true)
        )
    );
