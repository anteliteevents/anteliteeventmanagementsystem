"use strict";
/**
 * Costing Module
 * Handles cost tracking, budget management, and financial reporting
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes"));
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
        'budget.exceeded': async (data) => {
            console.log('⚠️ Budget exceeded:', data);
            // Could send notifications, alerts, etc.
        },
        'budget.warning': async (data) => {
            console.log('⚠️ Budget warning:', data);
            // Could send warnings to admins
        },
    },
    /**
     * Initialize module
     */
    initialize: async () => {
        console.log('💰 Costing Module: Initializing...');
    },
};
exports.default = moduleConfig;
//# sourceMappingURL=index.js.map