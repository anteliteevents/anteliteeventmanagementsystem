"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventValidation = exports.createEventValidation = void 0;
const express_validator_1 = require("express-validator");
const event_model_1 = __importDefault(require("../models/event.model"));
class EventController {
    /**
     * Get all events with optional filters
     * GET /api/events
     */
    async getAllEvents(req, res) {
        try {
            const filters = {};
            if (req.query.status) {
                filters.status = req.query.status;
            }
            if (req.query.startDate) {
                filters.startDate = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filters.endDate = new Date(req.query.endDate);
            }
            if (req.query.search) {
                filters.search = req.query.search;
            }
            const events = await event_model_1.default.findAll(filters);
            res.json({
                success: true,
                data: events,
                count: events.length
            });
        }
        catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch events'
                }
            });
        }
    }
    /**
     * Get active/published events only
     * GET /api/events/active
     */
    async getActiveEvents(req, res) {
        try {
            const events = await event_model_1.default.findActive();
            res.json({
                success: true,
                data: events,
                count: events.length
            });
        }
        catch (error) {
            console.error('Error fetching active events:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch active events'
                }
            });
        }
    }
    /**
     * Get event by ID
     * GET /api/events/:id
     */
    async getEventById(req, res) {
        try {
            const { id } = req.params;
            const event = await event_model_1.default.findById(id);
            if (!event) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Event not found'
                    }
                });
                return;
            }
            res.json({
                success: true,
                data: event
            });
        }
        catch (error) {
            console.error('Error fetching event:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch event'
                }
            });
        }
    }
    /**
     * Create a new event
     * POST /api/events
     */
    async createEvent(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
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
            const { name, description, startDate, endDate, venue, status } = req.body;
            // Validate dates
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid date format'
                    }
                });
                return;
            }
            if (start >= end) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'End date must be after start date'
                    }
                });
                return;
            }
            const event = await event_model_1.default.create({
                name,
                description,
                startDate: start,
                endDate: end,
                venue,
                status: status || 'draft'
            });
            res.status(201).json({
                success: true,
                data: event,
                message: 'Event created successfully'
            });
        }
        catch (error) {
            console.error('Error creating event:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to create event'
                }
            });
        }
    }
    /**
     * Update an event
     * PUT /api/events/:id
     */
    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const { name, description, startDate, endDate, venue, status } = req.body;
            // Check if event exists
            const existingEvent = await event_model_1.default.findById(id);
            if (!existingEvent) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Event not found'
                    }
                });
                return;
            }
            // Validate dates if provided
            let start;
            let end;
            if (startDate) {
                start = new Date(startDate);
                if (isNaN(start.getTime())) {
                    res.status(400).json({
                        success: false,
                        error: {
                            code: 'VALIDATION_ERROR',
                            message: 'Invalid start date format'
                        }
                    });
                    return;
                }
            }
            if (endDate) {
                end = new Date(endDate);
                if (isNaN(end.getTime())) {
                    res.status(400).json({
                        success: false,
                        error: {
                            code: 'VALIDATION_ERROR',
                            message: 'Invalid end date format'
                        }
                    });
                    return;
                }
            }
            // Validate date range if both provided
            if (start && end && start >= end) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'End date must be after start date'
                    }
                });
                return;
            }
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (description !== undefined)
                updateData.description = description;
            if (start !== undefined)
                updateData.startDate = start;
            if (end !== undefined)
                updateData.endDate = end;
            if (venue !== undefined)
                updateData.venue = venue;
            if (status !== undefined)
                updateData.status = status;
            const event = await event_model_1.default.update(id, updateData);
            res.json({
                success: true,
                data: event,
                message: 'Event updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating event:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to update event'
                }
            });
        }
    }
    /**
     * Duplicate an event
     * POST /api/events/:id/duplicate
     */
    async duplicateEvent(req, res) {
        try {
            const { id } = req.params;
            const { name, startDate, endDate } = req.body;
            const originalEvent = await event_model_1.default.findById(id);
            if (!originalEvent) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Event not found'
                    }
                });
                return;
            }
            // Create duplicate with new name and dates if provided
            const duplicateData = {
                name: name || `${originalEvent.name} (Copy)`,
                description: originalEvent.description,
                startDate: startDate ? new Date(startDate) : new Date(originalEvent.startDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
                endDate: endDate ? new Date(endDate) : new Date(originalEvent.endDate.getTime() + 30 * 24 * 60 * 60 * 1000),
                venue: originalEvent.venue,
                status: 'draft',
            };
            const duplicatedEvent = await event_model_1.default.create(duplicateData);
            res.status(201).json({
                success: true,
                data: duplicatedEvent,
                message: 'Event duplicated successfully'
            });
        }
        catch (error) {
            console.error('Error duplicating event:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Failed to duplicate event'
                }
            });
        }
    }
    /**
     * Delete an event
     * DELETE /api/events/:id
     */
    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            // Check if event exists
            const existingEvent = await event_model_1.default.findById(id);
            if (!existingEvent) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Event not found'
                    }
                });
                return;
            }
            const deleted = await event_model_1.default.delete(id);
            if (!deleted) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: 'Failed to delete event'
                    }
                });
                return;
            }
            res.json({
                success: true,
                message: 'Event deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting event:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to delete event'
                }
            });
        }
    }
    /**
     * Get event statistics
     * GET /api/events/:id/statistics
     */
    async getEventStatistics(req, res) {
        try {
            const { id } = req.params;
            const event = await event_model_1.default.findById(id);
            if (!event) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Event not found'
                    }
                });
                return;
            }
            const statistics = await event_model_1.default.getStatistics(id);
            res.json({
                success: true,
                data: {
                    event: {
                        id: event.id,
                        name: event.name,
                        status: event.status
                    },
                    statistics
                }
            });
        }
        catch (error) {
            console.error('Error fetching event statistics:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch event statistics'
                }
            });
        }
    }
}
// Validation rules
exports.createEventValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Event name is required'),
    (0, express_validator_1.body)('startDate').isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('endDate').isISO8601().withMessage('Valid end date is required'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('venue').optional().isString(),
    (0, express_validator_1.body)('status').optional().isIn(['draft', 'published', 'active', 'completed', 'cancelled'])
];
exports.updateEventValidation = [
    (0, express_validator_1.body)('name').optional().trim().notEmpty(),
    (0, express_validator_1.body)('startDate').optional().isISO8601(),
    (0, express_validator_1.body)('endDate').optional().isISO8601(),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('venue').optional().isString(),
    (0, express_validator_1.body)('status').optional().isIn(['draft', 'published', 'active', 'completed', 'cancelled'])
];
exports.default = new EventController();
//# sourceMappingURL=event.controller.js.map