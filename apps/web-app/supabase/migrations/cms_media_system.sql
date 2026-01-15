-- =====================================================
-- CMS MEDIA LIBRARY - Database Schema
-- TitanFit V2 - Media Asset Management
-- =====================================================

-- 1. MEDIA TABLE
-- Tracks all files uploaded and managed via the Admin Media Library
CREATE TABLE IF NOT EXISTS public.cms_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    size BIGINT NOT NULL, -- bytes
    type TEXT NOT NULL, -- mime type (image/png, etc.)
    width INTEGER, -- for images
    height INTEGER, -- for images
    folder TEXT DEFAULT 'general', -- 'workouts', 'articles', 'avatars'
    alt_text TEXT,
    metadata JSONB DEFAULT '{}',
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INDEXES
CREATE INDEX IF NOT EXISTS idx_cms_media_type ON public.cms_media(type);
CREATE INDEX IF NOT EXISTS idx_cms_media_folder ON public.cms_media(folder);
CREATE INDEX IF NOT EXISTS idx_cms_media_created ON public.cms_media(created_at DESC);

-- 3. RLS POLICIES
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;

-- Public can VIEW media
CREATE POLICY "Media is publicly viewable"
    ON public.cms_media FOR SELECT
    USING (true);

-- Admins can MANAGE media
CREATE POLICY "Admins can manage media"
    ON public.cms_media FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        JOIN public.user_roles ur ON ura.role_id = ur.id
        WHERE ura.user_id = auth.uid() AND ur.name IN ('admin', 'super_admin')
    ));

-- 4. STORAGE SETUP (Note: Storage buckets usually need to be created via API/Console but we'll add policies)
-- Assuming 'cms' bucket exists or will be created
-- Note: Supabase storage policies use a different schema 'storage'

/*
-- Example storage policies (commented out as they move to storage schema)
INSERT INTO storage.buckets (id, name, public) VALUES ('cms', 'cms', true) ON CONFLICT DO NOTHING;

CREATE POLICY "CMS Bucket Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'cms');
CREATE POLICY "CMS Bucket Admin Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'cms' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
*/

-- 5. TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_cms_media_updated
    BEFORE UPDATE ON public.cms_media
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.cms_media IS 'Tracks all assets managed via the CMS Media Library.';
