/**
 * Sales Department View Component
 * 
 * Enhanced sales department view with modern UI and skeleton loaders.
 * 
 * @component
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

interface SalesDepartmentViewProps {
  data: any;
  onRefresh: () => void;
}

const SalesDepartmentView: React.FC<SalesDepartmentViewProps> = ({ data, onRefresh }) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<string>('all');

  if (!data) {
    return (
      <div className="sales-view enhanced-view">
        <div className="loading-skeleton">
          <div className="skeleton-header">
            <SkeletonLoader width={200} height={32} />
            <SkeletonLoader width={120} height={32} />
          </div>
          <div className="skeleton-stats">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-stat-card">
                <SkeletonLoader width={60} height={60} borderRadius="50%" />
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

  return (
    <div className="sales-view enhanced-view">
      {/* Sales Overview Cards */}
      <div className="sales-overview">
        <div className="sales-card revenue-card enhanced-card">
          <div className="card-header">
            <h3>💰 Total Revenue</h3>
            <button onClick={onRefresh} className="btn-refresh-small" aria-label="Refresh data">
              🔄
            </button>
          </div>
          <div className="card-value">${data.totalRevenue?.toLocaleString() || '0'}</div>
          <div className="card-footer">
            <span className="trend-up">↑ 12% from last month</span>
          </div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>🏢 Total Booths</h3>
          </div>
          <div className="card-value">{data.totalBooths || 0}</div>
          <div className="card-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Available:</span>
              <span className="breakdown-value available">{data.availableBooths || 0}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Booked:</span>
              <span className="breakdown-value booked">{data.bookedBooths || 0}</span>
            </div>
          </div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📊 Occupancy Rate</h3>
          </div>
          <div className="card-value">
            {data.totalBooths > 0 
              ? Math.round((data.bookedBooths / data.totalBooths) * 100) 
              : 0}%
          </div>
          <div className="occupancy-progress-bar">
            <div 
              className="progress-fill" 
              style={{ '--progress-width': `${data.totalBooths > 0 ? (data.bookedBooths / data.totalBooths) * 100 : 0}%` } as React.CSSProperties}
            ></div>
          </div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📈 Average Price</h3>
          </div>
          <div className="card-value">
            ${data.booths?.length > 0
              ? Math.round(data.booths.reduce((sum: number, b: any) => sum + parseFloat(b.price || 0), 0) / data.booths.length)
              : 0}
          </div>
        </div>
      </div>

      {/* Event Sales Breakdown */}
      <div className="sales-section enhanced-section">
        <div className="section-header">
          <h2>📅 Sales by Event</h2>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)} 
            className="time-filter enhanced-select"
            title="Filter by time range"
            aria-label="Filter sales by time range"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>
        <div className="events-sales-list">
          {data.events?.map((item: any) => (
            <div 
              key={item.event.id} 
              className={`event-sales-item enhanced-item ${selectedEvent?.id === item.event.id ? 'selected' : ''}`}
              onClick={() => setSelectedEvent(selectedEvent?.id === item.event.id ? null : item)}
            >
              <div className="event-sales-header">
                <h4>{item.event.name}</h4>
                <span className={`event-status status-${item.event.status}`}>{item.event.status}</span>
              </div>
              {item.statistics && (
                <div className="event-sales-stats">
                  <div className="stat-mini">
                    <span className="stat-mini-label">Revenue:</span>
                    <span className="stat-mini-value">${item.statistics.totalRevenue?.toLocaleString() || 0}</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-label">Booked:</span>
                    <span className="stat-mini-value">{item.statistics.bookedBooths || 0}/{item.statistics.totalBooths || 0}</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-label">Available:</span>
                    <span className="stat-mini-value available">{item.statistics.availableBooths || 0}</span>
                  </div>
                </div>
              )}
              {!item.statistics && (
                <div className="no-stats">No statistics available</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="sales-section enhanced-section">
          <div className="section-header">
            <h2>📊 {selectedEvent.event.name} - Detailed View</h2>
            <button onClick={() => setSelectedEvent(null)} className="btn-close enhanced-btn-close" aria-label="Close details">
              ✕
            </button>
          </div>
          <div className="event-details-grid">
            <div className="detail-card enhanced-card">
              <h4>Event Information</h4>
              <div className="detail-item">
                <strong>Venue:</strong> {selectedEvent.event.venue || 'TBD'}
              </div>
              <div className="detail-item">
                <strong>Start:</strong> {new Date(selectedEvent.event.startDate).toLocaleDateString()}
              </div>
              <div className="detail-item">
                <strong>End:</strong> {new Date(selectedEvent.event.endDate).toLocaleDateString()}
              </div>
              <div className="detail-item">
                <strong>Status:</strong> <span className={`status-badge status-${selectedEvent.event.status}`}>{selectedEvent.event.status}</span>
              </div>
            </div>

            {selectedEvent.statistics && (
              <>
                <div className="detail-card enhanced-card">
                  <h4>Booth Statistics</h4>
                  <div className="stat-visual">
                    <div className="stat-bar">
                      <div className="stat-bar-label">Total Booths</div>
                      <div className="stat-bar-value">{selectedEvent.statistics.totalBooths || 0}</div>
                    </div>
                    <div className="stat-bar">
                      <div className="stat-bar-label">Available</div>
                      <div className="stat-bar-value available">{selectedEvent.statistics.availableBooths || 0}</div>
                    </div>
                    <div className="stat-bar">
                      <div className="stat-bar-label">Reserved</div>
                      <div className="stat-bar-value reserved">{selectedEvent.statistics.reservedBooths || 0}</div>
                    </div>
                    <div className="stat-bar">
                      <div className="stat-bar-label">Booked</div>
                      <div className="stat-bar-value booked">{selectedEvent.statistics.bookedBooths || 0}</div>
                    </div>
                  </div>
                </div>

                <div className="detail-card revenue-card enhanced-card">
                  <h4>Revenue</h4>
                  <div className="revenue-amount">
                    ${selectedEvent.statistics.totalRevenue?.toLocaleString() || '0'}
                  </div>
                  <div className="revenue-breakdown">
                    <div className="revenue-item">
                      <span>From Bookings:</span>
                      <span>${selectedEvent.statistics.totalRevenue?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="detail-card actions-card enhanced-card">
              <h4>Quick Actions</h4>
              <div className="action-buttons">
                <Link to={`/events/${selectedEvent.event.id}`} className="btn-action enhanced-btn">
                  📋 View Event Details
                </Link>
                <Link to={`/events/${selectedEvent.event.id}/edit`} className="btn-action enhanced-btn">
                  ✏️ Edit Event
                </Link>
                <Link to={`/modular-test`} className="btn-action enhanced-btn">
                  🗺️ View Floor Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="sales-section enhanced-section">
        <h2>📝 Recent Sales Activity</h2>
        <div className="activity-list">
          <div className="activity-item enhanced-item">
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <div className="activity-title">Booth A1 booked</div>
              <div className="activity-meta">Event: Tech Expo 2024 • 2 minutes ago</div>
            </div>
            <div className="activity-amount">$500</div>
          </div>
          <div className="activity-item enhanced-item">
            <div className="activity-icon">📦</div>
            <div className="activity-content">
              <div className="activity-title">Booth B2 reserved</div>
              <div className="activity-meta">Event: Tech Expo 2024 • 5 minutes ago</div>
            </div>
            <div className="activity-status reserved">Reserved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDepartmentView;

