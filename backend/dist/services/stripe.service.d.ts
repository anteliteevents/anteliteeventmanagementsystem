import Stripe from 'stripe';
export interface CreatePaymentIntentParams {
    amount: number;
    currency?: string;
    customerId?: string;
    metadata?: Record<string, string>;
    description?: string;
}
export interface CreateCustomerParams {
    email: string;
    name: string;
    phone?: string;
    metadata?: Record<string, string>;
}
declare class StripeService {
    /**
     * Create a Stripe customer
     */
    createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer>;
    /**
     * Create a payment intent for booth purchase
     */
    createPaymentIntent(params: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent>;
    /**
     * Retrieve a payment intent
     */
    getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    /**
     * Confirm a payment intent
     */
    confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    /**
     * Cancel a payment intent
     */
    cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    /**
     * Create a refund
     */
    createRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund>;
    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload: string | Buffer, signature: string): Stripe.Event;
}
declare const _default: StripeService;
export default _default;
//# sourceMappingURL=stripe.service.d.ts.map