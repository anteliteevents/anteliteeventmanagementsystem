/**
 * Payments Module
 * Handles payment processing, Stripe integration, and invoice management
 */

import { Router } from 'express';
import { ModuleConfig } from '../../core/module-loader';
import { eventBus } from '../../core/event-bus';
import { featureFlags } from '../../core/feature-flags';
import paymentRoutes from './routes';
import paymentService from './services/payment.service';

const moduleConfig: ModuleConfig = {
  metadata: require('./module.json'),
  path: __dirname,
  
  /**
   * Register API routes
   */
  routes: (router: Router) => {
    // Mount payment routes directly on the provided router
    router.use('/', paymentRoutes);
  },

  /**
   * Register event handlers
   */
  eventHandlers: {
    'boothBooked': async (data: any) => {
      if (featureFlags.enabled('payments')) {
        console.log('💰 Payments: Booth booked event received', data);
        // Auto-generate invoice when booth is booked
        try {
          if (data.reservationId) {
            await paymentService.generateInvoice(data.reservationId);
          }
        } catch (error) {
          console.error('Error generating invoice on booth booking:', error);
        }
      }
    },
  },

  /**
   * Initialize module
   */
  initialize: async () => {
    console.log('📦 Payments Module: Initializing...');
  },
};

export default moduleConfig;
