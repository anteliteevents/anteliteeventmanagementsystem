/**
 * Database Configuration
 * 
 * PostgreSQL connection pool setup and management.
 * 
 * @module config/database
 */

import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import logger from './logger';
import { DB_CONSTANTS } from './constants';

dotenv.config();

const useSSL = (process.env.DB_SSL || 'false').toLowerCase() !== 'false';

// Prefer individual connection parameters over connection string to avoid URL encoding issues
// This is more reliable when passwords contain special characters
const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'antelite_events',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: DB_CONSTANTS.MAX_CONNECTIONS,
  idleTimeoutMillis: DB_CONSTANTS.IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: DB_CONSTANTS.CONNECTION_TIMEOUT_MS,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
};

// Only use DATABASE_URL if individual params are not set
if (process.env.DATABASE_URL && !process.env.DB_HOST) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  // Override ssl setting from connection string
  if (poolConfig.connectionString) {
    poolConfig.ssl = useSSL ? { rejectUnauthorized: false } : false;
  }
}

const pool = new Pool(poolConfig);

// Test connection on startup
pool.on('connect', () => {
  logger.info('Database connected successfully');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client', { error: err.message, stack: err.stack });
  process.exit(-1);
});

// Log connection config (without password)
logger.info('Database configuration initialized', {
  host: poolConfig.host,
  port: poolConfig.port,
  database: poolConfig.database,
  user: poolConfig.user,
  ssl: poolConfig.ssl,
  hasPassword: !!poolConfig.password,
});

export default pool;
