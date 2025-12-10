/**
 * API Gateway
 *
 * Single entry point for all module API routes.
 * Prevents route collisions and provides unified error handling.
 */
import { Express } from 'express';
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
declare class ApiGateway {
    private app;
    private routePrefix;
    /**
     * Initialize the API gateway
     */
    initialize(app: Express, routePrefix?: string): void;
    /**
     * Register routes from all modules
     */
    private registerModuleRoutes;
    /**
     * Setup global error handling
     */
    private setupErrorHandling;
    /**
     * Create standardized API response
     */
    success<T>(data: T, meta?: any): ApiResponse<T>;
    error(code: string, message: string, details?: any): ApiResponse;
    static success<T>(data: T, meta?: any): ApiResponse<T>;
    /**
     * Create standardized error response
     */
    static error(code: string, message: string, details?: any): ApiResponse;
}
export declare const apiGateway: ApiGateway;
export default apiGateway;
//# sourceMappingURL=gateway.d.ts.map