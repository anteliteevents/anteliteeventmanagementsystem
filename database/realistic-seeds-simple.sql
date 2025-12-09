-- Realistic Demo Data for Event Management System
-- Industry-standard events, booths, users, and transactions
-- Uses PostgreSQL's uuid_generate_v4() for proper UUID generation

-- ============================================
-- REALISTIC USERS (Event Organizers & Exhibitors)
-- ============================================

-- Note: Passwords will be hashed by the seed script
-- Default password for all demo users: demo123

-- Event Organizers (Admins)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at) VALUES
(uuid_generate_v4(), 'admin@anteliteevents.com', '$2b$10$PLACEHOLDER', 'Sarah', 'Mitchell', 'admin', true, NOW(), NOW()),
(uuid_generate_v4(), 'operations@anteliteevents.com', '$2b$10$PLACEHOLDER', 'James', 'Anderson', 'admin', true, NOW(), NOW()),
(uuid_generate_v4(), 'sales@anteliteevents.com', '$2b$10$PLACEHOLDER', 'Emily', 'Rodriguez', 'admin', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Exhibitors (Realistic Companies)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at) VALUES
(uuid_generate_v4(), 'john.smith@techcorp.com', '$2b$10$PLACEHOLDER', 'John', 'Smith', 'exhibitor', true, NOW(), NOW()),
(uuid_generate_v4(), 'maria.garcia@innovatesolutions.io', '$2b$10$PLACEHOLDER', 'Maria', 'Garcia', 'exhibitor', true, NOW(), NOW()),
(uuid_generate_v4(), 'david.chen@greenenergy.com', '$2b$10$PLACEHOLDER', 'David', 'Chen', 'exhibitor', true, NOW(), NOW()),
(uuid_generate_v4(), 'lisa.williams@medtechpro.com', '$2b$10$PLACEHOLDER', 'Lisa', 'Williams', 'exhibitor', true, NOW(), NOW()),
(uuid_generate_v4(), 'robert.johnson@fintechglobal.net', '$2b$10$PLACEHOLDER', 'Robert', 'Johnson', 'exhibitor', true, NOW(), NOW()),
(uuid_generate_v4(), 'jennifer.brown@cloudservices.io', '$2b$10$PLACEHOLDER', 'Jennifer', 'Brown', 'exhibitor', true, NOW(), NOW()),
(uuid_generate_v4(), 'michael.davis@automotiveplus.com', '$2b$10$PLACEHOLDER', 'Michael', 'Davis', 'exhibitor', true, NOW(), NOW()),
(uuid_generate_v4(), 'amanda.miller@retailtech.com', '$2b$10$PLACEHOLDER', 'Amanda', 'Miller', 'exhibitor', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- REALISTIC EVENTS (Industry Conferences & Trade Shows)
-- ============================================

-- Get admin user IDs for reference (we'll use the first admin)
DO $$
DECLARE
    admin1_id UUID;
    admin2_id UUID;
    admin3_id UUID;
    tech_event_id UUID;
    energy_event_id UUID;
    healthcare_event_id UUID;
    fintech_event_id UUID;
    cloud_event_id UUID;
    auto_event_id UUID;
    retail_event_id UUID;
BEGIN
    -- Get admin IDs
    SELECT id INTO admin1_id FROM users WHERE email = 'admin@anteliteevents.com' LIMIT 1;
    
    -- Insert Events
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'Tech Innovation Summit 2025', 
     'The premier technology conference bringing together industry leaders, innovators, and entrepreneurs. Featuring keynote speakers, product launches, and networking opportunities across AI, cloud computing, and digital transformation.',
     '2025-03-15 09:00:00', '2025-03-17 18:00:00', 
     'San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103', 'published', NOW(), NOW())
    RETURNING id INTO tech_event_id;
    
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'Green Energy Expo 2025', 
     'International exhibition showcasing renewable energy solutions, sustainable technologies, and environmental innovations. Connect with 500+ exhibitors and 15,000+ industry professionals.',
     '2025-04-20 10:00:00', '2025-04-22 17:00:00', 
     'Las Vegas Convention Center, 3150 Paradise Rd, Las Vegas, NV 89109', 'published', NOW(), NOW())
    RETURNING id INTO energy_event_id;
    
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'Healthcare Technology Conference', 
     'Leading medical technology event featuring the latest innovations in patient care, medical devices, and healthcare IT solutions. CME credits available.',
     '2025-05-10 08:00:00', '2025-05-12 17:00:00', 
     'McCormick Place, 2301 S Lake Shore Dr, Chicago, IL 60616', 'published', NOW(), NOW())
    RETURNING id INTO healthcare_event_id;
    
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'FinTech Global Forum', 
     'The world''s premier financial technology conference. Explore blockchain, digital banking, payment solutions, and regulatory technology with industry experts.',
     '2025-06-05 09:00:00', '2025-06-07 18:00:00', 
     'Javits Center, 429 11th Ave, New York, NY 10001', 'active', NOW(), NOW())
    RETURNING id INTO fintech_event_id;
    
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'Cloud Services & Infrastructure Expo', 
     'Comprehensive showcase of cloud computing solutions, data center technologies, and enterprise infrastructure. Featuring hands-on demos and technical workshops.',
     '2025-02-01 09:00:00', '2025-02-03 17:00:00', 
     'Austin Convention Center, 500 E Cesar Chavez St, Austin, TX 78701', 'active', NOW(), NOW())
    RETURNING id INTO cloud_event_id;
    
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'Automotive Innovation Show 2024', 
     'Annual automotive industry event featuring electric vehicles, autonomous driving technology, and manufacturing innovations. Over 20,000 attendees.',
     '2024-11-15 09:00:00', '2024-11-17 18:00:00', 
     'Cobo Center, 1 Washington Blvd, Detroit, MI 48226', 'completed', NOW(), NOW())
    RETURNING id INTO auto_event_id;
    
    INSERT INTO events (id, name, description, start_date, end_date, venue, status, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'Retail Technology Summit', 
     'Retail industry''s leading technology conference covering e-commerce, omnichannel solutions, supply chain innovation, and customer experience technologies.',
     '2024-10-20 10:00:00', '2024-10-22 17:00:00', 
     'Orange County Convention Center, 9800 International Dr, Orlando, FL 32819', 'completed', NOW(), NOW())
    RETURNING id INTO retail_event_id;
    
    -- Insert Booths for Tech Innovation Summit
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
    (uuid_generate_v4(), tech_event_id, 'A1', 'large', 8500.00, 'booked', 10, 10, 2, 2, 'Premium corner location with high foot traffic. Perfect for major product launches.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'A2', 'large', 8500.00, 'reserved', 30, 10, 2, 2, 'Premium corner location near main entrance.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'A3', 'medium', 5500.00, 'available', 50, 10, 1, 2, 'Standard booth in high-traffic area.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'A4', 'medium', 5500.00, 'available', 70, 10, 1, 2, 'Standard booth with good visibility.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'A5', 'small', 3200.00, 'booked', 90, 10, 1, 1, 'Compact booth ideal for startups.', ARRAY['Power outlets'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'A6', 'small', 3200.00, 'available', 110, 10, 1, 1, 'Compact booth in main hall.', ARRAY['Power outlets'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'B1', 'large', 8000.00, 'booked', 10, 30, 2, 2, 'Large booth with excellent visibility.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'B2', 'medium', 5200.00, 'reserved', 30, 30, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'B3', 'medium', 5200.00, 'available', 50, 30, 1, 2, 'Standard booth with good access.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'B4', 'small', 3000.00, 'available', 70, 30, 1, 1, 'Compact booth space.', ARRAY['Power outlets'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'B5', 'small', 3000.00, 'booked', 90, 30, 1, 1, 'Compact booth near food court.', ARRAY['Power outlets'], NOW(), NOW()),
    (uuid_generate_v4(), tech_event_id, 'B6', 'small', 3000.00, 'available', 110, 30, 1, 1, 'Compact booth space.', ARRAY['Power outlets'], NOW(), NOW());
    
    -- Insert Booths for Green Energy Expo
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
    (uuid_generate_v4(), energy_event_id, 'C1', 'large', 7200.00, 'available', 10, 10, 2, 2, 'Premium location for solar energy exhibitors.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area'], NOW(), NOW()),
    (uuid_generate_v4(), energy_event_id, 'C2', 'large', 7200.00, 'reserved', 30, 10, 2, 2, 'Premium location near main stage.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
    (uuid_generate_v4(), energy_event_id, 'C3', 'medium', 4800.00, 'booked', 50, 10, 1, 2, 'Standard booth for wind energy solutions.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), energy_event_id, 'C4', 'medium', 4800.00, 'available', 70, 10, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), energy_event_id, 'C5', 'small', 2800.00, 'available', 90, 10, 1, 1, 'Compact booth for startups.', ARRAY['Power outlets'], NOW(), NOW()),
    (uuid_generate_v4(), energy_event_id, 'C6', 'small', 2800.00, 'booked', 110, 10, 1, 1, 'Compact booth space.', ARRAY['Power outlets'], NOW(), NOW());
    
    -- Insert Booths for Healthcare Technology
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
    (uuid_generate_v4(), healthcare_event_id, 'D1', 'large', 9500.00, 'booked', 10, 10, 2, 2, 'Premium location for medical device manufacturers.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area', 'Privacy screen'], NOW(), NOW()),
    (uuid_generate_v4(), healthcare_event_id, 'D2', 'large', 9500.00, 'reserved', 30, 10, 2, 2, 'Premium corner booth.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
    (uuid_generate_v4(), healthcare_event_id, 'D3', 'medium', 6200.00, 'available', 50, 10, 1, 2, 'Standard booth for healthcare IT solutions.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), healthcare_event_id, 'D4', 'medium', 6200.00, 'booked', 70, 10, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), healthcare_event_id, 'D5', 'small', 3500.00, 'available', 90, 10, 1, 1, 'Compact booth for startups.', ARRAY['Power outlets'], NOW(), NOW());
    
    -- Insert Booths for FinTech Global Forum
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
    (uuid_generate_v4(), fintech_event_id, 'E1', 'large', 8800.00, 'reserved', 10, 10, 2, 2, 'Premium location for major financial institutions.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area', 'Secure storage'], NOW(), NOW()),
    (uuid_generate_v4(), fintech_event_id, 'E2', 'large', 8800.00, 'available', 30, 10, 2, 2, 'Premium corner booth.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
    (uuid_generate_v4(), fintech_event_id, 'E3', 'medium', 5800.00, 'booked', 50, 10, 1, 2, 'Standard booth for payment solutions.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), fintech_event_id, 'E4', 'medium', 5800.00, 'available', 70, 10, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), fintech_event_id, 'E5', 'small', 3300.00, 'available', 90, 10, 1, 1, 'Compact booth for fintech startups.', ARRAY['Power outlets'], NOW(), NOW());
    
    -- Insert Booths for Cloud Services Expo
    INSERT INTO booths (id, event_id, booth_number, size, price, status, location_x, location_y, width, height, description, amenities, created_at, updated_at) VALUES
    (uuid_generate_v4(), cloud_event_id, 'F1', 'large', 7800.00, 'booked', 10, 10, 2, 2, 'Premium location for cloud providers.', ARRAY['Power outlets', 'WiFi', 'Display screens', 'Storage area'], NOW(), NOW()),
    (uuid_generate_v4(), cloud_event_id, 'F2', 'large', 7800.00, 'booked', 30, 10, 2, 2, 'Premium corner booth.', ARRAY['Power outlets', 'WiFi', 'Display screens'], NOW(), NOW()),
    (uuid_generate_v4(), cloud_event_id, 'F3', 'medium', 5200.00, 'reserved', 50, 10, 1, 2, 'Standard booth for infrastructure solutions.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), cloud_event_id, 'F4', 'medium', 5200.00, 'available', 70, 10, 1, 2, 'Standard booth location.', ARRAY['Power outlets', 'WiFi'], NOW(), NOW()),
    (uuid_generate_v4(), cloud_event_id, 'F5', 'small', 3000.00, 'available', 90, 10, 1, 1, 'Compact booth for startups.', ARRAY['Power outlets'], NOW(), NOW());
    
END $$;

-- Note: Reservations, Transactions, and Invoices will be created through the application
-- when users actually book booths. This keeps the data realistic and avoids UUID conflicts.

