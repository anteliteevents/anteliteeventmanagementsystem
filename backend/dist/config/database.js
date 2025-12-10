"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
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
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000, // Increased timeout for remote connections
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
    console.log('✅ Database connected');
});
pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});
// Log connection config (without password)
console.log('🔌 Database Config:', {
    host: poolConfig.host,
    port: poolConfig.port,
    database: poolConfig.database,
    user: poolConfig.user,
    ssl: poolConfig.ssl,
    hasPassword: !!poolConfig.password
});
exports.default = pool;
//# sourceMappingURL=database.js.map