"use strict";
/**
 * Policies Service
 * Handles policy management, terms & conditions, and compliance
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../config/database"));
const event_bus_1 = require("../../../core/event-bus");
class PoliciesService {
    /**
     * Create a policy
     */
    async createPolicy(data) {
        const query = `
      INSERT INTO policies (
        title, content, category, version, is_active,
        effective_date, expires_at, created_by, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, true, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
        const result = await database_1.default.query(query, [
            data.title,
            data.content,
            data.category,
            data.version || '1.0',
            data.effectiveDate || null,
            data.expiresAt || null,
            data.createdBy || null,
        ]);
        const policy = this.mapPolicy(result.rows[0]);
        await event_bus_1.eventBus.emit('policy.created', {
            policyId: policy.id,
            category: data.category,
        });
        return policy;
    }
    /**
     * Get policies
     */
    async getPolicies(filters) {
        let query = `
      SELECT p.*, u.first_name || ' ' || u.last_name as created_by_name
      FROM policies p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
        const params = [];
        let paramIndex = 1;
        if (filters?.category) {
            query += ` AND p.category = $${paramIndex}`;
            params.push(filters.category);
            paramIndex++;
        }
        if (filters?.isActive !== undefined) {
            query += ` AND p.is_active = $${paramIndex}`;
            params.push(filters.isActive);
            paramIndex++;
        }
        query += ` ORDER BY p.category, p.created_at DESC`;
        const result = await database_1.default.query(query, params);
        return result.rows.map(row => this.mapPolicy(row));
    }
    /**
     * Get active policy by category
     */
    async getActivePolicy(category) {
        const query = `
      SELECT * FROM policies
      WHERE category = $1 AND is_active = true
      AND (effective_date IS NULL OR effective_date <= NOW())
      AND (expires_at IS NULL OR expires_at >= NOW())
      ORDER BY created_at DESC
      LIMIT 1
    `;
        const result = await database_1.default.query(query, [category]);
        return result.rows.length > 0 ? this.mapPolicy(result.rows[0]) : null;
    }
    /**
     * Update policy
     */
    async updatePolicy(policyId, updates) {
        const allowedFields = ['title', 'content', 'category', 'version', 'effectiveDate', 'expiresAt'];
        const setClauses = [];
        const values = [];
        let paramIndex = 1;
        for (const [key, value] of Object.entries(updates)) {
            const dbKey = key === 'effectiveDate' ? 'effective_date' : key === 'expiresAt' ? 'expires_at' : key;
            if (allowedFields.includes(key) && value !== undefined) {
                setClauses.push(`${dbKey} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        }
        if (setClauses.length === 0) {
            throw new Error('No valid fields to update');
        }
        setClauses.push(`updated_at = NOW()`);
        values.push(policyId);
        const query = `
      UPDATE policies
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
        const result = await database_1.default.query(query, values);
        const policy = this.mapPolicy(result.rows[0]);
        await event_bus_1.eventBus.emit('policy.updated', {
            policyId: policy.id,
        });
        return policy;
    }
    /**
     * Activate policy
     */
    async activatePolicy(policyId) {
        const query = `
      UPDATE policies
      SET is_active = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
        const result = await database_1.default.query(query, [policyId]);
        const policy = this.mapPolicy(result.rows[0]);
        await event_bus_1.eventBus.emit('policy.activated', {
            policyId: policy.id,
        });
        return policy;
    }
    /**
     * Deactivate policy
     */
    async deactivatePolicy(policyId) {
        const query = `
      UPDATE policies
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
        const result = await database_1.default.query(query, [policyId]);
        const policy = this.mapPolicy(result.rows[0]);
        await event_bus_1.eventBus.emit('policy.deactivated', {
            policyId: policy.id,
        });
        return policy;
    }
    /**
     * Get policy by ID
     */
    async getPolicyById(policyId) {
        const query = `
      SELECT p.*, u.first_name || ' ' || u.last_name as created_by_name
      FROM policies p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = $1
    `;
        const result = await database_1.default.query(query, [policyId]);
        if (result.rows.length === 0)
            return null;
        return this.mapPolicy(result.rows[0]);
    }
    /**
     * Delete policy
     */
    async deletePolicy(policyId) {
        const query = `DELETE FROM policies WHERE id = $1`;
        await database_1.default.query(query, [policyId]);
        await event_bus_1.eventBus.emit('policy.deleted', {
            policyId,
        });
    }
    /**
     * Duplicate policy
     */
    async duplicatePolicy(policyId, data) {
        const originalPolicy = await this.getPolicyById(policyId);
        if (!originalPolicy) {
            throw new Error('Policy not found');
        }
        // Increment version if not provided
        const versionParts = originalPolicy.version.split('.');
        const newVersion = data?.version || `${versionParts[0]}.${parseInt(versionParts[1] || '0') + 1}`;
        return await this.createPolicy({
            title: data?.title || `${originalPolicy.title} (Copy)`,
            content: originalPolicy.content,
            category: originalPolicy.category,
            version: newVersion,
            effectiveDate: originalPolicy.effectiveDate,
            expiresAt: originalPolicy.expiresAt,
            createdBy: originalPolicy.createdBy,
        });
    }
    mapPolicy(row) {
        return {
            id: row.id,
            title: row.title,
            content: row.content,
            category: row.category,
            version: row.version,
            isActive: row.is_active,
            effectiveDate: row.effective_date,
            expiresAt: row.expires_at,
            createdBy: row.created_by,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}
exports.default = new PoliciesService();
//# sourceMappingURL=policies.service.js.map