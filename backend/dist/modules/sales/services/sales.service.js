"use strict";
/**
 * Sales Service
 *
 * Core business logic for booth sales and reservations.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesService = void 0;
const database_1 = __importDefault(require("../../../config/database"));
const event_bus_1 = __importDefault(require("../../../core/event-bus"));
const feature_flags_1 = require("../../../core/feature-flags");
class SalesService {
    /**
     * Reserve a booth (temporary hold)
     */
    async reserveBooth(boothId, eventId, exhibitorId, durationMinutes = 15) {
        if (!feature_flags_1.featureFlags.enabled('sales')) {
            throw new Error('Sales module is disabled');
        }
        const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
        // Update booth status
        await database_1.default.query('UPDATE booths SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND event_id = $3', ['reserved', boothId, eventId]);
        // Create reservation
        const reservationResult = await database_1.default.query(`INSERT INTO reservations (booth_id, exhibitor_id, event_id, status, expires_at)
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING id`, [boothId, exhibitorId, eventId, expiresAt]);
        const reservationId = reservationResult.rows[0].id;
        // Emit event
        await event_bus_1.default.emit('boothReserved', {
            boothId,
            eventId,
            exhibitorId,
            reservationId,
            expiresAt,
            module: 'sales'
        });
        return reservationId;
    }
    /**
     * Book a booth (permanent)
     */
    async bookBooth(boothId, eventId, exhibitorId) {
        if (!feature_flags_1.featureFlags.enabled('sales')) {
            throw new Error('Sales module is disabled');
        }
        // Update booth status
        await database_1.default.query('UPDATE booths SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['booked', boothId]);
        // Update or create reservation
        let reservationId;
        const existingReservation = await database_1.default.query('SELECT id FROM reservations WHERE booth_id = $1 AND exhibitor_id = $2 AND status = $3', [boothId, exhibitorId, 'pending']);
        if (existingReservation.rows.length > 0) {
            reservationId = existingReservation.rows[0].id;
            await database_1.default.query(`UPDATE reservations 
         SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP, expires_at = NULL
         WHERE id = $1`, [reservationId]);
        }
        else {
            const result = await database_1.default.query(`INSERT INTO reservations (booth_id, exhibitor_id, event_id, status, confirmed_at)
         VALUES ($1, $2, $3, 'confirmed', CURRENT_TIMESTAMP)
         RETURNING id`, [boothId, exhibitorId, eventId]);
            reservationId = result.rows[0].id;
        }
        // Emit event - other modules can listen to this
        await event_bus_1.default.emit('boothBooked', {
            boothId,
            eventId,
            exhibitorId,
            reservationId,
            module: 'sales'
        });
        // Emit status change for real-time updates
        await event_bus_1.default.emit('boothStatusChanged', {
            boothId,
            eventId,
            status: 'booked',
            module: 'sales'
        });
        return reservationId;
    }
    /**
     * Confirm booking (after payment)
     */
    async confirmBooking(reservationId) {
        const result = await database_1.default.query(`UPDATE reservations 
       SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING booth_id, event_id`, [reservationId]);
        if (result.rows.length > 0) {
            const { booth_id, event_id } = result.rows[0];
            await database_1.default.query('UPDATE booths SET status = $1 WHERE id = $2', ['booked', booth_id]);
            await event_bus_1.default.emit('boothStatusChanged', {
                boothId: booth_id,
                eventId: event_id,
                status: 'booked',
                module: 'sales'
            });
        }
    }
    /**
     * Release a booth
     */
    async releaseBooth(boothId) {
        await database_1.default.query('UPDATE booths SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['available', boothId]);
        const reservation = await database_1.default.query('SELECT event_id FROM reservations WHERE booth_id = $1 ORDER BY created_at DESC LIMIT 1', [boothId]);
        const eventId = reservation.rows[0]?.event_id;
        await event_bus_1.default.emit('boothReleased', {
            boothId,
            eventId,
            module: 'sales'
        });
        await event_bus_1.default.emit('boothStatusChanged', {
            boothId,
            eventId,
            status: 'available',
            module: 'sales'
        });
    }
    /**
     * Get booth availability
     */
    async getAvailableBooths(eventId, filters) {
        let query = `
      SELECT 
        id,
        event_id as "eventId",
        booth_number as "boothNumber",
        size,
        price,
        status,
        location_x as "locationX",
        location_y as "locationY",
        width,
        height,
        description,
        amenities
      FROM booths
      WHERE event_id = $1 AND status = 'available'
    `;
        const params = [eventId];
        let paramCount = 1;
        if (filters?.size) {
            paramCount++;
            query += ` AND size = $${paramCount}`;
            params.push(filters.size);
        }
        if (filters?.minPrice !== undefined) {
            paramCount++;
            query += ` AND price >= $${paramCount}`;
            params.push(filters.minPrice);
        }
        if (filters?.maxPrice !== undefined) {
            paramCount++;
            query += ` AND price <= $${paramCount}`;
            params.push(filters.maxPrice);
        }
        query += ' ORDER BY booth_number';
        const result = await database_1.default.query(query, params);
        return result.rows;
    }
    /**
     * Get booth by ID
     */
    async getBoothById(boothId) {
        const result = await database_1.default.query(`SELECT 
        id,
        event_id as "eventId",
        booth_number as "boothNumber",
        size,
        price,
        status,
        location_x as "locationX",
        location_y as "locationY",
        width,
        height,
        description,
        amenities
      FROM booths
      WHERE id = $1`, [boothId]);
        return result.rows[0] || null;
    }
}
exports.salesService = new SalesService();
exports.default = exports.salesService;
//# sourceMappingURL=sales.service.js.map