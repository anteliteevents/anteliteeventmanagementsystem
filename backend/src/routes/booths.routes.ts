/**
 * Booths Routes
 * API routes for booth CRUD operations
 */

import { Router } from 'express';
import boothsController from '../controllers/booths.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const createBoothValidation = [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('boothNumber').notEmpty().withMessage('Booth number is required'),
  body('size').isIn(['small', 'medium', 'large', 'xlarge']).withMessage('Invalid size'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

const updateBoothValidation = [
  body('boothNumber').optional().notEmpty().withMessage('Booth number cannot be empty'),
  body('size').optional().isIn(['small', 'medium', 'large', 'xlarge']).withMessage('Invalid size'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('status').optional().isIn(['available', 'reserved', 'booked', 'unavailable']).withMessage('Invalid status'),
];

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get all booths for an event
router.get('/', boothsController.getBooths);

// Get booth by ID
router.get('/:id', boothsController.getBoothById);

// Create a new booth
router.post('/', createBoothValidation, boothsController.createBooth);

// Update a booth
router.put('/:id', updateBoothValidation, boothsController.updateBooth);

// Delete a booth
router.delete('/:id', boothsController.deleteBooth);

// Duplicate a booth
router.post('/:id/duplicate', boothsController.duplicateBooth);

export default router;

