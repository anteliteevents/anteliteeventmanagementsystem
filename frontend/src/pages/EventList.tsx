import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventService, { EventFilters } from '../services/event.service';
import { Event } from '../types';
import './EventList.css';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EventService.getAllEvents(filters);
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'published':
        return 'status-published';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-draft';
    }
  };

  if (loading) {
    return (
      <div className="event-list-container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h1>Event Management</h1>
        <div className="header-actions">
          <button
            className="btn-filter"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <Link to="/events/new" className="btn-primary">
            Create New Event
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Start Date From</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>End Date To</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          <button className="btn-clear" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No events found.</p>
          <Link to="/events/new" className="btn-primary">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="event-card"
            >
              <div className="event-card-header">
                <h2>{event.name}</h2>
                <span className={`status-badge ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
              <div className="event-details">
                <div className="detail-item">
                  <strong>Venue:</strong> {event.venue || 'TBD'}
                </div>
                <div className="detail-item">
                  <strong>Start:</strong> {formatDate(event.startDate)}
                </div>
                <div className="detail-item">
                  <strong>End:</strong> {formatDate(event.endDate)}
                </div>
              </div>
              <div className="event-card-footer">
                <span className="view-details">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;

