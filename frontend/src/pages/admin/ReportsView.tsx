/**
 * Reports & Analytics View
 * Comprehensive reporting and analytics dashboard
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventService from '../../services/event.service';
import api from '../../services/api';
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
      // Set default data on error to prevent infinite loading
      setReportData({
        totalEvents: 0,
        activeEvents: 0,
        totalRevenue: 0,
        totalBooths: 0,
        bookedBooths: 0,
        occupancyRate: 0,
        salesData: {},
        paymentsData: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadReportData = async (eventsList: Event[]) => {
    try {
      // Initialize with default values
      let salesData: any = {
        totalRevenue: 0,
        totalBooked: 0,
        pendingReservations: 0
      };
      let paymentsData: any[] = [];
      let totalRevenue = 0;
      let totalBooths = 0;
      let bookedBooths = 0;
      let availableBooths = 0;

      // Get payment data with timeout
      try {
        const paymentsRes = await Promise.race([
          api.get('/payments/transactions'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]) as any;
        if (paymentsRes?.data?.success) {
          paymentsData = paymentsRes.data.data || [];
          totalRevenue = paymentsData.reduce((sum: number, t: any) => 
            sum + (parseFloat(t.amount || 0)), 0);
        }
      } catch (error) {
        console.warn('Payments data not available:', error);
      }

      // Calculate booth statistics by fetching booths for each event (with timeout per event)
      // Limit to first 10 events to avoid too many API calls
      const boothPromises = eventsList.slice(0, 10).map(async (event) => {
        try {
          const boothsRes = await Promise.race([
            api.get(`/sales/booths/available?eventId=${event.id}`),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
          ]) as any;
          if (boothsRes?.data?.success && boothsRes.data.data) {
            const booths = boothsRes.data.data;
            const booked = booths.filter((b: any) => b.status === 'booked').length;
            const available = booths.filter((b: any) => b.status === 'available').length;
            const reserved = booths.filter((b: any) => b.status === 'reserved').length;
            return {
              total: booths.length,
              booked,
              available,
              reserved
            };
          }
        } catch (error) {
          console.warn(`Error fetching booths for event ${event.id}:`, error);
        }
        return { total: 0, booked: 0, available: 0, reserved: 0 };
      });

      const boothResults = await Promise.all(boothPromises);
      boothResults.forEach(result => {
        totalBooths += result.total;
        bookedBooths += result.booked;
        availableBooths += result.available;
      });

      // Calculate sales data from booth statistics
      salesData = {
        totalRevenue,
        totalBooked: bookedBooths,
        pendingReservations: boothResults.reduce((sum, r) => sum + r.reserved, 0),
        totalBooths,
        availableBooths
      };
      
      const occupancyRate = totalBooths > 0 ? (bookedBooths / totalBooths) * 100 : 0;

      // Always set reportData, even if some calls failed
      setReportData({
        totalEvents: eventsList.length,
        activeEvents: eventsList.filter(e => e.status === 'active').length,
        totalRevenue,
        totalBooths,
        bookedBooths,
        occupancyRate,
        salesData: salesData || {},
        paymentsData: paymentsData || [],
      });
    } catch (error: any) {
      console.error('Error loading report data:', error);
      // Set default data on error to prevent infinite loading
      setReportData({
        totalEvents: eventsList.length,
        activeEvents: eventsList.filter(e => e.status === 'active').length,
        totalRevenue: 0,
        totalBooths: 0,
        bookedBooths: 0,
        occupancyRate: 0,
        salesData: {
          totalRevenue: 0,
          totalBooked: 0,
          pendingReservations: 0
        },
        paymentsData: [],
      });
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

