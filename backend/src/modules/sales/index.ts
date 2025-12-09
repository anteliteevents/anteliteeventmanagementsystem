/**
 * Sales Module
 * 
 * Handles booth sales, floor plans, and real-time availability updates.
 */

import { Express, Router } from 'express';
import { ModuleConfig } from '../../core/module-loader';
import eventBus from '../../core/event-bus';
import featureFlags from '../../core/feature-flags';
import { salesRoutes } from './routes';
import { salesService } from './services/sales.service';
import { floorPlanService } from './services/floor-plan.service';

// Check if module is enabled
if (!featureFlags.enabled('sales')) {
  console.log('Sales module is disabled');
}

const moduleConfig: ModuleConfig = {
  metadata: require('./module.json'),
  path: __dirname,
  
  /**
   * Register API routes
   */
  routes: (app: Express | Router) => {
    const router = Router();
    salesRoutes(router);
    app.use('/sales', router);
  },

  /**
   * Register event handlers
   */
  eventHandlers: {
    // Listen for booth booking events from other modules
    'payment.completed': async (payload) => {
      console.log('Sales module: Payment completed, confirming booth booking', payload);
      if (payload.reservationId) {
        await salesService.confirmBooking(payload.reservationId);
      }
    },

    'reservation.expired': async (payload) => {
      console.log('Sales module: Reservation expired, releasing booth', payload);
      if (payload.boothId) {
        await salesService.releaseBooth(payload.boothId);
      }
    }
  },

  /**
   * Database migrations
   */
  migrations: async () => {
    // Sales-specific migrations would go here
    console.log('Sales module: Running migrations...');
    // Example: await pool.query('CREATE TABLE IF NOT EXISTS sales...');
  },

  /**
   * Initialize module
   */
  initialize: async () => {
    console.log('Sales module: Initializing...');
    // Setup WebSocket handlers, load floor plans, etc.
    await floorPlanService.initialize();
  },

  /**
   * Shutdown module
   */
  shutdown: async () => {
    console.log('Sales module: Shutting down...');
    // Cleanup resources
  }
};

export default moduleConfig;

