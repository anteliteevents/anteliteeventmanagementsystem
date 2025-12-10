import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const useSSL = (process.env.DB_SSL || 'true').toLowerCase() !== 'false';

// Prefer full connection string if provided (e.g., Supabase with sslmode=require)
const connectionString = process.env.DATABASE_URL;

const poolConfig: PoolConfig = connectionString
  ? {
      connectionString,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'antelite_events',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool(poolConfig);

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
