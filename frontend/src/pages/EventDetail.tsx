import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import EventService from '../services/event.service';
import { Event } from '../types';
import './EventDetail.css';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
      loadStatistics();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EventService.getEventById(id!);
      setEvent(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await EventService.getEventStatistics(id!);
      setStatistics(stats);
    } catch (err) {
      // Statistics might not be available, that's okay
      console.log('Statistics not available');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await EventService.deleteEvent(id!);
      navigate('/events');
    } catch (err: any) {
      alert('Failed to delete event: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <div className="event-detail-container">
        <div className="loading">Loading event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail-container">
        <div className="error-message">
          {error || 'Event not found'}
        </div>
        <Link to="/events" className="btn-back">
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="event-detail-container">
      <div className="event-detail-header">
        <Link to="/events" className="btn-back">
          ← Back to Events
        </Link>
        <div className="header-actions">
          <Link to={`/events/${id}/edit`} className="btn-edit">
            Edit Event
          </Link>
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      </div>

      <div className="event-detail-content">
        <div className="event-main">
          <div className="event-title-section">
            <h1>{event.name}</h1>
            <span className={`status-badge ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>

          {event.description && (
            <div className="event-description">
              <h3>Description</h3>
              <p>{event.description}</p>
            </div>
          )}

          <div className="event-info-grid">
            <div className="info-item">
              <label>Venue</label>
              <p>{event.venue || 'Not specified'}</p>
            </div>
            <div className="info-item">
              <label>Start Date</label>
              <p>{formatDate(event.startDate)}</p>
            </div>
            <div className="info-item">
              <label>End Date</label>
              <p>{formatDate(event.endDate)}</p>
            </div>
            <div className="info-item">
              <label>Duration</label>
              <p>
                {Math.ceil(
                  (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
                )}{' '}
                days
              </p>
            </div>
          </div>

          <div className="event-actions">
            <Link to={`/events/${id}/booths`} className="btn-primary">
              Manage Booths
            </Link>
            <Link to={`/booths/available?eventId=${id}`} className="btn-secondary">
              View Available Booths
            </Link>
          </div>
        </div>

        {statistics && (
          <div className="event-statistics">
            <h2>Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{statistics.totalBooths}</div>
                <div className="stat-label">Total Booths</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{statistics.availableBooths}</div>
                <div className="stat-label">Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{statistics.reservedBooths}</div>
                <div className="stat-label">Reserved</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{statistics.bookedBooths}</div>
                <div className="stat-label">Booked</div>
              </div>
              <div className="stat-item stat-revenue">
                <div className="stat-value">
                  ${statistics.totalRevenue.toLocaleString()}
                </div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;

