/**
 * Payment Service
 * Handles payment processing, Stripe integration, and transaction management
 */
interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    clientSecret?: string;
}
interface Transaction {
    id: string;
    reservationId: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    stripePaymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare class PaymentService {
    /**
     * Create payment intent for a reservation
     */
    createPaymentIntent(reservationId: string, amount: number, currency?: string): Promise<PaymentIntent>;
    /**
     * Confirm payment completion
     */
    confirmPayment(paymentIntentId: string): Promise<Transaction>;
    /**
     * Generate invoice for a reservation
     */
    generateInvoice(reservationId: string): Promise<any>;
    /**
     * Get transaction by ID
     */
    getTransaction(transactionId: string): Promise<Transaction | null>;
    /**
     * Get transactions for a user
     */
    getUserTransactions(userId: string): Promise<Transaction[]>;
    /**
     * Get invoices for a user
     */
    getUserInvoices(userId: string): Promise<any[]>;
    /**
     * Get all transactions (admin only)
     */
    getAllTransactions(): Promise<Transaction[]>;
    /**
     * Get all invoices (admin only)
     */
    getAllInvoices(): Promise<any[]>;
    /**
     * Process refund
     */
    processRefund(transactionId: string, amount?: number): Promise<any>;
    /**
     * Map database row to Transaction object
     */
    private mapTransaction;
}
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=payment.service.d.ts.map