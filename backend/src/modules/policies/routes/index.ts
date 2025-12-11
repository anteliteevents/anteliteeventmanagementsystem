/**
 * Policies Module Routes
 */

import { Router, Request, Response } from 'express';
import policiesService from '../services/policies.service';
import { authenticate } from '../../../core/auth';
import { featureFlags } from '../../../core/feature-flags';

const router = Router();

/**
 * Create policy (Admin only)
 * POST /api/policies
 */
router.post('/', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('policies')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const { title, content, category, version, effectiveDate, expiresAt } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'title, content, and category are required' }
      });
    }

    const policy = await policiesService.createPolicy({
      title,
      content,
      category,
      version,
      effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdBy: req.user.id,
    });

    res.json({
      success: true,
      data: policy
    });
  } catch (error: any) {
    console.error('Error creating policy:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get policies
 * GET /api/policies
 */
router.get('/', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('policies')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
      });
    }

    const policies = await policiesService.getPolicies({
      category: req.query.category as string,
      isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
    });

    res.json({
      success: true,
      data: policies
    });
  } catch (error: any) {
    console.error('Error getting policies:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get active policy by category
 * GET /api/policies/active/:category
 */
router.get('/active/:category', async (req: Request, res: Response) => {
  try {
    if (!featureFlags.enabled('policies')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
      });
    }

    const policy = await policiesService.getActivePolicy(req.params.category);

    if (!policy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'No active policy found for this category' }
      });
    }

    res.json({
      success: true,
      data: policy
    });
  } catch (error: any) {
    console.error('Error getting active policy:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Update policy (Admin only)
 * PUT /api/policies/:id
 */
router.put('/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('policies')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const policy = await policiesService.updatePolicy(req.params.id, req.body);

    res.json({
      success: true,
      data: policy
    });
  } catch (error: any) {
    console.error('Error updating policy:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Activate policy (Admin only)
 * POST /api/policies/:id/activate
 */
router.post('/:id/activate', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('policies')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const policy = await policiesService.activatePolicy(req.params.id);

    res.json({
      success: true,
      data: policy
    });
  } catch (error: any) {
    console.error('Error activating policy:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get policy by ID
 * GET /api/policies/:id
 */
router.get('/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('policies')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
      });
    }

    const policy = await policiesService.getPolicyById(req.params.id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Policy not found' }
      });
    }

    res.json({
      success: true,
      data: policy
    });
  } catch (error: any) {
    console.error('Error getting policy:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Deactivate policy (Admin only)
 * POST /api/policies/:id/deactivate
 */
router.post('/:id/deactivate', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('policies')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const policy = await policiesService.deactivatePolicy(req.params.id);

    res.json({
      success: true,
      data: policy
    });
  } catch (error: any) {
    console.error('Error deactivating policy:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Delete policy (Admin only)
 * DELETE /api/policies/:id
 */
router.delete('/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('policies')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    await policiesService.deletePolicy(req.params.id);

    res.json({
      success: true,
      message: 'Policy deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting policy:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Duplicate policy (Admin only)
 * POST /api/policies/:id/duplicate
 */
router.post('/:id/duplicate', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('policies')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const policy = await policiesService.duplicatePolicy(req.params.id, req.body);

    res.status(201).json({
      success: true,
      data: policy,
      message: 'Policy duplicated successfully'
    });
  } catch (error: any) {
    console.error('Error duplicating policy:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

export default router;

