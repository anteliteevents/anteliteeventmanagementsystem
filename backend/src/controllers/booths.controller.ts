/**
 * Booths Controller
 * Handles booth CRUD operations
 */

import { Response } from 'express';
import { AuthRequest } from '../types';
import boothModel from '../models/booth.model';
import { body, validationResult } from 'express-validator';

class BoothsController {
  /**
   * Get all booths for an event
   * GET /api/booths?eventId=xxx
   */
  async getBooths(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.query;
      
      if (!eventId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'eventId is required',
          },
        });
        return;
      }

      const booths = await boothModel.findByEventId(eventId as string);
      
      res.json({
        success: true,
        data: booths,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Get booth by ID
   * GET /api/booths/:id
   */
  async getBoothById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const booth = await boothModel.findById(id);
      
      if (!booth) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booth not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: booth,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Create a new booth
   * POST /api/booths
   */
  async createBooth(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors.array(),
          },
        });
        return;
      }

      const booth = await boothModel.create(req.body);
      
      res.status(201).json({
        success: true,
        data: booth,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Update a booth
   * PUT /api/booths/:id
   */
  async updateBooth(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors.array(),
          },
        });
        return;
      }

      const booth = await boothModel.findById(id);
      if (!booth) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booth not found',
          },
        });
        return;
      }

      const updatedBooth = await boothModel.update(id, req.body);
      
      res.json({
        success: true,
        data: updatedBooth,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Delete a booth
   * DELETE /api/booths/:id
   */
  async deleteBooth(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const booth = await boothModel.findById(id);
      if (!booth) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booth not found',
          },
        });
        return;
      }

      await boothModel.delete(id);
      
      res.json({
        success: true,
        message: 'Booth deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * Duplicate a booth
   * POST /api/booths/:id/duplicate
   */
  async duplicateBooth(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { eventId, boothNumber } = req.body;
      
      const originalBooth = await boothModel.findById(id);
      if (!originalBooth) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booth not found',
          },
        });
        return;
      }

      // Create duplicate with new booth number
      const duplicateData = {
        eventId: eventId || originalBooth.eventId,
        boothNumber: boothNumber || `${originalBooth.boothNumber}-COPY`,
        size: originalBooth.size,
        price: originalBooth.price,
        status: 'available',
        locationX: originalBooth.locationX,
        locationY: originalBooth.locationY,
        width: originalBooth.width,
        height: originalBooth.height,
        description: originalBooth.description,
        amenities: originalBooth.amenities,
      };

      const duplicatedBooth = await boothModel.create(duplicateData);
      
      res.status(201).json({
        success: true,
        data: duplicatedBooth,
        message: 'Booth duplicated successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }
}

export default new BoothsController();

