/**
 * Script to create a super admin user
 * Run with: node scripts/create-admin.js
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

async function createAdmin() {
  const email = 'admin@antelite.com';
  const password = 'Admin123!';
  const firstName = 'Super';
  const lastName = 'Admin';
  
  try {
    // Check if admin already exists
    const checkQuery = 'SELECT id FROM users WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [email]);
    
    if (checkResult.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log('\nTo reset the password, delete the user first or update manually.');
      await pool.end();
      return;
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create admin user
    const insertQuery = `
      INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, role
    `;
    
    const result = await pool.query(insertQuery, [
      email,
      passwordHash,
      firstName,
      lastName,
      'admin',
      true
    ]);
    
    console.log('\n✅ Super Admin created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + email);
    console.log('🔑 Password: ' + password);
    console.log('👤 Role:     admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('   You can login at: http://localhost:3000/login\n');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === '23505') {
      console.log('User with this email already exists.');
    }
  } finally {
    await pool.end();
  }
}

createAdmin();

