/**
 * Sales Service
 * 
 * Core business logic for booth sales and reservations.
 */

import pool from '../../../config/database';
import eventBus from '../../../core/event-bus';
import { featureFlags } from '../../../core/feature-flags';

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

class SalesService {
  /**
   * Reserve a booth (temporary hold)
   */
  async reserveBooth(boothId: string, eventId: string, exhibitorId: string, durationMinutes: number = 15): Promise<string> {
    if (!featureFlags.enabled('sales')) {
      throw new Error('Sales module is disabled');
    }

    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    // Update booth status
    await pool.query(
      'UPDATE booths SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND event_id = $3',
      ['reserved', boothId, eventId]
    );

    // Create reservation
    const reservationResult = await pool.query(
      `INSERT INTO reservations (booth_id, exhibitor_id, event_id, status, expires_at)
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING id`,
      [boothId, exhibitorId, eventId, expiresAt]
    );

    const reservationId = reservationResult.rows[0].id;

    // Emit event
    await eventBus.emit('boothReserved', {
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
  async bookBooth(boothId: string, eventId: string, exhibitorId: string): Promise<string> {
    if (!featureFlags.enabled('sales')) {
      throw new Error('Sales module is disabled');
    }

    // Update booth status
    await pool.query(
      'UPDATE booths SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['booked', boothId]
    );

    // Update or create reservation
    let reservationId: string;
    const existingReservation = await pool.query(
      'SELECT id FROM reservations WHERE booth_id = $1 AND exhibitor_id = $2 AND status = $3',
      [boothId, exhibitorId, 'pending']
    );

    if (existingReservation.rows.length > 0) {
      reservationId = existingReservation.rows[0].id;
      await pool.query(
        `UPDATE reservations 
         SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP, expires_at = NULL
         WHERE id = $1`,
        [reservationId]
      );
    } else {
      const result = await pool.query(
        `INSERT INTO reservations (booth_id, exhibitor_id, event_id, status, confirmed_at)
         VALUES ($1, $2, $3, 'confirmed', CURRENT_TIMESTAMP)
         RETURNING id`,
        [boothId, exhibitorId, eventId]
      );
      reservationId = result.rows[0].id;
    }

    // Emit event - other modules can listen to this
    await eventBus.emit('boothBooked', {
      boothId,
      eventId,
      exhibitorId,
      reservationId,
      module: 'sales'
    });

    // Emit status change for real-time updates
    await eventBus.emit('boothStatusChanged', {
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
  async confirmBooking(reservationId: string): Promise<void> {
    const result = await pool.query(
      `UPDATE reservations 
       SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING booth_id, event_id`,
      [reservationId]
    );

    if (result.rows.length > 0) {
      const { booth_id, event_id } = result.rows[0];
      await pool.query(
        'UPDATE booths SET status = $1 WHERE id = $2',
        ['booked', booth_id]
      );

      await eventBus.emit('boothStatusChanged', {
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
  async releaseBooth(boothId: string): Promise<void> {
    await pool.query(
      'UPDATE booths SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['available', boothId]
    );

    const reservation = await pool.query(
      'SELECT event_id FROM reservations WHERE booth_id = $1 ORDER BY created_at DESC LIMIT 1',
      [boothId]
    );

    const eventId = reservation.rows[0]?.event_id;

    await eventBus.emit('boothReleased', {
      boothId,
      eventId,
      module: 'sales'
    });

    await eventBus.emit('boothStatusChanged', {
      boothId,
      eventId,
      status: 'available',
      module: 'sales'
    });
  }

  /**
   * Get booth availability
   */
  async getAvailableBooths(eventId: string, filters?: {
    size?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<any[]> {
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
    const params: any[] = [eventId];
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

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Get booth by ID
   */
  async getBoothById(boothId: string): Promise<any | null> {
    const result = await pool.query(
      `SELECT 
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
      WHERE id = $1`,
      [boothId]
    );

    return result.rows[0] || null;
  }
}

export const salesService = new SalesService();
export default salesService;

