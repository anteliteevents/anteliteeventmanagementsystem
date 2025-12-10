"use strict";
/**
 * Policies Module
 * Handles policy management, terms & conditions, and compliance
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
        'policy.activated': async (data) => {
            console.log('✅ Policy activated:', data);
            // Could notify users, update compliance records, etc.
        },
    },
    /**
     * Initialize module
     */
    initialize: async () => {
        console.log('📋 Policies Module: Initializing...');
    },
};
exports.default = moduleConfig;
//# sourceMappingURL=index.js.map