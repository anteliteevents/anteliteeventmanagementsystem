/**
 * Monitoring Module Routes
 */

import { Router, Request, Response } from 'express';
import monitoringService from '../services/monitoring.service';
import { authenticate } from '../../../core/auth';
import { featureFlags } from '../../../core/feature-flags';

const router = Router();

/**
 * Record metric
 * POST /api/monitoring/metrics
 */
router.post('/metrics', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('monitoring')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
      });
    }

    const { eventId, metricType, metricName, value, metadata } = req.body;

    if (!metricType || !metricName || value === undefined) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'metricType, metricName, and value are required' }
      });
    }

    const metric = await monitoringService.recordMetric({
      eventId,
      metricType,
      metricName,
      value: parseFloat(value),
      metadata,
    });

    res.json({
      success: true,
      data: metric
    });
  } catch (error: any) {
    console.error('Error recording metric:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Log activity
 * POST /api/monitoring/activity
 */
router.post('/activity', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('monitoring')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
      });
    }

    const { eventId, actionType, description, metadata } = req.body;

    if (!actionType) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'actionType is required' }
      });
    }

    const activity = await monitoringService.logActivity({
      userId: req.user.id,
      eventId,
      actionType,
      description,
      metadata,
    });

    res.json({
      success: true,
      data: activity
    });
  } catch (error: any) {
    console.error('Error logging activity:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get event metrics
 * GET /api/monitoring/metrics/event/:eventId
 */
router.get('/metrics/event/:eventId', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('monitoring')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
      });
    }

    const metrics = await monitoringService.getEventMetrics(
      req.params.eventId,
      req.query.metricType as string
    );

    res.json({
      success: true,
      data: metrics
    });
  } catch (error: any) {
    console.error('Error getting metrics:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get team activity
 * GET /api/monitoring/activity
 */
router.get('/activity', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('monitoring')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
      });
    }

    const activities = await monitoringService.getTeamActivity({
      userId: req.query.userId as string,
      eventId: req.query.eventId as string,
      actionType: req.query.actionType as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
    });

    res.json({
      success: true,
      data: activities
    });
  } catch (error: any) {
    console.error('Error getting activity:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get performance summary
 * GET /api/monitoring/performance
 */
router.get('/performance', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('monitoring')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
      });
    }

    const summary = await monitoringService.getPerformanceSummary(
      req.query.eventId as string
    );

    res.json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    console.error('Error getting performance summary:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

export default router;

