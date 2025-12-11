/**
 * Frontend Constants
 * 
 * Centralized constants for the frontend application.
 */

// Chart Colors (matching backend)
export const CHART_COLORS = [
  '#5C7AEA',
  '#4AD991',
  '#F8C76B',
  '#F76C6C',
  '#9B59B6',
  '#1ABC9C',
] as const;

// Dashboard Configuration
export const DASHBOARD_CONSTANTS = {
  MAX_EVENTS_FOR_OVERVIEW: 3,
  MAX_EVENTS_FOR_QUICK_LOAD: 6,
  MAX_EVENTS_FOR_SALES: 10, // Limit events for sales view
  MAX_EVENTS_FOR_COSTING: 10, // Limit events for costing view
  MAX_TRANSACTIONS: 20, // Limit transactions displayed
  MAX_INVOICES: 20, // Limit invoices displayed
  MAX_ACTIVITIES: 50, // Limit activities displayed
  MAX_PROPOSALS: 20, // Limit proposals displayed
  CHART_HEIGHT: 260,
  CACHE_DURATION: 30000, // 30 seconds cache
} as const;

// API Timeouts (in milliseconds)
export const API_TIMEOUTS = {
  DEFAULT: 10000,
  EVENT_STATISTICS: 5000,
  COSTING_SUMMARY: 3000,
  PROPOSALS: 3000,
  PAYMENTS: 5000,
} as const;

// View Titles
export const VIEW_TITLES: Record<string, string> = {
  overview: '📊 Dashboard Overview',
  sales: '💰 Sales Department',
  payments: '💳 Payments Department',
  costing: '💰 Costing Department',
  proposals: '📄 Proposals Department',
  monitoring: '📊 Monitoring Department',
  policies: '📋 Policies Department',
  events: '📅 Events Management',
  booths: '🏢 Booth Management',
  users: '👥 User Management',
  reports: '📈 Reports & Analytics',
  settings: '⚙️ System Settings',
} as const;

