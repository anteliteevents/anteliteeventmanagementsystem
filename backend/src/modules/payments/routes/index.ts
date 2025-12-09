/**
 * Payments Module Routes
 */

import { Router, Request, Response } from 'express';
import paymentService from '../services/payment.service';
import { authenticate } from '../../../core/auth';
import { featureFlags } from '../../../core/feature-flags';

const router = Router();

/**
 * Create payment intent
 * POST /api/payments/intent
 */
router.post('/intent', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('payments')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Payments module is disabled' }
      });
    }

    const { reservationId, amount, currency } = req.body;

    if (!reservationId || !amount) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'reservationId and amount are required' }
      });
    }

    const paymentIntent = await paymentService.createPaymentIntent(
      reservationId,
      parseFloat(amount),
      currency || 'USD'
    );

    res.json({
      success: true,
      data: paymentIntent
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Confirm payment
 * POST /api/payments/confirm
 */
router.post('/confirm', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('payments')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Payments module is disabled' }
      });
    }

    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'paymentIntentId is required' }
      });
    }

    const transaction = await paymentService.confirmPayment(paymentIntentId);

    res.json({
      success: true,
      data: transaction
    });
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get user transactions (all transactions for admin)
 * GET /api/payments/transactions
 */
router.get('/transactions', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('payments')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Payments module is disabled' }
      });
    }

    // If admin, get all transactions; otherwise get user's transactions
    const transactions = req.user.role === 'admin' 
      ? await paymentService.getAllTransactions()
      : await paymentService.getUserTransactions(req.user.id);

    res.json({
      success: true,
      data: transactions
    });
  } catch (error: any) {
    console.error('Error getting transactions:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get user invoices (all invoices for admin)
 * GET /api/payments/invoices
 */
router.get('/invoices', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('payments')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Payments module is disabled' }
      });
    }

    // If admin, get all invoices; otherwise get user's invoices
    const invoices = req.user.role === 'admin'
      ? await paymentService.getAllInvoices()
      : await paymentService.getUserInvoices(req.user.id);

    res.json({
      success: true,
      data: invoices
    });
  } catch (error: any) {
    console.error('Error getting invoices:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Process refund (Admin only)
 * POST /api/payments/refund
 */
router.post('/refund', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('payments')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Payments module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const { transactionId, amount } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'transactionId is required' }
      });
    }

    const refund = await paymentService.processRefund(
      transactionId,
      amount ? parseFloat(amount) : undefined
    );

    res.json({
      success: true,
      data: refund
    });
  } catch (error: any) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

export default router;

