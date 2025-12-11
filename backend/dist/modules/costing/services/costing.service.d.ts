/**
 * Costing Service
 * Handles cost tracking, budget management, and financial reporting
 */
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
declare class CostingService {
    /**
     * Add a cost entry
     */
    addCost(data: {
        eventId: string;
        category: string;
        description: string;
        amount: number;
        currency?: string;
        vendor?: string;
        date?: Date;
    }): Promise<Cost>;
    /**
     * Get costs for an event
     */
    getEventCosts(eventId: string, filters?: {
        category?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Cost[]>;
    /**
     * Update cost
     */
    updateCost(costId: string, updates: Partial<Cost>): Promise<Cost>;
    /**
     * Delete cost
     */
    deleteCost(costId: string): Promise<void>;
    /**
     * Create or update budget
     */
    setBudget(eventId: string, category: string, allocatedAmount: number, currency?: string): Promise<Budget>;
    /**
     * Get budget for an event
     */
    getEventBudget(eventId: string): Promise<Budget[]>;
    /**
     * Get cost summary for an event
     */
    getCostSummary(eventId: string): Promise<any>;
    /**
     * Get cost by ID
     */
    getCostById(costId: string): Promise<Cost | null>;
    /**
     * Duplicate cost
     */
    duplicateCost(costId: string, data?: {
        eventId?: string;
        description?: string;
    }): Promise<Cost>;
    /**
     * Get budget by ID
     */
    getBudgetById(budgetId: string): Promise<Budget | null>;
    /**
     * Update budget
     */
    updateBudget(budgetId: string, data: {
        allocatedAmount?: number;
        category?: string;
        currency?: string;
    }): Promise<Budget>;
    /**
     * Delete budget
     */
    deleteBudget(budgetId: string): Promise<void>;
    /**
     * Duplicate budget
     */
    duplicateBudget(budgetId: string, data?: {
        eventId?: string;
        category?: string;
    }): Promise<Budget>;
    /**
     * Check budget and emit warnings
     */
    private checkBudget;
    private mapCost;
    private mapBudget;
}
declare const _default: CostingService;
export default _default;
//# sourceMappingURL=costing.service.d.ts.map