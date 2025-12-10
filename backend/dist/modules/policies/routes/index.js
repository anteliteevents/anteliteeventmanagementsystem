"use strict";
/**
 * Policies Module Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const policies_service_1 = __importDefault(require("../services/policies.service"));
const auth_1 = require("../../../core/auth");
const feature_flags_1 = require("../../../core/feature-flags");
const router = (0, express_1.Router)();
/**
 * Create policy (Admin only)
 * POST /api/policies
 */
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('policies')) {
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
        const policy = await policies_service_1.default.createPolicy({
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
    }
    catch (error) {
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
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('policies')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
            });
        }
        const policies = await policies_service_1.default.getPolicies({
            category: req.query.category,
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        });
        res.json({
            success: true,
            data: policies
        });
    }
    catch (error) {
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
router.get('/active/:category', async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('policies')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Policies module is disabled' }
            });
        }
        const policy = await policies_service_1.default.getActivePolicy(req.params.category);
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
    }
    catch (error) {
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
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('policies')) {
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
        const policy = await policies_service_1.default.updatePolicy(req.params.id, req.body);
        res.json({
            success: true,
            data: policy
        });
    }
    catch (error) {
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
router.post('/:id/activate', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('policies')) {
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
        const policy = await policies_service_1.default.activatePolicy(req.params.id);
        res.json({
            success: true,
            data: policy
        });
    }
    catch (error) {
        console.error('Error activating policy:', error);
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
router.post('/:id/deactivate', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('policies')) {
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
        const policy = await policies_service_1.default.deactivatePolicy(req.params.id);
        res.json({
            success: true,
            data: policy
        });
    }
    catch (error) {
        console.error('Error deactivating policy:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: error.message }
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map