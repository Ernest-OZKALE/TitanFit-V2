-- Titan CMS V2 - Extended Schema
-- Run this AFTER titan_cms_v1.sql has been applied
-- This migration adds Media Library, Component Registry, Menus, and Global Settings

-- =============================================================================
-- 1. MEDIA LIBRARY
-- =============================================================================

create table if not exists public.cms_media_library (
    id uuid default uuid_generate_v4() primary key,
    filename text not null,
    original_filename text not null,
    storage_path text not null unique, -- Path in Supabase Storage
    public_url text, -- Public accessible URL
    mime_type text not null,
    file_size bigint not null, -- Size in bytes
    width integer, -- For images
    height integer, -- For images
    alt_text text,
    title text,
    description text,
    uploaded_by uuid, -- references auth.users(id) if needed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster lookups
create index idx_media_mime_type on public.cms_media_library(mime_type);
create index idx_media_created_at on public.cms_media_library(created_at desc);

-- =============================================================================
-- 2. COMPONENT REGISTRY
-- =============================================================================
-- Stores metadata about available CMS components and their editable props

create table if not exists public.cms_components (
    id uuid default uuid_generate_v4() primary key,
    component_name text not null unique, -- e.g., 'HeroSection', 'PaywallSection'
    display_name text not null, -- Human-readable name for Admin UI
    category text, -- e.g., 'hero', 'content', 'marketing', 'features'
    description text,
    icon text, -- lucide-react icon name
    
    -- JSON Schema defining editable properties
    -- Example: { "heading": { "type": "string", "label": "Heading" }, "image": { "type": "media", "label": "Background Image" } }
    props_schema jsonb default '{}'::jsonb,
    
    -- Default content when component is added
    default_content jsonb default '{}'::jsonb,
    
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================================================
-- 3. NAVIGATION MENUS
-- =============================================================================

create table if not exists public.cms_menus (
    id uuid default uuid_generate_v4() primary key,
    location text not null, -- 'header', 'footer', 'sidebar'
    label text not null,
    url text,
    icon text, -- lucide-react icon name
    parent_id uuid references public.cms_menus(id) on delete cascade,
    order_index integer default 0,
    is_visible boolean default true,
    target text default '_self', -- '_blank' for new tab
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_menu_location on public.cms_menus(location);
create index idx_menu_parent on public.cms_menus(parent_id);

-- =============================================================================
-- 4. EXTEND cms_sections with media support and locking
-- =============================================================================

alter table public.cms_sections 
    add column if not exists media_id uuid references public.cms_media_library(id) on delete set null;

alter table public.cms_sections 
    add column if not exists locked boolean default false;

alter table public.cms_sections 
    add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- =============================================================================
-- 5. GLOBAL SETTINGS EXPANSION
-- =============================================================================
-- Enhance existing cms_settings with more structured data

-- Insert default global settings
insert into public.cms_settings (key, value, description) values
    ('site_name', '{"value": "TitanFit"}', 'Nom du site affiché dans le header et SEO'),
    ('site_logo', '{"light": "/logo-light.svg", "dark": "/logo-dark.svg"}', 'URLs des logos (clair/sombre)'),
    ('brand_colors', '{"primary": "#D4AF37", "dark": "#0F172A", "light": "#FAFAFA"}', 'Couleurs de la marque Prestige Gold'),
    ('contact_email', '{"value": "contact@titanfit.com"}', 'Email de contact principal'),
    ('social_links', '{"instagram": "", "twitter": "", "facebook": ""}', 'Liens réseaux sociaux')
on conflict (key) do nothing;

-- =============================================================================
-- 6. ROW LEVEL SECURITY (RLS) for new tables
-- =============================================================================

alter table public.cms_media_library enable row level security;
alter table public.cms_components enable row level security;
alter table public.cms_menus enable row level security;

-- Public Read Access
create policy "Allow public read on media" on public.cms_media_library for select using (true);
create policy "Allow public read on components" on public.cms_components for select using (true);
create policy "Allow public read on menus" on public.cms_menus for select using (true);

-- Authenticated Write Access
create policy "Allow auth write on media" on public.cms_media_library for all using (auth.role() = 'authenticated');
create policy "Allow auth write on components" on public.cms_components for all using (auth.role() = 'authenticated');
create policy "Allow auth write on menus" on public.cms_menus for all using (auth.role() = 'authenticated');

-- =============================================================================
-- 7. SEED DATA: Component Registry
-- =============================================================================

DO $$
BEGIN
    -- Register existing components
    insert into public.cms_components (component_name, display_name, category, description, icon, props_schema, default_content) values
    (
        'HeroSection',
        'Hero Section',
        'hero',
        'Section hero principale avec titre, description et CTAs',
        'layout-dashboard',
        '{
            "badge": {"type": "string", "label": "Badge Text"},
            "heading_line_1": {"type": "string", "label": "Heading Line 1"},
            "heading_gradient": {"type": "string", "label": "Highlighted Text"},
            "description": {"type": "textarea", "label": "Description"},
            "cta_primary": {"type": "object", "label": "Primary CTA", "props": {"text": "string", "href": "string"}},
            "cta_secondary": {"type": "object", "label": "Secondary CTA", "props": {"text": "string", "href": "string"}}
        }',
        '{
            "badge": "New",
            "heading_line_1": "BUILD YOUR",
            "heading_gradient": "LEGEND.",
            "description": "Transform your body and mindset.",
            "cta_primary": {"text": "Get Started", "href": "/signup"},
            "cta_secondary": {"text": "Learn More", "href": "/about"}
        }'
    ),
    (
        'HorizontalScrollSection',
        'Horizontal Scroll',
        'features',
        'Section de défilement horizontal avec cartes',
        'move-horizontal',
        '{
            "title_line_1": {"type": "string", "label": "Title"},
            "title_highlight": {"type": "string", "label": "Highlighted Title"},
            "description": {"type": "textarea", "label": "Description"},
            "items": {"type": "array", "label": "Scroll Items", "itemSchema": {"title": "string", "subtitle": "string", "description": "string", "img": "media", "color": "string"}}
        }',
        '{
            "title_line_1": "The Future",
            "title_highlight": "Is Here.",
            "description": "Experience next-generation fitness tracking.",
            "items": []
        }'
    ),
    (
        'BentoGridSection',
        'Bento Grid',
        'features',
        'Grille de fonctionnalités style bento box',
        'grid',
        '{
            "title": {"type": "string", "label": "Section Title"},
            "description": {"type": "textarea", "label": "Description"},
            "items": {"type": "array", "label": "Grid Items", "itemSchema": {"title": "string", "description": "string", "col_span": "number", "img": "media", "icon": "string"}}
        }',
        '{
            "title": "Everything You Need",
            "description": "One platform, infinite possibilities.",
            "items": []
        }'
    ),
    (
        'PaywallSection',
        'Paywall / Subscription',
        'marketing',
        'Section de conversion premium avec prix et témoignages',
        'lock',
        '{
            "heading": {"type": "string", "label": "Heading"},
            "benefits": {"type": "array", "label": "Benefits", "itemType": "string"},
            "rating": {"type": "number", "label": "Rating (0-5)", "min": 0, "max": 5},
            "testimonial": {"type": "object", "label": "Testimonial", "props": {"author": "string", "text": "textarea", "rating": "number"}},
            "cta_text": {"type": "string", "label": "CTA Button Text"},
            "pricing": {"type": "object", "label": "Pricing", "props": {"amount": "string", "period": "string", "trial_text": "string"}}
        }',
        '{
            "heading": "Unlock Your Potential",
            "benefits": ["Unlimited workouts", "AI coaching", "Advanced analytics"],
            "rating": 5.0,
            "testimonial": {"author": "User10", "text": "This app changed my life!", "rating": 5},
            "cta_text": "Start Your Journey",
            "pricing": {"amount": "9.99", "period": "month", "trial_text": "7-day free trial"}
        }'
    ),
    (
        'StatsWidget',
        'Statistics Widget',
        'content',
        'Widget de statistiques avec état vide et verrouillage premium',
        'bar-chart',
        '{
            "stats": {"type": "array", "label": "Statistics", "itemSchema": {"label": "string", "value": "string", "icon": "string", "color": "string", "locked": "boolean"}},
            "no_data_text": {"type": "string", "label": "No Data Text"},
            "upgrade_prompt": {"type": "object", "label": "Upgrade Prompt (if locked)", "props": {"title": "string", "description": "string", "cta_text": "string"}}
        }',
        '{
            "stats": [
                {"label": "Workouts", "value": "No Data", "icon": "flame", "color": "orange", "locked": false},
                {"label": "Volume", "value": "No Data", "icon": "dumbbell", "color": "blue", "locked": false}
            ],
            "no_data_text": "No Data",
            "upgrade_prompt": {"title": "Unlock Premium Stats", "description": "Get detailed insights.", "cta_text": "Upgrade Now"}
        }'
    ),
    (
        'ProgramCard',
        'Training Program Card',
        'content',
        'Carte de programme d''entraînement avec thumbnail',
        'calendar',
        '{
            "title": {"type": "string", "label": "Program Title"},
            "duration": {"type": "string", "label": "Duration"},
            "level": {"type": "string", "label": "Level"},
            "thumbnail": {"type": "media", "label": "Thumbnail Image"},
            "badge": {"type": "string", "label": "Badge (optional)"}
        }',
        '{
            "title": "Beginner Full Body",
            "duration": "8 weeks",
            "level": "Beginner",
            "thumbnail": "/program-default.jpg",
            "badge": ""
        }'
    )
    on conflict (component_name) do nothing;

END $$;

-- =============================================================================
-- 8. UTILITY FUNCTIONS
-- =============================================================================

-- Function to automatically update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger for cms_sections
drop trigger if exists update_cms_sections_updated_at on public.cms_sections;
create trigger update_cms_sections_updated_at
    before update on public.cms_sections
    for each row
    execute procedure public.update_updated_at_column();

-- Trigger for cms_pages
drop trigger if exists update_cms_pages_updated_at on public.cms_pages;
create trigger update_cms_pages_updated_at
    before update on public.cms_pages
    for each row
    execute procedure public.update_updated_at_column();

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- Next steps:
-- 1. Update TypeScript types in src/types/cms.ts
-- 2. Create MediaService for file uploads (src/lib/media-service.ts)
-- 3. Build Admin UI for Media Library (src/app/admin/media/page.tsx)
-- 4. Implement dynamic component rendering (src/lib/cms-components.tsx)
