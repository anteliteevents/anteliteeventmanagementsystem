/**
 * Create Database Script
 * Creates the antelite_events database if it doesn't exist
 */

require('dotenv').config();
const { Pool } = require('pg');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: 'postgres', // Connect to default postgres database first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

const dbName = process.env.DB_NAME || 'antelite_events';

async function createDatabase() {
  console.log('\n🔧 Creating PostgreSQL Database...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📋 Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Database: ${dbName}\n`);

  const pool = new Pool(config);

  try {
    // Test connection
    console.log('1️⃣  Testing connection...');
    await pool.query('SELECT version()');
    console.log('   ✅ Connection successful!\n');

    // Check if database exists
    console.log(`2️⃣  Checking if database '${dbName}' exists...`);
    const dbCheck = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (dbCheck.rows.length > 0) {
      console.log(`   ✅ Database '${dbName}' already exists!\n`);
    } else {
      // Create database
      console.log(`   📝 Creating database '${dbName}'...`);
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`   ✅ Database '${dbName}' created successfully!\n`);
    }

    // Verify by connecting to the new database
    console.log('3️⃣  Verifying database...');
    const verifyPool = new Pool({
      ...config,
      database: dbName,
    });
    const verifyResult = await verifyPool.query('SELECT current_database()');
    console.log(`   ✅ Connected to: ${verifyResult.rows[0].current_database}\n`);
    await verifyPool.end();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Database setup complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '28P01') {
      console.error('\n💡 Password authentication failed!');
      console.error('   Please set the correct password in backend/.env');
      console.error('   Or update PostgreSQL password in pgAdmin to match .env\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused!');
      console.error('   Please ensure PostgreSQL service is running\n');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createDatabase();

