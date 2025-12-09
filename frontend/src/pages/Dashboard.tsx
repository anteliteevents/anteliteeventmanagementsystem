import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService, { User } from '../services/auth.service';
import EventService from '../services/event.service';
import { Event } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentUser = AuthService.getStoredUser();
      setUser(currentUser);

      // Load active events
      const activeEvents = await EventService.getActiveEvents();
      setEvents(activeEvents.slice(0, 3)); // Show latest 3
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.firstName}!</h1>
          <p className="dashboard-subtitle">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Exhibitor Dashboard'}
          </p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/events" className="action-btn">
              <span className="action-icon">📅</span>
              <span>View All Events</span>
            </Link>
            <Link to="/events/new" className="action-btn">
              <span className="action-icon">➕</span>
              <span>Create Event</span>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/events" className="action-btn">
                <span className="action-icon">⚙️</span>
                <span>Manage Events</span>
              </Link>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Your Profile</h2>
          <div className="profile-info">
            <div className="profile-item">
              <strong>Name:</strong> {user?.firstName} {user?.lastName}
            </div>
            <div className="profile-item">
              <strong>Email:</strong> {user?.email}
            </div>
            {user?.companyName && (
              <div className="profile-item">
                <strong>Company:</strong> {user.companyName}
              </div>
            )}
            {user?.phone && (
              <div className="profile-item">
                <strong>Phone:</strong> {user.phone}
              </div>
            )}
            <div className="profile-item">
              <strong>Role:</strong> <span className="role-badge">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h2>Active Events</h2>
          <Link to="/events" className="view-all-link">View All →</Link>
        </div>
        {events.length === 0 ? (
          <p className="empty-state">No active events found.</p>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="event-item">
                <div className="event-item-content">
                  <h3>{event.name}</h3>
                  <p className="event-meta">
                    {event.venue && <span>📍 {event.venue}</span>}
                    <span>
                      📅 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <span className="event-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

