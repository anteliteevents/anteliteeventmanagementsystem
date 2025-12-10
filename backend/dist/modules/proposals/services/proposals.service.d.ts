/**
 * Proposals Service
 * Handles proposal creation, templates, and approval workflow
 */
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
declare class ProposalsService {
    /**
     * Create a new proposal
     */
    createProposal(data: {
        eventId: string;
        title: string;
        description?: string;
        templateId?: string;
    }): Promise<Proposal>;
    /**
     * Get proposals for an event
     */
    getEventProposals(eventId: string, filters?: {
        status?: string;
    }): Promise<Proposal[]>;
    /**
     * Submit proposal for approval
     */
    submitProposal(proposalId: string, userId: string): Promise<Proposal>;
    /**
     * Approve proposal
     */
    approveProposal(proposalId: string, userId: string): Promise<Proposal>;
    /**
     * Reject proposal
     */
    rejectProposal(proposalId: string, userId: string): Promise<Proposal>;
    /**
     * Mark proposal as sent
     */
    markProposalSent(proposalId: string): Promise<Proposal>;
    /**
     * Get proposal templates
     */
    getTemplates(category?: string): Promise<ProposalTemplate[]>;
    /**
     * Create template
     */
    createTemplate(data: {
        name: string;
        description?: string;
        content: string;
        category?: string;
    }): Promise<ProposalTemplate>;
    private mapProposal;
    private mapTemplate;
}
declare const _default: ProposalsService;
export default _default;
//# sourceMappingURL=proposals.service.d.ts.map