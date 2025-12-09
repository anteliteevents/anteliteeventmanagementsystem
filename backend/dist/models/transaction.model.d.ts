import { Transaction } from '../types';
declare class TransactionModel {
    /**
     * Create a new transaction
     */
    create(data: {
        reservationId: string;
        amount: number;
        currency?: string;
        paymentMethod?: string;
        stripePaymentIntentId?: string;
        stripeCustomerId?: string;
        metadata?: Record<string, any>;
    }): Promise<Transaction>;
    /**
     * Get transaction by ID
     */
    findById(id: string): Promise<Transaction | null>;
    /**
     * Get transaction by reservation ID
     */
    findByReservationId(reservationId: string): Promise<Transaction | null>;
    /**
     * Get transaction by Stripe payment intent ID
     */
    findByStripePaymentIntentId(paymentIntentId: string): Promise<Transaction | null>;
    /**
     * Update transaction status
     */
    updateStatus(id: string, status: string): Promise<Transaction>;
    /**
     * Update transaction with Stripe payment intent ID
     */
    updateStripePaymentIntent(id: string, paymentIntentId: string): Promise<Transaction>;
}
declare const _default: TransactionModel;
export default _default;
//# sourceMappingURL=transaction.model.d.ts.map