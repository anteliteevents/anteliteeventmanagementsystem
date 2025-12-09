/**
 * Script to update admin user password
 * Run with: node scripts/update-admin.js
 * 
 * You can modify the email and password variables below
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const readline = require('readline');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'antelite_events',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateAdmin() {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Update Admin Credentials');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Get email
    const email = await question('Enter admin email (or press Enter for default: admin@antelite.com): ');
    const adminEmail = email.trim() || 'admin@antelite.com';
    
    // Check if user exists
    const checkQuery = 'SELECT id, email, first_name, last_name, role FROM users WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [adminEmail]);
    
    if (checkResult.rows.length === 0) {
      console.log(`\n❌ User with email "${adminEmail}" not found!`);
      console.log('   Run create-admin.js first to create an admin user.\n');
      rl.close();
      await pool.end();
      return;
    }
    
    const user = checkResult.rows[0];
    console.log(`\n✅ Found user: ${user.first_name} ${user.last_name} (${user.role})`);
    
    // Get new password
    const password = await question('\nEnter new password (min 6 characters): ');
    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters!');
      rl.close();
      await pool.end();
      return;
    }
    
    // Confirm password
    const confirmPassword = await question('Confirm new password: ');
    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match!');
      rl.close();
      await pool.end();
      return;
    }
    
    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Update password
    const updateQuery = 'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email, role';
    const result = await pool.query(updateQuery, [passwordHash, adminEmail]);
    
    console.log('\n✅ Admin password updated successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + adminEmail);
    console.log('🔑 Password: ' + password);
    console.log('👤 Role:     ' + result.rows[0].role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('   You can login at: http://localhost:3000/login\n');
    
  } catch (error) {
    console.error('\n❌ Error updating admin:', error.message);
  } finally {
    rl.close();
    await pool.end();
  }
}

updateAdmin();

