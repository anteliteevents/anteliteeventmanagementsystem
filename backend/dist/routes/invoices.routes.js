"use strict";
/**
 * Invoices Routes
 * API routes for invoice CRUD operations (Admin only)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoices_controller_1 = __importDefault(require("../controllers/invoices.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and admin role
router.use(auth_middleware_1.authenticate);
router.use(auth_middleware_1.requireAdmin);
// Get all invoices
router.get('/', invoices_controller_1.default.getAllInvoices);
// Get invoice by ID
router.get('/:id', invoices_controller_1.default.getInvoiceById);
// Update invoice
router.put('/:id', invoices_controller_1.default.updateInvoice);
// Delete invoice
router.delete('/:id', invoices_controller_1.default.deleteInvoice);
// Duplicate invoice
router.post('/:id/duplicate', invoices_controller_1.default.duplicateInvoice);
exports.default = router;
//# sourceMappingURL=invoices.routes.js.map