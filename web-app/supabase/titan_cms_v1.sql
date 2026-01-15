-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CMS PAGES
-- Represents a single route or page in the application (e.g., '/', '/about')
create table if not exists public.cms_pages (
    id uuid default uuid_generate_v4() primary key,
    slug text not null unique,
    title text not null,
    seo_title text,
    seo_description text,
    is_published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CMS SECTIONS
-- Represents a dynamic block on a page (e.g., Hero, BentoGrid, HorizontalScroll)
create table if not exists public.cms_sections (
    id uuid default uuid_generate_v4() primary key,
    page_id uuid references public.cms_pages(id) on delete cascade not null,
    section_type text not null, -- 'hero', 'bento', 'scroll', 'features', 'cta', 'html'
    order_index integer not null default 0,
    
    -- Core Content
    title text,
    subtitle text,
    description text,
    
    -- JSONB for flexible data structures (buttons, list items, features)
    -- Structure example for Bento: { items: [{ title: "", icon: "", desc: "" }] }
    content jsonb default '{}'::jsonb,
    
    -- Styling overrides
    -- Structure: { bg_color: "", text_color: "", padding: "", theme: "prestige" }
    style_config jsonb default '{}'::jsonb,
    
    component_name text, -- Matches the React component name map
    is_visible boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. GLOBAL SETTINGS
-- For site-wide variables like navbar links, footer scripts, logos
create table if not exists public.cms_settings (
    key text primary key, -- e.g., 'site_name', 'navbar_links', 'footer_config'
    value jsonb not null,
    description text
);

-- RLS POLICIES (Simple for now: Public Read, Auth Write)
alter table public.cms_pages enable row level security;
alter table public.cms_sections enable row level security;
alter table public.cms_settings enable row level security;

-- Public Read Access
create policy "Allow public read on pages" on public.cms_pages for select using (true);
create policy "Allow public read on sections" on public.cms_sections for select using (true);
create policy "Allow public read on settings" on public.cms_settings for select using (true);

-- Authenticated Write Access (adjust as needed for Admin role)
create policy "Allow auth write on pages" on public.cms_pages for all using (auth.role() = 'authenticated');
create policy "Allow auth write on sections" on public.cms_sections for all using (auth.role() = 'authenticated');
create policy "Allow auth write on settings" on public.cms_settings for all using (auth.role() = 'authenticated');

-- SEED DATA: Landing Page V1 (The "World Class" Page we just built)
-- This allows us to start with the current state in the DB.

DO $$
DECLARE
    home_page_id uuid;
BEGIN
    -- Insert Home Page
    insert into public.cms_pages (slug, title, seo_title, seo_description, is_published)
    values ('home', 'Accueil', 'TitanFit - Forgez Votre Légende', 'L''intelligence somatique la plus avancée au monde.', true)
    returning id into home_page_id;

    -- 1. Hero Section
    insert into public.cms_sections (page_id, section_type, order_index, component_name, content, style_config)
    values (
        home_page_id,
        'hero',
        0,
        'HeroSection',
        '{
            "badge": "L''Ère du Titan Commence",
            "heading_line_1": "FORGEZ VOTRE",
            "heading_gradient": "LÉGENDE.",
            "description": "L''intelligence somatique la plus avancée au monde. Nutrition de précision, entraînement d''élite et mental d''acier.",
            "cta_primary": { "text": "Rejoindre l''Élite", "href": "/signup" },
            "cta_secondary": { "text": "Accès Membre", "href": "/login" }
        }',
        '{ "theme": "prestige_gold" }'
    );

    -- 2. Social Proof Section
    insert into public.cms_sections (page_id, section_type, order_index, component_name, content)
    values (
        home_page_id,
        'marquee',
        1,
        'SocialProofMarquee',
        '{ "items": ["Men''s Health", "Vogue", "Forbes", "GymShark", "MyProtein", "Nike", "CrossFit", "Under Armour", "Adidas"] }'
    );

    -- 3. Horizontal Scroll Section
    insert into public.cms_sections (page_id, section_type, order_index, component_name, content)
    values (
        home_page_id,
        'horizontal_scroll',
        2,
        'HorizontalScrollSection',
        '{
            "title_line_1": "L''Avant-Garde",
            "title_highlight": "Absolue.",
            "description": "Une interface fluide comme l''eau, puissante comme le roc. Conçue pour l''élite.",
            "items": [
                 { "id": 1, "title": "Centre de Commandement", "subtitle": "Vue Panoramique", "description": "Vos métriques vitales, centralisées. Une clarté absolue sur votre progression.", "img": "/bento-biometrics.png", "color": "from-slate-900 to-slate-800" },
                 { "id": 2, "title": "Intelligence Titan", "subtitle": "Oracle Personnel", "description": "Posez n''importe quelle question. Obtenez une stratégie digne d''un champion olympique.", "img": "/bento-coach.png", "color": "from-[#D4AF37] to-[#B8860B]" },
                 { "id": 3, "title": "Nutrition Moléculaire", "subtitle": "Scan Rétinien", "description": "Analyse instantanée de vos repas. Macro-nutriments calculés à la molécule près.", "img": "/food-mock.png", "color": "from-slate-800 to-slate-900" },
                 { "id": 4, "title": "Le Cercle Élite", "subtitle": "Hiérarchie", "description": "Rejoignez les 1%. Battez-vous pour votre place au sommet.", "img": "/bento-leaderboard.png", "color": "from-slate-100 to-white", "textColor": "text-slate-900" }
            ]
        }'
    );

    -- 4. Bento Grid Section
    insert into public.cms_sections (page_id, section_type, order_index, component_name, content)
    values (
        home_page_id,
        'bento_grid',
        3,
        'BentoGridSection',
        '{
            "title": "Un Écosystème Bionique.",
            "description": "Votre corps est un temple. Nous sommes les architectes.",
            "items": [
                { "title": "Intelligence Titan™", "description": "Analyse prédictive de vos besoins métaboliques en temps réel.", "col_span": 2, "img": "/bento-coach.png", "icon": "zap" },
                { "title": "Bio-Synchronisation", "description": "Connexion neuronale avec Apple Health & Google Fit.", "col_span": 1, "img": "/bento-biometrics.png", "icon": "activity" },
                { "title": "Coffre-Fort Quantique", "description": "Chiffrement de grade militaire.", "col_span": 1, "img": "/bento-security.png", "icon": "shield" },
                { "title": "Arène Mondiale", "description": "Prouvez votre valeur. Dominez le classement.", "col_span": 2, "img": "/bento-leaderboard.png", "icon": "trophy" }
            ]
        }'
    );

END $$;
