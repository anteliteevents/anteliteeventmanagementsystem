/**
 * Sales Module Routes
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../../../middleware/auth.middleware';
import { salesService } from '../services/sales.service';
import { floorPlanService } from '../services/floor-plan.service';
import { featureFlags } from '../../../core/feature-flags';
import apiGateway from '../../../api/gateway';
import { upload, getFileUrl } from '../../../config/upload';

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
      const exhibitorId = (req as any).user?.id;

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
      const exhibitorId = (req as any).user?.id;

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
   * Get floor plan with SVG (latest for event)
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

  /**
   * POST /api/sales/floor-plans
   * Create new floor plan
   */
  router.post('/floor-plans', authenticate, async (req: Request, res: Response) => {
    try {
      if (!featureFlags.enabled('svgFloorPlan')) {
        return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
      }

      const { eventId, name, layoutData, imageUrl } = req.body;

      if (!eventId || !name || !layoutData) {
        return res.status(400).json(apiGateway.error('VALIDATION_ERROR', 'eventId, name, and layoutData are required'));
      }

      const floorPlan = await floorPlanService.createFloorPlan({
        eventId,
        name,
        layoutData,
        imageUrl
      });

      res.json(apiGateway.success(floorPlan, { module: 'sales' }));
    } catch (error: any) {
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * GET /api/sales/floor-plans/:id
   * Get floor plan by ID
   */
  router.get('/floor-plans/:id', authenticate, async (req: Request, res: Response) => {
    try {
      if (!featureFlags.enabled('svgFloorPlan')) {
        return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
      }

      const floorPlan = await floorPlanService.getFloorPlanById(req.params.id);

      if (!floorPlan) {
        return res.status(404).json(apiGateway.error('NOT_FOUND', 'Floor plan not found'));
      }

      res.json(apiGateway.success(floorPlan, { module: 'sales' }));
    } catch (error: any) {
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * GET /api/sales/floor-plans/event/:eventId
   * Get all floor plans for an event
   */
  router.get('/floor-plans/event/:eventId', authenticate, async (req: Request, res: Response) => {
    try {
      // Check if feature is enabled, but allow access even if disabled (for backward compatibility)
      if (!featureFlags.enabled('svgFloorPlan')) {
        // Return empty array instead of error if feature is disabled
        return res.json(apiGateway.success([], { module: 'sales' }));
      }

      const floorPlans = await floorPlanService.getFloorPlansByEvent(req.params.eventId);

      res.json(apiGateway.success(floorPlans, { module: 'sales' }));
    } catch (error: any) {
      // If no floor plans exist, return empty array instead of error
      if (error.message?.includes('not found') || error.message?.includes('No floor plans')) {
        return res.json(apiGateway.success([], { module: 'sales' }));
      }
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * PUT /api/sales/floor-plans/:id
   * Update floor plan
   */
  router.put('/floor-plans/:id', authenticate, async (req: Request, res: Response) => {
    try {
      if (!featureFlags.enabled('svgFloorPlan')) {
        return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
      }

      const { name, layoutData, imageUrl } = req.body;

      const floorPlan = await floorPlanService.updateFloorPlan(req.params.id, {
        name,
        layoutData,
        imageUrl
      });

      res.json(apiGateway.success(floorPlan, { module: 'sales' }));
    } catch (error: any) {
      if (error.message === 'Floor plan not found') {
        return res.status(404).json(apiGateway.error('NOT_FOUND', error.message));
      }
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * DELETE /api/sales/floor-plans/:id
   * Delete floor plan
   */
  router.delete('/floor-plans/:id', authenticate, async (req: Request, res: Response) => {
    try {
      if (!featureFlags.enabled('svgFloorPlan')) {
        return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
      }

      const deleted = await floorPlanService.deleteFloorPlan(req.params.id);

      if (!deleted) {
        return res.status(404).json(apiGateway.error('NOT_FOUND', 'Floor plan not found'));
      }

      res.json(apiGateway.success({ deleted: true }, { module: 'sales' }));
    } catch (error: any) {
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * POST /api/sales/floor-plans/:id/duplicate
   * Duplicate floor plan
   */
  router.post('/floor-plans/:id/duplicate', authenticate, async (req: Request, res: Response) => {
    try {
      if (!featureFlags.enabled('svgFloorPlan')) {
        return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
      }

      const { name } = req.body;

      const floorPlan = await floorPlanService.duplicateFloorPlan(req.params.id, name);

      res.json(apiGateway.success(floorPlan, { module: 'sales' }));
    } catch (error: any) {
      if (error.message === 'Floor plan not found') {
        return res.status(404).json(apiGateway.error('NOT_FOUND', error.message));
      }
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });

  /**
   * POST /api/sales/floor-plans/upload-image
   * Upload floor plan background image
   */
  router.post('/floor-plans/upload-image', authenticate, upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!featureFlags.enabled('svgFloorPlan')) {
        return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
      }

      if (!req.file) {
        return res.status(400).json(apiGateway.error('VALIDATION_ERROR', 'No image file provided'));
      }

      const fileUrl = getFileUrl(req.file.filename);
      
      // Return full URL (adjust based on your server setup)
      const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;
      const fullUrl = `${baseUrl}${fileUrl}`;

      res.json(apiGateway.success({
        filename: req.file.filename,
        url: fullUrl,
        originalName: req.file.originalname,
        size: req.file.size
      }, { module: 'sales' }));
    } catch (error: any) {
      res.status(500).json(apiGateway.error('INTERNAL_ERROR', error.message));
    }
  });
}

// Import pool for the floor-plan route
import pool from '../../../core/database';

