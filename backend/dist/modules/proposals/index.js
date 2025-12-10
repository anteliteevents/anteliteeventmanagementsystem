"use strict";
/**
 * Proposals Module
 * Handles proposal creation, templates, and approval workflow
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
        'proposal.approved': async (data) => {
            console.log('✅ Proposal approved:', data);
            // Could trigger sending proposal to client, etc.
        },
    },
    /**
     * Initialize module
     */
    initialize: async () => {
        console.log('📄 Proposals Module: Initializing...');
    },
};
exports.default = moduleConfig;
//# sourceMappingURL=index.js.map