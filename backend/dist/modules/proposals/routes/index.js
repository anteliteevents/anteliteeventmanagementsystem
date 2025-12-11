"use strict";
/**
 * Proposals Module Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proposals_service_1 = __importDefault(require("../services/proposals.service"));
const auth_1 = require("../../../core/auth");
const feature_flags_1 = require("../../../core/feature-flags");
const router = (0, express_1.Router)();
/**
 * Create proposal
 * POST /api/proposals
 */
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
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
        const proposal = await proposals_service_1.default.createProposal({
            eventId,
            title,
            description,
            templateId,
        });
        res.json({
            success: true,
            data: proposal
        });
    }
    catch (error) {
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
router.get('/event/:eventId', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
            });
        }
        const proposals = await proposals_service_1.default.getEventProposals(req.params.eventId, {
            status: req.query.status,
        });
        res.json({
            success: true,
            data: proposals
        });
    }
    catch (error) {
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
router.post('/:id/submit', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
            });
        }
        const proposal = await proposals_service_1.default.submitProposal(req.params.id, req.user.id);
        res.json({
            success: true,
            data: proposal
        });
    }
    catch (error) {
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
router.post('/:id/approve', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
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
        const proposal = await proposals_service_1.default.approveProposal(req.params.id, req.user.id);
        res.json({
            success: true,
            data: proposal
        });
    }
    catch (error) {
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
router.post('/:id/reject', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
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
        const proposal = await proposals_service_1.default.rejectProposal(req.params.id, req.user.id);
        res.json({
            success: true,
            data: proposal
        });
    }
    catch (error) {
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
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
            });
        }
        const proposal = await proposals_service_1.default.getProposalById(req.params.id);
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
    }
    catch (error) {
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
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
            });
        }
        const proposal = await proposals_service_1.default.updateProposal(req.params.id, req.body);
        res.json({
            success: true,
            data: proposal
        });
    }
    catch (error) {
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
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
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
        await proposals_service_1.default.deleteProposal(req.params.id);
        res.json({
            success: true,
            message: 'Proposal deleted successfully'
        });
    }
    catch (error) {
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
router.post('/:id/duplicate', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
            });
        }
        const proposal = await proposals_service_1.default.duplicateProposal(req.params.id, req.body);
        res.status(201).json({
            success: true,
            data: proposal,
            message: 'Proposal duplicated successfully'
        });
    }
    catch (error) {
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
router.get('/templates', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
            });
        }
        const templates = await proposals_service_1.default.getTemplates(req.query.category);
        res.json({
            success: true,
            data: templates
        });
    }
    catch (error) {
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
router.get('/templates/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Proposals module is disabled' }
            });
        }
        const template = await proposals_service_1.default.getTemplateById(req.params.id);
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
    }
    catch (error) {
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
router.post('/templates', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
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
        const template = await proposals_service_1.default.createTemplate({
            name,
            description,
            content,
            category,
        });
        res.status(201).json({
            success: true,
            data: template
        });
    }
    catch (error) {
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
router.put('/templates/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
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
        const template = await proposals_service_1.default.updateTemplate(req.params.id, req.body);
        res.json({
            success: true,
            data: template
        });
    }
    catch (error) {
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
router.delete('/templates/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
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
        await proposals_service_1.default.deleteTemplate(req.params.id);
        res.json({
            success: true,
            message: 'Template deleted successfully'
        });
    }
    catch (error) {
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
router.post('/templates/:id/duplicate', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('proposals')) {
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
        const template = await proposals_service_1.default.duplicateTemplate(req.params.id, req.body);
        res.status(201).json({
            success: true,
            data: template,
            message: 'Template duplicated successfully'
        });
    }
    catch (error) {
        console.error('Error duplicating template:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: error.message }
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map