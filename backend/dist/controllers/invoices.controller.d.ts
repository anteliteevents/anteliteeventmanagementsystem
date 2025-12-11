/**
 * Invoices Controller
 * Handles invoice CRUD operations (Admin only)
 */
import { Response } from 'express';
import { AuthRequest } from '../types';
declare class InvoicesController {
    /**
     * Get all invoices
     * GET /api/invoices
     */
    getAllInvoices(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Get invoice by ID
     * GET /api/invoices/:id
     */
    getInvoiceById(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Update invoice
     * PUT /api/invoices/:id
     */
    updateInvoice(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Delete invoice
     * DELETE /api/invoices/:id
     */
    deleteInvoice(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Duplicate invoice
     * POST /api/invoices/:id/duplicate
     */
    duplicateInvoice(req: AuthRequest, res: Response): Promise<void>;
}
declare const _default: InvoicesController;
export default _default;
//# sourceMappingURL=invoices.controller.d.ts.map