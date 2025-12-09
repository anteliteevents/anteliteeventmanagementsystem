"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_service_1 = __importDefault(require("../services/stripe.service"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const reservation_model_1 = __importDefault(require("../models/reservation.model"));
const booth_model_1 = __importDefault(require("../models/booth.model"));
const invoice_model_1 = __importDefault(require("../models/invoice.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const email_service_1 = __importDefault(require("../services/email.service"));
const socket_io_1 = require("../config/socket.io");
class StripeWebhookController {
    /**
     * Handle Stripe webhook events
     * POST /api/webhooks/stripe
     */
    async handleWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        if (!sig) {
            res.status(400).send('No signature');
            return;
        }
        let event;
        try {
            event = stripe_service_1.default.verifyWebhookSignature(req.body, sig);
        }
        catch (err) {
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
        }
        catch (error) {
            console.error('Error handling webhook:', error);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Handle successful payment
     */
    async handlePaymentIntentSucceeded(paymentIntent) {
        try {
            const transaction = await transaction_model_1.default.findByStripePaymentIntentId(paymentIntent.id);
            if (!transaction) {
                console.error(`Transaction not found for payment intent: ${paymentIntent.id}`);
                return;
            }
            // Update transaction status
            await transaction_model_1.default.updateStatus(transaction.id, 'completed');
            // Get reservation
            const reservation = await reservation_model_1.default.findById(transaction.reservationId);
            if (!reservation) {
                console.error(`Reservation not found: ${transaction.reservationId}`);
                return;
            }
            // Confirm reservation if still pending
            if (reservation.status === 'pending') {
                await reservation_model_1.default.confirm(reservation.id);
                await booth_model_1.default.book(reservation.boothId);
                // Create or update invoice
                let invoice = await invoice_model_1.default.findByReservationId(reservation.id);
                if (!invoice) {
                    invoice = await invoice_model_1.default.create({
                        reservationId: reservation.id,
                        amount: transaction.amount,
                        taxAmount: 0,
                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    });
                }
                await invoice_model_1.default.markAsSent(invoice.id);
                await invoice_model_1.default.markAsPaid(invoice.id);
                // Get user and event details for email
                const [user, reservationWithDetails] = await Promise.all([
                    user_model_1.default.findByIdSafe(reservation.exhibitorId),
                    reservation_model_1.default.findByIdWithBooth(reservation.id),
                ]);
                // Send payment confirmation email
                if (user && reservationWithDetails) {
                    try {
                        await email_service_1.default.sendPaymentConfirmation(user.email, `${user.firstName} ${user.lastName}`, reservationWithDetails.boothNumber, reservationWithDetails.eventName, transaction.amount, transaction.id, invoice.invoiceNumber);
                    }
                    catch (emailError) {
                        console.error('Error sending payment confirmation email:', emailError);
                    }
                }
                // Emit real-time update
                const io = (0, socket_io_1.getIO)();
                io.to(`event:${reservation.eventId}`).emit('booth-booked', {
                    boothId: reservation.boothId,
                    status: 'booked',
                });
            }
        }
        catch (error) {
            console.error('Error handling payment_intent.succeeded:', error);
            throw error;
        }
    }
    /**
     * Handle failed payment
     */
    async handlePaymentIntentFailed(paymentIntent) {
        try {
            const transaction = await transaction_model_1.default.findByStripePaymentIntentId(paymentIntent.id);
            if (transaction) {
                await transaction_model_1.default.updateStatus(transaction.id, 'failed');
            }
        }
        catch (error) {
            console.error('Error handling payment_intent.payment_failed:', error);
        }
    }
    /**
     * Handle canceled payment
     */
    async handlePaymentIntentCanceled(paymentIntent) {
        try {
            const transaction = await transaction_model_1.default.findByStripePaymentIntentId(paymentIntent.id);
            if (transaction) {
                // Release the booth reservation
                const reservation = await reservation_model_1.default.findById(transaction.reservationId);
                if (reservation && reservation.status === 'pending') {
                    await reservation_model_1.default.cancel(reservation.id);
                    await booth_model_1.default.release(reservation.boothId);
                    // Emit real-time update
                    const io = (0, socket_io_1.getIO)();
                    io.to(`event:${reservation.eventId}`).emit('booth-released', {
                        boothId: reservation.boothId,
                        status: 'available',
                    });
                }
            }
        }
        catch (error) {
            console.error('Error handling payment_intent.canceled:', error);
        }
    }
}
exports.default = new StripeWebhookController();
//# sourceMappingURL=stripeWebhook.controller.js.map