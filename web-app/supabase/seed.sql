-- TitanFit V2 - Seed Data Script
-- Purpose: Populate database with demo/test data
-- Run this after executing titan_cms_v2.sql

-- =====================================================
-- 1. DEMO USERS / PROFILES
-- =====================================================

-- Admin user (password: Admin123!)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  'admin@titanfit.com',
  '$2a$10$XQlYDzX5vF.b7LGMEqJZYuK8YqTJhLc1v2sGS2ZUoE5XqJYEqJZYu', -- Admin123!
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, avatar_url, role, created_at)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  'admin@titanfit.com',
  'Admin TitanFit',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  'admin',
  NOW()
) ON CONFLICT (id) DO NOTHING;


-- Note: Demo users removed because they need auth.users entries
-- Only admin profile is created since it has matching auth entry above

-- =====================================================
-- 2. PRODUCTS / SUPPLEMENTS
-- =====================================================

INSERT INTO public.products (name, description, price, category, stock_quantity, image_url, is_active, created_at)
VALUES 
  (
    'Whey Protein+ Premium',
    'Protéine de lactosérum isolée de haute qualité. 25g de protéines par portion. Saveur vanille.',
    49.99,
    'supplements',
    150,
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500',
    true,
    NOW()
  ),
  (
    'Pre-Workout Elite',
    'Formule énergétique avancée avec caféine, bêta-alanine et citrulline. Boost explosif.',
    39.99,
    'supplements',
    80,
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500',
    true,
    NOW()
  ),
  (
    'BCAA Recovery',
    'Acides aminés branchés 2:1:1. Favorise la récupération musculaire post-entraînement.',
    34.99,
    'supplements',
    120,
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500',
    true,
    NOW()
  ),
  (
    'Plan Premium Annuel',
    'Accès illimité à tous les programmes, analytics avancées, coaching IA personnalisé.',
    299.99,
    'membership',
    999,
    NULL,
    true,
    NOW()
  ),
  (
    'Plan Mensuel',
    'Accès mensuel aux programmes de base. Résiliable à tout moment.',
    29.99,
    'membership',
    999,
    NULL,
    true,
    NOW()
  ),
  (
    'Creatine Monohydrate',
    'Créatine micronisée pure à 99.9%. Améliore force et performance.',
    24.99,
    'supplements',
    200,
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500',
    true,
    NOW()
  ),
  (
    'Multivitamines Sport',
    'Complexe vitaminique complet adapté aux athlètes. 90 gélules.',
    19.99,
    'supplements',
    180,
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
    true,
    NOW()
  ),
  (
    'Shaker Premium',
    'Shaker anti-fuites 700ml avec compartiment pour poudre. Noir mat.',
    12.99,
    'accessories',
    250,
    'https://images.unsplash.com/photo-1598641795816-a84ac9eac40c?w=500',
    true,
    NOW()
  );

-- =====================================================
-- 3. ORDERS
-- =====================================================

-- Create sample orders using admin user
DO $$
DECLARE
  admin_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;
BEGIN
  -- Insert varied orders with different dates for analytics
  INSERT INTO orders (user_id, total_amount, status, payment_method, created_at)
  VALUES 
    (admin_id, 89.98, 'completed', 'stripe', NOW() - INTERVAL '2 days'),
    (admin_id, 49.99, 'completed', 'stripe', NOW() - INTERVAL '5 days'),
    (admin_id, 299.99, 'completed', 'stripe', NOW() - INTERVAL '12 days'),
    (admin_id, 39.99, 'pending', 'stripe', NOW() - INTERVAL '1 hour'),
    (admin_id, 74.98, 'completed', 'stripe', NOW() - INTERVAL '20 days'),
    (admin_id, 29.99, 'completed', 'stripe', NOW() - INTERVAL '28 days');
END $$;

-- =====================================================
-- 4. BLOG POSTS / CONTENT
-- =====================================================

