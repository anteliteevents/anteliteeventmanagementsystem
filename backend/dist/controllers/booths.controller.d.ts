/**
 * Booths Controller
 * Handles booth CRUD operations
 */
import { Response } from 'express';
import { AuthRequest } from '../types';
declare class BoothsController {
    /**
     * Get all booths for an event
     * GET /api/booths?eventId=xxx
     */
    getBooths(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Get booth by ID
     * GET /api/booths/:id
     */
    getBoothById(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Create a new booth
     * POST /api/booths
     */
    createBooth(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Update a booth
     * PUT /api/booths/:id
     */
    updateBooth(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Delete a booth
     * DELETE /api/booths/:id
     */
    deleteBooth(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Duplicate a booth
     * POST /api/booths/:id/duplicate
     */
    duplicateBooth(req: AuthRequest, res: Response): Promise<void>;
}
declare const _default: BoothsController;
export default _default;
//# sourceMappingURL=booths.controller.d.ts.map