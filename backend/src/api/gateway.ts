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
        } catch (error) {
          console.error(`Error registering routes for ${moduleName}:`, error);
        }
      }
    });
  }

  /**
   * Setup global error handling
   */
  private setupErrorHandling(): void {
    if (!this.app) return;

    // 404 handler for API routes
    this.app.use(`${this.routePrefix}/*`, (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `API route not found: ${req.path}`
        }
      });
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

