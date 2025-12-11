"use strict";
/**
 * Authentication Controller
 *
 * Handles user registration, login, and authentication-related operations.
 *
 * @module controllers/auth
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const logger_1 = __importDefault(require("../config/logger"));
const constants_1 = require("../config/constants");
class AuthController {
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
    async register(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array()
                    }
                });
                return;
            }
            const { email, password, firstName, lastName, companyName, phone } = req.body;
            // Check if user already exists
            const existingUser = await user_model_1.default.findByEmail(email);
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'USER_EXISTS',
                        message: 'User with this email already exists'
                    }
                });
                return;
            }
            // Hash password
            const passwordHash = await bcryptjs_1.default.hash(password, constants_1.AUTH_CONSTANTS.PASSWORD_HASH_ROUNDS);
            // Create user
            const user = await user_model_1.default.create({
                email,
                passwordHash,
                firstName,
                lastName,
                companyName,
                phone,
                role: 'exhibitor' // Default role
            });
            // Generate token
            const token = (0, auth_middleware_1.generateToken)({
                id: user.id,
                email: user.email,
                role: user.role
            });
            res.status(201).json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        companyName: user.companyName,
                        phone: user.phone,
                        role: user.role
                    }
                },
                message: 'User registered successfully'
            });
        }
        catch (error) {
            logger_1.default.error('Registration error', { error: error.message, stack: error.stack, email: req.body.email });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to register user'
                }
            });
        }
    }
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
    async login(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array()
                    }
                });
                return;
            }
            const { email, password } = req.body;
            // Find user
            const user = await user_model_1.default.findByEmail(email);
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid email or password'
                    }
                });
                return;
            }
            // Check if user is active
            if (!user.isActive) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: 'ACCOUNT_INACTIVE',
                        message: 'Account is inactive'
                    }
                });
                return;
            }
            // Verify password
            const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid email or password'
                    }
                });
                return;
            }
            // Generate token
            const token = (0, auth_middleware_1.generateToken)({
                id: user.id,
                email: user.email,
                role: user.role
            });
            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        companyName: user.companyName,
                        phone: user.phone,
                        role: user.role
                    }
                },
                message: 'Login successful'
            });
        }
        catch (error) {
            logger_1.default.error('Login error', { error: error.message, stack: error.stack, email: req.body.email });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to login'
                }
            });
        }
    }
    /**
     * Get current user
     * GET /api/auth/me
     */
    async getMe(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Not authenticated'
                    }
                });
                return;
            }
            const user = await user_model_1.default.findByIdSafe(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'User not found'
                    }
                });
                return;
            }
            res.json({
                success: true,
                data: user
            });
        }
        catch (error) {
            logger_1.default.error('Get me error', { error: error.message, stack: error.stack, userId: req.user?.id });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to get user'
                }
            });
        }
    }
}
// Validation rules
exports.registerValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('companyName').optional().trim(),
    (0, express_validator_1.body)('phone').optional().trim()
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
];
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map