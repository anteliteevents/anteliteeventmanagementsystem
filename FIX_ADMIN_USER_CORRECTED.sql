-- Fix Admin User - Corrected SQL with required fields
-- Run this in Adminer or via psql

-- Option 1: Insert or Update (Recommended)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at)
VALUES (
  'admin88759551@antelite.digital',
  '$2a$10$XTAsFTa09q8jZUN/5lXgrOxCiSLiNnHGs.IXLg4gkSldPr6MAsN/m',
  'Admin',
  'User',
  'admin',
  true,
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
    password_hash = EXCLUDED.password_hash,
    first_name = COALESCE(users.first_name, EXCLUDED.first_name),
    last_name = COALESCE(users.last_name, EXCLUDED.last_name),
    is_active = true,
    updated_at = NOW();

-- Option 2: Update existing user only
-- UPDATE users 
-- SET password_hash = '$2a$10$XTAsFTa09q8jZUN/5lXgrOxCiSLiNnHGs.IXLg4gkSldPr6MAsN/m',
--     first_name = COALESCE(first_name, 'Admin'),
--     last_name = COALESCE(last_name, 'User'),
--     is_active = true,
--     updated_at = NOW()
-- WHERE email = 'admin88759551@antelite.digital';

-- Verify the user was created/updated
SELECT email, first_name, last_name, role, is_active, created_at 
FROM users 
WHERE email = 'admin88759551@antelite.digital';

