import { Response } from 'express';
import { AuthRequest } from '../types';
declare class BoothSalesController {
    /**
     * Get available booths for an event
     * GET /api/booths/available?eventId=xxx
     */
    getAvailableBooths(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Reserve a booth
     * POST /api/booths/reserve
     */
    reserveBooth(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Create payment intent for booth purchase
     * POST /api/booths/purchase
     */
    createPurchase(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Confirm payment and complete booking
     * POST /api/booths/confirm-payment
     */
    confirmPayment(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Get user's reservations
     * GET /api/booths/my-reservations
     */
    getMyReservations(req: AuthRequest, res: Response): Promise<void>;
}
declare const _default: BoothSalesController;
export default _default;
//# sourceMappingURL=boothSales.controller.d.ts.map