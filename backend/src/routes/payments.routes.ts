import { Router } from 'express';
import paymentsController from '../controllers/payments.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Payments listing for admins (or authenticated users)
router.get('/transactions', authenticate, paymentsController.listTransactions.bind(paymentsController));
router.get('/invoices', authenticate, paymentsController.listInvoices.bind(paymentsController));

export default router;

