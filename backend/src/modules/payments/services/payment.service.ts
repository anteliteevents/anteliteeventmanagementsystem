/**
 * Payment Service
 * Handles payment processing, Stripe integration, and transaction management
 */

import pool from '../../../config/database';
import stripeService from '../../../services/stripe.service';
import { eventBus } from '../../../core/event-bus';

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

class PaymentService {
  /**
   * Create payment intent for a reservation
   */
  async createPaymentIntent(reservationId: string, amount: number, currency: string = 'USD'): Promise<PaymentIntent> {
    try {
      // Get reservation details
      const reservationQuery = `
        SELECT r.*, b.price, u.email, u.first_name, u.last_name
        FROM reservations r
        JOIN booths b ON r.booth_id = b.id
        JOIN users u ON r.exhibitor_id = u.id
        WHERE r.id = $1
      `;
      const reservationResult = await pool.query(reservationQuery, [reservationId]);
      
      if (reservationResult.rows.length === 0) {
        throw new Error('Reservation not found');
      }

      const reservation = reservationResult.rows[0];

      // Create Stripe payment intent
      const paymentIntent = await stripeService.createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          reservationId,
          boothId: reservation.booth_id,
          eventId: reservation.event_id,
          exhibitorId: reservation.exhibitor_id,
        }
      });

      // Create transaction record
      const transactionQuery = `
        INSERT INTO transactions (
          reservation_id, amount, currency, status, 
          payment_method, stripe_payment_intent_id, created_at, updated_at
        )
        VALUES ($1, $2, $3, 'pending', 'credit_card', $4, NOW(), NOW())
        RETURNING *
      `;
      const transactionResult = await pool.query(transactionQuery, [
        reservationId,
        amount,
        currency,
        paymentIntent.id,
      ]);

      // Emit event
      await eventBus.emit('payment.initiated', {
        reservationId,
        transactionId: transactionResult.rows[0].id,
        amount,
        paymentIntentId: paymentIntent.id,
      });

      return {
        id: paymentIntent.id,
        amount,
        currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret || undefined,
      };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm payment completion
   */
  async confirmPayment(paymentIntentId: string): Promise<Transaction> {
    try {
      // Verify with Stripe
      const paymentIntent = await stripeService.getPaymentIntent(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`Payment not succeeded. Status: ${paymentIntent.status}`);
      }

      // Update transaction
      const updateQuery = `
        UPDATE transactions
        SET status = 'completed', updated_at = NOW()
        WHERE stripe_payment_intent_id = $1
        RETURNING *
      `;
      const result = await pool.query(updateQuery, [paymentIntentId]);

      if (result.rows.length === 0) {
        throw new Error('Transaction not found');
      }

      const transaction = result.rows[0];

      // Generate invoice
      await this.generateInvoice(transaction.reservation_id);

      // Emit events
      await eventBus.emit('payment.completed', {
        transactionId: transaction.id,
        reservationId: transaction.reservation_id,
        amount: transaction.amount,
      });

      return this.mapTransaction(transaction);
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      
      // Emit failure event
      await eventBus.emit('payment.failed', {
        paymentIntentId,
        error: error.message,
      });
      
      throw error;
    }
  }

  /**
   * Generate invoice for a reservation
   */
  async generateInvoice(reservationId: string): Promise<any> {
    try {
      // Check if invoice already exists
      const existingQuery = `
        SELECT * FROM invoices WHERE reservation_id = $1
      `;
      const existing = await pool.query(existingQuery, [reservationId]);

      if (existing.rows.length > 0) {
        return existing.rows[0];
      }

      // Get reservation and transaction details
      const detailsQuery = `
        SELECT 
          r.*,
          b.price,
          b.booth_number,
          e.name as event_name,
          u.first_name,
          u.last_name,
          u.email,
          t.amount,
          t.currency
        FROM reservations r
        JOIN booths b ON r.booth_id = b.id
        JOIN events e ON r.event_id = e.id
        JOIN users u ON r.exhibitor_id = u.id
        LEFT JOIN transactions t ON t.reservation_id = r.id AND t.status = 'completed'
        WHERE r.id = $1
      `;
      const details = await pool.query(detailsQuery, [reservationId]);

      if (details.rows.length === 0) {
        throw new Error('Reservation not found');
      }

      const data = details.rows[0];
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      const amount = parseFloat(data.price || data.amount || 0);
      const taxAmount = amount * 0.1; // 10% tax (configurable)
      const totalAmount = amount + taxAmount;

      // Create invoice
      const invoiceQuery = `
        INSERT INTO invoices (
          reservation_id, invoice_number, amount, tax_amount, 
          total_amount, status, due_date, issued_at, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, 'sent', NOW() + INTERVAL '30 days', NOW(), NOW(), NOW())
        RETURNING *
      `;
      const invoice = await pool.query(invoiceQuery, [
        reservationId,
        invoiceNumber,
        amount,
        taxAmount,
        totalAmount,
      ]);

      await eventBus.emit('invoice.generated', {
        invoiceId: invoice.rows[0].id,
        reservationId,
        invoiceNumber,
        totalAmount,
      });

      return invoice.rows[0];
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const query = `
      SELECT * FROM transactions WHERE id = $1
    `;
    const result = await pool.query(query, [transactionId]);
    return result.rows.length > 0 ? this.mapTransaction(result.rows[0]) : null;
  }

  /**
   * Get transactions for a user
   */
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const query = `
      SELECT t.*
      FROM transactions t
      JOIN reservations r ON t.reservation_id = r.id
      WHERE r.exhibitor_id = $1
      ORDER BY t.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => this.mapTransaction(row));
  }

  /**
   * Get invoices for a user
   */
  async getUserInvoices(userId: string): Promise<any[]> {
    const query = `
      SELECT i.*, r.booth_id, b.booth_number, e.name as event_name
      FROM invoices i
      JOIN reservations r ON i.reservation_id = r.id
      JOIN booths b ON r.booth_id = b.id
      JOIN events e ON r.event_id = e.id
      WHERE r.exhibitor_id = $1
      ORDER BY i.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get all transactions (admin only)
   */
  async getAllTransactions(): Promise<Transaction[]> {
    const query = `
      SELECT t.*, r.exhibitor_id
      FROM transactions t
      JOIN reservations r ON t.reservation_id = r.id
      ORDER BY t.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(row => this.mapTransaction(row));
  }

  /**
   * Get all invoices (admin only)
   */
  async getAllInvoices(): Promise<any[]> {
    const query = `
      SELECT i.*, r.booth_id, b.booth_number, e.name as event_name, r.exhibitor_id
      FROM invoices i
      JOIN reservations r ON i.reservation_id = r.id
      JOIN booths b ON r.booth_id = b.id
      JOIN events e ON r.event_id = e.id
      ORDER BY i.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Process refund
   */
  async processRefund(transactionId: string, amount?: number): Promise<any> {
    try {
      const transaction = await this.getTransaction(transactionId);
      if (!transaction || !transaction.stripePaymentIntentId) {
        throw new Error('Transaction not found or no Stripe payment intent');
      }

      const refund = await stripeService.createRefund(
        transaction.stripePaymentIntentId,
        amount ? Math.round(amount * 100) : undefined
      );

      // Update transaction status
      const updateQuery = `
        UPDATE transactions
        SET status = 'refunded', updated_at = NOW()
        WHERE id = $1
      `;
      await pool.query(updateQuery, [transactionId]);

      await eventBus.emit('payment.refunded', {
        transactionId,
        refundId: refund.id,
        amount: refund.amount / 100,
      });

      return refund;
    } catch (error: any) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Map database row to Transaction object
   */
  private mapTransaction(row: any): Transaction {
    return {
      id: row.id,
      reservationId: row.reservation_id,
      amount: parseFloat(row.amount),
      currency: row.currency,
      status: row.status,
      paymentMethod: row.payment_method,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default new PaymentService();

