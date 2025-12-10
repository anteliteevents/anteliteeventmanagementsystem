"use strict";
/**
 * Monitoring Module
 * Handles sales team monitoring, performance metrics, and analytics
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feature_flags_1 = require("../../core/feature-flags");
const routes_1 = __importDefault(require("./routes"));
const monitoring_service_1 = __importDefault(require("./services/monitoring.service"));
const moduleConfig = {
    metadata: require('./module.json'),
    path: __dirname,
    /**
     * Register API routes
     */
    routes: (router) => {
        router.use('/', routes_1.default);
    },
    /**
     * Register event handlers
     */
    eventHandlers: {
        'boothBooked': async (data) => {
            if (feature_flags_1.featureFlags.enabled('monitoring')) {
                await monitoring_service_1.default.logActivity({
                    userId: data.exhibitorId || 'system',
                    eventId: data.eventId,
                    actionType: 'booth_booked',
                    description: `Booth booked: ${data.boothId}`,
                    metadata: data,
                });
            }
        },
        'payment.completed': async (data) => {
            if (feature_flags_1.featureFlags.enabled('monitoring')) {
                await monitoring_service_1.default.recordMetric({
                    eventId: data.eventId,
                    metricType: 'sales',
                    metricName: 'payment_completed',
                    value: data.amount || 0,
                    metadata: data,
                });
            }
        },
    },
    /**
     * Initialize module
     */
    initialize: async () => {
        console.log('📊 Monitoring Module: Initializing...');
    },
};
exports.default = moduleConfig;
//# sourceMappingURL=index.js.map