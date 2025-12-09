import pool from '../config/database';
import { Transaction } from '../types';

class TransactionModel {
  /**
   * Create a new transaction
   */
  async create(data: {
    reservationId: string;
    amount: number;
    currency?: string;
    paymentMethod?: string;
    stripePaymentIntentId?: string;
    stripeCustomerId?: string;
    metadata?: Record<string, any>;
  }): Promise<Transaction> {
    const query = `
      INSERT INTO transactions (
        reservation_id, amount, currency, status, 
        payment_method, stripe_payment_intent_id, 
        stripe_customer_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await pool.query(query, [
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
  async findById(id: string): Promise<Transaction | null> {
    const query = 'SELECT * FROM transactions WHERE id = $1';
    const result = await pool.query(query, [id]);
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
  async findByReservationId(reservationId: string): Promise<Transaction | null> {
    const query = 'SELECT * FROM transactions WHERE reservation_id = $1 ORDER BY created_at DESC LIMIT 1';
    const result = await pool.query(query, [reservationId]);
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
  async findByStripePaymentIntentId(paymentIntentId: string): Promise<Transaction | null> {
    const query = 'SELECT * FROM transactions WHERE stripe_payment_intent_id = $1';
    const result = await pool.query(query, [paymentIntentId]);
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
  async updateStatus(id: string, status: string): Promise<Transaction> {
    const query = `
      UPDATE transactions 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
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
  async updateStripePaymentIntent(
    id: string,
    paymentIntentId: string
  ): Promise<Transaction> {
    const query = `
      UPDATE transactions 
      SET stripe_payment_intent_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [paymentIntentId, id]);
    if (result.rows[0] && result.rows[0].metadata) {
      result.rows[0].metadata = typeof result.rows[0].metadata === 'string' 
        ? JSON.parse(result.rows[0].metadata) 
        : result.rows[0].metadata;
    }
    return result.rows[0];
  }
}

export default new TransactionModel();

