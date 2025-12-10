import { Request, Response } from 'express';
declare class EventController {
    /**
     * Get all events with optional filters
     * GET /api/events
     */
    getAllEvents(req: Request, res: Response): Promise<void>;
    /**
     * Get active/published events only
     * GET /api/events/active
     */
    getActiveEvents(req: Request, res: Response): Promise<void>;
    /**
     * Get event by ID
     * GET /api/events/:id
     */
    getEventById(req: Request, res: Response): Promise<void>;
    /**
     * Create a new event
     * POST /api/events
     */
    createEvent(req: Request, res: Response): Promise<void>;
    /**
     * Update an event
     * PUT /api/events/:id
     */
    updateEvent(req: Request, res: Response): Promise<void>;
    /**
     * Duplicate an event
     * POST /api/events/:id/duplicate
     */
    duplicateEvent(req: Request, res: Response): Promise<void>;
    /**
     * Delete an event
     * DELETE /api/events/:id
     */
    deleteEvent(req: Request, res: Response): Promise<void>;
    /**
     * Get event statistics
     * GET /api/events/:id/statistics
     */
    getEventStatistics(req: Request, res: Response): Promise<void>;
}
export declare const createEventValidation: import("express-validator").ValidationChain[];
export declare const updateEventValidation: import("express-validator").ValidationChain[];
declare const _default: EventController;
export default _default;
//# sourceMappingURL=event.controller.d.ts.map