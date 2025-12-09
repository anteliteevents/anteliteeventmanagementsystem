import { Request, Response } from 'express';
import stripeService from '../services/stripe.service';
import transactionModel from '../models/transaction.model';
import reservationModel from '../models/reservation.model';
import boothModel from '../models/booth.model';
import invoiceModel from '../models/invoice.model';
import userModel from '../models/user.model';
import emailService from '../services/email.service';
import { getIO } from '../config/socket.io';

class StripeWebhookController {
  /**
   * Handle Stripe webhook events
   * POST /api/webhooks/stripe
   */
  async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      res.status(400).send('No signature');
      return;
    }

    let event;

    try {
      event = stripeService.verifyWebhookSignature(
        req.body,
        sig as string
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object);
          break;

        case 'payment_intent.canceled':
          await this.handlePaymentIntentCanceled(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentIntentSucceeded(paymentIntent: any): Promise<void> {
    try {
      const transaction = await transactionModel.findByStripePaymentIntentId(
        paymentIntent.id
      );

      if (!transaction) {
        console.error(`Transaction not found for payment intent: ${paymentIntent.id}`);
        return;
      }

      // Update transaction status
      await transactionModel.updateStatus(transaction.id, 'completed');

      // Get reservation
      const reservation = await reservationModel.findById(transaction.reservationId);
      if (!reservation) {
        console.error(`Reservation not found: ${transaction.reservationId}`);
        return;
      }

      // Confirm reservation if still pending
      if (reservation.status === 'pending') {
        await reservationModel.confirm(reservation.id);
        await boothModel.book(reservation.boothId);

        // Create or update invoice
        let invoice = await invoiceModel.findByReservationId(reservation.id);
        if (!invoice) {
          invoice = await invoiceModel.create({
            reservationId: reservation.id,
            amount: transaction.amount,
            taxAmount: 0,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        }
        await invoiceModel.markAsSent(invoice.id);
        await invoiceModel.markAsPaid(invoice.id);

        // Get user and event details for email
        const [user, reservationWithDetails] = await Promise.all([
          userModel.findByIdSafe(reservation.exhibitorId),
          reservationModel.findByIdWithBooth(reservation.id),
        ]);

        // Send payment confirmation email
        if (user && reservationWithDetails) {
          try {
            await emailService.sendPaymentConfirmation(
              user.email,
              `${user.firstName} ${user.lastName}`,
              reservationWithDetails.boothNumber,
              reservationWithDetails.eventName,
              transaction.amount,
              transaction.id,
              invoice.invoiceNumber
            );
          } catch (emailError) {
            console.error('Error sending payment confirmation email:', emailError);
          }
        }

        // Emit real-time update
        const io = getIO();
        io.to(`event:${reservation.eventId}`).emit('booth-booked', {
          boothId: reservation.boothId,
          status: 'booked',
        });
      }
    } catch (error) {
      console.error('Error handling payment_intent.succeeded:', error);
      throw error;
    }
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentIntentFailed(paymentIntent: any): Promise<void> {
    try {
      const transaction = await transactionModel.findByStripePaymentIntentId(
        paymentIntent.id
      );

      if (transaction) {
        await transactionModel.updateStatus(transaction.id, 'failed');
      }
    } catch (error) {
      console.error('Error handling payment_intent.payment_failed:', error);
    }
  }

  /**
   * Handle canceled payment
   */
  private async handlePaymentIntentCanceled(paymentIntent: any): Promise<void> {
    try {
      const transaction = await transactionModel.findByStripePaymentIntentId(
        paymentIntent.id
      );

      if (transaction) {
        // Release the booth reservation
        const reservation = await reservationModel.findById(transaction.reservationId);
        if (reservation && reservation.status === 'pending') {
          await reservationModel.cancel(reservation.id);
          await boothModel.release(reservation.boothId);

          // Emit real-time update
          const io = getIO();
          io.to(`event:${reservation.eventId}`).emit('booth-released', {
            boothId: reservation.boothId,
            status: 'available',
          });
        }
      }
    } catch (error) {
      console.error('Error handling payment_intent.canceled:', error);
    }
  }
}

export default new StripeWebhookController();

