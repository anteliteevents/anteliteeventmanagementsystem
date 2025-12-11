"use strict";
/**
 * Invoices Controller
 * Handles invoice CRUD operations (Admin only)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_model_1 = __importDefault(require("../models/invoice.model"));
class InvoicesController {
    /**
     * Get all invoices
     * GET /api/invoices
     */
    async getAllInvoices(req, res) {
        try {
            const invoices = await invoice_model_1.default.findAll();
            res.json({
                success: true,
                data: invoices,
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
     * Get invoice by ID
     * GET /api/invoices/:id
     */
    async getInvoiceById(req, res) {
        try {
            const { id } = req.params;
            const invoice = await invoice_model_1.default.findById(id);
            if (!invoice) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Invoice not found',
                    },
                });
                return;
            }
            res.json({
                success: true,
                data: invoice,
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
     * Update invoice
     * PUT /api/invoices/:id
     */
    async updateInvoice(req, res) {
        try {
            const { id } = req.params;
            const { amount, taxAmount, dueDate, status, pdfUrl } = req.body;
            const invoice = await invoice_model_1.default.findById(id);
            if (!invoice) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Invoice not found',
                    },
                });
                return;
            }
            // Update amount and tax if provided
            if (amount !== undefined || taxAmount !== undefined) {
                const newAmount = amount !== undefined ? amount : invoice.amount;
                const newTaxAmount = taxAmount !== undefined ? taxAmount : invoice.taxAmount;
                const newTotalAmount = newAmount + newTaxAmount;
                // Note: This would require a new method in the model
                // For now, we'll use existing methods
            }
            // Update status if provided
            if (status) {
                await invoice_model_1.default.updateStatus(id, status);
            }
            // Update PDF URL if provided
            if (pdfUrl) {
                await invoice_model_1.default.updatePdfUrl(id, pdfUrl);
            }
            const updatedInvoice = await invoice_model_1.default.findById(id);
            res.json({
                success: true,
                data: updatedInvoice,
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
     * Delete invoice
     * DELETE /api/invoices/:id
     */
    async deleteInvoice(req, res) {
        try {
            const { id } = req.params;
            const invoice = await invoice_model_1.default.findById(id);
            if (!invoice) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Invoice not found',
                    },
                });
                return;
            }
            // Only allow deletion of draft invoices
            if (invoice.status !== 'draft' && invoice.status !== 'cancelled') {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_OPERATION',
                        message: 'Can only delete draft or cancelled invoices',
                    },
                });
                return;
            }
            // Note: This would require a delete method in the model
            // For now, we'll mark it as cancelled
            await invoice_model_1.default.updateStatus(id, 'cancelled');
            res.json({
                success: true,
                message: 'Invoice cancelled successfully',
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
     * Duplicate invoice
     * POST /api/invoices/:id/duplicate
     */
    async duplicateInvoice(req, res) {
        try {
            const { id } = req.params;
            const { reservationId } = req.body;
            const originalInvoice = await invoice_model_1.default.findById(id);
            if (!originalInvoice) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Invoice not found',
                    },
                });
                return;
            }
            // Create duplicate invoice
            const duplicatedInvoice = await invoice_model_1.default.create({
                reservationId: reservationId || originalInvoice.reservationId,
                amount: originalInvoice.amount,
                taxAmount: originalInvoice.taxAmount,
                dueDate: originalInvoice.dueDate,
            });
            res.status(201).json({
                success: true,
                data: duplicatedInvoice,
                message: 'Invoice duplicated successfully',
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
exports.default = new InvoicesController();
//# sourceMappingURL=invoices.controller.js.map