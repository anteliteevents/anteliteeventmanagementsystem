"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class UserModel {
    /**
     * Get user by ID
     */
    async findById(id) {
        const query = `
      SELECT 
        id,
        email,
        password_hash as "passwordHash",
        first_name as "firstName",
        last_name as "lastName",
        company_name as "companyName",
        phone,
        role,
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users WHERE id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    /**
     * Get user by email
     */
    async findByEmail(email) {
        const query = `
      SELECT 
        id,
        email,
        password_hash as "passwordHash",
        first_name as "firstName",
        last_name as "lastName",
        company_name as "companyName",
        phone,
        role,
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users WHERE email = $1
    `;
        const result = await database_1.default.query(query, [email]);
        return result.rows[0] || null;
    }
    /**
     * Get user by ID without password
     */
    async findByIdSafe(id) {
        const query = `
      SELECT 
        id, 
        email, 
        first_name as "firstName", 
        last_name as "lastName", 
        company_name as "companyName", 
        phone, 
        role, 
        is_active as "isActive", 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM users WHERE id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    /**
     * Create a new user
     */
    async create(userData) {
        const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, company_name, phone, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id,
        email,
        first_name as "firstName",
        last_name as "lastName",
        company_name as "companyName",
        phone,
        role,
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
        const result = await database_1.default.query(query, [
            userData.email,
            userData.passwordHash,
            userData.firstName,
            userData.lastName,
            userData.companyName || null,
            userData.phone || null,
            userData.role || 'exhibitor'
        ]);
        return result.rows[0];
    }
    /**
     * Get all users (without password)
     */
    async findAll() {
        const query = `
      SELECT 
        id,
        email,
        first_name as "firstName",
        last_name as "lastName",
        company_name as "companyName",
        phone,
        role,
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users
      ORDER BY created_at DESC
    `;
        const result = await database_1.default.query(query);
        return result.rows;
    }
    /**
     * Update user active status
     */
    async updateActiveStatus(id, isActive) {
        const query = `
      UPDATE users
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
    `;
        await database_1.default.query(query, [isActive, id]);
    }
    /**
     * Update user role
     */
    async updateRole(id, role) {
        const query = `
      UPDATE users
      SET role = $1, updated_at = NOW()
      WHERE id = $2
    `;
        await database_1.default.query(query, [role, id]);
    }
}
exports.default = new UserModel();
//# sourceMappingURL=user.model.js.map