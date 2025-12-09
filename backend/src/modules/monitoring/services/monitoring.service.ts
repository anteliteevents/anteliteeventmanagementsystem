/**
 * Monitoring Service
 * Handles sales team monitoring, performance metrics, and analytics
 */

import pool from '../../../config/database';
import { eventBus } from '../../../core/event-bus';

interface Metric {
  id: string;
  eventId?: string;
  metricType: string;
  metricName: string;
  value: number;
  metadata?: any;
  recordedAt: Date;
  createdAt: Date;
}

interface Activity {
  id: string;
  userId: string;
  eventId?: string;
  actionType: string;
  description?: string;
  metadata?: any;
  createdAt: Date;
}

class MonitoringService {
  /**
   * Record a metric
   */
  async recordMetric(data: {
    eventId?: string;
    metricType: string;
    metricName: string;
    value: number;
    metadata?: any;
  }): Promise<Metric> {
    const query = `
      INSERT INTO monitoring_metrics (
        event_id, metric_type, metric_name, value, metadata, recorded_at, created_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      data.eventId || null,
      data.metricType,
      data.metricName,
      data.value,
      data.metadata ? JSON.stringify(data.metadata) : null,
    ]);

    const metric = this.mapMetric(result.rows[0]);

    await eventBus.emit('metric.recorded', {
      metricId: metric.id,
      metricType: data.metricType,
      value: data.value,
    });

    return metric;
  }

  /**
   * Log team activity
   */
  async logActivity(data: {
    userId: string;
    eventId?: string;
    actionType: string;
    description?: string;
    metadata?: any;
  }): Promise<Activity> {
    const query = `
      INSERT INTO team_activity (
        user_id, event_id, action_type, description, metadata, created_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      data.userId,
      data.eventId || null,
      data.actionType,
      data.description || null,
      data.metadata ? JSON.stringify(data.metadata) : null,
    ]);

    const activity = this.mapActivity(result.rows[0]);

    await eventBus.emit('activity.logged', {
      activityId: activity.id,
      userId: data.userId,
      actionType: data.actionType,
    });

    return activity;
  }

  /**
   * Get metrics for an event
   */
  async getEventMetrics(eventId: string, metricType?: string): Promise<Metric[]> {
    let query = `
      SELECT * FROM monitoring_metrics
      WHERE event_id = $1
    `;
    const params: any[] = [eventId];

    if (metricType) {
      query += ` AND metric_type = $2`;
      params.push(metricType);
    }

    query += ` ORDER BY recorded_at DESC`;

    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapMetric(row));
  }

  /**
   * Get team activity
   */
  async getTeamActivity(filters?: {
    userId?: string;
    eventId?: string;
    actionType?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Activity[]> {
    let query = `
      SELECT ta.*, u.first_name, u.last_name, u.email, e.name as event_name
      FROM team_activity ta
      LEFT JOIN users u ON ta.user_id = u.id
      LEFT JOIN events e ON ta.event_id = e.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.userId) {
      query += ` AND ta.user_id = $${paramIndex}`;
      params.push(filters.userId);
      paramIndex++;
    }

    if (filters?.eventId) {
      query += ` AND ta.event_id = $${paramIndex}`;
      params.push(filters.eventId);
      paramIndex++;
    }

    if (filters?.actionType) {
      query += ` AND ta.action_type = $${paramIndex}`;
      params.push(filters.actionType);
      paramIndex++;
    }

    if (filters?.startDate) {
      query += ` AND ta.created_at >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters?.endDate) {
      query += ` AND ta.created_at <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    query += ` ORDER BY ta.created_at DESC LIMIT 100`;

    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapActivity(row));
  }

  /**
   * Get performance summary
   */
  async getPerformanceSummary(eventId?: string): Promise<any> {
    // Sales performance
    const salesQuery = eventId
      ? `SELECT COUNT(*) as bookings, SUM(b.price) as revenue
         FROM reservations r
         JOIN booths b ON r.booth_id = b.id
         WHERE r.event_id = $1 AND r.status = 'confirmed'`
      : `SELECT COUNT(*) as bookings, SUM(b.price) as revenue
         FROM reservations r
         JOIN booths b ON r.booth_id = b.id
         WHERE r.status = 'confirmed'`;

    const sales = await pool.query(salesQuery, eventId ? [eventId] : []);

    // Team activity count
    const activityQuery = eventId
      ? `SELECT COUNT(*) as total_activities
         FROM team_activity
         WHERE event_id = $1`
      : `SELECT COUNT(*) as total_activities
         FROM team_activity`;

    const activities = await pool.query(activityQuery, eventId ? [eventId] : []);

    // Top performers
    const performersQuery = eventId
      ? `SELECT u.id, u.first_name, u.last_name, COUNT(ta.id) as activity_count
         FROM team_activity ta
         JOIN users u ON ta.user_id = u.id
         WHERE ta.event_id = $1
         GROUP BY u.id, u.first_name, u.last_name
         ORDER BY activity_count DESC
         LIMIT 5`
      : `SELECT u.id, u.first_name, u.last_name, COUNT(ta.id) as activity_count
         FROM team_activity ta
         JOIN users u ON ta.user_id = u.id
         GROUP BY u.id, u.first_name, u.last_name
         ORDER BY activity_count DESC
         LIMIT 5`;

    const performers = await pool.query(performersQuery, eventId ? [eventId] : []);

    return {
      sales: {
        bookings: parseInt(sales.rows[0]?.bookings || 0),
        revenue: parseFloat(sales.rows[0]?.revenue || 0),
      },
      activities: {
        total: parseInt(activities.rows[0]?.total_activities || 0),
      },
      topPerformers: performers.rows,
    };
  }

  private mapMetric(row: any): Metric {
    return {
      id: row.id,
      eventId: row.event_id,
      metricType: row.metric_type,
      metricName: row.metric_name,
      value: parseFloat(row.value),
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      recordedAt: row.recorded_at,
      createdAt: row.created_at,
    };
  }

  private mapActivity(row: any): Activity {
    return {
      id: row.id,
      userId: row.user_id,
      eventId: row.event_id,
      actionType: row.action_type,
      description: row.description,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
    };
  }
}

export default new MonitoringService();

