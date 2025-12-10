/**
 * Users Controller
 * Handles user management operations
 */
import { Response } from 'express';
import { AuthRequest } from '../types';
declare class UsersController {
    /**
     * Get all users (admin only)
     */
    getAllUsers(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Get user by ID
     */
    getUserById(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Toggle user active status
     */
    toggleActive(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Update user role
     */
    updateRole(req: AuthRequest, res: Response): Promise<void>;
}
declare const _default: UsersController;
export default _default;
//# sourceMappingURL=users.controller.d.ts.map