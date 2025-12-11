"use strict";
/**
 * Reservations Routes
 * API routes for reservation CRUD operations (Admin only)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservations_controller_1 = __importDefault(require("../controllers/reservations.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and admin role
router.use(auth_middleware_1.authenticate);
router.use(auth_middleware_1.requireAdmin);
// Get all reservations
router.get('/', reservations_controller_1.default.getAllReservations);
// Get reservation by ID
router.get('/:id', reservations_controller_1.default.getReservationById);
// Update reservation
router.put('/:id', reservations_controller_1.default.updateReservation);
// Delete reservation
router.delete('/:id', reservations_controller_1.default.deleteReservation);
// Duplicate reservation
router.post('/:id/duplicate', reservations_controller_1.default.duplicateReservation);
exports.default = router;
//# sourceMappingURL=reservations.routes.js.map