/**
 * Script to activate admin user account
 * Run with: node scripts/activate-admin.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'antelite_events',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

async function activateAdmin() {
  const email = 'admin@antelite.com';
  
  try {
    // Check if user exists
    const checkQuery = 'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [email]);
    
    if (checkResult.rows.length === 0) {
      console.log(`\n❌ User with email "${email}" not found!`);
      console.log('   Run create-admin.js first to create an admin user.\n');
      await pool.end();
      return;
    }
    
    const user = checkResult.rows[0];
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Current Status');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:     ${user.email}`);
    console.log(`👤 Name:      ${user.first_name} ${user.last_name}`);
    console.log(`👤 Role:      ${user.role}`);
    console.log(`✅ Active:    ${user.is_active ? 'Yes' : 'No'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (user.is_active) {
      console.log('✅ Account is already active!\n');
      console.log('⚠️  If you still get "Account is inactive" error,');
      console.log('   the issue might be in the user model mapping.\n');
      await pool.end();
      return;
    }
    
    // Activate the account
    const updateQuery = 'UPDATE users SET is_active = $1 WHERE email = $2 RETURNING email, is_active';
    const result = await pool.query(updateQuery, [true, email]);
    
    console.log('✅ Admin account activated successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + result.rows[0].email);
    console.log('✅ Status:  Active');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 You can now login at: http://localhost:3000/login\n');
    
  } catch (error) {
    console.error('\n❌ Error activating admin:', error.message);
  } finally {
    await pool.end();
  }
}

activateAdmin();

