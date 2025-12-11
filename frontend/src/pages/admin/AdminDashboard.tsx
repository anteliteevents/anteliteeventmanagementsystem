/**
 * Admin Dashboard
 * 
 * Comprehensive interactive admin backend with department views
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService, { User } from '../../services/auth.service';
import EventService from '../../services/event.service';
import api from '../../services/api';
import EventsManagementView from './EventsManagementView';
import BoothsManagementView from './BoothsManagementView';
import UsersManagementView from './UsersManagementView';
import ReportsViewComponent from './ReportsView';
import SettingsViewComponent from './SettingsView';
import './AdminDashboard.css';
import './shared-components.css';

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('overview');
  const [salesData, setSalesData] = useState<any>(null);
  const [paymentsData, setPaymentsData] = useState<any>(null);
  const [costingData, setCostingData] = useState<any>(null);
  const [proposalsData, setProposalsData] = useState<any>(null);
  const [monitoringData, setMonitoringData] = useState<any>(null);
  const [policiesData, setPoliciesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getStoredUser();
    setUser(currentUser);
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeView === 'sales') {
      loadSalesData();
    } else if (activeView === 'payments') {
      loadPaymentsData();
    } else if (activeView === 'costing') {
      loadCostingData();
    } else if (activeView === 'proposals') {
      loadProposalsData();
    } else if (activeView === 'monitoring') {
      loadMonitoringData();
    } else if (activeView === 'policies') {
      loadPoliciesData();
    }
  }, [activeView]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load initial data
    } finally {
      setLoading(false);
    }
  };

  const loadSalesData = async () => {
    try {
      setLoading(true);
      // Load comprehensive sales data
      const events = await EventService.getAllEvents();

      // Get sales statistics for each event
      const salesPromises = events.map(async (event) => {
        try {
          const statistics = await EventService.getEventStatistics(event.id);
          return {
            event,
            statistics
          };
        } catch {
          return { event, statistics: null };
        }
      });

      const salesResults = await Promise.all(salesPromises);

      // Get available booths for first event (as sample)
      let booths: any[] = [];
      if (events[0]?.id) {
        try {
          const boothsResponse = await api.get('/booths/available', {
            params: { eventId: events[0].id }
          });
          booths = boothsResponse.data?.data || boothsResponse.data || [];
        } catch (err) {
          console.warn('Booth fetch failed', err);
        }
      }

      setSalesData({
        events: salesResults,
        totalRevenue: salesResults.reduce((sum, item) => sum + (item.statistics?.totalRevenue || 0), 0),
        totalBooths: salesResults.reduce((sum, item) => sum + (item.statistics?.totalBooths || 0), 0),
        bookedBooths: salesResults.reduce((sum, item) => sum + (item.statistics?.bookedBooths || 0), 0),
        availableBooths: salesResults.reduce((sum, item) => sum + (item.statistics?.availableBooths || 0), 0),
        booths
      });
    } catch (error: any) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentsData = async () => {
    try {
      setLoading(true);
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      // Get all transactions
      const transactionsRes = await api.get('/payments/transactions', { headers });
      const transactions = transactionsRes.data || {};

      // Get all invoices
      const invoicesRes = await api.get('/payments/invoices', { headers });
      const invoices = invoicesRes.data || {};

      const totalRevenue =
        transactions.data?.reduce((sum: number, t: any) => sum + (parseFloat(t.amount) || 0), 0) || 0;
      const completedPayments = transactions.data?.filter((t: any) => t.status === 'completed').length || 0;
      const pendingPayments = transactions.data?.filter((t: any) => t.status === 'pending').length || 0;
      const paidInvoices = invoices.data?.filter((i: any) => i.status === 'paid').length || 0;

      setPaymentsData({
        transactions: transactions.data || [],
        invoices: invoices.data || [],
        totalRevenue,
        completedPayments,
        pendingPayments,
        paidInvoices,
        totalTransactions: transactions.data?.length || 0,
        totalInvoices: invoices.data?.length || 0
      });
    } catch (error: any) {
      console.error('Error loading payments data:', error);
      setPaymentsData({ transactions: [], invoices: [], totalRevenue: 0, completedPayments: 0, pendingPayments: 0, paidInvoices: 0 });
    } finally {
      setLoading(false);
    }
  };

  const loadCostingData = async () => {
    try {
      setLoading(true);
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const events = await EventService.getAllEvents();
      
      // Get cost summaries for all events
      const costPromises = events.map(async (event) => {
        try {
          const response = await api.get(`/costing/summary/event/${event.id}`, { headers });
          const data = response.data;
          return { event, summary: data.data || null };
        } catch {}
        return { event, summary: null };
      });
      
      const costResults = await Promise.all(costPromises);
      const totalSpent = costResults.reduce((sum, item) => sum + (item.summary?.totalSpent || 0), 0);
      const totalBudget = costResults.reduce((sum, item) => sum + (item.summary?.totalBudget || 0), 0);
      
      setCostingData({
        events: costResults,
        totalSpent,
        totalBudget,
        remaining: totalBudget - totalSpent,
        eventsWithCosts: costResults.filter(item => item.summary).length
      });
    } catch (error: any) {
      console.error('Error loading costing data:', error);
      setCostingData({ events: [], totalSpent: 0, totalBudget: 0, remaining: 0, eventsWithCosts: 0 });
    } finally {
      setLoading(false);
    }
  };

  const loadProposalsData = async () => {
    try {
      setLoading(true);
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const events = await EventService.getAllEvents();
      
      // Get proposals for all events
      const proposalPromises = events.map(async (event) => {
        try {
          const response = await api.get(`/proposals/event/${event.id}`, { headers });
          const data = response.data;
          return { event, proposals: data.data || [] };
        } catch {}
        return { event, proposals: [] };
      });
      
      const proposalResults = await Promise.all(proposalPromises);
      const allProposals = proposalResults.flatMap(item => item.proposals);
      
      // Get templates
      const templatesRes = await api.get('/proposals/templates', { headers });
      const templates = templatesRes.data || { data: [] };
      
      setProposalsData({
        events: proposalResults,
        allProposals,
        templates: templates.data || [],
        totalProposals: allProposals.length,
        draftProposals: allProposals.filter((p: any) => p.status === 'draft').length,
        submittedProposals: allProposals.filter((p: any) => p.status === 'submitted').length,
        approvedProposals: allProposals.filter((p: any) => p.status === 'approved').length
      });
    } catch (error: any) {
      console.error('Error loading proposals data:', error);
      setProposalsData({ events: [], allProposals: [], templates: [], totalProposals: 0, draftProposals: 0, submittedProposals: 0, approvedProposals: 0 });
    } finally {
      setLoading(false);
    }
  };

  const loadMonitoringData = async () => {
    try {
      setLoading(true);
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      
      // Get performance summary
      const performanceRes = await api.get('/monitoring/performance', { headers });
      const performance = performanceRes.data || { data: {} };
      
      // Get team activity
      const activityRes = await api.get('/monitoring/activity', { headers });
      const activity = activityRes.data || { data: [] };
      
      setMonitoringData({
        performance: performance.data || {},
        activities: activity.data || [],
        totalActivities: activity.data?.length || 0,
        topPerformers: performance.data?.topPerformers || []
      });
    } catch (error: any) {
      console.error('Error loading monitoring data:', error);
      setMonitoringData({ performance: {}, activities: [], totalActivities: 0, topPerformers: [] });
    } finally {
      setLoading(false);
    }
  };

  const loadPoliciesData = async () => {
    try {
      setLoading(true);
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      
      // Get all policies
      const policiesRes = await api.get('/policies', { headers });
      const policies = policiesRes.data || { data: [] };
      
      const activePolicies = policies.data?.filter((p: any) => p.isActive) || [];
      const categories = Array.from(new Set(policies.data?.map((p: any) => p.category).filter((c: any) => c) || []));
      
      setPoliciesData({
        policies: policies.data || [],
        activePolicies,
        categories,
        totalPolicies: policies.data?.length || 0,
        activeCount: activePolicies.length
      });
    } catch (error: any) {
      console.error('Error loading policies data:', error);
      setPoliciesData({ policies: [], activePolicies: [], categories: [], totalPolicies: 0, activeCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/login';
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  if (loading && !salesData) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <div className="user-info">
            <div className="user-avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
            <div className="user-details">
              <div className="user-name">{user?.firstName} {user?.lastName}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => handleViewChange('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`nav-item ${activeView === 'sales' ? 'active' : ''}`}
            onClick={() => handleViewChange('sales')}
          >
            💰 Sales Department
          </button>
          <button
            className={`nav-item ${activeView === 'events' ? 'active' : ''}`}
            onClick={() => handleViewChange('events')}
          >
            📅 Events
          </button>
          <button
            className={`nav-item ${activeView === 'booths' ? 'active' : ''}`}
            onClick={() => handleViewChange('booths')}
          >
            🏢 Booths
          </button>
          <button
            className={`nav-item ${activeView === 'users' ? 'active' : ''}`}
            onClick={() => handleViewChange('users')}
          >
            👥 Users
          </button>
          <button
            className={`nav-item ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => handleViewChange('reports')}
          >
            📈 Reports
          </button>
          <button
            className={`nav-item ${activeView === 'payments' ? 'active' : ''}`}
            onClick={() => handleViewChange('payments')}
          >
            💳 Payments
          </button>
          <button
            className={`nav-item ${activeView === 'costing' ? 'active' : ''}`}
            onClick={() => handleViewChange('costing')}
          >
            💰 Costing
          </button>
          <button
            className={`nav-item ${activeView === 'proposals' ? 'active' : ''}`}
            onClick={() => handleViewChange('proposals')}
          >
            📄 Proposals
          </button>
          <button
            className={`nav-item ${activeView === 'monitoring' ? 'active' : ''}`}
            onClick={() => handleViewChange('monitoring')}
          >
            📊 Monitoring
          </button>
          <button
            className={`nav-item ${activeView === 'policies' ? 'active' : ''}`}
            onClick={() => handleViewChange('policies')}
          >
            📋 Policies
          </button>
          <button
            className={`nav-item ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => handleViewChange('reports')}
          >
            📈 Reports
          </button>
          <button
            className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => handleViewChange('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <h1>
            {activeView === 'overview' && '📊 Dashboard Overview'}
            {activeView === 'sales' && '💰 Sales Department'}
            {activeView === 'payments' && '💳 Payments Department'}
            {activeView === 'costing' && '💰 Costing Department'}
            {activeView === 'proposals' && '📄 Proposals Department'}
            {activeView === 'monitoring' && '📊 Monitoring Department'}
            {activeView === 'policies' && '📋 Policies Department'}
            {activeView === 'events' && '📅 Events Management'}
            {activeView === 'booths' && '🏢 Booth Management'}
            {activeView === 'users' && '👥 User Management'}
            {activeView === 'reports' && '📈 Reports & Analytics'}
            {activeView === 'settings' && '⚙️ System Settings'}
          </h1>
          <div className="header-actions">
            <Link to="/events/new" className="btn-primary">
              ➕ Create Event
            </Link>
            <Link to="/modular-test" className="btn-secondary">
              🧪 Test Center
            </Link>
          </div>
        </div>

        <div className="admin-content">
          {activeView === 'overview' && <OverviewView />}
          {activeView === 'sales' && <SalesDepartmentView data={salesData} onRefresh={loadSalesData} />}
          {activeView === 'payments' && <PaymentsDepartmentView data={paymentsData} onRefresh={loadPaymentsData} />}
          {activeView === 'costing' && <CostingDepartmentView data={costingData} onRefresh={loadCostingData} />}
          {activeView === 'proposals' && <ProposalsDepartmentView data={proposalsData} onRefresh={loadProposalsData} />}
          {activeView === 'monitoring' && <MonitoringDepartmentView data={monitoringData} onRefresh={loadMonitoringData} />}
          {activeView === 'policies' && <PoliciesDepartmentView data={policiesData} onRefresh={loadPoliciesData} />}
          {activeView === 'events' && <EventsView />}
          {activeView === 'booths' && <BoothsView />}
          {activeView === 'users' && <UsersView />}
          {activeView === 'reports' && <ReportsViewComponent />}
          {activeView === 'settings' && <SettingsViewComponent />}
        </div>
      </main>
    </div>
  );
};

// Overview View Component
const OverviewView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadOverviewStats();
  }, []);

  const loadOverviewStats = async () => {
    try {
      const [eventsRes, systemRes] = await Promise.all([
        api.get('/events'),
        api.get('/health', { baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001' })
      ]);

      const eventsData = eventsRes.data || {};
      const systemData = systemRes.data || {};

      setStats({
        totalEvents: eventsData.data?.length || 0,
        activeModules: systemData.modules?.length || 0,
        systemStatus: systemData.status
      });
    } catch (error) {
      console.error('Error loading overview:', error);
    }
  };

  return (
    <div className="overview-view">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalEvents || 0}</div>
            <div className="stat-label">Total Events</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.activeModules || 0}</div>
            <div className="stat-label">Active Modules</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.systemStatus || 'Unknown'}</div>
            <div className="stat-label">System Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sales Department View - COMPREHENSIVE
const SalesDepartmentView: React.FC<{ data: any; onRefresh: () => void }> = ({ data, onRefresh }) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<string>('all');

  if (!data) {
    return (
      <div className="sales-view">
        <div className="loading">Loading sales data...</div>
      </div>
    );
  }

  return (
    <div className="sales-view">
      {/* Sales Overview Cards */}
      <div className="sales-overview">
        <div className="sales-card revenue-card">
          <div className="card-header">
            <h3>💰 Total Revenue</h3>
            <button onClick={onRefresh} className="btn-refresh-small">🔄</button>
          </div>
          <div className="card-value">${data.totalRevenue?.toLocaleString() || '0'}</div>
          <div className="card-footer">
            <span className="trend-up">↑ 12% from last month</span>
          </div>
        </div>

        <div className="sales-card">
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

        <div className="sales-card">
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

        <div className="sales-card">
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
      <div className="sales-section">
        <div className="section-header">
          <h2>📅 Sales by Event</h2>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)} 
            className="time-filter"
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
              className={`event-sales-item ${selectedEvent?.id === item.event.id ? 'selected' : ''}`}
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
        <div className="sales-section">
          <div className="section-header">
            <h2>📊 {selectedEvent.event.name} - Detailed View</h2>
            <button onClick={() => setSelectedEvent(null)} className="btn-close">✕</button>
          </div>
          <div className="event-details-grid">
            <div className="detail-card">
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
                <div className="detail-card">
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

                <div className="detail-card revenue-card">
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

            <div className="detail-card actions-card">
              <h4>Quick Actions</h4>
              <div className="action-buttons">
                <Link to={`/events/${selectedEvent.event.id}`} className="btn-action">
                  📋 View Event Details
                </Link>
                <Link to={`/events/${selectedEvent.event.id}/edit`} className="btn-action">
                  ✏️ Edit Event
                </Link>
                <Link to={`/modular-test`} className="btn-action">
                  🗺️ View Floor Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="sales-section">
        <h2>📝 Recent Sales Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <div className="activity-title">Booth A1 booked</div>
              <div className="activity-meta">Event: Tech Expo 2024 • 2 minutes ago</div>
            </div>
            <div className="activity-amount">$500</div>
          </div>
          <div className="activity-item">
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

