import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    // Configure email transporter
    // Supports SMTP, Gmail, SendGrid, etc.
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /**
   * Send email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send booth reservation confirmation email
   */
  async sendReservationConfirmation(
    email: string,
    exhibitorName: string,
    boothNumber: string,
    eventName: string,
    amount: number,
    reservationId: string
  ): Promise<void> {
    const subject = `Booth Reservation Confirmed - ${boothNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booth Reservation Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear ${exhibitorName},</p>
            <p>Your booth reservation has been confirmed!</p>
            <div class="details">
              <h3>Reservation Details</h3>
              <p><strong>Event:</strong> ${eventName}</p>
              <p><strong>Booth Number:</strong> ${boothNumber}</p>
              <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
              <p><strong>Reservation ID:</strong> ${reservationId}</p>
            </div>
            <p>Please complete your payment to finalize your booking. You will receive a payment confirmation email once your payment is processed.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>Ant Elite Events System</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: email, subject, html });
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(
    email: string,
    exhibitorName: string,
    boothNumber: string,
    eventName: string,
    amount: number,
    transactionId: string,
    invoiceNumber?: string
  ): Promise<void> {
    const subject = `Payment Confirmed - Booth ${boothNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear ${exhibitorName},</p>
            <p>Your payment has been successfully processed!</p>
            <div class="details">
              <h3>Payment Details</h3>
              <p><strong>Event:</strong> ${eventName}</p>
              <p><strong>Booth Number:</strong> ${boothNumber}</p>
              <p><strong>Amount Paid:</strong> $${amount.toFixed(2)}</p>
              <p><strong>Transaction ID:</strong> ${transactionId}</p>
              ${invoiceNumber ? `<p><strong>Invoice Number:</strong> ${invoiceNumber}</p>` : ''}
            </div>
            <p>Your booth booking is now confirmed. We look forward to seeing you at the event!</p>
            ${invoiceNumber ? `<p>Your invoice is attached to this email.</p>` : ''}
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>Ant Elite Events System</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: email, subject, html });
  }

  /**
   * Send invoice email
   */
  async sendInvoice(
    email: string,
    exhibitorName: string,
    invoiceNumber: string,
    amount: number,
    dueDate: string,
    invoiceUrl?: string
  ): Promise<void> {
    const subject = `Invoice ${invoiceNumber} - Payment Required`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice ${invoiceNumber}</h1>
          </div>
          <div class="content">
            <p>Dear ${exhibitorName},</p>
            <p>Please find your invoice details below:</p>
            <div class="details">
              <h3>Invoice Information</h3>
              <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
              <p><strong>Amount Due:</strong> $${amount.toFixed(2)}</p>
              <p><strong>Due Date:</strong> ${dueDate}</p>
            </div>
            ${invoiceUrl ? `<a href="${invoiceUrl}" class="button">View Invoice</a>` : ''}
            <p>Please complete your payment by the due date to avoid any delays.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>Ant Elite Events System</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: email, subject, html });
  }

  /**
   * Send reservation cancellation email
   */
  async sendReservationCancellation(
    email: string,
    exhibitorName: string,
    boothNumber: string,
    eventName: string,
    refundAmount?: number
  ): Promise<void> {
    const subject = `Reservation Cancelled - Booth ${boothNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reservation Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear ${exhibitorName},</p>
            <p>Your booth reservation has been cancelled.</p>
            <div class="details">
              <h3>Cancellation Details</h3>
              <p><strong>Event:</strong> ${eventName}</p>
              <p><strong>Booth Number:</strong> ${boothNumber}</p>
              ${refundAmount ? `<p><strong>Refund Amount:</strong> $${refundAmount.toFixed(2)}</p>
              <p>Your refund will be processed within 5-10 business days.</p>` : ''}
            </div>
            <p>If you have any questions or would like to make a new reservation, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>Ant Elite Events System</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: email, subject, html });
  }
}

export default new EmailService();

