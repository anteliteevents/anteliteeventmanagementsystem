"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Stripe is optional for development - can be disabled
if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  STRIPE_SECRET_KEY is not defined. Payment features will be disabled.');
}
const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_test_key_here'
    ? new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
    })
    : null;
class StripeService {
    /**
     * Create a Stripe customer
     */
    async createCustomer(params) {
        if (!stripe) {
            throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.');
        }
        try {
            const customer = await stripe.customers.create({
                email: params.email,
                name: params.name,
                phone: params.phone,
                metadata: params.metadata,
            });
            return customer;
        }
        catch (error) {
            console.error('Error creating Stripe customer:', error);
            throw error;
        }
    }
    /**
     * Create a payment intent for booth purchase
     */
    async createPaymentIntent(params) {
        if (!stripe) {
            throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.');
        }
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: params.amount,
                currency: params.currency || 'usd',
                customer: params.customerId,
                metadata: params.metadata || {},
                description: params.description || 'Booth purchase',
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            return paymentIntent;
        }
        catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }
    /**
     * Retrieve a payment intent
     */
    async getPaymentIntent(paymentIntentId) {
        if (!stripe) {
            throw new Error('Stripe is not configured.');
        }
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent;
        }
        catch (error) {
            console.error('Error retrieving payment intent:', error);
            throw error;
        }
    }
    /**
     * Confirm a payment intent
     */
    async confirmPaymentIntent(paymentIntentId) {
        if (!stripe) {
            throw new Error('Stripe is not configured.');
        }
        try {
            const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
            return paymentIntent;
        }
        catch (error) {
            console.error('Error confirming payment intent:', error);
            throw error;
        }
    }
    /**
     * Cancel a payment intent
     */
    async cancelPaymentIntent(paymentIntentId) {
        if (!stripe) {
            throw new Error('Stripe is not configured.');
        }
        try {
            const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
            return paymentIntent;
        }
        catch (error) {
            console.error('Error canceling payment intent:', error);
            throw error;
        }
    }
    /**
     * Create a refund
     */
    async createRefund(paymentIntentId, amount) {
        if (!stripe) {
            throw new Error('Stripe is not configured.');
        }
        try {
            const refundParams = {
                payment_intent: paymentIntentId,
            };
            if (amount) {
                refundParams.amount = amount;
            }
            const refund = await stripe.refunds.create(refundParams);
            return refund;
        }
        catch (error) {
            console.error('Error creating refund:', error);
            throw error;
        }
    }
    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload, signature) {
        if (!stripe) {
            throw new Error('Stripe is not configured.');
        }
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
        }
        return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    }
}
exports.default = new StripeService();
//# sourceMappingURL=stripe.service.js.map