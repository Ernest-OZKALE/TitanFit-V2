-- =============================================================================
-- SEED: LANDING PAGE CONTENT (Run this to populate CMS)
-- =============================================================================

-- 1. Create 'home' page
INSERT INTO public.cms_pages (id, slug, title, is_published, seo_title, seo_description)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'home', 
    'Accueil TitanFit', 
    true,
    'TitanFit - Votre Parcours Fitness Elite',
    'Application fitness premium avec coaching IA, suivi nutritionnel intelligent, et gamification.'
) ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Hero Section
INSERT INTO public.cms_sections (page_id, section_type, order_index, title, subtitle, content)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'hero',
    0,
    'SCULPTEZ VOTRE LÉGENDE',
    'INTELLIGENCE ARTIFICIELLE. BIO-MÉCANIQUE AVANCÉE. RÉSULTATS GARANTIS.',
    '{
        "cta_primary": "Commencer l''aventure",
        "cta_secondary": "Découvrir la méthode",
        "bg_image": "/assets/city.hdr"
    }'::jsonb
);

-- 3. Insert Features Section
INSERT INTO public.cms_sections (page_id, section_type, order_index, title, subtitle, content)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'features',
    1,
    'LA SUITE TITANIUM',
    'Une technologie de pointe militaire adaptée à votre biologie.',
    '{
        "features": [
            {
                "title": "Nutrition Moléculaire",
                "description": "Analyse ultra-précise de vos macros. Scannez, mangez, optimisez.",
                "icon": "dna"
            },
            {
                "title": "Entrainement Cognitif",
                "description": "Des programmes qui s''adaptent à votre fatigue nerveuse et musculaire en temps réel.",
                "icon": "brain"
            },
            {
                "title": "Communauté Elite",
                "description": "Rejoignez l''avant-garde. Défiez les autres, grimpez les échelons.",
                "icon": "users"
            }
        ]
    }'::jsonb
);
