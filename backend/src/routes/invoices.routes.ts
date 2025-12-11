/**
 * Invoices Routes
 * API routes for invoice CRUD operations (Admin only)
 */

import { Router } from 'express';
import invoicesController from '../controllers/invoices.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get all invoices
router.get('/', invoicesController.getAllInvoices);

// Get invoice by ID
router.get('/:id', invoicesController.getInvoiceById);

// Update invoice
router.put('/:id', invoicesController.updateInvoice);

// Delete invoice
router.delete('/:id', invoicesController.deleteInvoice);

// Duplicate invoice
router.post('/:id/duplicate', invoicesController.duplicateInvoice);

export default router;

