/**
 * Floor Plan Service
 * 
 * Manages SVG floor plans and booth positioning.
 */

import pool from '../../../config/database';
import { featureFlags } from '../../../core/feature-flags';

export interface FloorPlanData {
  id: string;
  eventId: string;
  name: string;
  svgContent?: string;
  layoutData: {
    width: number;
    height: number;
    cellSize: number;
    booths: Array<{
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  };
}

class FloorPlanService {
  /**
   * Initialize floor plan service
   */
  async initialize(): Promise<void> {
    if (!featureFlags.enabled('svgFloorPlan')) {
      console.log('SVG Floor Plan feature is disabled');
      return;
    }
    console.log('Floor Plan Service initialized');
  }

  /**
   * Get floor plan for an event
   */
  async getFloorPlan(eventId: string): Promise<FloorPlanData | null> {
    const result = await pool.query(
      `SELECT 
        id,
        event_id as "eventId",
        name,
        layout_data as "layoutData",
        image_url as "imageUrl"
      FROM floor_plans
      WHERE event_id = $1
      ORDER BY created_at DESC
      LIMIT 1`,
      [eventId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const plan = result.rows[0];
    return {
      id: plan.id,
      eventId: plan.eventId,
      name: plan.name,
      layoutData: plan.layoutData || { width: 0, height: 0, cellSize: 0, booths: [] }
    };
  }

  /**
   * Generate SVG floor plan
   */
  generateSVG(floorPlan: FloorPlanData, booths: any[]): string {
    const { layoutData } = floorPlan;
    const svgWidth = layoutData.width * layoutData.cellSize;
    const svgHeight = layoutData.height * layoutData.cellSize;

    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Background
    svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="#f5f5f5" stroke="#ddd" stroke-width="2"/>`;

    // Draw booths
    booths.forEach(booth => {
      const x = (booth.locationX || 0) * layoutData.cellSize;
      const y = (booth.locationY || 0) * layoutData.cellSize;
      const width = (booth.width || 1) * layoutData.cellSize;
      const height = (booth.height || 1) * layoutData.cellSize;

      // Color based on status
      let fill = '#90EE90'; // available - light green
      if (booth.status === 'reserved') fill = '#FFD700'; // reserved - gold
      if (booth.status === 'booked') fill = '#FF6B6B'; // booked - red
      if (booth.status === 'unavailable') fill = '#CCCCCC'; // unavailable - gray

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
   * Save floor plan
   */
  async saveFloorPlan(eventId: string, name: string, layoutData: any): Promise<string> {
    const result = await pool.query(
      `INSERT INTO floor_plans (event_id, name, layout_data)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [eventId, name, JSON.stringify(layoutData)]
    );

    return result.rows[0].id;
  }
}

export const floorPlanService = new FloorPlanService();
export default floorPlanService;

