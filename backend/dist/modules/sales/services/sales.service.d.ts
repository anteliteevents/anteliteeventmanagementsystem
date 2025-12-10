/**
 * Sales Service
 *
 * Core business logic for booth sales and reservations.
 */
export interface BoothBooking {
    boothId: string;
    eventId: string;
    exhibitorId: string;
    reservationId?: string;
}
export interface BoothStatus {
    id: string;
    status: 'available' | 'reserved' | 'booked' | 'unavailable';
    reservedUntil?: Date;
}
declare class SalesService {
    /**
     * Reserve a booth (temporary hold)
     */
    reserveBooth(boothId: string, eventId: string, exhibitorId: string, durationMinutes?: number): Promise<string>;
    /**
     * Book a booth (permanent)
     */
    bookBooth(boothId: string, eventId: string, exhibitorId: string): Promise<string>;
    /**
     * Confirm booking (after payment)
     */
    confirmBooking(reservationId: string): Promise<void>;
    /**
     * Release a booth
     */
    releaseBooth(boothId: string): Promise<void>;
    /**
     * Get booth availability
     */
    getAvailableBooths(eventId: string, filters?: {
        size?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<any[]>;
    /**
     * Get booth by ID
     */
    getBoothById(boothId: string): Promise<any | null>;
}
export declare const salesService: SalesService;
export default salesService;
//# sourceMappingURL=sales.service.d.ts.map