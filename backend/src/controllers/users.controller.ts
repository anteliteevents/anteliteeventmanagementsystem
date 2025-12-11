/**
 * Users Controller
 * Handles user management operations
 */

import { Response } from 'express';
import { AuthRequest } from '../types';
import userModel from '../models/user.model';

class UsersController {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await userModel.findAll();
      res.json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Toggle user active status
   */
  async toggleActive(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const user = await userModel.findById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      await userModel.updateActiveStatus(id, isActive);

      res.json({
        success: true,
        data: {
          id,
          isActive,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Update user role
   */
  async updateRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['admin', 'exhibitor'].includes(role)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Role must be either "admin" or "exhibitor"',
          },
        });
        return;
      }

      const user = await userModel.findById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      await userModel.updateRole(id, role);

      res.json({
        success: true,
        data: {
          id,
          role,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Create a new user (admin only)
   * POST /api/users
   */
  async createUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, companyName, phone, role } = req.body;

      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'email, password, firstName, and lastName are required',
          },
        });
        return;
      }

      // Check if user already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_EMAIL',
            message: 'User with this email already exists',
          },
        });
        return;
      }

      const user = await userModel.create({
        email,
        passwordHash: password, // Note: In production, hash the password first
        firstName,
        lastName,
        companyName,
        phone,
        role: role || 'exhibitor',
      });

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Update user (admin only)
   * PUT /api/users/:id
   */
  async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { firstName, lastName, companyName, phone, email } = req.body;

      const user = await userModel.findById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
          res.status(409).json({
            success: false,
            error: {
              code: 'DUPLICATE_EMAIL',
              message: 'Email already in use',
            },
          });
          return;
        }
      }

      await userModel.update(id, {
        firstName,
        lastName,
        companyName,
        phone,
        email,
      });

      const updatedUser = await userModel.findByIdSafe(id);

      res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Delete user (admin only)
   * DELETE /api/users/:id
   */
  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      await userModel.delete(id);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Duplicate user (admin only)
   * POST /api/users/:id/duplicate
   */
  async duplicateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, firstName, lastName } = req.body;

      const originalUser = await userModel.findByIdSafe(id);
      if (!originalUser) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      // Generate new email if not provided
      const newEmail = email || `${originalUser.email.split('@')[0]}_copy@${originalUser.email.split('@')[1]}`;

      // Check if new email already exists
      const existingUser = await userModel.findByEmail(newEmail);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_EMAIL',
            message: 'User with this email already exists',
          },
        });
        return;
      }

      // Create duplicate user (without password - admin must set it)
      const duplicatedUser = await userModel.create({
        email: newEmail,
        passwordHash: 'TEMP_PASSWORD_MUST_BE_CHANGED', // Admin must set password
        firstName: firstName || originalUser.firstName,
        lastName: lastName || originalUser.lastName,
        companyName: originalUser.companyName,
        phone: originalUser.phone,
        role: originalUser.role,
      });

      res.status(201).json({
        success: true,
        data: duplicatedUser,
        message: 'User duplicated successfully. Please set a password for the new user.',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }
}

export default new UsersController();

