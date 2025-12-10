"use strict";
/**
 * API Gateway
 *
 * Single entry point for all module API routes.
 * Prevents route collisions and provides unified error handling.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiGateway = void 0;
const module_loader_1 = require("../core/module-loader");
const feature_flags_1 = require("../core/feature-flags");
class ApiGateway {
    constructor() {
        this.app = null;
        this.routePrefix = '/api';
    }
    /**
     * Initialize the API gateway
     */
    initialize(app, routePrefix = '/api') {
        this.app = app;
        this.routePrefix = routePrefix;
        // Register module routes
        this.registerModuleRoutes();
        // Global error handler
        this.setupErrorHandling();
    }
    /**
     * Register routes from all modules
     */
    registerModuleRoutes() {
        if (!this.app)
            return;
        const modules = module_loader_1.moduleLoader.getModules();
        modules.forEach((module, moduleName) => {
            // Check if module is enabled
            if (!feature_flags_1.featureFlags.enabled(moduleName)) {
                return;
            }
            if (module.routes) {
                try {
                    // Register routes with module prefix
                    const modulePrefix = `${this.routePrefix}/${moduleName}`;
                    // Create a router for this module
                    const express = require('express');
                    const router = express.Router();
                    // Let module register its routes
                    module.routes(router);
                    // Mount router with prefix
                    this.app.use(modulePrefix, router);
                    console.log(`✅ Registered API routes for module: ${moduleName} at ${modulePrefix}/*`);
                }
                catch (error) {
                    console.error(`Error registering routes for ${moduleName}:`, error);
                }
            }
        });
    }
    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        if (!this.app)
            return;
        // 404 handler for API routes
        this.app.use(`${this.routePrefix}/*`, (req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: `API route not found: ${req.path}`
                }
            });
        });
        // Global error handler
        this.app.use((err, req, res, next) => {
            console.error('API Gateway Error:', err);
            const response = {
                success: false,
                error: {
                    code: err.code || 'INTERNAL_ERROR',
                    message: err.message || 'Internal server error'
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            };
            // Add stack trace in development
            if (process.env.NODE_ENV === 'development' && err.stack) {
                response.error.details = err.stack;
            }
            res.status(err.status || 500).json(response);
        });
    }
    /**
     * Create standardized API response
     */
    success(data, meta) {
        return ApiGateway.success(data, meta);
    }
    error(code, message, details) {
        return ApiGateway.error(code, message, details);
    }
    static success(data, meta) {
        return {
            success: true,
            data,
            meta: {
                ...meta,
                timestamp: new Date().toISOString()
            }
        };
    }
    /**
     * Create standardized error response
     */
    static error(code, message, details) {
        return {
            success: false,
            error: {
                code,
                message,
                details
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        };
    }
}
exports.apiGateway = new ApiGateway();
exports.default = exports.apiGateway;
//# sourceMappingURL=gateway.js.map