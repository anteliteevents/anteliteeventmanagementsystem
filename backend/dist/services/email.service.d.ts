interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
declare class EmailService {
    private transporter;
    constructor();
    /**
     * Send email
     */
    sendEmail(options: EmailOptions): Promise<void>;
    /**
     * Send booth reservation confirmation email
     */
    sendReservationConfirmation(email: string, exhibitorName: string, boothNumber: string, eventName: string, amount: number, reservationId: string): Promise<void>;
    /**
     * Send payment confirmation email
     */
    sendPaymentConfirmation(email: string, exhibitorName: string, boothNumber: string, eventName: string, amount: number, transactionId: string, invoiceNumber?: string): Promise<void>;
    /**
     * Send invoice email
     */
    sendInvoice(email: string, exhibitorName: string, invoiceNumber: string, amount: number, dueDate: string, invoiceUrl?: string): Promise<void>;
    /**
     * Send reservation cancellation email
     */
    sendReservationCancellation(email: string, exhibitorName: string, boothNumber: string, eventName: string, refundAmount?: number): Promise<void>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=email.service.d.ts.map