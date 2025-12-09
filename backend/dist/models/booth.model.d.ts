import { Booth } from '../types';
declare class BoothModel {
    /**
     * Get all booths for an event
     */
    findByEventId(eventId: string, filters?: {
        status?: string;
        size?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<Booth[]>;
    /**
     * Get available booths for an event
     */
    findAvailableByEventId(eventId: string): Promise<Booth[]>;
    /**
     * Get booth by ID
     */
    findById(id: string): Promise<Booth | null>;
    /**
     * Update booth status
     */
    updateStatus(id: string, status: string): Promise<Booth>;
    /**
     * Reserve a booth (update status to reserved)
     */
    reserve(id: string): Promise<Booth>;
    /**
     * Book a booth (update status to booked)
     */
    book(id: string): Promise<Booth>;
    /**
     * Release a booth (update status to available)
     */
    release(id: string): Promise<Booth>;
}
declare const _default: BoothModel;
export default _default;
//# sourceMappingURL=booth.model.d.ts.map