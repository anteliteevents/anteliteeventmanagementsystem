/**
 * Proposals Module
 * Handles proposal creation, templates, and approval workflow
 */

import { Router } from 'express';
import { ModuleConfig } from '../../core/module-loader';
import { eventBus } from '../../core/event-bus';
import { featureFlags } from '../../core/feature-flags';
import proposalsRoutes from './routes';

const moduleConfig: ModuleConfig = {
  metadata: require('./module.json'),
  path: __dirname,
  
  /**
   * Register API routes
   */
  routes: (router: Router) => {
    router.use('/', proposalsRoutes);
  },

  /**
   * Register event handlers
   */
  eventHandlers: {
    'proposal.approved': async (data: any) => {
      console.log('✅ Proposal approved:', data);
      // Could trigger sending proposal to client, etc.
    },
  },

  /**
   * Initialize module
   */
  initialize: async () => {
    console.log('📄 Proposals Module: Initializing...');
  },
};

export default moduleConfig;
