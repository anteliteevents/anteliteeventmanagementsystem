import { Reservation } from '../types';
declare class ReservationModel {
    /**
     * Create a new reservation
     */
    create(data: {
        boothId: string;
        exhibitorId: string;
        eventId: string;
        expiresAt?: Date;
    }): Promise<Reservation>;
    /**
     * Get reservation by ID
     */
    findById(id: string): Promise<Reservation | null>;
    /**
     * Get reservation with booth details
     */
    findByIdWithBooth(id: string): Promise<any>;
    /**
     * Get reservations by exhibitor
     */
    findByExhibitorId(exhibitorId: string): Promise<Reservation[]>;
    /**
     * Get reservations by booth
     */
    findByBoothId(boothId: string): Promise<Reservation[]>;
    /**
     * Update reservation status
     */
    updateStatus(id: string, status: string, confirmedAt?: Date): Promise<Reservation>;
    /**
     * Confirm a reservation
     */
    confirm(id: string): Promise<Reservation>;
    /**
     * Cancel a reservation
     */
    cancel(id: string): Promise<Reservation>;
    /**
     * Check if booth is already reserved
     */
    isBoothReserved(boothId: string): Promise<boolean>;
}
declare const _default: ReservationModel;
export default _default;
//# sourceMappingURL=reservation.model.d.ts.map