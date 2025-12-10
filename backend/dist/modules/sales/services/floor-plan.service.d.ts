/**
 * Floor Plan Service
 *
 * Manages SVG floor plans and booth positioning.
 */
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
declare class FloorPlanService {
    /**
     * Initialize floor plan service
     */
    initialize(): Promise<void>;
    /**
     * Get floor plan for an event
     */
    getFloorPlan(eventId: string): Promise<FloorPlanData | null>;
    /**
     * Generate SVG floor plan
     */
    generateSVG(floorPlan: FloorPlanData, booths: any[]): string;
    /**
     * Save floor plan
     */
    saveFloorPlan(eventId: string, name: string, layoutData: any): Promise<string>;
}
export declare const floorPlanService: FloorPlanService;
export default floorPlanService;
//# sourceMappingURL=floor-plan.service.d.ts.map