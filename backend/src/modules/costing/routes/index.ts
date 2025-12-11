/**
 * Costing Module Routes
 */

import { Router, Request, Response } from 'express';
import costingService from '../services/costing.service';
import { authenticate } from '../../../core/auth';
import { featureFlags } from '../../../core/feature-flags';

const router = Router();

/**
 * Add cost
 * POST /api/costing/costs
 */
router.post('/costs', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const { eventId, category, description, amount, currency, vendor, date } = req.body;

    if (!eventId || !category || !description || !amount) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'eventId, category, description, and amount are required' }
      });
    }

    const cost = await costingService.addCost({
      eventId,
      category,
      description,
      amount: parseFloat(amount),
      currency,
      vendor,
      date: date ? new Date(date) : undefined,
    });

    res.json({
      success: true,
      data: cost
    });
  } catch (error: any) {
    console.error('Error adding cost:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get event costs
 * GET /api/costing/costs/event/:eventId
 */
router.get('/costs/event/:eventId', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    const { eventId } = req.params;
    const { category, status, startDate, endDate } = req.query;

    const costs = await costingService.getEventCosts(eventId, {
      category: category as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.json({
      success: true,
      data: costs
    });
  } catch (error: any) {
    console.error('Error getting costs:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Update cost
 * PUT /api/costing/costs/:id
 */
router.put('/costs/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const cost = await costingService.updateCost(req.params.id, req.body);

    res.json({
      success: true,
      data: cost
    });
  } catch (error: any) {
    console.error('Error updating cost:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Delete cost
 * DELETE /api/costing/costs/:id
 */
router.delete('/costs/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    await costingService.deleteCost(req.params.id);

    res.json({
      success: true,
      message: 'Cost deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting cost:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Set budget
 * POST /api/costing/budget
 */
router.post('/budget', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const { eventId, category, allocatedAmount, currency } = req.body;

    if (!eventId || !category || !allocatedAmount) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'eventId, category, and allocatedAmount are required' }
      });
    }

    const budget = await costingService.setBudget(
      eventId,
      category,
      parseFloat(allocatedAmount),
      currency || 'USD'
    );

    res.json({
      success: true,
      data: budget
    });
  } catch (error: any) {
    console.error('Error setting budget:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get event budget
 * GET /api/costing/budget/event/:eventId
 */
router.get('/budget/event/:eventId', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    const budgets = await costingService.getEventBudget(req.params.eventId);

    res.json({
      success: true,
      data: budgets
    });
  } catch (error: any) {
    console.error('Error getting budget:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get cost by ID
 * GET /api/costing/costs/:id
 */
router.get('/costs/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    const cost = await costingService.getCostById(req.params.id);

    if (!cost) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Cost not found' }
      });
    }

    res.json({
      success: true,
      data: cost
    });
  } catch (error: any) {
    console.error('Error getting cost:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Duplicate cost
 * POST /api/costing/costs/:id/duplicate
 */
router.post('/costs/:id/duplicate', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const cost = await costingService.duplicateCost(req.params.id, req.body);

    res.status(201).json({
      success: true,
      data: cost,
      message: 'Cost duplicated successfully'
    });
  } catch (error: any) {
    console.error('Error duplicating cost:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get cost summary
 * GET /api/costing/summary/event/:eventId
 */
router.get('/summary/event/:eventId', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    const summary = await costingService.getCostSummary(req.params.eventId);

    res.json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    console.error('Error getting cost summary:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get budget by ID
 * GET /api/costing/budget/:id
 */
router.get('/budget/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    const budget = await costingService.getBudgetById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Budget not found' }
      });
    }

    res.json({
      success: true,
      data: budget
    });
  } catch (error: any) {
    console.error('Error getting budget:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Update budget
 * PUT /api/costing/budget/:id
 */
router.put('/budget/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const budget = await costingService.updateBudget(req.params.id, req.body);

    res.json({
      success: true,
      data: budget
    });
  } catch (error: any) {
    console.error('Error updating budget:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Delete budget
 * DELETE /api/costing/budget/:id
 */
router.delete('/budget/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    await costingService.deleteBudget(req.params.id);

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting budget:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Duplicate budget
 * POST /api/costing/budget/:id/duplicate
 */
router.post('/budget/:id/duplicate', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('costing')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const budget = await costingService.duplicateBudget(req.params.id, req.body);

    res.status(201).json({
      success: true,
      data: budget,
      message: 'Budget duplicated successfully'
    });
  } catch (error: any) {
    console.error('Error duplicating budget:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

export default router;

