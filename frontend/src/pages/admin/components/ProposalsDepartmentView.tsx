/**
 * Proposals Department View Component
 * 
 * Enhanced proposals department view with modern UI and skeleton loaders.
 * 
 * @component
 */

import React from 'react';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

interface ProposalsDepartmentViewProps {
  data: any;
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
}

const ProposalsDepartmentView: React.FC<ProposalsDepartmentViewProps> = ({ data, loading = false, error = null, onRefresh }) => {
  if (loading || !data) {
    return (
      <div className="proposals-view enhanced-view">
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

  if (error) {
    return (
      <div className="proposals-view enhanced-view">
        <div className="error-message enhanced-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>⚠️ Error Loading Proposals Data</h3>
          <p>{error}</p>
          <button onClick={onRefresh} className="btn-primary enhanced-btn" style={{ marginTop: '1rem' }}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="proposals-view enhanced-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card enhanced-card">
          <div className="card-header">
            <h3>📄 Total Proposals</h3>
            <button onClick={onRefresh} className="btn-refresh-small" aria-label="Refresh data">
              🔄
            </button>
          </div>
          <div className="card-value">{data.totalProposals || 0}</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📝 Draft</h3>
          </div>
          <div className="card-value">{data.draftProposals || 0}</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📤 Submitted</h3>
          </div>
          <div className="card-value">{data.submittedProposals || 0}</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>✅ Approved</h3>
          </div>
          <div className="card-value">{data.approvedProposals || 0}</div>
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>📄 Recent Proposals</h2>
        <div className="events-sales-list">
          {data.allProposals?.slice(0, 10).map((proposal: any) => (
            <div key={proposal.id} className="event-sales-item enhanced-item">
              <div className="event-sales-header">
                <h4>{proposal.title}</h4>
                <span className={`event-status status-${proposal.status}`}>{proposal.status}</span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Event:</span>
                  <span className="stat-mini-value">{proposal.eventId?.slice(0, 8) || 'N/A'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Created:</span>
                  <span className="stat-mini-value">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                </div>
                {proposal.submittedAt && (
                  <div className="stat-mini">
                    <span className="stat-mini-label">Submitted:</span>
                    <span className="stat-mini-value">{new Date(proposal.submittedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!data.allProposals || data.allProposals.length === 0) && (
            <div className="no-stats">No proposals yet</div>
          )}
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>📋 Available Templates</h2>
        <div className="events-sales-list">
          {data.templates?.map((template: any) => (
            <div key={template.id} className="event-sales-item enhanced-item">
              <div className="event-sales-header">
                <h4>{template.name}</h4>
                {template.category && (
                  <span className="event-status">{template.category}</span>
                )}
              </div>
              {template.description && (
                <div className="event-sales-stats">
                  <div className="stat-mini">
                    <span className="stat-mini-label">Description:</span>
                    <span className="stat-mini-value">{template.description}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {(!data.templates || data.templates.length === 0) && (
            <div className="no-stats">No templates available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalsDepartmentView;

