/**
 * Proposals Department View Component
 * 
 * Enhanced proposals department view with modern UI, skeleton loaders, and full CRUD operations.
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import api from '../../../services/api';
import EventService from '../../../services/event.service';

interface ProposalsDepartmentViewProps {
  data: any;
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
}

const ProposalsDepartmentView: React.FC<ProposalsDepartmentViewProps> = ({ data, loading = false, error = null, onRefresh }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showEditProposalModal, setShowEditProposalModal] = useState(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [proposalForm, setProposalForm] = useState({
    eventId: '',
    title: '',
    description: '',
    templateId: ''
  });
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const allEvents = await EventService.getAllEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };
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

  const handleCreateProposal = async () => {
    try {
      if (!proposalForm.eventId || !proposalForm.title) {
        alert('Please fill in event and title');
        return;
      }
      await api.post('/proposals', proposalForm);
      setShowProposalModal(false);
      setProposalForm({ eventId: '', title: '', description: '', templateId: '' });
      onRefresh();
      alert('Proposal created successfully!');
    } catch (error: any) {
      alert('Error creating proposal: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleUpdateProposal = async () => {
    if (!selectedProposal) return;
    try {
      await api.put(`/proposals/${selectedProposal.id}`, proposalForm);
      setShowEditProposalModal(false);
      setSelectedProposal(null);
      onRefresh();
      alert('Proposal updated successfully!');
    } catch (error: any) {
      alert('Error updating proposal: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    try {
      await api.delete(`/proposals/${proposalId}`);
      onRefresh();
      alert('Proposal deleted successfully!');
    } catch (error: any) {
      alert('Error deleting proposal: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDuplicateProposal = async (proposalId: string) => {
    try {
      const newTitle = prompt('Enter title for duplicate:', '');
      if (!newTitle) return;
      await api.post(`/proposals/${proposalId}/duplicate`, { title: newTitle });
      onRefresh();
      alert('Proposal duplicated successfully!');
    } catch (error: any) {
      alert('Error duplicating proposal: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleCreateTemplate = async () => {
    try {
      if (!templateForm.name || !templateForm.content) {
        alert('Please fill in name and content');
        return;
      }
      await api.post('/proposals/templates', templateForm);
      setShowTemplateModal(false);
      setTemplateForm({ name: '', description: '', content: '', category: '' });
      onRefresh();
      alert('Template created successfully!');
    } catch (error: any) {
      alert('Error creating template: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      await api.put(`/proposals/templates/${selectedTemplate.id}`, templateForm);
      setShowEditTemplateModal(false);
      setSelectedTemplate(null);
      onRefresh();
      alert('Template updated successfully!');
    } catch (error: any) {
      alert('Error updating template: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await api.delete(`/proposals/templates/${templateId}`);
      onRefresh();
      alert('Template deleted successfully!');
    } catch (error: any) {
      alert('Error deleting template: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      const newName = prompt('Enter name for duplicate:', '');
      if (!newName) return;
      await api.post(`/proposals/templates/${templateId}/duplicate`, { name: newName });
      onRefresh();
      alert('Template duplicated successfully!');
    } catch (error: any) {
      alert('Error duplicating template: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const openEditProposal = (proposal: any) => {
    setSelectedProposal(proposal);
    setProposalForm({
      eventId: proposal.eventId || '',
      title: proposal.title || '',
      description: proposal.description || '',
      templateId: proposal.templateId || ''
    });
    setShowEditProposalModal(true);
  };

  const openEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name || '',
      description: template.description || '',
      content: template.content || '',
      category: template.category || ''
    });
    setShowEditTemplateModal(true);
  };

  return (
    <div className="proposals-view enhanced-view">
      <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>📄 Proposals Management</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowProposalModal(true)}
            className="btn-primary enhanced-btn"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            ➕ Create Proposal
          </button>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="btn-primary enhanced-btn"
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#FF9800' }}
          >
            📋 Create Template
          </button>
        </div>
      </div>

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>📄 Recent Proposals</h2>
        </div>
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
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openEditProposal(proposal)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDuplicateProposal(proposal.id)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#FF9800' }}
                >
                  📋 Duplicate
                </button>
                <button
                  onClick={() => handleDeleteProposal(proposal.id)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#f44336' }}
                >
                  🗑️ Delete
                </button>
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
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openEditTemplate(template)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template.id)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#FF9800' }}
                >
                  📋 Duplicate
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#f44336' }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
          {(!data.templates || data.templates.length === 0) && (
            <div className="no-stats">No templates available</div>
          )}
        </div>
      </div>

      {/* Create Proposal Modal */}
      {showProposalModal && (
        <div className="modal-overlay" onClick={() => setShowProposalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Proposal</h2>
              <button className="btn-close" onClick={() => setShowProposalModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Event *</label>
                <select
                  value={proposalForm.eventId}
                  onChange={(e) => setProposalForm({ ...proposalForm, eventId: e.target.value })}
                  required
                >
                  <option value="">Select Event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Template (Optional)</label>
                <select
                  value={proposalForm.templateId}
                  onChange={(e) => setProposalForm({ ...proposalForm, templateId: e.target.value })}
                >
                  <option value="">None</option>
                  {data.templates?.map((template: any) => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowProposalModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateProposal}>Create Proposal</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Proposal Modal */}
      {showEditProposalModal && selectedProposal && (
        <div className="modal-overlay" onClick={() => setShowEditProposalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Proposal</h2>
              <button className="btn-close" onClick={() => setShowEditProposalModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditProposalModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateProposal}>Update Proposal</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Template</h2>
              <button className="btn-close" onClick={() => setShowTemplateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                  rows={8}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowTemplateModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateTemplate}>Create Template</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditTemplateModal && selectedTemplate && (
        <div className="modal-overlay" onClick={() => setShowEditTemplateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Template</h2>
              <button className="btn-close" onClick={() => setShowEditTemplateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                  rows={8}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditTemplateModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateTemplate}>Update Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalsDepartmentView;

