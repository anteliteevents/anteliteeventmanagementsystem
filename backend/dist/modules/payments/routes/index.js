"use strict";
/**
 * Payments Module Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_service_1 = __importDefault(require("../services/payment.service"));
const auth_1 = require("../../../core/auth");
const feature_flags_1 = require("../../../core/feature-flags");
const router = (0, express_1.Router)();
/**
 * Create payment intent
 * POST /api/payments/intent
 */
router.post('/intent', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('payments')) {
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
        const paymentIntent = await payment_service_1.default.createPaymentIntent(reservationId, parseFloat(amount), currency || 'USD');
        res.json({
            success: true,
            data: paymentIntent
        });
    }
    catch (error) {
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
router.post('/confirm', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('payments')) {
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
        const transaction = await payment_service_1.default.confirmPayment(paymentIntentId);
        res.json({
            success: true,
            data: transaction
        });
    }
    catch (error) {
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
router.get('/transactions', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('payments')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Payments module is disabled' }
            });
        }
        // If admin, get all transactions; otherwise get user's transactions
        const transactions = req.user.role === 'admin'
            ? await payment_service_1.default.getAllTransactions()
            : await payment_service_1.default.getUserTransactions(req.user.id);
        res.json({
            success: true,
            data: transactions
        });
    }
    catch (error) {
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
router.get('/invoices', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('payments')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Payments module is disabled' }
            });
        }
        // If admin, get all invoices; otherwise get user's invoices
        const invoices = req.user.role === 'admin'
            ? await payment_service_1.default.getAllInvoices()
            : await payment_service_1.default.getUserInvoices(req.user.id);
        res.json({
            success: true,
            data: invoices
        });
    }
    catch (error) {
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
router.post('/refund', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('payments')) {
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
        const refund = await payment_service_1.default.processRefund(transactionId, amount ? parseFloat(amount) : undefined);
        res.json({
            success: true,
            data: refund
        });
    }
    catch (error) {
        console.error('Error processing refund:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: error.message }
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map