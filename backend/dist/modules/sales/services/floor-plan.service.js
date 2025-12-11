"use strict";
/**
 * Floor Plan Service
 *
 * Manages SVG floor plans and booth positioning.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorPlanService = void 0;
const database_1 = __importDefault(require("../../../config/database"));
const feature_flags_1 = require("../../../core/feature-flags");
class FloorPlanService {
    /**
     * Initialize floor plan service
     */
    async initialize() {
        if (!feature_flags_1.featureFlags.enabled('svgFloorPlan')) {
            console.log('SVG Floor Plan feature is disabled');
            return;
        }
        console.log('Floor Plan Service initialized');
    }
    /**
     * Get floor plan by ID
     */
    async getFloorPlanById(id) {
        const result = await database_1.default.query(`SELECT 
        id,
        event_id as "eventId",
        name,
        layout_data as "layoutData",
        image_url as "imageUrl",
        is_published as "isPublished",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM floor_plans
      WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        const plan = result.rows[0];
        return {
            id: plan.id,
            eventId: plan.eventId,
            name: plan.name,
            imageUrl: plan.imageUrl,
            isPublished: plan.isPublished || false,
            layoutData: plan.layoutData || { gridWidth: 0, gridHeight: 0, cellSize: 50 },
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt
        };
    }
    /**
     * Get floor plan for an event (latest one)
     */
    async getFloorPlan(eventId) {
        const result = await database_1.default.query(`SELECT 
        id,
        event_id as "eventId",
        name,
        layout_data as "layoutData",
        image_url as "imageUrl",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM floor_plans
      WHERE event_id = $1
      ORDER BY created_at DESC
      LIMIT 1`, [eventId]);
        if (result.rows.length === 0) {
            return null;
        }
        const plan = result.rows[0];
        return {
            id: plan.id,
            eventId: plan.eventId,
            name: plan.name,
            imageUrl: plan.imageUrl,
            layoutData: plan.layoutData || { gridWidth: 0, gridHeight: 0, cellSize: 50 },
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt
        };
    }
    /**
     * Get all floor plans for an event
     */
    async getFloorPlansByEvent(eventId) {
        try {
            const result = await database_1.default.query(`SELECT 
          id,
          event_id as "eventId",
          name,
          layout_data as "layoutData",
          image_url as "imageUrl",
          is_published as "isPublished",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM floor_plans
        WHERE event_id = $1
        ORDER BY created_at DESC`, [eventId]);
            return result.rows.map(plan => ({
                id: plan.id,
                eventId: plan.eventId,
                name: plan.name,
                imageUrl: plan.imageUrl,
                isPublished: plan.isPublished || false,
                layoutData: plan.layoutData || { gridWidth: 0, gridHeight: 0, cellSize: 50 },
                createdAt: plan.createdAt,
                updatedAt: plan.updatedAt
            }));
        }
        catch (error) {
            // Return empty array if there's an error (table might not exist or no data)
            console.warn('Error fetching floor plans:', error.message);
            return [];
        }
    }
    /**
     * Generate SVG floor plan
     */
    generateSVG(floorPlan, booths) {
        const { layoutData } = floorPlan;
        const svgWidth = (layoutData.gridWidth || 20) * (layoutData.cellSize || 50);
        const svgHeight = (layoutData.gridHeight || 20) * (layoutData.cellSize || 50);
        let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
        // Background
        svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="#f5f5f5" stroke="#ddd" stroke-width="2"/>`;
        // Draw zones if they exist
        if (layoutData.zones && layoutData.zones.length > 0) {
            layoutData.zones.forEach(zone => {
                const zoneX = zone.x * (layoutData.cellSize || 50);
                const zoneY = zone.y * (layoutData.cellSize || 50);
                const zoneWidth = zone.width * (layoutData.cellSize || 50);
                const zoneHeight = zone.height * (layoutData.cellSize || 50);
                svg += `
          <rect 
            x="${zoneX}" 
            y="${zoneY}" 
            width="${zoneWidth}" 
            height="${zoneHeight}" 
            fill="${zone.color || '#E3F2FD'}" 
            fill-opacity="0.3"
            stroke="${zone.color || '#2196F3'}" 
            stroke-width="2"
            stroke-dasharray="5,5"
          />
          <text 
            x="${zoneX + zoneWidth / 2}" 
            y="${zoneY + 20}" 
            text-anchor="middle" 
            font-size="14"
            font-weight="bold"
            fill="${zone.color || '#2196F3'}"
          >
            ${zone.name}
          </text>
        `;
            });
        }
        // Draw booths
        booths.forEach(booth => {
            const x = (booth.location_x || booth.locationX || 0) * (layoutData.cellSize || 50);
            const y = (booth.location_y || booth.locationY || 0) * (layoutData.cellSize || 50);
            const width = (booth.width || 1) * (layoutData.cellSize || 50);
            const height = (booth.height || 1) * (layoutData.cellSize || 50);
            // Color based on status
            let fill = '#90EE90'; // available - light green
            if (booth.status === 'reserved')
                fill = '#FFD700'; // reserved - gold
            if (booth.status === 'booked')
                fill = '#FF6B6B'; // booked - red
            if (booth.status === 'unavailable')
                fill = '#CCCCCC'; // unavailable - gray
            svg += `
        <g class="booth" data-booth-id="${booth.id}" data-status="${booth.status}">
          <rect 
            x="${x}" 
            y="${y}" 
            width="${width}" 
            height="${height}" 
            fill="${fill}" 
            stroke="#333" 
            stroke-width="2"
            style="cursor: pointer;"
          />
          <text 
            x="${x + width / 2}" 
            y="${y + height / 2}" 
            text-anchor="middle" 
            dominant-baseline="middle"
            font-size="12"
            font-weight="bold"
          >
            ${booth.boothNumber}
          </text>
          <text 
            x="${x + width / 2}" 
            y="${y + height / 2 + 15}" 
            text-anchor="middle" 
            dominant-baseline="middle"
            font-size="10"
          >
            $${booth.price}
          </text>
        </g>
      `;
        });
        svg += '</svg>';
        return svg;
    }
    /**
     * Create floor plan
     */
    async createFloorPlan(input) {
        // Validate layout data
        if (!input.layoutData.gridWidth || !input.layoutData.gridHeight || !input.layoutData.cellSize) {
            throw new Error('layoutData must include gridWidth, gridHeight, and cellSize');
        }
        const result = await database_1.default.query(`INSERT INTO floor_plans (event_id, name, layout_data, image_url, is_published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, event_id as "eventId", name, layout_data as "layoutData", 
                 image_url as "imageUrl", is_published as "isPublished", 
                 created_at as "createdAt", updated_at as "updatedAt"`, [
            input.eventId,
            input.name,
            JSON.stringify(input.layoutData),
            input.imageUrl || null,
            input.isPublished || false
        ]);
        const plan = result.rows[0];
        return {
            id: plan.id,
            eventId: plan.eventId,
            name: plan.name,
            imageUrl: plan.imageUrl,
            isPublished: plan.isPublished || false,
            layoutData: plan.layoutData,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt
        };
    }
    /**
     * Update floor plan
     */
    async updateFloorPlan(id, input) {
        const updates = [];
        const values = [];
        let paramCount = 1;
        if (input.name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(input.name);
        }
        if (input.layoutData !== undefined) {
            updates.push(`layout_data = $${paramCount++}`);
            values.push(JSON.stringify(input.layoutData));
        }
        if (input.imageUrl !== undefined) {
            updates.push(`image_url = $${paramCount++}`);
            values.push(input.imageUrl);
        }
        if (input.isPublished !== undefined) {
            updates.push(`is_published = $${paramCount++}`);
            values.push(input.isPublished);
        }
        if (updates.length === 0) {
            throw new Error('No fields to update');
        }
        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        const result = await database_1.default.query(`UPDATE floor_plans 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, event_id as "eventId", name, layout_data as "layoutData", 
                 image_url as "imageUrl", is_published as "isPublished",
                 created_at as "createdAt", updated_at as "updatedAt"`, values);
        if (result.rows.length === 0) {
            throw new Error('Floor plan not found');
        }
        const plan = result.rows[0];
        return {
            id: plan.id,
            eventId: plan.eventId,
            name: plan.name,
            imageUrl: plan.imageUrl,
            isPublished: plan.isPublished || false,
            layoutData: plan.layoutData,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt
        };
    }
    /**
     * Delete floor plan
     */
    async deleteFloorPlan(id) {
        const result = await database_1.default.query(`DELETE FROM floor_plans WHERE id = $1 RETURNING id`, [id]);
        return result.rows.length > 0;
    }
    /**
     * Duplicate floor plan
     */
    async duplicateFloorPlan(id, newName) {
        const original = await this.getFloorPlanById(id);
        if (!original) {
            throw new Error('Floor plan not found');
        }
        const duplicateName = newName || `${original.name} (Copy)`;
        return await this.createFloorPlan({
            eventId: original.eventId,
            name: duplicateName,
            layoutData: original.layoutData,
            imageUrl: original.imageUrl
        });
    }
    /**
     * Save floor plan (legacy method for backward compatibility)
     */
    async saveFloorPlan(eventId, name, layoutData) {
        const floorPlan = await this.createFloorPlan({
            eventId,
            name,
            layoutData
        });
        return floorPlan.id;
    }
}
exports.floorPlanService = new FloorPlanService();
exports.default = exports.floorPlanService;
//# sourceMappingURL=floor-plan.service.js.map