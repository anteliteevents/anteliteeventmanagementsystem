"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class EventModel {
    /**
     * Get event by ID
     */
    async findById(id) {
        const query = `
      SELECT 
        id,
        name,
        description,
        start_date as "startDate",
        end_date as "endDate",
        venue,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM events 
      WHERE id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        if (!result.rows[0])
            return null;
        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            venue: row.venue,
            status: row.status,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        };
    }
    /**
     * Get all events with optional filters
     */
    async findAll(filters) {
        let query = `
      SELECT 
        id,
        name,
        description,
        start_date as "startDate",
        end_date as "endDate",
        venue,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM events 
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 0;
        if (filters?.status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(filters.status);
        }
        if (filters?.startDate) {
            paramCount++;
            query += ` AND start_date >= $${paramCount}`;
            params.push(filters.startDate);
        }
        if (filters?.endDate) {
            paramCount++;
            query += ` AND end_date <= $${paramCount}`;
            params.push(filters.endDate);
        }
        if (filters?.search) {
            paramCount++;
            query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR venue ILIKE $${paramCount})`;
            params.push(`%${filters.search}%`);
        }
        query += ` ORDER BY start_date DESC`;
        const result = await database_1.default.query(query, params);
        return result.rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            venue: row.venue,
            status: row.status,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        }));
    }
    /**
     * Get all active/published events
     */
    async findActive() {
        const query = `
      SELECT 
        id,
        name,
        description,
        start_date as "startDate",
        end_date as "endDate",
        venue,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM events 
      WHERE status IN ('published', 'active')
      ORDER BY start_date ASC
    `;
        const result = await database_1.default.query(query);
        return result.rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            venue: row.venue,
            status: row.status,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        }));
    }
    /**
     * Create a new event
     */
    async create(eventData) {
        const query = `
      INSERT INTO events (name, description, start_date, end_date, venue, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id,
        name,
        description,
        start_date as "startDate",
        end_date as "endDate",
        venue,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
        const result = await database_1.default.query(query, [
            eventData.name,
            eventData.description || null,
            eventData.startDate,
            eventData.endDate,
            eventData.venue || null,
            eventData.status || 'draft'
        ]);
        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            venue: row.venue,
            status: row.status,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        };
    }
    /**
     * Update an event
     */
    async update(id, eventData) {
        const updates = [];
        const params = [];
        let paramCount = 0;
        if (eventData.name !== undefined) {
            paramCount++;
            updates.push(`name = $${paramCount}`);
            params.push(eventData.name);
        }
        if (eventData.description !== undefined) {
            paramCount++;
            updates.push(`description = $${paramCount}`);
            params.push(eventData.description);
        }
        if (eventData.startDate !== undefined) {
            paramCount++;
            updates.push(`start_date = $${paramCount}`);
            params.push(eventData.startDate);
        }
        if (eventData.endDate !== undefined) {
            paramCount++;
            updates.push(`end_date = $${paramCount}`);
            params.push(eventData.endDate);
        }
        if (eventData.venue !== undefined) {
            paramCount++;
            updates.push(`venue = $${paramCount}`);
            params.push(eventData.venue);
        }
        if (eventData.status !== undefined) {
            paramCount++;
            updates.push(`status = $${paramCount}`);
            params.push(eventData.status);
        }
        if (updates.length === 0) {
            return this.findById(id);
        }
        paramCount++;
        params.push(id);
        const query = `
      UPDATE events 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING 
        id,
        name,
        description,
        start_date as "startDate",
        end_date as "endDate",
        venue,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
        const result = await database_1.default.query(query, params);
        if (!result.rows[0])
            return null;
        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            venue: row.venue,
            status: row.status,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        };
    }
    /**
     * Delete an event
     */
    async delete(id) {
        const query = 'DELETE FROM events WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    /**
     * Get event statistics
     */
    async getStatistics(eventId) {
        const query = `
      SELECT 
        COUNT(b.id) as total_booths,
        COUNT(CASE WHEN b.status = 'available' THEN 1 END) as available_booths,
        COUNT(CASE WHEN b.status = 'reserved' THEN 1 END) as reserved_booths,
        COUNT(CASE WHEN b.status = 'booked' THEN 1 END) as booked_booths,
        COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END), 0) as total_revenue
      FROM events e
      LEFT JOIN booths b ON b.event_id = e.id
      LEFT JOIN reservations r ON r.booth_id = b.id
      LEFT JOIN transactions t ON t.reservation_id = r.id
      WHERE e.id = $1
      GROUP BY e.id
    `;
        const result = await database_1.default.query(query, [eventId]);
        if (!result.rows[0]) {
            return {
                totalBooths: 0,
                availableBooths: 0,
                reservedBooths: 0,
                bookedBooths: 0,
                totalRevenue: 0
            };
        }
        const row = result.rows[0];
        return {
            totalBooths: parseInt(row.total_booths) || 0,
            availableBooths: parseInt(row.available_booths) || 0,
            reservedBooths: parseInt(row.reserved_booths) || 0,
            bookedBooths: parseInt(row.booked_booths) || 0,
            totalRevenue: parseFloat(row.total_revenue) || 0
        };
    }
}
exports.default = new EventModel();
//# sourceMappingURL=event.model.js.map