/**
 * Shared Database Connection
 *
 * Core database connection for all modules to use.
 * Modules should NOT create their own connections.
 */
import pool from '../config/database';
export { pool };
export default pool;
//# sourceMappingURL=database.d.ts.map