/**
 * Module Loader & Discovery System
 * 
 * Auto-discovers and registers modules with their metadata, routes, and event handlers.
 */

import { EventEmitter } from 'events';
import { readdir, readFile, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { Express, Router } from 'express';
import eventBus from './event-bus';
import featureFlags from './feature-flags';

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
  eventHandlers?: { [event: string]: (payload: any) => void | Promise<void> };
  migrations?: () => Promise<void>;
  initialize?: () => Promise<void>;
  shutdown?: () => Promise<void>;
}

class ModuleLoader {
  private modules: Map<string, ModuleConfig> = new Map();
  private modulesPath: string;

  constructor(modulesPath: string = join(__dirname, '../modules')) {
    this.modulesPath = resolve(modulesPath);
  }

  /**
   * Discover and load all modules
   */
  async discoverModules(): Promise<string[]> {
    const discovered: string[] = [];

    try {
      const entries = await readdir(this.modulesPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const modulePath = join(this.modulesPath, entry.name);
          const moduleJsonPath = join(modulePath, 'module.json');

          try {
            await stat(moduleJsonPath);
            discovered.push(entry.name);
          } catch {
            console.warn(`Module ${entry.name} has no module.json, skipping`);
          }
        }
      }
    } catch (error) {
      console.error('Error discovering modules:', error);
    }

    return discovered;
  }

  /**
   * Load a module
   */
  async loadModule(moduleName: string): Promise<ModuleConfig | null> {
    // Check if feature is enabled
    if (!featureFlags.enabled(moduleName)) {
      console.log(`Module ${moduleName} is disabled by feature flag`);
      return null;
    }

    const modulePath = join(this.modulesPath, moduleName);
    const moduleJsonPath = join(modulePath, 'module.json');

    try {
      // Load metadata
      const metadataJson = await readFile(moduleJsonPath, 'utf8');
      const metadata: ModuleMetadata = JSON.parse(metadataJson);

      // Check dependencies
      if (metadata.dependencies) {
        for (const dep of metadata.dependencies) {
          if (!featureFlags.enabled(dep)) {
            console.warn(`Module ${moduleName} requires ${dep} which is disabled`);
            return null;
          }
        }
      }

      // Load module implementation
      // Use dynamic import which works with TypeScript compilation
      let moduleConfig: ModuleConfig = {
        metadata,
        path: modulePath
      };

      try {
        // Dynamic import - works with both .ts (ts-node-dev) and compiled .js
        // Use relative path from core directory
        const relativePath = `../modules/${moduleName}/index`;
        const module = await import(relativePath);
        
        if (module.default) {
          moduleConfig = { ...moduleConfig, ...module.default };
        } else if (typeof module === 'object') {
          moduleConfig = { ...moduleConfig, ...module };
        }
      } catch (error: any) {
        console.warn(`Could not load module implementation for ${moduleName}:`, error.message);
        // Module will still be registered with metadata only
        // This allows modules to be discovered even if not fully implemented
      }

      // Register event handlers
      if (moduleConfig.eventHandlers) {
        for (const [event, handler] of Object.entries(moduleConfig.eventHandlers)) {
          eventBus.on(event, handler);
          console.log(`Registered event handler: ${event} for module ${moduleName}`);
        }
      }

      // Run migrations if available
      if (moduleConfig.migrations) {
        try {
          await moduleConfig.migrations();
          console.log(`Ran migrations for module ${moduleName}`);
        } catch (error) {
          console.error(`Error running migrations for ${moduleName}:`, error);
        }
      }

      // Initialize module
      if (moduleConfig.initialize) {
        try {
          await moduleConfig.initialize();
          console.log(`Initialized module ${moduleName}`);
        } catch (error) {
          console.error(`Error initializing ${moduleName}:`, error);
        }
      }

      this.modules.set(moduleName, moduleConfig);
      console.log(`✅ Loaded module: ${moduleName} v${metadata.version}`);

      return moduleConfig;
    } catch (error) {
      console.error(`Error loading module ${moduleName}:`, error);
      return null;
    }
  }

  /**
   * Load all discovered modules
   */
  async loadAllModules(): Promise<void> {
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
  registerRoutes(app: Express): void {
    this.modules.forEach((module, name) => {
      if (module.routes) {
        try {
          module.routes(app);
          console.log(`Registered routes for module: ${name}`);
        } catch (error) {
          console.error(`Error registering routes for ${name}:`, error);
        }
      }
    });
  }

  /**
   * Get all loaded modules
   */
  getModules(): Map<string, ModuleConfig> {
    return this.modules;
  }

  /**
   * Get a specific module
   */
  getModule(name: string): ModuleConfig | undefined {
    return this.modules.get(name);
  }

  /**
   * Shutdown all modules
   */
  async shutdown(): Promise<void> {
    const shutdownPromises: Promise<void>[] = [];

    this.modules.forEach((module, name) => {
      if (module.shutdown) {
        shutdownPromises.push(
          Promise.resolve(module.shutdown()).catch(error => {
            console.error(`Error shutting down module ${name}:`, error);
          })
        );
      }
    });

    await Promise.all(shutdownPromises);
    console.log('All modules shut down');
  }
}

// Singleton instance
export const moduleLoader = new ModuleLoader();

export default moduleLoader;

