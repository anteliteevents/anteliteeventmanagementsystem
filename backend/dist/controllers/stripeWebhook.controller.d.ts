import { Request, Response } from 'express';
declare class StripeWebhookController {
    /**
     * Handle Stripe webhook events
     * POST /api/webhooks/stripe
     */
    handleWebhook(req: Request, res: Response): Promise<void>;
    /**
     * Handle successful payment
     */
    private handlePaymentIntentSucceeded;
    /**
     * Handle failed payment
     */
    private handlePaymentIntentFailed;
    /**
     * Handle canceled payment
     */
    private handlePaymentIntentCanceled;
}
declare const _default: StripeWebhookController;
export default _default;
//# sourceMappingURL=stripeWebhook.controller.d.ts.map