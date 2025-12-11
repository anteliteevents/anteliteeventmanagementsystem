"use strict";
/**
 * Booth Sales Controller
 *
 * Handles all booth sales operations including reservations, bookings, and payments.
 *
 * @module controllers/boothSales
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booth_model_1 = __importDefault(require("../models/booth.model"));
const reservation_model_1 = __importDefault(require("../models/reservation.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const invoice_model_1 = __importDefault(require("../models/invoice.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const stripe_service_1 = __importDefault(require("../services/stripe.service"));
const email_service_1 = __importDefault(require("../services/email.service"));
const socket_io_1 = require("../config/socket.io");
const logger_1 = __importDefault(require("../config/logger"));
class BoothSalesController {
    /**
     * Get available booths for an event
     * GET /api/booths/available?eventId=xxx
     */
    async getAvailableBooths(req, res) {
        try {
            const { eventId } = req.query;
            if (!eventId || typeof eventId !== 'string') {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'eventId is required',
                    },
                });
                return;
            }
            const filters = {};
            if (req.query.size)
                filters.size = req.query.size;
            if (req.query.minPrice)
                filters.minPrice = parseFloat(req.query.minPrice);
            if (req.query.maxPrice)
                filters.maxPrice = parseFloat(req.query.maxPrice);
            const booths = await booth_model_1.default.findAvailableByEventId(eventId);
            const response = {
                success: true,
                data: booths,
            };
            res.json(response);
        }
        catch (error) {
            logger_1.default.error('Error getting available booths', { error: error.message, stack: error.stack, eventId: req.query.eventId });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Failed to get available booths',
                },
            });
        }
    }
    /**
     * Reserve a booth
     * POST /api/booths/reserve
     */
    async reserveBooth(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
                });
                return;
            }
            const { boothId, eventId } = req.body;
            if (!boothId || !eventId) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'boothId and eventId are required',
                    },
                });
                return;
            }
            // Check if booth exists and is available
            const booth = await booth_model_1.default.findById(boothId);
            if (!booth) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Booth not found' },
                });
                return;
            }
            if (booth.status !== 'available') {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'BOOTH_UNAVAILABLE',
                        message: 'Booth is not available',
                    },
                });
                return;
            }
            // Check if already reserved
            const isReserved = await reservation_model_1.default.isBoothReserved(boothId);
            if (isReserved) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'BOOTH_RESERVED',
                        message: 'Booth is already reserved',
                    },
                });
                return;
            }
            // Create reservation (expires in 15 minutes)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);
            const reservation = await reservation_model_1.default.create({
                boothId,
                exhibitorId: req.user.id,
                eventId,
                expiresAt,
            });
            // Update booth status to reserved
            await booth_model_1.default.reserve(boothId);
            // Get user and event details for email
            const [user, event] = await Promise.all([
                user_model_1.default.findByIdSafe(req.user.id),
                event_model_1.default.findById(eventId),
            ]);
            // Send confirmation email
            if (user && event) {
                try {
                    await email_service_1.default.sendReservationConfirmation(user.email, `${user.firstName} ${user.lastName}`, booth.boothNumber, event.name, parseFloat(booth.price.toString()), reservation.id);
                }
                catch (emailError) {
                    logger_1.default.warn('Error sending reservation email', { error: emailError?.message || String(emailError), userId: req.user.id, boothId });
                    // Don't fail the request if email fails
                }
            }
            // Emit real-time update
            const io = (0, socket_io_1.getIO)();
            io.to(`event:${eventId}`).emit('booth-reserved', {
                boothId,
                status: 'reserved',
            });
            const response = {
                success: true,
                data: reservation,
                message: 'Booth reserved successfully. Please complete payment within 15 minutes.',
            };
            res.json(response);
        }
        catch (error) {
            logger_1.default.error('Error reserving booth', { error: error.message, stack: error.stack, userId: req.user?.id, boothId: req.body.boothId });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Failed to reserve booth',
                },
            });
        }
    }
    /**
     * Create payment intent for booth purchase
     * POST /api/booths/purchase
     */
    async createPurchase(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
                });
                return;
            }
            const { reservationId } = req.body;
            if (!reservationId) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'reservationId is required',
                    },
                });
                return;
            }
            // Get reservation with booth details
            const reservation = await reservation_model_1.default.findByIdWithBooth(reservationId);
            if (!reservation) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Reservation not found' },
                });
                return;
            }
            // Verify reservation belongs to user
            if (reservation.exhibitorId !== req.user.id) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'Reservation does not belong to you',
                    },
                });
                return;
            }
            // Check if reservation is still valid
            if (reservation.status !== 'pending') {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_RESERVATION',
                        message: 'Reservation is not in pending status',
                    },
                });
                return;
            }
            if (reservation.expiresAt && new Date(reservation.expiresAt) < new Date()) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'RESERVATION_EXPIRED',
                        message: 'Reservation has expired',
                    },
                });
                return;
            }
            // Get user details
            const user = await user_model_1.default.findByIdSafe(req.user.id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'User not found' },
                });
                return;
            }
            // Check if transaction already exists
            let transaction = await transaction_model_1.default.findByReservationId(reservationId);
            let stripeCustomerId;
            let paymentIntentId;
            if (!transaction) {
                // Create or get Stripe customer
                try {
                    const customer = await stripe_service_1.default.createCustomer({
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        phone: user.phone || undefined,
                        metadata: {
                            userId: user.id,
                            reservationId,
                        },
                    });
                    stripeCustomerId = customer.id;
                }
                catch (error) {
                    logger_1.default.error('Error creating Stripe customer', { error: error?.message || String(error), stack: error?.stack, userId: req.user?.id });
                }
                // Create payment intent
                const amountInCents = Math.round(parseFloat(reservation.price.toString()) * 100);
                const paymentIntent = await stripe_service_1.default.createPaymentIntent({
                    amount: amountInCents,
                    currency: 'usd',
                    customerId: stripeCustomerId,
                    description: `Booth ${reservation.booth_number} - ${reservation.event_name}`,
                    metadata: {
                        reservationId,
                        boothId: reservation.boothId,
                        eventId: reservation.eventId,
                        boothNumber: reservation.boothNumber,
                    },
                });
                paymentIntentId = paymentIntent.id;
                // Create transaction record
                transaction = await transaction_model_1.default.create({
                    reservationId,
                    amount: parseFloat(reservation.price.toString()),
                    currency: 'USD',
                    paymentMethod: 'stripe',
                    stripePaymentIntentId: paymentIntentId,
                    stripeCustomerId,
                    metadata: {
                        boothNumber: reservation.boothNumber,
                        eventName: reservation.eventName,
                    },
                });
            }
            else {
                // Transaction exists, get payment intent
                if (transaction.stripePaymentIntentId) {
                    paymentIntentId = transaction.stripePaymentIntentId;
                    stripeCustomerId = transaction.stripeCustomerId || undefined;
                }
                else {
                    // Create payment intent if missing
                    const amountInCents = Math.round(transaction.amount * 100);
                    const paymentIntent = await stripe_service_1.default.createPaymentIntent({
                        amount: amountInCents,
                        currency: transaction.currency,
                        customerId: transaction.stripeCustomerId,
                        description: `Booth purchase - Reservation ${reservationId}`,
                        metadata: {
                            reservationId,
                            transactionId: transaction.id,
                        },
                    });
                    paymentIntentId = paymentIntent.id;
                    await transaction_model_1.default.updateStripePaymentIntent(transaction.id, paymentIntentId);
                }
            }
            // Get payment intent details
            const paymentIntent = await stripe_service_1.default.getPaymentIntent(paymentIntentId);
            const response = {
                success: true,
                data: {
                    transactionId: transaction.id,
                    paymentIntentId: paymentIntent.id,
                    clientSecret: paymentIntent.client_secret,
                    amount: transaction.amount,
                    currency: transaction.currency,
                },
                message: 'Payment intent created successfully',
            };
            res.json(response);
        }
        catch (error) {
            logger_1.default.error('Error creating purchase', { error: error.message, stack: error.stack, userId: req.user?.id, boothIds: req.body.boothIds });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Failed to create purchase',
                },
            });
        }
    }
    /**
     * Confirm payment and complete booking
     * POST /api/booths/confirm-payment
     */
    async confirmPayment(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
                });
                return;
            }
            const { paymentIntentId } = req.body;
            if (!paymentIntentId) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'paymentIntentId is required',
                    },
                });
                return;
            }
            // Get transaction
            const transaction = await transaction_model_1.default.findByStripePaymentIntentId(paymentIntentId);
            if (!transaction) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Transaction not found' },
                });
                return;
            }
            // Verify transaction belongs to user
            const reservation = await reservation_model_1.default.findById(transaction.reservationId);
            if (!reservation || reservation.exhibitorId !== req.user.id) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'Transaction does not belong to you',
                    },
                });
                return;
            }
            // Verify payment intent status
            const paymentIntent = await stripe_service_1.default.getPaymentIntent(paymentIntentId);
            if (paymentIntent.status !== 'succeeded') {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'PAYMENT_NOT_COMPLETED',
                        message: `Payment status: ${paymentIntent.status}`,
                    },
                });
                return;
            }
            // Update transaction status
            await transaction_model_1.default.updateStatus(transaction.id, 'completed');
            // Confirm reservation
            await reservation_model_1.default.confirm(reservation.id);
            // Update booth status to booked
            await booth_model_1.default.book(reservation.boothId);
            // Create invoice
            const invoice = await invoice_model_1.default.create({
                reservationId: reservation.id,
                amount: transaction.amount,
                taxAmount: 0, // Add tax calculation if needed
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            });
            // Mark invoice as sent and paid
            await invoice_model_1.default.markAsSent(invoice.id);
            await invoice_model_1.default.markAsPaid(invoice.id);
            // Get user and event details for email
            const [user, reservationWithDetails] = await Promise.all([
                user_model_1.default.findByIdSafe(req.user.id),
                reservation_model_1.default.findByIdWithBooth(reservation.id),
            ]);
            // Send payment confirmation email
            if (user && reservationWithDetails) {
                try {
                    await email_service_1.default.sendPaymentConfirmation(user.email, `${user.firstName} ${user.lastName}`, reservationWithDetails.boothNumber, reservationWithDetails.eventName, transaction.amount, transaction.id, invoice.invoiceNumber);
                }
                catch (emailError) {
                    logger_1.default.warn('Error sending payment confirmation email', { error: emailError?.message || String(emailError), userId: req.user?.id, transactionId: transaction.id });
                }
            }
            // Emit real-time update
            const io = (0, socket_io_1.getIO)();
            io.to(`event:${reservation.eventId}`).emit('booth-booked', {
                boothId: reservation.boothId,
                status: 'booked',
            });
            const response = {
                success: true,
                data: {
                    transaction,
                    reservation,
                    invoice,
                },
                message: 'Payment confirmed and booking completed successfully',
            };
            res.json(response);
        }
        catch (error) {
            logger_1.default.error('Error confirming payment', { error: error.message, stack: error.stack, transactionId: req.body.transactionId });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Failed to confirm payment',
                },
            });
        }
    }
    /**
     * Get user's reservations
     * GET /api/booths/my-reservations
     */
    async getMyReservations(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
                });
                return;
            }
            const reservations = await reservation_model_1.default.findByExhibitorId(req.user.id);
            const response = {
                success: true,
                data: reservations,
            };
            res.json(response);
        }
        catch (error) {
            logger_1.default.error('Error getting reservations', { error: error.message, stack: error.stack, userId: req.user?.id });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Failed to get reservations',
                },
            });
        }
    }
}
exports.default = new BoothSalesController();
//# sourceMappingURL=boothSales.controller.js.map