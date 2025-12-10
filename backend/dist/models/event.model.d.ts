import { Event } from '../types';
declare class EventModel {
    /**
     * Get event by ID
     */
    findById(id: string): Promise<Event | null>;
    /**
     * Get all events with optional filters
     */
    findAll(filters?: {
        status?: string;
        startDate?: Date;
        endDate?: Date;
        search?: string;
    }): Promise<Event[]>;
    /**
     * Get all active/published events
     */
    findActive(): Promise<Event[]>;
    /**
     * Create a new event
     */
    create(eventData: {
        name: string;
        description?: string;
        startDate: Date;
        endDate: Date;
        venue?: string;
        status?: string;
    }): Promise<Event>;
    /**
     * Update an event
     */
    update(id: string, eventData: {
        name?: string;
        description?: string;
        startDate?: Date;
        endDate?: Date;
        venue?: string;
        status?: string;
    }): Promise<Event | null>;
    /**
     * Delete an event
     */
    delete(id: string): Promise<boolean>;
    /**
     * Get event statistics
     */
    getStatistics(eventId: string): Promise<{
        totalBooths: number;
        availableBooths: number;
        reservedBooths: number;
        bookedBooths: number;
        totalRevenue: number;
    }>;
}
declare const _default: EventModel;
export default _default;
//# sourceMappingURL=event.model.d.ts.map