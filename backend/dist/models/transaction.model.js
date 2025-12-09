"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class TransactionModel {
    /**
     * Create a new transaction
     */
    async create(data) {
        const query = `
      INSERT INTO transactions (
        reservation_id, amount, currency, status, 
        payment_method, stripe_payment_intent_id, 
        stripe_customer_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
        const result = await database_1.default.query(query, [
            data.reservationId,
            data.amount,
            data.currency || 'USD',
            'pending',
            data.paymentMethod || 'stripe',
            data.stripePaymentIntentId || null,
            data.stripeCustomerId || null,
            data.metadata ? JSON.stringify(data.metadata) : null,
        ]);
        return result.rows[0];
    }
    /**
     * Get transaction by ID
     */
    async findById(id) {
        const query = 'SELECT * FROM transactions WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        if (result.rows[0] && result.rows[0].metadata) {
            result.rows[0].metadata = typeof result.rows[0].metadata === 'string'
                ? JSON.parse(result.rows[0].metadata)
                : result.rows[0].metadata;
        }
        return result.rows[0] || null;
    }
    /**
     * Get transaction by reservation ID
     */
    async findByReservationId(reservationId) {
        const query = 'SELECT * FROM transactions WHERE reservation_id = $1 ORDER BY created_at DESC LIMIT 1';
        const result = await database_1.default.query(query, [reservationId]);
        if (result.rows[0] && result.rows[0].metadata) {
            result.rows[0].metadata = typeof result.rows[0].metadata === 'string'
                ? JSON.parse(result.rows[0].metadata)
                : result.rows[0].metadata;
        }
        return result.rows[0] || null;
    }
    /**
     * Get transaction by Stripe payment intent ID
     */
    async findByStripePaymentIntentId(paymentIntentId) {
        const query = 'SELECT * FROM transactions WHERE stripe_payment_intent_id = $1';
        const result = await database_1.default.query(query, [paymentIntentId]);
        if (result.rows[0] && result.rows[0].metadata) {
            result.rows[0].metadata = typeof result.rows[0].metadata === 'string'
                ? JSON.parse(result.rows[0].metadata)
                : result.rows[0].metadata;
        }
        return result.rows[0] || null;
    }
    /**
     * Update transaction status
     */
    async updateStatus(id, status) {
        const query = `
      UPDATE transactions 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
        const result = await database_1.default.query(query, [status, id]);
        if (result.rows[0] && result.rows[0].metadata) {
            result.rows[0].metadata = typeof result.rows[0].metadata === 'string'
                ? JSON.parse(result.rows[0].metadata)
                : result.rows[0].metadata;
        }
        return result.rows[0];
    }
    /**
     * Update transaction with Stripe payment intent ID
     */
    async updateStripePaymentIntent(id, paymentIntentId) {
        const query = `
      UPDATE transactions 
      SET stripe_payment_intent_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
        const result = await database_1.default.query(query, [paymentIntentId, id]);
        if (result.rows[0] && result.rows[0].metadata) {
            result.rows[0].metadata = typeof result.rows[0].metadata === 'string'
                ? JSON.parse(result.rows[0].metadata)
                : result.rows[0].metadata;
        }
        return result.rows[0];
    }
}
exports.default = new TransactionModel();
//# sourceMappingURL=transaction.model.js.map