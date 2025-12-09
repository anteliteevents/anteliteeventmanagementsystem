/**
 * Events Management View
 * Complete CRUD interface for managing events
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventService from '../../services/event.service';
import { Event } from '../../types';
import './EventsManagementView.css';

const EventsManagementView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const allEvents = await EventService.getAllEvents();
      setEvents(allEvents);
    } catch (error: any) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await EventService.deleteEvent(eventId);
      await loadEvents();
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
    } catch (error: any) {
      alert('Error deleting event: ' + error.message);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter;
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: events.length,
    published: events.filter(e => e.status === 'published').length,
    active: events.filter(e => e.status === 'active').length,
    completed: events.filter(e => e.status === 'completed').length,
    draft: events.filter(e => e.status === 'draft').length,
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="events-management-view">
      {/* Header with Stats */}
      <div className="view-header">
        <div className="header-stats">
          <div className="stat-box">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Events</div>
          </div>
          <div className="stat-box">
            <div className="stat-value published">{stats.published}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat-box">
            <div className="stat-value active">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-box">
            <div className="stat-value completed">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/events/new" className="btn-create">
            ➕ Create New Event
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events by name or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button
            className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            Published ({stats.published})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({stats.active})
          </button>
          <button
            className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            Draft ({stats.draft})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className={`event-card ${selectedEvent?.id === event.id ? 'selected' : ''}`}
            onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
          >
            <div className="event-card-header">
              <h3>{event.name}</h3>
              <span className={`status-badge status-${event.status}`}>{event.status}</span>
            </div>
            
            <div className="event-card-body">
              <div className="event-info-row">
                <span className="info-icon">📍</span>
                <span className="info-text">{event.venue || 'Venue TBD'}</span>
              </div>
              <div className="event-info-row">
                <span className="info-icon">📅</span>
                <span className="info-text">
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </span>
              </div>
              {event.description && (
                <div className="event-description">
                  {event.description.substring(0, 150)}{event.description.length > 150 ? '...' : ''}
                </div>
              )}
            </div>

            <div className="event-card-footer">
              <div className="event-actions">
                <Link
                  to={`/events/${event.id}`}
                  className="btn-action-small"
                  onClick={(e) => e.stopPropagation()}
                >
                  👁️ View
                </Link>
                <Link
                  to={`/events/${event.id}/edit`}
                  className="btn-action-small"
                  onClick={(e) => e.stopPropagation()}
                >
                  ✏️ Edit
                </Link>
                <Link
                  to={`/admin?view=sales&eventId=${event.id}`}
                  className="btn-action-small"
                  onClick={(e) => e.stopPropagation()}
                >
                  💰 Sales
                </Link>
                <Link
                  to={`/admin?view=costing&eventId=${event.id}`}
                  className="btn-action-small"
                  onClick={(e) => e.stopPropagation()}
                >
                  💸 Costs
                </Link>
                <button
                  className="btn-action-small danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event.id);
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No events found</h3>
          <p>{searchTerm ? 'Try a different search term' : 'Create your first event to get started'}</p>
          <Link to="/events/new" className="btn-primary">
            Create Event
          </Link>
        </div>
      )}

      {/* Selected Event Details Sidebar */}
      {selectedEvent && (
        <div className="event-details-sidebar">
          <div className="sidebar-header">
            <h3>Event Details</h3>
            <button onClick={() => setSelectedEvent(null)} className="btn-close">✕</button>
          </div>
          <div className="sidebar-content">
            <div className="detail-section">
              <h4>Basic Information</h4>
              <div className="detail-item">
                <strong>Name:</strong> {selectedEvent.name}
              </div>
              <div className="detail-item">
                <strong>Venue:</strong> {selectedEvent.venue || 'Not set'}
              </div>
              <div className="detail-item">
                <strong>Status:</strong> 
                <span className={`status-badge status-${selectedEvent.status}`}>
                  {selectedEvent.status}
                </span>
              </div>
              <div className="detail-item">
                <strong>Start Date:</strong> {new Date(selectedEvent.startDate).toLocaleString()}
              </div>
              <div className="detail-item">
                <strong>End Date:</strong> {new Date(selectedEvent.endDate).toLocaleString()}
              </div>
            </div>

            {selectedEvent.description && (
              <div className="detail-section">
                <h4>Description</h4>
                <p>{selectedEvent.description}</p>
              </div>
            )}

            <div className="detail-section">
              <h4>Quick Actions</h4>
              <div className="action-buttons-vertical">
                <Link to={`/events/${selectedEvent.id}`} className="btn-action-full">
                  📋 View Full Details
                </Link>
                <Link to={`/events/${selectedEvent.id}/edit`} className="btn-action-full">
                  ✏️ Edit Event
                </Link>
                <Link to={`/admin?view=sales&eventId=${selectedEvent.id}`} className="btn-action-full">
                  💰 View Sales Data
                </Link>
                <Link to={`/admin?view=costing&eventId=${selectedEvent.id}`} className="btn-action-full">
                  💸 View Costs
                </Link>
                <Link to={`/admin?view=proposals&eventId=${selectedEvent.id}`} className="btn-action-full">
                  📄 View Proposals
                </Link>
                <Link to={`/modular-test?eventId=${selectedEvent.id}`} className="btn-action-full">
                  🗺️ View Floor Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagementView;

