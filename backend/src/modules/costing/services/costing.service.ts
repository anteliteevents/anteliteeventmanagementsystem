/**
 * Costing Service
 * Handles cost tracking, budget management, and financial reporting
 */

import pool from '../../../config/database';
import { eventBus } from '../../../core/event-bus';

interface Cost {
  id: string;
  eventId: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: Date;
  vendor?: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

interface Budget {
  id: string;
  eventId: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

class CostingService {
  /**
   * Add a cost entry
   */
  async addCost(data: {
    eventId: string;
    category: string;
    description: string;
    amount: number;
    currency?: string;
    vendor?: string;
    date?: Date;
  }): Promise<Cost> {
    const query = `
      INSERT INTO costs (
        event_id, category, description, amount, currency,
        vendor, date, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      data.eventId,
      data.category,
      data.description,
      data.amount,
      data.currency || 'USD',
      data.vendor || null,
      data.date || new Date(),
    ]);

    const cost = this.mapCost(result.rows[0]);

    // Check budget
    await this.checkBudget(data.eventId, data.category, data.amount);

    // Emit event
    await eventBus.emit('cost.added', {
      costId: cost.id,
      eventId: data.eventId,
      amount: data.amount,
    });

    return cost;
  }

  /**
   * Get costs for an event
   */
  async getEventCosts(eventId: string, filters?: {
    category?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Cost[]> {
    let query = `
      SELECT * FROM costs
      WHERE event_id = $1
    `;
    const params: any[] = [eventId];
    let paramIndex = 2;

    if (filters?.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.startDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters?.endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    query += ` ORDER BY date DESC, created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapCost(row));
  }

  /**
   * Update cost
   */
  async updateCost(costId: string, updates: Partial<Cost>): Promise<Cost> {
    const allowedFields = ['category', 'description', 'amount', 'vendor', 'date', 'status'];
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      throw new Error('No valid fields to update');
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(costId);

    const query = `
      UPDATE costs
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    const cost = this.mapCost(result.rows[0]);

    await eventBus.emit('cost.updated', {
      costId: cost.id,
      eventId: cost.eventId,
    });

    return cost;
  }

  /**
   * Delete cost
   */
  async deleteCost(costId: string): Promise<void> {
    const query = `DELETE FROM costs WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [costId]);

    if (result.rows.length > 0) {
      await eventBus.emit('cost.deleted', {
        costId,
        eventId: result.rows[0].event_id,
      });
    }
  }

  /**
   * Create or update budget
   */
  async setBudget(eventId: string, category: string, allocatedAmount: number, currency: string = 'USD'): Promise<Budget> {
    // Check if budget exists
    const checkQuery = `
      SELECT * FROM budgets
      WHERE event_id = $1 AND category = $2
    `;
    const existing = await pool.query(checkQuery, [eventId, category]);

    if (existing.rows.length > 0) {
      // Update existing
      const updateQuery = `
        UPDATE budgets
        SET allocated_amount = $1, updated_at = NOW()
        WHERE event_id = $2 AND category = $3
        RETURNING *
      `;
      const result = await pool.query(updateQuery, [allocatedAmount, eventId, category]);
      return this.mapBudget(result.rows[0]);
    } else {
      // Create new
      const insertQuery = `
        INSERT INTO budgets (
          event_id, category, allocated_amount, spent_amount, currency, created_at, updated_at
        )
        VALUES ($1, $2, $3, 0, $4, NOW(), NOW())
        RETURNING *
      `;
      const result = await pool.query(insertQuery, [eventId, category, allocatedAmount, currency]);
      return this.mapBudget(result.rows[0]);
    }
  }

  /**
   * Get budget for an event
   */
  async getEventBudget(eventId: string): Promise<Budget[]> {
    const query = `
      SELECT * FROM budgets
      WHERE event_id = $1
      ORDER BY category
    `;
    const result = await pool.query(query, [eventId]);
    return result.rows.map(row => this.mapBudget(row));
  }

  /**
   * Get cost summary for an event
   */
  async getCostSummary(eventId: string): Promise<any> {
    const costsQuery = `
      SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count,
        status
      FROM costs
      WHERE event_id = $1
      GROUP BY category, status
    `;
    const costs = await pool.query(costsQuery, [eventId]);

    const budgetQuery = `
      SELECT 
        category,
        allocated_amount,
        spent_amount,
        (allocated_amount - spent_amount) as remaining
      FROM budgets
      WHERE event_id = $1
    `;
    const budgets = await pool.query(budgetQuery, [eventId]);

    const totalSpent = costs.rows.reduce((sum, row) => sum + parseFloat(row.total), 0);
    const totalBudget = budgets.rows.reduce((sum, row) => sum + parseFloat(row.allocated_amount), 0);

    return {
      totalSpent,
      totalBudget,
      remaining: totalBudget - totalSpent,
      byCategory: costs.rows,
      budgets: budgets.rows,
    };
  }

  /**
   * Check budget and emit warnings
   */
  private async checkBudget(eventId: string, category: string, amount: number): Promise<void> {
    const budgetQuery = `
      SELECT * FROM budgets
      WHERE event_id = $1 AND category = $2
    `;
    const budget = await pool.query(budgetQuery, [eventId, category]);

    if (budget.rows.length > 0) {
      const b = budget.rows[0];
      const newSpent = parseFloat(b.spent_amount) + amount;
      const allocated = parseFloat(b.allocated_amount);
      const percentage = (newSpent / allocated) * 100;

      // Update spent amount
      await pool.query(
        `UPDATE budgets SET spent_amount = $1, updated_at = NOW() WHERE id = $2`,
        [newSpent, b.id]
      );

      // Emit warnings
      if (newSpent > allocated) {
        await eventBus.emit('budget.exceeded', {
          eventId,
          category,
          allocated,
          spent: newSpent,
          overage: newSpent - allocated,
        });
      } else if (percentage >= 90) {
        await eventBus.emit('budget.warning', {
          eventId,
          category,
          allocated,
          spent: newSpent,
          percentage,
        });
      }
    }
  }

  private mapCost(row: any): Cost {
    return {
      id: row.id,
      eventId: row.event_id,
      category: row.category,
      description: row.description,
      amount: parseFloat(row.amount),
      currency: row.currency,
      date: row.date,
      vendor: row.vendor,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapBudget(row: any): Budget {
    return {
      id: row.id,
      eventId: row.event_id,
      category: row.category,
      allocatedAmount: parseFloat(row.allocated_amount),
      spentAmount: parseFloat(row.spent_amount),
      currency: row.currency,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default new CostingService();

