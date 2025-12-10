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
     * Create a new booth
     */
    async create(data) {
        const query = `
      INSERT INTO booths (
        event_id, booth_number, size, price, status,
        location_x, location_y, width, height, description, amenities
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
        const result = await database_1.default.query(query, [
            data.eventId,
            data.boothNumber,
            data.size,
            data.price,
            data.status || 'available',
            data.locationX || null,
            data.locationY || null,
            data.width || 1,
            data.height || 1,
            data.description || null,
            data.amenities || null,
        ]);
        return result.rows[0];
    }
    /**
     * Update a booth
     */
    async update(id, data) {
        const updates = [];
        const values = [];
        let paramIndex = 1;
        if (data.boothNumber !== undefined) {
            updates.push(`booth_number = $${paramIndex++}`);
            values.push(data.boothNumber);
        }
        if (data.size !== undefined) {
            updates.push(`size = $${paramIndex++}`);
            values.push(data.size);
        }
        if (data.price !== undefined) {
            updates.push(`price = $${paramIndex++}`);
            values.push(data.price);
        }
        if (data.status !== undefined) {
            updates.push(`status = $${paramIndex++}`);
            values.push(data.status);
        }
        if (data.locationX !== undefined) {
            updates.push(`location_x = $${paramIndex++}`);
            values.push(data.locationX);
        }
        if (data.locationY !== undefined) {
            updates.push(`location_y = $${paramIndex++}`);
            values.push(data.locationY);
        }
        if (data.width !== undefined) {
            updates.push(`width = $${paramIndex++}`);
            values.push(data.width);
        }
        if (data.height !== undefined) {
            updates.push(`height = $${paramIndex++}`);
            values.push(data.height);
        }
        if (data.description !== undefined) {
            updates.push(`description = $${paramIndex++}`);
            values.push(data.description);
        }
        if (data.amenities !== undefined) {
            updates.push(`amenities = $${paramIndex++}`);
            values.push(data.amenities);
        }
        if (updates.length === 0) {
            return this.findById(id);
        }
        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        const query = `
      UPDATE booths 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
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
        const result = await database_1.default.query(query, values);
        return result.rows[0];
    }
    /**
     * Delete a booth
     */
    async delete(id) {
        const query = `DELETE FROM booths WHERE id = $1`;
        await database_1.default.query(query, [id]);
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