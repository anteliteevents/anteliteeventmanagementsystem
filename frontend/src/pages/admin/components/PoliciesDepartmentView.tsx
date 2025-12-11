/**
 * Policies Department View Component
 * 
 * Enhanced policies department view with modern UI and skeleton loaders.
 * 
 * @component
 */

import React from 'react';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

interface PoliciesDepartmentViewProps {
  data: any;
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
}

const PoliciesDepartmentView: React.FC<PoliciesDepartmentViewProps> = ({ data, loading = false, error = null, onRefresh }) => {
  if (loading || !data) {
    return (
      <div className="policies-view enhanced-view">
        <div className="loading-skeleton">
          <div className="skeleton-stats">
            {Array.from({ length: 3 }).map((_, i) => (
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

  if (error) {
    return (
      <div className="policies-view enhanced-view">
        <div className="error-message enhanced-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>⚠️ Error Loading Policies Data</h3>
          <p>{error}</p>
          <button onClick={onRefresh} className="btn-primary enhanced-btn" style={{ marginTop: '1rem' }}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="policies-view enhanced-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card enhanced-card">
          <div className="card-header">
            <h3>📋 Total Policies</h3>
            <button onClick={onRefresh} className="btn-refresh-small" aria-label="Refresh data">
              🔄
            </button>
          </div>
          <div className="card-value">{data.totalPolicies || 0}</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>✅ Active Policies</h3>
          </div>
          <div className="card-value">{data.activeCount || 0}</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📂 Categories</h3>
          </div>
          <div className="card-value">{data.categories?.length || 0}</div>
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>📋 All Policies</h2>
        <div className="events-sales-list">
          {data.policies?.map((policy: any) => (
            <div key={policy.id} className="event-sales-item enhanced-item">
              <div className="event-sales-header">
                <h4>{policy.title}</h4>
                <span className={`event-status ${policy.isActive ? 'status-active' : ''}`}>
                  {policy.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Category:</span>
                  <span className="stat-mini-value">{policy.category || 'General'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Version:</span>
                  <span className="stat-mini-value">{policy.version || '1.0'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Created:</span>
                  <span className="stat-mini-value">{new Date(policy.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {policy.content && (
                <div className="policy-preview">
                  {policy.content.substring(0, 200)}{policy.content.length > 200 ? '...' : ''}
                </div>
              )}
            </div>
          ))}
          {(!data.policies || data.policies.length === 0) && (
            <div className="no-stats">No policies created yet</div>
          )}
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>📂 Policy Categories</h2>
        <div className="events-sales-list">
          {data.categories?.map((category: string) => {
            const categoryPolicies = data.policies?.filter((p: any) => p.category === category) || [];
            return (
              <div key={category} className="event-sales-item enhanced-item">
                <div className="event-sales-header">
                  <h4>{category}</h4>
                  <span className="event-status">{categoryPolicies.length} policies</span>
                </div>
              </div>
            );
          })}
          {(!data.categories || data.categories.length === 0) && (
            <div className="no-stats">No categories defined</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoliciesDepartmentView;

