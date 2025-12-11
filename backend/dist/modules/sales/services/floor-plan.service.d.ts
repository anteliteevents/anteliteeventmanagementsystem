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
    imageUrl?: string;
    isPublished?: boolean;
    layoutData: {
        gridWidth: number;
        gridHeight: number;
        cellSize: number;
        shapes?: Array<{
            id: string;
            type: 'rectangle' | 'circle' | 'polygon';
            x: number;
            y: number;
            width: number;
            height: number;
            color?: string;
            strokeColor?: string;
            strokeWidth?: number;
            boothId?: string;
            boothNumber?: string;
            label?: string;
            metadata?: any;
        }>;
        zones?: Array<{
            id: string;
            name: string;
            color: string;
            x: number;
            y: number;
            width: number;
            height: number;
            booths: string[];
        }>;
        backgroundImage?: {
            url: string;
            opacity: number;
            x: number;
            y: number;
            scale: number;
        };
    };
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CreateFloorPlanInput {
    eventId: string;
    name: string;
    layoutData: FloorPlanData['layoutData'];
    imageUrl?: string;
    isPublished?: boolean;
}
export interface UpdateFloorPlanInput {
    name?: string;
    layoutData?: FloorPlanData['layoutData'];
    imageUrl?: string;
    isPublished?: boolean;
}
declare class FloorPlanService {
    /**
     * Initialize floor plan service
     */
    initialize(): Promise<void>;
    /**
     * Get floor plan by ID
     */
    getFloorPlanById(id: string): Promise<FloorPlanData | null>;
    /**
     * Get floor plan for an event (latest one)
     */
    getFloorPlan(eventId: string): Promise<FloorPlanData | null>;
    /**
     * Get all floor plans for an event
     */
    getFloorPlansByEvent(eventId: string): Promise<FloorPlanData[]>;
    /**
     * Generate SVG floor plan
     */
    generateSVG(floorPlan: FloorPlanData, booths: any[]): string;
    /**
     * Create floor plan
     */
    createFloorPlan(input: CreateFloorPlanInput): Promise<FloorPlanData>;
    /**
     * Update floor plan
     */
    updateFloorPlan(id: string, input: UpdateFloorPlanInput): Promise<FloorPlanData>;
    /**
     * Delete floor plan
     */
    deleteFloorPlan(id: string): Promise<boolean>;
    /**
     * Duplicate floor plan
     */
    duplicateFloorPlan(id: string, newName?: string): Promise<FloorPlanData>;
    /**
     * Save floor plan (legacy method for backward compatibility)
     */
    saveFloorPlan(eventId: string, name: string, layoutData: any): Promise<string>;
}
export declare const floorPlanService: FloorPlanService;
export default floorPlanService;
//# sourceMappingURL=floor-plan.service.d.ts.map