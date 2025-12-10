"use strict";
/**
 * Sales Module Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRoutes = salesRoutes;
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const sales_service_1 = require("../services/sales.service");
const floor_plan_service_1 = require("../services/floor-plan.service");
const feature_flags_1 = require("../../../core/feature-flags");
const gateway_1 = __importDefault(require("../../../api/gateway"));
function salesRoutes(router) {
    // Check if sales module is enabled
    router.use((req, res, next) => {
        if (!feature_flags_1.featureFlags.enabled('sales')) {
            return res.status(503).json(gateway_1.default.error('MODULE_DISABLED', 'Sales module is disabled'));
        }
        next();
    });
    /**
     * GET /api/sales/booths/available
     * Get available booths for an event
     */
    router.get('/booths/available', async (req, res) => {
        try {
            const { eventId, size, minPrice, maxPrice } = req.query;
            if (!eventId) {
                return res.status(400).json(gateway_1.default.error('VALIDATION_ERROR', 'eventId is required'));
            }
            const booths = await sales_service_1.salesService.getAvailableBooths(eventId, {
                size: size,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
            });
            res.json(gateway_1.default.success(booths, { module: 'sales' }));
        }
        catch (error) {
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message));
        }
    });
    /**
     * GET /api/sales/booths/:id
     * Get booth details
     */
    router.get('/booths/:id', async (req, res) => {
        try {
            const booth = await sales_service_1.salesService.getBoothById(req.params.id);
            if (!booth) {
                return res.status(404).json(gateway_1.default.error('NOT_FOUND', 'Booth not found'));
            }
            res.json(gateway_1.default.success(booth, { module: 'sales' }));
        }
        catch (error) {
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message));
        }
    });
    /**
     * POST /api/sales/booths/reserve
     * Reserve a booth (temporary hold)
     */
    router.post('/booths/reserve', auth_middleware_1.authenticate, async (req, res) => {
        try {
            const { boothId, eventId, durationMinutes } = req.body;
            const exhibitorId = req.user?.id;
            if (!boothId || !eventId || !exhibitorId) {
                return res.status(400).json(gateway_1.default.error('VALIDATION_ERROR', 'Missing required fields'));
            }
            const reservationId = await sales_service_1.salesService.reserveBooth(boothId, eventId, exhibitorId, durationMinutes || 15);
            res.json(gateway_1.default.success({ reservationId }, { module: 'sales' }));
        }
        catch (error) {
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message));
        }
    });
    /**
     * POST /api/sales/booths/book
     * Book a booth (permanent)
     */
    router.post('/booths/book', auth_middleware_1.authenticate, async (req, res) => {
        try {
            const { boothId, eventId } = req.body;
            const exhibitorId = req.user?.id;
            if (!boothId || !eventId || !exhibitorId) {
                return res.status(400).json(gateway_1.default.error('VALIDATION_ERROR', 'Missing required fields'));
            }
            const reservationId = await sales_service_1.salesService.bookBooth(boothId, eventId, exhibitorId);
            res.json(gateway_1.default.success({ reservationId }, { module: 'sales' }));
        }
        catch (error) {
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message));
        }
    });
    /**
     * GET /api/sales/floor-plan/:eventId
     * Get floor plan with SVG
     */
    router.get('/floor-plan/:eventId', async (req, res) => {
        try {
            if (!feature_flags_1.featureFlags.enabled('svgFloorPlan')) {
                return res.status(503).json(gateway_1.default.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
            }
            const { eventId } = req.params;
            const floorPlan = await floor_plan_service_1.floorPlanService.getFloorPlan(eventId);
            if (!floorPlan) {
                return res.status(404).json(gateway_1.default.error('NOT_FOUND', 'Floor plan not found'));
            }
            // Get all booths for this event
            const booths = await sales_service_1.salesService.getAvailableBooths(eventId);
            const allBooths = await database_1.default.query('SELECT * FROM booths WHERE event_id = $1', [eventId]);
            // Generate SVG
            const svgContent = floor_plan_service_1.floorPlanService.generateSVG(floorPlan, allBooths.rows);
            res.json(gateway_1.default.success({
                ...floorPlan,
                svgContent,
                booths: booths
            }, { module: 'sales' }));
        }
        catch (error) {
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message));
        }
    });
}
// Import pool for the floor-plan route
const database_1 = __importDefault(require("../../../core/database"));
//# sourceMappingURL=index.js.map