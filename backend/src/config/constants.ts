/**
 * Application Constants
 * 
 * Centralized constants for the application to avoid magic numbers and strings.
 */

// Database Configuration
export const DB_CONSTANTS = {
  MAX_CONNECTIONS: 20,
  IDLE_TIMEOUT_MS: 30000,
  CONNECTION_TIMEOUT_MS: 5000,
} as const;

// API Configuration
export const API_CONSTANTS = {
  DEFAULT_PORT: 3001,
  REQUEST_TIMEOUT_MS: 10000,
  MAX_REQUEST_SIZE: '10mb',
} as const;

// Authentication
export const AUTH_CONSTANTS = {
  TOKEN_EXPIRY_HOURS: 168, // 7 days
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_HASH_ROUNDS: 10,
} as const;

// Business Logic
export const BUSINESS_CONSTANTS = {
  RESERVATION_HOLD_MINUTES: 15,
  MAX_BOOTHS_PER_RESERVATION: 10,
  MIN_BOOTH_PRICE: 0,
  MAX_BOOTH_PRICE: 1000000,
} as const;

// Pagination
export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Event Status
export const EVENT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

// Booth Status
export const BOOTH_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  BOOKED: 'booked',
  UNAVAILABLE: 'unavailable',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;

// Invoice Status
export const INVOICE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EXHIBITOR: 'exhibitor',
} as const;

// Chart Colors
export const CHART_COLORS = [
  '#5C7AEA',
  '#4AD991',
  '#F8C76B',
  '#F76C6C',
  '#9B59B6',
  '#1ABC9C',
] as const;

// Timeouts (in milliseconds)
export const TIMEOUT_CONSTANTS = {
  API_REQUEST: 10000,
  DATABASE_QUERY: 5000,
  EVENT_STATISTICS: 5000,
  COSTING_SUMMARY: 3000,
  PROPOSALS: 3000,
  PAYMENTS: 5000,
} as const;

// Dashboard Configuration
export const DASHBOARD_CONSTANTS = {
  MAX_EVENTS_FOR_OVERVIEW: 3,
  MAX_EVENTS_FOR_QUICK_LOAD: 6,
  CHART_HEIGHT: 260,
  MAX_HISTORY_SIZE: 100,
} as const;

