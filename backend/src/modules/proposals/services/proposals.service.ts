/**
 * Proposals Service
 * Handles proposal creation, templates, and approval workflow
 */

import pool from '../../../config/database';
import { eventBus } from '../../../core/event-bus';

interface Proposal {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  templateId?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'sent';
  submittedBy?: string;
  submittedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ProposalTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class ProposalsService {
  /**
   * Create a new proposal
   */
  async createProposal(data: {
    eventId: string;
    title: string;
    description?: string;
    templateId?: string;
  }): Promise<Proposal> {
    const query = `
      INSERT INTO proposals (
        event_id, title, description, template_id, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, 'draft', NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      data.eventId,
      data.title,
      data.description || null,
      data.templateId || null,
    ]);

    const proposal = this.mapProposal(result.rows[0]);

    await eventBus.emit('proposal.created', {
      proposalId: proposal.id,
      eventId: data.eventId,
    });

    return proposal;
  }

  /**
   * Get proposals for an event
   */
  async getEventProposals(eventId: string, filters?: {
    status?: string;
  }): Promise<Proposal[]> {
    let query = `
      SELECT p.*, 
        u1.first_name || ' ' || u1.last_name as submitted_by_name,
        u2.first_name || ' ' || u2.last_name as approved_by_name
      FROM proposals p
      LEFT JOIN users u1 ON p.submitted_by = u1.id
      LEFT JOIN users u2 ON p.approved_by = u2.id
      WHERE p.event_id = $1
    `;
    const params: any[] = [eventId];

    if (filters?.status) {
      query += ` AND p.status = $2`;
      params.push(filters.status);
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapProposal(row));
  }

  /**
   * Submit proposal for approval
   */
  async submitProposal(proposalId: string, userId: string): Promise<Proposal> {
    const query = `
      UPDATE proposals
      SET status = 'submitted', submitted_by = $1, submitted_at = NOW(), updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [userId, proposalId]);
    const proposal = this.mapProposal(result.rows[0]);

    await eventBus.emit('proposal.submitted', {
      proposalId: proposal.id,
      eventId: proposal.eventId,
      submittedBy: userId,
    });

    return proposal;
  }

  /**
   * Approve proposal
   */
  async approveProposal(proposalId: string, userId: string): Promise<Proposal> {
    const query = `
      UPDATE proposals
      SET status = 'approved', approved_by = $1, approved_at = NOW(), updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [userId, proposalId]);
    const proposal = this.mapProposal(result.rows[0]);

    await eventBus.emit('proposal.approved', {
      proposalId: proposal.id,
      eventId: proposal.eventId,
      approvedBy: userId,
    });

    return proposal;
  }

  /**
   * Reject proposal
   */
  async rejectProposal(proposalId: string, userId: string): Promise<Proposal> {
    const query = `
      UPDATE proposals
      SET status = 'rejected', approved_by = $1, approved_at = NOW(), updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [userId, proposalId]);
    const proposal = this.mapProposal(result.rows[0]);

    await eventBus.emit('proposal.rejected', {
      proposalId: proposal.id,
      eventId: proposal.eventId,
      rejectedBy: userId,
    });

