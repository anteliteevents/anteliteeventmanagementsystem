/**
 * Authentication Controller
 *
 * Handles user registration, login, and authentication-related operations.
 *
 * @module controllers/auth
 */
import { Request, Response } from 'express';
declare class AuthController {
    /**
     * Register a new user
     *
     * Creates a new user account with email, password, and optional profile information.
     * Validates input, checks for existing users, hashes password, and returns JWT token.
     *
     * @route POST /api/auth/register
     * @param {Request} req - Express request object containing user registration data
     * @param {Response} res - Express response object
     * @returns {Promise<void>}
     *
     * @example
     * POST /api/auth/register
     * {
     *   "email": "user@example.com",
     *   "password": "securepassword",
     *   "firstName": "John",
     *   "lastName": "Doe"
     * }
     */
    register(req: Request, res: Response): Promise<void>;
    /**
     * Login user
     *
     * Authenticates a user with email and password, returns JWT token on success.
     * Validates credentials and returns user information along with access token.
     *
     * @route POST /api/auth/login
     * @param {Request} req - Express request object containing email and password
     * @param {Response} res - Express response object
     * @returns {Promise<void>}
     *
     * @example
     * POST /api/auth/login
     * {
     *   "email": "user@example.com",
     *   "password": "userpassword"
     * }
     */
    login(req: Request, res: Response): Promise<void>;
    /**
     * Get current user
     * GET /api/auth/me
     */
    getMe(req: any, res: Response): Promise<void>;
}
export declare const registerValidation: import("express-validator").ValidationChain[];
export declare const loginValidation: import("express-validator").ValidationChain[];
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map