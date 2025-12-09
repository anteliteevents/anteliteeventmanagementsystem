import { Router, Request, Response } from 'express';
import stripeWebhookController from '../controllers/stripeWebhook.controller';

const router = Router();

// Stripe webhook endpoint - must use raw body
// Note: This route should be registered BEFORE express.json() middleware
// In server.ts, we'll handle this route separately with raw body parsing

/**
 * @route   POST /api/webhooks/stripe
 * @desc    Handle Stripe webhook events
 * @access  Public (verified by Stripe signature)
 */
router.post(
  '/stripe',
  // Express.raw({ type: 'application/json' }) should be applied in server.ts
  stripeWebhookController.handleWebhook.bind(stripeWebhookController)
);

export default router;

