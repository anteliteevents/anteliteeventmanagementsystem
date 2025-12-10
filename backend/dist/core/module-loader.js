"use strict";
/**
 * Module Loader & Discovery System
 *
 * Auto-discovers and registers modules with their metadata, routes, and event handlers.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleLoader = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const event_bus_1 = __importDefault(require("./event-bus"));
const feature_flags_1 = __importDefault(require("./feature-flags"));
class ModuleLoader {
    constructor(modulesPath = (0, path_1.join)(__dirname, '../modules')) {
        this.modules = new Map();
        this.modulesPath = (0, path_1.resolve)(modulesPath);
    }
    /**
     * Discover and load all modules
     */
    async discoverModules() {
        const discovered = [];
        try {
            const entries = await (0, promises_1.readdir)(this.modulesPath, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const modulePath = (0, path_1.join)(this.modulesPath, entry.name);
                    const moduleJsonPath = (0, path_1.join)(modulePath, 'module.json');
                    try {
                        await (0, promises_1.stat)(moduleJsonPath);
                        discovered.push(entry.name);
                    }
                    catch {
                        console.warn(`Module ${entry.name} has no module.json, skipping`);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error discovering modules:', error);
        }
        return discovered;
    }
    /**
     * Load a module
     */
    async loadModule(moduleName) {
        // Check if feature is enabled
        if (!feature_flags_1.default.enabled(moduleName)) {
            console.log(`Module ${moduleName} is disabled by feature flag`);
            return null;
        }
        const modulePath = (0, path_1.join)(this.modulesPath, moduleName);
        const moduleJsonPath = (0, path_1.join)(modulePath, 'module.json');
        try {
            // Load metadata
            const metadataJson = await (0, promises_1.readFile)(moduleJsonPath, 'utf8');
            const metadata = JSON.parse(metadataJson);
            // Check dependencies
            if (metadata.dependencies) {
                for (const dep of metadata.dependencies) {
                    if (!feature_flags_1.default.enabled(dep)) {
                        console.warn(`Module ${moduleName} requires ${dep} which is disabled`);
                        return null;
                    }
                }
            }
            // Load module implementation
            // Use dynamic import which works with TypeScript compilation
            let moduleConfig = {
                metadata,
                path: modulePath
            };
            try {
                // Dynamic import - works with both .ts (ts-node-dev) and compiled .js
                // Use relative path from core directory
                const relativePath = `../modules/${moduleName}/index`;
                const module = await Promise.resolve(`${relativePath}`).then(s => __importStar(require(s)));
                if (module.default) {
                    moduleConfig = { ...moduleConfig, ...module.default };
                }
                else if (typeof module === 'object') {
                    moduleConfig = { ...moduleConfig, ...module };
                }
            }
            catch (error) {
                console.warn(`Could not load module implementation for ${moduleName}:`, error.message);
                // Module will still be registered with metadata only
                // This allows modules to be discovered even if not fully implemented
            }
            // Register event handlers
            if (moduleConfig.eventHandlers) {
                for (const [event, handler] of Object.entries(moduleConfig.eventHandlers)) {
                    event_bus_1.default.on(event, handler);
                    console.log(`Registered event handler: ${event} for module ${moduleName}`);
                }
            }
            // Run migrations if available
            if (moduleConfig.migrations) {
                try {
                    await moduleConfig.migrations();
                    console.log(`Ran migrations for module ${moduleName}`);
                }
                catch (error) {
                    console.error(`Error running migrations for ${moduleName}:`, error);
                }
            }
            // Initialize module
            if (moduleConfig.initialize) {
                try {
                    await moduleConfig.initialize();
                    console.log(`Initialized module ${moduleName}`);
                }
                catch (error) {
                    console.error(`Error initializing ${moduleName}:`, error);
                }
            }
            this.modules.set(moduleName, moduleConfig);
            console.log(`✅ Loaded module: ${moduleName} v${metadata.version}`);
            return moduleConfig;
        }
        catch (error) {
            console.error(`Error loading module ${moduleName}:`, error);
            return null;
        }
    }
    /**
     * Load all discovered modules
     */
    async loadAllModules() {
        const moduleNames = await this.discoverModules();
        console.log(`\n🔍 Discovered ${moduleNames.length} modules: ${moduleNames.join(', ')}\n`);
        for (const moduleName of moduleNames) {
            await this.loadModule(moduleName);
        }
        console.log(`\n✅ Loaded ${this.modules.size} modules\n`);
    }
    /**
     * Register module routes with Express app
     */
    registerRoutes(app) {
        this.modules.forEach((module, name) => {
            if (module.routes) {
                try {
                    module.routes(app);
                    console.log(`Registered routes for module: ${name}`);
                }
                catch (error) {
                    console.error(`Error registering routes for ${name}:`, error);
                }
            }
        });
    }
    /**
     * Get all loaded modules
     */
    getModules() {
        return this.modules;
    }
    /**
     * Get a specific module
     */
    getModule(name) {
        return this.modules.get(name);
    }
    /**
     * Shutdown all modules
     */
    async shutdown() {
        const shutdownPromises = [];
        this.modules.forEach((module, name) => {
            if (module.shutdown) {
                shutdownPromises.push(Promise.resolve(module.shutdown()).catch(error => {
                    console.error(`Error shutting down module ${name}:`, error);
                }));
            }
        });
        await Promise.all(shutdownPromises);
        console.log('All modules shut down');
    }
}
// Singleton instance
exports.moduleLoader = new ModuleLoader();
exports.default = exports.moduleLoader;
//# sourceMappingURL=module-loader.js.map