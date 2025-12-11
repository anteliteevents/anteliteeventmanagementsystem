/**
 * API Gateway
 * 
 * Single entry point for all module API routes.
 * Prevents route collisions and provides unified error handling.
 */

import { Express, Request, Response, NextFunction } from 'express';
import { moduleLoader } from '../core/module-loader';
import { featureFlags } from '../core/feature-flags';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    module?: string;
    version?: string;
    timestamp?: string;
  };
}

class ApiGateway {
  private app: Express | null = null;
  private routePrefix: string = '/api';

  /**
   * Initialize the API gateway
   */
  initialize(app: Express, routePrefix: string = '/api'): void {
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
  private registerModuleRoutes(): void {
    if (!this.app) return;

    const modules = moduleLoader.getModules();

    modules.forEach((module, moduleName) => {
      // Check if module is enabled
      if (!featureFlags.enabled(moduleName)) {
        console.log(`⚠️  Module ${moduleName} is disabled, skipping route registration`);
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
          this.app!.use(modulePrefix, router);
          
          console.log(`✅ Registered API routes for module: ${moduleName} at ${modulePrefix}/*`);
          
          // Log registered routes for debugging (only for sales module)
          if (moduleName === 'sales') {
            console.log(`   📋 Sales module routes:`);
            router.stack.forEach((r: any) => {
              if (r.route) {
                const methods = Object.keys(r.route.methods).join(',').toUpperCase();
                console.log(`      ${methods} ${modulePrefix}${r.route.path}`);
              } else if (r.name === 'router') {
                // Handle nested routers
                console.log(`      [Nested router at ${r.regexp}]`);
              }
            });
          }
        } catch (error) {
          console.error(`❌ Error registering routes for ${moduleName}:`, error);
        }
      } else {
        console.warn(`⚠️  Module ${moduleName} has no routes function`);
      }
    });
  }

  /**
   * Setup global error handling
   */
  private setupErrorHandling(): void {
    if (!this.app) return;

    // 404 handler for API routes (must be last)
    // This catches any API routes that weren't matched by module routes
    this.app.use(`${this.routePrefix}/*`, (req: Request, res: Response, next: NextFunction) => {
      // Only handle if it's actually an API route and not already handled
      if (req.path.startsWith(this.routePrefix)) {
        // Log the attempted route for debugging
        console.warn(`⚠️  404 - API route not found: ${req.method} ${req.path}`);
        console.warn(`   Available modules: ${Array.from(moduleLoader.getModules().keys()).join(', ')}`);
        console.warn(`   Registered routes for sales module should be at /api/sales/*`);
        
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `API route not found: ${req.method} ${req.path}. Make sure the sales module is enabled and routes are registered.`
          }
        });
      } else {
        next(); // Pass to next handler if not an API route
      }
    });

    // Global error handler
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('API Gateway Error:', err);

      const response: ApiResponse = {
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
        response.error!.details = err.stack;
      }

      res.status(err.status || 500).json(response);
    });
  }

  /**
   * Create standardized API response
   */
  success<T>(data: T, meta?: any): ApiResponse<T> {
    return ApiGateway.success(data, meta);
  }
  error(code: string, message: string, details?: any): ApiResponse {
    return ApiGateway.error(code, message, details);
  }

  static success<T>(data: T, meta?: any): ApiResponse<T> {
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
  static error(code: string, message: string, details?: any): ApiResponse {
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

export const apiGateway = new ApiGateway();
export default apiGateway;

