"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class InvoiceModel {
    /**
     * Generate unique invoice number
     */
    generateInvoiceNumber() {
        const prefix = 'INV';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
    /**
     * Create a new invoice
     */
    async create(data) {
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
        const result = await database_1.default.query(query, [
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
    async findById(id) {
        const query = 'SELECT * FROM invoices WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    /**
     * Get invoice by reservation ID
     */
    async findByReservationId(reservationId) {
        const query = 'SELECT * FROM invoices WHERE reservation_id = $1 ORDER BY created_at DESC LIMIT 1';
        const result = await database_1.default.query(query, [reservationId]);
        return result.rows[0] || null;
    }
    /**
     * Get invoice by invoice number
     */
    async findByInvoiceNumber(invoiceNumber) {
        const query = 'SELECT * FROM invoices WHERE invoice_number = $1';
        const result = await database_1.default.query(query, [invoiceNumber]);
        return result.rows[0] || null;
    }
    /**
     * Update invoice status
     */
    async updateStatus(id, status, paidAt) {
        let query = `
      UPDATE invoices 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
    `;
        const params = [status, id];
        if (paidAt) {
            query = `
        UPDATE invoices 
        SET status = $1, paid_at = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `;
            params.splice(1, 0, paidAt);
        }
        else {
            query += ` WHERE id = $2 RETURNING *`;
        }
        const result = await database_1.default.query(query, params);
        return result.rows[0];
    }
    /**
     * Mark invoice as sent
     */
    async markAsSent(id) {
        const query = `
      UPDATE invoices 
      SET status = 'sent', issued_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0];
    }
    /**
     * Mark invoice as paid
     */
    async markAsPaid(id) {
        return this.updateStatus(id, 'paid', new Date());
    }
    /**
     * Update invoice PDF URL
     */
    async updatePdfUrl(id, pdfUrl) {
        const query = `
      UPDATE invoices 
      SET pdf_url = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
        const result = await database_1.default.query(query, [pdfUrl, id]);
        return result.rows[0];
    }
}
exports.default = new InvoiceModel();
//# sourceMappingURL=invoice.model.js.map