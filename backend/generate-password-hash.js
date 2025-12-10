// Generate bcrypt hash for admin password
// Run: node generate-password-hash.js

const bcrypt = require('bcryptjs');

const password = '94lUYIQ1csnXs1x';

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('\n✅ Password hash generated:');
    console.log(hash);
    console.log('\n📋 SQL to update user:');
    console.log(`
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at)
VALUES (
  'admin88759551@antelite.digital',
  '${hash}',
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
    `);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

