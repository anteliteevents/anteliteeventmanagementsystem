"use strict";
/**
 * Proposals Service
 * Handles proposal creation, templates, and approval workflow
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../config/database"));
const event_bus_1 = require("../../../core/event-bus");
class ProposalsService {
    /**
     * Create a new proposal
     */
    async createProposal(data) {
        const query = `
      INSERT INTO proposals (
        event_id, title, description, template_id, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, 'draft', NOW(), NOW())
      RETURNING *
    `;
        const result = await database_1.default.query(query, [
            data.eventId,
            data.title,
            data.description || null,
            data.templateId || null,
        ]);
        const proposal = this.mapProposal(result.rows[0]);
        await event_bus_1.eventBus.emit('proposal.created', {
            proposalId: proposal.id,
            eventId: data.eventId,
        });
        return proposal;
    }
    /**
     * Get proposals for an event
     */
    async getEventProposals(eventId, filters) {
        let query = `
      SELECT p.*, 
        u1.first_name || ' ' || u1.last_name as submitted_by_name,
        u2.first_name || ' ' || u2.last_name as approved_by_name
      FROM proposals p
      LEFT JOIN users u1 ON p.submitted_by = u1.id
      LEFT JOIN users u2 ON p.approved_by = u2.id
      WHERE p.event_id = $1
    `;
        const params = [eventId];
        if (filters?.status) {
            query += ` AND p.status = $2`;
            params.push(filters.status);
        }
        query += ` ORDER BY p.created_at DESC`;
        const result = await database_1.default.query(query, params);
        return result.rows.map(row => this.mapProposal(row));
    }
    /**
     * Submit proposal for approval
     */
    async submitProposal(proposalId, userId) {
        const query = `
      UPDATE proposals
      SET status = 'submitted', submitted_by = $1, submitted_at = NOW(), updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
        const result = await database_1.default.query(query, [userId, proposalId]);
        const proposal = this.mapProposal(result.rows[0]);
        await event_bus_1.eventBus.emit('proposal.submitted', {
            proposalId: proposal.id,
            eventId: proposal.eventId,
            submittedBy: userId,
        });
        return proposal;
    }
    /**
     * Approve proposal
     */
    async approveProposal(proposalId, userId) {
        const query = `
      UPDATE proposals
      SET status = 'approved', approved_by = $1, approved_at = NOW(), updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
        const result = await database_1.default.query(query, [userId, proposalId]);
        const proposal = this.mapProposal(result.rows[0]);
        await event_bus_1.eventBus.emit('proposal.approved', {
            proposalId: proposal.id,
            eventId: proposal.eventId,
            approvedBy: userId,
        });
        return proposal;
    }
    /**
     * Reject proposal
     */
    async rejectProposal(proposalId, userId) {
        const query = `
      UPDATE proposals
      SET status = 'rejected', approved_by = $1, approved_at = NOW(), updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
        const result = await database_1.default.query(query, [userId, proposalId]);
        const proposal = this.mapProposal(result.rows[0]);
        await event_bus_1.eventBus.emit('proposal.rejected', {
            proposalId: proposal.id,
            eventId: proposal.eventId,
            rejectedBy: userId,
        });
        return proposal;
    }
    /**
     * Mark proposal as sent
     */
    async markProposalSent(proposalId) {
        const query = `
      UPDATE proposals
      SET status = 'sent', updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
        const result = await database_1.default.query(query, [proposalId]);
        const proposal = this.mapProposal(result.rows[0]);
        await event_bus_1.eventBus.emit('proposal.sent', {
            proposalId: proposal.id,
            eventId: proposal.eventId,
        });
        return proposal;
    }
    /**
     * Get proposal templates
     */
    async getTemplates(category) {
        let query = `
      SELECT * FROM proposal_templates
      WHERE is_active = true
    `;
        const params = [];
        if (category) {
            query += ` AND category = $1`;
            params.push(category);
        }
        query += ` ORDER BY name`;
        const result = await database_1.default.query(query, params);
        return result.rows.map(row => this.mapTemplate(row));
    }
    /**
     * Get proposal by ID
     */
    async getProposalById(proposalId) {
        const query = `
      SELECT p.*, 
        u1.first_name || ' ' || u1.last_name as submitted_by_name,
        u2.first_name || ' ' || u2.last_name as approved_by_name
      FROM proposals p
      LEFT JOIN users u1 ON p.submitted_by = u1.id
      LEFT JOIN users u2 ON p.approved_by = u2.id
      WHERE p.id = $1
    `;
        const result = await database_1.default.query(query, [proposalId]);
        if (result.rows.length === 0)
            return null;
        return this.mapProposal(result.rows[0]);
    }
    /**
     * Update proposal
     */
    async updateProposal(proposalId, data) {
        const updates = [];
        const values = [];
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
            if (!proposal)
                throw new Error('Proposal not found');
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
        const result = await database_1.default.query(query, values);
        const proposal = this.mapProposal(result.rows[0]);
        await event_bus_1.eventBus.emit('proposal.updated', {
            proposalId: proposal.id,
            eventId: proposal.eventId,
        });
        return proposal;
    }
    /**
     * Delete proposal
     */
    async deleteProposal(proposalId) {
        const query = `DELETE FROM proposals WHERE id = $1`;
        await database_1.default.query(query, [proposalId]);
        await event_bus_1.eventBus.emit('proposal.deleted', {
            proposalId,
        });
    }
    /**
     * Duplicate proposal
     */
    async duplicateProposal(proposalId, data) {
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
    async createTemplate(data) {
        const query = `
      INSERT INTO proposal_templates (
        name, description, content, category, is_active, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, true, NOW(), NOW())
      RETURNING *
    `;
        const result = await database_1.default.query(query, [
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
    async getTemplateById(templateId) {
        const query = `SELECT * FROM proposal_templates WHERE id = $1`;
        const result = await database_1.default.query(query, [templateId]);
        if (result.rows.length === 0)
            return null;
        return this.mapTemplate(result.rows[0]);
    }
    /**
     * Update template
     */
    async updateTemplate(templateId, data) {
        const updates = [];
        const values = [];
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
            if (!template)
                throw new Error('Template not found');
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
        const result = await database_1.default.query(query, values);
        return this.mapTemplate(result.rows[0]);
    }
    /**
     * Delete template
     */
    async deleteTemplate(templateId) {
        const query = `DELETE FROM proposal_templates WHERE id = $1`;
        await database_1.default.query(query, [templateId]);
    }
    /**
     * Duplicate template
     */
    async duplicateTemplate(templateId, data) {
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
    mapProposal(row) {
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
    mapTemplate(row) {
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
exports.default = new ProposalsService();
//# sourceMappingURL=proposals.service.js.map