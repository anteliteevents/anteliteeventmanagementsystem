"use strict";
/**
 * Database Configuration
 *
 * PostgreSQL connection pool setup and management.
 *
 * @module config/database
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
const constants_1 = require("./constants");
dotenv_1.default.config();
const useSSL = (process.env.DB_SSL || 'false').toLowerCase() !== 'false';
// Prefer individual connection parameters over connection string to avoid URL encoding issues
// This is more reliable when passwords contain special characters
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'antelite_events',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: constants_1.DB_CONSTANTS.MAX_CONNECTIONS,
    idleTimeoutMillis: constants_1.DB_CONSTANTS.IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: constants_1.DB_CONSTANTS.CONNECTION_TIMEOUT_MS,
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
const pool = new pg_1.Pool(poolConfig);
// Test connection on startup
pool.on('connect', () => {
    logger_1.default.info('Database connected successfully');
});
pool.on('error', (err) => {
    logger_1.default.error('Unexpected error on idle database client', { error: err.message, stack: err.stack });
    process.exit(-1);
});
// Log connection config (without password)
logger_1.default.info('Database configuration initialized', {
    host: poolConfig.host,
    port: poolConfig.port,
    database: poolConfig.database,
    user: poolConfig.user,
    ssl: poolConfig.ssl,
    hasPassword: !!poolConfig.password,
});
exports.default = pool;
//# sourceMappingURL=database.js.map