/**
 * Feature Flag System
 * 
 * Enable/disable modules or features dynamically without code changes.
 */

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  module?: string;
}

class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  private configFile: string = 'feature-flags.json';

  constructor() {
    this.loadDefaultFlags();
    this.loadFromFile();
  }

  /**
   * Check if a feature is enabled
   */
  enabled(flagName: string): boolean {
    const flag = this.flags.get(flagName);
    return flag?.enabled ?? false;
  }

  /**
   * Enable a feature
   */
  enable(flagName: string, description?: string, module?: string): void {
    this.flags.set(flagName, {
      name: flagName,
      enabled: true,
      description,
      module
    });
    this.saveToFile();
  }

  /**
   * Disable a feature
   */
  disable(flagName: string): void {
    const flag = this.flags.get(flagName);
    if (flag) {
      flag.enabled = false;
      this.saveToFile();
    }
  }

  /**
   * Register a feature flag
   */
  register(flag: FeatureFlag): void {
    this.flags.set(flag.name, flag);
    this.saveToFile();
  }

  /**
   * Get all flags
   */
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  /**
   * Get flags for a specific module
   */
  getModuleFlags(moduleName: string): FeatureFlag[] {
    return Array.from(this.flags.values()).filter(
      flag => flag.module === moduleName
    );
  }

  /**
   * Load default flags
   */
  private loadDefaultFlags(): void {
    // Core features
    this.register({ name: 'authentication', enabled: true, description: 'User authentication system' });
    this.register({ name: 'database', enabled: true, description: 'Database connectivity' });
    
    // Module flags
    this.register({ name: 'sales', enabled: true, description: 'Sales management module', module: 'sales' });
    this.register({ name: 'costing', enabled: true, description: 'Cost tracking module', module: 'costing' });
    this.register({ name: 'proposals', enabled: true, description: 'Proposal creation module', module: 'proposals' });
    this.register({ name: 'monitoring', enabled: true, description: 'Sales team monitoring module', module: 'monitoring' });
    this.register({ name: 'policies', enabled: false, description: 'Policy management module', module: 'policies' });
    this.register({ name: 'payments', enabled: true, description: 'Payment gateway integration', module: 'payments' });
    
    // Feature-specific flags
    this.register({ name: 'gpsTracking', enabled: false, description: 'GPS tracking feature' });
    this.register({ name: 'realTimeUpdates', enabled: true, description: 'Real-time WebSocket updates' });
    this.register({ name: 'svgFloorPlan', enabled: true, description: 'Interactive SVG floor plan', module: 'sales' });
  }

  /**
   * Load flags from file
   */
  private loadFromFile(): void {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), this.configFile);
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const flags: FeatureFlag[] = JSON.parse(data);
        flags.forEach(flag => this.flags.set(flag.name, flag));
      }
    } catch (error) {
      console.warn('Could not load feature flags from file:', error);
    }
  }

  /**
   * Save flags to file
   */
  private saveToFile(): void {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), this.configFile);
      
      const flags = Array.from(this.flags.values());
      fs.writeFileSync(filePath, JSON.stringify(flags, null, 2), 'utf8');
    } catch (error) {
      console.warn('Could not save feature flags to file:', error);
    }
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagManager();

// Helper function for easy checking
export function isEnabled(flagName: string): boolean {
  return featureFlags.enabled(flagName);
}

export default featureFlags;