INSERT INTO public.content_posts (title, slug, excerpt, content, category, status, author_id, featured_image, published_at, created_at)
VALUES 
  (
    'Les 5 Erreurs à Éviter en Musculation',
    'erreurs-musculation-debutants',
    'Découvrez les erreurs les plus communes que font les débutants en salle de sport et comment les éviter.',
    '<h2>Introduction</h2><p>La musculation est un sport exigeant qui demande technique et discipline...</p>',
    'training',
    'published',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    'Nutrition Sportive: Guide Complet 2026',
    'nutrition-sportive-guide-2026',
    'Tout ce que vous devez savoir sur la nutrition pour optimiser vos performances sportives.',
    '<h2>Les Macronutriments</h2><p>Les protéines, glucides et lipides sont essentiels...</p>',
    'nutrition',
    'published',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '16 days'
  ),
  (
    'Programme Full Body pour Débutants',
    'programme-full-body-debutants',
    'Un programme complet 3 jours par semaine pour débuter la musculation efficacement.',
    '<h2>Structure du Programme</h2><p>Ce programme est conçu pour travailler tous les groupes musculaires...</p>',
    'training',
    'published',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    NOW() - INTERVAL '21 days',
    NOW() - INTERVAL '23 days'
  ),
  (
    'Récupération Musculaire: Les Secrets',
    'recuperation-musculaire-secrets',
    'La récupération est aussi importante que l''entraînement. Voici comment optimiser la vôtre.',
    '<h2>Importance du Sommeil</h2><p>Le sommeil est le moment où vos muscles se reconstruisent...</p>',
    'recovery',
    'draft',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    NULL,
    NOW() - INTERVAL '2 days'
  ),
  (
    'Supplémentation: Ce qui Marche Vraiment',
    'supplementation-efficace',
    'Analyse scientifique des suppléments les plus efficaces pour la musculation.',
    '<h2>Les Bases</h2><p>Avant de parler suppléments, assurez-vous que votre alimentation est optimale...</p>',
    'nutrition',
    'published',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'https://images.unsplash.com/photo-1550534791-2677533605ab?w=800',
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '30 days'
  );

-- =====================================================
-- 5. MEDIA LIBRARY
-- =====================================================

INSERT INTO public.media (filename, url, type, size, alt_text, title, description, uploaded_by, created_at)
VALUES 
  (
    'hero-banner.jpg',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920',
    'image',
    245632,
    'Athlète s''entraînant avec haltères',
    'Hero Banner Principal',
    'Image de bannière pour la page d''accueil',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    NOW()
  ),
  (
    'workout-gym.jpg',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
    'image',
    198450,
    'Salle de sport moderne',
    'Gym Equipment',
    'Photo de salle de musculation professionnelle',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    NOW()
  ),
  (
    'protein-shake.jpg',
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800',
    'image',
    156789,
    'Shaker de protéine',
    'Nutrition Sportive',
    'Image de suppléments et nutrition',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    NOW()
  );

-- =====================================================
-- 6. SITE SETTINGS
-- =====================================================

INSERT INTO public.site_settings (key, value, created_at, updated_at)
VALUES 
  ('site_name', 'TitanFit', NOW(), NOW()),
  ('site_url', 'https://titanfit.com', NOW(), NOW()),
  ('site_description', 'Application de fitness premium avec IA pour transformer votre corps', NOW(), NOW()),
  ('contact_email', 'contact@titanfit.com', NOW(), NOW()),
  ('support_email', 'support@titanfit.com', NOW(), NOW()),
  ('default_currency', 'EUR', NOW(), NOW()),
  ('maintenance_mode', 'false', NOW(), NOW()),
  ('enable_2fa', 'false', NOW(), NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- =====================================================
-- 7. SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE '� Users: 1 admin';
  RAISE NOTICE '🛒 Products: 8 (supplements + memberships)';
  RAISE NOTICE '📦 Orders: 6 sample orders';
  RAISE NOTICE '📝 Blog posts: 5 articles';
  RAISE NOTICE '🖼️ Media files: 3 images';
  RAISE NOTICE '⚙️ Site settings: configured';
  RAISE NOTICE '';
  RAISE NOTICE '🔑 Admin Login:';
  RAISE NOTICE '   Email: admin@titanfit.com';
  RAISE NOTICE '   Password: Admin123!';
END $$;
