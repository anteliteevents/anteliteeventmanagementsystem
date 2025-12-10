"use strict";
/**
 * Costing Module Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const costing_service_1 = __importDefault(require("../services/costing.service"));
const auth_1 = require("../../../core/auth");
const feature_flags_1 = require("../../../core/feature-flags");
const router = (0, express_1.Router)();
/**
 * Add cost
 * POST /api/costing/costs
 */
router.post('/costs', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('costing')) {
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
        const cost = await costing_service_1.default.addCost({
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
    }
    catch (error) {
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
router.get('/costs/event/:eventId', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('costing')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
            });
        }
        const { eventId } = req.params;
        const { category, status, startDate, endDate } = req.query;
        const costs = await costing_service_1.default.getEventCosts(eventId, {
            category: category,
            status: status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
        res.json({
            success: true,
            data: costs
        });
    }
    catch (error) {
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
router.put('/costs/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('costing')) {
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
        const cost = await costing_service_1.default.updateCost(req.params.id, req.body);
        res.json({
            success: true,
            data: cost
        });
    }
    catch (error) {
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
router.delete('/costs/:id', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('costing')) {
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
        await costing_service_1.default.deleteCost(req.params.id);
        res.json({
            success: true,
            message: 'Cost deleted successfully'
        });
    }
    catch (error) {
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
router.post('/budget', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('costing')) {
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
        const budget = await costing_service_1.default.setBudget(eventId, category, parseFloat(allocatedAmount), currency || 'USD');
        res.json({
            success: true,
            data: budget
        });
    }
    catch (error) {
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
router.get('/budget/event/:eventId', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('costing')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
            });
        }
        const budgets = await costing_service_1.default.getEventBudget(req.params.eventId);
        res.json({
            success: true,
            data: budgets
        });
    }
    catch (error) {
        console.error('Error getting budget:', error);
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
router.get('/summary/event/:eventId', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('costing')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Costing module is disabled' }
            });
        }
        const summary = await costing_service_1.default.getCostSummary(req.params.eventId);
        res.json({
            success: true,
            data: summary
        });
    }
    catch (error) {
        console.error('Error getting cost summary:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: error.message }
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map