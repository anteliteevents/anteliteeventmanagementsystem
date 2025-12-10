"use strict";
/**
 * Monitoring Module Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monitoring_service_1 = __importDefault(require("../services/monitoring.service"));
const auth_1 = require("../../../core/auth");
const feature_flags_1 = require("../../../core/feature-flags");
const router = (0, express_1.Router)();
/**
 * Record metric
 * POST /api/monitoring/metrics
 */
router.post('/metrics', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('monitoring')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
            });
        }
        const { eventId, metricType, metricName, value, metadata } = req.body;
        if (!metricType || !metricName || value === undefined) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'metricType, metricName, and value are required' }
            });
        }
        const metric = await monitoring_service_1.default.recordMetric({
            eventId,
            metricType,
            metricName,
            value: parseFloat(value),
            metadata,
        });
        res.json({
            success: true,
            data: metric
        });
    }
    catch (error) {
        console.error('Error recording metric:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: error.message }
        });
    }
});
/**
 * Log activity
 * POST /api/monitoring/activity
 */
router.post('/activity', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('monitoring')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
            });
        }
        const { eventId, actionType, description, metadata } = req.body;
        if (!actionType) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'actionType is required' }
            });
        }
        const activity = await monitoring_service_1.default.logActivity({
            userId: req.user.id,
            eventId,
            actionType,
            description,
            metadata,
        });
        res.json({
            success: true,
            data: activity
        });
    }
    catch (error) {
        console.error('Error logging activity:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: error.message }
        });
    }
});
/**
 * Get event metrics
 * GET /api/monitoring/metrics/event/:eventId
 */
router.get('/metrics/event/:eventId', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('monitoring')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
            });
        }
        const metrics = await monitoring_service_1.default.getEventMetrics(req.params.eventId, req.query.metricType);
        res.json({
            success: true,
            data: metrics
        });
    }
    catch (error) {
        console.error('Error getting metrics:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: error.message }
        });
    }
});
/**
 * Get team activity
 * GET /api/monitoring/activity
 */
router.get('/activity', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('monitoring')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
            });
        }
        const activities = await monitoring_service_1.default.getTeamActivity({
            userId: req.query.userId,
            eventId: req.query.eventId,
            actionType: req.query.actionType,
            startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        });
        res.json({
            success: true,
            data: activities
        });
    }
    catch (error) {
        console.error('Error getting activity:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: error.message }
        });
    }
});
/**
 * Get performance summary
 * GET /api/monitoring/performance
 */
router.get('/performance', auth_1.authenticate, async (req, res) => {
    try {
        if (!feature_flags_1.featureFlags.enabled('monitoring')) {
            return res.status(503).json({
                success: false,
                error: { code: 'MODULE_DISABLED', message: 'Monitoring module is disabled' }
            });
        }
        const summary = await monitoring_service_1.default.getPerformanceSummary(req.query.eventId);
        res.json({
            success: true,
            data: summary
        });
    }
    catch (error) {
        console.error('Error getting performance summary:', error);
        res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: error.message }
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map