    return proposal;
  }

  /**
   * Mark proposal as sent
   */
  async markProposalSent(proposalId: string): Promise<Proposal> {
    const query = `
      UPDATE proposals
      SET status = 'sent', updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [proposalId]);
    const proposal = this.mapProposal(result.rows[0]);

    await eventBus.emit('proposal.sent', {
      proposalId: proposal.id,
      eventId: proposal.eventId,
    });

    return proposal;
  }

  /**
   * Get proposal templates
   */
  async getTemplates(category?: string): Promise<ProposalTemplate[]> {
    let query = `
      SELECT * FROM proposal_templates
      WHERE is_active = true
    `;
    const params: any[] = [];

    if (category) {
      query += ` AND category = $1`;
      params.push(category);
    }

    query += ` ORDER BY name`;

    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapTemplate(row));
  }

  /**
   * Get proposal by ID
   */
  async getProposalById(proposalId: string): Promise<Proposal | null> {
    const query = `
      SELECT p.*, 
        u1.first_name || ' ' || u1.last_name as submitted_by_name,
        u2.first_name || ' ' || u2.last_name as approved_by_name
      FROM proposals p
      LEFT JOIN users u1 ON p.submitted_by = u1.id
      LEFT JOIN users u2 ON p.approved_by = u2.id
      WHERE p.id = $1
    `;

    const result = await pool.query(query, [proposalId]);
    if (result.rows.length === 0) return null;
    return this.mapProposal(result.rows[0]);
  }

  /**
   * Update proposal
   */
  async updateProposal(proposalId: string, data: {
    title?: string;
    description?: string;
    templateId?: string;
  }): Promise<Proposal> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(data.title);
      paramIndex++;
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(data.description);
      paramIndex++;
    }
    if (data.templateId !== undefined) {
      updates.push(`template_id = $${paramIndex}`);
      values.push(data.templateId);
      paramIndex++;
    }

    if (updates.length === 0) {
      const proposal = await this.getProposalById(proposalId);
      if (!proposal) throw new Error('Proposal not found');
      return proposal;
    }

    updates.push(`updated_at = NOW()`);
    values.push(proposalId);

    const query = `
      UPDATE proposals
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    const proposal = this.mapProposal(result.rows[0]);

    await eventBus.emit('proposal.updated', {
      proposalId: proposal.id,
      eventId: proposal.eventId,
    });

    return proposal;
  }

  /**
   * Delete proposal
   */
  async deleteProposal(proposalId: string): Promise<void> {
    const query = `DELETE FROM proposals WHERE id = $1`;
    await pool.query(query, [proposalId]);

    await eventBus.emit('proposal.deleted', {
      proposalId,
    });
  }

  /**
   * Duplicate proposal
   */
  async duplicateProposal(proposalId: string, data?: {
    title?: string;
    eventId?: string;
  }): Promise<Proposal> {
    const originalProposal = await this.getProposalById(proposalId);
    if (!originalProposal) {
      throw new Error('Proposal not found');
    }

    const duplicateData = {
      eventId: data?.eventId || originalProposal.eventId,
      title: data?.title || `${originalProposal.title} (Copy)`,
      description: originalProposal.description,
      templateId: originalProposal.templateId,
    };

    return await this.createProposal(duplicateData);
  }

  /**
   * Create template
   */
  async createTemplate(data: {
    name: string;
    description?: string;
    content: string;
    category?: string;
  }): Promise<ProposalTemplate> {
    const query = `
      INSERT INTO proposal_templates (
        name, description, content, category, is_active, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, true, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      data.name,
      data.description || null,
      data.content,
      data.category || null,
    ]);

    return this.mapTemplate(result.rows[0]);
  }

  /**
   * Get template by ID
   */
  async getTemplateById(templateId: string): Promise<ProposalTemplate | null> {
    const query = `SELECT * FROM proposal_templates WHERE id = $1`;
    const result = await pool.query(query, [templateId]);
    if (result.rows.length === 0) return null;
    return this.mapTemplate(result.rows[0]);
  }

  /**
   * Update template
   */
  async updateTemplate(templateId: string, data: {
    name?: string;
    description?: string;
    content?: string;
    category?: string;
    isActive?: boolean;
  }): Promise<ProposalTemplate> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(data.name);
      paramIndex++;
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(data.description);
      paramIndex++;
    }
    if (data.content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      values.push(data.content);
      paramIndex++;
    }
    if (data.category !== undefined) {
      updates.push(`category = $${paramIndex}`);
      values.push(data.category);
      paramIndex++;
    }
    if (data.isActive !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      values.push(data.isActive);
      paramIndex++;
    }

    if (updates.length === 0) {
      const template = await this.getTemplateById(templateId);
      if (!template) throw new Error('Template not found');
      return template;
    }

    updates.push(`updated_at = NOW()`);
    values.push(templateId);

    const query = `
      UPDATE proposal_templates
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return this.mapTemplate(result.rows[0]);
  }

  /**
   * Delete template
   */
  async deleteTemplate(templateId: string): Promise<void> {
    const query = `DELETE FROM proposal_templates WHERE id = $1`;
    await pool.query(query, [templateId]);
  }

  /**
   * Duplicate template
   */
  async duplicateTemplate(templateId: string, data?: {
    name?: string;
  }): Promise<ProposalTemplate> {
    const originalTemplate = await this.getTemplateById(templateId);
    if (!originalTemplate) {
      throw new Error('Template not found');
    }

    return await this.createTemplate({
      name: data?.name || `${originalTemplate.name} (Copy)`,
      description: originalTemplate.description,
      content: originalTemplate.content,
      category: originalTemplate.category,
    });
  }

  private mapProposal(row: any): Proposal {
    return {
      id: row.id,
      eventId: row.event_id,
      title: row.title,
      description: row.description,
      templateId: row.template_id,
      status: row.status,
      submittedBy: row.submitted_by,
      submittedAt: row.submitted_at,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapTemplate(row: any): ProposalTemplate {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      content: row.content,
      category: row.category,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default new ProposalsService();

