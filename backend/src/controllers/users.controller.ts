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
}

export default new UsersController();

