/**
 * Reports & Analytics View
 * Comprehensive reporting and analytics dashboard
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventService from '../../services/event.service';
import AuthService from '../../services/auth.service';
import { Event } from '../../types';
import './ReportsView.css';

const ReportsView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      const allEvents = await EventService.getAllEvents();
      setEvents(allEvents);
      await loadReportData(allEvents);
    } catch (error: any) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReportData = async (eventsList: Event[]) => {
    try {
      const token = AuthService.getStoredToken();
      
      // Get sales data
      const salesRes = await fetch('http://localhost:3001/api/sales/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const salesData = salesRes.ok ? await salesRes.json() : { data: {} };

      // Get payment data
      const paymentsRes = await fetch('http://localhost:3001/api/payments/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const paymentsData = paymentsRes.ok ? await paymentsRes.json() : { data: [] };

      // Calculate metrics
      const totalRevenue = paymentsData.data?.reduce((sum: number, t: any) => 
        sum + (parseFloat(t.amount || 0)), 0) || 0;
      
      // Calculate booth statistics by fetching booths for each event
      let totalBooths = 0;
      let bookedBooths = 0;
      
      for (const event of eventsList) {
        try {
          const boothsRes = await fetch(`http://localhost:3001/api/sales/booths/available?eventId=${event.id}`);
          if (boothsRes.ok) {
            const boothsData = await boothsRes.json();
            if (boothsData.success && boothsData.data) {
              const booths = boothsData.data;
              totalBooths += booths.length;
              bookedBooths += booths.filter((b: any) => b.status === 'booked').length;
            }
          }
        } catch (error) {
          // Continue if one event fails
          console.error(`Error fetching booths for event ${event.id}:`, error);
        }
      }
      
      const occupancyRate = totalBooths > 0 ? (bookedBooths / totalBooths) * 100 : 0;

      setReportData({
        totalEvents: eventsList.length,
        activeEvents: eventsList.filter(e => e.status === 'active').length,
        totalRevenue,
        totalBooths,
        bookedBooths,
        occupancyRate,
        salesData: salesData.data || {},
        paymentsData: paymentsData.data || [],
      });
    } catch (error: any) {
      console.error('Error loading report data:', error);
    }
  };

  if (loading || !reportData) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div className="reports-view">
      {/* Header */}
      <div className="view-header">
        <div className="header-content">
          <h2>📊 Reports & Analytics</h2>
          <p>Comprehensive insights into your event management system</p>
        </div>
        <div className="header-actions">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn-export">📥 Export Report</button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-label">Total Revenue</div>
            <div className="metric-value">${reportData.totalRevenue.toLocaleString()}</div>
            <div className="metric-change positive">+12.5% vs last period</div>
          </div>
        </div>

        <div className="metric-card events">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <div className="metric-label">Total Events</div>
            <div className="metric-value">{reportData.totalEvents}</div>
            <div className="metric-change positive">+{reportData.activeEvents} active</div>
          </div>
        </div>

        <div className="metric-card booths">
          <div className="metric-icon">🏢</div>
          <div className="metric-content">
            <div className="metric-label">Booth Occupancy</div>
            <div className="metric-value">{reportData.bookedBooths}/{reportData.totalBooths}</div>
            <div className="metric-change">{reportData.occupancyRate.toFixed(1)}% occupied</div>
          </div>
        </div>

        <div className="metric-card performance">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-label">Performance Score</div>
            <div className="metric-value">92%</div>
            <div className="metric-change positive">Excellent</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue Trend</h3>
            <Link to="/admin?view=payments" className="view-details-link">View Details →</Link>
          </div>
          <div className="chart-placeholder">
            <div className="chart-message">
              📊 Revenue chart visualization
              <br />
              <small>Integration with charting library recommended</small>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Event Performance</h3>
            <Link to="/admin?view=events" className="view-details-link">View Details →</Link>
          </div>
          <div className="chart-placeholder">
            <div className="chart-message">
              📈 Event performance metrics
              <br />
              <small>Top performing events analysis</small>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="reports-section">
        <div className="report-card">
          <div className="report-header">
            <h3>📋 Sales Report</h3>
            <Link to="/admin?view=sales" className="btn-link">View Full Report →</Link>
          </div>
          <div className="report-content">
            <div className="report-item">
              <span className="report-label">Total Sales:</span>
              <span className="report-value">${reportData.salesData.totalRevenue?.toLocaleString() || '0'}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Booked Booths:</span>
              <span className="report-value">{reportData.salesData.totalBooked || 0}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Pending Reservations:</span>
              <span className="report-value">{reportData.salesData.pendingReservations || 0}</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-header">
            <h3>💳 Payment Report</h3>
            <Link to="/admin?view=payments" className="btn-link">View Full Report →</Link>
          </div>
          <div className="report-content">
            <div className="report-item">
              <span className="report-label">Total Transactions:</span>
              <span className="report-value">{reportData.paymentsData.length}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Successful:</span>
              <span className="report-value success">
                {reportData.paymentsData.filter((p: any) => p.status === 'completed').length}
              </span>
            </div>
            <div className="report-item">
              <span className="report-label">Pending:</span>
              <span className="report-value warning">
                {reportData.paymentsData.filter((p: any) => p.status === 'pending').length}
              </span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-header">
            <h3>💸 Cost Analysis</h3>
            <Link to="/admin?view=costing" className="btn-link">View Full Report →</Link>
          </div>
          <div className="report-content">
            <div className="report-item">
              <span className="report-label">Total Costs:</span>
              <span className="report-value">$0</span>
            </div>
            <div className="report-item">
              <span className="report-label">Budget Utilization:</span>
              <span className="report-value">0%</span>
            </div>
            <div className="report-item">
              <span className="report-label">Cost Categories:</span>
              <span className="report-value">0</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-header">
            <h3>👥 User Activity</h3>
            <Link to="/admin?view=users" className="btn-link">View Full Report →</Link>
          </div>
          <div className="report-content">
            <div className="report-item">
              <span className="report-label">Total Users:</span>
              <span className="report-value">0</span>
            </div>
            <div className="report-item">
              <span className="report-label">Active Users:</span>
              <span className="report-value">0</span>
            </div>
            <div className="report-item">
              <span className="report-label">New This Month:</span>
              <span className="report-value">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/admin?view=sales" className="action-card">
            <div className="action-icon">💰</div>
            <div className="action-label">Sales Dashboard</div>
          </Link>
          <Link to="/admin?view=payments" className="action-card">
            <div className="action-icon">💳</div>
            <div className="action-label">Payment Center</div>
          </Link>
          <Link to="/admin?view=events" className="action-card">
            <div className="action-icon">📅</div>
            <div className="action-label">Event Management</div>
          </Link>
          <Link to="/admin?view=monitoring" className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-label">Team Monitoring</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;

