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
}
declare const _default: UserModel;
export default _default;
//# sourceMappingURL=user.model.d.ts.map