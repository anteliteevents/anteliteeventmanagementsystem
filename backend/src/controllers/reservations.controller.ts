/**
 * Reservations Controller
 * Handles reservation CRUD operations (Admin only)
 */

import { Response } from 'express';
import { AuthRequest } from '../types';
import reservationModel from '../models/reservation.model';
import boothModel from '../models/booth.model';

class ReservationsController {
  /**
   * Get all reservations
   * GET /api/reservations
   */
  async getAllReservations(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Note: This would require a findAll method in the model
      // For now, we'll return a message indicating this needs implementation
      res.json({
        success: true,
        data: [],
        message: 'Get all reservations - requires model implementation',
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
   * Get reservation by ID
   * GET /api/reservations/:id
   */
  async getReservationById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reservation = await reservationModel.findById(id);

      if (!reservation) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Reservation not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: reservation,
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
   * Update reservation
   * PUT /api/reservations/:id
   */
  async updateReservation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, expiresAt } = req.body;

      const reservation = await reservationModel.findById(id);
      if (!reservation) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Reservation not found',
          },
        });
        return;
      }

      // Update status if provided
      if (status) {
        await reservationModel.updateStatus(id, status);
      }

      // Note: expiresAt update would require a new method in the model

      const updatedReservation = await reservationModel.findById(id);

      res.json({
        success: true,
        data: updatedReservation,
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
   * Delete reservation
   * DELETE /api/reservations/:id
   */
  async deleteReservation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const reservation = await reservationModel.findById(id);
      if (!reservation) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Reservation not found',
          },
        });
        return;
      }

      // Cancel reservation and release booth
      await reservationModel.cancel(id);
      
      // Release the booth
      await boothModel.release(reservation.boothId);

      res.json({
        success: true,
        message: 'Reservation cancelled and booth released successfully',
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
   * Duplicate reservation
   * POST /api/reservations/:id/duplicate
   */
  async duplicateReservation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { boothId, exhibitorId, eventId } = req.body;

      const originalReservation = await reservationModel.findById(id);
      if (!originalReservation) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Reservation not found',
          },
        });
        return;
      }

      // Create duplicate reservation
      const duplicatedReservation = await reservationModel.create({
        boothId: boothId || originalReservation.boothId,
        exhibitorId: exhibitorId || originalReservation.exhibitorId,
        eventId: eventId || originalReservation.eventId,
      });

      res.status(201).json({
        success: true,
        data: duplicatedReservation,
        message: 'Reservation duplicated successfully',
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

export default new ReservationsController();

