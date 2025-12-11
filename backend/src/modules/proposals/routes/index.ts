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
 * Get proposal by ID
 * GET /api/proposals/:id
 */
router.get('/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    const proposal = await proposalsService.getProposalById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Proposal not found' }
      });
    }

    res.json({
      success: true,
      data: proposal
    });
  } catch (error: any) {
    console.error('Error getting proposal:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Update proposal
 * PUT /api/proposals/:id
 */
router.put('/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    const proposal = await proposalsService.updateProposal(req.params.id, req.body);

    res.json({
      success: true,
      data: proposal
    });
  } catch (error: any) {
    console.error('Error updating proposal:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Delete proposal
 * DELETE /api/proposals/:id
 */
router.delete('/:id', authenticate, async (req: any, res: Response) => {
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

    await proposalsService.deleteProposal(req.params.id);

    res.json({
      success: true,
      message: 'Proposal deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Duplicate proposal
 * POST /api/proposals/:id/duplicate
 */
router.post('/:id/duplicate', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    const proposal = await proposalsService.duplicateProposal(req.params.id, req.body);

    res.status(201).json({
      success: true,
      data: proposal,
      message: 'Proposal duplicated successfully'
    });
  } catch (error: any) {
    console.error('Error duplicating proposal:', error);
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

/**
 * Get template by ID
 * GET /api/proposals/templates/:id
 */
router.get('/templates/:id', authenticate, async (req: any, res: Response) => {
  try {
    if (!featureFlags.enabled('proposals')) {
      return res.status(503).json({
        success: false,
        error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
      });
    }

    const template = await proposalsService.getTemplateById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Template not found' }
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error: any) {
    console.error('Error getting template:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Create template
 * POST /api/proposals/templates
 */
router.post('/templates', authenticate, async (req: any, res: Response) => {
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

    const { name, description, content, category } = req.body;

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'name and content are required' }
      });
    }

    const template = await proposalsService.createTemplate({
      name,
      description,
      content,
      category,
    });

    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error: any) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Update template
 * PUT /api/proposals/templates/:id
 */
router.put('/templates/:id', authenticate, async (req: any, res: Response) => {
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

    const template = await proposalsService.updateTemplate(req.params.id, req.body);

    res.json({
      success: true,
      data: template
    });
  } catch (error: any) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Delete template
 * DELETE /api/proposals/templates/:id
 */
router.delete('/templates/:id', authenticate, async (req: any, res: Response) => {
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

    await proposalsService.deleteTemplate(req.params.id);

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

/**
 * Duplicate template
 * POST /api/proposals/templates/:id/duplicate
 */
router.post('/templates/:id/duplicate', authenticate, async (req: any, res: Response) => {
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

    const template = await proposalsService.duplicateTemplate(req.params.id, req.body);

    res.status(201).json({
      success: true,
      data: template,
      message: 'Template duplicated successfully'
    });
  } catch (error: any) {
    console.error('Error duplicating template:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

export default router;

