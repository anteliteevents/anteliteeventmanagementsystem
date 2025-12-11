"use strict";
/**
 * Application Constants
 *
 * Centralized constants for the application to avoid magic numbers and strings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DASHBOARD_CONSTANTS = exports.TIMEOUT_CONSTANTS = exports.CHART_COLORS = exports.USER_ROLES = exports.INVOICE_STATUS = exports.PAYMENT_STATUS = exports.BOOTH_STATUS = exports.EVENT_STATUS = exports.PAGINATION_CONSTANTS = exports.BUSINESS_CONSTANTS = exports.AUTH_CONSTANTS = exports.API_CONSTANTS = exports.DB_CONSTANTS = void 0;
// Database Configuration
exports.DB_CONSTANTS = {
    MAX_CONNECTIONS: 20,
    IDLE_TIMEOUT_MS: 30000,
    CONNECTION_TIMEOUT_MS: 5000,
};
// API Configuration
exports.API_CONSTANTS = {
    DEFAULT_PORT: 3001,
    REQUEST_TIMEOUT_MS: 10000,
    MAX_REQUEST_SIZE: '10mb',
};
// Authentication
exports.AUTH_CONSTANTS = {
    TOKEN_EXPIRY_HOURS: 168, // 7 days
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_HASH_ROUNDS: 10,
};
// Business Logic
exports.BUSINESS_CONSTANTS = {
    RESERVATION_HOLD_MINUTES: 15,
    MAX_BOOTHS_PER_RESERVATION: 10,
    MIN_BOOTH_PRICE: 0,
    MAX_BOOTH_PRICE: 1000000,
};
// Pagination
exports.PAGINATION_CONSTANTS = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE: 1,
};
// Event Status
exports.EVENT_STATUS = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PUBLISHED: 'published',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
};
// Booth Status
exports.BOOTH_STATUS = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    BOOKED: 'booked',
    UNAVAILABLE: 'unavailable',
};
// Payment Status
exports.PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled',
};
// Invoice Status
exports.INVOICE_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    OVERDUE: 'overdue',
    CANCELLED: 'cancelled',
};
// User Roles
exports.USER_ROLES = {
    ADMIN: 'admin',
    EXHIBITOR: 'exhibitor',
};
// Chart Colors
exports.CHART_COLORS = [
    '#5C7AEA',
    '#4AD991',
    '#F8C76B',
    '#F76C6C',
    '#9B59B6',
    '#1ABC9C',
];
// Timeouts (in milliseconds)
exports.TIMEOUT_CONSTANTS = {
    API_REQUEST: 10000,
    DATABASE_QUERY: 5000,
    EVENT_STATISTICS: 5000,
    COSTING_SUMMARY: 3000,
    PROPOSALS: 3000,
    PAYMENTS: 5000,
};
// Dashboard Configuration
exports.DASHBOARD_CONSTANTS = {
    MAX_EVENTS_FOR_OVERVIEW: 3,
    MAX_EVENTS_FOR_QUICK_LOAD: 6,
    CHART_HEIGHT: 260,
    MAX_HISTORY_SIZE: 100,
};
//# sourceMappingURL=constants.js.map