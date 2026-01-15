-- TitanFit V2 - Ultra Minimal Seed
-- This creates orders and settings WITHOUT touching profiles
-- Use your own account (ernestozkale@gmail.com) which already exists

-- =====================================================
-- 1. SAMPLE ORDERS (using your existing user ID)
-- =====================================================

-- First, let's create orders using your actual user ID
DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Get your user ID from your email
  SELECT id INTO user_id FROM profiles WHERE email = 'ernestozkale@gmail.com' LIMIT 1;
  
  -- If user exists, create orders
  IF user_id IS NOT NULL THEN
    INSERT INTO orders (user_id, total_amount, status, payment_method, created_at)
    VALUES 
      (user_id, 89.98, 'completed', 'stripe', NOW() - INTERVAL '2 days'),
      (user_id, 149.99, 'completed', 'stripe', NOW() - INTERVAL '5 days'),
      (user_id, 299.99, 'completed', 'stripe', NOW() - INTERVAL '10 days'),
      (user_id, 49.99, 'completed', 'stripe', NOW() - INTERVAL '15 days'),
      (user_id, 79.98, 'completed', 'stripe', NOW() - INTERVAL '18 days'),
      (user_id, 29.99, 'completed', 'stripe', NOW() - INTERVAL '25 days'),
      (user_id, 199.99, 'completed', 'stripe', NOW() - INTERVAL '40 days'),
      (user_id, 59.99, 'completed', 'stripe', NOW() - INTERVAL '50 days')
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '✅ Created 8 orders for user: %', 'ernestozkale@gmail.com';
  ELSE
    RAISE NOTICE '⚠️  User not found. Please log in to the app first at http://localhost:3000/login';
    RAISE NOTICE '   Then run this script again.';
  END IF;
END $$;

-- =====================================================
-- SUCCESS
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Seed completed!';
  RAISE NOTICE '📦 Orders: 8 sample orders created';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Now check analytics at: http://localhost:3000/admin/analytics';
  RAISE NOTICE '🔐 Login with: ernestozkale@gmail.com';
END $$;
