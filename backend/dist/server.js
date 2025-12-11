"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("./config/socket.io");
const boothSales_routes_1 = __importDefault(require("./routes/boothSales.routes"));
const booths_routes_1 = __importDefault(require("./routes/booths.routes"));
const stripeWebhook_routes_1 = __importDefault(require("./routes/stripeWebhook.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const payments_routes_1 = __importDefault(require("./routes/payments.routes"));
// Modular Architecture Imports
const module_loader_1 = require("./core/module-loader");
const gateway_1 = require("./api/gateway");
const feature_flags_1 = require("./core/feature-flags");
const handlers_1 = require("./modules/sales/websocket/handlers");
const customOrigins_1 = require("./config/customOrigins");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Initialize Socket.io
const io = (0, socket_io_1.setupSocketIO)(httpServer);
exports.io = io;
// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || customOrigins_1.defaultAllowedOrigins.join(','))
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);
app.use((req, res, next) => {
    const origin = req.header('Origin');
    const isAllowed = !origin || allowedOrigins.includes(origin);
    if (isAllowed) {
        res.header('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers') ||
            'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }
        return next();
    }
    return res.status(403).send('CORS Forbidden');
});
app.use((0, helmet_1.default)());
// Stripe webhook route - must be before express.json() to receive raw body
app.use('/api/webhooks', express_1.default.raw({ type: 'application/json' }), stripeWebhook_routes_1.default);
// Parse JSON for all other routes
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        modules: Array.from(module_loader_1.moduleLoader.getModules().keys()),
        featureFlags: feature_flags_1.featureFlags.getAllFlags().filter(f => f.enabled).map(f => f.name)
    });
});
// Legacy API Routes (for backward compatibility)
app.use('/api/auth', auth_routes_1.default);
app.use('/api/booths', boothSales_routes_1.default); // Sales operations
app.use('/api/admin/booths', booths_routes_1.default); // CRUD operations
app.use('/api/events', event_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/payments', payments_routes_1.default);
// Initialize Modular Architecture
async function initializeModules() {
    try {
        console.log('\n🔧 Initializing Modular Architecture...\n');
        // Load all modules
        await module_loader_1.moduleLoader.loadAllModules();
        // Register module routes via API Gateway
        gateway_1.apiGateway.initialize(app, '/api');
        // Setup WebSocket handlers for modules
        if (feature_flags_1.featureFlags.enabled('realTimeUpdates')) {
            (0, handlers_1.setupSalesWebSocket)(io);
        }
        console.log('\n✅ Modular Architecture Initialized!\n');
    }
    catch (error) {
        console.error('❌ Error initializing modules:', error);
        process.exit(1);
    }
}
// Error handling middleware (to be implemented)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: {
            code: err.code || 'INTERNAL_ERROR',
            message: err.message || 'Internal server error'
        }
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Route not found'
        }
    });
});
const PORT = process.env.PORT || 3001;
// Initialize modules and start server
initializeModules().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`\n🚀 Server running on port ${PORT}`);
        console.log(`📡 Socket.io server initialized`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`\n📋 Available Modules:`);
        module_loader_1.moduleLoader.getModules().forEach((module, name) => {
            console.log(`   ✅ ${name} v${module.metadata.version}`);
        });
        console.log(`\n🔗 API Gateway: http://localhost:${PORT}/api`);
        console.log(`📊 Health Check: http://localhost:${PORT}/health\n`);
    });
}).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await module_loader_1.moduleLoader.shutdown();
    httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
//# sourceMappingURL=server.js.map