-- Seed data for development and testing
-- Run this after schema.sql

-- Insert a sample event
INSERT INTO events (id, name, description, start_date, end_date, venue, status)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 
     'Tech Expo 2024', 
     'Annual technology exhibition showcasing the latest innovations',
     '2024-06-01 09:00:00',
     '2024-06-03 18:00:00',
     'Convention Center',
     'published');

-- Insert admin user (password: admin123 - should be hashed in production)
-- Note: In production, use bcrypt to hash passwords
INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001',
     'admin@antelite.com',
     '$2a$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
     'Admin',
     'User',
     'Ant Elite Events',
     'admin');

-- Insert sample exhibitor (password: exhibitor123 - should be hashed in production)
INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, role)
VALUES 
    ('00000000-0000-0000-0000-000000000002',
     'exhibitor@example.com',
     '$2a$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
     'John',
     'Doe',
     'Example Company',
     'exhibitor');

-- Insert sample booths for the event
INSERT INTO booths (event_id, booth_number, size, price, status, location_x, location_y, width, height, amenities)
VALUES 
    -- Row 1
    ('00000000-0000-0000-0000-000000000001', 'A1', 'small', 500.00, 'available', 0, 0, 1, 1, ARRAY['WiFi', 'Power']),
    ('00000000-0000-0000-0000-000000000001', 'A2', 'small', 500.00, 'available', 1, 0, 1, 1, ARRAY['WiFi', 'Power']),
    ('00000000-0000-0000-0000-000000000001', 'A3', 'medium', 1000.00, 'available', 2, 0, 2, 1, ARRAY['WiFi', 'Power', 'Furniture']),
    ('00000000-0000-0000-0000-000000000001', 'A5', 'small', 500.00, 'reserved', 4, 0, 1, 1, ARRAY['WiFi', 'Power']),
    ('00000000-0000-0000-0000-000000000001', 'A6', 'small', 500.00, 'available', 5, 0, 1, 1, ARRAY['WiFi', 'Power']),
    
    -- Row 2
    ('00000000-0000-0000-0000-000000000001', 'B1', 'large', 2000.00, 'available', 0, 1, 2, 2, ARRAY['WiFi', 'Power', 'Furniture', 'Storage']),
    ('00000000-0000-0000-0000-000000000001', 'B3', 'medium', 1000.00, 'available', 2, 1, 2, 1, ARRAY['WiFi', 'Power', 'Furniture']),
    ('00000000-0000-0000-0000-000000000001', 'B5', 'small', 500.00, 'available', 4, 1, 1, 1, ARRAY['WiFi', 'Power']),
    ('00000000-0000-0000-0000-000000000001', 'B6', 'small', 500.00, 'available', 5, 1, 1, 1, ARRAY['WiFi', 'Power']),
    
    -- Row 3
    ('00000000-0000-0000-0000-000000000001', 'C1', 'xlarge', 3500.00, 'available', 0, 3, 3, 2, ARRAY['WiFi', 'Power', 'Furniture', 'Storage', 'Premium Location']),
    ('00000000-0000-0000-0000-000000000001', 'C4', 'medium', 1000.00, 'available', 3, 3, 2, 1, ARRAY['WiFi', 'Power', 'Furniture']),
    ('00000000-0000-0000-0000-000000000001', 'C6', 'small', 500.00, 'booked', 5, 3, 1, 1, ARRAY['WiFi', 'Power']);

-- Insert sample floor plan
INSERT INTO floor_plans (event_id, name, layout_data)
VALUES 
    ('00000000-0000-0000-0000-000000000001',
     'Main Hall Floor Plan',
     '{
       "gridWidth": 6,
       "gridHeight": 5,
       "cellSize": 100,
       "zones": [
         {"id": "zone1", "name": "Premium Zone", "color": "#FFD700", "booths": ["C1"]},
         {"id": "zone2", "name": "Standard Zone", "color": "#87CEEB", "booths": ["A1", "A2", "A3", "A5", "A6", "B1", "B3", "B5", "B6", "C4", "C6"]}
       ]
     }'::jsonb);

