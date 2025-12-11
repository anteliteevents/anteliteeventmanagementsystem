/**
 * Booth Sales Controller
 * 
 * Handles all booth sales operations including reservations, bookings, and payments.
 * 
 * @module controllers/boothSales
 */

import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import boothModel from '../models/booth.model';
import reservationModel from '../models/reservation.model';
import transactionModel from '../models/transaction.model';
import invoiceModel from '../models/invoice.model';
import userModel from '../models/user.model';
import eventModel from '../models/event.model';
import stripeService from '../services/stripe.service';
import emailService from '../services/email.service';
import { getIO } from '../config/socket.io';
import logger from '../config/logger';

class BoothSalesController {
  /**
   * Get available booths for an event
   * GET /api/booths/available?eventId=xxx
   */
  async getAvailableBooths(req: AuthRequest, res: Response): Promise<void> {
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

      const filters: any = {};
      if (req.query.size) filters.size = req.query.size;
      if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice as string);

      const booths = await boothModel.findAvailableByEventId(eventId);

      const response: ApiResponse = {
        success: true,
        data: booths,
      };
      res.json(response);
    } catch (error: any) {
      logger.error('Error getting available booths', { error: error.message, stack: error.stack, eventId: req.query.eventId });
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
  async reserveBooth(req: AuthRequest, res: Response): Promise<void> {
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
      const booth = await boothModel.findById(boothId);
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
      const isReserved = await reservationModel.isBoothReserved(boothId);
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

      const reservation = await reservationModel.create({
        boothId,
        exhibitorId: req.user.id,
        eventId,
        expiresAt,
      });

      // Update booth status to reserved
      await boothModel.reserve(boothId);

      // Get user and event details for email
      const [user, event] = await Promise.all([
        userModel.findByIdSafe(req.user.id),
        eventModel.findById(eventId),
      ]);

      // Send confirmation email
      if (user && event) {
        try {
          await emailService.sendReservationConfirmation(
            user.email,
            `${user.firstName} ${user.lastName}`,
            booth.boothNumber,
            event.name,
            parseFloat(booth.price.toString()),
            reservation.id
          );
        } catch (emailError: any) {
          logger.warn('Error sending reservation email', { error: emailError?.message || String(emailError), userId: req.user.id, boothId });
          // Don't fail the request if email fails
        }
      }

      // Emit real-time update
      const io = getIO();
      io.to(`event:${eventId}`).emit('booth-reserved', {
        boothId,
        status: 'reserved',
      });

      const response: ApiResponse = {
        success: true,
        data: reservation,
        message: 'Booth reserved successfully. Please complete payment within 15 minutes.',
      };
      res.json(response);
    } catch (error: any) {
      logger.error('Error reserving booth', { error: error.message, stack: error.stack, userId: req.user?.id, boothId: req.body.boothId });
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
  async createPurchase(req: AuthRequest, res: Response): Promise<void> {
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
      const reservation = await reservationModel.findByIdWithBooth(reservationId);
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
      const user = await userModel.findByIdSafe(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'User not found' },
        });
        return;
      }

      // Check if transaction already exists
      let transaction = await transactionModel.findByReservationId(reservationId);

      let stripeCustomerId: string | undefined;
      let paymentIntentId: string | undefined;

      if (!transaction) {
        // Create or get Stripe customer
        try {
          const customer = await stripeService.createCustomer({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            phone: user.phone || undefined,
            metadata: {
              userId: user.id,
              reservationId,
            },
          });
          stripeCustomerId = customer.id;
        } catch (error: any) {
          logger.error('Error creating Stripe customer', { error: error?.message || String(error), stack: error?.stack, userId: req.user?.id });
        }

        // Create payment intent
        const amountInCents = Math.round(parseFloat(reservation.price.toString()) * 100);
        const paymentIntent = await stripeService.createPaymentIntent({
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
        transaction = await transactionModel.create({
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
      } else {
        // Transaction exists, get payment intent
        if (transaction.stripePaymentIntentId) {
          paymentIntentId = transaction.stripePaymentIntentId;
          stripeCustomerId = transaction.stripeCustomerId || undefined;
        } else {
          // Create payment intent if missing
          const amountInCents = Math.round(transaction.amount * 100);
          const paymentIntent = await stripeService.createPaymentIntent({
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
          await transactionModel.updateStripePaymentIntent(transaction.id, paymentIntentId);
        }
      }

      // Get payment intent details
      const paymentIntent = await stripeService.getPaymentIntent(paymentIntentId);

      const response: ApiResponse = {
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
    } catch (error: any) {
      logger.error('Error creating purchase', { error: error.message, stack: error.stack, userId: req.user?.id, boothIds: req.body.boothIds });
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
  async confirmPayment(req: AuthRequest, res: Response): Promise<void> {
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
      const transaction = await transactionModel.findByStripePaymentIntentId(paymentIntentId);
      if (!transaction) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Transaction not found' },
        });
        return;
      }

      // Verify transaction belongs to user
      const reservation = await reservationModel.findById(transaction.reservationId);
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
      const paymentIntent = await stripeService.getPaymentIntent(paymentIntentId);
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
      await transactionModel.updateStatus(transaction.id, 'completed');

      // Confirm reservation
      await reservationModel.confirm(reservation.id);

      // Update booth status to booked
      await boothModel.book(reservation.boothId);

      // Create invoice
      const invoice = await invoiceModel.create({
        reservationId: reservation.id,
        amount: transaction.amount,
        taxAmount: 0, // Add tax calculation if needed
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      // Mark invoice as sent and paid
      await invoiceModel.markAsSent(invoice.id);
      await invoiceModel.markAsPaid(invoice.id);

      // Get user and event details for email
      const [user, reservationWithDetails] = await Promise.all([
        userModel.findByIdSafe(req.user.id),
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
        } catch (emailError: any) {
          logger.warn('Error sending payment confirmation email', { error: emailError?.message || String(emailError), userId: req.user?.id, transactionId: transaction.id });
        }
      }

      // Emit real-time update
      const io = getIO();
      io.to(`event:${reservation.eventId}`).emit('booth-booked', {
        boothId: reservation.boothId,
        status: 'booked',
      });

      const response: ApiResponse = {
        success: true,
        data: {
          transaction,
          reservation,
          invoice,
        },
        message: 'Payment confirmed and booking completed successfully',
      };
      res.json(response);
    } catch (error: any) {
      logger.error('Error confirming payment', { error: error.message, stack: error.stack, transactionId: req.body.transactionId });
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
  async getMyReservations(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
        return;
      }

      const reservations = await reservationModel.findByExhibitorId(req.user.id);

      const response: ApiResponse = {
        success: true,
        data: reservations,
      };
      res.json(response);
    } catch (error: any) {
      logger.error('Error getting reservations', { error: error.message, stack: error.stack, userId: req.user?.id });
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

export default new BoothSalesController();

