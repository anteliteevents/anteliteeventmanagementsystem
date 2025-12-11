/**
 * Costing Department View Component
 * 
 * Enhanced costing department view with modern UI and skeleton loaders.
 * 
 * @component
 */

import React from 'react';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

interface CostingDepartmentViewProps {
  data: any;
  onRefresh: () => void;
}

const CostingDepartmentView: React.FC<CostingDepartmentViewProps> = ({ data, onRefresh }) => {
  if (!data) {
    return (
      <div className="costing-view enhanced-view">
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

  const budgetPercentage = data.totalBudget > 0 ? (data.totalSpent / data.totalBudget) * 100 : 0;

  return (
    <div className="costing-view enhanced-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card enhanced-card">
          <div className="card-header">
            <h3>💰 Total Budget</h3>
            <button onClick={onRefresh} className="btn-refresh-small" aria-label="Refresh data">
              🔄
            </button>
          </div>
          <div className="card-value">${data.totalBudget?.toLocaleString() || '0'}</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>💸 Total Spent</h3>
          </div>
          <div className="card-value">${data.totalSpent?.toLocaleString() || '0'}</div>
          <div className="card-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Remaining:</span>
              <span className="breakdown-value available">${data.remaining?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📊 Budget Usage</h3>
          </div>
          <div className="card-value">{Math.round(budgetPercentage)}%</div>
          <div className="occupancy-progress-bar">
            <div 
              className="progress-fill" 
              style={{ '--progress-width': `${Math.min(budgetPercentage, 100)}%` } as React.CSSProperties}
            ></div>
          </div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📅 Events with Costs</h3>
          </div>
          <div className="card-value">{data.eventsWithCosts || 0}</div>
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>💰 Cost Breakdown by Event</h2>
        <div className="events-sales-list">
          {data.events?.filter((item: any) => item.summary).map((item: any) => (
            <div key={item.event.id} className="event-sales-item enhanced-item">
              <div className="event-sales-header">
                <h4>{item.event.name}</h4>
                <span className={`event-status status-${item.event.status}`}>{item.event.status}</span>
              </div>
              {item.summary && (
                <div className="event-sales-stats">
                  <div className="stat-mini">
                    <span className="stat-mini-label">Budget:</span>
                    <span className="stat-mini-value">${item.summary.totalBudget?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-label">Spent:</span>
                    <span className="stat-mini-value">${item.summary.totalSpent?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-label">Remaining:</span>
                    <span className="stat-mini-value available">${item.summary.remaining?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {(!data.events || data.events.length === 0) && (
            <div className="no-stats">No cost data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostingDepartmentView;

