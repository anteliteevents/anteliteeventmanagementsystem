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
  CHART_HEIGHT: 260,
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

