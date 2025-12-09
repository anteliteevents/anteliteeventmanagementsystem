/**
 * Test Database Connection
 * Tests if the database connection works with current .env credentials
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('\n🔍 Testing PostgreSQL Connection...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Display connection info (without password)
console.log('📋 Connection Details:');
console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`   Port: ${process.env.DB_PORT || '5432'}`);
console.log(`   Database: ${process.env.DB_NAME || 'antelite_events'}`);
console.log(`   User: ${process.env.DB_USER || 'postgres'}`);
console.log(`   Password: ${process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-2) : 'NOT SET'}\n`);

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'antelite_events',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  connectionTimeoutMillis: 5000,
});

async function testConnection() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Attempting to connect...\n');
    
    // Test basic connection
    const result = await client.query('SELECT version(), current_database(), current_user');
    const version = result.rows[0].version;
    const database = result.rows[0].current_database;
    const user = result.rows[0].current_user;
    
    console.log('✅ Connection successful!\n');
    console.log('📊 Database Info:');
    console.log(`   PostgreSQL Version: ${version.split(',')[0]}`);
    console.log(`   Database: ${database}`);
    console.log(`   User: ${user}\n`);
    
    // Test if tables exist
    console.log('🔍 Checking tables...\n');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log(`✅ Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found in database');
    }
    
    // Check data counts
    console.log('\n📊 Data Summary:');
    const tables = ['users', 'events', 'booths', 'reservations', 'transactions', 'invoices', 
                    'costs', 'budgets', 'proposals', 'monitoring_metrics', 'team_activity', 'policies'];
    
    for (const table of tables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(countResult.rows[0].count);
        if (count > 0) {
          console.log(`   ${table}: ${count} records`);
        }
      } catch (err) {
        // Table doesn't exist, skip
      }
    }
    
    console.log('\n✅ Database connection test completed successfully!');
    console.log('\n💡 Your password is working correctly!');
    console.log('   You can now run: node backend/scripts/seed-enhanced-data.js\n');
    
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error details:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}\n`);
    
    if (error.code === '28P01') {
      console.error('💡 Password authentication failed!');
      console.error('   Please check your DB_PASSWORD in backend/.env\n');
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist!');
      console.error('   Please create the database first\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Cannot connect to PostgreSQL server!');
      console.error('   Please check:');
      console.error('   • PostgreSQL service is running');
      console.error('   • DB_HOST and DB_PORT in .env are correct\n');
    }
    
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });

