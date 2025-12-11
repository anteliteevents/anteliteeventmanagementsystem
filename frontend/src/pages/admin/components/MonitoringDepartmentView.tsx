/**
 * Monitoring Department View Component
 * 
 * Enhanced monitoring department view with modern UI and skeleton loaders.
 * 
 * @component
 */

import React from 'react';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

interface MonitoringDepartmentViewProps {
  data: any;
  onRefresh: () => void;
}

const MonitoringDepartmentView: React.FC<MonitoringDepartmentViewProps> = ({ data, onRefresh }) => {
  if (!data) {
    return (
      <div className="monitoring-view enhanced-view">
        <div className="loading-skeleton">
          <div className="skeleton-stats">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-stat-card">
                <SkeletonLoader width={60} height={60} variant="circular" />
                <div className="skeleton-stat-content">
                  <SkeletonLoader width={120} height={24} />
                  <SkeletonLoader width={80} height={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="monitoring-view enhanced-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card enhanced-card">
          <div className="card-header">
            <h3>📊 Sales Performance</h3>
            <button onClick={onRefresh} className="btn-refresh-small" aria-label="Refresh data">
              🔄
            </button>
          </div>
          <div className="card-value">{data.performance?.sales?.bookings || 0}</div>
          <div className="card-footer">Total Bookings</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>💰 Revenue</h3>
          </div>
          <div className="card-value">${data.performance?.sales?.revenue?.toLocaleString() || '0'}</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📝 Total Activities</h3>
          </div>
          <div className="card-value">{data.totalActivities || 0}</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>⭐ Top Performers</h3>
          </div>
          <div className="card-value">{data.topPerformers?.length || 0}</div>
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>⭐ Top Performers</h2>
        <div className="events-sales-list">
          {data.topPerformers?.map((performer: any, index: number) => (
            <div key={performer.id || index} className="event-sales-item enhanced-item">
              <div className="event-sales-header">
                <h4>{performer.first_name} {performer.last_name}</h4>
                <span className="event-status">#{index + 1}</span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Activities:</span>
                  <span className="stat-mini-value">{performer.activity_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
          {(!data.topPerformers || data.topPerformers.length === 0) && (
            <div className="no-stats">No performance data available</div>
          )}
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>📝 Recent Team Activity</h2>
        <div className="activity-list">
          {data.activities?.slice(0, 20).map((activity: any) => (
            <div key={activity.id} className="activity-item enhanced-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <div className="activity-title">{activity.action_type?.replace(/_/g, ' ')}</div>
                <div className="activity-meta">
                  {activity.first_name && `${activity.first_name} ${activity.last_name}`}
                  {activity.event_name && ` • ${activity.event_name}`}
                  {` • ${new Date(activity.created_at).toLocaleString()}`}
                </div>
              </div>
            </div>
          ))}
          {(!data.activities || data.activities.length === 0) && (
            <div className="no-stats">No activity logged yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringDepartmentView;

