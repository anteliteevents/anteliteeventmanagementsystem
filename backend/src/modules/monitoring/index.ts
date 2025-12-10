/**
 * Monitoring Module
 * Handles sales team monitoring, performance metrics, and analytics
 */

import { Router } from 'express';
import { ModuleConfig } from '../../core/module-loader';
import { eventBus } from '../../core/event-bus';
import { featureFlags } from '../../core/feature-flags';
import monitoringRoutes from './routes';
import monitoringService from './services/monitoring.service';

const moduleConfig: ModuleConfig = {
  metadata: require('./module.json'),
  path: __dirname,
  
  /**
   * Register API routes
   */
  routes: (router: Router) => {
    router.use('/', monitoringRoutes);
  },

  /**
   * Register event handlers
   */
  eventHandlers: {
    'boothBooked': async (data: any) => {
      if (featureFlags.enabled('monitoring')) {
        await monitoringService.logActivity({
          userId: data.exhibitorId || 'system',
          eventId: data.eventId,
          actionType: 'booth_booked',
          description: `Booth booked: ${data.boothId}`,
          metadata: data,
        });
      }
    },
    'payment.completed': async (data: any) => {
      if (featureFlags.enabled('monitoring')) {
        await monitoringService.recordMetric({
          eventId: data.eventId,
          metricType: 'sales',
          metricName: 'payment_completed',
          value: data.amount || 0,
          metadata: data,
        });
      }
    },
  },

  /**
   * Initialize module
   */
  initialize: async () => {
    console.log('📊 Monitoring Module: Initializing...');
  },
};

export default moduleConfig;
