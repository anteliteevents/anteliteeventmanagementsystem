"use strict";
/**
 * Booths Controller
 * Handles booth CRUD operations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booth_model_1 = __importDefault(require("../models/booth.model"));
const express_validator_1 = require("express-validator");
class BoothsController {
    /**
     * Get all booths for an event
     * GET /api/booths?eventId=xxx
     */
    async getBooths(req, res) {
        try {
            const { eventId } = req.query;
            if (!eventId) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'eventId is required',
                    },
                });
                return;
            }
            const booths = await booth_model_1.default.findByEventId(eventId);
            res.json({
                success: true,
                data: booths,
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
     * Get booth by ID
     * GET /api/booths/:id
     */
    async getBoothById(req, res) {
        try {
            const { id } = req.params;
            const booth = await booth_model_1.default.findById(id);
            if (!booth) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Booth not found',
                    },
                });
                return;
            }
            res.json({
                success: true,
                data: booth,
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
     * Create a new booth
     * POST /api/booths
     */
    async createBooth(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array(),
                    },
                });
                return;
            }
            const booth = await booth_model_1.default.create(req.body);
            res.status(201).json({
                success: true,
                data: booth,
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
     * Update a booth
     * PUT /api/booths/:id
     */
    async updateBooth(req, res) {
        try {
            const { id } = req.params;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array(),
                    },
                });
                return;
            }
            const booth = await booth_model_1.default.findById(id);
            if (!booth) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Booth not found',
                    },
                });
                return;
            }
            const updatedBooth = await booth_model_1.default.update(id, req.body);
            res.json({
                success: true,
                data: updatedBooth,
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
     * Delete a booth
     * DELETE /api/booths/:id
     */
    async deleteBooth(req, res) {
        try {
            const { id } = req.params;
            const booth = await booth_model_1.default.findById(id);
            if (!booth) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Booth not found',
                    },
                });
                return;
            }
            await booth_model_1.default.delete(id);
            res.json({
                success: true,
                message: 'Booth deleted successfully',
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
     * Duplicate a booth
     * POST /api/booths/:id/duplicate
     */
    async duplicateBooth(req, res) {
        try {
            const { id } = req.params;
            const { eventId, boothNumber } = req.body;
            const originalBooth = await booth_model_1.default.findById(id);
            if (!originalBooth) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Booth not found',
                    },
                });
                return;
            }
            // Create duplicate with new booth number
            const duplicateData = {
                eventId: eventId || originalBooth.eventId,
                boothNumber: boothNumber || `${originalBooth.boothNumber}-COPY`,
                size: originalBooth.size,
                price: originalBooth.price,
                status: 'available',
                locationX: originalBooth.locationX,
                locationY: originalBooth.locationY,
                width: originalBooth.width,
                height: originalBooth.height,
                description: originalBooth.description,
                amenities: originalBooth.amenities,
            };
            const duplicatedBooth = await booth_model_1.default.create(duplicateData);
            res.status(201).json({
                success: true,
                data: duplicatedBooth,
                message: 'Booth duplicated successfully',
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
exports.default = new BoothsController();
//# sourceMappingURL=booths.controller.js.map