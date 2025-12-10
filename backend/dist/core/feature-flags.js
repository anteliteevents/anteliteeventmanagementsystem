"use strict";
/**
 * Feature Flag System
 *
 * Enable/disable modules or features dynamically without code changes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureFlags = void 0;
exports.isEnabled = isEnabled;
class FeatureFlagManager {
    constructor() {
        this.flags = new Map();
        this.configFile = 'feature-flags.json';
        this.loadDefaultFlags();
        this.loadFromFile();
    }
    /**
     * Check if a feature is enabled
     */
    enabled(flagName) {
        const flag = this.flags.get(flagName);
        return flag?.enabled ?? false;
    }
    /**
     * Enable a feature
     */
    enable(flagName, description, module) {
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
    disable(flagName) {
        const flag = this.flags.get(flagName);
        if (flag) {
            flag.enabled = false;
            this.saveToFile();
        }
    }
    /**
     * Register a feature flag
     */
    register(flag) {
        this.flags.set(flag.name, flag);
        this.saveToFile();
    }
    /**
     * Get all flags
     */
    getAllFlags() {
        return Array.from(this.flags.values());
    }
    /**
     * Get flags for a specific module
     */
    getModuleFlags(moduleName) {
        return Array.from(this.flags.values()).filter(flag => flag.module === moduleName);
    }
    /**
     * Load default flags
     */
    loadDefaultFlags() {
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
    loadFromFile() {
        try {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(process.cwd(), this.configFile);
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                const flags = JSON.parse(data);
                flags.forEach(flag => this.flags.set(flag.name, flag));
            }
        }
        catch (error) {
            console.warn('Could not load feature flags from file:', error);
        }
    }
    /**
     * Save flags to file
     */
    saveToFile() {
        try {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(process.cwd(), this.configFile);
            const flags = Array.from(this.flags.values());
            fs.writeFileSync(filePath, JSON.stringify(flags, null, 2), 'utf8');
        }
        catch (error) {
            console.warn('Could not save feature flags to file:', error);
        }
    }
}
// Singleton instance
exports.featureFlags = new FeatureFlagManager();
// Helper function for easy checking
function isEnabled(flagName) {
    return exports.featureFlags.enabled(flagName);
}
exports.default = exports.featureFlags;
//# sourceMappingURL=feature-flags.js.map