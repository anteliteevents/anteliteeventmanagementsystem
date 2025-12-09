import { Router } from 'express';
import boothSalesController from '../controllers/boothSales.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/booths/available
 * @desc    Get available booths for an event
 * @access  Public (can be protected if needed)
 */
router.get('/available', boothSalesController.getAvailableBooths.bind(boothSalesController));

/**
 * @route   POST /api/booths/reserve
 * @desc    Reserve a booth
 * @access  Private (Exhibitor)
 */
router.post('/reserve', authenticate, boothSalesController.reserveBooth.bind(boothSalesController));

/**
 * @route   POST /api/booths/purchase
 * @desc    Create payment intent for booth purchase
 * @access  Private (Exhibitor)
 */
router.post('/purchase', authenticate, boothSalesController.createPurchase.bind(boothSalesController));

/**
 * @route   POST /api/booths/confirm-payment
 * @desc    Confirm payment and complete booking
 * @access  Private (Exhibitor)
 */
router.post('/confirm-payment', authenticate, boothSalesController.confirmPayment.bind(boothSalesController));

/**
 * @route   GET /api/booths/my-reservations
 * @desc    Get current user's reservations
 * @access  Private (Exhibitor)
 */
router.get('/my-reservations', authenticate, boothSalesController.getMyReservations.bind(boothSalesController));

export default router;

