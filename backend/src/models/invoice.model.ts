import pool from '../config/database';
import { Invoice } from '../types';

class InvoiceModel {
  /**
   * Generate unique invoice number
   */
  private generateInvoiceNumber(): string {
    const prefix = 'INV';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Create a new invoice
   */
  async create(data: {
    reservationId: string;
    amount: number;
    taxAmount?: number;
    dueDate?: Date;
  }): Promise<Invoice> {
    const invoiceNumber = this.generateInvoiceNumber();
    const taxAmount = data.taxAmount || 0;
    const totalAmount = data.amount + taxAmount;

    const query = `
      INSERT INTO invoices (
        reservation_id, invoice_number, amount, tax_amount, 
        total_amount, due_date, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      data.reservationId,
      invoiceNumber,
      data.amount,
      taxAmount,
      totalAmount,
      data.dueDate || null,
      'draft',
    ]);
    return result.rows[0];
  }

  /**
   * Get invoice by ID
   */
  async findById(id: string): Promise<Invoice | null> {
    const query = 'SELECT * FROM invoices WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get invoice by reservation ID
   */
  async findByReservationId(reservationId: string): Promise<Invoice | null> {
    const query = 'SELECT * FROM invoices WHERE reservation_id = $1 ORDER BY created_at DESC LIMIT 1';
    const result = await pool.query(query, [reservationId]);
    return result.rows[0] || null;
  }

  /**
   * Get invoice by invoice number
   */
  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
    const query = 'SELECT * FROM invoices WHERE invoice_number = $1';
    const result = await pool.query(query, [invoiceNumber]);
    return result.rows[0] || null;
  }

  /**
   * Update invoice status
   */
  async updateStatus(id: string, status: string, paidAt?: Date): Promise<Invoice> {
    let query = `
      UPDATE invoices 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
    `;
    const params: any[] = [status, id];

    if (paidAt) {
      query = `
        UPDATE invoices 
        SET status = $1, paid_at = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `;
      params.splice(1, 0, paidAt);
    } else {
      query += ` WHERE id = $2 RETURNING *`;
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  /**
   * Mark invoice as sent
   */
  async markAsSent(id: string): Promise<Invoice> {
    const query = `
      UPDATE invoices 
      SET status = 'sent', issued_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Mark invoice as paid
   */
  async markAsPaid(id: string): Promise<Invoice> {
    return this.updateStatus(id, 'paid', new Date());
  }

  /**
   * Update invoice PDF URL
   */
  async updatePdfUrl(id: string, pdfUrl: string): Promise<Invoice> {
    const query = `
      UPDATE invoices 
      SET pdf_url = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [pdfUrl, id]);
    return result.rows[0];
  }
}

export default new InvoiceModel();

