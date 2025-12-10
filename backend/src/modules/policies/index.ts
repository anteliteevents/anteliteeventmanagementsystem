/**
 * Policies Module
 * Handles policy management, terms & conditions, and compliance
 */

import { Router } from 'express';
import { ModuleConfig } from '../../core/module-loader';
import { eventBus } from '../../core/event-bus';
import { featureFlags } from '../../core/feature-flags';
import policiesRoutes from './routes';

const moduleConfig: ModuleConfig = {
  metadata: require('./module.json'),
  path: __dirname,
  
  /**
   * Register API routes
   */
  routes: (router: Router) => {
    router.use('/', policiesRoutes);
  },

  /**
   * Register event handlers
   */
  eventHandlers: {
    'policy.activated': async (data: any) => {
      console.log('✅ Policy activated:', data);
      // Could notify users, update compliance records, etc.
    },
  },

  /**
   * Initialize module
   */
  initialize: async () => {
    console.log('📋 Policies Module: Initializing...');
  },
};

export default moduleConfig;
