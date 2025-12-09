/**
 * Users Routes
 * API routes for user management
 */

import { Router } from 'express';
import usersController from '../controllers/users.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get all users
router.get('/', usersController.getAllUsers);

// Get user by ID
router.get('/:id', usersController.getUserById);

// Toggle user active status
router.put('/:id/toggle-active', usersController.toggleActive);

// Update user role
router.put('/:id/role', usersController.updateRole);

export default router;

