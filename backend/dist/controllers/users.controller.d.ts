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
    /**
     * Create a new user (admin only)
     * POST /api/users
     */
    createUser(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Update user (admin only)
     * PUT /api/users/:id
     */
    updateUser(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Delete user (admin only)
     * DELETE /api/users/:id
     */
    deleteUser(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Duplicate user (admin only)
     * POST /api/users/:id/duplicate
     */
    duplicateUser(req: AuthRequest, res: Response): Promise<void>;
}
declare const _default: UsersController;
export default _default;
//# sourceMappingURL=users.controller.d.ts.map