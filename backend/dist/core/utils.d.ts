/**
 * Core Utilities
 *
 * Shared utility functions for all modules.
 */
/**
 * Validate UUID
 */
export declare function isValidUUID(uuid: string): boolean;
/**
 * Format currency
 */
export declare function formatCurrency(amount: number, currency?: string): string;
/**
 * Safe async handler wrapper
 */
export declare function asyncHandler(fn: Function): (req: any, res: any, next: any) => void;
/**
 * Delay utility
 */
export declare function delay(ms: number): Promise<void>;
//# sourceMappingURL=utils.d.ts.map