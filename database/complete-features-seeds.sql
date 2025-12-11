-- Complete Features Seed Data
-- This script adds comprehensive data for ALL features:
-- Sales, Payments, Costing, Proposals, Monitoring, Policies
-- Run this after schema.sql and module-tables.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 1: Get existing events and users
-- ============================================
DO $$
DECLARE
  -- Event IDs (will use existing or create new)
  event1_id UUID;
  event2_id UUID;
  event3_id UUID;
  event4_id UUID;
  
  -- User IDs (will use existing or create new)
  admin_user_id UUID;
  exhibitor1_id UUID;
  exhibitor2_id UUID;
  exhibitor3_id UUID;
  exhibitor4_id UUID;
  exhibitor5_id UUID;
  
  -- Reservation IDs
  res1_id UUID;
  res2_id UUID;
  res3_id UUID;
  res4_id UUID;
  res5_id UUID;
  res6_id UUID;
  res7_id UUID;
  res8_id UUID;
  
  -- Booth IDs
  booth1_id UUID;
  booth2_id UUID;
  booth3_id UUID;
  booth4_id UUID;
  booth5_id UUID;
  booth6_id UUID;
  booth7_id UUID;
  booth8_id UUID;
BEGIN
  -- Get or create events
  SELECT id INTO event1_id FROM events WHERE status IN ('published', 'active') LIMIT 1;
  IF event1_id IS NULL THEN
    event1_id := uuid_generate_v4();
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at)
    VALUES (event1_id, 'Tech Innovation Summit 2025', 'Premier technology conference', 
            '2025-03-15 09:00:00', '2025-03-17 18:00:00', 'San Francisco Convention Center', 'published', NOW(), NOW());
  END IF;
  
  SELECT id INTO event2_id FROM events WHERE status IN ('published', 'active') ORDER BY created_at DESC LIMIT 1 OFFSET 1;
  IF event2_id IS NULL THEN
    event2_id := uuid_generate_v4();
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at)
    VALUES (event2_id, 'Digital Marketing Expo 2025', 'Marketing conference', 
            '2025-04-20 08:00:00', '2025-04-22 17:00:00', 'Las Vegas Convention Center', 'active', NOW(), NOW());
  END IF;
  
  SELECT id INTO event3_id FROM events WHERE status IN ('published', 'active') ORDER BY created_at DESC LIMIT 1 OFFSET 2;
  IF event3_id IS NULL THEN
    event3_id := uuid_generate_v4();
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at)
    VALUES (event3_id, 'Manufacturing Excellence Forum', 'Manufacturing event', 
            '2025-05-10 09:00:00', '2025-05-12 17:00:00', 'Chicago McCormick Place', 'published', NOW(), NOW());
  END IF;
  
  event4_id := uuid_generate_v4();
  INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at)
  VALUES (event4_id, 'Finance & FinTech Summit', 'Finance conference', 
          '2025-07-15 09:00:00', '2025-07-17 17:00:00', 'New York Javits Center', 'published', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  
  -- Get or create users
  SELECT id INTO admin_user_id FROM users WHERE role = 'admin' LIMIT 1;
  IF admin_user_id IS NULL THEN
    admin_user_id := uuid_generate_v4();
    INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, role, is_active, created_at, updated_at)
    VALUES (admin_user_id, 'admin@antelite.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 
            'Admin', 'User', 'Antelite Events', 'admin', true, NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;
  
  -- Get exhibitors
  SELECT id INTO exhibitor1_id FROM users WHERE role = 'exhibitor' LIMIT 1;
  IF exhibitor1_id IS NULL THEN
    exhibitor1_id := uuid_generate_v4();
    INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, role, is_active, created_at, updated_at)
    VALUES (exhibitor1_id, 'contact@techcorp.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 
            'Michael', 'Chen', 'TechCorp Solutions', 'exhibitor', true, NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;
  
  SELECT id INTO exhibitor2_id FROM users WHERE role = 'exhibitor' ORDER BY created_at DESC LIMIT 1 OFFSET 1;
  IF exhibitor2_id IS NULL THEN
    exhibitor2_id := uuid_generate_v4();
    INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, role, is_active, created_at, updated_at)
    VALUES (exhibitor2_id, 'info@innovateai.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 
            'Emily', 'Rodriguez', 'InnovateAI', 'exhibitor', true, NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;
  
  SELECT id INTO exhibitor3_id FROM users WHERE role = 'exhibitor' ORDER BY created_at DESC LIMIT 1 OFFSET 2;
  IF exhibitor3_id IS NULL THEN
    exhibitor3_id := uuid_generate_v4();
    INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, role, is_active, created_at, updated_at)
    VALUES (exhibitor3_id, 'sales@cloudtech.io', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJq', 
            'David', 'Kim', 'CloudTech Industries', 'exhibitor', true, NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;
  
  SELECT id INTO exhibitor4_id FROM users WHERE role = 'exhibitor' ORDER BY created_at DESC LIMIT 1 OFFSET 3;
  IF exhibitor4_id IS NULL THEN
    exhibitor4_id := uuid_generate_v4();
    INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, role, is_active, created_at, updated_at)
    VALUES (exhibitor4_id, 'hello@dataviz.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJq', 
            'Lisa', 'Anderson', 'DataViz Pro', 'exhibitor', true, NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;
  
  SELECT id INTO exhibitor5_id FROM users WHERE role = 'exhibitor' ORDER BY created_at DESC LIMIT 1 OFFSET 4;
  IF exhibitor5_id IS NULL THEN
    exhibitor5_id := uuid_generate_v4();
    INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, role, is_active, created_at, updated_at)
    VALUES (exhibitor5_id, 'team@brandmasters.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJq', 
            'James', 'Wilson', 'BrandMasters Agency', 'exhibitor', true, NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;
  
  -- ============================================
  -- STEP 2: Create Booths (if not exist)
  -- ============================================
  SELECT id INTO booth1_id FROM booths WHERE event_id = event1_id LIMIT 1;
  IF booth1_id IS NULL THEN
    booth1_id := uuid_generate_v4();
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
    VALUES (booth1_id, event1_id, 'A01', 'medium', 1500.00, 'booked', 0, 0, 2, 2, 'Premium corner booth', ARRAY['WiFi', 'Power', 'Display Screen'], NOW(), NOW());
  END IF;
  
  SELECT id INTO booth2_id FROM booths WHERE event_id = event1_id ORDER BY created_at DESC LIMIT 1 OFFSET 1;
  IF booth2_id IS NULL THEN
    booth2_id := uuid_generate_v4();
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
    VALUES (booth2_id, event1_id, 'A02', 'large', 2500.00, 'booked', 2, 0, 3, 2, 'Large exhibition space', ARRAY['WiFi', 'Power'], NOW(), NOW());
  END IF;
  
  SELECT id INTO booth3_id FROM booths WHERE event_id = event2_id LIMIT 1;
  IF booth3_id IS NULL THEN
    booth3_id := uuid_generate_v4();
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
    VALUES (booth3_id, event2_id, 'B01', 'small', 800.00, 'booked', 0, 0, 1, 1, 'Standard booth', ARRAY['WiFi'], NOW(), NOW());
  END IF;
  
  SELECT id INTO booth4_id FROM booths WHERE event_id = event2_id ORDER BY created_at DESC LIMIT 1 OFFSET 1;
  IF booth4_id IS NULL THEN
    booth4_id := uuid_generate_v4();
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
    VALUES (booth4_id, event2_id, 'B02', 'medium', 1500.00, 'reserved', 1, 0, 2, 1, 'Medium booth', ARRAY['WiFi', 'Power'], NOW(), NOW());
  END IF;
  
  SELECT id INTO booth5_id FROM booths WHERE event_id = event3_id LIMIT 1;
  IF booth5_id IS NULL THEN
    booth5_id := uuid_generate_v4();
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
    VALUES (booth5_id, event3_id, 'C01', 'xlarge', 4000.00, 'booked', 0, 0, 4, 3, 'Extra large premium booth', ARRAY['WiFi', 'Power', 'Display Screen', 'Furniture'], NOW(), NOW());
  END IF;
  
  SELECT id INTO booth6_id FROM booths WHERE event_id = event3_id ORDER BY created_at DESC LIMIT 1 OFFSET 1;
  IF booth6_id IS NULL THEN
    booth6_id := uuid_generate_v4();
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
    VALUES (booth6_id, event3_id, 'C02', 'large', 2500.00, 'booked', 4, 0, 3, 2, 'Large booth', ARRAY['WiFi', 'Power'], NOW(), NOW());
  END IF;
  
  SELECT id INTO booth7_id FROM booths WHERE event_id = event4_id LIMIT 1;
  IF booth7_id IS NULL THEN
    booth7_id := uuid_generate_v4();
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
    VALUES (booth7_id, event4_id, 'D01', 'medium', 1500.00, 'booked', 0, 0, 2, 2, 'Medium booth', ARRAY['WiFi', 'Power'], NOW(), NOW());
  END IF;
  
  SELECT id INTO booth8_id FROM booths WHERE event_id = event4_id ORDER BY created_at DESC LIMIT 1 OFFSET 1;
  IF booth8_id IS NULL THEN
    booth8_id := uuid_generate_v4();
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at)
    VALUES (booth8_id, event4_id, 'D02', 'small', 800.00, 'reserved', 2, 0, 1, 1, 'Small booth', ARRAY['WiFi'], NOW(), NOW());
  END IF;
  
  -- ============================================
  -- STEP 3: Create Reservations
  -- ============================================
  res1_id := uuid_generate_v4();
  INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, confirmed_at, created_at, updated_at)
  VALUES (res1_id, booth1_id, exhibitor1_id, event1_id, 'confirmed', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '30 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  res2_id := uuid_generate_v4();
  INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, confirmed_at, created_at, updated_at)
  VALUES (res2_id, booth2_id, exhibitor2_id, event1_id, 'confirmed', NOW() - INTERVAL '25 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '25 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  res3_id := uuid_generate_v4();
  INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, confirmed_at, created_at, updated_at)
  VALUES (res3_id, booth3_id, exhibitor3_id, event2_id, 'confirmed', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '20 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  res4_id := uuid_generate_v4();
  INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, expires_at, created_at, updated_at)
  VALUES (res4_id, booth4_id, exhibitor4_id, event2_id, 'pending', NOW() - INTERVAL '2 days', NOW() + INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  res5_id := uuid_generate_v4();
  INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, confirmed_at, created_at, updated_at)
  VALUES (res5_id, booth5_id, exhibitor5_id, event3_id, 'confirmed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '15 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  res6_id := uuid_generate_v4();
  INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, confirmed_at, created_at, updated_at)
  VALUES (res6_id, booth6_id, exhibitor1_id, event3_id, 'confirmed', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '10 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  res7_id := uuid_generate_v4();
  INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, confirmed_at, created_at, updated_at)
  VALUES (res7_id, booth7_id, exhibitor2_id, event4_id, 'confirmed', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  res8_id := uuid_generate_v4();
  INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, expires_at, created_at, updated_at)
  VALUES (res8_id, booth8_id, exhibitor3_id, event4_id, 'pending', NOW() - INTERVAL '1 day', NOW() + INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  -- ============================================
  -- STEP 4: Create Transactions (Payments)
  -- ============================================
  INSERT INTO transactions (id, reservation_id, amount, currency, status, payment_method, stripe_payment_intent_id, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), res1_id, 1500.00, 'USD', 'completed', 'stripe', 'pi_1234567890', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    (uuid_generate_v4(), res2_id, 2500.00, 'USD', 'completed', 'stripe', 'pi_1234567891', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
    (uuid_generate_v4(), res3_id, 800.00, 'USD', 'completed', 'stripe', 'pi_1234567892', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
    (uuid_generate_v4(), res4_id, 1500.00, 'USD', 'pending', 'stripe', 'pi_1234567893', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    (uuid_generate_v4(), res5_id, 4000.00, 'USD', 'completed', 'bank_transfer', NULL, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    (uuid_generate_v4(), res6_id, 2500.00, 'USD', 'completed', 'stripe', 'pi_1234567894', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    (uuid_generate_v4(), res7_id, 1500.00, 'USD', 'processing', 'stripe', 'pi_1234567895', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    (uuid_generate_v4(), res8_id, 800.00, 'USD', 'pending', 'stripe', NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (uuid_generate_v4(), res1_id, 200.00, 'USD', 'completed', 'stripe', 'pi_1234567896', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'), -- Additional payment
    (uuid_generate_v4(), res2_id, 500.00, 'USD', 'completed', 'stripe', 'pi_1234567897', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days') -- Additional payment
  ON CONFLICT (id) DO NOTHING;
  
  -- ============================================
  -- STEP 5: Create Invoices
  -- ============================================
  INSERT INTO invoices (id, reservation_id, invoice_number, amount, tax_amount, total_amount, status, due_date, issued_at, paid_at, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), res1_id, 'INV-2025-001', 1500.00, 150.00, 1650.00, 'paid', NOW() - INTERVAL '20 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW()),
    (uuid_generate_v4(), res2_id, 'INV-2025-002', 2500.00, 250.00, 2750.00, 'paid', NOW() - INTERVAL '15 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW()),
    (uuid_generate_v4(), res3_id, 'INV-2025-003', 800.00, 80.00, 880.00, 'paid', NOW() - INTERVAL '10 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW()),
    (uuid_generate_v4(), res4_id, 'INV-2025-004', 1500.00, 150.00, 1650.00, 'pending', NOW() + INTERVAL '5 days', NOW() - INTERVAL '2 days', NULL, NOW() - INTERVAL '2 days', NOW()),
    (uuid_generate_v4(), res5_id, 'INV-2025-005', 4000.00, 400.00, 4400.00, 'paid', NOW() - INTERVAL '5 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW()),
    (uuid_generate_v4(), res6_id, 'INV-2025-006', 2500.00, 250.00, 2750.00, 'paid', NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW()),
    (uuid_generate_v4(), res7_id, 'INV-2025-007', 1500.00, 150.00, 1650.00, 'sent', NOW() + INTERVAL '3 days', NOW() - INTERVAL '2 days', NULL, NOW() - INTERVAL '2 days', NOW()),
    (uuid_generate_v4(), res8_id, 'INV-2025-008', 800.00, 80.00, 880.00, 'draft', NOW() + INTERVAL '7 days', NULL, NULL, NOW() - INTERVAL '1 day', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  -- ============================================
  -- STEP 6: Create Costs (Costing Module)
  -- ============================================
  INSERT INTO costs (id, event_id, category, description, amount, currency, vendor, date, status, created_at, updated_at)
  VALUES
    -- Event 1 Costs
    (uuid_generate_v4(), event1_id, 'Venue', 'Convention center rental', 25000.00, 'USD', 'San Francisco Convention Center', NOW() - INTERVAL '60 days', 'paid', NOW() - INTERVAL '60 days', NOW()),
    (uuid_generate_v4(), event1_id, 'Marketing', 'Digital advertising campaign', 5000.00, 'USD', 'Google Ads', NOW() - INTERVAL '45 days', 'paid', NOW() - INTERVAL '45 days', NOW()),
    (uuid_generate_v4(), event1_id, 'Catering', 'Lunch and refreshments', 8000.00, 'USD', 'Catering Plus', NOW() - INTERVAL '30 days', 'approved', NOW() - INTERVAL '30 days', NOW()),
    (uuid_generate_v4(), event1_id, 'Equipment', 'Audio/Visual equipment rental', 3000.00, 'USD', 'AV Solutions', NOW() - INTERVAL '20 days', 'pending', NOW() - INTERVAL '20 days', NOW()),
    (uuid_generate_v4(), event1_id, 'Staffing', 'Event staff and security', 6000.00, 'USD', 'Event Staffing Co', NOW() - INTERVAL '15 days', 'approved', NOW() - INTERVAL '15 days', NOW()),
    
    -- Event 2 Costs
    (uuid_generate_v4(), event2_id, 'Venue', 'Convention center rental', 20000.00, 'USD', 'Las Vegas Convention Center', NOW() - INTERVAL '50 days', 'paid', NOW() - INTERVAL '50 days', NOW()),
    (uuid_generate_v4(), event2_id, 'Marketing', 'Social media marketing', 3500.00, 'USD', 'Social Media Pro', NOW() - INTERVAL '40 days', 'paid', NOW() - INTERVAL '40 days', NOW()),
    (uuid_generate_v4(), event2_id, 'Catering', 'Breakfast and coffee service', 4500.00, 'USD', 'Breakfast Express', NOW() - INTERVAL '25 days', 'approved', NOW() - INTERVAL '25 days', NOW()),
    (uuid_generate_v4(), event2_id, 'Transportation', 'Shuttle service', 2000.00, 'USD', 'Shuttle Services', NOW() - INTERVAL '18 days', 'pending', NOW() - INTERVAL '18 days', NOW()),
    
    -- Event 3 Costs
    (uuid_generate_v4(), event3_id, 'Venue', 'Convention center rental', 30000.00, 'USD', 'Chicago McCormick Place', NOW() - INTERVAL '55 days', 'paid', NOW() - INTERVAL '55 days', NOW()),
    (uuid_generate_v4(), event3_id, 'Marketing', 'Print and digital marketing', 7000.00, 'USD', 'Marketing Agency', NOW() - INTERVAL '42 days', 'paid', NOW() - INTERVAL '42 days', NOW()),
    (uuid_generate_v4(), event3_id, 'Catering', 'Full catering service', 12000.00, 'USD', 'Gourmet Catering', NOW() - INTERVAL '28 days', 'approved', NOW() - INTERVAL '28 days', NOW()),
    (uuid_generate_v4(), event3_id, 'Equipment', 'Stage and lighting', 5000.00, 'USD', 'Stage Pro', NOW() - INTERVAL '22 days', 'pending', NOW() - INTERVAL '22 days', NOW()),
    
    -- Event 4 Costs
    (uuid_generate_v4(), event4_id, 'Venue', 'Convention center rental', 35000.00, 'USD', 'New York Javits Center', NOW() - INTERVAL '48 days', 'paid', NOW() - INTERVAL '48 days', NOW()),
    (uuid_generate_v4(), event4_id, 'Marketing', 'Comprehensive marketing campaign', 10000.00, 'USD', 'Marketing Solutions', NOW() - INTERVAL '35 days', 'paid', NOW() - INTERVAL '35 days', NOW()),
    (uuid_generate_v4(), event4_id, 'Catering', 'Premium catering package', 15000.00, 'USD', 'Elite Catering', NOW() - INTERVAL '22 days', 'approved', NOW() - INTERVAL '22 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  -- ============================================
  -- STEP 7: Create Budgets (Costing Module)
  -- ============================================
  INSERT INTO budgets (id, event_id, category, allocated_amount, spent_amount, currency, created_at, updated_at)
  VALUES
    -- Event 1 Budgets
    (uuid_generate_v4(), event1_id, 'Venue', 30000.00, 25000.00, 'USD', NOW() - INTERVAL '90 days', NOW()),
    (uuid_generate_v4(), event1_id, 'Marketing', 8000.00, 5000.00, 'USD', NOW() - INTERVAL '90 days', NOW()),
    (uuid_generate_v4(), event1_id, 'Catering', 10000.00, 8000.00, 'USD', NOW() - INTERVAL '90 days', NOW()),
    (uuid_generate_v4(), event1_id, 'Equipment', 5000.00, 3000.00, 'USD', NOW() - INTERVAL '90 days', NOW()),
    (uuid_generate_v4(), event1_id, 'Staffing', 8000.00, 6000.00, 'USD', NOW() - INTERVAL '90 days', NOW()),
    
    -- Event 2 Budgets
    (uuid_generate_v4(), event2_id, 'Venue', 25000.00, 20000.00, 'USD', NOW() - INTERVAL '80 days', NOW()),
    (uuid_generate_v4(), event2_id, 'Marketing', 5000.00, 3500.00, 'USD', NOW() - INTERVAL '80 days', NOW()),
    (uuid_generate_v4(), event2_id, 'Catering', 6000.00, 4500.00, 'USD', NOW() - INTERVAL '80 days', NOW()),
    (uuid_generate_v4(), event2_id, 'Transportation', 3000.00, 2000.00, 'USD', NOW() - INTERVAL '80 days', NOW()),
    
    -- Event 3 Budgets
    (uuid_generate_v4(), event3_id, 'Venue', 35000.00, 30000.00, 'USD', NOW() - INTERVAL '85 days', NOW()),
    (uuid_generate_v4(), event3_id, 'Marketing', 10000.00, 7000.00, 'USD', NOW() - INTERVAL '85 days', NOW()),
    (uuid_generate_v4(), event3_id, 'Catering', 15000.00, 12000.00, 'USD', NOW() - INTERVAL '85 days', NOW()),
    (uuid_generate_v4(), event3_id, 'Equipment', 8000.00, 5000.00, 'USD', NOW() - INTERVAL '85 days', NOW()),
    
    -- Event 4 Budgets
    (uuid_generate_v4(), event4_id, 'Venue', 40000.00, 35000.00, 'USD', NOW() - INTERVAL '75 days', NOW()),
    (uuid_generate_v4(), event4_id, 'Marketing', 12000.00, 10000.00, 'USD', NOW() - INTERVAL '75 days', NOW()),
    (uuid_generate_v4(), event4_id, 'Catering', 18000.00, 15000.00, 'USD', NOW() - INTERVAL '75 days', NOW())
  ON CONFLICT (event_id, category) DO UPDATE SET
    allocated_amount = EXCLUDED.allocated_amount,
    spent_amount = EXCLUDED.spent_amount,
    updated_at = NOW();
  
  -- ============================================
  -- STEP 8: Create Proposal Templates
  -- ============================================
  INSERT INTO proposal_templates (id, name, description, content, category, is_active, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), 'Standard Event Proposal', 'Basic proposal template for standard events', 
     '{"sections": ["Introduction", "Event Overview", "Booth Details", "Pricing", "Terms"]}', 
     'standard', true, NOW() - INTERVAL '100 days', NOW()),
    (uuid_generate_v4(), 'Premium Event Proposal', 'Premium proposal template with detailed sections', 
     '{"sections": ["Executive Summary", "Event Overview", "Booth Options", "Premium Services", "Pricing", "Terms & Conditions"]}', 
     'premium', true, NOW() - INTERVAL '100 days', NOW()),
    (uuid_generate_v4(), 'Quick Quote Template', 'Simple template for quick quotes', 
     '{"sections": ["Event", "Booth", "Price", "Contact"]}', 
     'quote', true, NOW() - INTERVAL '100 days', NOW()),
    (uuid_generate_v4(), 'Corporate Package Template', 'Template for corporate event packages', 
     '{"sections": ["Company Overview", "Event Details", "Package Options", "Benefits", "Investment"]}', 
     'corporate', true, NOW() - INTERVAL '100 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
  -- ============================================
  -- STEP 9: Create Proposals
  -- ============================================
  INSERT INTO proposals (id, event_id, title, description, template_id, status, submitted_by, submitted_at, approved_by, approved_at, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    event1_id,
    'Tech Innovation Summit - Premium Booth Proposal',
    'Proposal for premium booth space at Tech Innovation Summit 2025',
    (SELECT id FROM proposal_templates WHERE category = 'premium' LIMIT 1),
    'approved',
    exhibitor1_id,
    NOW() - INTERVAL '30 days',
    admin_user_id,
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '35 days',
    NOW()
  WHERE NOT EXISTS (SELECT 1 FROM proposals WHERE event_id = event1_id AND title LIKE '%Tech Innovation%')
  LIMIT 1;
  
  INSERT INTO proposals (id, event_id, title, description, template_id, status, submitted_by, submitted_at, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    event2_id,
    'Digital Marketing Expo - Standard Booth Proposal',
    'Proposal for standard booth at Digital Marketing Expo',
    (SELECT id FROM proposal_templates WHERE category = 'standard' LIMIT 1),
    'submitted',
    exhibitor2_id,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '25 days',
    NOW()
  WHERE NOT EXISTS (SELECT 1 FROM proposals WHERE event_id = event2_id AND title LIKE '%Digital Marketing%')
  LIMIT 1;
  
  INSERT INTO proposals (id, event_id, title, description, template_id, status, submitted_by, submitted_at, approved_by, approved_at, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    event3_id,
    'Manufacturing Forum - Large Booth Proposal',
    'Proposal for large booth space at Manufacturing Excellence Forum',
    (SELECT id FROM proposal_templates WHERE category = 'premium' LIMIT 1),
    'approved',
    exhibitor3_id,
    NOW() - INTERVAL '15 days',
    admin_user_id,
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '20 days',
    NOW()
  WHERE NOT EXISTS (SELECT 1 FROM proposals WHERE event_id = event3_id AND title LIKE '%Manufacturing%')
  LIMIT 1;
  
  INSERT INTO proposals (id, event_id, title, description, template_id, status, submitted_by, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    event4_id,
    'Finance Summit - Draft Proposal',
    'Draft proposal for Finance & FinTech Summit',
    (SELECT id FROM proposal_templates WHERE category = 'standard' LIMIT 1),
    'draft',
    exhibitor4_id,
    NOW() - INTERVAL '10 days',
    NOW()
  WHERE NOT EXISTS (SELECT 1 FROM proposals WHERE event_id = event4_id AND title LIKE '%Finance%')
  LIMIT 1;
  
  INSERT INTO proposals (id, event_id, title, description, template_id, status, submitted_by, submitted_at, approved_by, approved_at, rejected_at, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    event1_id,
    'Tech Innovation Summit - Rejected Proposal',
    'Proposal that was rejected due to budget constraints',
    (SELECT id FROM proposal_templates WHERE category = 'standard' LIMIT 1),
    'rejected',
    exhibitor5_id,
    NOW() - INTERVAL '25 days',
    admin_user_id,
    NULL,
    NOW() - INTERVAL '22 days',
    NOW() - INTERVAL '30 days',
    NOW()
  WHERE NOT EXISTS (SELECT 1 FROM proposals WHERE status = 'rejected' AND event_id = event1_id)
  LIMIT 1;
  
  -- ============================================
  -- STEP 10: Create Team Activity (Monitoring)
  -- ============================================
  INSERT INTO team_activity (id, user_id, event_id, action_type, description, metadata, created_at)
  VALUES
    -- Booth bookings
    (uuid_generate_v4(), exhibitor1_id, event1_id, 'booth_booking', 'Booked booth A01', '{"booth_id": "' || booth1_id || '", "amount": 1500.00}', NOW() - INTERVAL '30 days'),
    (uuid_generate_v4(), exhibitor2_id, event1_id, 'booth_booking', 'Booked booth A02', '{"booth_id": "' || booth2_id || '", "amount": 2500.00}', NOW() - INTERVAL '25 days'),
    (uuid_generate_v4(), exhibitor3_id, event2_id, 'booth_booking', 'Booked booth B01', '{"booth_id": "' || booth3_id || '", "amount": 800.00}', NOW() - INTERVAL '20 days'),
    (uuid_generate_v4(), exhibitor5_id, event3_id, 'booth_booking', 'Booked booth C01', '{"booth_id": "' || booth5_id || '", "amount": 4000.00}', NOW() - INTERVAL '15 days'),
    (uuid_generate_v4(), exhibitor1_id, event3_id, 'booth_booking', 'Booked booth C02', '{"booth_id": "' || booth6_id || '", "amount": 2500.00}', NOW() - INTERVAL '10 days'),
    (uuid_generate_v4(), exhibitor2_id, event4_id, 'booth_booking', 'Booked booth D01', '{"booth_id": "' || booth7_id || '", "amount": 1500.00}', NOW() - INTERVAL '5 days'),
    
    -- Payments
    (uuid_generate_v4(), admin_user_id, event1_id, 'payment_processed', 'Processed payment for booth A01', '{"transaction_id": "pi_1234567890", "amount": 1500.00}', NOW() - INTERVAL '25 days'),
    (uuid_generate_v4(), admin_user_id, event1_id, 'payment_processed', 'Processed payment for booth A02', '{"transaction_id": "pi_1234567891", "amount": 2500.00}', NOW() - INTERVAL '20 days'),
    (uuid_generate_v4(), admin_user_id, event2_id, 'payment_processed', 'Processed payment for booth B01', '{"transaction_id": "pi_1234567892", "amount": 800.00}', NOW() - INTERVAL '15 days'),
    
    -- Proposals
    (uuid_generate_v4(), exhibitor1_id, event1_id, 'proposal_sent', 'Sent proposal for Tech Innovation Summit', '{"proposal_type": "premium"}', NOW() - INTERVAL '30 days'),
    (uuid_generate_v4(), exhibitor2_id, event2_id, 'proposal_sent', 'Sent proposal for Digital Marketing Expo', '{"proposal_type": "standard"}', NOW() - INTERVAL '20 days'),
    (uuid_generate_v4(), admin_user_id, event1_id, 'proposal_approved', 'Approved proposal for Tech Innovation Summit', '{"proposal_id": "approved"}', NOW() - INTERVAL '28 days'),
    (uuid_generate_v4(), admin_user_id, event3_id, 'proposal_approved', 'Approved proposal for Manufacturing Forum', '{"proposal_id": "approved"}', NOW() - INTERVAL '12 days'),
    
    -- Cost management
    (uuid_generate_v4(), admin_user_id, event1_id, 'cost_added', 'Added venue cost', '{"category": "Venue", "amount": 25000.00}', NOW() - INTERVAL '60 days'),
    (uuid_generate_v4(), admin_user_id, event1_id, 'cost_added', 'Added marketing cost', '{"category": "Marketing", "amount": 5000.00}', NOW() - INTERVAL '45 days'),
    (uuid_generate_v4(), admin_user_id, event2_id, 'cost_added', 'Added venue cost', '{"category": "Venue", "amount": 20000.00}', NOW() - INTERVAL '50 days'),
    
    -- General activities
    (uuid_generate_v4(), admin_user_id, event1_id, 'event_updated', 'Updated event details', '{"field": "venue"}', NOW() - INTERVAL '40 days'),
    (uuid_generate_v4(), admin_user_id, event2_id, 'event_updated', 'Updated event status', '{"field": "status", "value": "active"}', NOW() - INTERVAL '35 days'),
    (uuid_generate_v4(), exhibitor3_id, event2_id, 'booth_reserved', 'Reserved booth B02', '{"booth_id": "' || booth4_id || '"}', NOW() - INTERVAL '2 days'),
    (uuid_generate_v4(), exhibitor3_id, event4_id, 'booth_reserved', 'Reserved booth D02', '{"booth_id": "' || booth8_id || '"}', NOW() - INTERVAL '1 day')
  ON CONFLICT (id) DO NOTHING;
  
  -- ============================================
  -- STEP 11: Create Monitoring Metrics
  -- ============================================
  INSERT INTO monitoring_metrics (id, event_id, metric_type, metric_name, value, metadata, recorded_at, created_at)
  VALUES
    (uuid_generate_v4(), event1_id, 'sales_performance', 'Total Revenue', 4000.00, '{"currency": "USD"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (uuid_generate_v4(), event1_id, 'booth_occupancy', 'Occupancy Rate', 75.50, '{"unit": "percent"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (uuid_generate_v4(), event1_id, 'team_activity', 'Total Activities', 12.00, '{"count": 12}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (uuid_generate_v4(), event2_id, 'sales_performance', 'Total Revenue', 800.00, '{"currency": "USD"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (uuid_generate_v4(), event2_id, 'booth_occupancy', 'Occupancy Rate', 50.00, '{"unit": "percent"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (uuid_generate_v4(), event3_id, 'sales_performance', 'Total Revenue', 6500.00, '{"currency": "USD"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (uuid_generate_v4(), event3_id, 'booth_occupancy', 'Occupancy Rate', 66.67, '{"unit": "percent"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (uuid_generate_v4(), event4_id, 'sales_performance', 'Total Revenue', 1500.00, '{"currency": "USD"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (uuid_generate_v4(), event4_id, 'booth_occupancy', 'Occupancy Rate', 50.00, '{"unit": "percent"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
  ON CONFLICT (id) DO NOTHING;
  
  -- ============================================
  -- STEP 12: Create Policies
  -- ============================================
  INSERT INTO policies (id, title, content, category, version, is_active, effective_date, created_by, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), 'Terms and Conditions', 
     'By registering for our events, you agree to comply with all terms and conditions. All booth reservations are subject to availability and approval. Payment must be made within 30 days of invoice date.',
     'terms', '1.0', true, NOW() - INTERVAL '200 days', admin_user_id, NOW() - INTERVAL '200 days', NOW()),
    
    (uuid_generate_v4(), 'Privacy Policy', 
     'We respect your privacy and are committed to protecting your personal information. We collect and use information only as necessary to provide our services and improve your experience.',
     'privacy', '2.1', true, NOW() - INTERVAL '180 days', admin_user_id, NOW() - INTERVAL '180 days', NOW()),
    
    (uuid_generate_v4(), 'Refund Policy', 
     'Refunds are available for cancellations made at least 30 days before the event start date. A 10% processing fee applies. No refunds for cancellations within 30 days of the event.',
     'refund', '1.0', true, NOW() - INTERVAL '150 days', admin_user_id, NOW() - INTERVAL '150 days', NOW()),
    
    (uuid_generate_v4(), 'Cancellation Policy', 
     'Event cancellations must be submitted in writing. Cancellations made 60+ days before the event receive a full refund minus processing fee. Cancellations 30-60 days before receive 50% refund. No refund for cancellations within 30 days.',
     'cancellation', '1.0', true, NOW() - INTERVAL '150 days', admin_user_id, NOW() - INTERVAL '150 days', NOW()),
    
    (uuid_generate_v4(), 'Booth Assignment Policy', 
     'Booth assignments are made on a first-come, first-served basis. Premium locations may require additional fees. We reserve the right to reassign booths if necessary.',
     'booth_assignment', '1.0', true, NOW() - INTERVAL '120 days', admin_user_id, NOW() - INTERVAL '120 days', NOW()),
    
    (uuid_generate_v4(), 'Payment Terms', 
     'Payment is due within 30 days of invoice date. Late payments may incur a 2% monthly interest charge. We accept credit cards, bank transfers, and checks.',
     'payment', '1.0', true, NOW() - INTERVAL '100 days', admin_user_id, NOW() - INTERVAL '100 days', NOW()),
    
    (uuid_generate_v4(), 'Code of Conduct', 
     'All participants must adhere to our code of conduct. Harassment, discrimination, or inappropriate behavior will not be tolerated and may result in immediate removal from the event.',
     'conduct', '1.0', true, NOW() - INTERVAL '90 days', admin_user_id, NOW() - INTERVAL '90 days', NOW()),
    
    (uuid_generate_v4(), 'Data Protection Policy', 
     'We implement industry-standard security measures to protect your data. All personal information is encrypted and stored securely. We do not share your data with third parties without consent.',
     'data_protection', '1.0', true, NOW() - INTERVAL '80 days', admin_user_id, NOW() - INTERVAL '80 days', NOW())
  ON CONFLICT (id) DO NOTHING;
  
END $$;

-- ============================================
-- Summary
-- ============================================
SELECT 
  'Data seeding completed!' as status,
  (SELECT COUNT(*) FROM events) as total_events,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM booths) as total_booths,
  (SELECT COUNT(*) FROM reservations) as total_reservations,
  (SELECT COUNT(*) FROM transactions) as total_transactions,
  (SELECT COUNT(*) FROM invoices) as total_invoices,
  (SELECT COUNT(*) FROM costs) as total_costs,
  (SELECT COUNT(*) FROM budgets) as total_budgets,
  (SELECT COUNT(*) FROM proposals) as total_proposals,
  (SELECT COUNT(*) FROM proposal_templates) as total_templates,
  (SELECT COUNT(*) FROM team_activity) as total_activities,
  (SELECT COUNT(*) FROM monitoring_metrics) as total_metrics,
  (SELECT COUNT(*) FROM policies) as total_policies;

