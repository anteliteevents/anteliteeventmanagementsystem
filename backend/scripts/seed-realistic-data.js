/**
 * Seed Realistic Demo Data
 * 
 * This script populates the database with realistic industry-standard
 * event management data that looks professional and authentic.
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'antelite_events',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function seedData() {
  console.log('🌱 Starting realistic data seeding...\n');

  try {
    // Hash passwords for users
    const defaultPassword = await bcrypt.hash('demo123', 10);

    // Read the SQL seed file
    const seedFile = path.join(__dirname, '../../database/realistic-seeds-simple.sql');
    let sql = fs.readFileSync(seedFile, 'utf8');

    // Replace password placeholders with actual hashes
    sql = sql.replace(/\$2b\$10\$PLACEHOLDER/g, defaultPassword);

    // Execute the SQL (using DO block for complex logic)
    await pool.query(sql);

    console.log('✅ Realistic demo data seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('   • 3 Admin users');
    console.log('   • 8 Exhibitor users');
    console.log('   • 7 Industry events');
    console.log('   • 50+ Booths with realistic pricing');
    console.log('   • 15+ Reservations (confirmed & pending)');
    console.log('   • 11 Completed transactions');
    console.log('   • 11 Professional invoices\n');
    console.log('💡 Login credentials:');
    console.log('   Email: admin@anteliteevents.com');
    console.log('   Password: demo123 (or use your existing admin password)\n');
    console.log('   Exhibitor emails: john.smith@techcorp.com, maria.garcia@innovatesolutions.io, etc.');
    console.log('   Password: demo123\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedData();

