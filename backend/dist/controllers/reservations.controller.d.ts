/**
 * Reservations Controller
 * Handles reservation CRUD operations (Admin only)
 */
import { Response } from 'express';
import { AuthRequest } from '../types';
declare class ReservationsController {
    /**
     * Get all reservations
     * GET /api/reservations
     */
    getAllReservations(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Get reservation by ID
     * GET /api/reservations/:id
     */
    getReservationById(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Update reservation
     * PUT /api/reservations/:id
     */
    updateReservation(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Delete reservation
     * DELETE /api/reservations/:id
     */
    deleteReservation(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Duplicate reservation
     * POST /api/reservations/:id/duplicate
     */
    duplicateReservation(req: AuthRequest, res: Response): Promise<void>;
}
declare const _default: ReservationsController;
export default _default;
//# sourceMappingURL=reservations.controller.d.ts.map