"use strict";
/**
 * Sales Module
 *
 * Handles booth sales, floor plans, and real-time availability updates.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feature_flags_1 = __importDefault(require("../../core/feature-flags"));
const routes_1 = require("./routes");
const sales_service_1 = require("./services/sales.service");
const floor_plan_service_1 = require("./services/floor-plan.service");
// Check if module is enabled
if (!feature_flags_1.default.enabled('sales')) {
    console.log('Sales module is disabled');
}
const moduleConfig = {
    metadata: require('./module.json'),
    path: __dirname,
    /**
     * Register API routes
     */
    routes: (router) => {
        (0, routes_1.salesRoutes)(router);
    },
    /**
     * Register event handlers
     */
    eventHandlers: {
        // Listen for booth booking events from other modules
        'payment.completed': async (payload) => {
            console.log('Sales module: Payment completed, confirming booth booking', payload);
            if (payload.reservationId) {
                await sales_service_1.salesService.confirmBooking(payload.reservationId);
            }
        },
        'reservation.expired': async (payload) => {
            console.log('Sales module: Reservation expired, releasing booth', payload);
            if (payload.boothId) {
                await sales_service_1.salesService.releaseBooth(payload.boothId);
            }
        }
    },
    /**
     * Database migrations
     */
    migrations: async () => {
        // Sales-specific migrations would go here
        console.log('Sales module: Running migrations...');
        // Example: await pool.query('CREATE TABLE IF NOT EXISTS sales...');
    },
    /**
     * Initialize module
     */
    initialize: async () => {
        console.log('Sales module: Initializing...');
        // Setup WebSocket handlers, load floor plans, etc.
        await floor_plan_service_1.floorPlanService.initialize();
    },
    /**
     * Shutdown module
     */
    shutdown: async () => {
        console.log('Sales module: Shutting down...');
        // Cleanup resources
    }
};
exports.default = moduleConfig;
//# sourceMappingURL=index.js.map