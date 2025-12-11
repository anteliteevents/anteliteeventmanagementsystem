-- Comprehensive Seed Data
-- This script adds extensive realistic data for testing and demonstration
-- Run this after the initial schema and module-tables are created

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE invoices, transactions, reservations, booths, events, users CASCADE;

-- ============================================
-- USERS (More Users)
-- ============================================
INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, phone, role, is_active, created_at, updated_at)
VALUES
  -- Admins
  (uuid_generate_v4(), 'john.admin@antelite.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'John', 'Administrator', 'Antelite Events', '+1-555-0101', 'admin', true, NOW(), NOW()),
  (uuid_generate_v4(), 'sarah.manager@antelite.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Sarah', 'Mitchell', 'Antelite Events', '+1-555-0102', 'admin', true, NOW(), NOW()),
  
  -- Exhibitors - Tech Companies
  (uuid_generate_v4(), 'contact@techcorp.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Michael', 'Chen', 'TechCorp Solutions', '+1-555-0201', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'info@innovateai.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Emily', 'Rodriguez', 'InnovateAI', '+1-555-0202', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'sales@cloudtech.io', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'David', 'Kim', 'CloudTech Industries', '+1-555-0203', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'hello@dataviz.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Lisa', 'Anderson', 'DataViz Pro', '+1-555-0204', 'exhibitor', true, NOW(), NOW()),
  
  -- Exhibitors - Marketing Agencies
  (uuid_generate_v4(), 'team@brandmasters.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'James', 'Wilson', 'BrandMasters Agency', '+1-555-0301', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'contact@digitalwave.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Patricia', 'Brown', 'Digital Wave Marketing', '+1-555-0302', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'info@creativehub.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Robert', 'Taylor', 'Creative Hub', '+1-555-0303', 'exhibitor', true, NOW(), NOW()),
  
  -- Exhibitors - Manufacturing
  (uuid_generate_v4(), 'sales@precisionmfg.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJq', 'Jennifer', 'Martinez', 'Precision Manufacturing', '+1-555-0401', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'info@greenenergy.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJq', 'William', 'Davis', 'Green Energy Solutions', '+1-555-0402', 'exhibitor', true, NOW(), NOW()),
  
  -- Exhibitors - Services
  (uuid_generate_v4(), 'hello@consultpro.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJq', 'Amanda', 'Garcia', 'ConsultPro Services', '+1-555-0501', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'contact@logisticsplus.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJq', 'Christopher', 'Lee', 'Logistics Plus', '+1-555-0502', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'info@financehub.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJq', 'Jessica', 'White', 'Finance Hub', '+1-555-0503', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'sales@healthcareplus.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJq', 'Daniel', 'Harris', 'Healthcare Plus', '+1-555-0504', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'team@edutech.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJq', 'Nicole', 'Clark', 'EduTech Solutions', '+1-555-0505', 'exhibitor', true, NOW(), NOW())
-- Avoid duplicate email conflicts when re-running seeds
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- EVENTS (More Events)
-- ============================================
DO $$
DECLARE
  event1_id UUID := uuid_generate_v4();
  event2_id UUID := uuid_generate_v4();
  event3_id UUID := uuid_generate_v4();
  event4_id UUID := uuid_generate_v4();
  event5_id UUID := uuid_generate_v4();
  event6_id UUID := uuid_generate_v4();
BEGIN
  INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at)
  VALUES
    (event1_id, 'Tech Innovation Summit 2025', 'The premier technology conference showcasing cutting-edge innovations in AI, cloud computing, and digital transformation. Join industry leaders for keynotes, workshops, and networking.', 
     '2025-03-15 09:00:00', '2025-03-17 18:00:00', 'San Francisco Convention Center', 'published', NOW(), NOW()),
    
    (event2_id, 'Digital Marketing Expo 2025', 'Comprehensive marketing conference covering SEO, social media, content marketing, and analytics. Perfect for marketing professionals and agencies.', 
     '2025-04-20 08:00:00', '2025-04-22 17:00:00', 'Las Vegas Convention Center', 'active', NOW(), NOW()),
    
    (event3_id, 'Manufacturing Excellence Forum', 'Industry-leading event for manufacturing professionals. Explore automation, quality control, supply chain optimization, and sustainable manufacturing practices.', 
     '2025-05-10 09:00:00', '2025-05-12 17:00:00', 'Chicago McCormick Place', 'published', NOW(), NOW()),
    
    (event4_id, 'Healthcare Innovation Conference', 'Connecting healthcare professionals with technology solutions. Topics include telemedicine, EHR systems, patient care, and medical device innovations.', 
     '2025-06-05 08:00:00', '2025-06-07 18:00:00', 'Boston Convention Center', 'draft', NOW(), NOW()),
    
    (event5_id, 'Finance & FinTech Summit', 'Explore the future of finance with discussions on blockchain, digital payments, investment strategies, and regulatory compliance.', 
     '2025-07-15 09:00:00', '2025-07-17 17:00:00', 'New York Javits Center', 'published', NOW(), NOW()),
    
    (event6_id, 'Education Technology Conference', 'EdTech conference for educators, administrators, and technology providers. Discover innovative learning solutions and teaching methodologies.', 
     '2025-08-20 08:00:00', '2025-08-22 16:00:00', 'Seattle Convention Center', 'active', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- ============================================
  -- BOOTHS (Many booths for each event)
  -- ============================================
  -- Event 1: Tech Innovation Summit (150 booths)
  INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    event1_id,
    CASE 
      WHEN i <= 50 THEN 'A' || LPAD(i::text, 2, '0')
      WHEN i <= 100 THEN 'B' || LPAD((i-50)::text, 2, '0')
      ELSE 'C' || LPAD((i-100)::text, 2, '0')
    END,
    CASE (i % 4)
      WHEN 0 THEN 'small'
      WHEN 1 THEN 'medium'
      WHEN 2 THEN 'large'
      ELSE 'xlarge'
    END,
    CASE (i % 4)
      WHEN 0 THEN 800.00
      WHEN 1 THEN 1500.00
      WHEN 2 THEN 2500.00
      ELSE 4000.00
    END,
    CASE (i % 10)
      WHEN 0 THEN 'booked'
      WHEN 1 THEN 'booked'
      WHEN 2 THEN 'reserved'
      WHEN 3 THEN 'reserved'
      ELSE 'available'
    END,
    ((i - 1) % 25) * 10 + 10,
    ((i - 1) / 25) * 10 + 10,
    1,
    1,
    'Premium booth location with high visibility',
    ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area'],
    NOW(),
    NOW()
  FROM generate_series(1, 150) AS i;

  -- Event 2: Digital Marketing Expo (120 booths)
  INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    event2_id,
    CASE 
      WHEN i <= 40 THEN 'M' || LPAD(i::text, 2, '0')
      WHEN i <= 80 THEN 'N' || LPAD((i-40)::text, 2, '0')
      ELSE 'O' || LPAD((i-80)::text, 2, '0')
    END,
    CASE (i % 3)
      WHEN 0 THEN 'small'
      WHEN 1 THEN 'medium'
      ELSE 'large'
    END,
    CASE (i % 3)
      WHEN 0 THEN 600.00
      WHEN 1 THEN 1200.00
      ELSE 2000.00
    END,
    CASE (i % 8)
      WHEN 0 THEN 'booked'
      WHEN 1 THEN 'booked'
      WHEN 2 THEN 'reserved'
      ELSE 'available'
    END,
    ((i - 1) % 20) * 12 + 10,
    ((i - 1) / 20) * 12 + 10,
    1,
    1,
    'Strategic marketing expo location',
    ARRAY['WiFi', 'Power outlets'],
    NOW(),
    NOW()
  FROM generate_series(1, 120) AS i;

  -- Event 3: Manufacturing Forum (100 booths)
  INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    event3_id,
    'MF' || LPAD(i::text, 3, '0'),
    CASE (i % 4)
      WHEN 0 THEN 'small'
      WHEN 1 THEN 'medium'
      WHEN 2 THEN 'large'
      ELSE 'xlarge'
    END,
    CASE (i % 4)
      WHEN 0 THEN 700.00
      WHEN 1 THEN 1300.00
      WHEN 2 THEN 2200.00
      ELSE 3500.00
    END,
    CASE (i % 7)
      WHEN 0 THEN 'booked'
      WHEN 1 THEN 'booked'
      WHEN 2 THEN 'reserved'
      ELSE 'available'
    END,
    ((i - 1) % 20) * 10 + 10,
    ((i - 1) / 20) * 10 + 10,
    1,
    1,
    'Manufacturing industry showcase space',
    ARRAY['Heavy power', 'Loading dock access', 'Storage'],
    NOW(),
    NOW()
  FROM generate_series(1, 100) AS i;

  -- Event 4: Healthcare Conference (80 booths)
  INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    event4_id,
    'HC' || LPAD(i::text, 3, '0'),
    CASE (i % 3)
      WHEN 0 THEN 'small'
      WHEN 1 THEN 'medium'
      ELSE 'large'
    END,
    CASE (i % 3)
      WHEN 0 THEN 900.00
      WHEN 1 THEN 1800.00
      ELSE 3000.00
    END,
    CASE (i % 6)
      WHEN 0 THEN 'booked'
      WHEN 1 THEN 'reserved'
      ELSE 'available'
    END,
    ((i - 1) % 16) * 12 + 10,
    ((i - 1) / 16) * 12 + 10,
    1,
    1,
    'Healthcare technology demonstration area',
    ARRAY['Medical grade power', 'Privacy screens', 'WiFi'],
    NOW(),
    NOW()
  FROM generate_series(1, 80) AS i;

  -- Event 5: Finance Summit (90 booths)
  INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    event5_id,
    'FS' || LPAD(i::text, 3, '0'),
    CASE (i % 3)
      WHEN 0 THEN 'small'
      WHEN 1 THEN 'medium'
      ELSE 'large'
    END,
    CASE (i % 3)
      WHEN 0 THEN 1000.00
      WHEN 1 THEN 2000.00
      ELSE 3500.00
    END,
    CASE (i % 9)
      WHEN 0 THEN 'booked'
      WHEN 1 THEN 'booked'
      WHEN 2 THEN 'reserved'
      ELSE 'available'
    END,
    ((i - 1) % 18) * 11 + 10,
    ((i - 1) / 18) * 11 + 10,
    1,
    1,
    'Premium finance industry showcase',
    ARRAY['Secure WiFi', 'Private meeting area', 'Display screens'],
    NOW(),
    NOW()
  FROM generate_series(1, 90) AS i;

  -- Event 6: Education Tech Conference (70 booths)
  INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    event6_id,
    'ET' || LPAD(i::text, 3, '0'),
    CASE (i % 3)
      WHEN 0 THEN 'small'
      WHEN 1 THEN 'medium'
      ELSE 'large'
    END,
    CASE (i % 3)
      WHEN 0 THEN 500.00
      WHEN 1 THEN 1000.00
      ELSE 1800.00
    END,
    CASE (i % 5)
      WHEN 0 THEN 'booked'
      WHEN 1 THEN 'reserved'
      ELSE 'available'
    END,
    ((i - 1) % 14) * 10 + 10,
    ((i - 1) / 14) * 10 + 10,
    1,
    1,
    'Educational technology demonstration space',
    ARRAY['WiFi', 'Power outlets', 'Interactive displays'],
    NOW(),
    NOW()
  FROM generate_series(1, 70) AS i;

  -- ============================================
  -- RESERVATIONS (Many reservations)
  -- ============================================
  -- Create reservations using a simpler approach
  INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, expires_at, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    b.id,
    (SELECT id FROM users WHERE role = 'exhibitor' ORDER BY random() LIMIT 1),
    event1_id,
    CASE (row_number() OVER () % 3)
      WHEN 0 THEN 'confirmed'
      WHEN 1 THEN 'pending'
      ELSE 'confirmed'
    END,
    NOW() - (random() * INTERVAL '30 days'),
    CASE 
      WHEN (row_number() OVER () % 3) = 1 THEN NOW() + INTERVAL '7 days'
      ELSE NULL
    END,
    NOW() - (random() * INTERVAL '30 days'),
    NOW()
  FROM booths b
  WHERE b.event_id = event1_id AND b.status IN ('booked', 'reserved')
  LIMIT 30
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- TRANSACTIONS (Payment transactions)
  -- ============================================
  -- Create transactions for confirmed reservations
  INSERT INTO transactions (id, reservation_id, amount, currency, status, payment_method, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    r.id,
    b.price,
    'USD',
    CASE (row_number() OVER () % 4)
      WHEN 0 THEN 'completed'
      WHEN 1 THEN 'completed'
      WHEN 2 THEN 'processing'
      ELSE 'pending'
    END,
    CASE (row_number() OVER () % 3)
      WHEN 0 THEN 'credit_card'
      WHEN 1 THEN 'bank_transfer'
      ELSE 'stripe'
    END,
    NOW() - (random() * INTERVAL '20 days'),
    NOW()
  FROM reservations r
  JOIN booths b ON b.id = r.booth_id
  WHERE r.status = 'confirmed' AND r.event_id = event1_id
  LIMIT 20
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- INVOICES (Generate invoices)
  -- ============================================
  INSERT INTO invoices (id, reservation_id, invoice_number, amount, tax_amount, total_amount, status, due_date, issued_at, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    r.id,
    'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD((row_number() OVER ())::text, 6, '0'),
    b.price * 0.9,
    b.price * 0.1,
    b.price,
    CASE (row_number() OVER () % 4)
      WHEN 0 THEN 'paid'
      WHEN 1 THEN 'sent'
      WHEN 2 THEN 'overdue'
      ELSE 'draft'
    END,
    NOW() + INTERVAL '30 days',
    NOW() - (random() * INTERVAL '15 days'),
    NOW() - (random() * INTERVAL '15 days'),
    NOW()
  FROM reservations r
  JOIN booths b ON b.id = r.booth_id
  WHERE r.status = 'confirmed' AND r.event_id = event1_id
  LIMIT 15
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- COSTS (Cost tracking)
  -- ============================================
  INSERT INTO costs (id, event_id, category, description, amount, date, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), event1_id, 'Venue', 'Convention center rental', 50000.00, '2025-01-15', NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Marketing', 'Digital advertising campaign', 15000.00, '2025-01-20', NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Catering', 'Coffee breaks and lunch service', 8000.00, '2025-02-01', NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Equipment', 'AV equipment rental', 12000.00, '2025-02-10', NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Staffing', 'Event staff and security', 6000.00, '2025-02-15', NOW(), NOW()),
    (uuid_generate_v4(), event2_id, 'Venue', 'Las Vegas convention center', 45000.00, '2025-02-20', NOW(), NOW()),
    (uuid_generate_v4(), event2_id, 'Marketing', 'Social media promotion', 10000.00, '2025-03-01', NOW(), NOW()),
    (uuid_generate_v4(), event3_id, 'Venue', 'Chicago venue rental', 40000.00, '2025-03-10', NOW(), NOW()),
    (uuid_generate_v4(), event3_id, 'Logistics', 'Shipping and setup', 5000.00, '2025-03-15', NOW(), NOW());

  -- ============================================
  -- BUDGETS (Budget allocations)
  -- ============================================
  INSERT INTO budgets (id, event_id, category, allocated_amount, spent_amount, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), event1_id, 'Venue', 60000.00, 50000.00, NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Marketing', 20000.00, 15000.00, NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Catering', 10000.00, 8000.00, NOW(), NOW()),
    (uuid_generate_v4(), event1_id, 'Equipment', 15000.00, 12000.00, NOW(), NOW()),
    (uuid_generate_v4(), event2_id, 'Venue', 50000.00, 45000.00, NOW(), NOW()),
    (uuid_generate_v4(), event2_id, 'Marketing', 15000.00, 10000.00, NOW(), NOW()),
    (uuid_generate_v4(), event3_id, 'Venue', 45000.00, 40000.00, NOW(), NOW()),
    (uuid_generate_v4(), event3_id, 'Logistics', 8000.00, 5000.00, NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- PROPOSALS (Proposal templates and proposals)
  -- ============================================
  INSERT INTO proposal_templates (id, name, description, content, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), 'Standard Booth Package', 'Basic booth rental proposal', 'We are pleased to offer you a premium booth space at our upcoming event...', NOW(), NOW()),
    (uuid_generate_v4(), 'Premium Package', 'Enhanced booth with additional services', 'Our premium package includes prime location, enhanced visibility, and additional marketing support...', NOW(), NOW()),
    (uuid_generate_v4(), 'VIP Sponsorship', 'Top-tier sponsorship opportunity', 'As a VIP sponsor, you will receive maximum visibility, exclusive networking opportunities...', NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- Create some proposals
  INSERT INTO proposals (id, event_id, submitted_by, template_id, title, description, status, submitted_at, created_at, updated_at)
  SELECT 
    uuid_generate_v4(),
    CASE (row_number() OVER () % 3)
      WHEN 0 THEN event1_id
      WHEN 1 THEN event2_id
      ELSE event3_id
    END,
    (SELECT id FROM users WHERE role = 'exhibitor' ORDER BY random() LIMIT 1),
    (SELECT id FROM proposal_templates ORDER BY random() LIMIT 1),
    'Booth Proposal - ' || row_number() OVER (),
    'We are interested in exhibiting at your event and would like to discuss booth options...',
    CASE (row_number() OVER () % 4)
      WHEN 0 THEN 'approved'
      WHEN 1 THEN 'submitted'
      WHEN 2 THEN 'rejected'
      ELSE 'draft'
    END,
    CASE (row_number() OVER () % 4)
      WHEN 0 THEN NOW() - (random() * INTERVAL '20 days')
      WHEN 1 THEN NOW() - (random() * INTERVAL '20 days')
      ELSE NULL
    END,
    NOW() - (random() * INTERVAL '20 days'),
    NOW()
  FROM generate_series(1, 10) AS p
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- MONITORING METRICS (Performance tracking)
  -- ============================================
  INSERT INTO monitoring_metrics (id, event_id, metric_type, metric_name, value, recorded_at, created_at)
  VALUES
    (uuid_generate_v4(), event1_id, 'booth_occupancy', 'booth_occupancy_rate', 65.5, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event1_id, 'revenue', 'revenue_target', 150000.00, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event1_id, 'attendance', 'attendee_registrations', 1250, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event2_id, 'booth_occupancy', 'booth_occupancy_rate', 58.3, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event2_id, 'revenue', 'revenue_target', 120000.00, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event2_id, 'attendance', 'attendee_registrations', 980, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event3_id, 'booth_occupancy', 'booth_occupancy_rate', 72.0, CURRENT_DATE, NOW()),
    (uuid_generate_v4(), event3_id, 'revenue', 'revenue_target', 100000.00, CURRENT_DATE, NOW())
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- POLICIES (System policies)
  -- ============================================
  INSERT INTO policies (id, title, category, content, is_active, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), 'Booth Cancellation Policy', 'Sales', 'Booth reservations can be cancelled up to 30 days before the event for a full refund. Cancellations within 30 days are subject to a 50% cancellation fee.', true, NOW(), NOW()),
    (uuid_generate_v4(), 'Payment Terms', 'Finance', 'All booth payments are due within 14 days of invoice issuance. Late payments may result in reservation cancellation.', true, NOW(), NOW()),
    (uuid_generate_v4(), 'Exhibitor Code of Conduct', 'Operations', 'All exhibitors must adhere to professional standards, respect other exhibitors, and follow venue regulations.', true, NOW(), NOW()),
    (uuid_generate_v4(), 'Refund Policy', 'Finance', 'Refunds are processed within 10 business days of cancellation approval. Processing fees may apply.', true, NOW(), NOW()),
    (uuid_generate_v4(), 'Booth Setup Guidelines', 'Operations', 'Booth setup must be completed 2 hours before event opening. Materials must comply with venue safety regulations.', true, NOW(), NOW()),
    (uuid_generate_v4(), 'Marketing Materials Policy', 'Marketing', 'All marketing materials must be approved by event organizers 7 days before the event.', true, NOW(), NOW())
  ON CONFLICT DO NOTHING;

END $$;

-- Summary
SELECT 
  'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Booths', COUNT(*) FROM booths
UNION ALL
SELECT 'Reservations', COUNT(*) FROM reservations
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions
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
SELECT 'Policies', COUNT(*) FROM policies;

