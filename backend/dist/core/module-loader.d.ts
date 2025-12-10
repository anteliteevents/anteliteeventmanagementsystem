/**
 * Module Loader & Discovery System
 *
 * Auto-discovers and registers modules with their metadata, routes, and event handlers.
 */
import { Express, Router } from 'express';
export interface ModuleMetadata {
    name: string;
    version: string;
    events?: string[];
    dbTables?: string[];
    apiRoutes?: string[];
    dependencies?: string[];
    description?: string;
}
export interface ModuleConfig {
    metadata: ModuleMetadata;
    path: string;
    routes?: (router: Router) => void;
    eventHandlers?: {
        [event: string]: (payload: any) => void | Promise<void>;
    };
    migrations?: () => Promise<void>;
    initialize?: () => Promise<void>;
    shutdown?: () => Promise<void>;
}
declare class ModuleLoader {
    private modules;
    private modulesPath;
    constructor(modulesPath?: string);
    /**
     * Discover and load all modules
     */
    discoverModules(): Promise<string[]>;
    /**
     * Load a module
     */
    loadModule(moduleName: string): Promise<ModuleConfig | null>;
    /**
     * Load all discovered modules
     */
    loadAllModules(): Promise<void>;
    /**
     * Register module routes with Express app
     */
    registerRoutes(app: Express): void;
    /**
     * Get all loaded modules
     */
    getModules(): Map<string, ModuleConfig>;
    /**
     * Get a specific module
     */
    getModule(name: string): ModuleConfig | undefined;
    /**
     * Shutdown all modules
     */
    shutdown(): Promise<void>;
}
export declare const moduleLoader: ModuleLoader;
export default moduleLoader;
//# sourceMappingURL=module-loader.d.ts.map