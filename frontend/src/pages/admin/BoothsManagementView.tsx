/**
 * Booths Management View
 * Complete interface for managing booths across all events
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventService from '../../services/event.service';
import { Event } from '../../types';
import './BoothsManagementView.css';

interface Booth {
  id: string;
  eventId: string;
  boothNumber: string;
  size: string;
  price: number;
  status: string;
  locationX: number;
  locationY: number;
  description?: string;
  amenities?: string[];
}

const BoothsManagementView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadBooths();
    }
  }, [selectedEventId]);

  const loadEvents = async () => {
    try {
      const allEvents = await EventService.getAllEvents();
      setEvents(allEvents);
      if (allEvents.length > 0 && !selectedEventId) {
        setSelectedEventId(allEvents[0].id);
      }
    } catch (error: any) {
      console.error('Error loading events:', error);
    }
  };

  const loadBooths = async () => {
    if (!selectedEventId) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/sales/booths/available?eventId=${selectedEventId}`);
      const data = await response.json();
      
      if (data.success) {
        // Get all booths, not just available
        const allBoothsResponse = await fetch(`http://localhost:3001/api/booths?eventId=${selectedEventId}`);
        const allBoothsData = await allBoothsResponse.json();
        setBooths(allBoothsData.data || data.data || []);
      }
    } catch (error: any) {
      console.error('Error loading booths:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooths = booths.filter(booth => {
    const matchesFilter = filter === 'all' || booth.status === filter;
    const matchesSearch = booth.boothNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booth.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: booths.length,
    available: booths.filter(b => b.status === 'available').length,
    reserved: booths.filter(b => b.status === 'reserved').length,
    booked: booths.filter(b => b.status === 'booked').length,
    totalRevenue: booths.filter(b => b.status === 'booked').reduce((sum, b) => sum + parseFloat(b.price.toString()), 0),
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  if (loading && booths.length === 0) {
    return <div className="loading">Loading booths...</div>;
  }

  return (
    <div className="booths-management-view">
      {/* Header */}
      <div className="view-header">
        <div className="header-content">
          <h2>🏢 Booths Management</h2>
          <p>Manage booths across all events</p>
        </div>
        <div className="header-actions">
          <Link to="/modular-test" className="btn-create">
            🗺️ View Floor Plans
          </Link>
        </div>
      </div>

      {/* Event Selector */}
      <div className="event-selector-card">
        <label>Select Event:</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="event-select"
        >
          <option value="">-- Select an Event --</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} ({new Date(event.startDate).toLocaleDateString()})
            </option>
          ))}
        </select>
        {selectedEvent && (
          <div className="event-info">
            <span>📍 {selectedEvent.venue || 'Venue TBD'}</span>
            <span className={`status-badge status-${selectedEvent.status}`}>
              {selectedEvent.status}
            </span>
          </div>
        )}
      </div>

      {selectedEventId && (
        <>
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Booths</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value available">{stats.available}</div>
                <div className="stat-label">Available</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-value reserved">{stats.reserved}</div>
                <div className="stat-label">Reserved</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value booked">{stats.booked}</div>
                <div className="stat-label">Booked</div>
              </div>
            </div>
            <div className="stat-card revenue">
              <div className="stat-icon">💵</div>
              <div className="stat-content">
                <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Revenue</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by booth number or description..."
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
                className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
                onClick={() => setFilter('available')}
              >
                Available ({stats.available})
              </button>
              <button
                className={`filter-btn ${filter === 'reserved' ? 'active' : ''}`}
                onClick={() => setFilter('reserved')}
              >
                Reserved ({stats.reserved})
              </button>
              <button
                className={`filter-btn ${filter === 'booked' ? 'active' : ''}`}
                onClick={() => setFilter('booked')}
              >
                Booked ({stats.booked})
              </button>
            </div>
          </div>

          {/* Booths Table */}
          <div className="booths-table-container">
            <table className="booths-table">
              <thead>
                <tr>
                  <th>Booth #</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Amenities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooths.map(booth => (
                  <tr key={booth.id}>
                    <td>
                      <strong>{booth.boothNumber}</strong>
                    </td>
                    <td>
                      <span className="size-badge size-{booth.size}">{booth.size}</span>
                    </td>
                    <td>${parseFloat(booth.price.toString()).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${booth.status}`}>
                        {booth.status}
                      </span>
                    </td>
                    <td>({booth.locationX}, {booth.locationY})</td>
                    <td>
                      {booth.amenities && booth.amenities.length > 0 ? (
                        <div className="amenities-list">
                          {booth.amenities.slice(0, 2).map((amenity, idx) => (
                            <span key={idx} className="amenity-tag">{amenity}</span>
                          ))}
                          {booth.amenities.length > 2 && (
                            <span className="amenity-more">+{booth.amenities.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/modular-test?eventId=${selectedEventId}&boothId=${booth.id}`}
                          className="btn-action-icon"
                          title="View on Floor Plan"
                        >
                          🗺️
                        </Link>
                        <Link
                          to={`/admin?view=sales&eventId=${selectedEventId}`}
                          className="btn-action-icon"
                          title="View Sales"
                        >
                          💰
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBooths.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3>No booths found</h3>
              <p>{searchTerm ? 'Try a different search term' : 'No booths available for this event'}</p>
            </div>
          )}
        </>
      )}

      {!selectedEventId && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>Select an Event</h3>
          <p>Choose an event from the dropdown above to view and manage its booths</p>
        </div>
      )}
    </div>
  );
};

export default BoothsManagementView;

