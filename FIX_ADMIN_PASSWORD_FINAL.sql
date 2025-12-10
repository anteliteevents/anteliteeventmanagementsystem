-- Fix Admin User Password - Run this in Adminer
-- This will create/update the admin user with correct password hash

-- First, let's check if the user exists
SELECT email, first_name, last_name, role, is_active 
FROM users 
WHERE email = 'admin88759551@antelite.digital';

-- If user doesn't exist or password is wrong, run this:
-- Note: You need to generate a fresh bcrypt hash for the password '94lUYIQ1csnXs1x'
-- The hash below might be outdated, so generate a new one using Node.js:
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('94lUYIQ1csnXs1x', 10).then(hash => console.log(hash));"

-- Insert or Update user with fresh password hash
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at)
VALUES (
  'admin88759551@antelite.digital',
  '$2a$10$YOUR_NEW_HASH_HERE',  -- Replace with fresh hash from Node.js command above
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

-- Verify the user
SELECT email, first_name, last_name, role, is_active, 
       LENGTH(password_hash) as hash_length
FROM users 
WHERE email = 'admin88759551@antelite.digital';

