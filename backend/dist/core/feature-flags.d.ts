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
declare class FeatureFlagManager {
    private flags;
    private configFile;
    constructor();
    /**
     * Check if a feature is enabled
     */
    enabled(flagName: string): boolean;
    /**
     * Enable a feature
     */
    enable(flagName: string, description?: string, module?: string): void;
    /**
     * Disable a feature
     */
    disable(flagName: string): void;
    /**
     * Register a feature flag
     */
    register(flag: FeatureFlag): void;
    /**
     * Get all flags
     */
    getAllFlags(): FeatureFlag[];
    /**
     * Get flags for a specific module
     */
    getModuleFlags(moduleName: string): FeatureFlag[];
    /**
     * Load default flags
     */
    private loadDefaultFlags;
    /**
     * Load flags from file
     */
    private loadFromFile;
    /**
     * Save flags to file
     */
    private saveToFile;
}
export declare const featureFlags: FeatureFlagManager;
export declare function isEnabled(flagName: string): boolean;
export default featureFlags;
//# sourceMappingURL=feature-flags.d.ts.map