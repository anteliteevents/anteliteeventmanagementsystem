/**
 * Enhanced Data Seeding Script
 * Adds comprehensive data for Payments, Costing, Proposals, Monitoring, and Policies modules
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

async function seedEnhancedData() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting enhanced data seeding...\n');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', '..', 'database', 'enhanced-seeds.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    console.log('📝 Executing enhanced-seeds.sql...');
    await client.query(sql);
    
    console.log('\n✅ Enhanced data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   • Added more transactions and invoices');
    console.log('   • Added more costs and budgets');
    console.log('   • Added more proposals and templates');
    console.log('   • Added monitoring metrics');
    console.log('   • Added team activity logs');
    console.log('   • Added more policies');
    
  } catch (error) {
    console.error('❌ Error seeding enhanced data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding
seedEnhancedData()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });

