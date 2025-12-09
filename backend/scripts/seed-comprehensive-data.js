/**
 * Comprehensive Data Seeding Script
 * 
 * This script executes the comprehensive-seeds.sql file to populate
 * the database with extensive realistic data for testing and demonstration.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'antelite_events',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function seedComprehensiveData() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting comprehensive data seeding...\n');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', '..', 'database', 'comprehensive-seeds.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    console.log('📝 Executing comprehensive seed SQL...');
    await client.query(sql);
    
    console.log('\n✅ Comprehensive data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   • Multiple events with various statuses');
    console.log('   • Hundreds of booths across all events');
    console.log('   • Multiple users (admins and exhibitors)');
    console.log('   • Reservations, transactions, and invoices');
    console.log('   • Cost tracking and budgets');
    console.log('   • Proposals and templates');
    console.log('   • Monitoring metrics');
    console.log('   • System policies');
    console.log('\n🎉 Your database is now populated with comprehensive data!');
    
  } catch (error) {
    console.error('\n❌ Error seeding comprehensive data:', error);
    console.error('\nError details:', error.message);
    if (error.position) {
      console.error(`Error at position: ${error.position}`);
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding
seedComprehensiveData();

