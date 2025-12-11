/**
 * Payments Department View Component
 * 
 * Enhanced payments department view with modern UI and skeleton loaders.
 * 
 * @component
 */

import React from 'react';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

interface PaymentsDepartmentViewProps {
  data: any;
  onRefresh: () => void;
}

const PaymentsDepartmentView: React.FC<PaymentsDepartmentViewProps> = ({ data, onRefresh }) => {
  if (!data) {
    return (
      <div className="payments-view enhanced-view">
        <div className="loading-skeleton">
          <div className="skeleton-stats">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-stat-card">
                <SkeletonLoader width={60} height={60} variant="circular" />
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
    <div className="payments-view enhanced-view">
      <div className="sales-overview">
        <div className="sales-card revenue-card enhanced-card">
          <div className="card-header">
            <h3>💳 Total Revenue</h3>
            <button onClick={onRefresh} className="btn-refresh-small" aria-label="Refresh data">
              🔄
            </button>
          </div>
          <div className="card-value">${data.totalRevenue?.toLocaleString() || '0'}</div>
          <div className="card-footer">From all transactions</div>
        </div>

        <div className="sales-card enhanced-card">
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

        <div className="sales-card enhanced-card">
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

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📊 Total Transactions</h3>
          </div>
          <div className="card-value">{data.totalTransactions || 0}</div>
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>💳 Recent Transactions</h2>
        <div className="events-sales-list">
          {data.transactions?.slice(0, 10).map((transaction: any) => (
            <div key={transaction.id} className="event-sales-item enhanced-item">
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

      <div className="sales-section enhanced-section">
        <h2>📄 Recent Invoices</h2>
        <div className="events-sales-list">
          {data.invoices?.slice(0, 10).map((invoice: any) => (
            <div key={invoice.id} className="event-sales-item enhanced-item">
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

export default PaymentsDepartmentView;

