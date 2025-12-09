/**
 * Script to create a custom admin user
 * 
 * HOW TO USE:
 * 1. Edit the variables below (email, password, firstName, lastName)
 * 2. Run: node scripts/create-custom-admin.js
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

// ═══════════════════════════════════════════════════════
// EDIT THESE VALUES TO CUSTOMIZE YOUR ADMIN ACCOUNT
// ═══════════════════════════════════════════════════════

const ADMIN_CONFIG = {
  email: 'admin@antelite.com',        // Change this to your preferred email
  password: 'Admin123!',              // Change this to your preferred password
  firstName: 'Super',                  // Change this to your first name
  lastName: 'Admin',                  // Change this to your last name
  companyName: 'Ant Elite Events',    // Optional: Company name
  phone: '+1 234 567 8900'            // Optional: Phone number
};

// ═══════════════════════════════════════════════════════

async function createCustomAdmin() {
  try {
    // Check if admin already exists
    const checkQuery = 'SELECT id FROM users WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [ADMIN_CONFIG.email]);
    
    if (checkResult.rows.length > 0) {
      console.log('\n⚠️  Admin user already exists!');
      console.log(`   Email: ${ADMIN_CONFIG.email}`);
      console.log('\n   Options:');
      console.log('   1. Use update-admin.js to change the password');
      console.log('   2. Delete the user from database and run this script again');
      console.log('   3. Use a different email address\n');
      await pool.end();
      return;
    }
    
    // Validate password
    if (ADMIN_CONFIG.password.length < 6) {
      console.log('\n❌ Error: Password must be at least 6 characters!\n');
      await pool.end();
      return;
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(ADMIN_CONFIG.password, 10);
    
    // Create admin user
    const insertQuery = `
      INSERT INTO users (email, password_hash, first_name, last_name, company_name, phone, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name, role
    `;
    
    const result = await pool.query(insertQuery, [
      ADMIN_CONFIG.email,
      passwordHash,
      ADMIN_CONFIG.firstName,
      ADMIN_CONFIG.lastName,
      ADMIN_CONFIG.companyName || null,
      ADMIN_CONFIG.phone || null,
      'admin',
      true
    ]);
    
    console.log('\n✅ Custom Admin created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + ADMIN_CONFIG.email);
    console.log('🔑 Password: ' + ADMIN_CONFIG.password);
    console.log('👤 Name:     ' + ADMIN_CONFIG.firstName + ' ' + ADMIN_CONFIG.lastName);
    console.log('🏢 Company:  ' + (ADMIN_CONFIG.companyName || 'N/A'));
    console.log('📞 Phone:    ' + (ADMIN_CONFIG.phone || 'N/A'));
    console.log('👤 Role:     admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('   You can login at: http://localhost:3000/login\n');
    
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    if (error.code === '23505') {
      console.log('   User with this email already exists.');
    }
  } finally {
    await pool.end();
  }
}

createCustomAdmin();

