/**
 * Policies Department View Component
 * 
 * Enhanced policies department view with modern UI, skeleton loaders, and full CRUD operations.
 * 
 * @component
 */

import React, { useState } from 'react';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import api from '../../../services/api';

interface PoliciesDepartmentViewProps {
  data: any;
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
}

const PoliciesDepartmentView: React.FC<PoliciesDepartmentViewProps> = ({ data, loading = false, error = null, onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [policyForm, setPolicyForm] = useState({
    title: '',
    content: '',
    category: '',
    version: '1.0',
    effectiveDate: '',
    expiresAt: ''
  });

  const handleCreatePolicy = async () => {
    try {
      if (!policyForm.title || !policyForm.content || !policyForm.category) {
        alert('Please fill in title, content, and category');
        return;
      }
      await api.post('/policies', {
        ...policyForm,
        effectiveDate: policyForm.effectiveDate ? new Date(policyForm.effectiveDate).toISOString() : undefined,
        expiresAt: policyForm.expiresAt ? new Date(policyForm.expiresAt).toISOString() : undefined
      });
      setShowCreateModal(false);
      setPolicyForm({ title: '', content: '', category: '', version: '1.0', effectiveDate: '', expiresAt: '' });
      onRefresh();
      alert('Policy created successfully!');
    } catch (error: any) {
      alert('Error creating policy: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleUpdatePolicy = async () => {
    if (!selectedPolicy) return;
    try {
      await api.put(`/policies/${selectedPolicy.id}`, {
        ...policyForm,
        effectiveDate: policyForm.effectiveDate ? new Date(policyForm.effectiveDate).toISOString() : undefined,
        expiresAt: policyForm.expiresAt ? new Date(policyForm.expiresAt).toISOString() : undefined
      });
      setShowEditModal(false);
      setSelectedPolicy(null);
      onRefresh();
      alert('Policy updated successfully!');
    } catch (error: any) {
      alert('Error updating policy: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) return;
    try {
      await api.delete(`/policies/${policyId}`);
      onRefresh();
      alert('Policy deleted successfully!');
    } catch (error: any) {
      alert('Error deleting policy: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDuplicatePolicy = async (policyId: string) => {
    try {
      const newTitle = prompt('Enter title for duplicate:', '');
      if (!newTitle) return;
      await api.post(`/policies/${policyId}/duplicate`, { title: newTitle });
      onRefresh();
      alert('Policy duplicated successfully!');
    } catch (error: any) {
      alert('Error duplicating policy: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const openEditModal = (policy: any) => {
    setSelectedPolicy(policy);
    setPolicyForm({
      title: policy.title || '',
      content: policy.content || '',
      category: policy.category || '',
      version: policy.version || '1.0',
      effectiveDate: policy.effectiveDate ? new Date(policy.effectiveDate).toISOString().split('T')[0] : '',
      expiresAt: policy.expiresAt ? new Date(policy.expiresAt).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
  };
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
      <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>📋 Policies Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary enhanced-btn"
          style={{ padding: '0.75rem 1.5rem' }}
        >
          ➕ Create Policy
        </button>
      </div>

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
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openEditModal(policy)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDuplicatePolicy(policy.id)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#FF9800' }}
                >
                  📋 Duplicate
                </button>
                <button
                  onClick={() => handleDeletePolicy(policy.id)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#f44336' }}
                >
                  🗑️ Delete
                </button>
                {!policy.isActive ? (
                  <button
                    onClick={async () => {
                      try {
                        await api.post(`/policies/${policy.id}/activate`);
                        onRefresh();
                      } catch (error: any) {
                        alert('Error activating policy: ' + (error.response?.data?.error?.message || error.message));
                      }
                    }}
                    className="btn-action-small"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#4CAF50' }}
                  >
                    ✅ Activate
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await api.post(`/policies/${policy.id}/deactivate`);
                        onRefresh();
                      } catch (error: any) {
                        alert('Error deactivating policy: ' + (error.response?.data?.error?.message || error.message));
                      }
                    }}
                    className="btn-action-small"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#9E9E9E' }}
                  >
                    ❌ Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
          {(!data.policies || data.policies.length === 0) && (
            <div className="no-stats">No policies created yet</div>
          )}
        </div>
      </div>

      {/* Create Policy Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Policy</h2>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={policyForm.title}
                  onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  value={policyForm.category}
                  onChange={(e) => setPolicyForm({ ...policyForm, category: e.target.value })}
                  placeholder="e.g., Terms, Privacy, Refund"
                  required
                />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={policyForm.content}
                  onChange={(e) => setPolicyForm({ ...policyForm, content: e.target.value })}
                  rows={10}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Version</label>
                  <input
                    type="text"
                    value={policyForm.version}
                    onChange={(e) => setPolicyForm({ ...policyForm, version: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Effective Date</label>
                  <input
                    type="date"
                    value={policyForm.effectiveDate}
                    onChange={(e) => setPolicyForm({ ...policyForm, effectiveDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Expires At</label>
                <input
                  type="date"
                  value={policyForm.expiresAt}
                  onChange={(e) => setPolicyForm({ ...policyForm, expiresAt: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreatePolicy}>Create Policy</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Policy Modal */}
      {showEditModal && selectedPolicy && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Policy</h2>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={policyForm.title}
                  onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  value={policyForm.category}
                  onChange={(e) => setPolicyForm({ ...policyForm, category: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={policyForm.content}
                  onChange={(e) => setPolicyForm({ ...policyForm, content: e.target.value })}
                  rows={10}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Version</label>
                  <input
                    type="text"
                    value={policyForm.version}
                    onChange={(e) => setPolicyForm({ ...policyForm, version: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Effective Date</label>
                  <input
                    type="date"
                    value={policyForm.effectiveDate}
                    onChange={(e) => setPolicyForm({ ...policyForm, effectiveDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Expires At</label>
                <input
                  type="date"
                  value={policyForm.expiresAt}
                  onChange={(e) => setPolicyForm({ ...policyForm, expiresAt: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdatePolicy}>Update Policy</button>
            </div>
          </div>
        </div>
      )}

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

