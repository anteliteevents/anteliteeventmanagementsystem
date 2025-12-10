"use strict";
/**
 * Booths Routes
 * API routes for booth CRUD operations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booths_controller_1 = __importDefault(require("../controllers/booths.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// Validation middleware
const createBoothValidation = [
    (0, express_validator_1.body)('eventId').notEmpty().withMessage('Event ID is required'),
    (0, express_validator_1.body)('boothNumber').notEmpty().withMessage('Booth number is required'),
    (0, express_validator_1.body)('size').isIn(['small', 'medium', 'large', 'xlarge']).withMessage('Invalid size'),
    (0, express_validator_1.body)('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];
const updateBoothValidation = [
    (0, express_validator_1.body)('boothNumber').optional().notEmpty().withMessage('Booth number cannot be empty'),
    (0, express_validator_1.body)('size').optional().isIn(['small', 'medium', 'large', 'xlarge']).withMessage('Invalid size'),
    (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('status').optional().isIn(['available', 'reserved', 'booked', 'unavailable']).withMessage('Invalid status'),
];
// All routes require authentication and admin role
router.use(auth_middleware_1.authenticate);
router.use(auth_middleware_1.requireAdmin);
// Get all booths for an event
router.get('/', booths_controller_1.default.getBooths);
// Get booth by ID
router.get('/:id', booths_controller_1.default.getBoothById);
// Create a new booth
router.post('/', createBoothValidation, booths_controller_1.default.createBooth);
// Update a booth
router.put('/:id', updateBoothValidation, booths_controller_1.default.updateBooth);
// Delete a booth
router.delete('/:id', booths_controller_1.default.deleteBooth);
// Duplicate a booth
router.post('/:id/duplicate', booths_controller_1.default.duplicateBooth);
exports.default = router;
//# sourceMappingURL=booths.routes.js.map