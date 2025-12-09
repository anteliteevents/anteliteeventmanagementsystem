/**
 * Quick script to update admin password
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'antelite_events',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

async function updatePassword() {
  const email = 'admin@antelite.com';
  const newPassword = 'admin123';
  
  try {
    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    const updateQuery = 'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email, role';
    const result = await pool.query(updateQuery, [passwordHash, email]);
    
    if (result.rows.length === 0) {
      console.log(`\n❌ User with email "${email}" not found!\n`);
      await pool.end();
      return;
    }
    
    console.log('\n✅ Admin password updated successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + email);
    console.log('🔑 Password: ' + newPassword);
    console.log('👤 Role:     ' + result.rows[0].role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 You can now login at: http://localhost:3000/login\n');
    
  } catch (error) {
    console.error('\n❌ Error updating password:', error.message);
  } finally {
    await pool.end();
  }
}

updatePassword();

