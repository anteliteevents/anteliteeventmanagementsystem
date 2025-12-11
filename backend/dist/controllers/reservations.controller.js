"use strict";
/**
 * Reservations Controller
 * Handles reservation CRUD operations (Admin only)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reservation_model_1 = __importDefault(require("../models/reservation.model"));
const booth_model_1 = __importDefault(require("../models/booth.model"));
class ReservationsController {
    /**
     * Get all reservations
     * GET /api/reservations
     */
    async getAllReservations(req, res) {
        try {
            // Note: This would require a findAll method in the model
            // For now, we'll return a message indicating this needs implementation
            res.json({
                success: true,
                data: [],
                message: 'Get all reservations - requires model implementation',
            });
        }
        catch (error) {
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
    async getReservationById(req, res) {
        try {
            const { id } = req.params;
            const reservation = await reservation_model_1.default.findById(id);
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
        }
        catch (error) {
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
    async updateReservation(req, res) {
        try {
            const { id } = req.params;
            const { status, expiresAt } = req.body;
            const reservation = await reservation_model_1.default.findById(id);
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
                await reservation_model_1.default.updateStatus(id, status);
            }
            // Note: expiresAt update would require a new method in the model
            const updatedReservation = await reservation_model_1.default.findById(id);
            res.json({
                success: true,
                data: updatedReservation,
            });
        }
        catch (error) {
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
    async deleteReservation(req, res) {
        try {
            const { id } = req.params;
            const reservation = await reservation_model_1.default.findById(id);
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
            await reservation_model_1.default.cancel(id);
            // Release the booth
            await booth_model_1.default.release(reservation.boothId);
            res.json({
                success: true,
                message: 'Reservation cancelled and booth released successfully',
            });
        }
        catch (error) {
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
    async duplicateReservation(req, res) {
        try {
            const { id } = req.params;
            const { boothId, exhibitorId, eventId } = req.body;
            const originalReservation = await reservation_model_1.default.findById(id);
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
            const duplicatedReservation = await reservation_model_1.default.create({
                boothId: boothId || originalReservation.boothId,
                exhibitorId: exhibitorId || originalReservation.exhibitorId,
                eventId: eventId || originalReservation.eventId,
            });
            res.status(201).json({
                success: true,
                data: duplicatedReservation,
                message: 'Reservation duplicated successfully',
            });
        }
        catch (error) {
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
exports.default = new ReservationsController();
//# sourceMappingURL=reservations.controller.js.map