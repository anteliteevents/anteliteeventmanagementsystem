/**
 * Authentication Controller
 * 
 * Handles user registration, login, and authentication-related operations.
 * 
 * @module controllers/auth
 */

import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user.model';
import { generateToken } from '../middleware/auth.middleware';
import logger from '../config/logger';
import { AUTH_CONSTANTS } from '../config/constants';

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
  async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
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
      const existingUser = await UserModel.findByEmail(email);
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
      const passwordHash = await bcrypt.hash(password, AUTH_CONSTANTS.PASSWORD_HASH_ROUNDS);

      // Create user
      const user = await UserModel.create({
        email,
        passwordHash,
        firstName,
        lastName,
        companyName,
        phone,
        role: 'exhibitor' // Default role
      });

      // Generate token
      const token = generateToken({
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
    } catch (error: any) {
      logger.error('Registration error', { error: error.message, stack: error.stack, email: req.body.email });
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
  async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
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
      const user = await UserModel.findByEmail(email);
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
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
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
      const token = generateToken({
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
    } catch (error: any) {
      logger.error('Login error', { error: error.message, stack: error.stack, email: req.body.email });
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
  async getMe(req: any, res: Response): Promise<void> {
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

      const user = await UserModel.findByIdSafe(userId);
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
    } catch (error: any) {
      logger.error('Get me error', { error: error.message, stack: error.stack, userId: req.user?.id });
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
export const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('companyName').optional().trim(),
  body('phone').optional().trim()
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export default new AuthController();

