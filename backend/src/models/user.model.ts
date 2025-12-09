import pool from '../config/database';
import { User } from '../types';

class UserModel {
  /**
   * Get user by ID
   */
  async findById(id: string): Promise<User | null> {
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
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string): Promise<User | null> {
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
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Get user by ID without password
   */
  async findByIdSafe(id: string): Promise<Omit<User, 'passwordHash'> | null> {
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
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Create a new user
   */
  async create(userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    phone?: string;
    role?: string;
  }): Promise<Omit<User, 'passwordHash'>> {
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
    const result = await pool.query(query, [
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
  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
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
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Update user active status
   */
  async updateActiveStatus(id: string, isActive: boolean): Promise<void> {
    const query = `
      UPDATE users
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
    `;
    await pool.query(query, [isActive, id]);
  }

  /**
   * Update user role
   */
  async updateRole(id: string, role: string): Promise<void> {
    const query = `
      UPDATE users
      SET role = $1, updated_at = NOW()
      WHERE id = $2
    `;
    await pool.query(query, [role, id]);
  }
}

export default new UserModel();

