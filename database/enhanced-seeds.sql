-- Enhanced Seed Data for All Modules
-- This script adds comprehensive data for Payments, Costing, Proposals, Monitoring, and Policies
-- Run this after comprehensive-seeds.sql to add more data

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
DECLARE
  event1_id UUID;
  event2_id UUID;
  event3_id UUID;
  event4_id UUID;
  event5_id UUID;
  event6_id UUID;
  admin_user_id UUID;
  exhibitor_user_ids UUID[];
  reservation_ids UUID[];
  proposal_template_ids UUID[];
BEGIN
  -- Get existing event IDs
  SELECT id INTO event1_id FROM events ORDER BY created_at LIMIT 1 OFFSET 0;
  SELECT id INTO event2_id FROM events ORDER BY created_at LIMIT 1 OFFSET 1;
  SELECT id INTO event3_id FROM events ORDER BY created_at LIMIT 1 OFFSET 2;
  SELECT id INTO event4_id FROM events ORDER BY created_at LIMIT 1 OFFSET 3;
  SELECT id INTO event5_id FROM events ORDER BY created_at LIMIT 1 OFFSET 4;
  SELECT id INTO event6_id FROM events ORDER BY created_at LIMIT 1 OFFSET 5;
  
  -- Get admin user ID
  SELECT id INTO admin_user_id FROM users WHERE role = 'admin' LIMIT 1;
  
  -- Get exhibitor user IDs
  SELECT ARRAY_AGG(id) INTO exhibitor_user_ids FROM users WHERE role = 'exhibitor' LIMIT 10;
  
  -- Get existing reservation IDs
  SELECT ARRAY_AGG(id) INTO reservation_ids FROM reservations LIMIT 50;
  
  -- Get existing proposal template IDs
  SELECT ARRAY_AGG(id) INTO proposal_template_ids FROM proposal_templates LIMIT 5;

  -- ============================================
  -- ADD MORE TRANSACTIONS (Payments Module)
  -- ============================================
  INSERT INTO transactions (id, reservation_id, amount, currency, status, payment_method, stripe_payment_intent_id, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    reservation_ids[1 + (row_number() OVER () % array_length(reservation_ids, 1))],
    CASE (row_number() OVER () % 3)
      WHEN 0 THEN 500.00 + (random() * 500)
      WHEN 1 THEN 1000.00 + (random() * 1000)
      ELSE 2000.00 + (random() * 1500)
    END,
    'USD',
    CASE (row_number() OVER () % 5)
      WHEN 0 THEN 'completed'
      WHEN 1 THEN 'completed'
      WHEN 2 THEN 'completed'
      WHEN 3 THEN 'processing'
      ELSE 'pending'
    END,
    CASE (row_number() OVER () % 4)
      WHEN 0 THEN 'credit_card'
      WHEN 1 THEN 'bank_transfer'
      WHEN 2 THEN 'stripe'
      ELSE 'paypal'
    END,
    CASE WHEN (row_number() OVER () % 2) = 0 THEN 'pi_' || substr(md5(random()::text), 1, 24) ELSE NULL END,
    NOW() - (random() * INTERVAL '60 days'),
    NOW() - (random() * INTERVAL '60 days')
  FROM generate_series(1, 50)
  WHERE array_length(reservation_ids, 1) > 0
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- ADD MORE INVOICES (Payments Module)
  -- ============================================
  INSERT INTO invoices (id, reservation_id, invoice_number, amount, tax_amount, total_amount, status, due_date, issued_at, paid_at, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    reservation_ids[1 + (row_number() OVER () % array_length(reservation_ids, 1))],
    'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD((row_number() OVER () + 100)::text, 6, '0'),
    CASE (row_number() OVER () % 3)
      WHEN 0 THEN 500.00 + (random() * 500)
      WHEN 1 THEN 1000.00 + (random() * 1000)
      ELSE 2000.00 + (random() * 1500)
    END,
    CASE (row_number() OVER () % 3)
      WHEN 0 THEN 50.00 + (random() * 50)
      WHEN 1 THEN 100.00 + (random() * 100)
      ELSE 200.00 + (random() * 150)
    END,
    CASE (row_number() OVER () % 3)
      WHEN 0 THEN 550.00 + (random() * 550)
      WHEN 1 THEN 1100.00 + (random() * 1100)
      ELSE 2200.00 + (random() * 1650)
    END,
    CASE (row_number() OVER () % 5)
      WHEN 0 THEN 'paid'
      WHEN 1 THEN 'paid'
      WHEN 2 THEN 'sent'
      WHEN 3 THEN 'overdue'
      ELSE 'draft'
    END,
    NOW() + INTERVAL '30 days',
    NOW() - (random() * INTERVAL '30 days'),
    CASE WHEN (row_number() OVER () % 3) = 0 THEN NOW() - (random() * INTERVAL '20 days') ELSE NULL END,
    NOW() - (random() * INTERVAL '30 days'),
    NOW()
  FROM generate_series(1, 40)
  WHERE array_length(reservation_ids, 1) > 0
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- ADD MORE COSTS (Costing Module)
  -- ============================================
  INSERT INTO costs (id, event_id, category, description, amount, currency, vendor, date, created_at, updated_at)
  VALUES
    -- Event 1 costs
    (uuid_generate_v4(), event1_id, 'Marketing', 'Social media advertising campaign', 8500.00, 'USD', 'Digital Marketing Pro', CURRENT_DATE - INTERVAL '10 days', NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Logistics', 'Shipping and freight services', 3200.00, 'USD', 'Global Logistics Inc', CURRENT_DATE - INTERVAL '5 days', NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Staffing', 'Additional event coordinators', 4500.00, 'USD', 'Event Staff Solutions', CURRENT_DATE - INTERVAL '3 days', NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Equipment', 'Additional lighting and sound', 6800.00, 'USD', 'AV Equipment Rentals', CURRENT_DATE - INTERVAL '2 days', NOW(), NOW()),
    
    -- Event 2 costs
    (uuid_generate_v4(), event2_id, 'Marketing', 'Print advertising in industry magazines', 12000.00, 'USD', 'Print Media Partners', CURRENT_DATE - INTERVAL '15 days', NOW(), NOW()),
    (uuid_generate_v4(), event2_id, 'Venue', 'Additional space rental', 15000.00, 'USD', 'Las Vegas Convention Center', CURRENT_DATE - INTERVAL '12 days', NOW(), NOW()),
    (uuid_generate_v4(), event2_id, 'Catering', 'VIP reception catering', 5500.00, 'USD', 'Elite Catering Services', CURRENT_DATE - INTERVAL '8 days', NOW(), NOW()),
    (uuid_generate_v4(), event2_id, 'Logistics', 'International shipping', 4200.00, 'USD', 'Worldwide Shipping Co', CURRENT_DATE - INTERVAL '6 days', NOW(), NOW()),
    
    -- Event 3 costs
    (uuid_generate_v4(), event3_id, 'Marketing', 'Email marketing campaign', 3200.00, 'USD', 'Email Marketing Solutions', CURRENT_DATE - INTERVAL '20 days', NOW(), NOW()),
    (uuid_generate_v4(), event3_id, 'Equipment', 'WiFi infrastructure upgrade', 9500.00, 'USD', 'Tech Infrastructure Inc', CURRENT_DATE - INTERVAL '18 days', NOW(), NOW()),
    (uuid_generate_v4(), event3_id, 'Staffing', 'Security personnel', 3800.00, 'USD', 'Secure Events LLC', CURRENT_DATE - INTERVAL '14 days', NOW(), NOW()),
    (uuid_generate_v4(), event3_id, 'Catering', 'Breakfast service', 4200.00, 'USD', 'Morning Delights Catering', CURRENT_DATE - INTERVAL '10 days', NOW(), NOW()),
    
    -- Event 4 costs
    (uuid_generate_v4(), event4_id, 'Marketing', 'Influencer partnerships', 15000.00, 'USD', 'Influencer Network', CURRENT_DATE - INTERVAL '25 days', NOW(), NOW()),
    (uuid_generate_v4(), event4_id, 'Venue', 'Premium location upgrade', 22000.00, 'USD', 'Miami Beach Convention', CURRENT_DATE - INTERVAL '22 days', NOW(), NOW()),
    (uuid_generate_v4(), event4_id, 'Equipment', 'Medical equipment display', 12000.00, 'USD', 'Medical Equipment Rentals', CURRENT_DATE - INTERVAL '16 days', NOW(), NOW()),
    
    -- Event 5 costs
    (uuid_generate_v4(), event5_id, 'Marketing', 'Financial industry publications', 18000.00, 'USD', 'Finance Media Group', CURRENT_DATE - INTERVAL '30 days', NOW(), NOW()),
    (uuid_generate_v4(), event5_id, 'Venue', 'Premium suite rental', 28000.00, 'USD', 'NYC Financial District', CURRENT_DATE - INTERVAL '28 days', NOW(), NOW()),
    (uuid_generate_v4(), event5_id, 'Catering', 'Executive dining service', 8500.00, 'USD', 'Executive Catering', CURRENT_DATE - INTERVAL '20 days', NOW(), NOW()),
    
    -- Event 6 costs
    (uuid_generate_v4(), event6_id, 'Marketing', 'Education sector advertising', 6500.00, 'USD', 'Education Marketing Pro', CURRENT_DATE - INTERVAL '35 days', NOW(), NOW()),
    (uuid_generate_v4(), event6_id, 'Equipment', 'Interactive display technology', 11000.00, 'USD', 'Interactive Tech Solutions', CURRENT_DATE - INTERVAL '30 days', NOW(), NOW()),
    (uuid_generate_v4(), event6_id, 'Staffing', 'Educational coordinators', 5200.00, 'USD', 'Education Staffing', CURRENT_DATE - INTERVAL '25 days', NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- ADD MORE BUDGETS (Costing Module)
  -- ============================================
  INSERT INTO budgets (id, event_id, category, allocated_amount, spent_amount, currency, created_at, updated_at)
  VALUES
    -- Event 1 budgets
    (uuid_generate_v4(), event1_id, 'Logistics', 5000.00, 3200.00, 'USD', NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Staffing', 8000.00, 6000.00, 'USD', NOW(), NOW()),
    
    -- Event 2 budgets
    (uuid_generate_v4(), event2_id, 'Logistics', 6000.00, 4200.00, 'USD', NOW(), NOW()),
    (uuid_generate_v4(), event2_id, 'Equipment', 20000.00, 12000.00, 'USD', NOW(), NOW()),
    
    -- Event 3 budgets
    (uuid_generate_v4(), event3_id, 'Logistics', 4500.00, 3200.00, 'USD', NOW(), NOW()),
    (uuid_generate_v4(), event3_id, 'Equipment', 12000.00, 9500.00, 'USD', NOW(), NOW()),
    
    -- Event 4 budgets
    (uuid_generate_v4(), event4_id, 'Marketing', 20000.00, 15000.00, 'USD', NOW(), NOW()),
    (uuid_generate_v4(), event4_id, 'Equipment', 15000.00, 12000.00, 'USD', NOW(), NOW()),
    
    -- Event 5 budgets
    (uuid_generate_v4(), event5_id, 'Marketing', 25000.00, 18000.00, 'USD', NOW(), NOW()),
    (uuid_generate_v4(), event5_id, 'Catering', 12000.00, 8500.00, 'USD', NOW(), NOW()),
    
    -- Event 6 budgets
    (uuid_generate_v4(), event6_id, 'Marketing', 10000.00, 6500.00, 'USD', NOW(), NOW()),
    (uuid_generate_v4(), event6_id, 'Equipment', 15000.00, 11000.00, 'USD', NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- ADD MORE PROPOSALS (Proposals Module)
  -- ============================================
  INSERT INTO proposals (id, event_id, submitted_by, template_id, title, description, status, submitted_at, approved_at, rejected_at, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    CASE (row_number() OVER () % 6)
      WHEN 0 THEN event1_id
      WHEN 1 THEN event2_id
      WHEN 2 THEN event3_id
      WHEN 3 THEN event4_id
      WHEN 4 THEN event5_id
      ELSE event6_id
    END,
    exhibitor_user_ids[1 + (row_number() OVER () % array_length(exhibitor_user_ids, 1))],
    proposal_template_ids[1 + (row_number() OVER () % array_length(proposal_template_ids, 1))],
    'Booth Proposal - Event ' || (row_number() OVER () % 6 + 1) || ' - Company ' || row_number() OVER (),
    'We are very interested in participating in this event. Our company specializes in innovative solutions and we believe this event would be an excellent platform to showcase our products and services. We are requesting a premium booth location to maximize our visibility and engagement with potential clients.',
    CASE (row_number() OVER () % 5)
      WHEN 0 THEN 'approved'
      WHEN 1 THEN 'submitted'
      WHEN 2 THEN 'submitted'
      WHEN 3 THEN 'rejected'
      ELSE 'draft'
    END,
    CASE WHEN (row_number() OVER () % 5) IN (0, 1, 2) THEN NOW() - (random() * INTERVAL '30 days') ELSE NULL END,
    CASE WHEN (row_number() OVER () % 5) = 0 THEN NOW() - (random() * INTERVAL '20 days') ELSE NULL END,
    CASE WHEN (row_number() OVER () % 5) = 3 THEN NOW() - (random() * INTERVAL '15 days') ELSE NULL END,
    NOW() - (random() * INTERVAL '30 days'),
    NOW()
  FROM generate_series(1, 25)
  WHERE array_length(exhibitor_user_ids, 1) > 0 AND array_length(proposal_template_ids, 1) > 0
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- ADD MORE PROPOSAL TEMPLATES (Proposals Module)
  -- ============================================
  INSERT INTO proposal_templates (id, name, description, content, category, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), 'Premium Corner Booth', 'Corner location with high visibility', 'We are pleased to offer you a premium corner booth location at our upcoming event. This prime location offers maximum visibility and foot traffic, perfect for companies looking to make a significant impact.', 'Premium', NOW(), NOW()),
    (uuid_generate_v4(), 'Standard Booth Package', 'Standard booth with essential amenities', 'Our standard booth package includes a 10x10 space with basic amenities including power, WiFi, and a table. Perfect for companies looking for a cost-effective solution.', 'Standard', NOW(), NOW()),
    (uuid_generate_v4(), 'Startup Package', 'Affordable option for startups', 'We understand that startups need cost-effective solutions. Our startup package offers a smaller booth space at a discounted rate, perfect for emerging companies.', 'Startup', NOW(), NOW()),
    (uuid_generate_v4(), 'Enterprise Package', 'Comprehensive solution for large companies', 'Our enterprise package includes a large booth space, premium location, additional marketing support, and exclusive networking opportunities. Designed for industry leaders.', 'Enterprise', NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- ADD MORE MONITORING METRICS (Monitoring Module)
  -- ============================================
  INSERT INTO monitoring_metrics (id, event_id, metric_type, metric_name, value, recorded_at, created_at)
  VALUES
    -- Event 1 metrics
    (uuid_generate_v4(), event1_id, 'revenue', 'daily_revenue', 12500.00, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event1_id, 'revenue', 'daily_revenue', 15200.00, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event1_id, 'attendance', 'daily_registrations', 85, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event1_id, 'attendance', 'daily_registrations', 92, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event1_id, 'booth_occupancy', 'booth_occupancy_rate', 68.5, CURRENT_DATE, NOW()),
    
    -- Event 2 metrics
    (uuid_generate_v4(), event2_id, 'revenue', 'daily_revenue', 18200.00, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event2_id, 'revenue', 'daily_revenue', 20100.00, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event2_id, 'attendance', 'daily_registrations', 120, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event2_id, 'attendance', 'daily_registrations', 135, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event2_id, 'booth_occupancy', 'booth_occupancy_rate', 72.3, CURRENT_DATE, NOW()),
    
    -- Event 3 metrics
    (uuid_generate_v4(), event3_id, 'revenue', 'daily_revenue', 9800.00, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event3_id, 'revenue', 'daily_revenue', 11200.00, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event3_id, 'attendance', 'daily_registrations', 65, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event3_id, 'attendance', 'daily_registrations', 78, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event3_id, 'booth_occupancy', 'booth_occupancy_rate', 65.8, CURRENT_DATE, NOW()),
    
    -- Event 4 metrics
    (uuid_generate_v4(), event4_id, 'revenue', 'daily_revenue', 15200.00, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event4_id, 'revenue', 'daily_revenue', 16800.00, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event4_id, 'attendance', 'daily_registrations', 95, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event4_id, 'attendance', 'daily_registrations', 108, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event4_id, 'booth_occupancy', 'booth_occupancy_rate', 70.2, CURRENT_DATE, NOW()),
    
    -- Event 5 metrics
    (uuid_generate_v4(), event5_id, 'revenue', 'daily_revenue', 22100.00, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event5_id, 'revenue', 'daily_revenue', 24500.00, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event5_id, 'attendance', 'daily_registrations', 145, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event5_id, 'attendance', 'daily_registrations', 162, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event5_id, 'booth_occupancy', 'booth_occupancy_rate', 75.6, CURRENT_DATE, NOW()),
    
    -- Event 6 metrics
    (uuid_generate_v4(), event6_id, 'revenue', 'daily_revenue', 8900.00, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event6_id, 'revenue', 'daily_revenue', 10200.00, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event6_id, 'attendance', 'daily_registrations', 58, CURRENT_DATE - INTERVAL '1 day', NOW()),
    (uuid_generate_v4(), event6_id, 'attendance', 'daily_registrations', 72, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event6_id, 'booth_occupancy', 'booth_occupancy_rate', 63.4, CURRENT_DATE, NOW())
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- ADD TEAM ACTIVITY (Monitoring Module)
  -- ============================================
  INSERT INTO team_activity (id, user_id, event_id, action_type, description, metadata, created_at)
  SELECT 
    uuid_generate_v4(),
    exhibitor_user_ids[1 + (row_number() OVER () % array_length(exhibitor_user_ids, 1))],
    CASE (row_number() OVER () % 6)
      WHEN 0 THEN event1_id
      WHEN 1 THEN event2_id
      WHEN 2 THEN event3_id
      WHEN 3 THEN event4_id
      WHEN 4 THEN event5_id
      ELSE event6_id
    END,
    CASE (row_number() OVER () % 8)
      WHEN 0 THEN 'booth_reserved'
      WHEN 1 THEN 'booth_booked'
      WHEN 2 THEN 'proposal_submitted'
      WHEN 3 THEN 'payment_completed'
      WHEN 4 THEN 'invoice_viewed'
      WHEN 5 THEN 'event_registered'
      WHEN 6 THEN 'profile_updated'
      ELSE 'document_uploaded'
    END,
    CASE (row_number() OVER () % 8)
      WHEN 0 THEN 'Reserved booth A' || (row_number() OVER () % 50 + 1)
      WHEN 1 THEN 'Booked premium booth location'
      WHEN 2 THEN 'Submitted proposal for event participation'
      WHEN 3 THEN 'Completed payment for booth reservation'
      WHEN 4 THEN 'Viewed invoice details'
      WHEN 5 THEN 'Registered for event'
      WHEN 6 THEN 'Updated company profile information'
      ELSE 'Uploaded marketing materials'
    END,
    jsonb_build_object(
      'booth_id', CASE WHEN (row_number() OVER () % 2) = 0 THEN uuid_generate_v4()::text ELSE NULL END,
      'amount', CASE WHEN (row_number() OVER () % 4) = 0 THEN (500 + random() * 2000)::numeric(10,2) ELSE NULL END,
      'status', CASE (row_number() OVER () % 3)
        WHEN 0 THEN 'success'
        WHEN 1 THEN 'pending'
        ELSE 'completed'
      END
    ),
    NOW() - (random() * INTERVAL '45 days')
  FROM generate_series(1, 60)
  WHERE array_length(exhibitor_user_ids, 1) > 0
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- ADD MORE POLICIES (Policies Module)
  -- ============================================
  INSERT INTO policies (id, title, category, content, version, is_active, effective_date, expires_at, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), 'Booth Setup Time Policy', 'Operations', 'All booth setups must be completed no later than 2 hours before the event opening. Late setups may result in penalties or booth closure. Setup materials must be approved by venue management 48 hours prior to setup.', '1.2', true, CURRENT_DATE - INTERVAL '30 days', NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Marketing Material Approval', 'Marketing', 'All marketing materials, including banners, flyers, and promotional items, must be submitted for approval at least 7 business days before the event. Materials that do not meet venue guidelines will be rejected.', '2.0', true, CURRENT_DATE - INTERVAL '20 days', NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Payment Schedule Policy', 'Finance', 'Initial deposit of 50% is required within 7 days of booth reservation. Final payment is due 30 days before the event. Late payments may result in reservation cancellation.', '1.5', true, CURRENT_DATE - INTERVAL '15 days', NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Exhibitor Code of Conduct', 'Operations', 'All exhibitors must maintain professional conduct, respect other exhibitors and attendees, and comply with all venue regulations. Violations may result in immediate removal from the event.', '1.0', true, CURRENT_DATE - INTERVAL '10 days', NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Booth Sharing Policy', 'Sales', 'Booth sharing between multiple companies is not permitted without prior written approval from event organizers. Shared booths must be clearly marked and approved in advance.', '1.1', false, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '30 days', NOW(), NOW()),
    (uuid_generate_v4(), 'Refund Processing Policy', 'Finance', 'Refund requests must be submitted in writing at least 45 days before the event. Refunds are processed within 10-15 business days. Processing fees of 5% may apply.', '1.3', true, CURRENT_DATE - INTERVAL '25 days', NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Equipment Rental Policy', 'Operations', 'Additional equipment can be rented through approved vendors. All equipment must be returned in good condition. Damage fees will apply for any equipment not returned in original condition.', '1.0', true, CURRENT_DATE - INTERVAL '18 days', NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'VIP Access Policy', 'Operations', 'VIP passes are available for premium booth holders. Each premium booth includes 2 VIP passes. Additional passes can be purchased at a discounted rate.', '1.0', true, CURRENT_DATE - INTERVAL '12 days', NULL, NOW(), NOW())
  ON CONFLICT DO NOTHING;

END $$;

-- Summary
SELECT 
  'Transactions' as table_name, COUNT(*) as record_count FROM transactions
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Costs', COUNT(*) FROM costs
UNION ALL
SELECT 'Budgets', COUNT(*) FROM budgets
UNION ALL
SELECT 'Proposals', COUNT(*) FROM proposals
UNION ALL
SELECT 'Proposal Templates', COUNT(*) FROM proposal_templates
UNION ALL
SELECT 'Monitoring Metrics', COUNT(*) FROM monitoring_metrics
UNION ALL
SELECT 'Team Activity', COUNT(*) FROM team_activity
UNION ALL
SELECT 'Policies', COUNT(*) FROM policies;

