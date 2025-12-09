"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripeWebhook_controller_1 = __importDefault(require("../controllers/stripeWebhook.controller"));
const router = (0, express_1.Router)();
// Stripe webhook endpoint - must use raw body
// Note: This route should be registered BEFORE express.json() middleware
// In server.ts, we'll handle this route separately with raw body parsing
/**
 * @route   POST /api/webhooks/stripe
 * @desc    Handle Stripe webhook events
 * @access  Public (verified by Stripe signature)
 */
router.post('/stripe', 
// Express.raw({ type: 'application/json' }) should be applied in server.ts
stripeWebhook_controller_1.default.handleWebhook.bind(stripeWebhook_controller_1.default));
exports.default = router;
//# sourceMappingURL=stripeWebhook.routes.js.map