/**
 * Sales Module Routes
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../../../middleware/auth.middleware';
import { salesService } from '../services/sales.service';
import { floorPlanService } from '../services/floor-plan.service';
import { featureFlags } from '../../../core/feature-flags';
import apiGateway from '../../../api/gateway';

export function salesRoutes(router: Router): void {
  // Check if sales module is enabled
  router.use((req, res, next) => {
    if (!featureFlags.enabled('sales')) {
      return res.status(503).json(apiGateway.error('MODULE_DISABLED', 'Sales module is disabled'));
    }
    next();
  });

  /**
   * GET /api/sales/booths/available
   * Get available booths for an event
   */
  router.get('/booths/available', async (req: Request, res: Response) => {
    try {
      const { eventId, size, minPrice, maxPrice } = req.query;

      if (!eventId) {
        return res.status(400).json(apiGateway.error('VALIDATION_ERROR', 'eventId is required'));
      }

      const booths = await salesService.getAvailableBooths(eventId as string, {
        size: size as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined
      });

      res.json(apiGateway.success(booths, { module: 'sales' }));
    } catch (error: any) {
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * GET /api/sales/booths/:id
   * Get booth details
   */
  router.get('/booths/:id', async (req: Request, res: Response) => {
    try {
      const booth = await salesService.getBoothById(req.params.id);

      if (!booth) {
        return res.status(404).json(apiGateway.error('NOT_FOUND', 'Booth not found'));
      }

      res.json(apiGateway.success(booth, { module: 'sales' }));
    } catch (error: any) {
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * POST /api/sales/booths/reserve
   * Reserve a booth (temporary hold)
   */
  router.post('/booths/reserve', authenticate, async (req: Request, res: Response) => {
    try {
      const { boothId, eventId, durationMinutes } = req.body;
      const exhibitorId = req.user?.id;

      if (!boothId || !eventId || !exhibitorId) {
        return res.status(400).json(apiGateway.error('VALIDATION_ERROR', 'Missing required fields'));
      }

      const reservationId = await salesService.reserveBooth(
        boothId,
        eventId,
        exhibitorId,
        durationMinutes || 15
      );

      res.json(apiGateway.success({ reservationId }, { module: 'sales' }));
    } catch (error: any) {
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * POST /api/sales/booths/book
   * Book a booth (permanent)
   */
  router.post('/booths/book', authenticate, async (req: Request, res: Response) => {
    try {
      const { boothId, eventId } = req.body;
      const exhibitorId = req.user?.id;

      if (!boothId || !eventId || !exhibitorId) {
        return res.status(400).json(apiGateway.error('VALIDATION_ERROR', 'Missing required fields'));
      }

      const reservationId = await salesService.bookBooth(boothId, eventId, exhibitorId);

      res.json(apiGateway.success({ reservationId }, { module: 'sales' }));
    } catch (error: any) {
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * GET /api/sales/floor-plan/:eventId
   * Get floor plan with SVG
   */
  router.get('/floor-plan/:eventId', async (req: Request, res: Response) => {
    try {
      if (!featureFlags.enabled('svgFloorPlan')) {
        return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
      }

      const { eventId } = req.params;
      const floorPlan = await floorPlanService.getFloorPlan(eventId);

      if (!floorPlan) {
        return res.status(404).json(apiGateway.error('NOT_FOUND', 'Floor plan not found'));
      }

      // Get all booths for this event
      const booths = await salesService.getAvailableBooths(eventId);
      const allBooths = await pool.query(
        'SELECT * FROM booths WHERE event_id = $1',
        [eventId]
      );

      // Generate SVG
      const svgContent = floorPlanService.generateSVG(floorPlan, allBooths.rows);

      res.json(apiGateway.success({
        ...floorPlan,
        svgContent,
        booths: booths
      }, { module: 'sales' }));
    } catch (error: any) {
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });
}

// Import pool for the floor-plan route
import pool from '../../../core/database';

