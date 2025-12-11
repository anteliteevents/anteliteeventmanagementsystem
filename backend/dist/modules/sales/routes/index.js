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
const upload_1 = require("../../../config/upload");
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
     * Get floor plan with SVG (latest for event)
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
    /**
     * POST /api/sales/floor-plans
     * Create new floor plan
     */
    router.post('/floor-plans', auth_middleware_1.authenticate, async (req, res) => {
        try {
            // Allow create even if feature flag is disabled (for backward compatibility)
            // if (!featureFlags.enabled('svgFloorPlan')) {
            //   return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
            // }
            const { eventId, name, layoutData, imageUrl } = req.body;
            if (!eventId || !name || !layoutData) {
                return res.status(400).json(gateway_1.default.error('VALIDATION_ERROR', 'eventId, name, and layoutData are required'));
            }
            // Validate layoutData structure
            if (!layoutData.gridWidth || !layoutData.gridHeight || !layoutData.cellSize) {
                return res.status(400).json(gateway_1.default.error('VALIDATION_ERROR', 'layoutData must include gridWidth, gridHeight, and cellSize'));
            }
            const floorPlan = await floor_plan_service_1.floorPlanService.createFloorPlan({
                eventId,
                name,
                layoutData,
                imageUrl
            });
            res.json(gateway_1.default.success(floorPlan, { module: 'sales' }));
        }
        catch (error) {
            console.error('Error creating floor plan:', error);
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message || 'Failed to create floor plan'));
        }
    });
    /**
     * GET /api/sales/floor-plans/:id
     * Get floor plan by ID
     */
    router.get('/floor-plans/:id', auth_middleware_1.authenticate, async (req, res) => {
        try {
            if (!feature_flags_1.featureFlags.enabled('svgFloorPlan')) {
                return res.status(503).json(gateway_1.default.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
            }
            const floorPlan = await floor_plan_service_1.floorPlanService.getFloorPlanById(req.params.id);
            if (!floorPlan) {
                return res.status(404).json(gateway_1.default.error('NOT_FOUND', 'Floor plan not found'));
            }
            res.json(gateway_1.default.success(floorPlan, { module: 'sales' }));
        }
        catch (error) {
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message));
        }
    });
    /**
     * GET /api/sales/floor-plans/event/:eventId
     * Get all floor plans for an event
     */
    router.get('/floor-plans/event/:eventId', auth_middleware_1.authenticate, async (req, res) => {
        try {
            // Check if feature is enabled, but allow access even if disabled (for backward compatibility)
            if (!feature_flags_1.featureFlags.enabled('svgFloorPlan')) {
                // Return empty array instead of error if feature is disabled
                return res.json(gateway_1.default.success([], { module: 'sales' }));
            }
            const floorPlans = await floor_plan_service_1.floorPlanService.getFloorPlansByEvent(req.params.eventId);
            res.json(gateway_1.default.success(floorPlans, { module: 'sales' }));
        }
        catch (error) {
            // If no floor plans exist, return empty array instead of error
            if (error.message?.includes('not found') || error.message?.includes('No floor plans')) {
                return res.json(gateway_1.default.success([], { module: 'sales' }));
            }
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message));
        }
    });
    /**
     * PUT /api/sales/floor-plans/:id
     * Update floor plan
     */
    router.put('/floor-plans/:id', auth_middleware_1.authenticate, async (req, res) => {
        try {
            // Allow update even if feature flag is disabled (for backward compatibility)
            // if (!featureFlags.enabled('svgFloorPlan')) {
            //   return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
            // }
            const { name, layoutData, imageUrl } = req.body;
            const floorPlan = await floor_plan_service_1.floorPlanService.updateFloorPlan(req.params.id, {
                name,
                layoutData,
                imageUrl
            });
            res.json(gateway_1.default.success(floorPlan, { module: 'sales' }));
        }
        catch (error) {
            if (error.message === 'Floor plan not found' || error.message?.includes('not found')) {
                return res.status(404).json(gateway_1.default.error('NOT_FOUND', error.message || 'Floor plan not found'));
            }
            console.error('Error updating floor plan:', error);
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message || 'Failed to update floor plan'));
        }
    });
    /**
     * DELETE /api/sales/floor-plans/:id
     * Delete floor plan
     */
    router.delete('/floor-plans/:id', auth_middleware_1.authenticate, async (req, res) => {
        try {
            if (!feature_flags_1.featureFlags.enabled('svgFloorPlan')) {
                return res.status(503).json(gateway_1.default.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
            }
            const deleted = await floor_plan_service_1.floorPlanService.deleteFloorPlan(req.params.id);
            if (!deleted) {
                return res.status(404).json(gateway_1.default.error('NOT_FOUND', 'Floor plan not found'));
            }
            res.json(gateway_1.default.success({ deleted: true }, { module: 'sales' }));
        }
        catch (error) {
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message));
        }
    });
    /**
     * POST /api/sales/floor-plans/:id/duplicate
     * Duplicate floor plan
     */
    router.post('/floor-plans/:id/duplicate', auth_middleware_1.authenticate, async (req, res) => {
        try {
            if (!feature_flags_1.featureFlags.enabled('svgFloorPlan')) {
                return res.status(503).json(gateway_1.default.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
            }
            const { name } = req.body;
            const floorPlan = await floor_plan_service_1.floorPlanService.duplicateFloorPlan(req.params.id, name);
            res.json(gateway_1.default.success(floorPlan, { module: 'sales' }));
        }
        catch (error) {
            if (error.message === 'Floor plan not found') {
                return res.status(404).json(gateway_1.default.error('NOT_FOUND', error.message));
            }
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message));
        }
    });
    /**
     * POST /api/sales/floor-plans/upload-image
     * Upload floor plan background image
     */
    router.post('/floor-plans/upload-image', auth_middleware_1.authenticate, upload_1.upload.single('image'), async (req, res) => {
        try {
            // Allow upload even if feature flag is disabled (for backward compatibility)
            // if (!featureFlags.enabled('svgFloorPlan')) {
            //   return res.status(503).json(apiGateway.error('FEATURE_DISABLED', 'SVG Floor Plan feature is disabled'));
            // }
            if (!req.file) {
                // Check if it's a multer error
                if (req.file === undefined && req.multerError) {
                    return res.status(400).json(gateway_1.default.error('VALIDATION_ERROR', req.multerError.message || 'Invalid file'));
                }
                return res.status(400).json(gateway_1.default.error('VALIDATION_ERROR', 'No image file provided. Please select an image file.'));
            }
            const fileUrl = (0, upload_1.getFileUrl)(req.file.filename);
            // Return full URL (adjust based on your server setup)
            // Use the request origin for the base URL to support different deployments
            const protocol = req.protocol || 'https';
            const host = req.get('host') || process.env.API_URL || `localhost:${process.env.PORT || 3001}`;
            const baseUrl = process.env.API_URL || `${protocol}://${host}`;
            const fullUrl = `${baseUrl}${fileUrl}`;
            res.json(gateway_1.default.success({
                filename: req.file.filename,
                url: fullUrl,
                originalName: req.file.originalname,
                size: req.file.size
            }, { module: 'sales' }));
        }
        catch (error) {
            console.error('Upload error:', error);
            // Handle multer errors
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json(gateway_1.default.error('VALIDATION_ERROR', 'File size exceeds 10MB limit'));
            }
            if (error.message?.includes('Invalid file type')) {
                return res.status(400).json(gateway_1.default.error('VALIDATION_ERROR', error.message));
            }
            res.status(500).json(gateway_1.default.error('INTERNAL_ERROR', error.message || 'Failed to upload image'));
        }
    });
}
// Import pool for the floor-plan route
const database_1 = __importDefault(require("../../../core/database"));
//# sourceMappingURL=index.js.map