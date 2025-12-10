import { User } from '../types';
declare class UserModel {
    /**
     * Get user by ID
     */
    findById(id: string): Promise<User | null>;
    /**
     * Get user by email
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Get user by ID without password
     */
    findByIdSafe(id: string): Promise<Omit<User, 'passwordHash'> | null>;
    /**
     * Create a new user
     */
    create(userData: {
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        companyName?: string;
        phone?: string;
        role?: string;
    }): Promise<Omit<User, 'passwordHash'>>;
    /**
     * Get all users (without password)
     */
    findAll(): Promise<Omit<User, 'passwordHash'>[]>;
    /**
     * Update user active status
     */
    updateActiveStatus(id: string, isActive: boolean): Promise<void>;
    /**
     * Update user role
     */
    updateRole(id: string, role: string): Promise<void>;
}
declare const _default: UserModel;
export default _default;
//# sourceMappingURL=user.model.d.ts.map