// Payments Department View
const PaymentsDepartmentView: React.FC<{ data: any; onRefresh: () => void }> = ({ data, onRefresh }) => {
  if (!data) {
    return <div className="loading">Loading payments data...</div>;
  }

  return (
    <div className="sales-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card">
          <div className="card-header">
            <h3>💳 Total Revenue</h3>
            <button onClick={onRefresh} className="btn-refresh-small">🔄</button>
          </div>
          <div className="card-value">${data.totalRevenue?.toLocaleString() || '0'}</div>
          <div className="card-footer">From all transactions</div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>✅ Completed Payments</h3>
          </div>
          <div className="card-value">{data.completedPayments || 0}</div>
          <div className="card-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Pending:</span>
              <span className="breakdown-value">{data.pendingPayments || 0}</span>
            </div>
          </div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>📄 Invoices</h3>
          </div>
          <div className="card-value">{data.totalInvoices || 0}</div>
          <div className="card-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Paid:</span>
              <span className="breakdown-value available">{data.paidInvoices || 0}</span>
            </div>
          </div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>📊 Total Transactions</h3>
          </div>
          <div className="card-value">{data.totalTransactions || 0}</div>
        </div>
      </div>

      <div className="sales-section">
        <h2>💳 Recent Transactions</h2>
        <div className="events-sales-list">
          {data.transactions?.slice(0, 10).map((transaction: any) => (
            <div key={transaction.id} className="event-sales-item">
              <div className="event-sales-header">
                <h4>Transaction {transaction.id.slice(0, 8)}</h4>
                <span className={`event-status status-${transaction.status}`}>{transaction.status}</span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Amount:</span>
                  <span className="stat-mini-value">${parseFloat(transaction.amount || 0).toLocaleString()}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Method:</span>
                  <span className="stat-mini-value">{transaction.paymentMethod || 'N/A'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Date:</span>
                  <span className="stat-mini-value">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {(!data.transactions || data.transactions.length === 0) && (
            <div className="no-stats">No transactions yet</div>
          )}
        </div>
      </div>

      <div className="sales-section">
        <h2>📄 Recent Invoices</h2>
        <div className="events-sales-list">
          {data.invoices?.slice(0, 10).map((invoice: any) => (
            <div key={invoice.id} className="event-sales-item">
              <div className="event-sales-header">
                <h4>{invoice.invoice_number}</h4>
                <span className={`event-status status-${invoice.status}`}>{invoice.status}</span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Amount:</span>
                  <span className="stat-mini-value">${parseFloat(invoice.total_amount || 0).toLocaleString()}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Event:</span>
                  <span className="stat-mini-value">{invoice.event_name || 'N/A'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Booth:</span>
                  <span className="stat-mini-value">{invoice.booth_number || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
          {(!data.invoices || data.invoices.length === 0) && (
            <div className="no-stats">No invoices yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Costing Department View
const CostingDepartmentView: React.FC<{ data: any; onRefresh: () => void }> = ({ data, onRefresh }) => {
  if (!data) {
    return <div className="loading">Loading costing data...</div>;
  }

  const budgetPercentage = data.totalBudget > 0 ? (data.totalSpent / data.totalBudget) * 100 : 0;

  return (
    <div className="sales-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card">
          <div className="card-header">
            <h3>💰 Total Budget</h3>
            <button onClick={onRefresh} className="btn-refresh-small">🔄</button>
          </div>
          <div className="card-value">${data.totalBudget?.toLocaleString() || '0'}</div>
        </div>

        <div className="sales-card">
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

        <div className="sales-card">
          <div className="card-header">
            <h3>📊 Budget Usage</h3>
          </div>
          <div className="card-value">{Math.round(budgetPercentage)}%</div>
          <div className="occupancy-progress-bar">
            <div className="progress-fill" style={{ '--progress-width': `${Math.min(budgetPercentage, 100)}%` } as React.CSSProperties}></div>
          </div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>📅 Events with Costs</h3>
          </div>
          <div className="card-value">{data.eventsWithCosts || 0}</div>
        </div>
      </div>

      <div className="sales-section">
        <h2>💰 Cost Breakdown by Event</h2>
        <div className="events-sales-list">
          {data.events?.filter((item: any) => item.summary).map((item: any) => (
            <div key={item.event.id} className="event-sales-item">
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
            </div>
          ))}
          {(!data.events || data.events.length === 0) && (
            <div className="no-stats">No cost data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Proposals Department View
const ProposalsDepartmentView: React.FC<{ data: any; onRefresh: () => void }> = ({ data, onRefresh }) => {
  if (!data) {
    return <div className="loading">Loading proposals data...</div>;
  }

  return (
    <div className="sales-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card">
          <div className="card-header">
            <h3>📄 Total Proposals</h3>
            <button onClick={onRefresh} className="btn-refresh-small">🔄</button>
          </div>
          <div className="card-value">{data.totalProposals || 0}</div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>📝 Draft</h3>
          </div>
          <div className="card-value">{data.draftProposals || 0}</div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>📤 Submitted</h3>
          </div>
          <div className="card-value">{data.submittedProposals || 0}</div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>✅ Approved</h3>
          </div>
          <div className="card-value">{data.approvedProposals || 0}</div>
        </div>
      </div>

      <div className="sales-section">
        <h2>📄 Recent Proposals</h2>
        <div className="events-sales-list">
          {data.allProposals?.slice(0, 10).map((proposal: any) => (
            <div key={proposal.id} className="event-sales-item">
              <div className="event-sales-header">
                <h4>{proposal.title}</h4>
                <span className={`event-status status-${proposal.status}`}>{proposal.status}</span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Event:</span>
                  <span className="stat-mini-value">{proposal.eventId?.slice(0, 8) || 'N/A'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Created:</span>
                  <span className="stat-mini-value">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                </div>
                {proposal.submittedAt && (
                  <div className="stat-mini">
                    <span className="stat-mini-label">Submitted:</span>
                    <span className="stat-mini-value">{new Date(proposal.submittedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!data.allProposals || data.allProposals.length === 0) && (
            <div className="no-stats">No proposals yet</div>
          )}
        </div>
      </div>

      <div className="sales-section">
        <h2>📋 Available Templates</h2>
        <div className="events-sales-list">
          {data.templates?.map((template: any) => (
            <div key={template.id} className="event-sales-item">
              <div className="event-sales-header">
                <h4>{template.name}</h4>
                {template.category && (
                  <span className="event-status">{template.category}</span>
                )}
              </div>
              {template.description && (
                <div className="event-sales-stats">
                  <div className="stat-mini">
                    <span className="stat-mini-label">Description:</span>
                    <span className="stat-mini-value">{template.description}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {(!data.templates || data.templates.length === 0) && (
            <div className="no-stats">No templates available</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Monitoring Department View
const MonitoringDepartmentView: React.FC<{ data: any; onRefresh: () => void }> = ({ data, onRefresh }) => {
  if (!data) {
    return <div className="loading">Loading monitoring data...</div>;
  }

  return (
    <div className="sales-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card">
          <div className="card-header">
            <h3>📊 Sales Performance</h3>
            <button onClick={onRefresh} className="btn-refresh-small">🔄</button>
          </div>
          <div className="card-value">{data.performance?.sales?.bookings || 0}</div>
          <div className="card-footer">Total Bookings</div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>💰 Revenue</h3>
          </div>
          <div className="card-value">${data.performance?.sales?.revenue?.toLocaleString() || '0'}</div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>📝 Total Activities</h3>
          </div>
          <div className="card-value">{data.totalActivities || 0}</div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>⭐ Top Performers</h3>
          </div>
          <div className="card-value">{data.topPerformers?.length || 0}</div>
        </div>
      </div>

      <div className="sales-section">
        <h2>⭐ Top Performers</h2>
        <div className="events-sales-list">
          {data.topPerformers?.map((performer: any, index: number) => (
            <div key={performer.id || index} className="event-sales-item">
              <div className="event-sales-header">
                <h4>{performer.first_name} {performer.last_name}</h4>
                <span className="event-status">#{index + 1}</span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Activities:</span>
                  <span className="stat-mini-value">{performer.activity_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
          {(!data.topPerformers || data.topPerformers.length === 0) && (
            <div className="no-stats">No performance data available</div>
          )}
        </div>
      </div>

      <div className="sales-section">
        <h2>📝 Recent Team Activity</h2>
        <div className="activity-list">
          {data.activities?.slice(0, 20).map((activity: any) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <div className="activity-title">{activity.action_type?.replace(/_/g, ' ')}</div>
                <div className="activity-meta">
                  {activity.first_name && `${activity.first_name} ${activity.last_name}`}
                  {activity.event_name && ` • ${activity.event_name}`}
                  {` • ${new Date(activity.created_at).toLocaleString()}`}
                </div>
              </div>
            </div>
          ))}
          {(!data.activities || data.activities.length === 0) && (
            <div className="no-stats">No activity logged yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Policies Department View
const PoliciesDepartmentView: React.FC<{ data: any; onRefresh: () => void }> = ({ data, onRefresh }) => {
  if (!data) {
    return <div className="loading">Loading policies data...</div>;
  }

  return (
    <div className="sales-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card">
          <div className="card-header">
            <h3>📋 Total Policies</h3>
            <button onClick={onRefresh} className="btn-refresh-small">🔄</button>
          </div>
          <div className="card-value">{data.totalPolicies || 0}</div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>✅ Active Policies</h3>
          </div>
          <div className="card-value">{data.activeCount || 0}</div>
        </div>

        <div className="sales-card">
          <div className="card-header">
            <h3>📂 Categories</h3>
          </div>
          <div className="card-value">{data.categories?.length || 0}</div>
        </div>
      </div>

      <div className="sales-section">
        <h2>📋 All Policies</h2>
        <div className="events-sales-list">
          {data.policies?.map((policy: any) => (
            <div key={policy.id} className="event-sales-item">
              <div className="event-sales-header">
                <h4>{policy.title}</h4>
                <span className={`event-status ${policy.isActive ? 'status-active' : ''}`}>
                  {policy.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Category:</span>
                  <span className="stat-mini-value">{policy.category || 'General'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Version:</span>
                  <span className="stat-mini-value">{policy.version || '1.0'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Created:</span>
                  <span className="stat-mini-value">{new Date(policy.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {policy.content && (
                <div className="policy-preview">
                  {policy.content.substring(0, 200)}{policy.content.length > 200 ? '...' : ''}
                </div>
              )}
            </div>
          ))}
          {(!data.policies || data.policies.length === 0) && (
            <div className="no-stats">No policies created yet</div>
          )}
        </div>
      </div>

      <div className="sales-section">
        <h2>📂 Policy Categories</h2>
        <div className="events-sales-list">
          {data.categories?.map((category: string) => {
            const categoryPolicies = data.policies?.filter((p: any) => p.category === category) || [];
            return (
              <div key={category} className="event-sales-item">
                <div className="event-sales-header">
                  <h4>{category}</h4>
                  <span className="event-status">{categoryPolicies.length} policies</span>
                </div>
              </div>
            );
          })}
          {(!data.categories || data.categories.length === 0) && (
            <div className="no-stats">No categories defined</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Use imported views
const EventsView = EventsManagementView;
const BoothsView = BoothsManagementView;
const UsersView = UsersManagementView;

export default AdminDashboard;

