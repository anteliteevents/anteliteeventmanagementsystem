"use strict";
/**
 * Payments Module
 * Handles payment processing, Stripe integration, and invoice management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feature_flags_1 = require("../../core/feature-flags");
const routes_1 = __importDefault(require("./routes"));
const payment_service_1 = __importDefault(require("./services/payment.service"));
const moduleConfig = {
    metadata: require('./module.json'),
    path: __dirname,
    /**
     * Register API routes
     */
    routes: (router) => {
        // Mount payment routes directly on the provided router
        router.use('/', routes_1.default);
    },
    /**
     * Register event handlers
     */
    eventHandlers: {
        'boothBooked': async (data) => {
            if (feature_flags_1.featureFlags.enabled('payments')) {
                console.log('💰 Payments: Booth booked event received', data);
                // Auto-generate invoice when booth is booked
                try {
                    if (data.reservationId) {
                        await payment_service_1.default.generateInvoice(data.reservationId);
                    }
                }
                catch (error) {
                    console.error('Error generating invoice on booth booking:', error);
                }
            }
        },
    },
    /**
     * Initialize module
     */
    initialize: async () => {
        console.log('📦 Payments Module: Initializing...');
    },
};
exports.default = moduleConfig;
//# sourceMappingURL=index.js.map