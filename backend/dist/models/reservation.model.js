"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class ReservationModel {
    /**
     * Create a new reservation
     */
    async create(data) {
        const query = `
      INSERT INTO reservations (booth_id, exhibitor_id, event_id, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING 
        id,
        booth_id as "boothId",
        exhibitor_id as "exhibitorId",
        event_id as "eventId",
        status,
        reserved_at as "reservedAt",
        expires_at as "expiresAt",
        confirmed_at as "confirmedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
        const result = await database_1.default.query(query, [
            data.boothId,
            data.exhibitorId,
            data.eventId,
            data.expiresAt || null,
        ]);
        return result.rows[0];
    }
    /**
     * Get reservation by ID
     */
    async findById(id) {
        const query = `
      SELECT 
        id,
        booth_id as "boothId",
        exhibitor_id as "exhibitorId",
        event_id as "eventId",
        status,
        reserved_at as "reservedAt",
        expires_at as "expiresAt",
        confirmed_at as "confirmedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM reservations WHERE id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    /**
     * Get reservation with booth details
     */
    async findByIdWithBooth(id) {
        const query = `
      SELECT 
        r.id,
        r.booth_id as "boothId",
        r.exhibitor_id as "exhibitorId",
        r.event_id as "eventId",
        r.status,
        r.reserved_at as "reservedAt",
        r.expires_at as "expiresAt",
        r.confirmed_at as "confirmedAt",
        r.created_at as "createdAt",
        r.updated_at as "updatedAt",
        b.booth_number as "boothNumber",
        b.size,
        b.price,
        b.description,
        b.amenities,
        e.name as "eventName"
      FROM reservations r
      JOIN booths b ON r.booth_id = b.id
      JOIN events e ON r.event_id = e.id
      WHERE r.id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    /**
     * Get reservations by exhibitor
     */
    async findByExhibitorId(exhibitorId) {
        const query = `
      SELECT 
        r.id,
        r.booth_id as "boothId",
        r.exhibitor_id as "exhibitorId",
        r.event_id as "eventId",
        r.status,
        r.reserved_at as "reservedAt",
        r.expires_at as "expiresAt",
        r.confirmed_at as "confirmedAt",
        r.created_at as "createdAt",
        r.updated_at as "updatedAt",
        b.booth_number as "boothNumber",
        b.size,
        b.price,
        e.name as "eventName"
      FROM reservations r
      JOIN booths b ON r.booth_id = b.id
      JOIN events e ON r.event_id = e.id
      WHERE r.exhibitor_id = $1
      ORDER BY r.created_at DESC
    `;
        const result = await database_1.default.query(query, [exhibitorId]);
        return result.rows;
    }
    /**
     * Get reservations by booth
     */
    async findByBoothId(boothId) {
        const query = `
      SELECT 
        id,
        booth_id as "boothId",
        exhibitor_id as "exhibitorId",
        event_id as "eventId",
        status,
        reserved_at as "reservedAt",
        expires_at as "expiresAt",
        confirmed_at as "confirmedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM reservations WHERE booth_id = $1 ORDER BY created_at DESC
    `;
        const result = await database_1.default.query(query, [boothId]);
        return result.rows;
    }
    /**
     * Update reservation status
     */
    async updateStatus(id, status, confirmedAt) {
        let query = `
      UPDATE reservations 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
    `;
        const params = [status, id];
        if (confirmedAt) {
            query = `
        UPDATE reservations 
        SET status = $1, confirmed_at = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING 
          id,
          booth_id as "boothId",
          exhibitor_id as "exhibitorId",
          event_id as "eventId",
          status,
          reserved_at as "reservedAt",
          expires_at as "expiresAt",
          confirmed_at as "confirmedAt",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `;
            params.splice(1, 0, confirmedAt);
        }
        else {
            query += ` WHERE id = $2 RETURNING 
        id,
        booth_id as "boothId",
        exhibitor_id as "exhibitorId",
        event_id as "eventId",
        status,
        reserved_at as "reservedAt",
        expires_at as "expiresAt",
        confirmed_at as "confirmedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"`;
        }
        const result = await database_1.default.query(query, params);
        return result.rows[0];
    }
    /**
     * Confirm a reservation
     */
    async confirm(id) {
        return this.updateStatus(id, 'confirmed', new Date());
    }
    /**
     * Cancel a reservation
     */
    async cancel(id) {
        return this.updateStatus(id, 'cancelled');
    }
    /**
     * Check if booth is already reserved
     */
    async isBoothReserved(boothId) {
        const query = `
      SELECT COUNT(*) as count 
      FROM reservations 
      WHERE booth_id = $1 
      AND status IN ('pending', 'confirmed')
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;
        const result = await database_1.default.query(query, [boothId]);
        return parseInt(result.rows[0].count) > 0;
    }
}
exports.default = new ReservationModel();
//# sourceMappingURL=reservation.model.js.map