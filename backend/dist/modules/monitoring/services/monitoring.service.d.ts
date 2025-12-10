/**
 * Monitoring Service
 * Handles sales team monitoring, performance metrics, and analytics
 */
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
declare class MonitoringService {
    /**
     * Record a metric
     */
    recordMetric(data: {
        eventId?: string;
        metricType: string;
        metricName: string;
        value: number;
        metadata?: any;
    }): Promise<Metric>;
    /**
     * Log team activity
     */
    logActivity(data: {
        userId: string;
        eventId?: string;
        actionType: string;
        description?: string;
        metadata?: any;
    }): Promise<Activity>;
    /**
     * Get metrics for an event
     */
    getEventMetrics(eventId: string, metricType?: string): Promise<Metric[]>;
    /**
     * Get team activity
     */
    getTeamActivity(filters?: {
        userId?: string;
        eventId?: string;
        actionType?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Activity[]>;
    /**
     * Get performance summary
     */
    getPerformanceSummary(eventId?: string): Promise<any>;
    private mapMetric;
    private mapActivity;
}
declare const _default: MonitoringService;
export default _default;
//# sourceMappingURL=monitoring.service.d.ts.map