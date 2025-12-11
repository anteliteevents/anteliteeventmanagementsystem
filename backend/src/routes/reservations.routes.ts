/**
 * Reservations Routes
 * API routes for reservation CRUD operations (Admin only)
 */

import { Router } from 'express';
import reservationsController from '../controllers/reservations.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get all reservations
router.get('/', reservationsController.getAllReservations);

// Get reservation by ID
router.get('/:id', reservationsController.getReservationById);

// Update reservation
router.put('/:id', reservationsController.updateReservation);

// Delete reservation
router.delete('/:id', reservationsController.deleteReservation);

// Duplicate reservation
router.post('/:id/duplicate', reservationsController.duplicateReservation);

export default router;

