-- Realistic Demo Data for Event Management System
-- Industry-standard events, booths, users, and transactions

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE transactions, invoices, reservations, booths, events, users CASCADE;

-- ============================================
-- REALISTIC USERS (Event Organizers & Exhibitors)
-- ============================================

-- Event Organizers (Admins)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@anteliteevents.com', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'Sarah', 'Mitchell', 'admin', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'operations@anteliteevents.com', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'James', 'Anderson', 'admin', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'sales@anteliteevents.com', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'Emily', 'Rodriguez', 'admin', true, NOW(), NOW());

-- Exhibitors (Realistic Companies)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'john.smith@techcorp.com', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'John', 'Smith', 'exhibitor', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'maria.garcia@innovatesolutions.io', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'Maria', 'Garcia', 'exhibitor', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'david.chen@greenenergy.com', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'David', 'Chen', 'exhibitor', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'lisa.williams@medtechpro.com', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'Lisa', 'Williams', 'exhibitor', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'robert.johnson@fintechglobal.net', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'Robert', 'Johnson', 'exhibitor', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'jennifer.brown@cloudservices.io', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'Jennifer', 'Brown', 'exhibitor', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440016', 'michael.davis@automotiveplus.com', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'Michael', 'Davis', 'exhibitor', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440017', 'amanda.miller@retailtech.com', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', 'Amanda', 'Miller', 'exhibitor', true, NOW(), NOW());

-- ============================================
-- REALISTIC EVENTS (Industry Conferences & Trade Shows)
-- ============================================

INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at) VALUES
-- Upcoming Active Events
('e0010000-e29b-41d4-a716-446655440001', 'Tech Innovation Summit 2025', 
 'The premier technology conference bringing together industry leaders, innovators, and entrepreneurs. Featuring keynote speakers, product launches, and networking opportunities across AI, cloud computing, and digital transformation.',
 '2025-03-15 09:00:00', '2025-03-17 18:00:00', 
 'San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103', 'published', NOW(), NOW()),

('e0010000-e29b-41d4-a716-446655440002', 'Green Energy Expo 2025', 
 'International exhibition showcasing renewable energy solutions, sustainable technologies, and environmental innovations. Connect with 500+ exhibitors and 15,000+ industry professionals.',
 '2025-04-20 10:00:00', '2025-04-22 17:00:00', 
 'Las Vegas Convention Center, 3150 Paradise Rd, Las Vegas, NV 89109', 'published', NOW(), NOW()),

('e0010000-e29b-41d4-a716-446655440003', 'Healthcare Technology Conference', 
 'Leading medical technology event featuring the latest innovations in patient care, medical devices, and healthcare IT solutions. CME credits available.',
 '2025-05-10 08:00:00', '2025-05-12 17:00:00', 
 'McCormick Place, 2301 S Lake Shore Dr, Chicago, IL 60616', 'published', NOW(), NOW()),

('e0010000-e29b-41d4-a716-446655440004', 'FinTech Global Forum', 
 'The world''s premier financial technology conference. Explore blockchain, digital banking, payment solutions, and regulatory technology with industry experts.',
 '2025-06-05 09:00:00', '2025-06-07 18:00:00', 
 'Javits Center, 429 11th Ave, New York, NY 10001', 'active', NOW(), NOW()),

-- Active/Current Events
('e0010000-e29b-41d4-a716-446655440005', 'Cloud Services & Infrastructure Expo', 
 'Comprehensive showcase of cloud computing solutions, data center technologies, and enterprise infrastructure. Featuring hands-on demos and technical workshops.',
 '2025-02-01 09:00:00', '2025-02-03 17:00:00', 
 'Austin Convention Center, 500 E Cesar Chavez St, Austin, TX 78701', 'active', NOW(), NOW()),

-- Completed Events (for historical data)
('e0010000-e29b-41d4-a716-446655440006', 'Automotive Innovation Show 2024', 
 'Annual automotive industry event featuring electric vehicles, autonomous driving technology, and manufacturing innovations. Over 20,000 attendees.',
 '2024-11-15 09:00:00', '2024-11-17 18:00:00', 
 'Cobo Center, 1 Washington Blvd, Detroit, MI 48226', 'completed', NOW(), NOW()),

