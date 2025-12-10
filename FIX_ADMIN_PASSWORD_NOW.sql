-- Fix Admin User Password - COPY AND PASTE THIS IN ADMINER
-- This will create/update the admin user with the correct password hash

INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at)
VALUES (
  'admin88759551@antelite.digital',
  '$2a$10$A8smdnGzhOl1gQCK5YXpAeVuCm.L2zuKL1VUzntr8fmocjIt5DEoG',
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

-- Verify the user was created/updated
SELECT email, first_name, last_name, role, is_active, 
       LENGTH(password_hash) as hash_length
FROM users 
WHERE email = 'admin88759551@antelite.digital';

