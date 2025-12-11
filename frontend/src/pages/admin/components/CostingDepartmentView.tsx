/**
 * Costing Department View Component
 * 
 * Enhanced costing department view with modern UI, skeleton loaders, and full CRUD operations.
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import api from '../../../services/api';
import EventService from '../../../services/event.service';

interface CostingDepartmentViewProps {
  data: any;
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
}

const CostingDepartmentView: React.FC<CostingDepartmentViewProps> = ({ data, loading = false, error = null, onRefresh }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showEditCostModal, setShowEditCostModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [selectedCost, setSelectedCost] = useState<any>(null);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [costForm, setCostForm] = useState({
    eventId: '',
    category: '',
    description: '',
    amount: '',
    currency: 'USD',
    vendor: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [budgetForm, setBudgetForm] = useState({
    eventId: '',
    category: '',
    allocatedAmount: '',
    currency: 'USD'
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

  if (error) {
    return (
      <div className="costing-view enhanced-view">
        <div className="error-message enhanced-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>⚠️ Error Loading Costing Data</h3>
          <p>{error}</p>
          <button onClick={onRefresh} className="btn-primary enhanced-btn" style={{ marginTop: '1rem' }}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  const handleCreateCost = async () => {
    try {
      if (!costForm.eventId || !costForm.category || !costForm.description || !costForm.amount) {
        alert('Please fill in all required fields');
        return;
      }
      await api.post('/costing/costs', {
        ...costForm,
        amount: parseFloat(costForm.amount),
        date: costForm.date ? new Date(costForm.date).toISOString() : undefined
      });
      setShowCostModal(false);
      setCostForm({ eventId: '', category: '', description: '', amount: '', currency: 'USD', vendor: '', date: new Date().toISOString().split('T')[0] });
      onRefresh();
      alert('Cost added successfully!');
    } catch (error: any) {
      alert('Error creating cost: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleUpdateCost = async () => {
    if (!selectedCost) return;
    try {
      await api.put(`/costing/costs/${selectedCost.id}`, {
        ...costForm,
        amount: costForm.amount ? parseFloat(costForm.amount) : undefined
      });
      setShowEditCostModal(false);
      setSelectedCost(null);
      onRefresh();
      alert('Cost updated successfully!');
    } catch (error: any) {
      alert('Error updating cost: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDeleteCost = async (costId: string) => {
    if (!window.confirm('Are you sure you want to delete this cost?')) return;
    try {
      await api.delete(`/costing/costs/${costId}`);
      onRefresh();
      alert('Cost deleted successfully!');
    } catch (error: any) {
      alert('Error deleting cost: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDuplicateCost = async (costId: string) => {
    try {
      const newDescription = prompt('Enter description for duplicate:', '');
      if (!newDescription) return;
      await api.post(`/costing/costs/${costId}/duplicate`, { description: newDescription });
      onRefresh();
      alert('Cost duplicated successfully!');
    } catch (error: any) {
      alert('Error duplicating cost: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleCreateBudget = async () => {
    try {
      if (!budgetForm.eventId || !budgetForm.category || !budgetForm.allocatedAmount) {
        alert('Please fill in all required fields');
        return;
      }
      await api.post('/costing/budget', {
        ...budgetForm,
        allocatedAmount: parseFloat(budgetForm.allocatedAmount)
      });
      setShowBudgetModal(false);
      setBudgetForm({ eventId: '', category: '', allocatedAmount: '', currency: 'USD' });
      onRefresh();
      alert('Budget created successfully!');
    } catch (error: any) {
      alert('Error creating budget: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleUpdateBudget = async () => {
    if (!selectedBudget) return;
    try {
      await api.put(`/costing/budget/${selectedBudget.id}`, {
        ...budgetForm,
        allocatedAmount: budgetForm.allocatedAmount ? parseFloat(budgetForm.allocatedAmount) : undefined
      });
      setShowEditBudgetModal(false);
      setSelectedBudget(null);
      onRefresh();
      alert('Budget updated successfully!');
    } catch (error: any) {
      alert('Error updating budget: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await api.delete(`/costing/budget/${budgetId}`);
      onRefresh();
      alert('Budget deleted successfully!');
    } catch (error: any) {
      alert('Error deleting budget: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDuplicateBudget = async (budgetId: string) => {
    try {
      const newCategory = prompt('Enter category for duplicate:', '');
      if (!newCategory) return;
      await api.post(`/costing/budget/${budgetId}/duplicate`, { category: newCategory });
      onRefresh();
      alert('Budget duplicated successfully!');
    } catch (error: any) {
      alert('Error duplicating budget: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const budgetPercentage = data.totalBudget > 0 ? (data.totalSpent / data.totalBudget) * 100 : 0;

  return (
    <div className="costing-view enhanced-view">
      <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>💰 Costing Management</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowCostModal(true)}
            className="btn-primary enhanced-btn"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            ➕ Add Cost
          </button>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="btn-primary enhanced-btn"
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#4CAF50' }}
          >
            💰 Set Budget
          </button>
        </div>
      </div>

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
              {item.costs && item.costs.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
                  <strong>Costs:</strong>
                  {item.costs.slice(0, 3).map((cost: any) => (
                    <div key={cost.id} style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{cost.description} - ${cost.amount}</span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={() => handleDuplicateCost(cost.id)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#FF9800' }}
                          className="btn-action-small"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleDeleteCost(cost.id)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#f44336' }}
                          className="btn-action-small"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {(!data.events || data.events.length === 0) && (
            <div className="no-stats">No cost data available</div>
          )}
        </div>
      </div>

      {/* Create Cost Modal */}
      {showCostModal && (
        <div className="modal-overlay" onClick={() => setShowCostModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Cost</h2>
              <button className="btn-close" onClick={() => setShowCostModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Event *</label>
                <select
                  value={costForm.eventId}
                  onChange={(e) => setCostForm({ ...costForm, eventId: e.target.value })}
                  required
                >
                  <option value="">Select Event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  value={costForm.category}
                  onChange={(e) => setCostForm({ ...costForm, category: e.target.value })}
                  placeholder="e.g., Marketing, Venue, Catering"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <input
                  type="text"
                  value={costForm.description}
                  onChange={(e) => setCostForm({ ...costForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costForm.amount}
                    onChange={(e) => setCostForm({ ...costForm, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={costForm.currency}
                    onChange={(e) => setCostForm({ ...costForm, currency: e.target.value })}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Vendor</label>
                  <input
                    type="text"
                    value={costForm.vendor}
                    onChange={(e) => setCostForm({ ...costForm, vendor: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={costForm.date}
                    onChange={(e) => setCostForm({ ...costForm, date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCostModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateCost}>Add Cost</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Budget Modal */}
      {showBudgetModal && (
        <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Set Budget</h2>
              <button className="btn-close" onClick={() => setShowBudgetModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Event *</label>
                <select
                  value={budgetForm.eventId}
                  onChange={(e) => setBudgetForm({ ...budgetForm, eventId: e.target.value })}
                  required
                >
                  <option value="">Select Event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                  placeholder="e.g., Marketing, Venue, Catering"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Allocated Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={budgetForm.allocatedAmount}
                    onChange={(e) => setBudgetForm({ ...budgetForm, allocatedAmount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={budgetForm.currency}
                    onChange={(e) => setBudgetForm({ ...budgetForm, currency: e.target.value })}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowBudgetModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateBudget}>Set Budget</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostingDepartmentView;

