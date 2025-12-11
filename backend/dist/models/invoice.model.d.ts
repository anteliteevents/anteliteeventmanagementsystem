import { Invoice } from '../types';
declare class InvoiceModel {
    /**
     * Generate unique invoice number
     */
    private generateInvoiceNumber;
    /**
     * Create a new invoice
     */
    create(data: {
        reservationId: string;
        amount: number;
        taxAmount?: number;
        dueDate?: Date;
    }): Promise<Invoice>;
    /**
     * Get invoice by ID
     */
    findById(id: string): Promise<Invoice | null>;
    /**
     * Get invoice by reservation ID
     */
    findByReservationId(reservationId: string): Promise<Invoice | null>;
    /**
     * Get invoice by invoice number
     */
    findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null>;
    /**
     * Update invoice status
     */
    updateStatus(id: string, status: string, paidAt?: Date): Promise<Invoice>;
    /**
     * Mark invoice as sent
     */
    markAsSent(id: string): Promise<Invoice>;
    /**
     * Mark invoice as paid
     */
    markAsPaid(id: string): Promise<Invoice>;
    /**
     * Update invoice PDF URL
     */
    updatePdfUrl(id: string, pdfUrl: string): Promise<Invoice>;
    /**
     * Get all invoices (most recent first)
     */
    findAll(): Promise<Invoice[]>;
}
declare const _default: InvoiceModel;
export default _default;
//# sourceMappingURL=invoice.model.d.ts.map