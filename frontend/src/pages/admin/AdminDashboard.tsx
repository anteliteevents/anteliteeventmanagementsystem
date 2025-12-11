/**
 * Admin Dashboard
 * 
 * Comprehensive interactive admin backend with department views
 */

/**
 * Admin Dashboard Component
 * 
 * Main admin dashboard container with modular view system.
 * Manages data loading and view switching for all admin sections.
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import AuthService, { User } from '../../services/auth.service';
import EventService from '../../services/event.service';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import OverviewView from './components/OverviewView';
import SalesDepartmentView from './components/SalesDepartmentView';
import PaymentsDepartmentView from './components/PaymentsDepartmentView';
import CostingDepartmentView from './components/CostingDepartmentView';
import ProposalsDepartmentView from './components/ProposalsDepartmentView';
import MonitoringDepartmentView from './components/MonitoringDepartmentView';
import PoliciesDepartmentView from './components/PoliciesDepartmentView';
import EventsManagementView from './EventsManagementView';
import BoothsManagementView from './BoothsManagementView';
import UsersManagementView from './UsersManagementView';
import ReportsViewComponent from './ReportsView';
import SettingsViewComponent from './SettingsView';
import { API_TIMEOUTS, DASHBOARD_CONSTANTS } from '../../constants';
import './AdminDashboard.css';
import './AdminDashboard.enhanced.css';
import './shared-components.css';

// Simple cache for data
const dataCache: Record<string, { data: any; timestamp: number }> = {};

const getCachedData = (key: string): any | null => {
  const cached = dataCache[key];
  if (cached && Date.now() - cached.timestamp < DASHBOARD_CONSTANTS.CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any): void => {
  dataCache[key] = { data, timestamp: Date.now() };
};

const clearCachedData = (key?: string): void => {
  if (key) {
    delete dataCache[key];
  } else {
    Object.keys(dataCache).forEach(k => delete dataCache[k]);
  }
};

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('overview');
  const [salesData, setSalesData] = useState<any>(null);
  const [paymentsData, setPaymentsData] = useState<any>(null);
  const [costingData, setCostingData] = useState<any>(null);
  const [proposalsData, setProposalsData] = useState<any>(null);
  const [monitoringData, setMonitoringData] = useState<any>(null);
  const [policiesData, setPoliciesData] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState<boolean>(false);
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
    await loadOverviewData();
  };

  const loadOverviewData = async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    const cacheKey = 'overview-data';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setOverviewData(cached);
        setOverviewLoading(false);
        setLoading(false);
        return;
      }
    } else {
      clearCachedData(cacheKey);
    }

    try {
      setOverviewLoading(true);
      setLoading(true);
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = API_TIMEOUTS.DEFAULT): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
          )
        ]);
      };

      const [eventsRes, healthRes] = await Promise.all([
        withTimeout(api.get('/events'), API_TIMEOUTS.DEFAULT),
        fetch(`${process.env.REACT_APP_API_URL || 'https://anteliteeventssystem.onrender.com'}/health`).catch(() => null)
      ]);

      const events = eventsRes.data?.data || [];
      const health = healthRes ? await healthRes.json().catch(() => ({})) : {};

      const targetEvents = events.slice(0, DASHBOARD_CONSTANTS.MAX_EVENTS_FOR_OVERVIEW);

      const eventStats = await Promise.all(
        targetEvents.map(async (event: any) => {
          const [stats, costSummaryRes, proposalsRes] = await Promise.all([
            withTimeout(EventService.getEventStatistics(event.id), API_TIMEOUTS.EVENT_STATISTICS).catch((err) => {
              console.warn(`Error loading stats for event ${event.id}:`, err);
              return null;
            }),
            withTimeout(api.get(`/costing/summary/event/${event.id}`, { headers }), API_TIMEOUTS.COSTING_SUMMARY).catch((err) => {
              console.warn(`Error loading costing summary for event ${event.id}:`, err);
              return null;
            }),
            withTimeout(api.get(`/proposals/event/${event.id}`, { headers }), API_TIMEOUTS.PROPOSALS).catch((err) => {
              console.warn(`Error loading proposals for event ${event.id}:`, err);
              return null;
            }),
          ]);

          const statistics: any = stats || {};
          const costSummary = costSummaryRes?.data?.data || null;
          const proposals = proposalsRes?.data?.data || [];

          return {
            id: event.id,
            name: event.name,
            revenue: statistics?.totalRevenue || 0,
            totalBooths: statistics?.totalBooths || 0,
            bookedBooths: statistics?.bookedBooths || 0,
            availableBooths: statistics?.availableBooths || 0,
            occupancy:
              statistics?.totalBooths && statistics.totalBooths > 0
                ? Math.round((statistics.bookedBooths / statistics.totalBooths) * 100)
                : 0,
            proposalsCount: proposals.length,
            proposalsApproved: proposals.filter((p: any) => p.status === 'approved').length,
            proposalsRejected: proposals.filter((p: any) => p.status === 'rejected').length,
            budget: costSummary?.totalBudget || 0,
            spent: costSummary?.totalSpent || 0,
          };
        })
      );

      const transactionsRes = await withTimeout(api.get('/payments/transactions', { 
        headers,
        params: { limit: 10, sort: 'createdAt', order: 'desc' }
      }), API_TIMEOUTS.PAYMENTS).catch(() => ({ data: { data: [] } }));
      const invoicesRes = await withTimeout(api.get('/payments/invoices', { 
        headers,
        params: { limit: 10, sort: 'createdAt', order: 'desc' }
      }), API_TIMEOUTS.PAYMENTS).catch(() => ({ data: { data: [] } }));
      const transactions = transactionsRes.data?.data || transactionsRes.data || [];
      const invoices = invoicesRes.data?.data || invoicesRes.data || [];

      const paymentStatusCounts = transactions.reduce((acc: any, t: any) => {
        const status = t.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const invoiceStatusCounts = invoices.reduce((acc: any, i: any) => {
        const status = i.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const totals = {
        totalEvents: events.length,
        activeEvents: events.filter((e: any) => e.status === 'active' || e.status === 'published').length,
        totalRevenue: eventStats.reduce((sum, s) => sum + (s.revenue || 0), 0),
        totalBooths: eventStats.reduce((sum, s) => sum + (s.totalBooths || 0), 0),
        bookedBooths: eventStats.reduce((sum, s) => sum + (s.bookedBooths || 0), 0),
        availableBooths: eventStats.reduce((sum, s) => sum + (s.availableBooths || 0), 0),
        occupancy:
          eventStats.reduce((sum, s) => sum + (s.totalBooths ? (s.bookedBooths / s.totalBooths) * 100 : 0), 0) /
          (eventStats.length || 1),
        proposals: eventStats.reduce((sum, s) => sum + (s.proposalsCount || 0), 0),
        proposalsApproved: eventStats.reduce((sum, s) => sum + (s.proposalsApproved || 0), 0),
        proposalsRejected: eventStats.reduce((sum, s) => sum + (s.proposalsRejected || 0), 0),
        paidInvoices: invoiceStatusCounts['paid'] || 0,
        pendingInvoices: invoiceStatusCounts['pending'] || 0,
        totalInvoices: invoices.length,
        transactions: transactions.length,
        totalBudget: eventStats.reduce((sum, s) => sum + (s.budget || 0), 0),
        totalSpent: eventStats.reduce((sum, s) => sum + (s.spent || 0), 0),
      };

      const overview = {
        health,
        totals,
        revenueByEvent: eventStats.map((s) => ({ name: s.name, revenue: s.revenue })),
        occupancyByEvent: eventStats.map((s) => ({ name: s.name, occupancy: s.occupancy })),
        budgetVsSpent: eventStats.map((s) => ({ name: s.name, budget: s.budget, spent: s.spent })),
        paymentStatus: Object.entries(paymentStatusCounts).map(([name, value]) => ({ name, value })),
        invoiceStatus: Object.entries(invoiceStatusCounts).map(([name, value]) => ({ name, value })),
      };

      setCachedData(cacheKey, overview);
      setOverviewData(overview);
    } catch (error: any) {
      console.error('Error loading overview data:', error);
      setOverviewData(null);
    } finally {
      setOverviewLoading(false);
      setLoading(false);
    }
  };

  const loadSalesData = async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    const cacheKey = 'sales-data';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setSalesData(cached);
        return;
      }
    } else {
      clearCachedData(cacheKey);
    }

    try {
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      // Only fetch active/published events and limit results
      const [eventsRes, boothsRes] = await Promise.all([
        api.get('/events', { 
          headers,
          params: { 
            status: 'active,published',
            limit: DASHBOARD_CONSTANTS.MAX_EVENTS_FOR_SALES 
          } 
        }),
        api.get('/booths', { 
          headers,
          params: { limit: 100 } // Limit booths
        }),
      ]);

      const events = (eventsRes.data?.data || eventsRes.data || []).slice(0, DASHBOARD_CONSTANTS.MAX_EVENTS_FOR_SALES);
      const booths = (boothsRes.data?.data || boothsRes.data || []).slice(0, 100);

      // Only load stats for limited number of events (parallel)
      const eventsWithStats = await Promise.all(
        events.slice(0, DASHBOARD_CONSTANTS.MAX_EVENTS_FOR_SALES).map(async (event: any) => {
          try {
            const stats = await Promise.race([
              EventService.getEventStatistics(event.id),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), API_TIMEOUTS.EVENT_STATISTICS))
            ]).catch(() => null);
            return { event, statistics: stats };
          } catch {
            return { event, statistics: null };
          }
        })
      );

      const totalRevenue = eventsWithStats.reduce(
        (sum, item) => sum + (item.statistics?.totalRevenue || 0),
        0
      );
      const totalBooths = booths.length;
      const bookedBooths = booths.filter((b: any) => b.status === 'booked').length;
      const availableBooths = booths.filter((b: any) => b.status === 'available').length;

      const data = {
        totalRevenue,
        totalBooths,
        bookedBooths,
        availableBooths,
        booths: booths.slice(0, 50), // Limit booths in response
        events: eventsWithStats,
      };

      setCachedData(cacheKey, data);
      setSalesData(data);
    } catch (error: any) {
      console.error('Error loading sales data:', error);
      setSalesData(null);
    }
  };

  const loadPaymentsData = async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    const cacheKey = 'payments-data';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setPaymentsData(cached);
        return;
      }
    } else {
      clearCachedData(cacheKey);
    }

    try {
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      // Limit results with query params
      const [transactionsRes, invoicesRes] = await Promise.all([
        api.get('/payments/transactions', { 
          headers,
          params: { limit: DASHBOARD_CONSTANTS.MAX_TRANSACTIONS, sort: 'createdAt', order: 'desc' }
        }),
        api.get('/payments/invoices', { 
          headers,
          params: { limit: DASHBOARD_CONSTANTS.MAX_INVOICES, sort: 'createdAt', order: 'desc' }
        }),
      ]);

      const transactions = (transactionsRes.data?.data || transactionsRes.data || []).slice(0, DASHBOARD_CONSTANTS.MAX_TRANSACTIONS);
      const invoices = (invoicesRes.data?.data || invoicesRes.data || []).slice(0, DASHBOARD_CONSTANTS.MAX_INVOICES);

      const totalRevenue = transactions
        .filter((t: any) => t.status === 'completed')
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0);

      const completedPayments = transactions.filter((t: any) => t.status === 'completed').length;
      const pendingPayments = transactions.filter((t: any) => t.status === 'pending').length;
      const paidInvoices = invoices.filter((i: any) => i.status === 'paid').length;

      const data = {
        totalRevenue,
        completedPayments,
        pendingPayments,
        totalInvoices: invoices.length,
        paidInvoices,
        totalTransactions: transactions.length,
        transactions,
        invoices,
      };

      setCachedData(cacheKey, data);
      setPaymentsData(data);
    } catch (error: any) {
      console.error('Error loading payments data:', error);
      setPaymentsData(null);
    }
  };

  const loadCostingData = async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    const cacheKey = 'costing-data';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setCostingData(cached);
        return;
      }
    } else {
      clearCachedData(cacheKey);
    }

    try {
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      // Only fetch active/published events and limit results
      const [eventsRes] = await Promise.all([
        api.get('/events', { 
          headers,
          params: { 
            status: 'active,published',
            limit: DASHBOARD_CONSTANTS.MAX_EVENTS_FOR_COSTING 
          } 
        }),
      ]);

      const events = (eventsRes.data?.data || eventsRes.data || []).slice(0, DASHBOARD_CONSTANTS.MAX_EVENTS_FOR_COSTING);

      // Load costing summaries in parallel with timeout
      const eventsWithCosts = await Promise.all(
        events.map(async (event: any) => {
          try {
            const costSummaryRes: any = await Promise.race([
              api.get(`/costing/summary/event/${event.id}`, { headers }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), API_TIMEOUTS.COSTING_SUMMARY))
            ]).catch(() => null);
            const summary = costSummaryRes?.data?.data || null;
            return { event, summary };
          } catch {
            return { event, summary: null };
          }
        })
      );

      const totalBudget = eventsWithCosts.reduce(
        (sum, item) => sum + (item.summary?.totalBudget || 0),
        0
      );
      const totalSpent = eventsWithCosts.reduce(
        (sum, item) => sum + (item.summary?.totalSpent || 0),
        0
      );
      const remaining = totalBudget - totalSpent;

      const data = {
        totalBudget,
        totalSpent,
        remaining,
        eventsWithCosts: eventsWithCosts.filter((item) => item.summary).length,
        events: eventsWithCosts.filter((item) => item.summary), // Only show events with costs
      };

      setCachedData(cacheKey, data);
      setCostingData(data);
    } catch (error: any) {
      console.error('Error loading costing data:', error);
      setCostingData(null);
    }
  };

  const loadProposalsData = async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    const cacheKey = 'proposals-data';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setProposalsData(cached);
        return;
      }
    } else {
      clearCachedData(cacheKey);
    }

    try {
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const [proposalsRes, templatesRes] = await Promise.all([
        api.get('/proposals', { 
          headers,
          params: { limit: DASHBOARD_CONSTANTS.MAX_PROPOSALS, sort: 'createdAt', order: 'desc' }
        }),
        api.get('/proposals/templates', { headers }).catch(() => ({ data: { data: [] } })),
      ]);

      const allProposals = (proposalsRes.data?.data || proposalsRes.data || []).slice(0, DASHBOARD_CONSTANTS.MAX_PROPOSALS);
      const templates = (templatesRes.data?.data || templatesRes.data || []).slice(0, 10); // Limit templates

      const totalProposals = allProposals.length;
      const draftProposals = allProposals.filter((p: any) => p.status === 'draft').length;
      const submittedProposals = allProposals.filter((p: any) => p.status === 'submitted').length;
      const approvedProposals = allProposals.filter((p: any) => p.status === 'approved').length;

      const data = {
        totalProposals,
        draftProposals,
        submittedProposals,
        approvedProposals,
        allProposals,
        templates,
      };

      setCachedData(cacheKey, data);
      setProposalsData(data);
    } catch (error: any) {
      console.error('Error loading proposals data:', error);
      setProposalsData(null);
    }
  };

  const loadMonitoringData = async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    const cacheKey = 'monitoring-data';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setMonitoringData(cached);
        return;
      }
    } else {
      clearCachedData(cacheKey);
    }

    try {
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      // Limit activities to reduce load
      const [activitiesRes] = await Promise.all([
        api.get('/monitoring/activities', { 
          headers,
          params: { limit: DASHBOARD_CONSTANTS.MAX_ACTIVITIES, sort: 'created_at', order: 'desc' }
        }).catch(() => ({ data: { data: [] } })),
      ]);

      const activities = (activitiesRes.data?.data || activitiesRes.data || []).slice(0, DASHBOARD_CONSTANTS.MAX_ACTIVITIES);

      const topPerformers = activities.reduce((acc: any, activity: any) => {
        const userId = activity.user_id;
        if (!userId) return acc;

        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            first_name: activity.first_name || 'Unknown',
            last_name: activity.last_name || 'User',
            activity_count: 0,
          };
        }
        acc[userId].activity_count++;
        return acc;
      }, {});

      const topPerformersList = Object.values(topPerformers)
        .sort((a: any, b: any) => b.activity_count - a.activity_count)
        .slice(0, 10);

      const totalActivities = activities.length;
      const salesBookings = activities.filter((a: any) => a.action_type === 'booth_booking').length;
      const salesRevenue = activities
        .filter((a: any) => a.action_type === 'booth_booking')
        .reduce((sum: number, a: any) => sum + parseFloat(a.amount || 0), 0);

      const data = {
        totalActivities,
        performance: {
          sales: {
            bookings: salesBookings,
            revenue: salesRevenue,
          },
        },
        topPerformers: topPerformersList,
        activities: activities.slice(0, 20),
      };

      setCachedData(cacheKey, data);
      setMonitoringData(data);
    } catch (error: any) {
      console.error('Error loading monitoring data:', error);
      setMonitoringData(null);
    }
  };

  const loadPoliciesData = async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    const cacheKey = 'policies-data';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setPoliciesData(cached);
        return;
      }
    } else {
      clearCachedData(cacheKey);
    }

    try {
      const token = AuthService.getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const [policiesRes] = await Promise.all([
        api.get('/policies', { 
          headers,
          params: { limit: 50 } // Limit policies
        }).catch(() => ({ data: { data: [] } })),
      ]);

      const policies = (policiesRes.data?.data || policiesRes.data || []).slice(0, 50);

      const totalPolicies = policies.length;
      const activeCount = policies.filter((p: any) => p.isActive).length;
      const categories = Array.from(new Set(policies.map((p: any) => p.category || 'General')));

      const data = {
        totalPolicies,
        activeCount,
        categories,
        policies,
      };

      setCachedData(cacheKey, data);
      setPoliciesData(data);
    } catch (error: any) {
      console.error('Error loading policies data:', error);
      setPoliciesData(null);
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
      <button
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        user={user}
        activeView={activeView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="admin-main">
        <AdminHeader activeView={activeView} />

        <div className="admin-content">
          {activeView === 'overview' && (
            <OverviewView
              data={overviewData}
              loading={overviewLoading}
              onRefresh={() => loadOverviewData(true)}
            />
          )}
          {activeView === 'sales' && <SalesDepartmentView data={salesData} onRefresh={() => loadSalesData(true)} />}
          {activeView === 'payments' && <PaymentsDepartmentView data={paymentsData} onRefresh={() => loadPaymentsData(true)} />}
          {activeView === 'costing' && <CostingDepartmentView data={costingData} onRefresh={() => loadCostingData(true)} />}
          {activeView === 'proposals' && <ProposalsDepartmentView data={proposalsData} onRefresh={() => loadProposalsData(true)} />}
          {activeView === 'monitoring' && <MonitoringDepartmentView data={monitoringData} onRefresh={() => loadMonitoringData(true)} />}
          {activeView === 'policies' && <PoliciesDepartmentView data={policiesData} onRefresh={() => loadPoliciesData(true)} />}
          {activeView === 'events' && <EventsManagementView />}
          {activeView === 'booths' && <BoothsManagementView />}
          {activeView === 'users' && <UsersManagementView />}
          {activeView === 'reports' && <ReportsViewComponent />}
          {activeView === 'settings' && <SettingsViewComponent />}
          {/* Placeholder for other views */}
          {!['overview', 'sales', 'events', 'booths', 'users', 'reports', 'payments', 'costing', 'proposals', 'monitoring', 'policies', 'settings'].includes(activeView) && (
            <div className="view-placeholder">
              <h2>Coming Soon!</h2>
              <p>This section is under development. Please check back later.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// All department views have been extracted to separate component files in ./components/
// - OverviewView.tsx
// - SalesDepartmentView.tsx
// - PaymentsDepartmentView.tsx
// - CostingDepartmentView.tsx
// - ProposalsDepartmentView.tsx
// - MonitoringDepartmentView.tsx
// - PoliciesDepartmentView.tsx

export default AdminDashboard;
