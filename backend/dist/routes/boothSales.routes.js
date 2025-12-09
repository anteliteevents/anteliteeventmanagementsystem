"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const boothSales_controller_1 = __importDefault(require("../controllers/boothSales.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/booths/available
 * @desc    Get available booths for an event
 * @access  Public (can be protected if needed)
 */
router.get('/available', boothSales_controller_1.default.getAvailableBooths.bind(boothSales_controller_1.default));
/**
 * @route   POST /api/booths/reserve
 * @desc    Reserve a booth
 * @access  Private (Exhibitor)
 */
router.post('/reserve', auth_middleware_1.authenticate, boothSales_controller_1.default.reserveBooth.bind(boothSales_controller_1.default));
/**
 * @route   POST /api/booths/purchase
 * @desc    Create payment intent for booth purchase
 * @access  Private (Exhibitor)
 */
router.post('/purchase', auth_middleware_1.authenticate, boothSales_controller_1.default.createPurchase.bind(boothSales_controller_1.default));
/**
 * @route   POST /api/booths/confirm-payment
 * @desc    Confirm payment and complete booking
 * @access  Private (Exhibitor)
 */
router.post('/confirm-payment', auth_middleware_1.authenticate, boothSales_controller_1.default.confirmPayment.bind(boothSales_controller_1.default));
/**
 * @route   GET /api/booths/my-reservations
 * @desc    Get current user's reservations
 * @access  Private (Exhibitor)
 */
router.get('/my-reservations', auth_middleware_1.authenticate, boothSales_controller_1.default.getMyReservations.bind(boothSales_controller_1.default));
exports.default = router;
//# sourceMappingURL=boothSales.routes.js.map