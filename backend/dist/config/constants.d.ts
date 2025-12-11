/**
 * Application Constants
 *
 * Centralized constants for the application to avoid magic numbers and strings.
 */
export declare const DB_CONSTANTS: {
    readonly MAX_CONNECTIONS: 20;
    readonly IDLE_TIMEOUT_MS: 30000;
    readonly CONNECTION_TIMEOUT_MS: 5000;
};
export declare const API_CONSTANTS: {
    readonly DEFAULT_PORT: 3001;
    readonly REQUEST_TIMEOUT_MS: 10000;
    readonly MAX_REQUEST_SIZE: "10mb";
};
export declare const AUTH_CONSTANTS: {
    readonly TOKEN_EXPIRY_HOURS: 168;
    readonly PASSWORD_MIN_LENGTH: 8;
    readonly PASSWORD_HASH_ROUNDS: 10;
};
export declare const BUSINESS_CONSTANTS: {
    readonly RESERVATION_HOLD_MINUTES: 15;
    readonly MAX_BOOTHS_PER_RESERVATION: 10;
    readonly MIN_BOOTH_PRICE: 0;
    readonly MAX_BOOTH_PRICE: 1000000;
};
export declare const PAGINATION_CONSTANTS: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
    readonly DEFAULT_PAGE: 1;
};
export declare const EVENT_STATUS: {
    readonly DRAFT: "draft";
    readonly ACTIVE: "active";
    readonly PUBLISHED: "published";
    readonly CANCELLED: "cancelled";
    readonly COMPLETED: "completed";
};
export declare const BOOTH_STATUS: {
    readonly AVAILABLE: "available";
    readonly RESERVED: "reserved";
    readonly BOOKED: "booked";
    readonly UNAVAILABLE: "unavailable";
};
export declare const PAYMENT_STATUS: {
    readonly PENDING: "pending";
    readonly COMPLETED: "completed";
    readonly FAILED: "failed";
    readonly REFUNDED: "refunded";
    readonly CANCELLED: "cancelled";
};
export declare const INVOICE_STATUS: {
    readonly PENDING: "pending";
    readonly PAID: "paid";
    readonly OVERDUE: "overdue";
    readonly CANCELLED: "cancelled";
};
export declare const USER_ROLES: {
    readonly ADMIN: "admin";
    readonly EXHIBITOR: "exhibitor";
};
export declare const CHART_COLORS: readonly ["#5C7AEA", "#4AD991", "#F8C76B", "#F76C6C", "#9B59B6", "#1ABC9C"];
export declare const TIMEOUT_CONSTANTS: {
    readonly API_REQUEST: 10000;
    readonly DATABASE_QUERY: 5000;
    readonly EVENT_STATISTICS: 5000;
    readonly COSTING_SUMMARY: 3000;
    readonly PROPOSALS: 3000;
    readonly PAYMENTS: 5000;
};
export declare const DASHBOARD_CONSTANTS: {
    readonly MAX_EVENTS_FOR_OVERVIEW: 3;
    readonly MAX_EVENTS_FOR_QUICK_LOAD: 6;
    readonly CHART_HEIGHT: 260;
    readonly MAX_HISTORY_SIZE: 100;
};
//# sourceMappingURL=constants.d.ts.map