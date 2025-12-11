"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payments_controller_1 = __importDefault(require("../controllers/payments.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Payments listing for admins (or authenticated users)
router.get('/transactions', auth_middleware_1.authenticate, payments_controller_1.default.listTransactions.bind(payments_controller_1.default));
router.get('/invoices', auth_middleware_1.authenticate, payments_controller_1.default.listInvoices.bind(payments_controller_1.default));
exports.default = router;
//# sourceMappingURL=payments.routes.js.map