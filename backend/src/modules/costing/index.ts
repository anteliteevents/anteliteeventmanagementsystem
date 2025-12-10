/**
 * Costing Module
 * Handles cost tracking, budget management, and financial reporting
 */

import { Router } from 'express';
import { ModuleConfig } from '../../core/module-loader';
import { eventBus } from '../../core/event-bus';
import { featureFlags } from '../../core/feature-flags';
import costingRoutes from './routes';

const moduleConfig: ModuleConfig = {
  metadata: require('./module.json'),
  path: __dirname,
  
  /**
   * Register API routes
   */
  routes: (router: Router) => {
    router.use('/', costingRoutes);
  },

  /**
   * Register event handlers
   */
  eventHandlers: {
    'budget.exceeded': async (data: any) => {
      console.log('⚠️ Budget exceeded:', data);
      // Could send notifications, alerts, etc.
    },
    'budget.warning': async (data: any) => {
      console.log('⚠️ Budget warning:', data);
      // Could send warnings to admins
    },
  },

  /**
   * Initialize module
   */
  initialize: async () => {
    console.log('💰 Costing Module: Initializing...');
  },
};

export default moduleConfig;
