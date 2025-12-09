/**
 * Proposals Module Routes
 */

import { Router, Request, Response } from 'express';
import proposalsService from '../services/proposals.service';
import { authenticate } from '../../../core/auth';
import { featureFlags } from '../../../core/feature-flags';

const router = Router();

/**
 * Create proposal
 * POST /api/proposals
 */
router.post('/', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    const { eventId, title, description, templateId } = req.body;

    if (!eventId || !title) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'eventId and title are required' }
      });
    }

    const proposal = await proposalsService.createProposal({
      eventId,
      title,
      description,
      templateId,
    });

    res.json({
      success: true,
      data: proposal
    });
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get event proposals
 * GET /api/proposals/event/:eventId
 */
router.get('/event/:eventId', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    const proposals = await proposalsService.getEventProposals(req.params.eventId, {
      status: req.query.status as string,
    });

    res.json({
      success: true,
      data: proposals
    });
  } catch (error: any) {
    console.error('Error getting proposals:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Submit proposal
 * POST /api/proposals/:id/submit
 */
router.post('/:id/submit', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    const proposal = await proposalsService.submitProposal(req.params.id, req.user.id);

    res.json({
      success: true,
      data: proposal
    });
  } catch (error: any) {
    console.error('Error submitting proposal:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Approve proposal (Admin only)
 * POST /api/proposals/:id/approve
 */
router.post('/:id/approve', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const proposal = await proposalsService.approveProposal(req.params.id, req.user.id);

    res.json({
      success: true,
      data: proposal
    });
  } catch (error: any) {
    console.error('Error approving proposal:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Reject proposal (Admin only)
 * POST /api/proposals/:id/reject
 */
router.post('/:id/reject', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      });
    }

    const proposal = await proposalsService.rejectProposal(req.params.id, req.user.id);

    res.json({
      success: true,
      data: proposal
    });
  } catch (error: any) {
    console.error('Error rejecting proposal:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Get templates
 * GET /api/proposals/templates
 */
router.get('/templates', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    const templates = await proposalsService.getTemplates(req.query.category as string);

    res.json({
      success: true,
      data: templates
    });
  } catch (error: any) {
    console.error('Error getting templates:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

export default router;

