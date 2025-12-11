/**
 * Floor Plan Management View
 * Complete CRUD interface for managing floor plans
 */

import React, { useState, useEffect } from 'react';
import EventService from '../../services/event.service';
import FloorPlanService, { FloorPlan, CreateFloorPlanInput } from '../../services/floor-plan.service';
import { Event } from '../../types';
import './FloorPlanManagementView.css';

const FloorPlanManagementView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFloorPlan, setEditingFloorPlan] = useState<FloorPlan | null>(null);
  const [formData, setFormData] = useState<CreateFloorPlanInput>({
    eventId: '',
    name: '',
    layoutData: {
      gridWidth: 20,
      gridHeight: 20,
      cellSize: 50
    }
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadFloorPlans();
    } else {
      setFloorPlans([]);
    }
  }, [selectedEventId]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const allEvents = await EventService.getAllEvents();
      setEvents(allEvents);
      if (allEvents.length > 0 && !selectedEventId) {
        setSelectedEventId(allEvents[0].id);
      }
    } catch (error: any) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFloorPlans = async () => {
    if (!selectedEventId) return;
    
    try {
      setLoading(true);
      const plans = await FloorPlanService.getFloorPlansByEvent(selectedEventId);
      setFloorPlans(plans);
    } catch (error: any) {
      console.error('Error loading floor plans:', error);
      alert('Error loading floor plans: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      eventId: selectedEventId,
      name: '',
      layoutData: {
        gridWidth: 20,
        gridHeight: 20,
        cellSize: 50
      }
    });
    setShowCreateModal(true);
  };

  const handleEdit = (floorPlan: FloorPlan) => {
    setEditingFloorPlan(floorPlan);
    setFormData({
      eventId: floorPlan.eventId,
      name: floorPlan.name,
      layoutData: floorPlan.layoutData,
      imageUrl: floorPlan.imageUrl
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingFloorPlan) {
        await FloorPlanService.updateFloorPlan(editingFloorPlan.id, {
          name: formData.name,
          layoutData: formData.layoutData,
          imageUrl: formData.imageUrl
        });
      } else {
        await FloorPlanService.createFloorPlan(formData);
      }
      setShowCreateModal(false);
      setShowEditModal(false);
      setEditingFloorPlan(null);
      await loadFloorPlans();
    } catch (error: any) {
      alert('Error saving floor plan: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this floor plan? This action cannot be undone.')) {
      return;
    }

    try {
      await FloorPlanService.deleteFloorPlan(id);
      await loadFloorPlans();
    } catch (error: any) {
      alert('Error deleting floor plan: ' + error.message);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await FloorPlanService.duplicateFloorPlan(id);
      await loadFloorPlans();
    } catch (error: any) {
      alert('Error duplicating floor plan: ' + error.message);
    }
  };

  if (loading && events.length === 0) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="floor-plan-management-view">
      {/* Header */}
      <div className="view-header">
        <div className="header-content">
          <h2>🗺️ Floor Plan Management</h2>
          <p>Create and manage floor plans for your events</p>
        </div>
        <div className="header-actions">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="event-select"
          >
            <option value="">Select an event...</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} ({event.status})
              </option>
            ))}
          </select>
          {selectedEventId && (
            <button className="btn-create" onClick={handleCreate}>
              ➕ Create Floor Plan
            </button>
          )}
        </div>
      </div>

      {/* Floor Plans List */}
      {selectedEventId ? (
        <div className="floor-plans-list">
          {floorPlans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <h3>No Floor Plans</h3>
              <p>Create your first floor plan for this event</p>
              <button className="btn-create" onClick={handleCreate}>
                Create Floor Plan
              </button>
            </div>
          ) : (
            <div className="floor-plans-grid">
              {floorPlans.map(plan => (
                <div key={plan.id} className="floor-plan-card">
                  <div className="card-header">
                    <h3>{plan.name}</h3>
                    <div className="card-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(plan)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDuplicate(plan.id)}
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(plan.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="plan-info">
                      <div className="info-item">
                        <span className="label">Grid Size:</span>
                        <span className="value">
                          {plan.layoutData.gridWidth} × {plan.layoutData.gridHeight}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="label">Cell Size:</span>
                        <span className="value">{plan.layoutData.cellSize}px</span>
                      </div>
                      {plan.layoutData.zones && plan.layoutData.zones.length > 0 && (
                        <div className="info-item">
                          <span className="label">Zones:</span>
                          <span className="value">{plan.layoutData.zones.length}</span>
                        </div>
                      )}
                    </div>
                    {plan.imageUrl && (
                      <div className="plan-image">
                        <img src={plan.imageUrl} alt={plan.name} />
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    <button
                      className="btn-primary"
                      onClick={() => {
                        window.location.href = `/admin/floor-plans/${plan.id}/edit`;
                      }}
                    >
                      Open Editor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>Select an Event</h3>
          <p>Please select an event to manage its floor plans</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Floor Plan</h3>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Hall Floor Plan"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Grid Width *</label>
                  <input
                    type="number"
                    value={formData.layoutData.gridWidth}
                    onChange={(e) => setFormData({
                      ...formData,
                      layoutData: { ...formData.layoutData, gridWidth: parseInt(e.target.value) || 20 }
                    })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Grid Height *</label>
                  <input
                    type="number"
                    value={formData.layoutData.gridHeight}
                    onChange={(e) => setFormData({
                      ...formData,
                      layoutData: { ...formData.layoutData, gridHeight: parseInt(e.target.value) || 20 }
                    })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Cell Size (px) *</label>
                  <input
                    type="number"
                    value={formData.layoutData.cellSize}
                    onChange={(e) => setFormData({
                      ...formData,
                      layoutData: { ...formData.layoutData, cellSize: parseInt(e.target.value) || 50 }
                    })}
                    min="10"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Background Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={!formData.name || !formData.layoutData.gridWidth || !formData.layoutData.gridHeight}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingFloorPlan && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Floor Plan</h3>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Hall Floor Plan"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Grid Width *</label>
                  <input
                    type="number"
                    value={formData.layoutData.gridWidth}
                    onChange={(e) => setFormData({
                      ...formData,
                      layoutData: { ...formData.layoutData, gridWidth: parseInt(e.target.value) || 20 }
                    })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Grid Height *</label>
                  <input
                    type="number"
                    value={formData.layoutData.gridHeight}
                    onChange={(e) => setFormData({
                      ...formData,
                      layoutData: { ...formData.layoutData, gridHeight: parseInt(e.target.value) || 20 }
                    })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Cell Size (px) *</label>
                  <input
                    type="number"
                    value={formData.layoutData.cellSize}
                    onChange={(e) => setFormData({
                      ...formData,
                      layoutData: { ...formData.layoutData, cellSize: parseInt(e.target.value) || 50 }
                    })}
                    min="10"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Background Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={!formData.name || !formData.layoutData.gridWidth || !formData.layoutData.gridHeight}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanManagementView;