('e0010000-e29b-41d4-a716-446655440007', 'Retail Technology Summit', 
 'Retail industry''s leading technology conference covering e-commerce, omnichannel solutions, supply chain innovation, and customer experience technologies.',
 '2024-10-20 10:00:00', '2024-10-22 17:00:00', 
 'Orange County Convention Center, 9800 International Dr, Orlando, FL 32819', 'completed', NOW(), NOW());

-- ============================================
-- REALISTIC BOOTHS (Industry-Standard Pricing & Layout)
-- ============================================

-- Tech Innovation Summit 2025 - Premium Event
INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
-- Premium Corner Booths (Higher Traffic)
('b0010000-e29b-41d4-a716-446655440001', 'e0010000-e29b-41d4-a716-446655440001', 'A1', 'large', 8500.00, 'booked', 10, 10, 2, 2, 'Premium corner location with high foot traffic. Perfect for major product launches.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440002', 'e0010000-e29b-41d4-a716-446655440001', 'A2', 'large', 8500.00, 'reserved', 30, 10, 2, 2, 'Premium corner location near main entrance.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440003', 'e0010000-e29b-41d4-a716-446655440001', 'A3', 'medium', 5500.00, 'available', 50, 10, 1, 2, 'Standard booth in high-traffic area.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440004', 'e0010000-e29b-41d4-a716-446655440001', 'A4', 'medium', 5500.00, 'available', 70, 10, 1, 2, 'Standard booth with good visibility.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440005', 'e0010000-e29b-41d4-a716-446655440001', 'A5', 'small', 3200.00, 'booked', 90, 10, 1, 1, 'Compact booth ideal for startups.', ARRAY['Power outlets'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440006', 'e0010000-e29b-41d4-a716-446655440001', 'A6', 'small', 3200.00, 'available', 110, 10, 1, 1, 'Compact booth in main hall.', ARRAY['Power outlets'], NOW(), NOW()),
-- Row B
('b0010000-e29b-41d4-a716-446655440007', 'e0010000-e29b-41d4-a716-446655440001', 'B1', 'large', 8000.00, 'booked', 10, 30, 2, 2, 'Large booth with excellent visibility.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440008', 'e0010000-e29b-41d4-a716-446655440001', 'B2', 'medium', 5200.00, 'reserved', 30, 30, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440009', 'e0010000-e29b-41d4-a716-446655440001', 'B3', 'medium', 5200.00, 'available', 50, 30, 1, 2, 'Standard booth with good access.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440010', 'e0010000-e29b-41d4-a716-446655440001', 'B4', 'small', 3000.00, 'available', 70, 30, 1, 1, 'Compact booth space.', ARRAY['Power outlets'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440011', 'e0010000-e29b-41d4-a716-446655440001', 'B5', 'small', 3000.00, 'booked', 90, 30, 1, 1, 'Compact booth near food court.', ARRAY['Power outlets'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440012', 'e0010000-e29b-41d4-a716-446655440001', 'B6', 'small', 3000.00, 'available', 110, 30, 1, 1, 'Compact booth space.', ARRAY['Power outlets'], NOW(), NOW());

-- Green Energy Expo 2025
INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
('b0010000-e29b-41d4-a716-446655440020', 'e0010000-e29b-41d4-a716-446655440002', 'C1', 'large', 7200.00, 'available', 10, 10, 2, 2, 'Premium location for solar energy exhibitors.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440021', 'e0010000-e29b-41d4-a716-446655440002', 'C2', 'large', 7200.00, 'reserved', 30, 10, 2, 2, 'Premium location near main stage.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440022', 'e0010000-e29b-41d4-a716-446655440002', 'C3', 'medium', 4800.00, 'booked', 50, 10, 1, 2, 'Standard booth for wind energy solutions.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440023', 'e0010000-e29b-41d4-a716-446655440002', 'C4', 'medium', 4800.00, 'available', 70, 10, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440024', 'e0010000-e29b-41d4-a716-446655440002', 'C5', 'small', 2800.00, 'available', 90, 10, 1, 1, 'Compact booth for startups.', ARRAY['Power outlets'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440025', 'e0010000-e29b-41d4-a716-446655440002', 'C6', 'small', 2800.00, 'booked', 110, 10, 1, 1, 'Compact booth space.', ARRAY['Power outlets'], NOW(), NOW());

-- Healthcare Technology Conference
INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
('b0010000-e29b-41d4-a716-446655440030', 'e0010000-e29b-41d4-a716-446655440003', 'D1', 'large', 9500.00, 'booked', 10, 10, 2, 2, 'Premium location for medical device manufacturers.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area', 'Privacy screen'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440031', 'e0010000-e29b-41d4-a716-446655440003', 'D2', 'large', 9500.00, 'reserved', 30, 10, 2, 2, 'Premium corner booth.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440032', 'e0010000-e29b-41d4-a716-446655440003', 'D3', 'medium', 6200.00, 'available', 50, 10, 1, 2, 'Standard booth for healthcare IT solutions.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440033', 'e0010000-e29b-41d4-a716-446655440003', 'D4', 'medium', 6200.00, 'booked', 70, 10, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440034', 'e0010000-e29b-41d4-a716-446655440003', 'D5', 'small', 3500.00, 'available', 90, 10, 1, 1, 'Compact booth for startups.', ARRAY['Power outlets'], NOW(), NOW());

-- FinTech Global Forum
INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
('b0010000-e29b-41d4-a716-446655440040', 'e0010000-e29b-41d4-a716-446655440004', 'E1', 'large', 8800.00, 'reserved', 10, 10, 2, 2, 'Premium location for major financial institutions.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area', 'Secure storage'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440041', 'e0010000-e29b-41d4-a716-446655440004', 'E2', 'large', 8800.00, 'available', 30, 10, 2, 2, 'Premium corner booth.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440042', 'e0010000-e29b-41d4-a716-446655440004', 'E3', 'medium', 5800.00, 'booked', 50, 10, 1, 2, 'Standard booth for payment solutions.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440043', 'e0010000-e29b-41d4-a716-446655440004', 'E4', 'medium', 5800.00, 'available', 70, 10, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440044', 'e0010000-e29b-41d4-a716-446655440004', 'E5', 'small', 3300.00, 'available', 90, 10, 1, 1, 'Compact booth for fintech startups.', ARRAY['Power outlets'], NOW(), NOW());

-- Cloud Services Expo (Active Event)
INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
('b0010000-e29b-41d4-a716-446655440050', 'e0010000-e29b-41d4-a716-446655440005', 'F1', 'large', 7800.00, 'booked', 10, 10, 2, 2, 'Premium location for cloud providers.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440051', 'e0010000-e29b-41d4-a716-446655440005', 'F2', 'large', 7800.00, 'booked', 30, 10, 2, 2, 'Premium corner booth.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440052', 'e0010000-e29b-41d4-a716-446655440005', 'F3', 'medium', 5200.00, 'reserved', 50, 10, 1, 2, 'Standard booth for infrastructure solutions.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440053', 'e0010000-e29b-41d4-a716-446655440005', 'F4', 'medium', 5200.00, 'available', 70, 10, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
('b0010000-e29b-41d4-a716-446655440054', 'e0010000-e29b-41d4-a716-446655440005', 'F5', 'small', 3000.00, 'available', 90, 10, 1, 1, 'Compact booth for startups.', ARRAY['Power outlets'], NOW(), NOW());

-- ============================================
-- REALISTIC RESERVATIONS (Active Bookings)
-- ============================================

INSERT INTO reservations (id, booth_id, exhibitor_id, event_id, status, reserved_at, expires_at, confirmed_at, created_at, updated_at) VALUES
-- Tech Innovation Summit - Confirmed Bookings
('r0010000-e29b-41d4-a716-446655440001', 'b0010000-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'e0010000-e29b-41d4-a716-446655440001', 'confirmed', NOW() - INTERVAL '15 days', NULL, NOW() - INTERVAL '14 days', NOW() - INTERVAL '15 days', NOW()),
('r0010000-e29b-41d4-a716-446655440002', 'b0010000-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440011', 'e0010000-e29b-41d4-a716-446655440001', 'confirmed', NOW() - INTERVAL '12 days', NULL, NOW() - INTERVAL '11 days', NOW() - INTERVAL '12 days', NOW()),
('r0010000-e29b-41d4-a716-446655440003', 'b0010000-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440012', 'e0010000-e29b-41d4-a716-446655440001', 'confirmed', NOW() - INTERVAL '10 days', NULL, NOW() - INTERVAL '9 days', NOW() - INTERVAL '10 days', NOW()),
('r0010000-e29b-41d4-a716-446655440004', 'b0010000-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440013', 'e0010000-e29b-41d4-a716-446655440001', 'confirmed', NOW() - INTERVAL '8 days', NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', NOW()),

-- Tech Innovation Summit - Pending Reservations
('r0010000-e29b-41d4-a716-446655440005', 'b0010000-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', 'e0010000-e29b-41d4-a716-446655440001', 'reserved', NOW() - INTERVAL '2 days', NOW() + INTERVAL '3 days', NULL, NOW() - INTERVAL '2 days', NOW()),
('r0010000-e29b-41d4-a716-446655440006', 'b0010000-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440015', 'e0010000-e29b-41d4-a716-446655440001', 'reserved', NOW() - INTERVAL '1 day', NOW() + INTERVAL '4 days', NULL, NOW() - INTERVAL '1 day', NOW()),

-- Green Energy Expo
('r0010000-e29b-41d4-a716-446655440010', 'b0010000-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440012', 'e0010000-e29b-41d4-a716-446655440002', 'confirmed', NOW() - INTERVAL '5 days', NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '5 days', NOW()),
('r0010000-e29b-41d4-a716-446655440011', 'b0010000-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440016', 'e0010000-e29b-41d4-a716-446655440002', 'confirmed', NOW() - INTERVAL '3 days', NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days', NOW()),
('r0010000-e29b-41d4-a716-446655440012', 'b0010000-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440017', 'e0010000-e29b-41d4-a716-446655440002', 'reserved', NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 days', NULL, NOW() - INTERVAL '1 day', NOW()),

-- Healthcare Technology
('r0010000-e29b-41d4-a716-446655440020', 'b0010000-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440013', 'e0010000-e29b-41d4-a716-446655440003', 'confirmed', NOW() - INTERVAL '7 days', NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '7 days', NOW()),
('r0010000-e29b-41d4-a716-446655440021', 'b0010000-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440014', 'e0010000-e29b-41d4-a716-446655440003', 'confirmed', NOW() - INTERVAL '4 days', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days', NOW()),
('r0010000-e29b-41d4-a716-446655440022', 'b0010000-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440015', 'e0010000-e29b-41d4-a716-446655440003', 'reserved', NOW() - INTERVAL '2 days', NOW() + INTERVAL '3 days', NULL, NOW() - INTERVAL '2 days', NOW()),

-- FinTech Global Forum
('r0010000-e29b-41d4-a716-446655440030', 'b0010000-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440014', 'e0010000-e29b-41d4-a716-446655440004', 'confirmed', NOW() - INTERVAL '6 days', NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days', NOW()),
('r0010000-e29b-41d4-a716-446655440031', 'b0010000-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440015', 'e0010000-e29b-41d4-a716-446655440004', 'reserved', NOW() - INTERVAL '1 day', NOW() + INTERVAL '4 days', NULL, NOW() - INTERVAL '1 day', NOW()),

-- Cloud Services Expo
('r0010000-e29b-41d4-a716-446655440040', 'b0010000-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440015', 'e0010000-e29b-41d4-a716-446655440005', 'confirmed', NOW() - INTERVAL '8 days', NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', NOW()),
('r0010000-e29b-41d4-a716-446655440041', 'b0010000-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440016', 'e0010000-e29b-41d4-a716-446655440005', 'confirmed', NOW() - INTERVAL '5 days', NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '5 days', NOW()),
('r0010000-e29b-41d4-a716-446655440042', 'b0010000-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440017', 'e0010000-e29b-41d4-a716-446655440005', 'reserved', NOW() - INTERVAL '2 days', NOW() + INTERVAL '3 days', NULL, NOW() - INTERVAL '2 days', NOW());

-- ============================================
-- REALISTIC TRANSACTIONS (Payment History)
-- ============================================

INSERT INTO transactions (id, reservation_id, amount, currency, payment_method, status, stripe_payment_intent_id, processed_at, created_at, updated_at) VALUES
-- Tech Innovation Summit Payments
('t0010000-e29b-41d4-a716-446655440001', 'r0010000-e29b-41d4-a716-446655440001', 8500.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKq', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', NOW()),
('t0010000-e29b-41d4-a716-446655440002', 'r0010000-e29b-41d4-a716-446655440002', 3200.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqK', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days', NOW()),
('t0010000-e29b-41d4-a716-446655440003', 'r0010000-e29b-41d4-a716-446655440003', 8000.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKq', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days', NOW()),
('t0010000-e29b-41d4-a716-446655440004', 'r0010000-e29b-41d4-a716-446655440004', 3000.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKqK', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW()),

-- Green Energy Expo Payments
('t0010000-e29b-41d4-a716-446655440010', 'r0010000-e29b-41d4-a716-446655440010', 4800.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKqKq', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW()),
('t0010000-e29b-41d4-a716-446655440011', 'r0010000-e29b-41d4-a716-446655440011', 2800.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKqKqK', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW()),

-- Healthcare Technology Payments
('t0010000-e29b-41d4-a716-446655440020', 'r0010000-e29b-41d4-a716-446655440020', 9500.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKqKqKq', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW()),
('t0010000-e29b-41d4-a716-446655440021', 'r0010000-e29b-41d4-a716-446655440021', 6200.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKqKqKqK', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW()),

-- FinTech Global Forum Payments
('t0010000-e29b-41d4-a716-446655440030', 'r0010000-e29b-41d4-a716-446655440030', 5800.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKqKqKqKq', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW()),

-- Cloud Services Expo Payments
('t0010000-e29b-41d4-a716-446655440040', 'r0010000-e29b-41d4-a716-446655440040', 7800.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKqKqKqKqK', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW()),
('t0010000-e29b-41d4-a716-446655440041', 'r0010000-e29b-41d4-a716-446655440041', 7800.00, 'USD', 'credit_card', 'completed', 'pi_3NxKqKqKqKqKqKqKqKqKqKqKqKqKqKq', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW());

-- ============================================
-- REALISTIC INVOICES (Professional Documentation)
-- ============================================

INSERT INTO invoices (id, reservation_id, invoice_number, amount, total_amount, status, due_date, paid_at, created_at, updated_at) VALUES
('i0010000-e29b-41d4-a716-446655440001', 'r0010000-e29b-41d4-a716-446655440001', 'INV-2025-001', 8500.00, 8500.00, 'paid', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '15 days', NOW()),
('i0010000-e29b-41d4-a716-446655440002', 'r0010000-e29b-41d4-a716-446655440002', 'INV-2025-002', 3200.00, 3200.00, 'paid', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days', NOW() - INTERVAL '12 days', NOW()),
('i0010000-e29b-41d4-a716-446655440003', 'r0010000-e29b-41d4-a716-446655440003', 'INV-2025-003', 8000.00, 8000.00, 'paid', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days', NOW() - INTERVAL '10 days', NOW()),
('i0010000-e29b-41d4-a716-446655440004', 'r0010000-e29b-41d4-a716-446655440004', 'INV-2025-004', 3000.00, 3000.00, 'paid', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', NOW()),
('i0010000-e29b-41d4-a716-446655440010', 'r0010000-e29b-41d4-a716-446655440010', 'INV-2025-010', 4800.00, 4800.00, 'paid', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '5 days', NOW()),
('i0010000-e29b-41d4-a716-446655440011', 'r0010000-e29b-41d4-a716-446655440011', 'INV-2025-011', 2800.00, 2800.00, 'paid', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days', NOW()),
('i0010000-e29b-41d4-a716-446655440020', 'r0010000-e29b-41d4-a716-446655440020', 'INV-2025-020', 9500.00, 9500.00, 'paid', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '7 days', NOW()),
('i0010000-e29b-41d4-a716-446655440021', 'r0010000-e29b-41d4-a716-446655440021', 'INV-2025-021', 6200.00, 6200.00, 'paid', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days', NOW()),
('i0010000-e29b-41d4-a716-446655440030', 'r0010000-e29b-41d4-a716-446655440030', 'INV-2025-030', 5800.00, 5800.00, 'paid', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days', NOW()),
('i0010000-e29b-41d4-a716-446655440040', 'r0010000-e29b-41d4-a716-446655440040', 'INV-2025-040', 7800.00, 7800.00, 'paid', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', NOW()),
('i0010000-e29b-41d4-a716-446655440041', 'r0010000-e29b-41d4-a716-446655440041', 'INV-2025-041', 7800.00, 7800.00, 'paid', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '5 days', NOW());

-- Update booth statuses based on reservations
UPDATE booths SET status = 'booked' WHERE id IN (
  SELECT booth_id FROM reservations WHERE status = 'confirmed'
);

UPDATE booths SET status = 'reserved' WHERE id IN (
  SELECT booth_id FROM reservations WHERE status = 'reserved'
);

