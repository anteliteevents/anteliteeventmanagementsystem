/**
 * Overview View Component
 * 
 * Displays comprehensive dashboard overview with KPIs, charts, and statistics.
 * Extracted from AdminDashboard for better code organization.
 * 
 * @component
 */

/**
 * Overview View Component
 * 
 * Displays comprehensive dashboard overview with KPIs, charts, and statistics.
 * Enhanced with modern UI improvements.
 * 
 * @component
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { CHART_COLORS, DASHBOARD_CONSTANTS } from '../../../constants';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import '../../../components/ui/SkeletonLoader.css';

interface OverviewViewProps {
  data: any;
  loading: boolean;
  onRefresh: () => void;
}

const OverviewView: React.FC<OverviewViewProps> = ({ data, loading, onRefresh }) => {
  if (loading || !data) {
    return (
      <div className="overview-view">
        <div className="loading-skeleton">
          <div className="skeleton-header">
            <SkeletonLoader width={200} height={32} />
            <SkeletonLoader width={120} height={32} />
          </div>
          <div className="skeleton-stats">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-stat-card">
                <SkeletonLoader width={60} height={60} variant="circular" />
                <div className="skeleton-stat-content">
                  <SkeletonLoader width={120} height={24} />
                  <SkeletonLoader width={80} height={16} />
                </div>
              </div>
            ))}
          </div>
          <div className="skeleton-charts">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-chart-card">
                <SkeletonLoader width={150} height={24} />
                <SkeletonLoader width="100%" height={260} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totals = data.totals || {};
  const revenueChart = data.revenueByEvent || [];
  const occupancyChart = data.occupancyByEvent || [];
  const paymentStatus = data.paymentStatus || [];
  const budgetVsSpent = data.budgetVsSpent || [];

  return (
    <div className="overview-view advanced-overview">
      <div className="overview-actions">
        <div className="system-status-pill">
          <span className={`status-dot ${data.health?.status === 'ok' ? 'ok' : 'warn'}`} />
          System: {data.health?.status || 'Unknown'}
        </div>
        <button className="btn-secondary" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card kpi">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">${(totals.totalRevenue || 0).toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card kpi">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-label">Events / Active</div>
            <div className="stat-value">
              {totals.totalEvents || 0} / {totals.activeEvents || 0}
            </div>
          </div>
        </div>
        <div className="stat-card kpi">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <div className="stat-label">Booths (Booked / Total)</div>
            <div className="stat-value">
              {totals.bookedBooths || 0} / {totals.totalBooths || 0}
            </div>
            <div className="stat-sub">Occupancy: {Math.round(totals.occupancy || 0)}%</div>
          </div>
        </div>
        <div className="stat-card kpi">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <div className="stat-label">Invoices (Paid / Pending)</div>
            <div className="stat-value">
              {totals.paidInvoices || 0} / {totals.pendingInvoices || 0}
            </div>
            <div className="stat-sub">Total Invoices: {totals.totalInvoices || 0}</div>
          </div>
        </div>
        <div className="stat-card kpi">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <div className="stat-label">Proposals (Approved / Rejected)</div>
            <div className="stat-value">
              {totals.proposalsApproved || 0} / {totals.proposalsRejected || 0}
            </div>
            <div className="stat-sub">Total: {totals.proposals || 0}</div>
          </div>
        </div>
        <div className="stat-card kpi">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Budget vs Spent</div>
            <div className="stat-value">
              ${Math.round(totals.totalSpent || 0).toLocaleString()} / $
              {Math.round(totals.totalBudget || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue by Event</h3>
          </div>
          <ResponsiveContainer width="100%" height={DASHBOARD_CONSTANTS.CHART_HEIGHT}>
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill={CHART_COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Occupancy by Event</h3>
          </div>
          <ResponsiveContainer width="100%" height={DASHBOARD_CONSTANTS.CHART_HEIGHT}>
            <LineChart data={occupancyChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Line type="monotone" dataKey="occupancy" stroke={CHART_COLORS[1]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Payment Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={DASHBOARD_CONSTANTS.CHART_HEIGHT}>
            <PieChart>
              <Pie data={paymentStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                {paymentStatus.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Budget vs Spent (per Event)</h3>
          </div>
          <ResponsiveContainer width="100%" height={DASHBOARD_CONSTANTS.CHART_HEIGHT}>
            <BarChart data={budgetVsSpent}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill={CHART_COLORS[4]} name="Budget" />
              <Bar dataKey="spent" fill={CHART_COLORS[3]} name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;

