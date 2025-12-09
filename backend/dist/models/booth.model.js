"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class BoothModel {
    /**
     * Get all booths for an event
     */
    async findByEventId(eventId, filters) {
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
        amenities,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM booths 
      WHERE event_id = $1
    `;
        const params = [eventId];
        let paramIndex = 2;
        if (filters?.status) {
            query += ` AND status = $${paramIndex}`;
            params.push(filters.status);
            paramIndex++;
        }
        if (filters?.size) {
            query += ` AND size = $${paramIndex}`;
            params.push(filters.size);
            paramIndex++;
        }
        if (filters?.minPrice) {
            query += ` AND price >= $${paramIndex}`;
            params.push(filters.minPrice);
            paramIndex++;
        }
        if (filters?.maxPrice) {
            query += ` AND price <= $${paramIndex}`;
            params.push(filters.maxPrice);
            paramIndex++;
        }
        query += ` ORDER BY booth_number ASC`;
        const result = await database_1.default.query(query, params);
        return result.rows;
    }
    /**
     * Get available booths for an event
     */
    async findAvailableByEventId(eventId) {
        const query = `
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
        amenities,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM booths 
      WHERE event_id = $1 AND status = 'available'
      ORDER BY booth_number ASC
    `;
        const result = await database_1.default.query(query, [eventId]);
        return result.rows;
    }
    /**
     * Get booth by ID
     */
    async findById(id) {
        const query = `
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
        amenities,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM booths WHERE id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    /**
     * Update booth status
     */
    async updateStatus(id, status) {
        const query = `
      UPDATE booths 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING 
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
        amenities,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
        const result = await database_1.default.query(query, [status, id]);
        return result.rows[0];
    }
    /**
     * Reserve a booth (update status to reserved)
     */
    async reserve(id) {
        return this.updateStatus(id, 'reserved');
    }
    /**
     * Book a booth (update status to booked)
     */
    async book(id) {
        return this.updateStatus(id, 'booked');
    }
    /**
     * Release a booth (update status to available)
     */
    async release(id) {
        return this.updateStatus(id, 'available');
    }
}
exports.default = new BoothModel();
//# sourceMappingURL=booth.model.js.map