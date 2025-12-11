/**
 * Policies Service
 * Handles policy management, terms & conditions, and compliance
 */
interface Policy {
    id: string;
    title: string;
    content: string;
    category: string;
    version: string;
    isActive: boolean;
    effectiveDate?: Date;
    expiresAt?: Date;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare class PoliciesService {
    /**
     * Create a policy
     */
    createPolicy(data: {
        title: string;
        content: string;
        category: string;
        version?: string;
        effectiveDate?: Date;
        expiresAt?: Date;
        createdBy?: string;
    }): Promise<Policy>;
    /**
     * Get policies
     */
    getPolicies(filters?: {
        category?: string;
        isActive?: boolean;
    }): Promise<Policy[]>;
    /**
     * Get active policy by category
     */
    getActivePolicy(category: string): Promise<Policy | null>;
    /**
     * Update policy
     */
    updatePolicy(policyId: string, updates: Partial<Policy>): Promise<Policy>;
    /**
     * Activate policy
     */
    activatePolicy(policyId: string): Promise<Policy>;
    /**
     * Deactivate policy
     */
    deactivatePolicy(policyId: string): Promise<Policy>;
    /**
     * Get policy by ID
     */
    getPolicyById(policyId: string): Promise<Policy | null>;
    /**
     * Delete policy
     */
    deletePolicy(policyId: string): Promise<void>;
    /**
     * Duplicate policy
     */
    duplicatePolicy(policyId: string, data?: {
        title?: string;
        version?: string;
    }): Promise<Policy>;
    private mapPolicy;
}
declare const _default: PoliciesService;
export default _default;
//# sourceMappingURL=policies.service.d.ts.map