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
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    /**
     * Get user by email
     */
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
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
}
exports.default = new UserModel();
//# sourceMappingURL=user.model.js.map